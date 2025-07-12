import request from 'supertest';
import app from '../src/app.ts';
import { User } from '../src/models/User.ts';

const base = '/api/auth';

describe('Auth routes', () => {
  it('registers a user then logs in', async () => {
    const registerRes = await request(app)
      .post(`${base}/register`)
      .send({ username: 'bob', email: 'bob@ex.com', password: 'pass1234' });
    console.log('REGISTER_RES', registerRes.status, registerRes.body);
    expect(registerRes.status).toBe(201);

    expect(registerRes.body.user.username).toBe('bob');

    const loginRes = await request(app)
      .post(`${base}/login`)
      .send({ email: 'bob@ex.com', password: 'pass1234' })
      .expect(200);

    expect(loginRes.body.token).toBeDefined();
    const users = await User.find();
    expect(users.length).toBe(1);
  });
});
