import { Router } from 'express';
import { Types } from 'mongoose';
import { requireAuth, requireRole, RequestWithUser } from '../middleware/auth.ts';
import { User, UserRole } from '../models/User.ts';
import { Question } from '../models/Question.ts';
import { Answer } from '../models/Answer.ts';

const router = Router();

// all routes protected + admin-only
router.use(requireAuth(), requireRole(UserRole.ADMIN));

/* ------------------- User management ------------------- */
router.patch('/users/:userId/ban', async (req, res) => {
  const { userId } = req.params;
  if (!Types.ObjectId.isValid(userId)) return res.status(400).json({ message: 'Bad id' });

  const user = await User.findByIdAndUpdate(userId, { banned: true }, { new: true });
  if (!user) return res.status(404).json({ message: 'Not found' });
  res.json({ user });
});

router.patch('/users/:userId/unban', async (req, res) => {
  const { userId } = req.params;
  if (!Types.ObjectId.isValid(userId)) return res.status(400).json({ message: 'Bad id' });

  const user = await User.findByIdAndUpdate(userId, { banned: false }, { new: true });
  if (!user) return res.status(404).json({ message: 'Not found' });
  res.json({ user });
});

/* ------------------- Content moderation ------------------- */
router.delete('/questions/:questionId', async (req, res) => {
  const { questionId } = req.params;
  if (!Types.ObjectId.isValid(questionId)) return res.status(400).json({ message: 'Bad id' });

  const q = await Question.findById(questionId);
  if (!q) return res.status(404).json({ message: 'Not found' });

  q.status = 'deleted';
  await q.save();
  res.status(204).end();
});

router.delete('/answers/:answerId', async (req, res) => {
  const { answerId } = req.params;
  if (!Types.ObjectId.isValid(answerId)) return res.status(400).json({ message: 'Bad id' });

  const answer = await Answer.findById(answerId);
  if (!answer) return res.status(404).json({ message: 'Not found' });

  await answer.deleteOne();
  res.status(204).end();
});

export default router;
