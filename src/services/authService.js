/**
 * Mock Authentication Service
 * Abstracts auth logic so it can later be replaced with JWT + Google OAuth
 * without rewriting components.
 */

import { MOCK_USERS } from '../data/mockData';

const STORAGE_KEY = 'legacy_sphere_auth';
const DELAY = 800; // Simulate network latency

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const authService = {
  /**
   * Sign in with email + password.
   * In mock mode: matches role from email prefix.
   */
  async login(email, password) {
    await delay(DELAY);
    // Map email patterns to roles for demo
    const roleMap = {
      'student': 'student',
      'alumni': 'alumni',
      'professor': 'professor',
      'admin': 'admin',
      'recruiter': 'recruiter',
    };
    const role = Object.keys(roleMap).find((k) => email.includes(k)) || 'student';
    const user = MOCK_USERS[role];
    if (!user) throw new Error('Invalid credentials');
    const session = { ...user, email, token: `mock_jwt_${Date.now()}` };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    return session;
  },

  /**
   * Sign in with Google (mock).
   */
  async loginWithGoogle(role = 'student') {
    await delay(DELAY);
    const user = MOCK_USERS[role];
    const session = { ...user, token: `mock_google_jwt_${Date.now()}` };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    return session;
  },

  /**
   * Register a new user (mock).
   */
  async register({ name, email, role, password }) {
    await delay(DELAY);
    const base = MOCK_USERS[role] || MOCK_USERS.student;
    const session = {
      ...base,
      id: `user_${role}_new_${Date.now()}`,
      name,
      email,
      role,
      isNewUser: true,
      token: `mock_jwt_${Date.now()}`,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    return session;
  },

  /**
   * Logout — clears local session.
   */
  logout() {
    localStorage.removeItem(STORAGE_KEY);
  },

  /**
   * Get current authenticated user from localStorage.
   */
  getCurrentUser() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  /**
   * Update user profile (mock).
   */
  async updateProfile(updates) {
    await delay(400);
    const user = this.getCurrentUser();
    if (!user) throw new Error('Not authenticated');
    const updated = { ...user, ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  /**
   * Forgot password (mock).
   */
  async forgotPassword(email) {
    await delay(DELAY);
    return { success: true, message: `Reset link sent to ${email}` };
  },

  /**
   * Check if user is authenticated.
   */
  isAuthenticated() {
    return !!this.getCurrentUser();
  },

  /**
   * Check if user has a specific role.
   */
  hasRole(role) {
    const user = this.getCurrentUser();
    return user?.role === role;
  },
};
