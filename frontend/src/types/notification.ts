export type NotificationType = 
  | 'answer_received'
  | 'answer_accepted'
  | 'upvote_received'
  | 'downvote_received'
  | 'comment_received'
  | 'mention_received'
  | 'badge_earned';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  userId: string;
  questionId?: string;
  answerId?: string;
  commentId?: string;
  fromUser?: {
    id: string;
    name: string;
    avatar: string;
  };
  metadata?: {
    questionTitle?: string;
    answerPreview?: string;
    commentText?: string;
    badgeName?: string;
    voteCount?: number;
  };
}

export interface NotificationGroup {
  type: NotificationType;
  count: number;
  notifications: Notification[];
} 