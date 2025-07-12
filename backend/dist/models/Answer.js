/**
 * Answer model – votes stored as embedded docs for simplicity.
 */
import { Schema, model } from 'mongoose';
const VoteSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    value: { type: Number, enum: [1, -1], required: true }
});
const AnswerSchema = new Schema({
    body: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    question: { type: Schema.Types.ObjectId, ref: 'Question', required: true, index: true },
    votes: { type: [VoteSchema], default: [] },
    isAccepted: { type: Boolean, default: false }
}, { timestamps: true });
export const Answer = model('Answer', AnswerSchema);
