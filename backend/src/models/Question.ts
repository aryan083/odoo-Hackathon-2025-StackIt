/**
 * Question model – stores basic Q&A info w/ tag list.
 */
import { Schema, model, Types } from 'mongoose';
import { UserDocument } from './User.ts';

export interface IVote {
  user: Types.ObjectId | UserDocument;
  value: 1 | -1;
}

export interface IQuestion {
  title: string;
  body: string;
  tags: string[];
  author: Types.ObjectId | UserDocument;
  views: number;
  votes: IVote[];
  acceptedAnswers: Types.ObjectId[];
  status: 'published' | 'pending' | 'rejected' | 'deleted';
  createdAt: Date;
  updatedAt: Date;
}

const VoteSchema = new Schema<IVote>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  value: { type: Number, enum: [1, -1], required: true }
});

const QuestionSchema = new Schema<IQuestion>(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    tags: [{ type: String, index: true }],
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    views: { type: Number, default: 0 },
    votes: { type: [VoteSchema], default: [] },
    acceptedAnswers: { type: [Schema.Types.ObjectId], ref: 'Answer', default: [] },
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