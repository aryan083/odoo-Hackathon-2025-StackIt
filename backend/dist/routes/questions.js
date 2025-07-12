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
 * /api/questions – CRUD + list
 */
import { Router } from 'express';
import Joi from 'joi';
import { Types } from 'mongoose';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { Question } from '../models/Question';
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
/* -------------------- Helpers -------------------- */
const isOwner = (userId, author) => userId === String(author);
/* -------------------- Routes -------------------- */
router.post('/', requireAuth(), validate({ body: createSchema }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const current = req.user;
    const question = yield Question.create(Object.assign(Object.assign({}, req.body), { author: current._id }));
    res.status(201).json({ question });
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const filters = {};
    if (req.query.tags)
        filters.tags = { $in: req.query.tags.split(',') };
    if (req.query.search) {
        const r = new RegExp(req.query.search, 'i');
        filters.$or = [{ title: r }, { body: r }];
    }
    const [items, total] = yield Promise.all([
        Question.find(filters)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(),
        Question.countDocuments(filters)
    ]);
    res.json({ items, total, page, pages: Math.ceil(total / limit) });
}));
router.get('/:questionId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { questionId } = req.params;
    if (!Types.ObjectId.isValid(questionId))
        return res.status(400).json({ message: 'Bad id' });
    const question = yield Question.findById(questionId)
        .populate('author', 'username')
        .lean();
    if (!question)
        return res.status(404).json({ message: 'Not found' });
    res.json({ question });
}));
router.put('/:questionId', requireAuth(), validate({ body: updateSchema }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { questionId } = req.params;
    if (!Types.ObjectId.isValid(questionId))
        return res.status(400).json({ message: 'Bad id' });
    const question = yield Question.findById(questionId);
    if (!question)
        return res.status(404).json({ message: 'Not found' });
    const current = req.user;
    if (!isOwner(current.id, question.author) && current.role !== 'ADMIN')
        return res.status(403).json({ message: 'Forbidden' });
    Object.assign(question, req.body);
    yield question.save();
    res.json({ question });
}));
router.delete('/:questionId', requireAuth(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { questionId } = req.params;
    if (!Types.ObjectId.isValid(questionId))
        return res.status(400).json({ message: 'Bad id' });
    const question = yield Question.findById(questionId);
    if (!question)
        return res.status(404).json({ message: 'Not found' });
    const current = req.user;
    if (!isOwner(current.id, question.author) && current.role !== 'ADMIN')
        return res.status(403).json({ message: 'Forbidden' });
    yield question.deleteOne();
    res.status(204).end();
}));
export default router;
