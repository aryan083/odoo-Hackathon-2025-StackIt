import request from 'supertest';
import app from '../src/app.ts';
import { registerUser, loginUser, authHeader, createQuestion } from './utils.ts';
import { Answer } from '../src/models/Answer.ts';

describe('Answers routes', () => {
  it('creates, updates, votes and accepts an answer', async () => {
    // User A registers and creates a question
    await registerUser('asker', 'asker@example.com');
    const loginAsker = await loginUser('asker@example.com');
    const askerToken = loginAsker.body.token as string;

    const qRes = await createQuestion(askerToken, {
      title: 'How to test answers?',
      body: 'Need guidance on testing answer routes with Jest',
      tags: ['jest', 'testing'],
    });
    const qid: string = qRes.body.question._id;

    // User B registers and posts an answer
    await registerUser('helper', 'helper@example.com');
    const loginHelper = await loginUser('helper@example.com');
    const helperToken = loginHelper.body.token as string;

    const aRes = await request(app)
      .post(`/api/questions/${qid}/answers`)
      .set(authHeader(helperToken))
      .send({ body: 'Here is an answer for you' })
      .expect(201);
    const aid: string = aRes.body.answer._id;

    // Helper updates their answer
    await request(app)
      .put(`/api/questions/${qid}/answers/${aid}`)
      .set(authHeader(helperToken))
      .send({ body: 'Updated answer body' })
      .expect(200);

    // Asker upvotes the answer
    await request(app)
      .post(`/api/questions/${qid}/answers/${aid}/vote`)
      .set(authHeader(askerToken))
      .send({ vote: 1 })
      .expect(200);

    const voted = await Answer.findById(aid).lean();
    expect(voted?.votes.length).toBe(1);
    expect(voted?.votes[0].value).toBe(1);

    // Asker accepts the answer
    await request(app)
      .post(`/api/questions/${qid}/answers/${aid}/accept`)
      .set(authHeader(askerToken))
      .expect(200);

    const accepted = await Answer.findById(aid).lean();
    expect(accepted?.isAccepted).toBe(true);
  });
});
