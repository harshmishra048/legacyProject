import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, Flame, Zap, Trophy, Star, Shield, Lock, 
  CheckCircle2, Sparkles, TrendingUp, Calendar, ChevronRight
} from 'lucide-react';
import { Badge, Button, ProgressBar, StatCard } from '../../components/ui';
import { BADGES, ALUMNI } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function AchievementsPage() {
  const { user } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all' | 'unlocked' | 'locked'

  const streakDays = [
    { day: 'M', active: true },
    { day: 'T', active: true },
    { day: 'W', active: true },
    { day: 'T', active: true },
    { day: 'F', active: true },
    { day: 'S', active: true },
    { day: 'S', active: true },
    { day: 'M', active: true },
    { day: 'T', active: true },
    { day: 'W', active: true },
    { day: 'T', active: true },
    { day: 'F', active: true },
    { day: 'S', active: false },
    { day: 'S', active: false },
  ];

  const filteredBadges = BADGES.filter(b => {
    if (selectedFilter === 'unlocked') return b.isUnlocked;
    if (selectedFilter === 'locked') return !b.isUnlocked;
    return true;
  });

  const getRarityBadge = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'badge-warning';
      case 'epic': return 'badge-violet';
      case 'rare': return 'badge-primary';
      default: return 'badge-default';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto pb-16 space-y-8">
      {/* Header Banner */}
      <motion.div
        className="rounded-3xl p-6 lg:p-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #312e81 0%, #4338ca 50%, #6366f1 100%)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 text-white">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="streak-fire text-2xl">🔥</span>
              <span className="text-sm font-bold uppercase tracking-wider text-amber-300">
                Legacy Gamification System
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold mb-1">
              Achievements & Reputation Hub
            </h1>
            <p className="text-white/80 text-sm max-w-lg">
              Earn contribution points, unlock prestigious badges, and climb the university leaderboard by attending sessions and sharing knowledge.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
            <div className="text-center px-3 border-r border-white/20">
              <span className="text-2xl lg:text-3xl font-black text-amber-400 block">{user?.streak || 12}</span>
              <span className="text-[11px] font-bold text-white/70 uppercase">Streak</span>
            </div>
            <div className="text-center px-3 border-r border-white/20">
              <span className="text-2xl lg:text-3xl font-black text-cyan-300 block">{user?.contributionPoints || 340}</span>
              <span className="text-[11px] font-bold text-white/70 uppercase">Points</span>
            </div>
            <div className="text-center px-3">
              <span className="text-2xl lg:text-3xl font-black text-white block">3 / 6</span>
              <span className="text-[11px] font-bold text-white/70 uppercase">Badges</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grid: Streak Calendar & Reputation Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Streak Tracker */}
        <motion.div 
          className="card p-6 flex flex-col justify-between"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame className="text-amber-500 fill-amber-500" size={20} />
                <h3 className="text-base font-bold text-primary">Daily Learning Streak</h3>
              </div>
              <span className="badge badge-warning text-xs font-bold">12 Days Active</span>
            </div>
            <p className="text-xs text-muted mb-4">
              Attend 1 session or read community knowledge daily to protect your flame.
            </p>

            {/* Streak dots matrix */}
            <div className="grid grid-cols-7 gap-2 p-3 bg-surface-secondary rounded-2xl mb-4 text-center">
              {streakDays.map((s, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-muted">{s.day}</span>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-transform ${
                    s.active 
                      ? 'bg-amber-500 text-white shadow-sm scale-105' 
                      : 'bg-surface border border-default text-muted'
                  }`}>
                    {s.active ? '🔥' : idx + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button variant="secondary" size="sm" className="w-full" onClick={() => toast.success('Streak freeze activated for 24h!')}>
            🛡️ Freeze Streak for 1 Day
          </Button>
        </motion.div>

        {/* Legacy Reputation Level */}
        <motion.div 
          className="card p-6 flex flex-col justify-between"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="text-indigo-500" size={20} />
                <h3 className="text-base font-bold text-primary">Reputation Score</h3>
              </div>
              <span className="badge badge-primary text-xs font-bold">Level 3 Explorer</span>
            </div>

            <div className="text-center py-2">
              <span className="text-4xl font-extrabold gradient-text block">340 XP</span>
              <span className="text-xs text-muted">160 XP needed to reach Level 4 "Knowledge Pioneer"</span>
            </div>

            <div className="my-4">
              <ProgressBar value={340} max={500} color="primary" />
            </div>

            <div className="space-y-2 text-xs text-secondary">
              <div className="flex justify-between py-1 border-b border-subtle">
                <span>Attend a Workshop</span>
                <span className="font-bold text-emerald-500">+50 pts</span>
              </div>
              <div className="flex justify-between py-1 border-b border-subtle">
                <span>Publish a Discussion / Question</span>
                <span className="font-bold text-emerald-500">+20 pts</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Thank a Speaker</span>
                <span className="font-bold text-emerald-500">+10 pts</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* University Leaderboard Preview */}
        <motion.div 
          className="card p-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="text-amber-500" size={20} />
              <h3 className="text-base font-bold text-primary">Batch Leaderboard</h3>
            </div>
            <span className="text-xs text-indigo-500 font-bold cursor-pointer hover:underline">View All</span>
          </div>

          <div className="space-y-3">
            {ALUMNI.slice(0, 4).map((person, idx) => (
              <div key={person.id} className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-surface-secondary">
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 text-center font-bold text-xs ${idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-slate-400' : 'text-amber-700'}`}>
                    #{idx + 1}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                    {person.initials}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-primary block">{person.name}</span>
                    <span className="text-[10px] text-muted">{person.company}</span>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-indigo-500">{person.legacyScore} pts</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Badges Showcase Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-primary">All Badges & Accolades</h2>
            <p className="text-xs text-muted">Complete milestones to unlock rare community titles.</p>
          </div>

          <div className="flex gap-2">
            {[
              { id: 'all', label: 'All Badges' },
              { id: 'unlocked', label: 'Unlocked' },
              { id: 'locked', label: 'Locked' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                  selectedFilter === f.id
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-surface border-default text-secondary hover:border-strong'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBadges.map((badge, idx) => (
            <motion.div
              key={badge.id}
              className={`card p-5 relative overflow-hidden transition-all ${
                badge.isUnlocked ? 'border-indigo-500/30' : 'opacity-70 bg-surface-secondary/50'
              }`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-inner ${
                  badge.isUnlocked 
                    ? 'bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30' 
                    : 'bg-surface-secondary border border-default text-muted'
                }`}>
                  {badge.isUnlocked ? badge.icon : <Lock size={20} className="text-muted" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="text-sm font-bold truncate text-primary">{badge.name}</h3>
                    <span className={`badge ${getRarityBadge(badge.rarity)} text-[10px] uppercase font-bold`}>
                      {badge.rarity}
                    </span>
                  </div>

                  <p className="text-xs text-muted leading-relaxed mb-3">
                    {badge.description}
                  </p>

                  {badge.isUnlocked ? (
                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-500">
                      <CheckCircle2 size={13} /> Earned on {new Date(badge.earnedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-semibold text-muted">
                        <span>Progress</span>
                        <span>{badge.progress || 0} / {badge.maxProgress || 10}</span>
                      </div>
                      <ProgressBar value={badge.progress || 0} max={badge.maxProgress || 10} color="primary" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
