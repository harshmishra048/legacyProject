import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Briefcase, Calendar, ExternalLink, Bookmark, Zap } from 'lucide-react';
import { Badge, Button, EmptyState } from '../../components/ui';
import { OPPORTUNITIES } from '../../data/mockData';
import toast from 'react-hot-toast';

const TYPES = ['All', 'Internship', 'Job', 'Research', 'Freelance'];

const TYPE_COLORS = {
  Internship: 'badge-cyan',
  Job: 'badge-primary',
  Research: 'badge-violet',
  Freelance: 'badge-warning',
  Startup: 'badge-success',
};

export default function OpportunitiesPage() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [saved, setSaved] = useState({});

  const filtered = OPPORTUNITIES.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch = !q || o.title.toLowerCase().includes(q) || o.company.toLowerCase().includes(q) || o.skills.some((s) => s.toLowerCase().includes(q));
    const matchType = type === 'All' || o.type === type;
    return matchSearch && matchType;
  });

  const toggleSave = (id) => {
    setSaved((prev) => ({ ...prev, [id]: !prev[id] }));
    toast(saved[id] ? 'Removed from saved' : 'Opportunity saved!', { icon: saved[id] ? '💔' : '🔖' });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto pb-12">
      <motion.div className="mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Opportunities</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Internships, jobs, research positions, and more from top companies and alumni.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: 'rgba(99,102,241,0.08)' }}>
              <Zap size={14} className="text-indigo-500" />
              <span className="text-xs font-semibold text-indigo-500">AI Match</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-60">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input className="input pl-10" placeholder="Search opportunities, companies, skills..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {TYPES.map((t) => (
            <button key={t} onClick={() => setType(t)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all flex-shrink-0"
              style={{ background: type === t ? '#6366f1' : 'var(--bg-surface)', color: type === t ? 'white' : 'var(--text-secondary)', border: `1px solid ${type === t ? '#6366f1' : 'var(--border-default)'}` }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="💼" title="No opportunities found" description="Try adjusting your search or filters." action={<Button variant="primary" size="md" onClick={() => { setSearch(''); setType('All'); }}>Clear Filters</Button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((opp, i) => (
            <motion.div
              key={opp.id}
              className="card p-5 flex flex-col gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -2 }}
            >
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {opp.companyInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{opp.title}</h3>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{opp.company}</p>
                </div>
                <span className={`badge ${TYPE_COLORS[opp.type] || 'badge-default'} text-[10px]`}>{opp.type}</span>
              </div>

              <div className="flex flex-wrap gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span className="flex items-center gap-1"><MapPin size={11} /> {opp.location}</span>
                <span className="flex items-center gap-1"><Briefcase size={11} /> {opp.duration}</span>
                <span className="flex items-center gap-1"><Calendar size={11} /> Due {new Date(opp.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {opp.skills.slice(0, 4).map((s) => <span key={s} className="badge badge-default text-[10px]">{s}</span>)}
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-indigo-500">{opp.stipend}</span>
                  {opp.isAlumniReferred && <Badge variant="success">Alumni Referred</Badge>}
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-ghost btn-sm" onClick={() => toggleSave(opp.id)}>
                    <Bookmark size={15} className={saved[opp.id] ? 'fill-indigo-500 text-indigo-500' : ''} />
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={() => toast.success('Application submitted! (Demo)')}>
                    Apply
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px]" style={{ color: 'var(--text-muted)' }}>
                <span>Posted by {opp.postedBy}</span>
                <span>{opp.applicants} applicants</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
