import { useEffect, useRef } from 'react';

export const useNotificationSound = (unreadCount: number) => {
  const previousUnreadCount = useRef(unreadCount);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element for notification sound
    if (!audioRef.current) {
      audioRef.current = new Audio();
      // You can replace this with an actual notification sound file
      // For now, we'll use a simple beep sound
      audioRef.current.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';
    }
  }, []);

  useEffect(() => {
    // Play sound when unread count increases
    if (unreadCount > previousUnreadCount.current && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Ignore errors if audio fails to play (e.g., user hasn't interacted with page)
      });
    }
    previousUnreadCount.current = unreadCount;
  }, [unreadCount]);

  return audioRef.current;
}; 