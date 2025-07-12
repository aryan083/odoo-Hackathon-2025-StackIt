var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * /api/questions/:qid/answers – nested router
 * mergeParams ✓ so we can access :qid
 */
import { Router } from 'express';
import Joi from 'joi';
import { Types } from 'mongoose';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { Answer } from '../models/Answer';
import { Question } from '../models/Question';
const router = Router({ mergeParams: true });
const voteSchema = Joi.object({ vote: Joi.number().valid(1, -1).required() });
const createSchema = Joi.object({ body: Joi.string().min(2).required() });
const updateSchema = Joi.object({ body: Joi.string().min(2).required() });
/* utils */
const ensureIds = (qid, aid) => Types.ObjectId.isValid(qid) && (!aid || Types.ObjectId.isValid(aid));
const isOwner = (userId, author) => userId === String(author);
/* List Answers */
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { qid } = req.params;
    if (!ensureIds(qid))
        return res.status(400).json({ message: 'Bad id' });
    const answers = yield Answer.find({ question: qid })
        .populate('author', 'username')
        .lean();
    res.json({ answers });
}));
/* Create Answer */
router.post('/', requireAuth(), validate({ body: createSchema }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { qid } = req.params;
    if (!ensureIds(qid))
        return res.status(400).json({ message: 'Bad id' });
    const question = yield Question.findById(qid);
    if (!question)
        return res.status(404).json({ message: 'Question not found' });
    const current = req.user;
    const answer = yield Answer.create({
        body: req.body.body,
        question: qid,
        author: current._id
    });
    res.status(201).json({ answer });
}));
/* Update Answer */
router.put('/:aid', requireAuth(), validate({ body: updateSchema }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { qid, aid } = req.params;
    if (!ensureIds(qid, aid))
        return res.status(400).json({ message: 'Bad id' });
    const answer = yield Answer.findOne({ _id: aid, question: qid });
    if (!answer)
        return res.status(404).json({ message: 'Not found' });
    const current = req.user;
    if (!isOwner(current.id, answer.author) && current.role !== 'ADMIN')
        return res.status(403).json({ message: 'Forbidden' });
    answer.body = req.body.body;
    yield answer.save();
    res.json({ answer });
}));
/* Delete Answer */
router.delete('/:aid', requireAuth(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { qid, aid } = req.params;
    if (!ensureIds(qid, aid))
        return res.status(400).json({ message: 'Bad id' });
    const answer = yield Answer.findOne({ _id: aid, question: qid });
    if (!answer)
        return res.status(404).json({ message: 'Not found' });
    const current = req.user;
    if (!isOwner(current.id, answer.author) && current.role !== 'ADMIN')
        return res.status(403).json({ message: 'Forbidden' });
    yield answer.deleteOne();
    res.status(204).end();
}));
/* Vote */
router.post('/:aid/vote', requireAuth(), validate({ body: voteSchema }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { qid, aid } = req.params;
    const { vote } = req.body;
    if (!ensureIds(qid, aid))
        return res.status(400).json({ message: 'Bad id' });
    const answer = yield Answer.findOne({ _id: aid, question: qid });
    if (!answer)
        return res.status(404).json({ message: 'Not found' });
    const current = req.user;
    // remove previous vote if any
    answer.votes = answer.votes.filter((v) => String(v.user) !== current.id);
    // push new
    answer.votes.push({ user: current._id, value: vote });
    yield answer.save();
    res.json({ votes: answer.votes });
}));
/* Accept Answer */
router.post('/:aid/accept', requireAuth(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { qid, aid } = req.params;
    if (!ensureIds(qid, aid))
        return res.status(400).json({ message: 'Bad id' });
    const question = yield Question.findById(qid);
    if (!question)
        return res.status(404).json({ message: 'Question not found' });
    const current = req.user;
    if (String(question.author) !== current.id)
        return res.status(403).json({ message: 'Forbidden' });
    yield Question.updateOne({ _id: qid }, { acceptedAnswer: aid });
    yield Answer.updateOne({ _id: aid }, { isAccepted: true });
    res.status(200).json({ accepted: aid });
}));
export default router;
