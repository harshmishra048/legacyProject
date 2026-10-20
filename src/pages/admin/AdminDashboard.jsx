import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users, BarChart2, DollarSign, TrendingUp, Activity, UserCheck,
  Calendar, Award, ShieldCheck, Eye, ArrowRight, AlertCircle
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell
} from 'recharts';
import { StatCard, SectionHeader, Badge, Avatar, Button } from '../../components/ui';
import { PLATFORM_STATS, ALUMNI, CONTRIBUTIONS, EARNINGS_DATA } from '../../data/mockData';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

const USER_COMPOSITION = [
  { name: 'Students', value: 4891, color: '#06b6d4' },
  { name: 'Alumni', value: 2187, color: '#6366f1' },
  { name: 'Professors', value: 342, color: '#8b5cf6' },
  { name: 'Recruiters', value: 156, color: '#10b981' },
];

const PENDING_APPROVALS = [
  { id: 1, name: 'Vikram Nair', type: 'Alumni Verification', time: '2h ago', status: 'pending' },
  { id: 2, name: 'Ananya Krishnan', type: 'Contribution Approval', time: '5h ago', status: 'pending' },
  { id: 3, name: 'Dr. Meera Joshi', type: 'Professor Verification', time: '1d ago', status: 'pending' },
  { id: 4, name: 'Rohit Gupta', type: 'Reported Content', time: '1d ago', status: 'flagged' },
];

export default function AdminDashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          Platform Overview
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Monitor and manage the Legacy Sphere ecosystem.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        {[
          { label: 'Total Users', value: PLATFORM_STATS.totalUsers.toLocaleString(), icon: <Users size={20} />, color: 'primary', trend: 11 },
          { label: 'Active Users', value: PLATFORM_STATS.activeUsers.toLocaleString(), icon: <Activity size={20} />, color: 'success', sub: `${((PLATFORM_STATS.activeUsers / PLATFORM_STATS.totalUsers) * 100).toFixed(0)}% of total` },
          { label: 'Total Sessions', value: PLATFORM_STATS.sessions, icon: <Calendar size={20} />, color: 'violet', trend: 18 },
          { label: 'Platform Revenue', value: `₹${(PLATFORM_STATS.revenue / 100000).toFixed(1)}L`, icon: <DollarSign size={20} />, color: 'warning', trend: 22 },
        ].map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* User Growth */}
          <motion.div className="card p-5" {...fadeUp}>
            <SectionHeader title="User Growth" subtitle="Monthly new user registrations" className="mb-4" />
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={PLATFORM_STATS.userGrowth}>
                <defs>
                  <linearGradient id="userGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-default)', borderRadius: 10, fontSize: 12 }} />
                <Area type="monotone" dataKey="users" stroke="#6366f1" fill="url(#userGrowthGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Revenue chart */}
          <motion.div className="card p-5" {...fadeUp}>
            <SectionHeader title="Revenue Trend" subtitle="Monthly platform revenue from contributions" className="mb-4" />
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={PLATFORM_STATS.revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']} contentStyle={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-default)', borderRadius: 10, fontSize: 12 }} />
                <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div className="card p-5" {...fadeUp}>
            <SectionHeader title="Recent Transactions" className="mb-4" />
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr><th>Session</th><th>Participant</th><th>Amount</th><th>Status</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {EARNINGS_DATA.transactions.map((txn) => (
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
                      <td className="text-xs">{txn.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Right panel */}
        <div className="space-y-5">
          {/* User composition */}
          <motion.div className="card p-5" {...fadeUp}>
            <SectionHeader title="User Composition" className="mb-4" />
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={USER_COMPOSITION} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                  {USER_COMPOSITION.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, name) => [v.toLocaleString(), name]} contentStyle={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-default)', borderRadius: 10, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-2 justify-center">
              {USER_COMPOSITION.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{item.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Pending approvals */}
          <motion.div className="card p-5" {...fadeUp}>
            <SectionHeader title="Pending Approvals" subtitle={`${PENDING_APPROVALS.length} items need attention`} className="mb-3" />
            <div className="space-y-2">
              {PENDING_APPROVALS.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-surface-secondary)' }}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.status === 'flagged' ? 'bg-rose-100 text-rose-500' : 'bg-amber-100 text-amber-600'}`}>
                    {item.status === 'flagged' ? <AlertCircle size={15} /> : <ShieldCheck size={15} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                    <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{item.type} · {item.time}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="primary" size="sm" className="px-2 py-1 text-[11px]">Approve</Button>
                    <Button variant="ghost" size="sm" className="px-2 py-1 text-[11px]">View</Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick stats */}
          <motion.div className="card p-5" {...fadeUp}>
            <SectionHeader title="Engagement" className="mb-3" />
            <div className="space-y-3">
              {[
                { label: 'Avg. Session Rating', value: '4.8 ⭐', color: 'var(--text-primary)' },
                { label: 'Sessions This Month', value: '28', color: '#6366f1' },
                { label: 'Engagement Rate', value: `${PLATFORM_STATS.engagement}%`, color: '#10b981' },
                { label: 'Pending Reports', value: '3', color: '#f43f5e' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                  <span className="text-sm font-bold" style={{ color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top contributors */}
          <motion.div className="card p-5" {...fadeUp}>
            <SectionHeader title="Top Contributors" className="mb-3" />
            <div className="space-y-2">
              {ALUMNI.slice(0, 4).map((a, i) => (
                <div key={a.id} className="flex items-center gap-3 py-2">
                  <span className="text-xs font-bold w-5 text-center" style={{ color: 'var(--text-muted)' }}>#{i + 1}</span>
                  <Avatar name={a.name} initials={a.initials} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{a.name}</p>
                    <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{a.sessionsHosted} sessions · {a.studentsHelped} students</p>
                  </div>
                  <span className="text-xs font-bold text-indigo-500">{a.legacyScore?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
