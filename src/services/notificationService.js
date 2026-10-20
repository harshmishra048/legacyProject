/**
 * Notification Service
 * Mock notification management. Swap for Socket.IO / Push later.
 */

import { NOTIFICATIONS } from '../data/mockData';

const STORAGE_KEY = 'legacy_sphere_notifications';
const DELAY = 400;
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const loadNotifications = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [...NOTIFICATIONS];
  } catch {
    return [...NOTIFICATIONS];
  }
};

const save = (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

export const notificationService = {
  async getAll() {
    await delay(DELAY);
    return loadNotifications();
  },

  getUnreadCount() {
    return loadNotifications().filter((n) => !n.isRead).length;
  },

  async markRead(id) {
    const data = loadNotifications().map((n) => (n.id === id ? { ...n, isRead: true } : n));
    save(data);
    return data;
  },

  async markAllRead() {
    const data = loadNotifications().map((n) => ({ ...n, isRead: true }));
    save(data);
    return data;
  },

  addNotification(notif) {
    const data = loadNotifications();
    data.unshift({ ...notif, id: `notif_${Date.now()}`, timestamp: new Date().toISOString(), isRead: false });
    save(data);
    return data;
  },
};
