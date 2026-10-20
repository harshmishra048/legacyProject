import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, MapPin, Users, Star, Globe, ChevronLeft,
  CheckCircle2, Heart, Zap, Share2, Bookmark, ArrowRight
} from 'lucide-react';
import { Avatar, Badge, Button, ProgressBar, EmptyState, Spinner } from '../../components/ui';
import { CONTRIBUTIONS } from '../../data/mockData';
import { contributionService } from '../../services/contributionService';
import toast from 'react-hot-toast';

const REACTIONS = [
  { emoji: '🙏', label: 'Thank You' },
  { emoji: '⭐', label: 'Excellent' },
  { emoji: '💡', label: 'Helpful' },
  { emoji: '🚀', label: 'Inspired Me' },
  { emoji: '❤️', label: 'Loved It' },
];

export default function ContributionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regStatus, setRegStatus] = useState('idle');
  const [regLoading, setRegLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const item = CONTRIBUTIONS.find((c) => c.id === id);
    if (item) {
      setSession(item);
      setRegStatus(contributionService.isRegistered(item.id) ? 'registered' : 'idle');
    }
    setLoading(false);
  }, [id]);

  const handleRegister = async () => {
    if (regStatus === 'registered') return;
    setRegLoading(true);
    setRegStatus('loading');
    try {
      if (!session.isFree) {
        setShowPaymentModal(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setShowPaymentModal(false);
      }
      await contributionService.register(session.id, 'me');
      setRegStatus('registered');
      toast.success('Successfully registered! You will receive a reminder.');
    } catch (err) {
      setRegStatus('idle');
      setShowPaymentModal(false);
      toast.error(err.message || 'Registration failed');
    } finally {
      setRegLoading(false);
    }
  };

  const handleReaction = (reaction) => {
    setSelectedReaction(reaction);
    toast.success(`${reaction.emoji} ${reaction.label} — Your appreciation has been sent!`);
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!session) return <EmptyState icon="🔍" title="Session not found" description="This session doesn't exist or has been removed." action={<Link to="/contributions" className="btn btn-primary btn-md">Browse Sessions</Link>} />;

  const seatsLeft = session.seats - session.registered;
  const fillPct = (session.registered / session.seats) * 100;

  return (
    <div className="max-w-5xl mx-auto p-6 pb-12 space-y-8">
      {/* Back button */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm font-semibold text-indigo-500 hover:text-indigo-600">
        <ChevronLeft size={16} /> Back to sessions
      </button>

      {/* Hero */}
      <motion.div
        className="rounded-2xl p-6 lg:p-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #0f172a 100%)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="badge badge-primary">{session.type}</span>
            {session.isSponsored && <span className="badge badge-warning">University Sponsored</span>}
            {session.isFree && <span className="badge badge-success">Free</span>}
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-3 leading-tight">
            {session.title}
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            <Avatar name={session.speaker.name} initials={session.speaker.initials} size="md" ring />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-white font-semibold text-sm">{session.speaker.name}</span>
                {session.speaker.isVerified && <CheckCircle2 size={14} className="text-indigo-300" />}
              </div>
              <span className="text-white/60 text-xs">{session.speaker.designation} · {session.speaker.company}</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <motion.div className="card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>About this session</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{session.description}</p>
          </motion.div>

          {/* What you'll learn */}
          {session.learnings && (
            <motion.div className="card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>What you'll learn</h2>
              <ul className="space-y-2">
                {session.learnings.map((l, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    {l}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Agenda */}
          {session.agenda && (
            <motion.div className="card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Agenda</h2>
              <div className="space-y-3">
                {session.agenda.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">{i + 1}</div>
                      {i < session.agenda.length - 1 && <div className="w-0.5 flex-1 my-1" style={{ background: 'var(--border-default)' }} />}
                    </div>
                    <p className="text-sm py-1" style={{ color: 'var(--text-secondary)' }}>{item}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Appreciation / Thank You */}
          <motion.div className="card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Show Appreciation</h2>
            <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Let the speaker know how this session helped you.</p>
            <div className="flex flex-wrap gap-3">
              {REACTIONS.map((r) => (
                <motion.button
                  key={r.label}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all"
                  style={{
                    background: selectedReaction?.label === r.label ? 'rgba(99,102,241,0.08)' : 'var(--bg-surface)',
                    borderColor: selectedReaction?.label === r.label ? '#6366f1' : 'var(--border-default)',
                    color: selectedReaction?.label === r.label ? '#6366f1' : 'var(--text-secondary)',
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleReaction(r)}
                >
                  <span className="text-xl">{r.emoji}</span>
                  {r.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Reviews */}
          <motion.div className="card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Reviews ({session.ratingCount})</h2>
            <div className="space-y-4">
              {[
                { name: 'Arjun Sharma', rating: 5, comment: 'Best session I have attended! The insights on system design were extremely practical.', time: '2 weeks ago' },
                { name: 'Neha Gupta', rating: 5, comment: 'Priya explained everything so clearly. The Q&A session was very helpful.', time: '2 weeks ago' },
                { name: 'Rishabh Jain', rating: 4, comment: 'Great content, would love a follow-up session on advanced topics.', time: '3 weeks ago' },
              ].map((review, i) => (
                <div key={i} className="flex gap-3 py-3" style={{ borderBottom: i < 2 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <Avatar name={review.name} size="sm" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{review.name}</span>
                      <div className="flex">{Array.from({ length: review.rating }, (_, j) => <Star key={j} size={11} className="text-amber-400 fill-amber-400" />)}</div>
                      <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{review.time}</span>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Registration card */}
          <motion.div className="card p-5 sticky top-20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="text-center mb-4">
              {session.isFree ? (
                <p className="text-2xl font-bold text-emerald-500">Free</p>
              ) : (
                <p className="text-3xl font-bold text-indigo-500">₹{session.price}</p>
              )}
              {!session.isFree && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>One-time payment</p>}
            </div>

            <Button
              variant="primary"
              size="xl"
              className="w-full mb-4"
              loading={regLoading}
              onClick={handleRegister}
              disabled={regStatus === 'registered'}
            >
              {regStatus === 'registered' ? '✓ Registered' : regLoading ? 'Processing...' : `Register Now${!session.isFree ? ` · ₹${session.price}` : ''}`}
            </Button>

            {regStatus === 'registered' && (
              <div className="flex gap-2 mb-4">
                <Button variant="secondary" size="sm" className="flex-1">Add to Calendar</Button>
                <Button variant="ghost" size="sm" className="flex-1 text-rose-500" onClick={async () => {
                  await contributionService.cancelRegistration(session.id);
                  setRegStatus('idle');
                  toast('Registration cancelled.', { icon: '❌' });
                }}>Cancel</Button>
              </div>
            )}

            <div className="divider mb-4" />

            {/* Session info */}
            <div className="space-y-3">
              {[
                { icon: Calendar, label: 'Date', value: new Date(session.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) },
                { icon: Clock, label: 'Time', value: session.time },
                { icon: Clock, label: 'Duration', value: session.duration },
                { icon: MapPin, label: 'Mode', value: session.mode },
                { icon: Globe, label: 'Language', value: session.language },
                { icon: Users, label: 'Seats', value: `${seatsLeft} of ${session.seats} remaining` },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3">
                    <Icon size={15} style={{ color: 'var(--text-muted)' }} className="flex-shrink-0" />
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>{item.label}</p>
                      <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-[11px] mb-1" style={{ color: 'var(--text-muted)' }}>
                <span>{session.registered} registered</span>
                <span>{seatsLeft} left</span>
              </div>
              <ProgressBar value={session.registered} max={session.seats} color={fillPct > 80 ? 'danger' : 'primary'} />
            </div>

            <div className="divider my-4" />

            <div className="flex items-center gap-2">
              <Star size={15} className="text-amber-400 fill-amber-400" />
              <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{session.rating}</span>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>({session.ratingCount} reviews)</span>
            </div>

            <div className="flex gap-2 mt-4">
              <button className="btn btn-ghost btn-sm flex-1" onClick={() => { setSaved(!saved); toast(saved ? 'Removed from saved' : 'Saved!', { icon: saved ? '💔' : '🔖' }); }}>
                <Bookmark size={15} className={saved ? 'fill-current text-indigo-500' : ''} /> {saved ? 'Saved' : 'Save'}
              </button>
              <button className="btn btn-ghost btn-sm flex-1" onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success('Link copied!'); }}>
                <Share2 size={15} /> Share
              </button>
            </div>
          </motion.div>

          {/* Tags */}
          <div className="card p-5">
            <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Tags</h3>
            <div className="flex flex-wrap gap-2">
              {session.tags.map((tag) => (
                <span key={tag} className="badge badge-default text-xs">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Payment simulation modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content p-8 max-w-sm text-center"
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            >
              <div className="mb-4">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                  <Zap size={28} className="text-white" />
                </div>
                <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Processing Payment</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>₹{session.price} · Secure payment via Legacy Sphere</p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="inline-block w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium text-indigo-500">Verifying payment...</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
