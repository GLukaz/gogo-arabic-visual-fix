import { useSelector, useDispatch } from 'react-redux';
import { SKILL_TREES } from '../../data/skillTrees.js';
import {
  unlockNode,
  selectUnlockedNodes,
  selectSkillXP,
  selectNodeAvailability,
} from '../../store/slices/skillTreeSlice.js';
import styles from './SkillTreeView.module.css';

/**
 * SkillTreeView — Renders a single skill tree as a vertical list of nodes.
 *
 * Node visual states:
 *   unlocked  — gold border, full opacity, checkmark badge
 *   available — white border, full opacity, clickable (player has XP + prereqs met)
 *   frontier  — gold pulsing border, next 1-2 reachable nodes
 *   locked    — grey border, dimmed, non-interactive (deep-locked collapsed into summary)
 *
 * @param {Object}   props
 * @param {string}   props.treeId  - Which tree to render (e.g. 'reading')
 */
export default function SkillTreeView({ treeId }) {
  const dispatch = useDispatch();

  const tree = SKILL_TREES[treeId];
  const _unlockedNodes = useSelector(selectUnlockedNodes(treeId));
  const currentXP = useSelector(selectSkillXP(treeId));
  const availability = useSelector(selectNodeAvailability(treeId));

  if (!tree) {
    return (
      <div className={styles.error}>
        Unknown skill tree: {treeId}
      </div>
    );
  }

  // ── XP progress toward next unlockable node ──────────────────────────────
  const nextUnlockableNode = tree.nodes
    .filter(n => availability[n.id] !== 'unlocked')
    .sort((a, b) => a.xpCost - b.xpCost)[0];

  const xpProgress = nextUnlockableNode
    ? Math.min(100, Math.round((currentXP / nextUnlockableNode.xpCost) * 100))
    : 100;

  // ── Frontier nodes: next 1-2 reachable (all prereqs unlocked, not yet unlocked) ─
  const frontierNodeIds = new Set(
    tree.nodes
      .filter(n => {
        const status = availability[n.id];
        if (status === 'unlocked') return false;
        // Frontier = all prereqs are unlocked
        return n.prerequisites.length === 0 || n.prerequisites.every(pid => availability[pid] === 'unlocked');
      })
      .slice(0, 2)
      .map(n => n.id)
  );

  // ── Visible vs collapsed nodes ───────────────────────────────────────────
  const visibleNodes = tree.nodes.filter(n => {
    const status = availability[n.id];
    return status === 'unlocked' || status === 'available' || frontierNodeIds.has(n.id);
  });

  const collapsedCount = tree.nodes.length - visibleNodes.length;

  const handleNodeClick = (node) => {
    if (availability[node.id] === 'available') {
      dispatch(unlockNode({ treeId, nodeId: node.id }));
    }
  };

  const getNodeClass = (nodeId) => {
    const state = availability[nodeId];
    if (state === 'unlocked') return `${styles.node} ${styles.unlocked}`;
    if (frontierNodeIds.has(nodeId)) return `${styles.node} ${styles.available} ${styles.frontier}`;
    if (state === 'available') return `${styles.node} ${styles.available}`;
    return `${styles.node} ${styles.locked}`;
  };

  const getRewardLabel = (rewards) => {
    if (!rewards) return null;
    switch (rewards.type) {
      case 'badge':            return `Badge: ${rewards.value}`;
      case 'xp_bonus':         return `+${rewards.value} XP`;
      case 'unlock_content':   return 'Unlocks content';
      case 'title':            return `Title: ${rewards.value}`;
      case 'unlock_spell':     return 'Unlocks spell';
      case 'unlock_dialogue':  return 'Unlocks dialogue';
      case 'unlock_zone':      return 'Unlocks zone';
      case 'unlock_npc_branch': return 'Unlocks NPC branch';
      default:                 return null;
    }
  };

  return (
    <div className={styles.container}>
      {/* XP progress bar toward next unlockable node */}
      <div className={styles.xpBar}>
        <span className={styles.xpLabel}>Skill XP</span>
        <div className={styles.xpBarTrack}>
          <div
            className={styles.xpBarFill}
            style={{ width: `${xpProgress}%`, background: tree.color }}
          />
        </div>
        <span className={styles.xpValue}>
          {currentXP} / {nextUnlockableNode?.xpCost ?? 'MAX'} XP
        </span>
      </div>

      {/* Node list — visible nodes only (unlocked + available + frontier) */}
      <ul className={styles.nodeList} role="list">
        {visibleNodes.map((node, index) => {
          const state = availability[node.id];
          const isClickable = state === 'available';
          const isUnlocked = state === 'unlocked';
          const rewardLabel = getRewardLabel(node.rewards);
          const _originalIndex = tree.nodes.indexOf(node);

          return (
            <li key={node.id} className={styles.nodeRow}>
              {/* Connector line (not shown for first node in list) */}
              {index > 0 && (
                <div
                  className={`${styles.connector} ${
                    isUnlocked ? styles.connectorUnlocked : ''
                  }`}
                  aria-hidden="true"
                />
              )}

              <button
                className={getNodeClass(node.id)}
                onClick={() => handleNodeClick(node)}
                disabled={!isClickable && !isUnlocked}
                aria-label={`${node.name} — ${state}${state === 'available' ? `, costs ${node.xpCost} XP` : ''}`}
                aria-pressed={isUnlocked}
              >
                {/* Status badge */}
                <span className={styles.statusBadge} aria-hidden="true">
                  {isUnlocked ? '✓' : state === 'available' ? '◆' : '○'}
                </span>

                {/* Main content */}
                <div className={styles.nodeContent}>
                  <div className={styles.nodeHeader}>
                    <span className={styles.nodeName}>{node.name}</span>
                    <span className={styles.nodeNameArabic} lang="ar">
                      {node.nameArabic}
                    </span>
                  </div>

                  <p className={styles.nodeDescription}>{node.description}</p>

                  <div className={styles.nodeMeta}>
                    <span className={styles.cefr}>{node.cefrLevel}</span>

                    {!isUnlocked && (
                      <span className={styles.xpCost}>
                        {node.xpCost} XP
                      </span>
                    )}

                    {rewardLabel && (
                      <span className={styles.reward}>{rewardLabel}</span>
                    )}
                  </div>

                  {/* Prerequisites indicator */}
                  {node.prerequisites.length > 0 && state === 'locked' && (
                    <div className={styles.prereqNote} aria-live="polite">
                      Requires:{' '}
                      {node.prerequisites.map((prereqId) => {
                        const prereqNode = tree.nodes.find((n) => n.id === prereqId);
                        return prereqNode ? prereqNode.name : prereqId;
                      }).join(', ')}
                    </div>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Collapsed deep-locked nodes summary */}
      {collapsedCount > 0 && (
        <div className={styles.collapsedLocked}>
          {collapsedCount} more node{collapsedCount !== 1 ? 's' : ''} locked
        </div>
      )}
    </div>
  );
}
