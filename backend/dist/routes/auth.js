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
 * /api/auth – register & login
 * --------------------------------------------------
 * POST /register  ➜  create user, return { token, user }
 * POST /login     ➜  verify credentials, return { token, user }
 */
import { Router } from 'express';
import Joi from 'joi';
import { validate } from '../middleware/validate';
import { User, UserRole } from '../models/User';
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
router.post('/register', validate({ body: registerSchema }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    // duplicate check
    if (yield User.exists({ $or: [{ username }, { email }] })) {
        res.status(409).json({ message: 'Username or email already taken' });
        return;
    }
    const user = yield User.create({ username, email, password, role: UserRole.USER });
    const token = user.generateJWT();
    res.status(201).json({ token, user: user.toObject({ getters: true, virtuals: false }) });
}));
router.post('/login', validate({ body: loginSchema }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield User.findOne({ email }).select('+password');
    if (!user || !(yield user.comparePassword(password))) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
    }
    const token = user.generateJWT();
    res.json({ token, user: user.toObject({ getters: true, virtuals: false }) });
}));
export default router;
