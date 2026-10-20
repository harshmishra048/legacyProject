import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/* =========================================================
   LOGO COMPONENT
   - Pure, elegant text wordmark by default.
   - If an image src / URL is passed, it displays the image seamlessly.
   - Graceful fallback to text if image fails to load.
   - Fully customizable size, variant, subtitle, and link wrapping.
   ========================================================= */

export function Logo({
  src,
  imageSrc,
  logoUrl,
  text = 'Legacy Sphere',
  subtitle = 'University Ecosystem',
  showSubtitle = true,
  collapsed = false,
  size = 'md',
  variant = 'gradient', // 'gradient' | 'white' | 'primary' | 'plain'
  asLink = false,
  to = '/',
  className = '',
  textClassName = '',
  subtitleClassName = '',
  imageClassName = '',
  onClick,
}) {
  const [imageError, setImageError] = useState(false);

  const finalImageSrc = src || imageSrc || logoUrl;
  const hasValidImage = finalImageSrc && !imageError;

  // Size mappings
  const sizeConfig = {
    xs: {
      text: 'text-xs font-bold tracking-tight',
      sub: 'text-[9px]',
      img: 'h-5 w-auto max-w-[100px] object-contain',
      gap: 'gap-1.5',
    },
    sm: {
      text: 'text-sm font-extrabold tracking-tight',
      sub: 'text-[9px]',
      img: 'h-7 w-auto max-w-[120px] object-contain',
      gap: 'gap-2',
    },
    md: {
      text: 'text-base sm:text-lg font-extrabold tracking-tight',
      sub: 'text-[10px]',
      img: 'h-8 sm:h-9 w-auto max-w-[160px] object-contain',
      gap: 'gap-2',
    },
    lg: {
      text: 'text-xl sm:text-2xl font-black tracking-tight',
      sub: 'text-xs',
      img: 'h-10 sm:h-12 w-auto max-w-[200px] object-contain',
      gap: 'gap-2.5',
    },
    xl: {
      text: 'text-2xl sm:text-3xl font-black tracking-tight',
      sub: 'text-xs sm:text-sm',
      img: 'h-14 sm:h-16 w-auto max-w-[240px] object-contain',
      gap: 'gap-3',
    },
  };

  const currentSize = sizeConfig[size] || sizeConfig.md;

  // Text color variant
  const getTextColorClass = () => {
    switch (variant) {
      case 'white':
        return 'text-white';
      case 'primary':
        return 'text-indigo-600 dark:text-indigo-400';
      case 'plain':
        return 'text-primary';
      case 'gradient':
      default:
        return 'gradient-text';
    }
  };

  const getSubColorClass = () => {
    switch (variant) {
      case 'white':
        return 'text-white/60';
      case 'primary':
        return 'text-indigo-500/70 dark:text-indigo-300/70';
      case 'plain':
        return 'text-muted';
      case 'gradient':
      default:
        return 'text-muted';
    }
  };

  // Main logo content
  const logoContent = (
    <div
      className={`inline-flex items-center select-none ${currentSize.gap} ${className}`}
      onClick={onClick}
    >
      {/* If custom image URL is provided, display image */}
      {hasValidImage ? (
        <img
          src={finalImageSrc}
          alt={text}
          className={`rounded-lg ${currentSize.img} ${imageClassName}`}
          onError={() => setImageError(true)}
          loading="eager"
        />
      ) : null}

      {/* Text Brand Wordmark */}
      {(!hasValidImage || showSubtitle) && (
        <div className="flex flex-col leading-none min-w-0">
          {!hasValidImage && (
            <span
              className={`leading-tight block font-display ${currentSize.text} ${getTextColorClass()} ${textClassName}`}
              style={{
                fontFamily: 'var(--font-display, var(--font-sans))',
              }}
            >
              {collapsed ? text.slice(0, 2).toUpperCase() : text}
            </span>
          )}

          {showSubtitle && !collapsed && subtitle && (
            <span
              className={`font-semibold uppercase tracking-wider block mt-0.5 ${currentSize.sub} ${getSubColorClass()} ${subtitleClassName}`}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link
        to={to}
        className="inline-flex items-center no-underline hover:opacity-90 transition-opacity"
        aria-label={text}
      >
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
export default Logo;
