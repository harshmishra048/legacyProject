import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Users as UsersIcon, Filter, X } from 'lucide-react';
import { Avatar, Badge, Button, EmptyState, VerifiedBadge } from '../../components/ui';
import { ALUMNI, PROFESSORS } from '../../data/mockData';
import toast from 'react-hot-toast';

const FILTERS = {
  departments: ['All', 'Computer Science & Engineering', 'Electrical Engineering', 'Mathematics & Computing'],
  companies: ['All', 'Microsoft India', 'Google', 'Netflix', 'Sequoia Capital India', 'TechSprint AI', 'DeepMind London'],
  batches: ['All', '2016-2020', '2017-2021', '2018-2022', '2019-2023'],
};

function PersonCard({ person, type = 'alumni' }) {
  const [connected, setConnected] = useState(false);
  return (
    <motion.div className="card p-5 flex flex-col gap-4" whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
      <div className="flex items-start gap-3">
        <Avatar name={person.name} initials={person.initials} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <h3 className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{person.name}</h3>
            {person.isVerified && <VerifiedBadge />}
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {person.designation} {person.company ? `· ${person.company}` : ''}
          </p>
          {type === 'alumni' && (
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {person.department} · {person.batch}
            </p>
          )}
          {type === 'professor' && (
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {person.department} · {person.experience}
            </p>
          )}
        </div>
      </div>
      {person.location && (
        <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          <MapPin size={11} /> {person.location}
        </div>
      )}
      <div className="flex flex-wrap gap-1.5">
        {(person.skills || person.researchInterests || []).slice(0, 4).map((s) => (
          <span key={s} className="badge badge-primary text-[10px]">{s}</span>
        ))}
      </div>
      <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
        {person.rating && (
          <span className="flex items-center gap-1"><Star size={11} className="text-amber-400 fill-amber-400" />{person.rating}</span>
        )}
        <span>{person.sessionsHosted || person.sessions || 0} sessions</span>
        <span>{person.studentsHelped || person.studentsReached || 0} students</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        {person.isMentor && <Badge variant="success">Available for Mentorship</Badge>}
        <div className="flex gap-2 ml-auto">
          <button className="btn btn-ghost btn-sm" onClick={() => toast('Profile view coming soon!', { icon: '👀' })}>View</button>
          <button
            className={`btn btn-sm ${connected ? 'btn-secondary' : 'btn-primary'}`}
            onClick={() => { setConnected(!connected); toast.success(connected ? 'Disconnected' : `Connected with ${person.name}!`); }}
          >
            {connected ? '✓ Connected' : 'Connect'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function AlumniDirectoryPage() {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [tab, setTab] = useState('alumni');

  const data = tab === 'alumni' ? ALUMNI : PROFESSORS;
  const filtered = data.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || (p.company || '').toLowerCase().includes(q) || (p.department || '').toLowerCase().includes(q);
    const matchDept = department === 'All' || p.department === department;
    return matchSearch && matchDept;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto pb-12">
      <motion.div className="mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Discover People</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Connect with alumni, professors, and mentors from your university.</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {[{ id: 'alumni', label: 'Alumni', count: ALUMNI.length }, { id: 'professors', label: 'Professors', count: PROFESSORS.length }].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ background: tab === t.id ? '#6366f1' : 'var(--bg-surface)', color: tab === t.id ? 'white' : 'var(--text-secondary)', border: `1px solid ${tab === t.id ? '#6366f1' : 'var(--border-default)'}` }}>
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-60">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input className="input pl-10" placeholder={`Search ${tab}...`} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="select w-auto min-w-48" value={department} onChange={(e) => setDepartment(e.target.value)}>
          {FILTERS.departments.map((d) => <option key={d}>{d}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="🔍" title="No people found" description="Try adjusting your search or filters." action={<Button variant="primary" size="md" onClick={() => { setSearch(''); setDepartment('All'); }}>Clear Filters</Button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <PersonCard person={p} type={tab === 'professors' ? 'professor' : 'alumni'} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
