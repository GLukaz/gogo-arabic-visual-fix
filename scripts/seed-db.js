/**
 * Seed database with initial data.
 * Run: node scripts/seed-db.js
 */

import 'dotenv/config';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gogo-arabic';

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  // For now, just verify connection.
  // Users, cards, and quests are created at runtime.
  console.log('Database ready. No seed data required — all data is created at runtime.');

  await mongoose.disconnect();
  console.log('Done');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
