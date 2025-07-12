#!/usr/bin/env ts-node
/**
 * scripts/seedDummyData.ts
 * --------------------------------------------------
 * Populates the MongoDB database with sample data for
 * quick local testing of the StackIt platform.
 *
 * Usage:
 *   npm run seed:dummy  (see package.json)
 * or
 *   node --loader ts-node/esm ./scripts/seedDummyData.ts
 * --------------------------------------------------
 */

import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../src/config/db.ts';
import { User, UserRole } from '../src/models/User.ts';
import { Question } from '../src/models/Question.ts';
import { Answer } from '../src/models/Answer.ts';
import { Notification } from '../src/models/Notification.ts';

dotenv.config();

const run = async (): Promise<void> => {
  /* 1️⃣  Connect & purge */
  await connectDB();
  console.log('\n🚧 Clearing old collections ...');
  await Promise.all([
    User.deleteMany({}),
    Question.deleteMany({}),
    Answer.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  /* 2️⃣  Users */
  console.log('👤  Seeding users ...');
  const [admin, alice, bob] = await User.create([
    {
      username: 'admin',
      email: 'admin@example.com',
      password: 'password',
      role: UserRole.ADMIN,
    },
    {
      username: 'alice',
      email: 'alice@example.com',
      password: 'password',
    },
    {
      username: 'bob',
      email: 'bob@example.com',
      password: 'password',
    },
  ]);

  /* 3️⃣  Questions */
  console.log('❓  Seeding questions ...');
  const questions = await Question.create([
    {
      title: 'How do I get started with React?',
      body: '<p>I am new to React. What is the best way to learn?</p>',
      tags: ['react', 'javascript', 'frontend'],
      author: alice._id,
    },
    {
      title: 'What is JWT and how does it work?',
      body: '<p>Could someone explain JSON Web Tokens in simple terms?</p>',
      tags: ['jwt', 'authentication', 'security'],
      author: bob._id,
    },
    {
      title: 'MongoDB aggregation framework basics',
      body: '<p>How does the <code>aggregate</code> function work in MongoDB?</p>',
      tags: ['mongodb', 'database'],
      author: alice._id,
    },
  ]);

  /* 4️⃣  Answers */
  console.log('💬  Seeding answers ...');
  const answerDocs = await Answer.create([
    {
      body: '<p>You can start with <strong>create-react-app</strong> or Vite.</p>',
      question: questions[0]._id,
      author: bob._id,
      votes: [{ user: admin._id, value: 1 }],
      isAccepted: false,
    },
    {
      body: '<p>JWT stands for <em>JSON Web Token</em>. It is a compact way to securely transmit information.</p>',
      question: questions[1]._id,
      author: alice._id,
      votes: [
        { user: admin._id, value: 1 },
        { user: bob._id, value: 1 },
      ],
      isAccepted: false,
    },
    {
      body: '<p>The aggregation pipeline processes documents in stages.</p>',
      question: questions[2]._id,
      author: admin._id,
      votes: [],
      isAccepted: false,
    },
  ]);

  /* 5️⃣  Accept an answer for the first question */
  questions[0].acceptedAnswers = [answerDocs[0]._id];
  await questions[0].save();
  await Answer.updateOne({ _id: answerDocs[0]._id }, { isAccepted: true });

  /* 6️⃣  Notifications */
  console.log('🔔  Seeding notifications ...');
  await Notification.create([
    {
      user: alice._id,
      type: 'ANSWER',
      payload: { questionId: questions[0]._id, answerId: answerDocs[0]._id },
    },
    {
      user: bob._id,
      type: 'ADMIN',
      payload: { message: 'Welcome to the platform!' },
    },
  ]);

  console.log('\n✅  Dummy data inserted successfully.');
  await disconnectDB();
};

run().catch((err) => {
  console.error('❌  Failed to seed dummy data:', err);
  process.exit(1);
});
