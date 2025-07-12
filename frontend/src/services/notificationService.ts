import type { Notification } from '../types/notification';

// Simulate WebSocket or real-time connection
class NotificationService {
  private listeners: ((notifications: Notification[]) => void)[] = [];
  private notifications: Notification[] = [];

  constructor() {
    // Add some initial notifications
    this.addInitialNotifications();
    // Simulate receiving notifications over time
    this.simulateRealTimeNotifications();
  }

  // Subscribe to notification updates
  subscribe(callback: (notifications: Notification[]) => void) {
    this.listeners.push(callback);
    // Return initial notifications
    callback(this.notifications);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Mark notification as read
  markAsRead(notificationId: string) {
    this.notifications = this.notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, isRead: true }
        : notification
    );
    this.notifyListeners();
  }

  // Mark all notifications as read
  markAllAsRead() {
    this.notifications = this.notifications.map(notification => ({
      ...notification,
      isRead: true
    }));
    this.notifyListeners();
  }

  // Add new notification (simulate incoming notification)
  addNotification(notification: Omit<Notification, 'id'>) {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    
    this.notifications.unshift(newNotification);
    this.notifyListeners();
  }

  // Get unread count
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  // Notify all listeners
  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  // Add initial notifications
  private addInitialNotifications() {
    const initialNotifications: Omit<Notification, 'id'>[] = [
      {
        type: 'answer_received',
        title: 'New Answer',
        message: 'Sarah Johnson answered your question',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        isRead: false,
        userId: 'user1',
        questionId: 'q1',
        fromUser: {
          id: 'user2',
          name: 'Sarah Johnson',
          avatar: 'https://randomuser.me/api/portraits/women/32.jpg'
        },
        metadata: {
          questionTitle: 'How to implement authentication in React with TypeScript?'
        }
      },
      {
        type: 'upvote_received',
        title: 'Upvote Received',
        message: 'Mike Chen upvoted your answer',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        isRead: false,
        userId: 'user1',
        answerId: 'a1',
        fromUser: {
          id: 'user3',
          name: 'Mike Chen',
          avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
        },
        metadata: {
          answerPreview: 'You can use React Context with TypeScript...',
          voteCount: 5
        }
      },
      {
        type: 'answer_accepted',
        title: 'Answer Accepted',
        message: 'Your answer was accepted',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        userId: 'user1',
        questionId: 'q2',
        metadata: {
          questionTitle: 'Best practices for state management in React'
        }
      }
    ];

    initialNotifications.forEach(notification => {
      this.addNotification(notification);
    });
  }

  // Simulate real-time notifications
  private simulateRealTimeNotifications() {
    // Add a new notification every 30 seconds for demo purposes
    setInterval(() => {
      const notificationTypes: Array<Notification['type']> = [
        'answer_received',
        'upvote_received',
        'comment_received',
        'mention_received'
      ];
      
      const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
      const users = [
        { name: 'Alice Johnson', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
        { name: 'Bob Smith', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
        { name: 'Carol Davis', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
        { name: 'David Wilson', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' }
      ];
      
      const randomUser = users[Math.floor(Math.random() * users.length)];
      
      const notification: Omit<Notification, 'id'> = {
        type: randomType,
        title: this.getNotificationTitle(randomType),
        message: `${randomUser.name} interacted with your content`,
        timestamp: new Date().toISOString(),
        isRead: false,
        userId: 'user1',
        questionId: 'q' + Math.floor(Math.random() * 10 + 1),
        fromUser: {
          id: 'user' + Math.floor(Math.random() * 100),
          name: randomUser.name,
          avatar: randomUser.avatar
        },
        metadata: {
          questionTitle: 'Sample question title for demo'
        }
      };
      
      this.addNotification(notification);
    }, 30000); // 30 seconds
  }

  private getNotificationTitle(type: Notification['type']): string {
    switch (type) {
      case 'answer_received':
        return 'New Answer';
      case 'upvote_received':
        return 'Upvote Received';
      case 'comment_received':
        return 'New Comment';
      case 'mention_received':
        return 'Mentioned in Comment';
      default:
        return 'New Notification';
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService(); 