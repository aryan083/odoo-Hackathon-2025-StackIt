/**
 * /api/questions/:qid/answers – nested router
 * mergeParams ✓ so we can access :qid
 */
import { Router } from 'express';
import Joi from 'joi';
import { Types } from 'mongoose';
import { requireAuth, RequestWithUser } from '../middleware/auth.ts';
import { validate } from '../middleware/validate.ts';
import { Answer } from '../models/Answer.ts';
import { Question } from '../models/Question.ts';

const router = Router({ mergeParams: true });
const voteSchema = Joi.object({ vote: Joi.number().valid(1, -1).required() });
const createSchema = Joi.object({ body: Joi.string().min(2).required() });
const updateSchema = Joi.object({ body: Joi.string().min(2).required() });

/* utils */
const ensureIds = (qid: string, aid?: string): boolean =>
  Types.ObjectId.isValid(qid) && (!aid || Types.ObjectId.isValid(aid));

const isOwner = (userId: string, author: unknown): boolean =>
  userId === String(author);

/* List Answers */
router.get('/', async (req, res) => {
  const { qid } = req.params as { qid: string };
  if (!ensureIds(qid)) return res.status(400).json({ message: 'Bad id' });

  const answers = await Answer.find({ question: qid })
    .populate('author', 'username')
    .lean();
  res.json({ answers });
});

/* Create Answer */
router.post(
  '/',
  requireAuth(),
  validate({ body: createSchema }),
  async (req, res) => {
    const { qid } = req.params as { qid: string };
    if (!ensureIds(qid)) return res.status(400).json({ message: 'Bad id' });

    const question = await Question.findById(qid);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    const current = (req as RequestWithUser).user;
    const answer = await Answer.create({
      body: req.body.body,
      question: qid,
      author: current._id
    });

    res.status(201).json({ answer });
  }
);

/* Update Answer */
router.put(
  '/:aid',
  requireAuth(),
  validate({ body: updateSchema }),
  async (req, res) => {
    const { qid, aid } = req.params as { qid: string; aid: string };
    if (!ensureIds(qid, aid)) return res.status(400).json({ message: 'Bad id' });

    const answer = await Answer.findOne({ _id: aid, question: qid });
    if (!answer) return res.status(404).json({ message: 'Not found' });

    const current = (req as RequestWithUser).user;
    if (!isOwner(current.id, answer.author) && current.role !== 'ADMIN')
      return res.status(403).json({ message: 'Forbidden' });

    answer.body = req.body.body;
    await answer.save();
    res.json({ answer });
  }
);

/* Delete Answer */
router.delete('/:aid', requireAuth(), async (req, res) => {
  const { qid, aid } = req.params as { qid: string; aid: string };
  if (!ensureIds(qid, aid)) return res.status(400).json({ message: 'Bad id' });

  const answer = await Answer.findOne({ _id: aid, question: qid });
  if (!answer) return res.status(404).json({ message: 'Not found' });

  const current = (req as RequestWithUser).user;
  if (!isOwner(current.id, answer.author) && current.role !== 'ADMIN')
    return res.status(403).json({ message: 'Forbidden' });

  await answer.deleteOne();
  res.status(204).end();
});

/* Vote */
router.post('/:aid/vote', requireAuth(), validate({ body: voteSchema }), async (req, res) => {
  const { qid, aid } = req.params as { qid: string; aid: string };
  const { vote } = req.body as { vote: 1 | -1 };
  if (!ensureIds(qid, aid)) return res.status(400).json({ message: 'Bad id' });

  const answer = await Answer.findOne({ _id: aid, question: qid });
  if (!answer) return res.status(404).json({ message: 'Not found' });

  const current = (req as RequestWithUser).user;
  // remove previous vote if any
  answer.votes = answer.votes.filter((v) => String(v.user) !== current.id);
  // push new
  answer.votes.push({ user: current._id, value: vote });
  await answer.save();

  res.json({ votes: answer.votes });
});

/* Accept Answer */
router.post('/:aid/accept', requireAuth(), async (req, res) => {
  const { qid, aid } = req.params as { qid: string; aid: string };
  if (!ensureIds(qid, aid)) return res.status(400).json({ message: 'Bad id' });

  const question = await Question.findById(qid);
  if (!question) return res.status(404).json({ message: 'Question not found' });

  const current = (req as RequestWithUser).user;
  if (String(question.author) !== current.id) return res.status(403).json({ message: 'Forbidden' });

  if (!question.acceptedAnswers.includes(aid as unknown as Types.ObjectId)) {
    question.acceptedAnswers.push(aid as unknown as Types.ObjectId);
    await question.save();
  }
  await Answer.updateOne({ _id: aid }, { isAccepted: true });

  res.status(200).json({ accepted: aid });
});

export default router;