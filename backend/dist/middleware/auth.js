var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
const getTokenFromHeader = (req) => {
    const header = req.headers.authorization;
    if (header === null || header === void 0 ? void 0 : header.startsWith('Bearer '))
        return header.substring(7);
    return null;
};
export const requireAuth = () => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = getTokenFromHeader(req);
        if (!token) {
            res.status(401).json({ message: 'Missing auth token' });
            return;
        }
        const secret = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secret);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const user = yield User.findById(decoded.sub).select('+password');
        if (!user || user.banned) {
            res.status(401).json({ message: 'Invalid or banned user' });
            return;
        }
        req.user = user;
        next();
    }
    catch (err) {
        res.status(401).json({ message: 'Unauthorized', error: err.message });
    }
});
/**
 * Optional role guard – only allow specific roles.
 * Example: app.get('/admin', requireRole(UserRole.ADMIN), handler)
 */
export const requireRole = (...roles) => (req, res, next) => {
    const { user } = req;
    if (!user || !roles.includes(user.role)) {
        res.status(403).json({ message: 'Forbidden' });
    }
    else {
        next();
    }
};
