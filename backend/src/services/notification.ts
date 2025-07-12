import { Types } from 'mongoose';
import { Notification, INotification, NotificationType } from '../models/Notification.ts';
import { emitToUser } from '../utils/Socket.ts';

export interface CreateNotificationOptions {
  userId: Types.ObjectId | string;
  type: NotificationType;
  payload?: Record<string, unknown>;
}

export const createNotification = async (
  opts: CreateNotificationOptions,
): Promise<INotification> => {
  const doc = await Notification.create({
    user: opts.userId,
    type: opts.type,
    payload: opts.payload ?? {},
  });

  // Realtime push
  emitToUser(String(opts.userId), 'notification:new', {
    id: doc._id,
    type: doc.type,
    payload: doc.payload,
    createdAt: doc.createdAt,
  });

  return doc;
};
