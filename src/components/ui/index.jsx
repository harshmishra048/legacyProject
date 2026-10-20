import React from 'react';

/* =========================================================
   AVATAR
   ========================================================= */

export function Avatar({
  src,
  name,
  initials,
  size = 'md',
  className = '',
  ring = false,
}) {
  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
    '3xl': 'w-24 h-24 text-3xl',
  };

  const colors = [
    'bg-indigo-500',
    'bg-violet-500',
    'bg-cyan-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-blue-500',
    'bg-orange-500',
  ];

  const safeSize = sizes[size] ? size : 'md';

  const colorIndex = name
    ? name.charCodeAt(0) % colors.length
    : 0;

  const backgroundColor = colors[colorIndex];

  const generatedInitials = name
    ? name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
    : '?';

  return (
    <div
      className={`
        ${sizes[safeSize]}
        ${backgroundColor}
        rounded-full
        flex
        items-center
        justify-center
        flex-shrink-0
        overflow-hidden
        font-bold
        text-white
        select-none
        ${ring ? 'ring-2 ring-offset-2 ring-indigo-500' : ''}
        ${className}
      `}
      style={{
        fontFamily: 'var(--font-sans)',
      }}
    >
      {src ? (
        <img
          src={src}
          alt={name || 'User avatar'}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <span>
          {initials || generatedInitials}
        </span>
      )}
    </div>
  );
}

/* =========================================================
   BADGE
   ========================================================= */

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
}) {
  const validVariants = [
    'default',
    'primary',
    'success',
    'warning',
    'danger',
    'info',
  ];

  const safeVariant = validVariants.includes(variant)
    ? variant
    : 'default';

  const safeSize = size === 'md' ? 'md' : 'sm';

  return (
    <span
      className={`
        badge
        badge-${safeVariant}
        badge-${safeSize}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

/* =========================================================
   BUTTON
   ========================================================= */

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const validVariants = [
    'primary',
    'secondary',
    'outline',
    'ghost',
    'danger',
    'success',
  ];

  const validSizes = ['xs', 'sm', 'md', 'lg'];

  const safeVariant = validVariants.includes(variant)
    ? variant
    : 'primary';

  const safeSize = validSizes.includes(size)
    ? size
    : 'md';

  return (
    <button
      type={type}
      className={`
        btn
        btn-${safeSize}
        btn-${safeVariant}
        ${loading || disabled ? 'opacity-60 cursor-not-allowed' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin w-4 h-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />

            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>

          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

/* =========================================================
   CARD
   ========================================================= */

export function Card({
  children,
  className = '',
  hoverable = false,
  padding = true,
  ...props
}) {
  return (
    <div
      className={`
        card
        ${hoverable ? 'cursor-pointer' : ''}
        ${padding ? 'p-5' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

/* =========================================================
   INPUT
   ========================================================= */

export function Input({
  label,
  error,
  helper,
  className = '',
  wrapperClassName = '',
  ...props
}) {
  return (
    <div
      className={`flex flex-col gap-1.5 ${wrapperClassName}`}
    >
      {label && (
        <label
          className="text-sm font-semibold"
          style={{
            color: 'var(--text-primary)',
          }}
        >
          {label}
        </label>
      )}

      <input
        className={`
          input
          ${error ? 'border-rose-400 focus:border-rose-400' : ''}
          ${className}
        `}
        {...props}
      />

      {error && (
        <p className="text-xs text-rose-500">
          {error}
        </p>
      )}

      {helper && !error && (
        <p
          className="text-xs"
          style={{
            color: 'var(--text-muted)',
          }}
        >
          {helper}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   SELECT
   ========================================================= */

export function Select({
  label,
  error,
  children,
  className = '',
  wrapperClassName = '',
  ...props
}) {
  return (
    <div
      className={`flex flex-col gap-1.5 ${wrapperClassName}`}
    >
      {label && (
        <label
          className="text-sm font-semibold"
          style={{
            color: 'var(--text-primary)',
          }}
        >
          {label}
        </label>
      )}

      <select
        className={`select ${className}`}
        {...props}
      >
        {children}
      </select>

      {error && (
        <p className="text-xs text-rose-500">
          {error}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   TEXTAREA
   ========================================================= */

export function Textarea({
  label,
  error,
  className = '',
  wrapperClassName = '',
  rows = 4,
  ...props
}) {
  return (
    <div
      className={`flex flex-col gap-1.5 ${wrapperClassName}`}
    >
      {label && (
        <label
          className="text-sm font-semibold"
          style={{
            color: 'var(--text-primary)',
          }}
        >
          {label}
        </label>
      )}

      <textarea
        rows={rows}
        className={`
          input
          resize-none
          ${error ? 'border-rose-400' : ''}
          ${className}
        `}
        {...props}
      />

      {error && (
        <p className="text-xs text-rose-500">
          {error}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   SKELETON
   ========================================================= */

export function Skeleton({
  className = '',
  height = 'h-4',
  width = 'w-full',
}) {
  return (
    <div
      className={`
        skeleton
        ${height}
        ${width}
        ${className}
      `}
      aria-hidden="true"
    />
  );
}

/* =========================================================
   PROGRESS BAR
   ========================================================= */

export function ProgressBar({
  value,
  max = 100,
  className = '',
  color = 'primary',
}) {
  const numericValue = Number(value) || 0;
  const numericMax = Number(max) || 100;

  const percentage = Math.min(
    100,
    Math.max(
      0,
      (numericValue / numericMax) * 100
    )
  );

  const gradients = {
    primary: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
    success: 'linear-gradient(90deg, #10b981, #34d399)',
    warning: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
    danger: 'linear-gradient(90deg, #f43f5e, #fb7185)',
    cyan: 'linear-gradient(90deg, #06b6d4, #22d3ee)',
  };

  return (
    <div
      className={`progress-bar ${className}`}
      role="progressbar"
      aria-valuenow={numericValue}
      aria-valuemin="0"
      aria-valuemax={numericMax}
    >
      <div
        className="progress-fill"
        style={{
          width: `${percentage}%`,
          background:
            gradients[color] || gradients.primary,
        }}
      />
    </div>
  );
}

/* =========================================================
   DIVIDER
   ========================================================= */

export function Divider({ className = '' }) {
  return (
    <div
      className={`divider ${className}`}
      role="separator"
    />
  );
}

/* =========================================================
   STAT CARD
   ========================================================= */

export function StatCard({
  icon,
  label,
  value,
  sub,
  color = 'primary',
  trend,
  className = '',
}) {
  const colors = {
    primary: {
      bg: 'rgba(99, 102, 241, 0.10)',
      text: '#6366f1',
    },

    violet: {
      bg: 'rgba(139, 92, 246, 0.10)',
      text: '#8b5cf6',
    },

    success: {
      bg: 'rgba(16, 185, 129, 0.10)',
      text: '#10b981',
    },

    warning: {
      bg: 'rgba(245, 158, 11, 0.10)',
      text: '#f59e0b',
    },

    danger: {
      bg: 'rgba(244, 63, 94, 0.10)',
      text: '#f43f5e',
    },

    cyan: {
      bg: 'rgba(6, 182, 212, 0.10)',
      text: '#06b6d4',
    },
  };

  const selectedColor =
    colors[color] || colors.primary;

  return (
    <div className={`stat-card ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted truncate">
            {label}
          </p>

          <p className="text-xl sm:text-2xl font-extrabold text-primary truncate tracking-tight">
            {value}
          </p>

          {sub && (
            <p className="text-xs text-muted truncate">
              {sub}
            </p>
          )}

          {trend !== undefined && (
            <span
              className={`
                text-xs
                font-bold
                flex
                items-center
                gap-0.5
                ${trend >= 0
                  ? 'text-emerald-500'
                  : 'text-rose-500'
                }
              `}
            >
              {trend >= 0 ? '↑' : '↓'}{' '}
              {Math.abs(trend)}%
            </span>
          )}
        </div>

        {icon && (
          <div
            className="
              w-10
              h-10
              rounded-xl
              flex
              items-center
              justify-center
              flex-shrink-0
            "
            style={{
              background: selectedColor.bg,
              color: selectedColor.text,
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
   ========================================================= */

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}) {
  return (
    <div
      className={`
        flex
        flex-col
        items-center
        justify-center
        py-16
        px-6
        text-center
        ${className}
      `}
    >
      {icon && (
        <div className="text-5xl mb-4 opacity-40">
          {icon}
        </div>
      )}

      <h3
        className="font-bold text-lg mb-2"
        style={{
          color: 'var(--text-primary)',
        }}
      >
        {title}
      </h3>

      {description && (
        <p
          className="text-sm mb-6 max-w-sm"
          style={{
            color: 'var(--text-muted)',
          }}
        >
          {description}
        </p>
      )}

      {action}
    </div>
  );
}

/* =========================================================
   SECTION HEADER
   ========================================================= */

export function SectionHeader({
  title,
  subtitle,
  action,
  className = '',
}) {
  return (
    <div
      className={`
        flex
        items-start
        justify-between
        gap-4
        ${className}
      `}
    >
      <div className="min-w-0">
        <h2
          className="text-lg font-bold"
          style={{
            color: 'var(--text-primary)',
          }}
        >
          {title}
        </h2>

        {subtitle && (
          <p
            className="text-sm mt-0.5"
            style={{
              color: 'var(--text-muted)',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   VERIFIED BADGE
   ========================================================= */

export function VerifiedBadge({
  size = 'sm',
}) {
  const className =
    size === 'sm'
      ? 'w-4 h-4'
      : 'w-5 h-5';

  return (
    <svg
      className={`
        ${className}
        text-indigo-500
        flex-shrink-0
      `}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-label="Verified"
    >
      <path
        fillRule="evenodd"
        d="
          M10 18a8 8 0 100-16
          8 8 0 000 16zm3.707-9.293
          a1 1 0 00-1.414-1.414L9
          10.586 7.707 9.293a1 1 0
          0 00-1.414 1.414l2 2a1 1
          0 001.414 0l4-4z
        "
        clipRule="evenodd"
      />
    </svg>
  );
}

/* =========================================================
   SPINNER
   ========================================================= */

export function Spinner({
  size = 'md',
  className = '',
}) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const safeSize = sizes[size]
    ? size
    : 'md';

  return (
    <svg
      className={`
        animate-spin
        ${sizes[safeSize]}
        text-indigo-500
        ${className}
      `}
      fill="none"
      viewBox="0 0 24 24"
      aria-label="Loading"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />

      <path
        className="opacity-75"
        fill="currentColor"
        d="
          M4 12a8 8 0 018-8v4a4 4
          0 00-4 4H4z
        "
      />
    </svg>
  );
}

/* =========================================================
   PAGE LOADER
   ========================================================= */

export function PageLoader() {
  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
      "
      style={{
        background: 'var(--bg-base)',
      }}
    >
      <Spinner size="lg" />
    </div>
  );
}

/* =========================================================
   LOGO
   ========================================================= */
export { Logo } from './Logo';