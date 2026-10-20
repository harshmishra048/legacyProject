import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui';

const DEMO_ACCOUNTS = [
  {
    role: 'student',
    email: 'student@iit.ac.in',
    label: 'Student',
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.1)',
  },
  {
    role: 'alumni',
    email: 'alumni@iit.ac.in',
    label: 'Alumni',
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.1)',
  },
  {
    role: 'professor',
    email: 'professor@iit.ac.in',
    label: 'Professor',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.1)',
  },
  {
    role: 'admin',
    email: 'admin@iit.ac.in',
    label: 'Admin',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
  },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: 'student@iit.ac.in',
      password: 'demo1234',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const user = await login(data.email, data.password);

      toast.success(
        `Welcome back, ${user.name.split(' ')[0]}!`
      );

      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (account) => {
    setValue('email', account.email);
    setValue('password', 'demo1234');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-7"
    >
      {/* Header */}
      <div>
        <h2
          className="text-2xl font-bold mb-1"
          style={{ color: 'var(--text-primary)' }}
        >
          Welcome back
        </h2>

        <p
          className="text-sm"
          style={{ color: 'var(--text-muted)' }}
        >
          Sign in to your Legacy Sphere account
        </p>
      </div>

      {/* Demo accounts */}
      <div className="flex flex-col gap-3">
        <p
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: 'var(--text-muted)' }}
        >
          Quick demo login
        </p>

        <div className="grid grid-cols-2 gap-2">
          {DEMO_ACCOUNTS.map((acc) => (
            <button
              key={acc.role}
              type="button"
              onClick={() => handleDemoLogin(acc)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all hover:scale-[1.02]"
              style={{
                background: acc.bg,
                borderColor: `${acc.color}33`,
                color: acc.color,
              }}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: acc.color }}
              />

              <span>{acc.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 divider" />

        <span
          className="text-xs font-medium whitespace-nowrap"
          style={{ color: 'var(--text-muted)' }}
        >
          or sign in with email
        </span>

        <div className="flex-1 divider" />
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {/* Email */}
        <div>
          <label
            className="text-sm font-semibold mb-1.5 block"
            style={{ color: 'var(--text-primary)' }}
          >
            Email address
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
          <div className="flex items-center justify-between mb-1.5">
            <label
              className="text-sm font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              Password
            </label>

            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-indigo-500 hover:text-indigo-600"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
              style={{ color: 'var(--text-muted)' }}
            />

            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`input w-full ${errors.password ? 'border-rose-400' : ''
                }`}
              style={{
                paddingLeft: '2.75rem',
                paddingRight: '2.75rem',
              }}
              {...register('password', {
                required: 'Password is required',
              })}
            />

            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10"
              style={{ color: 'var(--text-muted)' }}
              onClick={() => setShowPassword(!showPassword)}
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
          className="w-full mt-2"
        >
          Sign In to Legacy Sphere
        </Button>
      </form>

      {/* Signup */}
      <p
        className="text-center text-sm"
        style={{ color: 'var(--text-muted)' }}
      >
        Don't have an account?{' '}

        <Link
          to="/signup"
          className="font-semibold text-indigo-500 hover:text-indigo-600"
        >
          Create one free
        </Link>
      </p>
    </motion.div>
  );
}