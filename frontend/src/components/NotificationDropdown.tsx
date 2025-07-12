import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, X, MessageSquare, ThumbsUp, ThumbsDown, Award, AtSign, ArrowRight, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationSettings from './NotificationSettings';
import type { Notification, NotificationType } from '../types/notification';

interface NotificationDropdownProps {
  notifications: Notification[];
  isOpen: boolean;
  onToggle: () => void;
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  unreadCount: number;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  isOpen,
  onToggle,
  onMarkAsRead,
  onMarkAllAsRead,
  unreadCount
}) => {
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'answer_received':
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
      case 'answer_accepted':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'upvote_received':
        return <ThumbsUp className="h-4 w-4 text-green-600" />;
      case 'downvote_received':
        return <ThumbsDown className="h-4 w-4 text-red-600" />;
      case 'comment_received':
        return <MessageSquare className="h-4 w-4 text-purple-600" />;
      case 'mention_received':
        return <AtSign className="h-4 w-4 text-orange-600" />;
      case 'badge_earned':
        return <Award className="h-4 w-4 text-yellow-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const formatNotificationMessage = (notification: Notification) => {
    switch (notification.type) {
      case 'answer_received':
        return `${notification.fromUser?.name} answered your question "${notification.metadata?.questionTitle}"`;
      case 'answer_accepted':
        return `Your answer was accepted for "${notification.metadata?.questionTitle}"`;
      case 'upvote_received':
        return `${notification.fromUser?.name} upvoted your ${notification.metadata?.answerPreview ? 'answer' : 'question'}`;
      case 'downvote_received':
        return `${notification.fromUser?.name} downvoted your ${notification.metadata?.answerPreview ? 'answer' : 'question'}`;
      case 'comment_received':
        return `${notification.fromUser?.name} commented on your ${notification.metadata?.answerPreview ? 'answer' : 'question'}`;
      case 'mention_received':
        return `${notification.fromUser?.name} mentioned you in a comment`;
      case 'badge_earned':
        return `You earned the "${notification.metadata?.badgeName}" badge!`;
      default:
        return notification.message;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    onMarkAsRead(notification.id);
    
    // Navigate based on notification type
    if (notification.questionId) {
      navigate(`/question/${notification.questionId}`);
    } else if (notification.answerId) {
      // Navigate to the question that contains this answer
      navigate(`/question/${notification.questionId || 'q1'}`);
    }
    
    // Close dropdown
    onToggle();
  };

  // Close dropdown when clicking outside
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Button */}
      <button
        type="button"
        onClick={onToggle}
        className="relative size-9.5 inline-flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center font-medium">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-neutral-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Mark all as read
                </button>
              )}
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="text-gray-400 hover:text-gray-600 dark:text-neutral-400 dark:hover:text-neutral-300"
              >
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-neutral-400">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-50 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700 cursor-pointer ${
                    !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1">
                            {formatNotificationMessage(notification)}
                          </p>
                          {notification.metadata?.questionTitle && (
                            <p className="text-xs text-gray-500 dark:text-neutral-500 mt-1 truncate">
                              "{notification.metadata.questionTitle}"
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 dark:text-neutral-500">
                            {getTimeAgo(notification.timestamp)}
                          </span>
                          {!notification.isRead && (
                            <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-100 dark:border-neutral-700">
              <button className="w-full text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center justify-center gap-1">
                View all notifications
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Notification Settings Modal */}
      <NotificationSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default NotificationDropdown; 