import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notificationService';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const refresh = useCallback(async () => {
    const data = await notificationService.getAll();
    setNotifications(data);
    setUnreadCount(data.filter((n) => !n.isRead).length);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const markRead = useCallback(async (id) => {
    const data = await notificationService.markRead(id);
    setNotifications(data);
    setUnreadCount(data.filter((n) => !n.isRead).length);
  }, []);

  const markAllRead = useCallback(async () => {
    const data = await notificationService.markAllRead();
    setNotifications(data);
    setUnreadCount(0);
  }, []);

  const addNotification = useCallback((notif) => {
    const data = notificationService.addNotification(notif);
    setNotifications(data);
    setUnreadCount(data.filter((n) => !n.isRead).length);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markRead, markAllRead, addNotification, refresh }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};
