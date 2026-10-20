import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Clock, MapPin, Users, Tag, CheckCircle2, 
  Search, ArrowRight, Share2, Bookmark, Sparkles, ExternalLink 
} from 'lucide-react';
import { Avatar, Badge, Button, EmptyState } from '../../components/ui';
import { EVENTS } from '../../data/mockData';
import toast from 'react-hot-toast';

const EVENT_TYPES = ['All', 'Alumni Meet', 'Hackathon', 'Career Fair', 'Technical', 'Workshop', 'Networking'];

export default function EventsPage() {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [registeredEvents, setRegisteredEvents] = useState({});
  const [savedEvents, setSavedEvents] = useState({});
  const [loadingEventId, setLoadingEventId] = useState(null);

  const filteredEvents = EVENTS.filter(evt => {
    const q = search.toLowerCase();
    const matchesSearch = !q || evt.title.toLowerCase().includes(q) || evt.description.toLowerCase().includes(q) || (evt.tags || []).some(t => t.toLowerCase().includes(q));
    const matchesType = selectedType === 'All' || evt.category === selectedType || evt.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleRegister = (eventId, eventTitle) => {
    setLoadingEventId(eventId);
    setTimeout(() => {
      setRegisteredEvents(prev => ({
        ...prev,
        [eventId]: true
      }));
      setLoadingEventId(null);
      toast.success(`You are registered for ${eventTitle}! Calendar invite generated.`);
    }, 600);
  };

  const toggleSave = (eventId) => {
    setSavedEvents(prev => {
      const isSaved = !prev[eventId];
      toast(isSaved ? 'Saved to your events' : 'Removed from saved', { icon: isSaved ? '🔖' : '🗑️' });
      return { ...prev, [eventId]: isSaved };
    });
  };

  const featuredEvent = EVENTS[0];

  return (
    <div className="p-6 max-w-7xl mx-auto pb-16 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>University & Alumni Events</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Reunions, hackathons, job summits, and networking nights connecting the entire university ecosystem.
            </p>
          </div>
          <Button variant="primary" size="md" onClick={() => toast.success('Event creation submitted for admin review')}>
            + Submit Event
          </Button>
        </div>
      </motion.div>

      {/* Featured Event Hero Banner */}
      {featuredEvent && (
        <motion.div
          className="rounded-3xl p-6 md:p-8 relative overflow-hidden text-white shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="badge badge-warning text-xs font-bold uppercase tracking-wider">
                  ⭐ Featured Grand Reunion
                </span>
                <span className="badge badge-cyan text-xs">Hybrid</span>
              </div>

              <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
                {featuredEvent.title}
              </h2>
              <p className="text-white/80 text-sm leading-relaxed">
                {featuredEvent.description}
              </p>

              <div className="flex flex-wrap gap-4 pt-2 text-xs text-white/90">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar size={14} className="text-cyan-400" />
                  {new Date(featuredEvent.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} - {new Date(featuredEvent.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock size={14} className="text-cyan-400" />
                  {featuredEvent.time}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin size={14} className="text-cyan-400" />
                  {featuredEvent.venue}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Users size={14} className="text-cyan-400" />
                  {featuredEvent.attendees} Attending
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[200px]">
              <Button
                size="lg"
                variant={registeredEvents[featuredEvent.id] ? 'secondary' : 'primary'}
                className="w-full bg-white text-indigo-900 hover:bg-slate-100 font-bold border-none shadow-lg"
                loading={loadingEventId === featuredEvent.id}
                onClick={() => handleRegister(featuredEvent.id, featuredEvent.title)}
              >
                {registeredEvents[featuredEvent.id] ? '✓ Registered' : 'Register Now (Free)'}
              </Button>
              <Button
                size="md"
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  toast.success('Event link copied!');
                }}
              >
                <Share2 size={15} /> Share Event
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            className="input pl-10"
            placeholder="Search events, organizers, or topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-hide">
          {EVENT_TYPES.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all border ${
                selectedType === type
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-surface border-default text-secondary hover:border-strong'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <EmptyState
          icon="📅"
          title="No events found"
          description="Try exploring other categories or clearing your search criteria."
          action={<Button variant="secondary" size="sm" onClick={() => { setSearch(''); setSelectedType('All'); }}>Clear Filters</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt, idx) => {
            const isReg = registeredEvents[evt.id];
            const isSaved = savedEvents[evt.id];
            return (
              <motion.div
                key={evt.id}
                className="card p-5 flex flex-col justify-between"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -3 }}
              >
                <div>
                  {/* Category & Save */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Badge variant={evt.category === 'Hackathon' ? 'violet' : evt.category === 'Career Fair' ? 'cyan' : 'primary'}>
                      {evt.type}
                    </Badge>
                    <button
                      onClick={() => toggleSave(evt.id)}
                      className="text-muted hover:text-indigo-500 transition-colors p-1"
                    >
                      <Bookmark size={16} className={isSaved ? 'fill-indigo-500 text-indigo-500' : ''} />
                    </button>
                  </div>

                  <h3 className="text-base font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                    {evt.title}
                  </h3>
                  <p className="text-xs line-clamp-2 mb-4" style={{ color: 'var(--text-muted)' }}>
                    {evt.description}
                  </p>

                  {/* Metadata */}
                  <div className="space-y-2 text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
                    <div className="flex items-center gap-2">
                      <Calendar size={13} className="text-indigo-500 flex-shrink-0" />
                      <span>{new Date(evt.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })} · {evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-indigo-500 flex-shrink-0" />
                      <span className="truncate">{evt.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={13} className="text-indigo-500 flex-shrink-0" />
                      <span>{evt.attendees} / {evt.maxAttendees} Registered</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {(evt.tags || []).map(t => (
                      <span key={t} className="badge badge-default text-[10px]">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-subtle flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-emerald-500">
                    {evt.isFree ? 'Free Admission' : `₹${evt.price}`}
                  </span>
                  <Button
                    size="sm"
                    variant={isReg ? 'secondary' : 'primary'}
                    loading={loadingEventId === evt.id}
                    onClick={() => handleRegister(evt.id, evt.title)}
                  >
                    {isReg ? '✓ Registered' : 'RSVP Now'}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
