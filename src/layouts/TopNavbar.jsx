import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Bell, Sun, Moon, Menu, Plus, MessageSquare,
  User, Settings, LogOut, ChevronDown, Zap, Command,
  X, Clock, Users, BookOpen, Calendar, Briefcase
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import { Avatar, Badge } from '../components/ui';
import { ALUMNI, CONTRIBUTIONS, EVENTS, OPPORTUNITIES } from '../data/mockData';

// Quick search results
const ALL_SEARCHABLE = [
  ...ALUMNI.map((a) => ({ type: 'person', label: a.name, sub: `${a.designation} at ${a.company}`, link: '/student/alumni', icon: '👤' })),
  ...CONTRIBUTIONS.map((c) => ({ type: 'session', label: c.title, sub: c.speaker.name, link: `/contributions/${c.id}`, icon: '🎤' })),
  ...EVENTS.map((e) => ({ type: 'event', label: e.title, sub: e.date, link: '/events', icon: '📅' })),
  ...OPPORTUNITIES.map((o) => ({ type: 'opportunity', label: o.title, sub: o.company, link: '/opportunities', icon: '💼' })),
];

function CommandPalette({ onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    setResults(
      ALL_SEARCHABLE.filter(
        (item) =>
          item.label.toLowerCase().includes(q) ||
          item.sub?.toLowerCase().includes(q)
      ).slice(0, 8)
    );
  }, [query]);

  const handleSelect = (link) => {
    navigate(link);
    onClose();
  };

  return (
    <motion.div
      className="command-palette"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="command-input-wrapper mx-4"
        initial={{ scale: 0.95, y: -20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: -20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: 'var(--border-default)' }}>
          <Search size={18} style={{ color: 'var(--text-muted)' }} />
          <input
            ref={inputRef}
            className="flex-1 bg-transparent outline-none text-base"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}
            placeholder="Search Legacy Sphere..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="text-[11px] font-semibold px-2 py-1 rounded-md"
            style={{ background: 'var(--bg-surface-secondary)', color: 'var(--text-muted)' }}>
            ESC
          </kbd>
        </div>

        {results.length > 0 && (
          <div className="p-2 max-h-80 overflow-y-auto">
            {results.map((item, i) => (
              <button
                key={i}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                onClick={() => handleSelect(item.link)}
              >
                <span className="text-lg">{item.icon}</span>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                    {item.label}
                  </span>
                  {item.sub && (
                    <span className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{item.sub}</span>
                  )}
                </div>
                <span className="ml-auto badge badge-default text-[10px]"
                  style={{ background: 'var(--badge-default-bg)', color: 'var(--badge-default-text)' }}>
                  {item.type}
                </span>
              </button>
            ))}
          </div>
        )}

        {!query && (
          <div className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>Quick Links</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Users, label: 'Alumni Directory', link: '/student/alumni' },
                { icon: BookOpen, label: 'Contributions', link: '/contributions' },
                { icon: Calendar, label: 'Events', link: '/events' },
                { icon: Briefcase, label: 'Opportunities', link: '/opportunities' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{ background: 'var(--bg-surface-secondary)', color: 'var(--text-secondary)' }}
                    onClick={() => handleSelect(item.link)}
                  >
                    <Icon size={15} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// Notification dropdown
function NotificationDropdown({ notifications, onMarkRead, onMarkAllRead, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="dropdown-menu absolute right-0 top-full mt-2"
      style={{ width: 360 }}
    >
      <div className="flex items-center justify-between px-3 py-2 mb-1">
        <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Notifications</span>
        <button onClick={onMarkAllRead} className="text-xs font-semibold text-indigo-500 hover:text-indigo-600">
          Mark all read
        </button>
      </div>
      <div className="divider mb-1" />
      <div className="max-h-80 overflow-y-auto">
        {notifications.slice(0, 6).map((notif) => (
          <div
            key={notif.id}
            className="dropdown-item cursor-pointer"
            style={{ background: notif.isRead ? 'transparent' : 'rgba(99,102,241,0.04)' }}
            onClick={() => onMarkRead(notif.id)}
          >
            <span className="text-xl flex-shrink-0">{notif.icon}</span>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {notif.title}
              </span>
              <span className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                {notif.body}
              </span>
              <span className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {formatRelativeTime(notif.timestamp)}
              </span>
            </div>
            {!notif.isRead && (
              <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function formatRelativeTime(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function TopNavbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const navigate = useNavigate();

  const [showSearch, setShowSearch] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') { setShowSearch(false); setShowNotifs(false); setShowProfile(false); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setShowSearch(true); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dashboardPath = `/${user?.role}/dashboard` || '/student/dashboard';

  return (
    <>
      <header
        className="h-16 flex items-center gap-4 px-4 lg:px-6 border-b sticky top-0 z-30 backdrop-blur-md"
        style={{
          background: 'var(--navbar-bg)',
          borderColor: 'var(--navbar-border)',
        }}
      >
        {/* Mobile menu */}
        <button
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg transition-all btn btn-ghost btn-sm"
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </button>

        {/* Search bar */}
        <button
          className="flex items-center gap-3 flex-1 max-w-sm px-3 py-2 rounded-xl border text-left transition-all"
          style={{
            background: 'var(--bg-surface-secondary)',
            borderColor: 'var(--border-default)',
            color: 'var(--text-muted)',
          }}
          onClick={() => setShowSearch(true)}
        >
          <Search size={15} />
          <span className="text-sm flex-1">Search Legacy Sphere...</span>
          <kbd className="hidden sm:flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded"
            style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border-default)' }}>
            <Command size={10} />K
          </kbd>
        </button>

        <div className="flex items-center gap-2 ml-auto">
          {/* Quick create */}
          <Link
            to="/contributions/create"
            className="btn btn-primary btn-sm hidden sm:flex items-center gap-2"
          >
            <Plus size={15} />
            <span>Create</span>
          </Link>

          {/* Theme toggle */}
          <button
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-all btn btn-ghost btn-sm"
            onClick={toggleTheme}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              className="w-9 h-9 flex items-center justify-center rounded-xl transition-all btn btn-ghost btn-sm relative"
              onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false); }}
            >
              <Bell size={18} />
              {unreadCount > 0 && <span className="notif-dot" />}
            </button>
            <AnimatePresence>
              {showNotifs && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
                  <div className="absolute right-0 top-full mt-2 z-50">
                    <NotificationDropdown
                      notifications={notifications}
                      onMarkRead={(id) => { markRead(id); }}
                      onMarkAllRead={markAllRead}
                      onClose={() => setShowNotifs(false)}
                    />
                  </div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Profile menu */}
          {/* Profile menu */}
          <div className="relative">
            <button
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all"
              style={{
                background: showProfile
                  ? 'var(--bg-surface-secondary)'
                  : 'transparent',
              }}
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifs(false);
              }}
            >
              <Avatar name={user?.name} initials={user?.initials} size="sm" />
              <ChevronDown
                size={14}
                style={{ color: 'var(--text-muted)' }}
                className="hidden sm:block"
              />
            </button>

            <AnimatePresence>
              {showProfile && (
                <>
                  {/* Outside click layer */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfile(false)}
                  />

                  {/* Profile dropdown */}
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 z-50 rounded-2xl overflow-hidden"
                    style={{
                      width: 240,
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-default)',
                      boxShadow:
                        '0 20px 45px rgba(0, 0, 0, 0.35), 0 8px 20px rgba(0, 0, 0, 0.18)',
                      opacity: 1,
                    }}
                  >
                    {/* User header */}
                    <div
                      className="px-4 py-3"
                      style={{
                        background: 'var(--bg-surface-secondary)',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={user?.name}
                          initials={user?.initials}
                          size="sm"
                        />

                        <div className="min-w-0 flex-1">
                          <p
                            className="text-sm font-bold truncate"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            {user?.name}
                          </p>

                          <p
                            className="text-xs truncate mt-0.5"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div
                      className="h-px"
                      style={{ background: 'var(--border-default)' }}
                    />

                    {/* Menu items */}
                    <div className="p-2">
                      <button
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
                        style={{ color: 'var(--text-secondary)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            'var(--bg-surface-secondary)';
                          e.currentTarget.style.color =
                            'var(--text-primary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color =
                            'var(--text-secondary)';
                        }}
                        onClick={() => {
                          navigate('/profile');
                          setShowProfile(false);
                        }}
                      >
                        <User size={16} />
                        <span>View Profile</span>
                      </button>

                      <button
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
                        style={{ color: 'var(--text-secondary)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            'var(--bg-surface-secondary)';
                          e.currentTarget.style.color =
                            'var(--text-primary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color =
                            'var(--text-secondary)';
                        }}
                        onClick={() => {
                          navigate(dashboardPath);
                          setShowProfile(false);
                        }}
                      >
                        <Zap size={16} />
                        <span>Dashboard</span>
                      </button>

                      <button
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
                        style={{ color: 'var(--text-secondary)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            'var(--bg-surface-secondary)';
                          e.currentTarget.style.color =
                            'var(--text-primary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color =
                            'var(--text-secondary)';
                        }}
                        onClick={() => {
                          navigate('/settings');
                          setShowProfile(false);
                        }}
                      >
                        <Settings size={16} />
                        <span>Settings</span>
                      </button>

                      {/* Divider */}
                      <div
                        className="h-px my-2"
                        style={{ background: 'var(--border-default)' }}
                      />

                      {/* Sign out */}
                      <button
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
                        style={{ color: '#f43f5e' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            'rgba(244, 63, 94, 0.08)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                        onClick={handleLogout}
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Command palette */}
      <AnimatePresence>
        {showSearch && <CommandPalette onClose={() => setShowSearch(false)} />}
      </AnimatePresence>
    </>
  );
}
