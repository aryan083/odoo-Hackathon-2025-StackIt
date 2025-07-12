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
 * /api/users – profile endpoints
 * --------------------------------------------------
 *  GET  /me               ➜ current user
 *  PUT  /me               ➜ update own profile
 *  GET  /:userId          ➜ public info of another user
 */
import { Router } from 'express';
import Joi from 'joi';
import { Types } from 'mongoose';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { User } from '../models/User';
const router = Router();
/* ---------- Joi Schemas ---------- */
const updateMeSchema = Joi.object({
    username: Joi.string().trim().min(3).max(32),
    email: Joi.string().email()
}).min(1);
/* ---------- Routes ---------- */
router.get('/me', requireAuth(), (req, res) => {
    res.json({ user: req.user });
});
router.put('/me', requireAuth(), validate({ body: updateMeSchema }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const current = req.user;
    if (req.body.username && req.body.username !== current.username) {
        if (yield User.exists({ username: req.body.username }))
            res.status(409).json({ message: 'Username already taken' });
        return;
    }
    if (req.body.email && req.body.email !== current.email) {
        if (yield User.exists({ email: req.body.email }))
            res.status(409).json({ message: 'Email already taken' });
        return;
    }
    Object.assign(current, req.body);
    yield current.save();
    res.json({ user: current });
}));
router.get('/:userId', requireAuth(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    if (!Types.ObjectId.isValid(userId))
        return res.status(400).json({ message: 'Bad id' });
    const user = yield User.findById(userId).select('-password');
    if (!user)
        return res.status(404).json({ message: 'User not found' });
    res.json({ user });
}));
export default router;
