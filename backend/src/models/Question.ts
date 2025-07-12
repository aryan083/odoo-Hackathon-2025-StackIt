/**
 * Question model – stores basic Q&A info w/ tag list.
 */
import { Schema, model, Types } from 'mongoose';
import { UserDocument } from './User.ts';

export interface IQuestion {
  title: string;
  body: string;
  tags: string[];
  author: Types.ObjectId | UserDocument;
  views: number;
  acceptedAnswer?: Types.ObjectId;
  status: 'published' | 'pending' | 'rejected' | 'deleted';
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
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
  },
  { timestamps: true }
);

export const Question = model<IQuestion>('Question', QuestionSchema);