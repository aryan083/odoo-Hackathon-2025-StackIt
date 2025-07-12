import { Router } from 'express';
import Joi from 'joi';
import { Question } from '../models/Question.ts';
import { validate } from '../middleware/validate.ts';

const router = Router();

// GET /api/tags – list popular tags
const querySchema = Joi.object({
  search: Joi.string().allow(''),
  limit: Joi.number().min(1).max(100).default(30),
});

router.get('/', validate({ query: querySchema }), async (req, res) => {
  const search = req.query.search as string | undefined;
  const limit = Number((req.query.limit as string | undefined) ?? 30);

  const pipeline: any[] = [
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ];

  if (search) {
    pipeline.push({ $match: { _id: { $regex: new RegExp(search, 'i') } } });
  }

  pipeline.push({ $limit: limit });

  const tags = await Question.aggregate<{ _id: string; count: number }>(pipeline);
  res.json({ tags: tags.map((t) => ({ name: t._id, count: t.count })) });
});

export default router;
