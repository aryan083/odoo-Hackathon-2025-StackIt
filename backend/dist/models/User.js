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
 * User model & TS interfaces.
 */
import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
export var UserRole;
(function (UserRole) {
    UserRole["USER"] = "USER";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (UserRole = {}));
const UserSchema = new Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
    banned: { type: Boolean, default: false }
}, { timestamps: true });
/* Hash password before save */
UserSchema.pre('save', function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password'))
            return;
        const salt = yield bcrypt.genSalt(10);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.password = yield bcrypt.hash(this.password, salt);
    });
});
UserSchema.methods.comparePassword = function (candidate) {
    return __awaiter(this, void 0, void 0, function* () {
        return bcrypt.compare(candidate, this.password);
    });
};
UserSchema.methods.generateJWT = function () {
    var _a;
    const secret = ((_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : 'secret_key');
    const expiresInSeconds = process.env.JWT_EXPIRES ? Number(process.env.JWT_EXPIRES) : 60 * 60 * 24 * 7; // default 7 days
    const signOptions = {
        expiresIn: expiresInSeconds,
    };
    return jwt.sign({
        sub: this._id.toString(), // ensure `sub` is a string as expected by JwtPayload
        role: this.role,
    }, secret, signOptions);
};
export const User = model('User', UserSchema);
