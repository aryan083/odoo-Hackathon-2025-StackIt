/**
 * /api/questions – CRUD + list
 */
import { Router } from 'express';
import Joi from 'joi';
import { Types } from 'mongoose';
import { requireAuth, RequestWithUser } from '../middleware/auth.ts';
import { validate } from '../middleware/validate.ts';
import { Question } from '../models/Question.ts';

const router = Router();

/* -------------------- Joi Schemas -------------------- */
const createSchema = Joi.object({
  title: Joi.string().min(5).max(120).required(),
  body: Joi.string().min(10).required(),
  tags: Joi.array().items(Joi.string().trim().min(1)).max(5)
});

const updateSchema = Joi.object({
  title: Joi.string().min(5).max(120),
  body: Joi.string().min(10),
  tags: Joi.array().items(Joi.string().trim().min(1)).max(5)
}).min(1);

const voteSchema = Joi.object({ vote: Joi.number().valid(1, -1).required() });

/* -------------------- Helpers -------------------- */
const isOwner = (userId: string, author: unknown): boolean =>
  userId === String(author);

/* -------------------- Routes -------------------- */
router.post('/', requireAuth(), validate({ body: createSchema }), async (req, res) => {
  const current = (req as RequestWithUser).user;
  const question = await Question.create({
    ...req.body,
    author: current._id
  });
  res.status(201).json({ question });
});

router.get('/', async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 10, 50);

  const filters: Record<string, unknown> = {};
  if (req.query.tags) filters.tags = { $in: (req.query.tags as string).split(',') };
  if (req.query.search) {
    const r = new RegExp(req.query.search as string, 'i');
    filters.$or = [{ title: r }, { body: r }];
  }

  const [items, total] = await Promise.all([
    Question.find(filters)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Question.countDocuments(filters)
  ]);

  res.json({ items, total, page, pages: Math.ceil(total / limit) });
});

router.get('/:questionId', async (req, res) => {
  const { questionId } = req.params;
  if (!Types.ObjectId.isValid(questionId))
    return res.status(400).json({ message: 'Bad id' });

  const question = await Question.findById(questionId)
    .populate('author', 'username')
    .lean();
  if (!question) return res.status(404).json({ message: 'Not found' });

  res.json({ question });
});

router.put(
  '/:questionId',
  requireAuth(),
  validate({ body: updateSchema }),
  async (req, res) => {
    const { questionId } = req.params;
    if (!Types.ObjectId.isValid(questionId))
      return res.status(400).json({ message: 'Bad id' });

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: 'Not found' });

    const current = (req as RequestWithUser).user;
    if (!isOwner(current.id, question.author) && current.role !== 'ADMIN')
      return res.status(403).json({ message: 'Forbidden' });

    Object.assign(question, req.body);
    await question.save();
    res.json({ question });
  }
);

router.post('/:questionId/vote', requireAuth(), validate({ body: voteSchema }), async (req, res) => {
  const { questionId } = req.params;
  if (!Types.ObjectId.isValid(questionId)) return res.status(400).json({ message: 'Bad id' });

  const question = await Question.findById(questionId);
  if (!question) return res.status(404).json({ message: 'Not found' });

  const current = (req as RequestWithUser).user;
  // Remove previous vote, if any
  question.votes = question.votes.filter((v) => String(v.user) !== current.id);
  // Push new vote
  question.votes.push({ user: current._id, value: req.body.vote });
  await question.save();

  res.json({ votes: question.votes });
});

router.delete('/:questionId', requireAuth(), async (req, res) => {
  const { questionId } = req.params;
  if (!Types.ObjectId.isValid(questionId))
    return res.status(400).json({ message: 'Bad id' });

  const question = await Question.findById(questionId);
  if (!question) return res.status(404).json({ message: 'Not found' });

  const current = (req as RequestWithUser).user;
  if (!isOwner(current.id, question.author) && current.role !== 'ADMIN')
    return res.status(403).json({ message: 'Forbidden' });

  await question.deleteOne();
  res.status(204).end();
});

export default router;