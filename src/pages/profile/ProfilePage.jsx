import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Building, MapPin, Calendar, Award, 
  BookOpen, Star, Edit3, CheckCircle2, ShieldCheck, 
  ExternalLink, Plus, Sparkles, Briefcase, GraduationCap 
} from 'lucide-react';
import { Avatar, Badge, Button, SectionHeader, VerifiedBadge, ProgressBar } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { BADGES, CONTRIBUTIONS } from '../../data/mockData';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    bio: user?.bio || 'Senior Software Engineer, passionate about distributed systems and helping students break into Big Tech.',
    designation: user?.designation || 'Senior Software Engineer',
    company: user?.company || 'Microsoft India',
    location: user?.location || 'Bengaluru, Karnataka',
    skills: user?.skills || ['System Design', 'React', 'Node.js', 'Azure', 'Distributed Systems'],
  });
  const [newSkill, setNewSkill] = useState('');

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(editForm);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !editForm.skills.includes(newSkill.trim())) {
      setEditForm(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setEditForm(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto pb-16 space-y-8">
      {/* Profile Header Card */}
      <motion.div 
        className="card-elevated overflow-hidden relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Cover Gradient */}
        <div className="h-44 w-full bg-gradient-to-r from-indigo-900 via-indigo-700 to-violet-800 relative">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
        </div>

        {/* Profile Info Container */}
        <div className="px-6 lg:px-8 pb-8 pt-0 relative">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 -mt-16 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div className="w-28 h-28 rounded-3xl bg-surface p-1 shadow-xl relative flex-shrink-0">
                <Avatar name={user?.name} initials={user?.initials} size="3xl" className="w-full h-full rounded-2xl" />
                <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white rounded-full p-1 shadow-md">
                  <ShieldCheck size={16} />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-primary">{user?.name}</h1>
                  <VerifiedBadge size="md" />
                  <span className="badge badge-primary text-xs uppercase font-bold">
                    {user?.role || 'Alumni'}
                  </span>
                </div>
                <p className="text-sm font-semibold text-secondary mt-0.5">
                  {user?.designation || 'Alumni'} {user?.company ? `at ${user?.company}` : ''}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted mt-1.5">
                  <span className="flex items-center gap-1">
                    <GraduationCap size={13} /> {user?.university || 'IIT Delhi'} ({user?.batch || 'Batch 2018-2022'})
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={13} /> {user?.location || 'Bengaluru, India'}
                  </span>
                </div>
              </div>
            </div>

            <Button variant="secondary" size="md" onClick={() => setIsEditing(true)} className="self-stretch sm:self-auto gap-2">
              <Edit3 size={15} /> Edit Profile
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-surface-secondary border border-default text-center">
            <div>
              <span className="text-xs text-muted font-bold uppercase block">Legacy Score</span>
              <span className="text-xl font-black text-indigo-500">{user?.legacyScore || 8420}</span>
            </div>
            <div>
              <span className="text-xs text-muted font-bold uppercase block">Students Mentored</span>
              <span className="text-xl font-black text-primary">{user?.studentsHelped || 128}</span>
            </div>
            <div>
              <span className="text-xs text-muted font-bold uppercase block">Contributions</span>
              <span className="text-xl font-black text-primary">{user?.sessionsHosted || 24}</span>
            </div>
            <div>
              <span className="text-xs text-muted font-bold uppercase block">Badges</span>
              <span className="text-xl font-black text-primary">{user?.badges?.length || 4} Earned</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Profile Details 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Me */}
          <motion.div className="card p-6" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <SectionHeader title="About" className="mb-3" />
            <p className="text-sm text-secondary leading-relaxed whitespace-pre-line">
              {user?.bio || 'Senior SWE at Microsoft, passionate about distributed systems and helping students break into Big Tech.'}
            </p>
          </motion.div>

          {/* Career & Experience */}
          <motion.div className="card p-6" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <SectionHeader title="Professional Experience" className="mb-4" />
            <div className="space-y-4">
              <div className="flex gap-3.5">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white flex-shrink-0">
                  <Briefcase size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-primary">{user?.designation || 'Senior Software Engineer'}</h4>
                      <p className="text-xs text-muted">{user?.company || 'Microsoft India'} · Full-time</p>
                    </div>
                    <span className="text-xs font-semibold text-indigo-500">2022 - Present</span>
                  </div>
                  <p className="text-xs text-secondary mt-1.5 leading-relaxed">
                    Working on Azure Cloud Core Infrastructure, scaling high-throughput distributed microservices handling millions of operations daily.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Education */}
          <motion.div className="card p-6" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <SectionHeader title="Education & University" className="mb-4" />
            <div className="flex gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white flex-shrink-0">
                <GraduationCap size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-primary">{user?.university || 'Indian Institute of Technology, Delhi'}</h4>
                <p className="text-xs text-muted">B.Tech in {user?.department || 'Computer Science & Engineering'} ({user?.batch || '2018 - 2022'})</p>
                <p className="text-xs text-secondary mt-1">Dean's List Honoree · Head of Student Technical Society.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column (1 Col) */}
        <div className="space-y-6">
          {/* Skills & Endorsements */}
          <motion.div className="card p-6" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <SectionHeader title="Skills & Endorsements" className="mb-3" />
            <div className="flex flex-wrap gap-1.5">
              {(user?.skills || editForm.skills).map(skill => (
                <span key={skill} className="badge badge-primary text-xs py-1 px-2.5 font-semibold">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Earned Badges */}
          <motion.div className="card p-6" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <SectionHeader title="Top Badges" className="mb-3" />
            <div className="grid grid-cols-2 gap-3">
              {BADGES.filter(b => b.isUnlocked).slice(0, 4).map(b => (
                <div key={b.id} className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-secondary">
                  <span className="text-xl">{b.icon}</span>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-primary block truncate">{b.name}</span>
                    <span className="text-[10px] text-muted uppercase">{b.rarity}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="modal-overlay">
            <motion.div
              className="modal-content max-w-lg p-6"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="flex items-center justify-between pb-3 border-b border-default mb-4">
                <h3 className="text-base font-bold text-primary">Edit Professional Profile</h3>
                <button onClick={() => setIsEditing(false)} className="text-muted hover:text-primary text-sm p-1">✕</button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-muted block mb-1">Full Name</label>
                  <input
                    className="input text-sm"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase text-muted block mb-1">Role / Designation</label>
                    <input
                      className="input text-sm"
                      value={editForm.designation}
                      onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-muted block mb-1">Company / Org</label>
                    <input
                      className="input text-sm"
                      value={editForm.company}
                      onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-muted block mb-1">Location</label>
                  <input
                    className="input text-sm"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-muted block mb-1">Bio / Summary</label>
                  <textarea
                    className="input text-sm resize-none"
                    rows={3}
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-muted block mb-1">Skills</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      className="input text-sm flex-1"
                      placeholder="Add a new skill (e.g. Next.js, Kubernetes)"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                    />
                    <Button type="button" size="sm" variant="secondary" onClick={handleAddSkill}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {editForm.skills.map(s => (
                      <span key={s} className="badge badge-default text-xs flex items-center gap-1">
                        {s}
                        <button type="button" onClick={() => handleRemoveSkill(s)} className="text-muted hover:text-rose-500 font-bold ml-1">✕</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-default flex justify-end gap-2.5">
                  <Button type="button" variant="secondary" size="md" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button type="submit" variant="primary" size="md">Save Changes</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
