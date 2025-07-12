import request from 'supertest';
import app from '../src/app.ts';
import { registerUser, loginUser, authHeader } from './utils.ts';
import { Notification } from '../src/models/Notification.ts';

describe('Notifications routes', () => {
  it('lists notifications and marks them read', async () => {
    await registerUser('notified', 'notify@example.com');
    const loginRes = await loginUser('notify@example.com');
    const token = loginRes.body.token as string;
    const userId = loginRes.body.user._id as string;

    // seed notifications
    const n1 = await Notification.create({ user: userId, type: 'ADMIN', payload: { msg: 'hi' } });
    const n2 = await Notification.create({ user: userId, type: 'ANSWER', payload: { q: 1 } });

    // list
    const listRes = await request(app)
      .get('/api/notifications?page=1&limit=10')
      .set(authHeader(token))
      .expect(200);
    expect(listRes.body.total).toBe(2);
    expect(listRes.body.unread).toBe(2);

    // mark first read
    await request(app)
      .patch(`/api/notifications/${n1._id}/read`)
      .set(authHeader(token))
      .expect(200);

    const afterOne = await Notification.findById(n1._id).lean();
    expect(afterOne?.read).toBe(true);

    // mark all read
    await request(app)
      .patch('/api/notifications/read-all')
      .set(authHeader(token))
      .expect(200);

    const unread = await Notification.countDocuments({ user: userId, read: false });
    expect(unread).toBe(0);
  });
});
