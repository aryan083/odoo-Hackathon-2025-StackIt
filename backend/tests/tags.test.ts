import request from 'supertest';
import app from '../src/app.ts';
import { registerUser, loginUser, authHeader } from './utils.ts';

describe('Tags route', () => {
  it('returns popular tags with counts', async () => {
    // seed a question with tags
    await registerUser('bob2', 'bob2@ex.com');
    const loginRes = await loginUser('bob2@ex.com');
    const token = loginRes.body.token as string;

    await request(app)
      .post('/api/questions')
      .set(authHeader(token))
      .send({ title: 'Another Q', body: 'Body content here for validation', tags: ['js', 'node'] })
      .expect(201);

    const tagRes = await request(app).get('/api/tags').expect(200);
    expect(tagRes.body.tags.length).toBeGreaterThanOrEqual(2);
    const jsTag = tagRes.body.tags.find((t: any) => t.name === 'js');
    expect(jsTag?.count).toBe(1);
  });
});
