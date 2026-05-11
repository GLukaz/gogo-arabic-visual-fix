/**
 * Seed database with initial data.
 * Run: node scripts/seed-db.js
 */

import 'dotenv/config';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gogo-arabic';

async function main() {
  await mongoose.connect(MONGODB_URI);

  // For now, just verify connection.
  // Users, cards, and quests are created at runtime.

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
