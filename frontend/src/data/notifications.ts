import type { Notification } from '../types/notification';

export const sampleNotifications: Notification[] = [
  {
    id: '1',
    type: 'answer_received',
    title: 'New Answer',
    message: 'Sarah Johnson answered your question',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
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
    id: '2',
    type: 'upvote_received',
    title: 'Upvote Received',
    message: 'Mike Chen upvoted your answer',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
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
    id: '3',
    type: 'answer_accepted',
    title: 'Answer Accepted',
    message: 'Your answer was accepted',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    isRead: true,
    userId: 'user1',
    questionId: 'q2',
    metadata: {
      questionTitle: 'Best practices for state management in React'
    }
  },
  {
    id: '4',
    type: 'comment_received',
    title: 'New Comment',
    message: 'Alex Rodriguez commented on your question',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    isRead: true,
    userId: 'user1',
    questionId: 'q3',
    fromUser: {
      id: 'user4',
      name: 'Alex Rodriguez',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
    },
    metadata: {
      questionTitle: 'React performance optimization techniques',
      commentText: 'Have you tried using React.memo?'
    }
  },
  {
    id: '5',
    type: 'badge_earned',
    title: 'Badge Earned',
    message: 'You earned a new badge!',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    isRead: true,
    userId: 'user1',
    metadata: {
      badgeName: 'Helpful Answerer'
    }
  },
  {
    id: '6',
    type: 'mention_received',
    title: 'Mentioned in Comment',
    message: 'Emma Wilson mentioned you in a comment',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    isRead: true,
    userId: 'user1',
    fromUser: {
      id: 'user5',
      name: 'Emma Wilson',
      avatar: 'https://randomuser.me/api/portraits/women/89.jpg'
    },
    metadata: {
      questionTitle: 'TypeScript best practices for React developers'
    }
  },
  {
    id: '7',
    type: 'downvote_received',
    title: 'Downvote Received',
    message: 'David Kim downvoted your answer',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    isRead: true,
    userId: 'user1',
    answerId: 'a2',
    fromUser: {
      id: 'user6',
      name: 'David Kim',
      avatar: 'https://randomuser.me/api/portraits/men/23.jpg'
    },
    metadata: {
      answerPreview: 'You should use useEffect for side effects...',
      voteCount: -1
    }
  }
]; 