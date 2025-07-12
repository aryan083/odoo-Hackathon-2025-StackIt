/**
 * Answer model – votes stored as embedded docs for simplicity.
 */
import { Schema, model, Types } from 'mongoose';
import { UserDocument } from './User.ts';

export interface IVote {
  user: Types.ObjectId | UserDocument;
  value: 1 | -1;
}

export interface IAnswer {
  body: string;
  author: Types.ObjectId | UserDocument;
  question: Types.ObjectId;
  votes: IVote[];
  isAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VoteSchema = new Schema<IVote>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  value: { type: Number, enum: [1, -1], required: true }
});

const AnswerSchema = new Schema<IAnswer>(
  {
    body: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    question: { type: Schema.Types.ObjectId, ref: 'Question', required: true, index: true },
    votes: { type: [VoteSchema], default: [] },
    isAccepted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Answer = model<IAnswer>('Answer', AnswerSchema);