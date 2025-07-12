import request from 'supertest';
import app from '../src/app.ts';
import { registerUser, loginUser, authHeader } from './utils.ts';
import { User } from '../src/models/User.ts';

describe('User profile routes', () => {
  it('fetches current profile and updates username', async () => {
    await registerUser('alice', 'alice@example.com');
    const loginRes = await loginUser('alice@example.com');
    const token = loginRes.body.token as string;

    const meRes = await request(app)
      .get('/api/users/me')
      .set(authHeader(token))
      .expect(200);
    expect(meRes.body.user.username).toBe('alice');

    await request(app)
      .put('/api/users/me')
      .set(authHeader(token))
      .send({ username: 'alice2' })
      .expect(200);

    const updated = await User.findOne({ email: 'alice@example.com' }).lean();
    expect(updated?.username).toBe('alice2');
  });
});
