/**
 * WritingCanvas.jsx
 *
 * HTML5 Canvas for Arabic letter/word tracing practice.
 * Supports touch + mouse via Pointer Events, ghost templates,
 * smooth quadratic curve rendering, and grid-based IoU validation.
 *
 * Phase 83 — Arabic Writing Practice (WRITE-01 + WRITE-02)
 */

import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import styles from './WritingCanvas.module.css';

// ─── Grid-based IoU Validation ────────────────────────────────────────────────

const GRID_SIZE = 8;

/**
 * Mark which NxN grid cells a set of points pass through.
 * Points are in normalized 0-1 coords.
 * Returns a Set of "row,col" strings.
 */
function pointsToGridCells(points) {
  const cells = new Set();
  for (const pt of points) {
    const col = Math.min(GRID_SIZE - 1, Math.floor(pt.x * GRID_SIZE));
    const row = Math.min(GRID_SIZE - 1, Math.floor(pt.y * GRID_SIZE));
    cells.add(`${row},${col}`);
  }
  return cells;
}

/**
 * Interpolate between points to get denser coverage.
 * Helps when strokes are drawn quickly with few sampled points.
 */
function interpolatePoints(points, density = 4) {
  if (points.length < 2) return points;
  const result = [];
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    for (let t = 0; t < density; t++) {
      const frac = t / density;
      result.push({ x: a.x + (b.x - a.x) * frac, y: a.y + (b.y - a.y) * frac });
    }
  }
  result.push(points[points.length - 1]);
  return result;
}

/**
 * Compute IoU score between template grid cells and player grid cells.
 * Returns 0-100 percentage.
 */
export function computeIoU(templatePoints, playerPoints) {
  if (templatePoints.length === 0 || playerPoints.length === 0) return 0;

  const templateCells = pointsToGridCells(interpolatePoints(templatePoints));
  const playerCells = pointsToGridCells(interpolatePoints(playerPoints));

  let intersection = 0;
  for (const cell of templateCells) {
    if (playerCells.has(cell)) intersection++;
  }

  const unionSize = new Set([...templateCells, ...playerCells]).size;
  if (unionSize === 0) return 0;
  return Math.round((intersection / unionSize) * 100);
}

// ─── Canvas Drawing Helpers ───────────────────────────────────────────────────

function drawSmoothLine(ctx, points, color, lineWidth) {
  if (points.length < 2) return;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  if (points.length === 2) {
    ctx.lineTo(points[1].x, points[1].y);
  } else {
    // Quadratic curves for smoothness
    for (let i = 1; i < points.length - 1; i++) {
      const midX = (points[i].x + points[i + 1].x) / 2;
      const midY = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
    }
    // Last segment
    const last = points[points.length - 1];
    ctx.lineTo(last.x, last.y);
  }

  ctx.stroke();
  ctx.restore();
}

function drawDot(ctx, x, y, radius, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// ─── Component ────────────────────────────────────────────────────────────────

function WritingCanvas({
  templateStrokes = [],
  templateDots = [],
  size = 400,
  onScoreComputed,
  ghostColor = 'rgba(255, 215, 0, 0.2)',
  strokeColor = '#FFD700',
  bgColor = '#1a1a2e',
}) {
  const canvasRef = useRef(null);
  const [strokes, setStrokes] = useState([]); // Array of stroke arrays (each stroke = array of {x,y})
  const [currentStroke, setCurrentStroke] = useState(null);
  const isDrawing = useRef(false);

  // Flatten all template stroke points for validation (normalized coords)
  const templatePoints = useMemo(() => {
    return templateStrokes.flatMap((stroke) => stroke.points || []);
  }, [templateStrokes]);

  // ─── Redraw ───────────────────────────────────────────────────────────

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Clear
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);

    // Draw baseline guide (faint horizontal line)
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(0, h * 0.6);
    ctx.lineTo(w, h * 0.6);
    ctx.stroke();
    // Center vertical guide
    ctx.beginPath();
    ctx.moveTo(w * 0.5, 0);
    ctx.lineTo(w * 0.5, h);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Draw ghost template strokes
    for (const stroke of templateStrokes) {
      if (!stroke.points || stroke.points.length === 0) continue;
      const canvasPts = stroke.points.map((p) => ({ x: p.x * w, y: p.y * h }));
      drawSmoothLine(ctx, canvasPts, ghostColor, 14);
    }

    // Draw ghost template dots
    for (const dot of templateDots) {
      const cx = dot.x * w;
      const cy = dot.y * h;
      const dotRadius = 4;
      if (dot.count === 1) {
        drawDot(ctx, cx, cy, dotRadius, ghostColor);
      } else if (dot.count === 2) {
        drawDot(ctx, cx - 6, cy, dotRadius, ghostColor);
        drawDot(ctx, cx + 6, cy, dotRadius, ghostColor);
      } else if (dot.count === 3) {
        drawDot(ctx, cx, cy - 6, dotRadius, ghostColor);
        drawDot(ctx, cx - 6, cy + 4, dotRadius, ghostColor);
        drawDot(ctx, cx + 6, cy + 4, dotRadius, ghostColor);
      }
    }

    // Draw completed strokes
    for (const stroke of strokes) {
      drawSmoothLine(ctx, stroke, strokeColor, 3);
    }

    // Draw current stroke in progress
    if (currentStroke && currentStroke.length > 0) {
      drawSmoothLine(ctx, currentStroke, strokeColor, 3);
    }
  }, [strokes, currentStroke, templateStrokes, templateDots, ghostColor, strokeColor, bgColor, size]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  // ─── Pointer Handlers ─────────────────────────────────────────────────

  const getCanvasPoint = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  const handlePointerDown = useCallback((e) => {
    e.preventDefault();
    isDrawing.current = true;
    const pt = getCanvasPoint(e);
    if (pt) setCurrentStroke([pt]);
  }, [getCanvasPoint]);

  const handlePointerMove = useCallback((e) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    const pt = getCanvasPoint(e);
    if (pt) {
      setCurrentStroke((prev) => (prev ? [...prev, pt] : [pt]));
    }
  }, [getCanvasPoint]);

  const handlePointerUp = useCallback((e) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    isDrawing.current = false;
    if (currentStroke && currentStroke.length > 1) {
      setStrokes((prev) => [...prev, currentStroke]);
    }
    setCurrentStroke(null);
  }, [currentStroke]);

  const handlePointerLeave = useCallback(() => {
    if (isDrawing.current && currentStroke && currentStroke.length > 1) {
      setStrokes((prev) => [...prev, currentStroke]);
    }
    isDrawing.current = false;
    setCurrentStroke(null);
  }, [currentStroke]);

  // ─── Actions ──────────────────────────────────────────────────────────

  const handleClear = useCallback(() => {
    setStrokes([]);
    setCurrentStroke(null);
  }, []);

  const handleUndo = useCallback(() => {
    setStrokes((prev) => prev.slice(0, -1));
  }, []);

  const handleCheck = useCallback(() => {
    if (templatePoints.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;

    // Convert player strokes to normalized coordinates
    const playerNormalized = strokes.flatMap((stroke) =>
      stroke.map((pt) => ({ x: pt.x / w, y: pt.y / h }))
    );

    const score = computeIoU(templatePoints, playerNormalized);
    if (onScoreComputed) onScoreComputed(score);
  }, [strokes, templatePoints, onScoreComputed]);

  return (
    <div className={styles.container}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className={styles.canvas}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        style={{ touchAction: 'none' }}
        data-testid="writing-canvas"
      />
      <div className={styles.controls}>
        <button
          className={styles.btn}
          onClick={handleUndo}
          disabled={strokes.length === 0}
          data-testid="undo-btn"
        >
          Undo
        </button>
        <button
          className={styles.btn}
          onClick={handleClear}
          disabled={strokes.length === 0 && !currentStroke}
          data-testid="clear-btn"
        >
          Clear
        </button>
        <button
          className={`${styles.btn} ${styles.checkBtn}`}
          onClick={handleCheck}
          disabled={strokes.length === 0}
          data-testid="check-btn"
        >
          Check
        </button>
      </div>
    </div>
  );
}

export default WritingCanvas;
