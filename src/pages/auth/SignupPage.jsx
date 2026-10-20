import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  BookOpen,
  Users,
  Briefcase,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui';

const ROLES = [
  {
    id: 'student',
    label: 'Student',
    icon: GraduationCap,
    desc: 'Enrolled at university',
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.08)',
  },
  {
    id: 'alumni',
    label: 'Alumni',
    icon: Users,
    desc: 'University graduate',
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.08)',
  },
  {
    id: 'professor',
    label: 'Professor',
    icon: BookOpen,
    desc: 'Faculty member',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.08)',
  },
  {
    id: 'recruiter',
    label: 'Recruiter',
    icon: Briefcase,
    desc: 'Hiring talent',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.08)',
  },
];

export default function SignupPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('student');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      await registerUser({
        ...data,
        role: selectedRole,
      });

      toast.success(
        'Account created! Welcome to Legacy Sphere.'
      );

      navigate('/onboarding');
    } catch (err) {
      toast.error('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6"
    >
      {/* Header */}
      <div>
        <h2
          className="text-2xl font-bold mb-1"
          style={{ color: 'var(--text-primary)' }}
        >
          Join Legacy Sphere
        </h2>

        <p
          className="text-sm"
          style={{ color: 'var(--text-muted)' }}
        >
          Build your lifelong university connection
        </p>
      </div>

      {/* Role selection */}
      <div>
        <p
          className="text-sm font-semibold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          I am a...
        </p>

        <div className="grid grid-cols-2 gap-2">
          {ROLES.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;

            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                className="flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all hover:scale-[1.01]"
                style={{
                  background: isSelected
                    ? role.bg
                    : 'var(--bg-surface)',
                  borderColor: isSelected
                    ? role.color
                    : 'var(--border-default)',
                  boxShadow: isSelected
                    ? `0 0 0 1px ${role.color}`
                    : 'none',
                }}
              >
                <Icon
                  size={18}
                  className="flex-shrink-0"
                  style={{
                    color: isSelected
                      ? role.color
                      : 'var(--text-muted)',
                  }}
                />

                <div className="min-w-0">
                  <p
                    className="text-sm font-semibold truncate"
                    style={{
                      color: isSelected
                        ? role.color
                        : 'var(--text-primary)',
                    }}
                  >
                    {role.label}
                  </p>

                  <p
                    className="text-[11px] truncate"
                    style={{
                      color: 'var(--text-muted)',
                    }}
                  >
                    {role.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {/* Full Name */}
        <div>
          <label
            className="text-sm font-semibold mb-1.5 block"
            style={{ color: 'var(--text-primary)' }}
          >
            Full Name
          </label>

          <div className="relative">
            <User
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
              style={{ color: 'var(--text-muted)' }}
            />

            <input
              type="text"
              placeholder="Arjun Sharma"
              className={`input w-full ${errors.name ? 'border-rose-400' : ''
                }`}
              style={{
                paddingLeft: '2.75rem',
                paddingRight: '1rem',
              }}
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Too short',
                },
              })}
            />
          </div>

          {errors.name && (
            <p className="text-xs text-rose-500 mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            className="text-sm font-semibold mb-1.5 block"
            style={{ color: 'var(--text-primary)' }}
          >
            Email
          </label>

          <div className="relative">
            <Mail
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
              style={{ color: 'var(--text-muted)' }}
            />

            <input
              type="email"
              placeholder="arjun@iit.ac.in"
              className={`input w-full ${errors.email ? 'border-rose-400' : ''
                }`}
              style={{
                paddingLeft: '2.75rem',
                paddingRight: '1rem',
              }}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Invalid email',
                },
              })}
            />
          </div>

          {errors.email && (
            <p className="text-xs text-rose-500 mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            className="text-sm font-semibold mb-1.5 block"
            style={{ color: 'var(--text-primary)' }}
          >
            Password
          </label>

          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
              style={{ color: 'var(--text-muted)' }}
            />

            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 8 characters"
              className={`input w-full ${errors.password ? 'border-rose-400' : ''
                }`}
              style={{
                paddingLeft: '2.75rem',
                paddingRight: '2.75rem',
              }}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Minimum 8 characters',
                },
              })}
            />

            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10"
              style={{ color: 'var(--text-muted)' }}
              onClick={() =>
                setShowPassword(!showPassword)
              }
              aria-label={
                showPassword
                  ? 'Hide password'
                  : 'Show password'
              }
            >
              {showPassword ? (
                <EyeOff size={16} />
              ) : (
                <Eye size={16} />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="text-xs text-rose-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isLoading}
          className="w-full"
        >
          Create Account
        </Button>
      </form>

      {/* Terms */}
      <p
        className="text-center text-xs"
        style={{ color: 'var(--text-muted)' }}
      >
        By joining, you agree to our{' '}

        <a
          href="#"
          className="text-indigo-500 hover:underline"
        >
          Terms of Service
        </a>

        {' '}and{' '}

        <a
          href="#"
          className="text-indigo-500 hover:underline"
        >
          Privacy Policy
        </a>
        .
      </p>

      {/* Login */}
      <p
        className="text-center text-sm"
        style={{ color: 'var(--text-muted)' }}
      >
        Already have an account?{' '}

        <Link
          to="/login"
          className="font-semibold text-indigo-500 hover:text-indigo-600"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}