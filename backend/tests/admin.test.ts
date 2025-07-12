import request from 'supertest';
import app from '../src/app.ts';
import {
  registerUser,
  loginUser,
  authHeader,
  promoteToAdmin,
  createQuestion,
} from './utils.ts';
import { Question } from '../src/models/Question.ts';
import { Answer } from '../src/models/Answer.ts';
import { User } from '../src/models/User.ts';

describe('Admin routes', () => {
  it('bans, unbans users and deletes content', async () => {
    // create admin
    await registerUser('root', 'root@example.com');
    await promoteToAdmin('root@example.com');
    const loginAdmin = await loginUser('root@example.com');
    const adminToken = loginAdmin.body.token as string;

    // create normal user
    const reg = await registerUser('bob', 'bob@example.com');
    const bobId: string = reg.body.user._id;
    const bobLogin = await loginUser('bob@example.com');
    const bobToken = bobLogin.body.token as string;

    // admin bans bob
    await request(app)
      .patch(`/api/admin/users/${bobId}/ban`)
      .set(authHeader(adminToken))
      .expect(200);
    const banned = await User.findById(bobId).lean();
    expect(banned?.banned).toBe(true);

    // admin unbans bob
    await request(app)
      .patch(`/api/admin/users/${bobId}/unban`)
      .set(authHeader(adminToken))
      .expect(200);
    const unbanned = await User.findById(bobId).lean();
    expect(unbanned?.banned).toBe(false);

    // bob creates question & answer
    const qRes = await createQuestion(bobToken);
    const qid: string = qRes.body.question._id;

    const aRes = await request(app)
      .post(`/api/questions/${qid}/answers`)
      .set(authHeader(bobToken))
      .send({ body: 'answer content' })
      .expect(201);
    const aid: string = aRes.body.answer._id;

    // admin deletes answer
    await request(app)
      .delete(`/api/admin/answers/${aid}`)
      .set(authHeader(adminToken))
      .expect(204);
    const deletedAnswer = await Answer.findById(aid).lean();
    expect(deletedAnswer).toBeNull();

    // admin deletes question (marks deleted)
    await request(app)
      .delete(`/api/admin/questions/${qid}`)
      .set(authHeader(adminToken))
      .expect(204);
    const deletedQuestion = await Question.findById(qid).lean();
    expect(deletedQuestion?.status).toBe('deleted');
  });
});
