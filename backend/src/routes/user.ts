/**
 * /api/users – profile endpoints
 * --------------------------------------------------
 *  GET  /me               ➜ current user
 *  PUT  /me               ➜ update own profile
 *  GET  /:userId          ➜ public info of another user
 */
import { Router } from 'express';
import Joi from 'joi';
import { Types } from 'mongoose';
import { requireAuth, RequestWithUser } from '../middleware/auth.ts';
import { validate } from '../middleware/validate.ts';
import { User } from '../models/User.ts';

const router = Router();

/* ---------- Joi Schemas ---------- */
const updateMeSchema = Joi.object({
  username: Joi.string().trim().min(3).max(32),
  email: Joi.string().email()
}).min(1);

/* ---------- Routes ---------- */
router.get('/me', requireAuth(), (req, res) => {
  res.json({ user: (req as RequestWithUser).user });
});

router.put(
  '/me',
  requireAuth(),
  validate({ body: updateMeSchema }),
  async (req, res): Promise<void> => {
    const current = (req as RequestWithUser).user;

    if (req.body.username && req.body.username !== current.username) {
      if (await User.exists({ username: req.body.username }))
        res.status(409).json({ message: 'Username already taken' });
      return;
    }
    if (req.body.email && req.body.email !== current.email) {
      if (await User.exists({ email: req.body.email }))
        res.status(409).json({ message: 'Email already taken' });
        return;
    }

    Object.assign(current, req.body);
    await current.save();

    res.json({ user: current });
  }
);

router.get('/:userId', requireAuth(), async (req, res) => {
  const { userId } = req.params;
  if (!Types.ObjectId.isValid(userId)) return res.status(400).json({ message: 'Bad id' });

  const user = await User.findById(userId).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json({ user });
});

export default router;