import { Outlet, useLocation } from 'react-router-dom';
import { ArrowUpRight, Users, Sparkles } from 'lucide-react';
import { Logo } from '../components/ui';

const AUTH_VISUALS = {
  login: {
    eyebrow: 'WELCOME BACK',
    title: 'Reconnect with your',
    highlight: 'university world.',
    description:
      'Pick up where you left off. Reconnect with classmates, discover mentors, join conversations and keep building your university legacy.',
    image:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=85',
    badge: '8,420+ members connected',
    badgeIcon: Users,
    smallTitle: 'Your network is waiting.',
    smallText: 'Students • Alumni • Professors • Opportunities',
  },

  signup: {
    eyebrow: 'START YOUR JOURNEY',
    title: 'Build connections that',
    highlight: 'last a lifetime.',
    description:
      'Create your Legacy Sphere profile and become part of a university ecosystem designed around people, knowledge and opportunity.',
    image:
      'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1400&q=85',
    badge: 'One ecosystem. Every generation.',
    badgeIcon: Sparkles,
    smallTitle: 'Your legacy starts here.',
    smallText: 'Learn • Connect • Mentor • Grow',
  },
};

export function AuthLayout() {
  const location = useLocation();

  const isSignup = location.pathname.includes('signup');
  const visual = isSignup ? AUTH_VISUALS.signup : AUTH_VISUALS.login;
  const BadgeIcon = visual.badgeIcon;

  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* =========================================================
          LEFT — VISUAL / IMAGE PANEL
      ========================================================== */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden p-8 xl:p-12">
        {/* Base gradient */}
        <div className="absolute inset-0 hero-gradient" />

        {/* Image */}
        <img
          src={visual.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                135deg,
                rgba(7, 7, 13, 0.96) 0%,
                rgba(7, 7, 13, 0.78) 42%,
                rgba(7, 7, 13, 0.58) 72%,
                rgba(7, 7, 13, 0.88) 100%
              )
            `,
          }}
        />

        {/* Purple glow */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: 'rgba(99,102,241,0.20)',
          }}
        />

        <div
          className="absolute -bottom-40 right-0 w-[32rem] h-[32rem] rounded-full blur-3xl"
          style={{
            background: 'rgba(124,58,237,0.16)',
          }}
        />

        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col w-full h-full">
          {/* Logo */}
          <div className="flex items-center">
            <Logo
              variant="white"
              size="lg"
              asLink
              to="/"
            />
          </div>

          {/* Main visual content */}
          <div className="flex-1 flex items-center">
            <div className="max-w-xl">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 border border-white/10 bg-white/[0.06] backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-[10px] tracking-[0.18em] font-bold text-white/60">
                  {visual.eyebrow}
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl xl:text-6xl font-bold text-white leading-[1.05] tracking-tight">
                {visual.title}
                <br />

                <span className="gradient-text">
                  {visual.highlight}
                </span>
              </h1>

              {/* Description */}
              <p className="text-white/65 text-base xl:text-lg max-w-lg leading-relaxed mt-6">
                {visual.description}
              </p>

              {/* Image badge */}
              <div className="mt-8 flex items-center gap-3">
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    borderColor: 'rgba(255,255,255,0.12)',
                  }}
                >
                  <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                    <BadgeIcon size={17} className="text-white" />
                  </div>

                  <div>
                    <p className="text-white text-sm font-semibold">
                      {visual.badge}
                    </p>

                    <p className="text-white/40 text-[11px] mt-0.5">
                      {visual.smallText}
                    </p>
                  </div>
                </div>

                <div className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.05] flex items-center justify-center">
                  <ArrowUpRight size={17} className="text-white/60" />
                </div>
              </div>

              {/* Bottom mini card */}
              <div className="mt-8 max-w-md">
                <div
                  className="rounded-2xl p-4 border backdrop-blur-xl"
                  style={{
                    background: 'rgba(255,255,255,0.055)',
                    borderColor: 'rgba(255,255,255,0.10)',
                  }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-white text-sm font-semibold">
                        {visual.smallTitle}
                      </p>

                      <p className="text-white/40 text-xs mt-1">
                        {visual.smallText}
                      </p>
                    </div>

                    <div className="flex -space-x-2">
                      {['PK', 'AM', 'RS', 'KM'].map((initials, index) => (
                        <div
                          key={initials}
                          className="w-8 h-8 rounded-full border-2 border-[#09090d] flex items-center justify-center text-[9px] font-bold text-white"
                          style={{
                            background:
                              index === 0
                                ? '#6366f1'
                                : index === 1
                                  ? '#8b5cf6'
                                  : index === 2
                                    ? '#06b6d4'
                                    : '#f59e0b',
                          }}
                        >
                          {initials}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-white/30 text-xs">
            <span>© 2026 Legacy Sphere</span>
            <span>University Ecosystem</span>
          </div>
        </div>
      </div>

      {/* =========================================================
          RIGHT — AUTH FORM
      ========================================================== */}
      <div
        className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 overflow-y-auto"
        style={{ background: 'var(--bg-base)' }}
      >
        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <Logo size="md" asLink to="/" />
        </div>

        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}