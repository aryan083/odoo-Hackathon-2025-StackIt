/**
 * /api/auth – register & login
 * --------------------------------------------------
 * POST /register  ➜  create user, return { token, user }
 * POST /login     ➜  verify credentials, return { token, user }
 */
import { Router } from 'express';
import Joi from 'joi';
import { validate } from '../middleware/validate.ts';
import { User, UserRole } from '../models/User.ts';

const router = Router();

/* ---------- Joi Schemas ---------- */
const registerSchema = Joi.object({
  username: Joi.string().trim().min(3).max(32).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

/* ---------- Handlers ---------- */
router.post(
  '/register',
  validate({ body: registerSchema }),
  async (req, res): Promise<void> => {
    const { username, email, password } = req.body;

    // duplicate check
    if (await User.exists({ $or: [{ username }, { email }] })) {
      res.status(409).json({ message: 'Username or email already taken' });
      return;
    }

    const user = await User.create({ username, email, password, role: UserRole.USER });
    const token = user.generateJWT();

    res.status(201).json({ token, user: user.toObject({ getters: true, virtuals: false }) });
  }
);

router.post(
  '/login',
  validate({ body: loginSchema }),
  async (req, res): Promise<void> => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = user.generateJWT();
    res.json({ token, user: user.toObject({ getters: true, virtuals: false }) });
  }
);

export default router;