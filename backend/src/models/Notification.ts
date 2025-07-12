/**
 * Notification model – supports generic “payload” field.
 */
import { Schema, model, Types } from 'mongoose';

export type NotificationType = 'ANSWER' | 'MENTION' | 'ADMIN';

export interface INotification {
  user: Types.ObjectId;
  type: NotificationType;
  payload: Record<string, unknown>;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['ANSWER', 'MENTION', 'ADMIN'], required: true },
    payload: { type: Schema.Types.Mixed, default: {} },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Notification = model<INotification>('Notification', NotificationSchema);