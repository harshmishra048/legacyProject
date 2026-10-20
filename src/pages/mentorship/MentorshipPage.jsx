import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Star, MessageSquare, Calendar, Clock, CheckCircle2, 
  Send, Sparkles, Filter, Search, UserCheck, ShieldCheck, 
  ChevronRight, AlertCircle, Award
} from 'lucide-react';
import { Avatar, Badge, Button, EmptyState, VerifiedBadge } from '../../components/ui';
import { ALUMNI, PROFESSORS, MENTOR_REQUESTS } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function MentorshipPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('find'); // 'find' | 'requests' | 'active'
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [requests, setRequests] = useState(MENTOR_REQUESTS);
  
  // Modal state for requesting mentorship
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [requestTopic, setRequestTopic] = useState('');
  const [requestDuration, setRequestDuration] = useState('1 Month');
  const [requestMessage, setRequestMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mentors = [...ALUMNI.filter(a => a.isMentor), ...PROFESSORS.filter(p => p.isMentor)];

  const topics = ['All', 'Career Guidance', 'System Design', 'Product Management', 'Machine Learning', 'Startups', 'Higher Studies'];

  const filteredMentors = mentors.filter(m => {
    const q = search.toLowerCase();
    const matchQuery = !q || m.name.toLowerCase().includes(q) || (m.company || m.university || '').toLowerCase().includes(q) || (m.skills || []).some(s => s.toLowerCase().includes(q));
    const matchTopic = selectedTopic === 'All' || (m.skills || []).some(s => s.toLowerCase().includes(selectedTopic.toLowerCase()));
    return matchQuery && matchTopic;
  });

  const handleOpenRequest = (mentor) => {
    setSelectedMentor(mentor);
    setRequestTopic('');
    setRequestMessage('');
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    if (!requestTopic || !requestMessage) {
      toast.error('Please fill out all fields');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      const newReq = {
        id: `mr_${Date.now()}`,
        mentor: {
          id: selectedMentor.id,
          name: selectedMentor.name,
          initials: selectedMentor.initials,
          designation: selectedMentor.designation,
          company: selectedMentor.company || selectedMentor.university,
          isVerified: selectedMentor.isVerified,
        },
        topic: requestTopic,
        message: requestMessage,
        duration: requestDuration,
        status: 'pending',
        requestedAt: new Date().toISOString(),
      };
      setRequests([newReq, ...requests]);
      setIsSubmitting(false);
      setSelectedMentor(null);
      toast.success(`Mentorship request sent to ${selectedMentor.name}!`);
      setActiveTab('requests');
    }, 600);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto pb-16 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>1-on-1 Mentorship</h1>
              <span className="badge badge-violet text-xs font-semibold flex items-center gap-1">
                <Sparkles size={12} /> AI Powered
              </span>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Connect directly with industry leaders, senior alumni, and faculty for personalized career guidance.
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex bg-surface-secondary p-1 rounded-xl border border-default">
            {[
              { id: 'find', label: 'Find a Mentor' },
              { id: 'requests', label: `My Requests (${requests.length})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-surface shadow-sm text-indigo-500 font-bold'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Tab: Find Mentors */}
      {activeTab === 'find' && (
        <div className="space-y-6">
          {/* AI Banner */}
          <motion.div 
            className="card p-5 relative overflow-hidden border border-indigo-500/20"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.06))' }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white flex-shrink-0">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>AI Mentor Matcher</h3>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    Based on your profile in {user?.department || 'Engineering'}, we recommend connecting with alumni working in Software Engineering and Big Tech.
                  </p>
                </div>
              </div>
              <Button size="sm" variant="primary" onClick={() => { setSelectedTopic('System Design'); toast.success('Filtered by recommended topics'); }}>
                Apply AI Match
              </Button>
            </div>
          </motion.div>

          {/* Search & Topic Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                className="input pl-10"
                placeholder="Search mentors by name, company, role, or skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {topics.map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedTopic(t)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all border ${
                    selectedTopic === t
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-surface border-default text-secondary hover:border-strong'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Mentors Grid */}
          {filteredMentors.length === 0 ? (
            <EmptyState 
              icon="🤝"
              title="No mentors found"
              description="Try adjusting your filters or search keywords."
              action={<Button variant="secondary" size="sm" onClick={() => { setSearch(''); setSelectedTopic('All'); }}>Reset Filters</Button>}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredMentors.map((mentor, index) => (
                <motion.div
                  key={mentor.id}
                  className="card p-5 flex flex-col justify-between"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  whileHover={{ y: -3 }}
                >
                  <div>
                    {/* Header info */}
                    <div className="flex items-start gap-3.5 mb-3">
                      <Avatar name={mentor.name} initials={mentor.initials} size="lg" ring />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                            {mentor.name}
                          </h3>
                          {mentor.isVerified && <VerifiedBadge />}
                        </div>
                        <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                          {mentor.designation}
                        </p>
                        <p className="text-xs font-semibold text-indigo-500 truncate">
                          {mentor.company || mentor.university}
                        </p>
                      </div>
                    </div>

                    {/* Mentorship Stats */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-surface-secondary mb-3 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted block">Helped</span>
                        <span className="font-bold text-primary">{mentor.studentsHelped || mentor.studentsReached || 45}+ Students</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted block">Rating</span>
                        <span className="font-bold text-primary flex items-center gap-1">
                          <Star size={12} className="text-amber-400 fill-amber-400" />
                          {mentor.rating || '4.9'}
                        </span>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {(mentor.skills || mentor.researchInterests || []).slice(0, 3).map(skill => (
                        <span key={skill} className="badge badge-default text-[10px]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-subtle flex items-center justify-between gap-2">
                    <span className="badge badge-success text-[10px] font-semibold">Available</span>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleOpenRequest(mentor)}
                      className="gap-1.5"
                    >
                      <Heart size={13} /> Request Mentorship
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <EmptyState
              icon="📬"
              title="No mentorship requests yet"
              description="Find an experienced alumni or professor and send them a request for 1-on-1 mentorship."
              action={<Button variant="primary" size="md" onClick={() => setActiveTab('find')}>Find Mentors</Button>}
            />
          ) : (
            <div className="space-y-3">
              {requests.map((req) => (
                <motion.div
                  key={req.id}
                  className="card p-5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <Avatar name={req.mentor.name} initials={req.mentor.initials} size="md" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{req.mentor.name}</h3>
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>({req.mentor.designation} · {req.mentor.company})</span>
                        </div>
                        <p className="text-sm font-semibold text-indigo-500 mt-0.5">{req.topic}</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>"{req.message}"</p>
                        <div className="flex items-center gap-4 mt-2 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                          <span className="flex items-center gap-1"><Clock size={12} /> {req.duration}</span>
                          <span className="flex items-center gap-1"><Calendar size={12} /> Requested on {new Date(req.requestedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-center">
                      <span className={`badge ${
                        req.status === 'accepted' ? 'badge-success' : req.status === 'pending' ? 'badge-warning' : 'badge-danger'
                      } uppercase tracking-wider text-[11px]`}>
                        {req.status}
                      </span>
                      {req.status === 'accepted' && (
                        <Button size="sm" variant="primary" onClick={() => toast.success('Opening direct message...')}>
                          <MessageSquare size={13} /> Chat with Mentor
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Request Mentorship Modal */}
      <AnimatePresence>
        {selectedMentor && (
          <div className="modal-overlay">
            <motion.div
              className="modal-content max-w-lg p-6"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="flex items-start justify-between pb-4 border-b border-default mb-4">
                <div className="flex items-center gap-3">
                  <Avatar name={selectedMentor.name} initials={selectedMentor.initials} size="md" />
                  <div>
                    <h3 className="text-base font-bold text-primary">Request Mentorship</h3>
                    <p className="text-xs text-muted">with {selectedMentor.name} ({selectedMentor.company || selectedMentor.university})</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedMentor(null)}
                  className="text-muted hover:text-primary text-sm p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitRequest} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-muted block mb-1.5">Mentorship Topic / Focus</label>
                  <input
                    className="input text-sm"
                    placeholder="e.g. Breaking into Big Tech, Resume Review, System Design..."
                    value={requestTopic}
                    onChange={(e) => setRequestTopic(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-muted block mb-1.5">Preferred Duration</label>
                  <select
                    className="select text-sm"
                    value={requestDuration}
                    onChange={(e) => setRequestDuration(e.target.value)}
                  >
                    <option value="1 Session (45m)">Single Strategy Session (45 min)</option>
                    <option value="1 Month">1 Month (Bi-weekly catchups)</option>
                    <option value="3 Months">3 Months (Full career mentoring)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-muted block mb-1.5">Your Message / Context</label>
                  <textarea
                    className="input text-sm resize-none"
                    rows={4}
                    placeholder="Tell the mentor about your current background, what you hope to learn, and your career goals..."
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    required
                  />
                </div>

                <div className="pt-3 border-t border-default flex justify-end gap-2.5">
                  <Button type="button" variant="secondary" size="md" onClick={() => setSelectedMentor(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="md" loading={isSubmitting}>
                    <Send size={14} /> Send Request
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
