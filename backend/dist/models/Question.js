/**
 * Question model – stores basic Q&A info w/ tag list.
 */
import { Schema, model } from 'mongoose';
const QuestionSchema = new Schema({
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    tags: [{ type: String, index: true }],
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    views: { type: Number, default: 0 },
    acceptedAnswer: { type: Schema.Types.ObjectId, ref: 'Answer' },
    status: {
        type: String,
        enum: ['published', 'pending', 'rejected', 'deleted'],
        default: 'published',
        index: true
    }
}, { timestamps: true });
export const Question = model('Question', QuestionSchema);
