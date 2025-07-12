/**
 * Notification model – supports generic “payload” field.
 */
import { Schema, model } from 'mongoose';
const NotificationSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['ANSWER', 'MENTION', 'ADMIN'], required: true },
    payload: { type: Schema.Types.Mixed, default: {} },
    read: { type: Boolean, default: false }
}, { timestamps: true });
export const Notification = model('Notification', NotificationSchema);
