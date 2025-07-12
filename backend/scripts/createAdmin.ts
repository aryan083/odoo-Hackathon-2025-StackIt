#!/usr/bin/env ts-node
// scripts/createAdmin.ts
// Creates an ADMIN user if none exists (or updates existing user to ADMIN).

import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../src/config/db.ts';
import { User, UserRole } from '../src/models/User.ts';

dotenv.config();

const run = async (): Promise<void> => {
  const username = process.env.ADMIN_USERNAME ?? 'admin';
  const email = process.env.ADMIN_EMAIL ?? 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD ?? 'pass1234';

  await connectDB();

  let admin = await User.findOne({ email });
  if (!admin) {
    admin = await User.create({ username, email, password, role: UserRole.ADMIN });
    console.log(`✅ Created new admin user → ${email}`);
  } else if (admin.role !== UserRole.ADMIN) {
    admin.role = UserRole.ADMIN;
    await admin.save();
    console.log(`🔄 Updated existing user ${email} to ADMIN role.`);
  } else {
    console.log(`ℹ️  Admin user already exists → ${email}`);
  }

  console.log('Done.');
  await disconnectDB();
};

run().catch((err) => {
  console.error('Failed to seed admin:', err);
  process.exit(1);
});
