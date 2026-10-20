import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus, TrendingUp, Users, DollarSign, Star, ArrowRight, Eye,
  Calendar, Clock, ChevronRight, Zap, Award, Target
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, Legend, AreaChart, Area
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { Avatar, Badge, Button, StatCard, Card, SectionHeader } from '../../components/ui';
import { CONTRIBUTIONS, EARNINGS_DATA } from '../../data/mockData';
import toast from 'react-hot-toast';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

export default function AlumniDashboard() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Alumni';

  const [impactStats] = useState({
    studentsHelped: 128,
    sessionsHosted: 24,
    totalEarnings: 48500,
    contributionScore: 92,
  });

  const mySessions = CONTRIBUTIONS.filter((c) => c.speaker.company === 'Microsoft India' || c.speaker.company === 'Google');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 pb-12">
      {/* Hero */}
      <motion.div
        className="rounded-2xl p-6 lg:p-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #0f172a 100%)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute inset-0 opacity-5"
             style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full opacity-10"
             style={{ background: 'radial-gradient(circle, #818cf8, transparent)' }} />

        <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <Avatar name={user?.name} initials={user?.initials} size="md" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Welcome back,</p>
                <h1 className="text-xl font-bold text-white">{firstName}</h1>
              </div>
            </div>
            <p className="text-white/70 text-base max-w-lg font-medium">
              Your experience can shape someone's future. 🌟
            </p>
            <p className="text-white/50 text-sm mt-1">
              You have helped {impactStats.studentsHelped} students this year. Keep building your legacy.
            </p>
          </div>
          <Link to="/contributions/create"
                className="btn btn-xl flex items-center gap-2"
                style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Plus size={18} />
            Create Contribution
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {[
          { label: 'Students Helped', value: impactStats.studentsHelped, icon: <Users size={20} />, color: 'success', trend: 15 },
          { label: 'Sessions Hosted', value: impactStats.sessionsHosted, icon: <Calendar size={20} />, color: 'primary' },
          { label: 'Total Earnings', value: `₹${impactStats.totalEarnings.toLocaleString('en-IN')}`, icon: <DollarSign size={20} />, color: 'warning', trend: 22 },
          { label: 'Contribution Score', value: `${impactStats.contributionScore}/100`, icon: <Star size={20} />, color: 'violet', sub: 'Top 5% on platform' },
        ].map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* Earnings Chart */}
          <motion.div className="card p-5" {...fadeUp}>
            <SectionHeader
              title="Earnings Overview"
              subtitle="Monthly earnings from your contributions"
              action={<Link to="/alumni/earnings" className="btn btn-ghost btn-sm flex items-center gap-1">View details <ArrowRight size={14} /></Link>}
              className="mb-4"
            />
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={EARNINGS_DATA.monthly}>
                <defs>
                  <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Earnings']}
                  contentStyle={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-default)', borderRadius: 10, fontSize: 12 }}
                />
                <Area type="monotone" dataKey="earnings" stroke="#6366f1" fill="url(#earningsGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* My Sessions */}
          <motion.div {...fadeUp}>
            <SectionHeader
              title="My Active Sessions"
              action={<Link to="/alumni/sessions" className="btn btn-ghost btn-sm flex items-center gap-1">Manage all <ArrowRight size={14} /></Link>}
              className="mb-3"
            />
            <div className="space-y-3">
              {CONTRIBUTIONS.slice(0, 3).map((session) => (
                <motion.div key={session.id} className="card p-4" whileHover={{ y: -1 }}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                      <Calendar size={18} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{session.title}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {new Date(session.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {session.registered}/{session.seats} registered
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {session.isFree ? (
                        <span className="badge badge-success text-[10px]">Free</span>
                      ) : (
                        <span className="text-sm font-bold text-indigo-500">₹{session.price}</span>
                      )}
                      <span className="badge badge-primary text-[10px]">Upcoming</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div className="card p-5" {...fadeUp}>
            <SectionHeader
              title="Recent Transactions"
              action={<Link to="/alumni/earnings" className="btn btn-ghost btn-sm">View all</Link>}
              className="mb-4"
            />
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Session</th>
                    <th>Participant</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {EARNINGS_DATA.transactions.slice(0, 4).map((txn) => (
                    <tr key={txn.id}>
                      <td className="font-medium" style={{ color: 'var(--text-primary)', maxWidth: 180 }}>
                        <span className="block truncate">{txn.session}</span>
                      </td>
                      <td>{txn.participant}</td>
                      <td className="font-bold" style={{ color: 'var(--text-primary)' }}>₹{txn.amount}</td>
                      <td>
                        <span className={`badge ${txn.status === 'completed' ? 'badge-success' : txn.status === 'pending' ? 'badge-warning' : 'badge-danger'} text-[10px]`}>
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Legacy Score */}
          <motion.div className="card p-5 text-center" {...fadeUp}
                       style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.04))' }}>
            <div className="flex items-center gap-2 justify-center mb-4">
              <Zap size={18} className="text-indigo-500" />
              <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Legacy Score</span>
            </div>
            <div className="text-4xl font-bold gradient-text mb-1">{user?.legacyScore?.toLocaleString() || '8,420'}</div>
            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Top 5% of all alumni on platform</p>
            <div className="space-y-2.5 text-left">
              {[
                { label: 'Sessions', value: 85 },
                { label: 'Mentorship', value: 92 },
                { label: 'Community', value: 74 },
                { label: 'Knowledge', value: 88 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                    <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>{item.value}%</span>
                  </div>
                  <div className="progress-bar h-1.5">
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick earnings summary */}
          <motion.div className="card p-5" {...fadeUp}>
            <SectionHeader title="Earnings Summary" action={<Link to="/alumni/earnings" className="btn btn-ghost btn-sm">Details</Link>} className="mb-3" />
            <div className="space-y-3">
              {[
                { label: 'Total Earnings', value: `₹${EARNINGS_DATA.total.toLocaleString('en-IN')}`, color: 'var(--text-primary)' },
                { label: 'This Month', value: `₹${EARNINGS_DATA.thisMonth.toLocaleString('en-IN')}`, color: '#10b981' },
                { label: 'Pending', value: `₹${EARNINGS_DATA.pending.toLocaleString('en-IN')}`, color: '#f59e0b' },
                { label: 'Withdrawable', value: `₹${EARNINGS_DATA.withdrawable.toLocaleString('en-IN')}`, color: '#6366f1' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                  <span className="text-sm font-bold" style={{ color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
            <Button variant="primary" size="sm" className="w-full mt-4" onClick={() => toast.success('Withdrawal initiated! (Demo)')}>
              Withdraw Funds
            </Button>
          </motion.div>

          {/* Recent appreciations */}
          <motion.div className="card p-5" {...fadeUp}>
            <SectionHeader title="Recent Appreciations" className="mb-3" />
            <div className="space-y-3">
              {[
                { student: 'Arjun S.', message: '🚀 Inspired Me', session: 'Breaking Into Big Tech' },
                { student: 'Meghna P.', message: '💡 Very Helpful', session: 'Breaking Into Big Tech' },
                { student: 'Rohit G.', message: '⭐ Excellent Session', session: 'System Design Workshop' },
              ].map((ap, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-surface-secondary)' }}>
                  <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-sm">
                    {ap.message.split(' ')[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {ap.student} — {ap.message.split(' ').slice(1).join(' ')}
                    </p>
                    <p className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{ap.session}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
