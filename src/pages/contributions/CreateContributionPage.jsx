import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  ArrowLeft, ArrowRight, CheckCircle2, Mic2, BookOpen,
  Lightbulb, Users, FlaskConical, Briefcase, Star, GraduationCap,
  Calendar, Clock, MapPin, Globe, DollarSign, Eye, Zap, Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Button, Badge } from '../../components/ui';
import { contributionService } from '../../services/contributionService';

const TYPES = [
  { id: 'Seminar', label: 'Seminar', icon: Mic2, desc: 'Present a topic to a large audience', color: '#6366f1' },
  { id: 'Workshop', label: 'Workshop', icon: BookOpen, desc: 'Hands-on interactive session', color: '#06b6d4' },
  { id: 'Masterclass', label: 'Masterclass', icon: Star, desc: 'Deep-dive expert session', color: '#8b5cf6' },
  { id: 'Career Talk', label: 'Career Talk', icon: Briefcase, desc: 'Share your career journey', color: '#10b981' },
  { id: 'Mock Interview', label: 'Mock Interview', icon: Users, desc: 'Practice interviews with students', color: '#f59e0b' },
  { id: 'Research Session', label: 'Research Session', icon: FlaskConical, desc: 'Share research and findings', color: '#f43f5e' },
  { id: 'Mentorship Session', label: 'Mentorship Session', icon: GraduationCap, desc: 'One-on-one or small group mentoring', color: '#06b6d4' },
  { id: 'Startup Talk', label: 'Startup Talk', icon: Lightbulb, desc: 'Share startup experience and learnings', color: '#8b5cf6' },
];

const STEP_LABELS = ['Type', 'Details', 'Schedule', 'Format', 'Pricing', 'Preview', 'Publish'];

export default function CreateContributionPage() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  const { register, handleSubmit, watch, setValue, getValues, formState: { errors } } = useForm({
    defaultValues: {
      type: '',
      title: '',
      description: '',
      date: '',
      time: '',
      duration: '90 min',
      mode: 'Online',
      platform: 'Google Meet',
      language: 'English',
      seats: 100,
      isFree: true,
      price: 0,
      tags: '',
    }
  });

  const formValues = watch();
  const progress = ((step + 1) / STEP_LABELS.length) * 100;

  const goNext = () => { if (step < STEP_LABELS.length - 1) setStep(step + 1); };
  const goBack = () => { if (step > 0) setStep(step - 1); };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const data = getValues();
      const newSession = await contributionService.create({
        ...data,
        price: data.isFree ? 0 : Number(data.price),
        seats: Number(data.seats),
        tags: data.tags ? data.tags.split(',').map((t) => t.trim()) : [],
        category: data.type === 'Career Talk' ? 'Career Talks' : data.type === 'Research Session' ? 'Research' : data.type === 'Workshop' ? 'Technical' : 'Seminars',
        speaker: {
          id: user?.id,
          name: user?.name,
          initials: user?.initials,
          designation: user?.designation || 'Contributor',
          company: user?.company || user?.university || 'IIT Delhi',
          isVerified: true,
        },
        learnings: ['Practical industry knowledge', 'Real-world best practices', 'Q&A with the speaker', 'Networking opportunity'],
        agenda: ['Introduction', 'Core content', 'Practical examples', 'Q&A session'],
      });

      addNotification({
        type: 'contribution',
        title: 'Contribution Published! 🎉',
        body: `"${data.title}" is now live and discoverable by students.`,
        icon: '🎤',
        link: `/contributions/${newSession.id}`,
      });

      setPublished(true);
      toast.success('Your contribution is now live!');
    } catch (err) {
      toast.error('Failed to publish. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  // Published success state
  if (published) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] p-6">
        <motion.div
          className="card-elevated p-10 max-w-md text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <motion.div
            className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center mx-auto mb-5"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <Sparkles size={36} className="text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Published! 🎉</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            Your contribution "{formValues.title}" is now live. Students can discover and register for it.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="primary" size="md" onClick={() => navigate('/contributions')}>View Contributions</Button>
            <Button variant="secondary" size="md" onClick={() => { setStep(0); setPublished(false); }}>Create Another</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 pb-12">
      {/* Header */}
      <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Create a Contribution</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Share your knowledge and expertise with the community.</p>
      </motion.div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {STEP_LABELS.map((label, i) => (
            <button
              key={label}
              onClick={() => { if (i < step) setStep(i); }}
              className={`flex items-center gap-1.5 text-xs font-semibold transition-all ${i <= step ? 'text-indigo-500' : ''}`}
              style={{ color: i <= step ? '#6366f1' : 'var(--text-muted)' }}
              disabled={i > step}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                i < step ? 'bg-indigo-500 text-white' : i === step ? 'bg-indigo-100 text-indigo-600' : ''
              }`}
                    style={{ background: i > step ? 'var(--bg-surface-secondary)' : undefined, color: i > step ? 'var(--text-muted)' : undefined }}>
                {i < step ? <CheckCircle2 size={12} /> : i + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
        <div className="progress-bar h-1">
          <motion.div className="progress-fill" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
          className="card-elevated p-6 lg:p-8"
        >
          {/* Step 0: Type */}
          {step === 0 && (
            <div>
              <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Choose Contribution Type</h2>
              <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>What kind of session would you like to create?</p>
              <div className="grid grid-cols-2 gap-3">
                {TYPES.map((t) => {
                  const Icon = t.icon;
                  const isSelected = formValues.type === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setValue('type', t.id)}
                      className="flex items-start gap-3 p-4 rounded-xl border text-left transition-all"
                      style={{
                        background: isSelected ? `${t.color}10` : 'var(--bg-surface)',
                        borderColor: isSelected ? t.color : 'var(--border-default)',
                        boxShadow: isSelected ? `0 0 0 1px ${t.color}` : 'none',
                      }}
                    >
                      <Icon size={20} style={{ color: isSelected ? t.color : 'var(--text-muted)' }} className="flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold" style={{ color: isSelected ? t.color : 'var(--text-primary)' }}>{t.label}</p>
                        <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{t.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-end mt-6">
                <Button variant="primary" size="md" onClick={goNext} disabled={!formValues.type}>
                  Continue <ArrowRight size={15} />
                </Button>
              </div>
            </div>
          )}

          {/* Step 1: Details */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Basic Information</h2>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Title</label>
                <input className="input input-lg" placeholder="e.g., Breaking Into Big Tech" {...register('title', { required: true })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Description</label>
                <textarea className="input resize-none" rows={5} placeholder="Describe what participants will gain from this session..." {...register('description', { required: true })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Tags (comma-separated)</label>
                <input className="input" placeholder="e.g., Big Tech, Interviews, SWE" {...register('tags')} />
              </div>
              <div className="flex justify-between mt-4">
                <Button variant="secondary" size="md" onClick={goBack}><ArrowLeft size={15} /> Back</Button>
                <Button variant="primary" size="md" onClick={goNext} disabled={!formValues.title || !formValues.description}>Continue <ArrowRight size={15} /></Button>
              </div>
            </div>
          )}

          {/* Step 2: Schedule */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Schedule</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Date</label>
                  <input type="date" className="input" {...register('date', { required: true })} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Time</label>
                  <input type="time" className="input" {...register('time', { required: true })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Duration</label>
                  <select className="select" {...register('duration')}>
                    <option>30 min</option><option>45 min</option><option>60 min</option>
                    <option>90 min</option><option>2 hours</option><option>3 hours</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Max Seats</label>
                  <input type="number" className="input" min={5} max={1000} {...register('seats')} />
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <Button variant="secondary" size="md" onClick={goBack}><ArrowLeft size={15} /> Back</Button>
                <Button variant="primary" size="md" onClick={goNext} disabled={!formValues.date || !formValues.time}>Continue <ArrowRight size={15} /></Button>
              </div>
            </div>
          )}

          {/* Step 3: Format */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Format</h2>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Mode</label>
                <div className="flex gap-3">
                  {['Online', 'Offline', 'Hybrid'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setValue('mode', m)}
                      className="flex-1 py-3 rounded-xl border text-sm font-semibold transition-all"
                      style={{
                        background: formValues.mode === m ? 'rgba(99,102,241,0.08)' : 'var(--bg-surface)',
                        borderColor: formValues.mode === m ? '#6366f1' : 'var(--border-default)',
                        color: formValues.mode === m ? '#6366f1' : 'var(--text-secondary)',
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Platform</label>
                  <select className="select" {...register('platform')}>
                    <option>Google Meet</option><option>Zoom</option><option>MS Teams</option><option>Other</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Language</label>
                  <select className="select" {...register('language')}>
                    <option>English</option><option>Hindi</option><option>English + Hindi</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <Button variant="secondary" size="md" onClick={goBack}><ArrowLeft size={15} /> Back</Button>
                <Button variant="primary" size="md" onClick={goNext}>Continue <ArrowRight size={15} /></Button>
              </div>
            </div>
          )}

          {/* Step 4: Pricing */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Pricing</h2>
              <div className="flex gap-3">
                {[{ v: true, label: 'Free', desc: 'Open to everyone', icon: '🆓' }, { v: false, label: 'Paid', desc: 'Set your price', icon: '💰' }].map((opt) => (
                  <button
                    key={String(opt.v)}
                    type="button"
                    onClick={() => setValue('isFree', opt.v)}
                    className="flex-1 flex items-center gap-3 p-4 rounded-xl border transition-all text-left"
                    style={{
                      background: formValues.isFree === opt.v ? 'rgba(99,102,241,0.08)' : 'var(--bg-surface)',
                      borderColor: formValues.isFree === opt.v ? '#6366f1' : 'var(--border-default)',
                    }}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <div>
                      <p className="text-sm font-bold" style={{ color: formValues.isFree === opt.v ? '#6366f1' : 'var(--text-primary)' }}>{opt.label}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              {!formValues.isFree && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Price (₹)</label>
                    <input type="number" className="input input-lg" min={0} placeholder="299" {...register('price')} />
                  </div>
                  <div className="flex gap-2">
                    {[99, 199, 299, 499, 999].map((p) => (
                      <button key={p} type="button" onClick={() => setValue('price', p)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                        style={{
                          background: Number(formValues.price) === p ? 'rgba(99,102,241,0.08)' : 'var(--bg-surface-secondary)',
                          borderColor: Number(formValues.price) === p ? '#6366f1' : 'var(--border-default)',
                          color: Number(formValues.price) === p ? '#6366f1' : 'var(--text-secondary)',
                        }}
                      >₹{p}</button>
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Platform fee: 5% · You receive 95% of the payment. Payments will be processed via the university-integrated gateway.
                  </p>
                </motion.div>
              )}
              <div className="flex justify-between mt-4">
                <Button variant="secondary" size="md" onClick={goBack}><ArrowLeft size={15} /> Back</Button>
                <Button variant="primary" size="md" onClick={goNext}>Continue <ArrowRight size={15} /></Button>
              </div>
            </div>
          )}

          {/* Step 5: Preview */}
          {step === 5 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Preview Your Contribution</h2>
              <div className="rounded-xl p-5 border" style={{ background: 'var(--bg-surface-secondary)', borderColor: 'var(--border-default)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="primary">{formValues.type}</Badge>
                  {formValues.isFree ? <Badge variant="success">Free</Badge> : <span className="text-lg font-bold text-indigo-500">₹{formValues.price}</span>}
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{formValues.title || 'Untitled Session'}</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{formValues.description || 'No description provided.'}</p>
                <div className="grid grid-cols-2 gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <span className="flex items-center gap-1"><Calendar size={13} /> {formValues.date || 'Not set'}</span>
                  <span className="flex items-center gap-1"><Clock size={13} /> {formValues.time || 'Not set'} · {formValues.duration}</span>
                  <span className="flex items-center gap-1"><MapPin size={13} /> {formValues.mode}</span>
                  <span className="flex items-center gap-1"><Globe size={13} /> {formValues.language}</span>
                  <span className="flex items-center gap-1"><Users size={13} /> {formValues.seats} seats</span>
                </div>
                {formValues.tags && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {formValues.tags.split(',').map((t) => t.trim()).filter(Boolean).map((tag) => (
                      <span key={tag} className="badge badge-default text-[10px]">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex justify-between mt-4">
                <Button variant="secondary" size="md" onClick={goBack}><ArrowLeft size={15} /> Back</Button>
                <Button variant="primary" size="md" onClick={goNext}>Looks Good! <ArrowRight size={15} /></Button>
              </div>
            </div>
          )}

          {/* Step 6: Publish */}
          {step === 6 && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                <Zap size={28} className="text-white" />
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Ready to Publish?</h2>
              <p className="text-sm max-w-sm mx-auto mb-6" style={{ color: 'var(--text-muted)' }}>
                Your {formValues.type?.toLowerCase()} "{formValues.title}" will be visible to all students and community members.
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="secondary" size="lg" onClick={goBack}><ArrowLeft size={15} /> Back</Button>
                <Button variant="primary" size="lg" loading={isPublishing} onClick={handlePublish}>
                  <Sparkles size={16} /> Publish Contribution
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
