/**
 * JWT authentication & RBAC helpers.
 * --------------------------------------------------
 *  – requireAuth(): verifies token, loads user, puts it on req.user
 *  – requireRole(...roles): optional extra guard for ADMIN-only etc.
 */
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User, UserDocument, UserRole } from '../models/User.ts';

export interface RequestWithUser extends Request {
  user: UserDocument;
}

const getTokenFromHeader = (req: Request): string | null => {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) return header.substring(7);
  return null;
};

export const requireAuth =
  () => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = getTokenFromHeader(req);
      if (!token) {
        res.status(401).json({ message: 'Missing auth token' });
        return;
      }

      const secret = process.env.JWT_SECRET as string;
      const decoded = jwt.verify(token, secret) as JwtPayload;

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const user = await User.findById(decoded.sub).select('+password');
      if (!user || user.banned) {
        res.status(401).json({ message: 'Invalid or banned user' });
        return;
      }

      (req as RequestWithUser).user = user;
      next();
    } catch (err) {
      res.status(401).json({ message: 'Unauthorized', error: (err as Error).message });
    }
  };

/**
 * Optional role guard – only allow specific roles.
 * Example: app.get('/admin', requireRole(UserRole.ADMIN), handler)
 */
export const requireRole =
  (...roles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const { user } = req as RequestWithUser;
    if (!user || !roles.includes(user.role)) {
      res.status(403).json({ message: 'Forbidden' });
    } else {
      next();
    }
  };