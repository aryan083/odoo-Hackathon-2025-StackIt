/**
 * User model & TS interfaces.
 */
import mongoose, { Schema, model, Document, HydratedDocument } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface IUser {
  username: string;
  email: string;
  password: string; // hashed
  role: UserRole;
  banned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  comparePassword: (candidate: string) => Promise<boolean>;
  generateJWT: () => string;
}

export type UserDocument = HydratedDocument<IUser, IUserMethods> & Document;

const UserSchema = new Schema<IUser, UserDocument, IUserMethods>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
    banned: { type: Boolean, default: false }
  },
  { timestamps: true }
);

/* Hash password before save */
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  this.password = await bcrypt.hash(this.password!, salt);
});

UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

UserSchema.methods.generateJWT = function (): string {
  const secret: jwt.Secret = (process.env.JWT_SECRET ?? 'secret_key') as jwt.Secret;
  // Accept string (e.g., "7d") but convert to seconds for type safety (default 7 days)
  const expiresValue = process.env.JWT_EXPIRES ?? '7d';
  const expiresInSeconds = /^[0-9]+$/.test(expiresValue)
    ? Number(expiresValue)
    : 60 * 60 * 24 * 7; // 7d fallback if not numeric
  const signOptions: jwt.SignOptions = {
    expiresIn: expiresInSeconds,
  };

  return jwt.sign(
    {
      sub: this._id.toString(), // ensure `sub` is a string as expected by JwtPayload
      role: this.role,
    },
    secret,
    signOptions
  );
};

export const User = model<IUser, mongoose.Model<UserDocument, {}, IUserMethods>>(
  'User',
  UserSchema
);