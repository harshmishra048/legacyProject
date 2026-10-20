/**
 * Contribution Service
 * Mock service for contribution (sessions/seminars/workshops) CRUD.
 * Replace implementation with Axios calls when backend is ready.
 */

import { CONTRIBUTIONS } from '../data/mockData';

const STORAGE_KEY = 'legacy_sphere_contributions';
const REGISTERED_KEY = 'legacy_sphere_registered_sessions';
const DELAY = 600;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Load persisted contributions or fall back to mock data
const loadContributions = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [...CONTRIBUTIONS];
  } catch {
    return [...CONTRIBUTIONS];
  }
};

const saveContributions = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const contributionService = {
  async getAll({ category, search, page = 1, limit = 12 } = {}) {
    await delay(DELAY);
    let data = loadContributions();
    if (category && category !== 'All') {
      data = data.filter((c) => c.category === category || c.type === category);
    }
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.speaker.name.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    const total = data.length;
    const items = data.slice((page - 1) * limit, page * limit);
    return { items, total, page, totalPages: Math.ceil(total / limit) };
  },

  async getById(id) {
    await delay(400);
    const data = loadContributions();
    const item = data.find((c) => c.id === id);
    if (!item) throw new Error('Contribution not found');
    return item;
  },

  async create(payload) {
    await delay(DELAY);
    const data = loadContributions();
    const newItem = {
      ...payload,
      id: `con_${Date.now()}`,
      registered: 0,
      rating: 0,
      ratingCount: 0,
      status: 'upcoming',
    };
    data.unshift(newItem);
    saveContributions(data);
    return newItem;
  },

  async update(id, updates) {
    await delay(400);
    const data = loadContributions();
    const idx = data.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Not found');
    data[idx] = { ...data[idx], ...updates };
    saveContributions(data);
    return data[idx];
  },

  async delete(id) {
    await delay(400);
    const data = loadContributions().filter((c) => c.id !== id);
    saveContributions(data);
    return true;
  },

  // Session registration
  async register(contributionId, userId) {
    await delay(800);
    const registered = this.getRegistered();
    if (registered.includes(contributionId)) throw new Error('Already registered');
    registered.push(contributionId);
    localStorage.setItem(REGISTERED_KEY, JSON.stringify(registered));

    // Update seat count
    const data = loadContributions();
    const idx = data.findIndex((c) => c.id === contributionId);
    if (idx !== -1) {
      data[idx].registered = (data[idx].registered || 0) + 1;
      saveContributions(data);
    }
    return { success: true };
  },

  async cancelRegistration(contributionId) {
    await delay(400);
    const registered = this.getRegistered().filter((id) => id !== contributionId);
    localStorage.setItem(REGISTERED_KEY, JSON.stringify(registered));

    const data = loadContributions();
    const idx = data.findIndex((c) => c.id === contributionId);
    if (idx !== -1 && data[idx].registered > 0) {
      data[idx].registered -= 1;
      saveContributions(data);
    }
    return { success: true };
  },

  getRegistered() {
    try {
      const raw = localStorage.getItem(REGISTERED_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  isRegistered(contributionId) {
    return this.getRegistered().includes(contributionId);
  },

  async submitFeedback(contributionId, { rating, comment, reactions }) {
    await delay(600);
    // Store feedback — in real app this goes to backend
    const feedbackKey = `feedback_${contributionId}`;
    const existing = JSON.parse(localStorage.getItem(feedbackKey) || '[]');
    existing.push({ rating, comment, reactions, timestamp: new Date().toISOString() });
    localStorage.setItem(feedbackKey, JSON.stringify(existing));
    return { success: true };
  },

  // Simulate payment — returns a mock payment result
  async simulatePayment({ amount, sessionTitle, userId }) {
    await delay(1500); // Longer delay for payment feel
    // 95% success rate for demo
    if (Math.random() > 0.05) {
      return {
        success: true,
        transactionId: `TXN_${Date.now()}`,
        amount,
        sessionTitle,
        timestamp: new Date().toISOString(),
      };
    }
    throw new Error('Payment failed. Please try again.');
  },
};
