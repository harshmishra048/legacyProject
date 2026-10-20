import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Star, DollarSign, Calendar, Plus, ArrowRight, FlaskConical, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { StatCard, SectionHeader, Button } from '../../components/ui';
import { CONTRIBUTIONS, ANNOUNCEMENTS } from '../../data/mockData';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

const REGISTRATION_DATA = [
  { month: 'Apr', registrations: 45 }, { month: 'May', registrations: 72 },
  { month: 'Jun', registrations: 89 }, { month: 'Jul', registrations: 134 },
  { month: 'Aug', registrations: 97 },
];

export default function ProfessorDashboard() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Professor';

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 pb-12">
      {/* Hero */}
      <motion.div
        className="rounded-2xl p-6 lg:p-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #2d1b69 60%, #0e0e1a 100%)' }}
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute inset-0 opacity-5"
             style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">
              Good morning, Dr. {firstName} 👩‍🏫
            </h1>
            <p className="text-white/70 text-base max-w-lg">
              Share knowledge. Inspire the next generation. 🔬
            </p>
          </div>
          <Link to="/contributions/create" className="btn btn-xl flex items-center gap-2"
                style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Plus size={18} /> New Session
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Students Reached', value: '1,284', icon: <Users size={20} />, color: 'success', trend: 18 },
          { label: 'Sessions Conducted', value: '42', icon: <Calendar size={20} />, color: 'primary' },
          { label: 'Average Rating', value: '4.9 ⭐', icon: <Star size={20} />, color: 'warning' },
          { label: 'Earnings', value: '₹32,800', icon: <DollarSign size={20} />, color: 'violet', trend: 12 },
        ].map((stat) => <StatCard key={stat.label} {...stat} />)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* Registration chart */}
          <motion.div className="card p-5" {...fadeUp}>
            <SectionHeader title="Session Registrations" subtitle="Monthly student registrations across your sessions" className="mb-4" />
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={REGISTRATION_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-default)', borderRadius: 10, fontSize: 12 }} />
                <Bar dataKey="registrations" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Active sessions */}
          <motion.div {...fadeUp}>
            <SectionHeader
              title="Upcoming Sessions"
              action={<Link to="/professor/sessions" className="btn btn-ghost btn-sm flex items-center gap-1">Manage <ArrowRight size={14} /></Link>}
              className="mb-3"
            />
            <div className="space-y-3">
              {CONTRIBUTIONS.filter((c) => c.speaker.initials === 'KM' || c.type === 'Research Session').slice(0, 3).map((s) => (
                <motion.div key={s.id} className="card p-4 flex items-center gap-4" whileHover={{ y: -1 }}>
                  <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <FlaskConical size={18} className="text-violet-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{s.title}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {new Date(s.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {s.registered}/{s.seats} registered
                    </p>
                  </div>
                  <span className={`badge ${s.isFree ? 'badge-success' : 'badge-primary'} text-[10px] flex-shrink-0`}>
                    {s.isFree ? 'Free' : `₹${s.price}`}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right panel */}
        <div className="space-y-5">
          {/* Student questions */}
          <motion.div className="card p-5" {...fadeUp}>
            <SectionHeader title="Student Questions" className="mb-3" />
            <div className="space-y-3">
              {[
                { student: 'Arjun Sharma', q: 'Can you recommend papers for my thesis on Federated Learning?', time: '2h ago' },
                { student: 'Neha Gupta', q: 'What are the prerequisites for your Advanced ML session?', time: '5h ago' },
                { student: 'Rishabh Jain', q: 'Is the Research Assistant position still open?', time: '1d ago' },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl" style={{ background: 'var(--bg-surface-secondary)' }}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{item.student}</span>
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{item.time}</span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.q}</p>
                  <Button variant="ghost" size="sm" className="mt-2 text-indigo-500 p-0 h-auto font-semibold text-xs">Reply →</Button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Announcements */}
          <motion.div className="card p-5" {...fadeUp}>
            <SectionHeader
              title="Post Announcement"
              action={<Button variant="primary" size="sm" onClick={() => {}}>Post</Button>}
              className="mb-3"
            />
            <textarea
              className="input resize-none text-sm"
              rows={4}
              placeholder="Share an announcement with your students..."
              style={{ fontFamily: 'var(--font-sans)' }}
            />
          </motion.div>

          {/* Research highlights */}
          <motion.div className="card p-5" {...fadeUp}>
            <SectionHeader title="Research Highlights" className="mb-3" />
            <div className="space-y-2">
              {[
                { title: 'Federated Learning for Healthcare', status: 'Ongoing', collab: 'IIT Delhi + AIIMS' },
                { title: 'LLM Compression Techniques', status: 'Published', collab: 'Solo' },
                { title: 'NLP for Indian Languages', status: 'Submitted', collab: 'IISc Collaboration' },
              ].map((r, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-surface-secondary)' }}>
                  <FlaskConical size={14} className="text-violet-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{r.title}</p>
                    <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{r.collab}</p>
                  </div>
                  <span className={`badge text-[10px] ${r.status === 'Published' ? 'badge-success' : r.status === 'Ongoing' ? 'badge-primary' : 'badge-warning'}`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
