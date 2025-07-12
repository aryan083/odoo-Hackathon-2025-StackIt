import request from 'supertest';
import app from '../src/app.ts';
import { registerUser, loginUser, authHeader } from './utils.ts';
import { Question } from '../src/models/Question.ts';

describe('Questions routes', () => {
  it('creates a question then lists it', async () => {
    // register & login to get token
    await registerUser('alice', 'alice@ex.com');
    const loginRes = await loginUser('alice@ex.com');
    const token = loginRes.body.token as string;

    // create question
    const createRes = await request(app)
      .post('/api/questions')
      .set(authHeader(token))
      .send({ title: 'Test question', body: 'Some body content here', tags: ['tag1', 'tag2'] });
    console.log('CREATE_RES', createRes.status, createRes.body);
    expect(createRes.status).toBe(201);

    expect(createRes.body.question.title).toBe('Test question');

    // list questions
    const listRes = await request(app).get('/api/questions').expect(200);
    expect(listRes.body.items.length).toBe(1);
    expect(listRes.body.items[0].title).toBe('Test question');

    // DB check
    const count = await Question.countDocuments();
    expect(count).toBe(1);
  });
});
