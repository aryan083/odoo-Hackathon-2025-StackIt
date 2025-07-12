import { Router } from 'express';
import Joi from 'joi';
import { Types } from 'mongoose';
import { requireAuth, RequestWithUser } from '../middleware/auth.ts';
import { validate } from '../middleware/validate.ts';
import { Notification } from '../models/Notification.ts';
import { emitToUser } from '../utils/Socket.ts';

const router = Router();

/* ----------------------------- Schemas ----------------------------- */
const listSchema = Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(50).default(20),
});

/* ------------------------------ Routes ----------------------------- */
// GET /api/notifications – list notifications for current user
type ListQuery = { page?: string; limit?: string };
router.get<{}, any, any, ListQuery>('/', requireAuth(), validate({ query: listSchema }), async (req, res) => {
  const { id: userId } = (req as RequestWithUser).user;
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);

  const query = Notification.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const [items, total, unread] = await Promise.all([
    query.lean(),
    Notification.countDocuments({ user: userId }),
    Notification.countDocuments({ user: userId, read: false }),
  ]);

  res.json({ page, limit, total, unread, items });
});

// PATCH /api/notifications/:id/read – mark a notification read
router.patch('/:id/read', requireAuth(), async (req, res) => {
  const { id: userId } = (req as RequestWithUser).user;
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Bad id' });

  const n = await Notification.findOneAndUpdate(
    { _id: id, user: userId },
    { read: true },
    { new: true },
  );

  if (!n) return res.status(404).json({ message: 'Not found' });

  emitToUser(userId, 'notification:read', { id: n._id });
  res.json({ ok: true });
});

// PATCH /api/notifications/read-all – mark all read
router.patch('/read-all', requireAuth(), async (req, res) => {
  const { id: userId } = (req as RequestWithUser).user;
  await Notification.updateMany({ user: userId, read: false }, { read: true });
  emitToUser(userId, 'notification:readAll', {});
  res.json({ ok: true });
});

export default router;
