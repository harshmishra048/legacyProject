import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  GraduationCap, Users, BookOpen, Briefcase,
  Code, Brain, TrendingUp, Palette, FlaskConical, DollarSign, Megaphone,
  CheckCircle2, ArrowRight, Star, Zap, Heart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui';

const STEPS = [
  { id: 'welcome', title: 'Welcome to Legacy Sphere', subtitle: "Let's personalize your experience" },
  { id: 'academic', title: 'Academic Profile', subtitle: 'Tell us about your university journey' },
  { id: 'skills', title: 'Your Skills & Interests', subtitle: 'Help us match you with the right people' },
  { id: 'goals', title: 'Career Goals', subtitle: 'What do you want to achieve?' },
  { id: 'mentorship', title: 'Mentorship Preference', subtitle: 'Connect with the right mentors' },
  { id: 'complete', title: 'You are all set!', subtitle: 'Welcome to the Legacy Sphere community' },
];

const SKILLS_OPTIONS = [
  { id: 'react', label: 'React', icon: Code },
  { id: 'python', label: 'Python', icon: Code },
  { id: 'ml', label: 'Machine Learning', icon: Brain },
  { id: 'ds', label: 'Data Science', icon: TrendingUp },
  { id: 'design', label: 'UI/UX Design', icon: Palette },
  { id: 'research', label: 'Research', icon: FlaskConical },
  { id: 'finance', label: 'Finance', icon: DollarSign },
  { id: 'marketing', label: 'Marketing', icon: Megaphone },
];

const GOAL_OPTIONS = [
  { id: 'internship', label: 'Land an Internship', icon: '🎯' },
  { id: 'placement', label: 'Campus Placements', icon: '🏢' },
  { id: 'startup', label: 'Start My Own Company', icon: '🚀' },
  { id: 'research', label: 'Pursue Research', icon: '🔬' },
  { id: 'abroad', label: 'Study Abroad', icon: '✈️' },
  { id: 'mentor', label: 'Find a Mentor', icon: '🤝' },
];

export default function OnboardingPage() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [mentorPref, setMentorPref] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const currentStep = STEPS[step];
  const progress = ((step) / (STEPS.length - 1)) * 100;

  const toggleSkill = (id) => {
    setSelectedSkills((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleGoal = (id) => {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleFinish = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        skills: selectedSkills,
        goals: selectedGoals,
        mentorPreference: mentorPref,
        onboardingComplete: true,
      });
      toast.success('Profile set up! Enjoy Legacy Sphere.');
      navigate(`/${user?.role}/dashboard`);
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg-base)' }}>
      <div className="w-full max-w-lg">
        {/* Progress */}
        {step < STEPS.length - 1 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                Step {step + 1} of {STEPS.length - 1}
              </span>
              <span className="text-xs font-semibold text-indigo-500">{Math.round(progress)}% complete</span>
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="card-elevated p-8"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                {currentStep.title}
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{currentStep.subtitle}</p>
            </div>

            {/* Step 0: Welcome */}
            {step === 0 && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-4 py-4">
                  <div className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center">
                    <Zap size={36} className="text-white" />
                  </div>
                  <p className="text-center text-sm max-w-xs" style={{ color: 'var(--text-secondary)' }}>
                    We will ask you a few quick questions to personalize your experience. It only takes 2 minutes.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Users, label: 'Discover Alumni' },
                    { icon: Heart, label: 'Find Mentors' },
                    { icon: Star, label: 'Earn Badges' },
                  ].map((f) => {
                    const Icon = f.icon;
                    return (
                      <div key={f.label} className="flex flex-col items-center gap-2 p-3 rounded-xl"
                           style={{ background: 'var(--bg-surface-secondary)' }}>
                        <Icon size={20} className="text-indigo-500" />
                        <span className="text-xs font-semibold text-center" style={{ color: 'var(--text-secondary)' }}>{f.label}</span>
                      </div>
                    );
                  })}
                </div>
                <Button variant="primary" size="lg" className="w-full" onClick={() => setStep(1)}>
                  Get Started <ArrowRight size={16} />
                </Button>
              </div>
            )}

            {/* Step 1: Academic */}
            {step === 1 && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>University</label>
                  <input className="input" defaultValue="Indian Institute of Technology, Delhi" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Department</label>
                    <select className="select">
                      <option>Computer Science & Engineering</option>
                      <option>Electrical Engineering</option>
                      <option>Mechanical Engineering</option>
                      <option>Mathematics & Computing</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {user?.role === 'alumni' ? 'Graduation Year' : 'Year'}
                    </label>
                    <select className="select">
                      {user?.role === 'alumni'
                        ? ['2024', '2023', '2022', '2021', '2020', '2019', '2018'].map((y) => <option key={y}>{y}</option>)
                        : ['1st Year', '2nd Year', '3rd Year', '4th Year'].map((y) => <option key={y}>{y}</option>)
                      }
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Program</label>
                  <select className="select">
                    <option>B.Tech</option>
                    <option>M.Tech</option>
                    <option>PhD</option>
                    <option>MBA</option>
                    <option>B.Sc</option>
                    <option>M.Sc</option>
                  </select>
                </div>
                <div className="flex gap-3 mt-2">
                  <Button variant="secondary" size="md" className="flex-1" onClick={() => setStep(0)}>Back</Button>
                  <Button variant="primary" size="md" className="flex-1" onClick={() => setStep(2)}>Continue <ArrowRight size={15} /></Button>
                </div>
              </div>
            )}

            {/* Step 2: Skills */}
            {step === 2 && (
              <div className="flex flex-col gap-4">
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Select all that apply (you can update this later)</p>
                <div className="grid grid-cols-2 gap-2">
                  {SKILLS_OPTIONS.map((skill) => {
                    const isSelected = selectedSkills.includes(skill.id);
                    const Icon = skill.icon;
                    return (
                      <button
                        key={skill.id}
                        onClick={() => toggleSkill(skill.id)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all text-left"
                        style={{
                          background: isSelected ? 'rgba(99,102,241,0.08)' : 'var(--bg-surface)',
                          borderColor: isSelected ? '#6366f1' : 'var(--border-default)',
                          color: isSelected ? '#6366f1' : 'var(--text-secondary)',
                        }}
                      >
                        <Icon size={15} />
                        {skill.label}
                        {isSelected && <CheckCircle2 size={14} className="ml-auto text-indigo-500" />}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-3">
                  <Button variant="secondary" size="md" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                  <Button variant="primary" size="md" className="flex-1" onClick={() => setStep(3)}>Continue <ArrowRight size={15} /></Button>
                </div>
              </div>
            )}

            {/* Step 3: Goals */}
            {step === 3 && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-2">
                  {GOAL_OPTIONS.map((goal) => {
                    const isSelected = selectedGoals.includes(goal.id);
                    return (
                      <button
                        key={goal.id}
                        onClick={() => toggleGoal(goal.id)}
                        className="flex items-center gap-2 px-3 py-3 rounded-xl border text-sm font-semibold transition-all text-left"
                        style={{
                          background: isSelected ? 'rgba(99,102,241,0.08)' : 'var(--bg-surface)',
                          borderColor: isSelected ? '#6366f1' : 'var(--border-default)',
                          color: isSelected ? '#6366f1' : 'var(--text-secondary)',
                        }}
                      >
                        <span className="text-xl">{goal.icon}</span>
                        <span className="text-sm">{goal.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-3">
                  <Button variant="secondary" size="md" className="flex-1" onClick={() => setStep(2)}>Back</Button>
                  <Button variant="primary" size="md" className="flex-1" onClick={() => setStep(4)}>Continue <ArrowRight size={15} /></Button>
                </div>
              </div>
            )}

            {/* Step 4: Mentorship */}
            {step === 4 && (
              <div className="flex flex-col gap-4">
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>What kind of mentorship are you looking for?</p>
                <div className="flex flex-col gap-2">
                  {[
                    { id: 'career', label: 'Career Guidance', desc: 'Interview prep, job search, career transitions' },
                    { id: 'technical', label: 'Technical Mentorship', desc: 'Code reviews, tech stack, system design' },
                    { id: 'startup', label: 'Startup & Entrepreneurship', desc: 'Building a company, fundraising, product' },
                    { id: 'research', label: 'Academic & Research', desc: 'Research papers, PhD guidance, academics' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setMentorPref(opt.id)}
                      className="flex items-start gap-3 p-4 rounded-xl border text-left transition-all"
                      style={{
                        background: mentorPref === opt.id ? 'rgba(99,102,241,0.08)' : 'var(--bg-surface)',
                        borderColor: mentorPref === opt.id ? '#6366f1' : 'var(--border-default)',
                      }}
                    >
                      <div className="w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center"
                           style={{ borderColor: mentorPref === opt.id ? '#6366f1' : 'var(--border-strong)' }}>
                        {mentorPref === opt.id && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{opt.label}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button variant="secondary" size="md" className="flex-1" onClick={() => setStep(3)}>Back</Button>
                  <Button variant="primary" size="md" className="flex-1" loading={isLoading} onClick={handleFinish}>
                    Finish Setup <ArrowRight size={15} />
                  </Button>
                </div>
              </div>
            )}

            {/* Final step handled by handleFinish redirect */}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
