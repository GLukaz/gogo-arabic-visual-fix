#!/usr/bin/env python3
"""
Create 6 head covering spritesheets (512x512, 4x4 grid of 128x128 frames).
Each covering is drawn as pixel art positioned where the character's head would be.

Head coverings:
1. kufi       — Small rounded Islamic cap
2. ghutra     — Draped headscarf with agal (Gulf style)
3. turban     — Wrapped cloth turban
4. hijab      — Head/neck covering (smooth draping)
5. hood       — Pointed cloak hood
6. none       — Empty (transparent, no covering)

Output: public/assets/sprites/player/heads/<covering-name>.png
"""

from PIL import Image, ImageDraw
import os

PROJECT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC_SPRITE = os.path.join(PROJECT, 'public/assets/sprites/npcs/player.png')
OUT_DIR = os.path.join(PROJECT, 'public/assets/sprites/player/heads')
CELL = 128

# ---- Head position data per frame ----
# Extracted from analyzing player.png: where the head center and top are
# Format: (center_x, top_y, head_width, head_height)
# Row 0 = down, Row 1 = left, Row 2 = right, Row 3 = up

# The head region spans roughly from the top of the sprite to y=44
# Head center X varies by direction, head bounces up/down with walk cycle
HEAD_POS = {
    # (cx, top_y) — center X of head, top Y of sprite content
    # Even frames: standing tall, Odd frames: walking (shifted down ~4px)
    (0, 0): (66, 4),   # down f0
    (0, 1): (66, 8),   # down f1
    (0, 2): (66, 4),   # down f2
    (0, 3): (66, 8),   # down f3
    (1, 0): (62, 8),   # left f0
    (1, 1): (62, 12),  # left f1
    (1, 2): (62, 8),   # left f2
    (1, 3): (62, 12),  # left f3
    (2, 0): (66, 8),   # right f0
    (2, 1): (66, 12),  # right f1
    (2, 2): (66, 8),   # right f2
    (2, 3): (66, 12),  # right f3
    (3, 0): (66, 4),   # up f0
    (3, 1): (66, 8),   # up f1
    (3, 2): (66, 4),   # up f2
    (3, 3): (66, 8),   # up f3
}

# Direction names for reference
DIR_NAMES = {0: 'down', 1: 'left', 2: 'right', 3: 'up'}


def draw_pixel_block(draw, x, y, w, h, color):
    """Draw a filled rectangle (pixel block)."""
    draw.rectangle([x, y, x + w - 1, y + h - 1], fill=color)


def draw_outline_block(draw, x, y, w, h, outline_color, fill_color):
    """Draw a filled rectangle with outline."""
    # Outline
    draw.rectangle([x, y, x + w - 1, y + h - 1], fill=outline_color)
    # Fill (inset by 1px on each side for outline effect, but at pixel scale use 2px)
    if w > 4 and h > 4:
        draw.rectangle([x + 2, y + 2, x + w - 3, y + h - 3], fill=fill_color)


def draw_kufi(draw, cx, top_y, direction):
    """
    Kufi — small rounded Islamic cap.
    A short, flat-topped cap that sits on the crown of the head.
    """
    # Colors
    white = (240, 235, 225, 255)
    cream = (220, 210, 195, 255)
    shadow = (190, 180, 165, 255)
    outline = (60, 50, 40, 255)

    # Cap dimensions (in pixels)
    cap_w = 28
    cap_h = 16

    if direction == 'down':  # Front view
        x = cx - cap_w // 2
        y = top_y
        # Outline
        draw_pixel_block(draw, x + 4, y, cap_w - 8, 2, outline)  # Top edge
        draw_pixel_block(draw, x + 2, y + 2, 2, 2, outline)
        draw_pixel_block(draw, x + cap_w - 4, y + 2, 2, 2, outline)
        draw_pixel_block(draw, x, y + 4, 2, cap_h - 6, outline)  # Left edge
        draw_pixel_block(draw, x + cap_w - 2, y + 4, 2, cap_h - 6, outline)  # Right edge
        draw_pixel_block(draw, x, y + cap_h - 2, cap_w, 2, outline)  # Bottom edge
        # Fill
        draw_pixel_block(draw, x + 4, y + 2, cap_w - 8, 2, white)
        draw_pixel_block(draw, x + 2, y + 4, cap_w - 4, cap_h - 8, white)
        # Shadow at bottom
        draw_pixel_block(draw, x + 2, y + cap_h - 4, cap_w - 4, 2, shadow)
        # Decorative band
        draw_pixel_block(draw, x + 2, y + cap_h - 6, cap_w - 4, 2, cream)

    elif direction == 'left':  # Left side view
        x = cx - cap_w // 2 + 2
        y = top_y
        narrow_w = cap_w - 8
        draw_pixel_block(draw, x + 2, y, narrow_w - 4, 2, outline)
        draw_pixel_block(draw, x, y + 2, 2, cap_h - 4, outline)
        draw_pixel_block(draw, x + narrow_w - 2, y + 2, 2, cap_h - 4, outline)
        draw_pixel_block(draw, x, y + cap_h - 2, narrow_w, 2, outline)
        draw_pixel_block(draw, x + 2, y + 2, narrow_w - 4, cap_h - 4, white)
        draw_pixel_block(draw, x + 2, y + cap_h - 4, narrow_w - 4, 2, shadow)

    elif direction == 'right':  # Right side view
        x = cx - cap_w // 2 - 2
        y = top_y
        narrow_w = cap_w - 8
        draw_pixel_block(draw, x + 2, y, narrow_w - 4, 2, outline)
        draw_pixel_block(draw, x, y + 2, 2, cap_h - 4, outline)
        draw_pixel_block(draw, x + narrow_w - 2, y + 2, 2, cap_h - 4, outline)
        draw_pixel_block(draw, x, y + cap_h - 2, narrow_w, 2, outline)
        draw_pixel_block(draw, x + 2, y + 2, narrow_w - 4, cap_h - 4, white)
        draw_pixel_block(draw, x + 2, y + cap_h - 4, narrow_w - 4, 2, shadow)

    elif direction == 'up':  # Back view
        x = cx - cap_w // 2
        y = top_y
        draw_pixel_block(draw, x + 4, y, cap_w - 8, 2, outline)
        draw_pixel_block(draw, x + 2, y + 2, 2, 2, outline)
        draw_pixel_block(draw, x + cap_w - 4, y + 2, 2, 2, outline)
        draw_pixel_block(draw, x, y + 4, 2, cap_h - 6, outline)
        draw_pixel_block(draw, x + cap_w - 2, y + 4, 2, cap_h - 6, outline)
        draw_pixel_block(draw, x, y + cap_h - 2, cap_w, 2, outline)
        draw_pixel_block(draw, x + 4, y + 2, cap_w - 8, 2, cream)
        draw_pixel_block(draw, x + 2, y + 4, cap_w - 4, cap_h - 8, cream)
        draw_pixel_block(draw, x + 2, y + cap_h - 4, cap_w - 4, 2, shadow)

    # Neck/chin area — a solid block below the cap to cover the face
    neck_h = 24
    neck_w = 24
    neck_x = cx - neck_w // 2
    neck_y = top_y + cap_h
    # Skin-colored block (will be tinted by Phaser)
    skin = (210, 170, 130, 255)
    skin_shadow = (180, 140, 100, 255)
    draw_pixel_block(draw, neck_x, neck_y, neck_w, neck_h, skin)
    draw_pixel_block(draw, neck_x, neck_y + neck_h - 4, neck_w, 4, skin_shadow)
    draw_pixel_block(draw, neck_x - 2, neck_y, 2, neck_h, outline)
    draw_pixel_block(draw, neck_x + neck_w, neck_y, 2, neck_h, outline)


def draw_ghutra(draw, cx, top_y, direction):
    """
    Ghutra — Traditional Gulf-style headscarf with agal (black cord).
    A large square cloth draped over the head, held by a black ring.
    Falls down over the shoulders.
    """
    white = (240, 235, 225, 255)
    cream = (225, 215, 200, 255)
    shadow = (200, 190, 175, 255)
    agal_black = (40, 35, 30, 255)
    outline = (60, 50, 40, 255)
    skin = (210, 170, 130, 255)

    head_w = 32

    if direction == 'down':
        x = cx - head_w // 2
        y = top_y
        # Main cloth drape — wider than head, falls to shoulders
        drape_w = 40
        drape_h = 44
        dx = cx - drape_w // 2
        # Top of cloth (rounded)
        draw_pixel_block(draw, dx + 6, y, drape_w - 12, 2, outline)
        draw_pixel_block(draw, dx + 2, y + 2, 4, 2, outline)
        draw_pixel_block(draw, dx + drape_w - 6, y + 2, 4, 2, outline)
        # Sides
        draw_pixel_block(draw, dx, y + 4, 2, drape_h - 6, outline)
        draw_pixel_block(draw, dx + drape_w - 2, y + 4, 2, drape_h - 6, outline)
        # Bottom (draping)
        draw_pixel_block(draw, dx, y + drape_h - 2, 8, 2, outline)
        draw_pixel_block(draw, dx + drape_w - 8, y + drape_h - 2, 8, 2, outline)
        # Fill
        draw_pixel_block(draw, dx + 6, y + 2, drape_w - 12, 2, white)
        draw_pixel_block(draw, dx + 2, y + 4, drape_w - 4, drape_h - 8, white)
        # Shadow on sides
        draw_pixel_block(draw, dx + 2, y + 4, 4, drape_h - 8, shadow)
        draw_pixel_block(draw, dx + drape_w - 6, y + 4, 4, drape_h - 8, shadow)
        # Agal (black cord ring) — horizontal band
        draw_pixel_block(draw, dx + 4, y + 10, drape_w - 8, 4, agal_black)
        # Chin area (minimal skin showing)
        draw_pixel_block(draw, cx - 8, y + 28, 16, 8, skin)

    elif direction == 'left':
        x = cx - 12
        y = top_y
        drape_w = 28
        drape_h = 44
        # Profile view — cloth drapes to back
        draw_pixel_block(draw, x + 4, y, drape_w - 8, 2, outline)
        draw_pixel_block(draw, x, y + 2, 2, drape_h - 4, outline)
        draw_pixel_block(draw, x + drape_w - 2, y + 2, 2, 20, outline)
        draw_pixel_block(draw, x + 2, y + 2, drape_w - 4, drape_h - 4, white)
        draw_pixel_block(draw, x + drape_w - 6, y + 2, 4, drape_h - 4, shadow)
        # Back drape
        draw_pixel_block(draw, x + drape_w - 2, y + 20, 8, 24, white)
        draw_pixel_block(draw, x + drape_w + 4, y + 20, 2, 24, outline)
        draw_pixel_block(draw, x + drape_w - 2, y + 42, 8, 2, outline)
        # Agal
        draw_pixel_block(draw, x + 2, y + 10, drape_w - 4, 4, agal_black)
        # Bottom
        draw_pixel_block(draw, x, y + drape_h - 2, drape_w - 4, 2, outline)

    elif direction == 'right':
        x = cx - 16
        y = top_y
        drape_w = 28
        drape_h = 44
        draw_pixel_block(draw, x + 4, y, drape_w - 8, 2, outline)
        draw_pixel_block(draw, x, y + 2, 2, 20, outline)
        draw_pixel_block(draw, x + drape_w - 2, y + 2, 2, drape_h - 4, outline)
        draw_pixel_block(draw, x + 2, y + 2, drape_w - 4, drape_h - 4, white)
        draw_pixel_block(draw, x + 2, y + 2, 4, drape_h - 4, shadow)
        # Back drape
        draw_pixel_block(draw, x - 8, y + 20, 10, 24, white)
        draw_pixel_block(draw, x - 8, y + 20, 2, 24, outline)
        draw_pixel_block(draw, x - 8, y + 42, 10, 2, outline)
        # Agal
        draw_pixel_block(draw, x + 2, y + 10, drape_w - 4, 4, agal_black)
        draw_pixel_block(draw, x, y + drape_h - 2, drape_w, 2, outline)

    elif direction == 'up':
        x = cx - 20
        y = top_y
        drape_w = 40
        drape_h = 44
        dx = cx - drape_w // 2
        draw_pixel_block(draw, dx + 6, y, drape_w - 12, 2, outline)
        draw_pixel_block(draw, dx + 2, y + 2, 4, 2, outline)
        draw_pixel_block(draw, dx + drape_w - 6, y + 2, 4, 2, outline)
        draw_pixel_block(draw, dx, y + 4, 2, drape_h - 6, outline)
        draw_pixel_block(draw, dx + drape_w - 2, y + 4, 2, drape_h - 6, outline)
        draw_pixel_block(draw, dx, y + drape_h - 2, drape_w, 2, outline)
        draw_pixel_block(draw, dx + 2, y + 2, drape_w - 4, drape_h - 4, cream)
        draw_pixel_block(draw, dx + 4, y + 10, drape_w - 8, 4, agal_black)
        # Back drape visible
        draw_pixel_block(draw, dx + 6, y + drape_h - 8, drape_w - 12, 6, shadow)


def draw_turban(draw, cx, top_y, direction):
    """
    Turban — Wrapped cloth creating a tall rounded head covering.
    Multiple layers of wrapped fabric.
    """
    main = (240, 235, 225, 255)
    wrap_light = (230, 225, 215, 255)
    wrap_dark = (200, 190, 175, 255)
    shadow = (170, 160, 145, 255)
    outline = (60, 50, 40, 255)
    skin = (210, 170, 130, 255)

    if direction == 'down':
        # Tall wrapped shape
        w, h = 32, 32
        x = cx - w // 2
        y = top_y - 4  # Turban sits taller
        # Outline
        draw_pixel_block(draw, x + 6, y, w - 12, 2, outline)
        draw_pixel_block(draw, x + 2, y + 2, 4, 4, outline)
        draw_pixel_block(draw, x + w - 6, y + 2, 4, 4, outline)
        draw_pixel_block(draw, x, y + 6, 2, h - 8, outline)
        draw_pixel_block(draw, x + w - 2, y + 6, 2, h - 8, outline)
        draw_pixel_block(draw, x + 2, y + h - 2, w - 4, 2, outline)
        # Fill with wrap lines
        draw_pixel_block(draw, x + 2, y + 2, w - 4, h - 4, main)
        # Horizontal wrap lines
        for wy in range(y + 6, y + h - 4, 6):
            draw_pixel_block(draw, x + 2, wy, w - 4, 2, wrap_dark)
        # Center fold
        draw_pixel_block(draw, cx - 2, y + 4, 4, h - 8, wrap_light)
        # Shadow at bottom
        draw_pixel_block(draw, x + 2, y + h - 4, w - 4, 2, shadow)
        # Neck below turban
        neck_y = y + h
        draw_pixel_block(draw, cx - 10, neck_y, 20, 16, skin)
        draw_pixel_block(draw, cx - 12, neck_y, 2, 16, outline)
        draw_pixel_block(draw, cx + 10, neck_y, 2, 16, outline)

    elif direction == 'left':
        w, h = 24, 32
        x = cx - w // 2 + 2
        y = top_y - 4
        draw_pixel_block(draw, x + 4, y, w - 8, 2, outline)
        draw_pixel_block(draw, x, y + 2, 2, h - 4, outline)
        draw_pixel_block(draw, x + w - 2, y + 2, 2, h - 4, outline)
        draw_pixel_block(draw, x, y + h - 2, w, 2, outline)
        draw_pixel_block(draw, x + 2, y + 2, w - 4, h - 4, main)
        for wy in range(y + 6, y + h - 4, 6):
            draw_pixel_block(draw, x + 2, wy, w - 4, 2, wrap_dark)
        draw_pixel_block(draw, x + 2, y + h - 4, w - 4, 2, shadow)
        neck_y = y + h
        draw_pixel_block(draw, cx - 8, neck_y, 16, 16, skin)

    elif direction == 'right':
        w, h = 24, 32
        x = cx - w // 2 - 2
        y = top_y - 4
        draw_pixel_block(draw, x + 4, y, w - 8, 2, outline)
        draw_pixel_block(draw, x, y + 2, 2, h - 4, outline)
        draw_pixel_block(draw, x + w - 2, y + 2, 2, h - 4, outline)
        draw_pixel_block(draw, x, y + h - 2, w, 2, outline)
        draw_pixel_block(draw, x + 2, y + 2, w - 4, h - 4, main)
        for wy in range(y + 6, y + h - 4, 6):
            draw_pixel_block(draw, x + 2, wy, w - 4, 2, wrap_dark)
        draw_pixel_block(draw, x + w - 6, y + 2, 4, h - 4, shadow)
        neck_y = y + h
        draw_pixel_block(draw, cx - 8, neck_y, 16, 16, skin)

    elif direction == 'up':
        w, h = 32, 32
        x = cx - w // 2
        y = top_y - 4
        draw_pixel_block(draw, x + 6, y, w - 12, 2, outline)
        draw_pixel_block(draw, x + 2, y + 2, 4, 4, outline)
        draw_pixel_block(draw, x + w - 6, y + 2, 4, 4, outline)
        draw_pixel_block(draw, x, y + 6, 2, h - 8, outline)
        draw_pixel_block(draw, x + w - 2, y + 6, 2, h - 8, outline)
        draw_pixel_block(draw, x + 2, y + h - 2, w - 4, 2, outline)
        draw_pixel_block(draw, x + 2, y + 2, w - 4, h - 4, wrap_dark)
        for wy in range(y + 6, y + h - 4, 6):
            draw_pixel_block(draw, x + 2, wy, w - 4, 2, main)
        draw_pixel_block(draw, cx - 2, y + 4, 4, h - 8, wrap_light)


def draw_hijab(draw, cx, top_y, direction):
    """
    Hijab — Smooth fabric covering head and neck, draping over shoulders.
    """
    main = (100, 70, 130, 255)       # Soft purple
    light = (130, 100, 160, 255)
    shadow = (70, 45, 95, 255)
    outline = (40, 25, 55, 255)
    skin = (210, 170, 130, 255)

    if direction == 'down':
        w, h = 36, 40
        x = cx - w // 2
        y = top_y
        # Smooth rounded top
        draw_pixel_block(draw, x + 8, y, w - 16, 2, outline)
        draw_pixel_block(draw, x + 4, y + 2, 4, 2, outline)
        draw_pixel_block(draw, x + w - 8, y + 2, 4, 2, outline)
        draw_pixel_block(draw, x + 2, y + 4, 2, 4, outline)
        draw_pixel_block(draw, x + w - 4, y + 4, 2, 4, outline)
        # Sides widening as it drapes
        draw_pixel_block(draw, x, y + 8, 2, h - 10, outline)
        draw_pixel_block(draw, x + w - 2, y + 8, 2, h - 10, outline)
        # Bottom (wider drape over shoulders)
        draw_pixel_block(draw, x - 4, y + h - 8, 4, 8, outline)
        draw_pixel_block(draw, x + w, y + h - 8, 4, 8, outline)
        draw_pixel_block(draw, x - 4, y + h - 2, w + 8, 2, outline)
        # Fill
        draw_pixel_block(draw, x + 8, y + 2, w - 16, 2, main)
        draw_pixel_block(draw, x + 4, y + 4, w - 8, 4, main)
        draw_pixel_block(draw, x + 2, y + 8, w - 4, h - 12, main)
        draw_pixel_block(draw, x - 2, y + h - 8, w + 4, 6, main)
        # Highlight
        draw_pixel_block(draw, x + 8, y + 4, w - 16, 4, light)
        # Shadow
        draw_pixel_block(draw, x + 2, y + h - 14, 4, 8, shadow)
        draw_pixel_block(draw, x + w - 6, y + h - 14, 4, 8, shadow)
        # Face opening (small oval)
        draw_pixel_block(draw, cx - 8, y + 18, 16, 16, skin)

    elif direction == 'left':
        w, h = 28, 40
        x = cx - w // 2 + 4
        y = top_y
        draw_pixel_block(draw, x + 4, y, w - 8, 2, outline)
        draw_pixel_block(draw, x, y + 2, 2, h - 4, outline)
        draw_pixel_block(draw, x + w - 2, y + 2, 2, h - 4, outline)
        draw_pixel_block(draw, x, y + h - 2, w + 4, 2, outline)
        draw_pixel_block(draw, x + 2, y + 2, w - 4, h - 4, main)
        draw_pixel_block(draw, x + 2, y + 4, w - 8, 4, light)
        draw_pixel_block(draw, x + w - 6, y + 2, 4, h - 4, shadow)
        # Drape extension
        draw_pixel_block(draw, x + w, y + h - 12, 6, 10, main)
        draw_pixel_block(draw, x + w + 4, y + h - 12, 2, 10, outline)

    elif direction == 'right':
        w, h = 28, 40
        x = cx - w // 2 - 4
        y = top_y
        draw_pixel_block(draw, x + 4, y, w - 8, 2, outline)
        draw_pixel_block(draw, x, y + 2, 2, h - 4, outline)
        draw_pixel_block(draw, x + w - 2, y + 2, 2, h - 4, outline)
        draw_pixel_block(draw, x - 4, y + h - 2, w + 4, 2, outline)
        draw_pixel_block(draw, x + 2, y + 2, w - 4, h - 4, main)
        draw_pixel_block(draw, x + 2, y + 4, w - 8, 4, light)
        draw_pixel_block(draw, x + 2, y + 2, 4, h - 4, shadow)
        # Drape extension
        draw_pixel_block(draw, x - 6, y + h - 12, 8, 10, main)
        draw_pixel_block(draw, x - 6, y + h - 12, 2, 10, outline)

    elif direction == 'up':
        w, h = 36, 40
        x = cx - w // 2
        y = top_y
        draw_pixel_block(draw, x + 8, y, w - 16, 2, outline)
        draw_pixel_block(draw, x + 4, y + 2, 4, 2, outline)
        draw_pixel_block(draw, x + w - 8, y + 2, 4, 2, outline)
        draw_pixel_block(draw, x, y + 4, 2, h - 6, outline)
        draw_pixel_block(draw, x + w - 2, y + 4, 2, h - 6, outline)
        draw_pixel_block(draw, x - 4, y + h - 8, 4, 8, outline)
        draw_pixel_block(draw, x + w, y + h - 8, 4, 8, outline)
        draw_pixel_block(draw, x - 4, y + h - 2, w + 8, 2, outline)
        draw_pixel_block(draw, x + 2, y + 2, w - 4, h - 4, shadow)
        draw_pixel_block(draw, x + 4, y + 4, w - 8, h - 12, main)
        draw_pixel_block(draw, x - 2, y + h - 8, w + 4, 6, shadow)


def draw_hood(draw, cx, top_y, direction):
    """
    Hood — Pointed cloak hood.
    """
    main = (120, 100, 75, 255)       # Brown leather
    light = (150, 130, 100, 255)
    shadow = (85, 70, 50, 255)
    outline = (50, 40, 30, 255)
    skin = (210, 170, 130, 255)

    if direction == 'down':
        # Pointed top, widens at shoulders
        w = 36
        y = top_y - 2
        x = cx - w // 2
        # Point at top
        draw_pixel_block(draw, cx - 2, y, 4, 2, outline)
        draw_pixel_block(draw, cx - 4, y + 2, 2, 2, outline)
        draw_pixel_block(draw, cx + 2, y + 2, 2, 2, outline)
        # Expanding sides
        draw_pixel_block(draw, cx - 6, y + 4, 2, 2, outline)
        draw_pixel_block(draw, cx + 4, y + 4, 2, 2, outline)
        draw_pixel_block(draw, cx - 8, y + 6, 2, 4, outline)
        draw_pixel_block(draw, cx + 6, y + 6, 2, 4, outline)
        draw_pixel_block(draw, x + 4, y + 10, 2, 4, outline)
        draw_pixel_block(draw, x + w - 6, y + 10, 2, 4, outline)
        draw_pixel_block(draw, x + 2, y + 14, 2, 28, outline)
        draw_pixel_block(draw, x + w - 4, y + 14, 2, 28, outline)
        # Bottom
        draw_pixel_block(draw, x, y + 40, w, 4, outline)
        # Fill
        draw_pixel_block(draw, cx - 2, y + 2, 4, 2, main)
        draw_pixel_block(draw, cx - 4, y + 4, 8, 2, main)
        draw_pixel_block(draw, cx - 6, y + 6, 12, 4, main)
        draw_pixel_block(draw, x + 6, y + 10, w - 12, 4, main)
        draw_pixel_block(draw, x + 4, y + 14, w - 8, 26, main)
        # Highlight
        draw_pixel_block(draw, cx - 4, y + 4, 8, 6, light)
        # Shadow
        draw_pixel_block(draw, x + 4, y + 32, w - 8, 6, shadow)
        # Face opening
        draw_pixel_block(draw, cx - 8, y + 20, 16, 14, skin)

    elif direction == 'left':
        y = top_y - 2
        x = cx - 8
        w, h = 24, 44
        draw_pixel_block(draw, x + 8, y, 4, 2, outline)
        draw_pixel_block(draw, x + 4, y + 2, 4, 4, outline)
        draw_pixel_block(draw, x, y + 6, 2, h - 8, outline)
        draw_pixel_block(draw, x + w - 2, y + 6, 2, h - 8, outline)
        draw_pixel_block(draw, x, y + h - 2, w, 2, outline)
        draw_pixel_block(draw, x + 2, y + 4, w - 4, h - 6, main)
        draw_pixel_block(draw, x + 6, y + 2, 8, 4, main)
        draw_pixel_block(draw, x + w - 6, y + 4, 4, h - 8, shadow)

    elif direction == 'right':
        y = top_y - 2
        x = cx - 16
        w, h = 24, 44
        draw_pixel_block(draw, x + 12, y, 4, 2, outline)
        draw_pixel_block(draw, x + 16, y + 2, 4, 4, outline)
        draw_pixel_block(draw, x, y + 6, 2, h - 8, outline)
        draw_pixel_block(draw, x + w - 2, y + 6, 2, h - 8, outline)
        draw_pixel_block(draw, x, y + h - 2, w, 2, outline)
        draw_pixel_block(draw, x + 2, y + 4, w - 4, h - 6, main)
        draw_pixel_block(draw, x + 10, y + 2, 8, 4, main)
        draw_pixel_block(draw, x + 2, y + 4, 4, h - 8, shadow)

    elif direction == 'up':
        w = 36
        y = top_y - 2
        x = cx - w // 2
        # Back of hood — tall pointed
        draw_pixel_block(draw, cx - 2, y, 4, 2, outline)
        draw_pixel_block(draw, cx - 6, y + 2, 12, 2, outline)
        draw_pixel_block(draw, x + 4, y + 4, w - 8, 2, outline)
        draw_pixel_block(draw, x + 2, y + 6, 2, 34, outline)
        draw_pixel_block(draw, x + w - 4, y + 6, 2, 34, outline)
        draw_pixel_block(draw, x, y + 38, w, 4, outline)
        draw_pixel_block(draw, x + 4, y + 4, w - 8, 34, shadow)
        draw_pixel_block(draw, x + 6, y + 6, w - 12, 28, main)
        # Center seam
        draw_pixel_block(draw, cx - 1, y + 4, 2, 30, shadow)


def draw_none(draw, cx, top_y, direction):
    """None — No head covering. Just a plain head shape (will be covered by skin tint)."""
    skin = (210, 170, 130, 255)
    skin_shadow = (180, 140, 100, 255)
    outline = (60, 50, 40, 255)

    head_w = 28
    head_h = 28

    if direction == 'down':
        x = cx - head_w // 2
        y = top_y + 4
        # Round head shape
        draw_pixel_block(draw, x + 6, y, head_w - 12, 2, outline)
        draw_pixel_block(draw, x + 2, y + 2, 4, 2, outline)
        draw_pixel_block(draw, x + head_w - 6, y + 2, 4, 2, outline)
        draw_pixel_block(draw, x, y + 4, 2, head_h - 6, outline)
        draw_pixel_block(draw, x + head_w - 2, y + 4, 2, head_h - 6, outline)
        draw_pixel_block(draw, x + 2, y + head_h - 2, head_w - 4, 2, outline)
        # Fill with skin
        draw_pixel_block(draw, x + 6, y + 2, head_w - 12, 2, skin)
        draw_pixel_block(draw, x + 2, y + 4, head_w - 4, head_h - 8, skin)
        draw_pixel_block(draw, x + 2, y + head_h - 4, head_w - 4, 2, skin_shadow)
        # Neck
        draw_pixel_block(draw, cx - 8, y + head_h, 16, 12, skin)
        draw_pixel_block(draw, cx - 8, y + head_h + 8, 16, 4, skin_shadow)

    elif direction in ('left', 'right'):
        x = cx - head_w // 2 + (2 if direction == 'left' else -2)
        y = top_y + 4
        nw = head_w - 4
        draw_pixel_block(draw, x + 4, y, nw - 8, 2, outline)
        draw_pixel_block(draw, x, y + 2, 2, head_h - 4, outline)
        draw_pixel_block(draw, x + nw - 2, y + 2, 2, head_h - 4, outline)
        draw_pixel_block(draw, x, y + head_h - 2, nw, 2, outline)
        draw_pixel_block(draw, x + 2, y + 2, nw - 4, head_h - 4, skin)
        draw_pixel_block(draw, cx - 6, y + head_h, 12, 12, skin)

    elif direction == 'up':
        x = cx - head_w // 2
        y = top_y + 4
        draw_pixel_block(draw, x + 6, y, head_w - 12, 2, outline)
        draw_pixel_block(draw, x + 2, y + 2, 4, 2, outline)
        draw_pixel_block(draw, x + head_w - 6, y + 2, 4, 2, outline)
        draw_pixel_block(draw, x, y + 4, 2, head_h - 6, outline)
        draw_pixel_block(draw, x + head_w - 2, y + 4, 2, head_h - 6, outline)
        draw_pixel_block(draw, x + 2, y + head_h - 2, head_w - 4, 2, outline)
        draw_pixel_block(draw, x + 2, y + 2, head_w - 4, head_h - 4, skin_shadow)
        draw_pixel_block(draw, x + 4, y + 4, head_w - 8, head_h - 8, skin)


# ---- Drawing functions map ----
COVERINGS = {
    'kufi': draw_kufi,
    'ghutra': draw_ghutra,
    'turban': draw_turban,
    'hijab': draw_hijab,
    'hood': draw_hood,
    'none': draw_none,
}


def create_head_sprite(covering_name, draw_func):
    """Create a 512x512 head covering spritesheet."""
    img = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    for row in range(4):
        for col in range(4):
            cx_offset, top_y_offset = HEAD_POS[(row, col)]
            # Convert to absolute position in the full sheet
            abs_cx = col * CELL + cx_offset
            abs_top_y = row * CELL + top_y_offset

            direction = DIR_NAMES[row]
            draw_func(draw, abs_cx, abs_top_y, direction)

    return img


def main():
    os.makedirs(OUT_DIR, exist_ok=True)

    for name, func in COVERINGS.items():
        print(f"  Creating head covering: {name}...")
        img = create_head_sprite(name, func)
        out_path = os.path.join(OUT_DIR, f'{name}.png')
        img.save(out_path)
        print(f"    -> {out_path}")

    print(f"\nDone! Created {len(COVERINGS)} head covering spritesheets in {OUT_DIR}")


if __name__ == '__main__':
    main()
