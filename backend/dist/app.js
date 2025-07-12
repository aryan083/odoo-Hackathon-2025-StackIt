var _a;
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import questionsRoutes from './routes/questions';
import answersRoutes from './routes/answers';
dotenv.config();
const app = express();
/* ---------- Core middleware ---------- */
app.use(cors({ origin: ((_a = process.env.CORS_ORIGIN) === null || _a === void 0 ? void 0 : _a.split(',')) || '*' }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));
/* ---------- Routes ---------- */
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/questions/:qid/answers', answersRoutes);
/* ---------- Global 404 & error handler ---------- */
app.use('*', (_, res) => res.status(404).json({ message: 'Route not found' }));
export default app;
// // (end of file) = Joi.object({ vote: Joi.number().valid(1, -1).required() });
// const createSchema = Joi.object({ body: Joi.string().min(2).required() });
// const updateSchema = Joi.object({ body: Joi.string().min(2).required() });
// // This file has been replaced below with the correct Express app implementation.
// const ensureIds = (qid: string, aid?: string): boolean =>
//   Types.ObjectId.isValid(qid) && (!aid || Types.ObjectId.isValid(aid));
// const isOwner = (userId: string, author: unknown): boolean =>
//   userId === String(author);
// /* List Answers */
// app.get('/', async (req, res) => {
//   const { qid } = req.params as { qid: string };
//   if (!ensureIds(qid)) return res.status(400).json({ message: 'Bad id' });
//   const answers = await Answer.find({ question: qid })
//     .populate('author', 'username')
//     .lean();
//   res.json({ answers });
// });
// /* Create Answer */
// app.post(
//   '/',
//   requireAuth(),
//   validate({ body: createSchema }),
//   async (req, res) => {
//     const { qid } = req.params as { qid: string };
//     if (!ensureIds(qid)) return res.status(400).json({ message: 'Bad id' });
//     const question = await Question.findById(qid);
//     if (!question) return res.status(404).json({ message: 'Question not found' });
//     const current = (req as RequestWithUser).user;
//     const answer = await Answer.create({
//       body: req.body.body,
//       question: qid,
//       author: current._id
//     });
//     res.status(201).json({ answer });
//   }
// );
// /* Update Answer */
// app.put(
//   '/:aid',
//   requireAuth(),
//   validate({ body: updateSchema }),
//   async (req, res) => {
//     const { qid, aid } = req.params as { qid: string; aid: string };
//     if (!ensureIds(qid, aid)) return res.status(400).json({ message: 'Bad id' });
//     const answer = await Answer.findOne({ _id: aid, question: qid });
//     if (!answer) return res.status(404).json({ message: 'Not found' });
//     const current = (req as RequestWithUser).user;
//     if (!isOwner(current.id, answer.author) && current.role !== 'ADMIN')
//       return res.status(403).json({ message: 'Forbidden' });
//     answer.body = req.body.body;
//     await answer.save();
//     res.json({ answer });
//   }
// );
// /* Delete Answer */
// app.delete('/:aid', requireAuth(), async (req, res) => {
//   const { qid, aid } = req.params as { qid: string; aid: string };
//   if (!ensureIds(qid, aid)) return res.status(400).json({ message: 'Bad id' });
//   const answer = await Answer.findOne({ _id: aid, question: qid });
//   if (!answer) return res.status(404).json({ message: 'Not found' });
//   const current = (req as RequestWithUser).user;
//   if (!isOwner(current.id, answer.author) && current.role !== 'ADMIN')
//     return res.status(403).json({ message: 'Forbidden' });
//   await answer.deleteOne();
//   res.status(204).end();
// });
// /* Vote */
// app.post('/:aid/vote', requireAuth(), validate({ body: voteSchema }), async (req, res) => {
//   const { qid, aid } = req.params as { qid: string; aid: string };
//   const { vote } = req.body as { vote: 1 | -1 };
//   if (!ensureIds(qid, aid)) return res.status(400).json({ message: 'Bad id' });
//   const answer = await Answer.findOne({ _id: aid, question: qid });
//   if (!answer) return res.status(404).json({ message: 'Not found' });
//   const current = (req as RequestWithUser).user;
//   // remove previous vote if any
//   answer.votes = answer.votes.filter((v) => String(v.user) !== current.id);
//   // push new
//   answer.votes.push({ user: current._id, value: vote });
//   await answer.save();
//   res.json({ votes: answer.votes });
// });
// /* Accept Answer */
// app.post('/:aid/accept', requireAuth(), async (req, res) => {
//   const { qid, aid } = req.params as { qid: string; aid: string };
//   if (!ensureIds(qid, aid)) return res.status(400).json({ message: 'Bad id' });
//   const question = await Question.findById(qid);
//   if (!question) return res.status(404).json({ message: 'Question not found' });
//   const current = (req as RequestWithUser).user;
//   if (String(question.author) !== current.id) return res.status(403).json({ message: 'Forbidden' });
//   await Question.updateOne({ _id: qid }, { acceptedAnswer: aid });
//   await Answer.updateOne({ _id: aid }, { isAccepted: true });
//   res.status(200).json({ accepted: aid });
// });
