import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Star, Calendar, Clock, Users, MapPin,
  ArrowRight, Zap, CheckCircle2, X, SlidersHorizontal
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar, Badge, Button, StatCard, SectionHeader, EmptyState } from '../../components/ui';
import { CONTRIBUTIONS } from '../../data/mockData';
import { contributionService } from '../../services/contributionService';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'All', 'Career Talks', 'Technical', 'Masterclasses', 'Research',
  'Mentorship', 'Seminars', 'Workshops',
];

const TYPE_COLORS = {
  'Career Talk': 'badge-primary',
  'Workshop': 'badge-cyan',
  'Masterclass': 'badge-violet',
  'Research Session': 'badge-success',
  'Mock Interview': 'badge-warning',
  'Seminar': 'badge-danger',
};

function ContributionCard({ item, index }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState(() =>
    contributionService.isRegistered(item.id) ? 'registered' : 'idle'
  );
  const [loading, setLoading] = useState(false);

  const seatsLeft = item.seats - item.registered;
  const fillPct = (item.registered / item.seats) * 100;

  const handleRegister = async (e) => {
    e.stopPropagation();
    if (status === 'registered') {
      toast('Already registered!', { icon: '✅' });
      return;
    }
    setLoading(true);
    setStatus('loading');
    try {
      if (!item.isFree) {
        await contributionService.simulatePayment({ amount: item.price, sessionTitle: item.title });
      }
      await contributionService.register(item.id, 'me');
      setStatus('registered');
      toast.success(`Registered! You'll receive a reminder before the session.`);
    } catch (err) {
      setStatus('idle');
      toast.error(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card p-5 flex flex-col gap-4 cursor-pointer group"
      onClick={() => navigate(`/contributions/${item.id}`)}
      whileHover={{ y: -3 }}
    >
      {/* Speaker row */}
      <div className="flex items-start gap-3">
        <div className="relative">
          <Avatar name={item.speaker.name} initials={item.speaker.initials} size="md" />
          {item.speaker.isVerified && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center">
              <CheckCircle2 size={10} className="text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
            {item.speaker.name}
          </p>
          <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
            {item.speaker.designation} · {item.speaker.company}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`badge ${TYPE_COLORS[item.type] || 'badge-default'} text-[10px]`}>
            {item.type}
          </span>
          {item.isSponsored && (
            <span className="badge badge-warning text-[10px]">Sponsored</span>
          )}
        </div>
      </div>

      {/* Title & description */}
      <div>
        <h3 className="text-sm font-bold leading-snug mb-1.5 group-hover:text-indigo-500 transition-colors" style={{ color: 'var(--text-primary)' }}>
          {item.title}
        </h3>
        <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {item.description}
        </p>
      </div>

      {/* Meta */}
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
          <MapPin size={11} />
          <span>{item.mode}</span>
        </div>
      </div>

      {/* Seats progress */}
      <div>
        <div className="flex justify-between text-[11px] mb-1" style={{ color: 'var(--text-muted)' }}>
          <span>{item.registered} registered</span>
          <span>{seatsLeft} seats left</span>
        </div>
        <div className="progress-bar h-1.5">
          <div className="progress-fill" style={{ width: `${fillPct}%`, background: fillPct > 80 ? '#f43f5e' : 'linear-gradient(90deg, #6366f1, #8b5cf6)' }} />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Star size={13} className="text-amber-400 fill-amber-400" />
          <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
            {item.rating} <span style={{ color: 'var(--text-muted)' }}>({item.ratingCount})</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          {item.isFree ? (
            <span className="badge badge-success">Free</span>
          ) : (
            <span className="text-base font-bold text-indigo-500">₹{item.price}</span>
          )}
          <button
            className={`btn btn-sm ${status === 'registered' ? 'btn-secondary' : 'btn-primary'}`}
            onClick={handleRegister}
            disabled={status === 'registered' || loading}
          >
            {loading ? (
              <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : status === 'registered' ? (
              '✓ Registered'
            ) : (
              'Register'
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function ContributionsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [contributions, setContributions] = useState(CONTRIBUTIONS);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      let filtered = [...CONTRIBUTIONS];
      if (activeCategory !== 'All') {
        filtered = filtered.filter((c) => c.category === activeCategory || c.type === activeCategory);
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        filtered = filtered.filter((c) =>
          c.title.toLowerCase().includes(q) ||
          c.speaker.name.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      setContributions(filtered);
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, activeCategory]);

  return (
    <div className="p-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              Legacy Contributions
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Learn from the people who walked the path before you.
            </p>
          </div>
          <Link to="/contributions/create" className="btn btn-primary btn-md flex items-center gap-2">
            <Zap size={16} />
            Create Contribution
          </Link>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap gap-6 mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>
          {[
            { label: 'Total Sessions', value: CONTRIBUTIONS.length },
            { label: 'This Month', value: 18 },
            { label: 'Free Sessions', value: CONTRIBUTIONS.filter((c) => c.isFree).length },
            { label: 'Total Registered', value: CONTRIBUTIONS.reduce((a, c) => a + c.registered, 0) },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-1.5">
              <span className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{s.value}</span>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Search & Filters */}
      <motion.div className="flex flex-col gap-4 mb-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            className="input pl-10 input-lg"
            placeholder="Search sessions, speakers, topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
              <X size={15} />
            </button>
          )}
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-all flex-shrink-0"
              style={{
                background: activeCategory === cat ? '#6366f1' : 'var(--bg-surface)',
                color: activeCategory === cat ? 'white' : 'var(--text-secondary)',
                border: `1px solid ${activeCategory === cat ? '#6366f1' : 'var(--border-default)'}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Results */}
      {contributions.length === 0 ? (
        <EmptyState
          icon="🎤"
          title="No sessions found"
          description="Try adjusting your search or filters to find sessions that match your interests."
          action={<Button variant="primary" size="md" onClick={() => { setSearch(''); setActiveCategory('All'); }}>Clear Filters</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence>
            {contributions.map((item, i) => (
              <ContributionCard key={item.id} item={item} index={i} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
