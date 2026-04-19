/**
 * Test factory for quest state
 */
export function createTestQuest(overrides = {}) {
  return {
    id: 'quest_test',
    title: 'Test Quest',
    description: 'A test quest',
    zone: 'medina',
    status: 'available',
    objectives: [],
    rewards: {
      xp: 50,
      dirhams: 10,
    },
    prerequisites: [],
    ...overrides,
  };
}
