import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Flame, Clock, Calendar, Star, TrendingUp, ArrowRight,
  Zap, BookOpen, Users, Bell, Briefcase, ChevronRight, Award
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { Avatar, Badge, Button, StatCard, Card, SectionHeader, ProgressBar, EmptyState } from '../../components/ui';
import { CONTRIBUTIONS, ALUMNI, OPPORTUNITIES, ANNOUNCEMENTS, BADGES, COMMUNITY_POSTS } from '../../data/mockData';
import { contributionService } from '../../services/contributionService';
import toast from 'react-hot-toast';

const WEEKLY_ACTIVITY = [
  { day: 'Mon', hours: 2.5, sessions: 1 },
  { day: 'Tue', hours: 1.8, sessions: 0 },
  { day: 'Wed', hours: 3.2, sessions: 2 },
  { day: 'Thu', hours: 0.8, sessions: 0 },
  { day: 'Fri', hours: 2.1, sessions: 1 },
  { day: 'Sat', hours: 4.5, sessions: 2 },
  { day: 'Sun', hours: 3.8, sessions: 1 },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

function ContributionCard({ item, onRegister }) {
  const [status, setStatus] = useState(() =>
    contributionService.isRegistered(item.id) ? 'registered' : 'idle'
  );
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (status === 'registered') return;
    setLoading(true);
    setStatus('loading');
    try {
      if (item.isFree) {
        await contributionService.register(item.id, 'me');
      } else {
        // Simulate payment
        await contributionService.simulatePayment({ amount: item.price, sessionTitle: item.title });
        await contributionService.register(item.id, 'me');
      }
      setStatus('registered');
      toast.success(`Registered for "${item.title.slice(0, 30)}..."!`);
      onRegister?.(item);
    } catch (err) {
      setStatus('idle');
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const seatsLeft = item.seats - item.registered;

  return (
    <motion.div
      className="card p-5 flex flex-col gap-4"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
    >
      <div className="flex items-start gap-3">
        <Avatar name={item.speaker.name} initials={item.speaker.initials} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
              {item.speaker.name}
            </span>
            {item.speaker.isVerified && (
              <svg className="w-3.5 h-3.5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{item.speaker.designation}</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          {item.isFree ? (
            <span className="badge badge-success text-xs">Free</span>
          ) : (
            <span className="text-sm font-bold text-indigo-500">₹{item.price}</span>
          )}
          {item.isSponsored && (
            <span className="badge badge-cyan text-[10px]">Sponsored</span>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold leading-snug mb-1" style={{ color: 'var(--text-primary)' }}>
          {item.title}
        </h3>
        <p className="text-xs line-clamp-2" style={{ color: 'var(--text-muted)' }}>
          {item.description}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
        <div className="flex items-center gap-1">
          <Calendar size={11} />
          <span>{new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={11} />
          <span>{item.duration}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users size={11} />
          <span>{seatsLeft} left</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <Star size={13} className="text-amber-400 fill-amber-400" />
          <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
            {item.rating} ({item.ratingCount})
          </span>
        </div>
        <button
          onClick={handleRegister}
          disabled={status === 'registered' || loading}
          className={`btn btn-sm ${status === 'registered' ? 'btn-secondary' : 'btn-primary'}`}
        >
          {loading ? (
            <><span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />Registering...</>
          ) : status === 'registered' ? (
            <>✓ Registered</>
          ) : (
            <>Register {!item.isFree && `· ₹${item.price}`}</>
          )}
        </button>
      </div>
    </motion.div>
  );
}

function MentorCard({ alumni }) {
  const [connected, setConnected] = useState(false);

  return (
    <motion.div className="card p-4 flex flex-col gap-3" whileHover={{ y: -2 }}>
      <div className="flex items-center gap-3">
        <Avatar name={alumni.name} initials={alumni.initials} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{alumni.name}</p>
            {alumni.isVerified && (
              <svg className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
            {alumni.designation} · {alumni.company}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {alumni.skills.slice(0, 3).map((s) => (
          <span key={s} className="badge badge-primary text-[10px]">{s}</span>
        ))}
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Star size={11} className="text-amber-400 fill-amber-400" />
          <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{alumni.rating}</span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>· {alumni.studentsHelped} helped</span>
        </div>
        <button
          onClick={() => { setConnected(true); toast.success(`Connected with ${alumni.name}!`); }}
          className={`btn btn-sm ${connected ? 'btn-secondary' : 'btn-outline-primary'}`}
          disabled={connected}
        >
          {connected ? '✓ Connected' : 'Connect'}
        </button>
      </div>
    </motion.div>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [registeredSessions, setRegisteredSessions] = useState([]);

  const firstName = user?.name?.split(' ')[0] || 'Student';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const handleRegister = (item) => {
    setRegisteredSessions((prev) => [...prev, item]);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 pb-12">
      {/* Hero */}
      <motion.div
        className="rounded-2xl p-6 lg:p-8 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #0891b2 100%)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 opacity-5"
             style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">
              {greeting}, {firstName} 👋
            </h1>
            <p className="text-white/70 text-sm lg:text-base max-w-md">
              Continue building your university legacy. You have 3 upcoming sessions this week.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end mb-0.5">
                <span className="streak-fire text-2xl">🔥</span>
                <span className="text-2xl font-bold text-white">{user?.streak || 12}</span>
              </div>
              <p className="text-white/60 text-xs">Day Streak</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        variants={stagger}
        initial="initial"
        animate="animate"
      >
        {[
          { label: 'Current Streak', value: `${user?.streak || 12} Days`, icon: <Flame size={20} />, color: 'warning', sub: 'Keep it going!' },
          { label: 'Learning Hours', value: `${user?.learningHours || 24.5}h`, icon: <Clock size={20} />, color: 'primary', sub: '+2.5h this week', trend: 12 },
          { label: 'Events Attended', value: user?.eventsAttended || 8, icon: <Calendar size={20} />, color: 'success', sub: 'This semester' },
          { label: 'Contribution Points', value: user?.contributionPoints || 340, icon: <Star size={20} />, color: 'violet', sub: 'Top 15% in batch', trend: 8 },
        ].map((stat) => (
          <motion.div key={stat.label} variants={fadeUp}>
            <StatCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="xl:col-span-2 space-y-6">
          {/* Upcoming Sessions */}
          <motion.div {...fadeUp}>
            <SectionHeader
              title="Upcoming Sessions"
              subtitle="Discover and register for sessions from alumni & professors"
              action={
                <Link to="/contributions" className="btn btn-ghost btn-sm flex items-center gap-1">
                  View all <ArrowRight size={14} />
                </Link>
              }
              className="mb-4"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CONTRIBUTIONS.slice(0, 4).map((item) => (
                <ContributionCard key={item.id} item={item} onRegister={handleRegister} />
              ))}
            </div>
          </motion.div>

          {/* Weekly Progress */}
          <motion.div className="card p-5" {...fadeUp}>
            <SectionHeader title="Weekly Learning Activity" subtitle="Hours spent learning this week" className="mb-4" />
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={WEEKLY_ACTIVITY}>
                <defs>
                  <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 10,
                    fontSize: 12,
                    color: 'var(--text-primary)',
                  }}
                />
                <Area type="monotone" dataKey="hours" stroke="#6366f1" fill="url(#hoursGrad)" strokeWidth={2} dot={{ fill: '#6366f1', strokeWidth: 0, r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Community Activity */}
          <motion.div {...fadeUp}>
            <SectionHeader
              title="Community Activity"
              action={<Link to="/community" className="btn btn-ghost btn-sm flex items-center gap-1">View all <ArrowRight size={14} /></Link>}
              className="mb-4"
            />
            <div className="space-y-3">
              {COMMUNITY_POSTS.slice(0, 2).map((post) => (
                <motion.div key={post.id} className="card p-4" whileHover={{ y: -1 }}>
                  <div className="flex items-start gap-3">
                    <Avatar name={post.author.name} initials={post.author.initials} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{post.author.name}</span>
                        {post.author.isVerified && (
                          <svg className="w-3.5 h-3.5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{post.author.designation}</span>
                      </div>
                      <p className="text-sm line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{post.content}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <span>❤️ {post.likes}</span>
                        <span>💬 {post.comments}</span>
                        <span>🔁 {post.shares}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Announcements */}
          <motion.div className="card p-5" {...fadeUp}>
            <SectionHeader title="Announcements" className="mb-3" />
            <div className="space-y-3">
              {ANNOUNCEMENTS.slice(0, 2).map((ann) => (
                <div key={ann.id} className="flex gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-surface-secondary)' }}>
                  <span className="text-xl">{ann.emoji}</span>
                  <div>
                    <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{ann.title}</p>
                    <p className="text-xs line-clamp-2 mt-0.5" style={{ color: 'var(--text-muted)' }}>{ann.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI Career Assistant */}
          <motion.div
            className="card p-5 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.06))' }}
            {...fadeUp}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg gradient-primary flex items-center justify-center">
                <Zap size={12} className="text-white" />
              </div>
              <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>AI Career Assistant</span>
              <span className="badge badge-violet text-[10px]">Beta</span>
            </div>
            <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
              Ask AI to match you with the right alumni, mentors, and opportunities.
            </p>
            <div className="flex items-center gap-2 p-3 rounded-xl border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}>
              <span className="text-xs flex-1" style={{ color: 'var(--text-muted)' }}>Ask Legacy AI...</span>
              <Zap size={12} className="text-indigo-400" />
            </div>
            <div className="flex flex-col gap-2 mt-3">
              {[
                'Which alumni should I connect with?',
                'Best sessions for ML career?',
                'How to prepare for placements?',
              ].map((q) => (
                <button key={q} className="text-xs text-left text-indigo-500 hover:text-indigo-600 flex items-center gap-1">
                  <ChevronRight size={11} /> {q}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Recommended Mentors */}
          <motion.div {...fadeUp}>
            <SectionHeader
              title="Recommended Mentors"
              action={<Link to="/mentorship" className="btn btn-ghost btn-sm">View all</Link>}
              className="mb-3"
            />
            <div className="flex flex-col gap-3">
              {ALUMNI.filter((a) => a.isMentor).slice(0, 3).map((alumni) => (
                <MentorCard key={alumni.id} alumni={alumni} />
              ))}
            </div>
          </motion.div>

          {/* Achievement Progress */}
          <motion.div className="card p-5" {...fadeUp}>
            <SectionHeader title="Achievement Progress" action={<Link to="/achievements" className="btn btn-ghost btn-sm">View all</Link>} className="mb-4" />
            <div className="space-y-4">
              {BADGES.slice(0, 3).map((badge) => (
                <div key={badge.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{badge.icon}</span>
                      <span className="text-sm font-semibold" style={{ color: badge.isUnlocked ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                        {badge.name}
                      </span>
                    </div>
                    {badge.isUnlocked ? (
                      <span className="badge badge-success text-[10px]">Earned</span>
                    ) : (
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {badge.progress}/{badge.maxProgress}
                      </span>
                    )}
                  </div>
                  {!badge.isUnlocked && (
                    <ProgressBar value={badge.progress || 0} max={badge.maxProgress || 100} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Career Opportunities */}
          <motion.div {...fadeUp}>
            <SectionHeader
              title="Career Opportunities"
              action={<Link to="/opportunities" className="btn btn-ghost btn-sm flex items-center gap-1">View all <ArrowRight size={14} /></Link>}
              className="mb-3"
            />
            <div className="flex flex-col gap-2">
              {OPPORTUNITIES.slice(0, 3).map((opp) => (
                <motion.div key={opp.id} className="card p-3.5" whileHover={{ y: -1 }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {opp.companyInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{opp.title}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{opp.company} · {opp.stipend}</p>
                    </div>
                    <span className={`badge ${opp.type === 'Internship' ? 'badge-cyan' : opp.type === 'Research' ? 'badge-violet' : 'badge-primary'} text-[10px] flex-shrink-0`}>
                      {opp.type}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
