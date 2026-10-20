import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Users,
  Trophy,
  Sparkles,
  DollarSign,
  BookOpen,
  GraduationCap,
  Sun,
  Moon,
  Play,
  Pause,
  Briefcase,
  TrendingUp,
  Award,
  Star,
  Calendar,
  ShieldCheck,
  Heart,
} from 'lucide-react';

import { Button, Badge, Logo } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { CONTRIBUTIONS } from '../data/mockData';

/* =========================================================
   HERO CAROUSEL DATA
========================================================= */

const HERO_SLIDES = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=2200&q=85',
    eyebrow: 'THE NEXT-GEN UNIVERSITY NETWORK',
    title: 'Your University.',
    highlight: 'Your Network.',
    description:
      'Connect with the people, knowledge and opportunities that continue long after graduation.',
    tag: '8,420+ Members',
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=2200&q=85',
    eyebrow: 'LEARN FROM THE PEOPLE AHEAD OF YOU',
    title: 'Knowledge.',
    highlight: 'Passed Forward.',
    description:
      'Learn directly from alumni, professors and industry professionals through meaningful experiences.',
    tag: '892+ Sessions',
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=2200&q=85',
    eyebrow: 'TURN EXPERTISE INTO IMPACT',
    title: 'Share Knowledge.',
    highlight: 'Build Legacy.',
    description:
      'Host seminars, workshops and mentoring sessions while creating measurable value for your university.',
    tag: '₹12.4L+ Earned',
  },
  {
    id: 4,
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=2200&q=85',
    eyebrow: 'YOUR CAREER STARTS WITH CONNECTIONS',
    title: 'Opportunities.',
    highlight: 'Within Reach.',
    description:
      'Discover internships, jobs, mentors and professional opportunities through your university ecosystem.',
    tag: '1,200+ Opportunities',
  },
];

/* =========================================================
   LANDING PAGE
========================================================= */

export default function LandingPage() {
  const { isAuthenticated, user, loginWithGoogle } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentSlide = HERO_SLIDES[activeSlide];

  /* =========================================================
     AUTO PLAY
  ========================================================= */

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  /* =========================================================
     SLIDE CONTROL
  ========================================================= */

  const goToSlide = (index) => {
    setActiveSlide(index);
  };

  /* =========================================================
     DEMO ACCESS
  ========================================================= */

  const handleDemoAccess = async (role) => {
    await loginWithGoogle(role);
    navigate(`/${role}/dashboard`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-base text-primary overflow-x-hidden">

      {/* =====================================================
          TOP NAVBAR
      ===================================================== */}

      <header className="h-20 border-b border-default sticky top-0 z-50 backdrop-blur-xl bg-surface/80 flex items-center justify-between px-6 lg:px-12">

        <Logo asLink to="/" size="md" />

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-secondary">

          <a
            href="#flywheel"
            className="hover:text-primary transition-colors"
          >
            How It Works
          </a>

          <a
            href="#contributions"
            className="hover:text-primary transition-colors"
          >
            Contributions
          </a>

          <a
            href="#mentorship"
            className="hover:text-primary transition-colors"
          >
            Mentorship
          </a>

          <a
            href="#gamification"
            className="hover:text-primary transition-colors"
          >
            Gamification
          </a>

        </nav>

        <div className="flex items-center gap-3">

          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface-secondary text-secondary hover:text-primary transition-colors"
            title="Toggle theme"
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {isAuthenticated ? (
            <Link to={`/${user?.role || 'student'}/dashboard`}>
              <Button
                variant="primary"
                size="md"
                className="gap-1.5 font-bold shadow-md"
              >
                Go to Dashboard
                <ArrowRight size={15} />
              </Button>
            </Link>
          ) : (
            <div className="flex items-center gap-2">

              <Link to="/login">
                <Button
                  variant="ghost"
                  size="md"
                  className="font-semibold"
                >
                  Sign In
                </Button>
              </Link>

              <Link to="/signup">
                <Button
                  variant="primary"
                  size="md"
                  className="font-bold shadow-md"
                >
                  Join Legacy Sphere
                </Button>
              </Link>

            </div>
          )}

        </div>
      </header>


      {/* =====================================================
          PREMIUM HERO CAROUSEL
      ===================================================== */}

      <section
        className="relative min-h-[720px] lg:min-h-[calc(100vh-80px)] overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >

        {/* -----------------------------------------------------
            BACKGROUND SLIDES
        ----------------------------------------------------- */}

        <AnimatePresence mode="sync">

          <motion.div
            key={currentSlide.id}
            className="absolute inset-0"
            initial={{
              opacity: 0,
              scale: 1.08,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 1.03,
            }}
            transition={{
              opacity: {
                duration: 0.8,
                ease: 'easeInOut',
              },
              scale: {
                duration: 6,
                ease: 'linear',
              },
            }}
          >

            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/55" />

            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

          </motion.div>

        </AnimatePresence>


        {/* -----------------------------------------------------
            AMBIENT GLOW
        ----------------------------------------------------- */}

        <div className="absolute inset-0 pointer-events-none">

          <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-indigo-500/10 blur-[120px]" />

          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-violet-500/10 blur-[140px]" />

        </div>


        {/* -----------------------------------------------------
            HERO CONTENT
        ----------------------------------------------------- */}

        <div className="relative z-10 min-h-[720px] lg:min-h-[calc(100vh-80px)] flex items-center px-6 lg:px-12 py-20">

          <div className="max-w-7xl w-full mx-auto">

            <div className="max-w-3xl">

              <AnimatePresence mode="wait">

                <motion.div
                  key={currentSlide.id}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -20,
                  }}
                  transition={{
                    duration: 0.5,
                  }}
                >

                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-xl text-white text-xs font-bold tracking-wide mb-6">

                    <Sparkles
                      size={14}
                      className="text-indigo-300"
                    />

                    {currentSlide.eyebrow}

                  </div>


                  <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tight leading-[0.98] text-white">

                    {currentSlide.title}

                    <br />

                    <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
                      {currentSlide.highlight}
                    </span>

                  </h1>


                  <p className="mt-7 text-base sm:text-lg lg:text-xl text-white/75 max-w-2xl leading-relaxed">
                    {currentSlide.description}
                  </p>


                  <div className="mt-8 flex flex-wrap items-center gap-3">

                    <Link to="/signup">

                      <Button
                        size="xl"
                        variant="primary"
                        className="gap-2 shadow-2xl font-bold"
                      >
                        Get Started Free
                        <ArrowRight size={17} />
                      </Button>

                    </Link>

                    <Link to="/login">

                      <Button
                        size="xl"
                        variant="secondary"
                        className="gap-2 font-semibold backdrop-blur-xl"
                      >
                        Explore Demo
                      </Button>

                    </Link>

                  </div>


                  <div className="mt-8 inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 backdrop-blur-xl">

                    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />

                    <span className="text-sm font-semibold text-white">
                      {currentSlide.tag}
                    </span>

                    <span className="text-xs text-white/50">
                      • Live ecosystem
                    </span>

                  </div>

                </motion.div>

              </AnimatePresence>

            </div>

          </div>

        </div>


        {/* =====================================================
            BOTTOM SLIDE CONTROLS
        ===================================================== */}

        <div className="absolute z-20 bottom-8 left-6 right-6 lg:left-12 lg:right-12">

          <div className="max-w-7xl mx-auto flex items-end justify-between gap-6">

            {/* Slide indicators */}

            <div className="flex items-center gap-2">

              {HERO_SLIDES.map((slide, index) => (

                <button
                  key={slide.id}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className="group relative h-1.5 rounded-full overflow-hidden bg-white/25 transition-all duration-300"
                  style={{
                    width: activeSlide === index ? 64 : 28,
                  }}
                >

                  {activeSlide === index && (
                    <motion.div
                      key={`progress-${activeSlide}`}
                      className="absolute inset-y-0 left-0 bg-white rounded-full"
                      initial={{
                        width: '0%',
                      }}
                      animate={{
                        width: isPaused ? '45%' : '100%',
                      }}
                      transition={{
                        duration: isPaused ? 0.3 : 5,
                        ease: 'linear',
                      }}
                    />
                  )}

                </button>

              ))}

            </div>


            {/* Pause / Play */}

            <button
              onClick={() => setIsPaused((prev) => !prev)}
              className="w-10 h-10 rounded-full bg-black/30 border border-white/15 backdrop-blur-xl text-white flex items-center justify-center hover:bg-white/10 transition-all"
              aria-label={isPaused ? 'Play carousel' : 'Pause carousel'}
            >

              {isPaused ? (
                <Play
                  size={14}
                  fill="currentColor"
                />
              ) : (
                <Pause size={14} />
              )}

            </button>

          </div>

        </div>


        {/* =====================================================
            MINI SLIDE PREVIEW CARDS
        ===================================================== */}

        <div className="hidden lg:flex absolute z-20 right-12 bottom-28 gap-2">

          {HERO_SLIDES.map((slide, index) => (

            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${activeSlide === index
                  ? 'w-28 h-16 border-white/70 scale-105'
                  : 'w-20 h-12 border-white/10 opacity-60 hover:opacity-100'
                }`}
            >

              <img
                src={slide.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/35" />

              <span className="absolute bottom-1.5 left-2 text-[9px] font-bold text-white">
                0{index + 1}
              </span>

            </button>

          ))}

        </div>

      </section>


      {/* =====================================================
          ECOSYSTEM STATS
      ===================================================== */}

      <section className="relative border-y border-default bg-surface">

        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">

            {[
              {
                value: '8.4K+',
                label: 'Community Members',
                icon: Users,
              },
              {
                value: '892+',
                label: 'Knowledge Sessions',
                icon: BookOpen,
              },
              {
                value: '1.2K+',
                label: 'Career Opportunities',
                icon: Briefcase,
              },
              {
                value: '₹12.4L+',
                label: 'Knowledge Economy',
                icon: TrendingUp,
              },
            ].map((stat, index) => {

              const Icon = stat.icon;

              return (
                <motion.div
                  key={stat.label}
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: index * 0.08,
                  }}
                  whileHover={{
                    y: -3,
                  }}
                  className="flex items-center gap-3 lg:gap-4 p-4 rounded-2xl bg-surface-secondary/60 border border-default"
                >

                  <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center flex-shrink-0">
                    <Icon size={19} />
                  </div>

                  <div className="min-w-0">

                    <div className="text-lg lg:text-xl font-black text-primary">
                      {stat.value}
                    </div>

                    <div className="text-[10px] lg:text-xs text-muted truncate">
                      {stat.label}
                    </div>

                  </div>

                </motion.div>
              );
            })}

          </div>

        </div>

      </section>


      {/* =====================================================
          PRODUCT FLYWHEEL SECTION
      ===================================================== */}

      <section
        id="flywheel"
        className="py-20 px-6 lg:px-12 bg-surface-secondary/40 border-y border-default"
      >

        <div className="max-w-6xl mx-auto space-y-12">

          <div className="text-center max-w-2xl mx-auto space-y-3">

            <span className="badge badge-primary text-xs font-bold uppercase">
              The Virtuous Cycle
            </span>

            <h2 className="text-3xl lg:text-4xl font-black text-primary">
              The University Relationship Flywheel
            </h2>

            <p className="text-sm text-muted">
              Legacy Sphere turns graduation from an ending into the
              start of a lifelong professional relationship.
            </p>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {[
              {
                step: '01',
                title: 'Students Learn',
                desc: 'Freshmen & juniors attend masterclasses, build streaks, earn verified badges, and connect with mentors.',
                icon: BookOpen,
                color: 'text-cyan-500',
              },
              {
                step: '02',
                title: 'Become Alumni',
                desc: 'Graduates enter top companies with an active university reputation and immediate industry credibility.',
                icon: GraduationCap,
                color: 'text-indigo-500',
              },
              {
                step: '03',
                title: 'Contribute & Earn',
                desc: 'Alumni create paid seminars, workshops, and mock interviews to share knowledge and earn income.',
                icon: DollarSign,
                color: 'text-emerald-500',
              },
              {
                step: '04',
                title: 'Build Legacy',
                desc: 'Every session improves their Legacy Score, unlocks senior badges, and empowers the next batch.',
                icon: Trophy,
                color: 'text-amber-500',
              },
            ].map((item, index) => {

              const Icon = item.icon;

              return (
                <motion.div
                  key={item.step}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: index * 0.08,
                  }}
                  className="card p-6 relative overflow-hidden"
                  whileHover={{
                    y: -5,
                  }}
                >

                  <span className="text-4xl font-black text-muted/20 absolute top-4 right-4">
                    {item.step}
                  </span>

                  <div
                    className={`w-12 h-12 rounded-2xl bg-surface-secondary flex items-center justify-center mb-4 ${item.color}`}
                  >
                    <Icon size={24} />
                  </div>

                  <h3 className="text-base font-bold text-primary mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-muted leading-relaxed">
                    {item.desc}
                  </p>

                </motion.div>
              );
            })}

          </div>

        </div>

      </section>


      {/* =====================================================
          VISUAL ECOSYSTEM
      ===================================================== */}

      <section
        id="mentorship"
        className="py-24 px-6 lg:px-12"
      >

        <div className="max-w-7xl mx-auto">

          <div className="max-w-2xl mb-12">

            <span className="badge badge-primary text-xs font-bold uppercase">
              One Connected Ecosystem
            </span>

            <h2 className="text-3xl lg:text-4xl font-black text-primary mt-3">
              Everything your university community needs.
            </h2>

            <p className="text-sm text-muted mt-3 leading-relaxed">
              Legacy Sphere brings students, alumni, professors and
              opportunities into one intelligent ecosystem.
            </p>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {[
              {
                title: 'Alumni Network',
                description:
                  'Reconnect with graduates, discover their journeys and build meaningful professional relationships.',
                image:
                  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=85',
                icon: Users,
                tag: 'Connect',
              },
              {
                title: 'Knowledge Exchange',
                description:
                  'Learn through seminars, workshops, mock interviews and real-world experiences.',
                image:
                  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=85',
                icon: BookOpen,
                tag: 'Learn',
              },
              {
                title: 'Career Opportunities',
                description:
                  'Find internships, jobs and professional opportunities through your university network.',
                image:
                  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=85',
                icon: Briefcase,
                tag: 'Grow',
              },
            ].map((item, index) => {

              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: index * 0.08,
                  }}
                  whileHover={{
                    y: -8,
                  }}
                  className="group relative overflow-hidden rounded-3xl border border-default bg-surface"
                >

                  <div className="relative h-56 overflow-hidden">

                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute top-4 left-4">

                      <span className="px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-xl border border-white/15 text-white text-[10px] font-bold uppercase tracking-wider">
                        {item.tag}
                      </span>

                    </div>

                    <div className="absolute bottom-4 left-4 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center">
                      <Icon size={18} />
                    </div>

                  </div>


                  <div className="p-6">

                    <h3 className="text-lg font-bold text-primary">
                      {item.title}
                    </h3>

                    <p className="text-sm text-muted leading-relaxed mt-2">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-2 mt-5 text-xs font-bold text-indigo-500">
                      Explore ecosystem
                      <ArrowRight size={13} />
                    </div>

                  </div>

                </motion.div>
              );
            })}

          </div>

        </div>

      </section>


      {/* =====================================================
          CONTRIBUTION ECONOMY
      ===================================================== */}

      <section
        id="contributions"
        className="py-20 px-6 lg:px-12"
      >

        <div className="max-w-6xl mx-auto space-y-12">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">

            <div>

              <span className="badge badge-violet text-xs font-bold uppercase">
                Contribution Economy
              </span>

              <h2 className="text-3xl lg:text-4xl font-black text-primary mt-2">
                Monetize Knowledge & Empower Juniors
              </h2>

              <p className="text-sm text-muted mt-1">
                Alumni and professors conduct seminars, mock interviews,
                and career talks.
              </p>

            </div>

            <Link to="/contributions">

              <Button
                variant="secondary"
                size="md"
              >
                Explore All Contributions
                <ArrowRight size={14} />
              </Button>

            </Link>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {CONTRIBUTIONS.slice(0, 3).map((item, index) => (

              <motion.div
                key={item.id}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: index * 0.08,
                }}
                whileHover={{
                  y: -5,
                }}
                className="card p-5 flex flex-col justify-between"
              >

                <div>

                  <div className="flex justify-between items-start mb-3">

                    <Badge variant="primary">
                      {item.type}
                    </Badge>

                    <span className="font-extrabold text-sm text-indigo-500">
                      {item.isFree
                        ? 'Free'
                        : `₹${item.price}`}
                    </span>

                  </div>

                  <h4 className="text-sm font-bold text-primary mb-2 line-clamp-2">
                    {item.title}
                  </h4>

                  <p className="text-xs text-muted line-clamp-2 mb-4">
                    {item.description}
                  </p>

                </div>


                <div className="pt-3 border-t border-subtle flex items-center justify-between text-xs">

                  <span className="text-secondary font-semibold">
                    {item.speaker.name}
                  </span>

                  <span className="text-muted">
                    {item.registered} registered
                  </span>

                </div>

              </motion.div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          LEGACY SCORE / GAMIFICATION
      ===================================================== */}

      <section
        id="gamification"
        className="py-24 px-6 lg:px-12 bg-surface-secondary/40 border-y border-default"
      >

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

          <div>

            <span className="badge badge-violet text-xs font-bold uppercase">
              Reputation Engine
            </span>

            <h2 className="text-3xl lg:text-5xl font-black text-primary mt-4 leading-tight">
              Your contribution becomes
              <span className="gradient-text"> your legacy.</span>
            </h2>

            <p className="text-sm text-muted leading-relaxed mt-5 max-w-xl">
              Every mentorship session, seminar, contribution and
              community interaction helps build a verified Legacy Score.
            </p>


            <div className="grid grid-cols-2 gap-4 mt-8">

              {[
                {
                  value: '+120',
                  label: 'Knowledge Points',
                  icon: Sparkles,
                },
                {
                  value: '18',
                  label: 'Badges Earned',
                  icon: Award,
                },
                {
                  value: '42',
                  label: 'Mentorship Hours',
                  icon: Users,
                },
                {
                  value: '#08',
                  label: 'Community Rank',
                  icon: Trophy,
                },
              ].map((item, index) => {

                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.label}
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay: index * 0.08,
                    }}
                    className="p-5 rounded-2xl bg-surface border border-default"
                  >

                    <div className="flex items-center justify-between">

                      <div className="text-2xl font-black text-primary">
                        {item.value}
                      </div>

                      <Icon
                        size={17}
                        className="text-indigo-500"
                      />

                    </div>

                    <div className="text-xs text-muted mt-1">
                      {item.label}
                    </div>

                  </motion.div>
                );
              })}

            </div>

          </div>


          {/* -------------------------------------------------
              LEGACY SCORE CARD
          ------------------------------------------------- */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
            }}
            className="relative"
          >

            <div className="relative overflow-hidden rounded-3xl border border-default bg-surface p-7 lg:p-8 shadow-2xl">

              <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />

              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />


              <div className="relative">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs text-muted uppercase font-bold tracking-wider">
                      Legacy Score
                    </p>

                    <p className="text-5xl font-black text-primary mt-2">
                      8,940
                    </p>

                    <div className="flex items-center gap-1 mt-2 text-xs text-emerald-500 font-semibold">
                      <TrendingUp size={13} />
                      +18.4% this month
                    </div>

                  </div>


                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg">
                    <Trophy size={28} />
                  </div>

                </div>


                <div className="mt-8">

                  <div className="flex justify-between text-xs mb-2">

                    <span className="text-secondary font-semibold">
                      Next Level
                    </span>

                    <span className="text-muted">
                      89%
                    </span>

                  </div>


                  <div className="h-2 rounded-full bg-surface-secondary overflow-hidden">

                    <motion.div
                      initial={{
                        width: 0,
                      }}
                      whileInView={{
                        width: '89%',
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        duration: 1.2,
                      }}
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                    />

                  </div>

                </div>


                <div className="grid grid-cols-3 gap-3 mt-8">

                  {[
                    ['🔥', '14', 'Day Streak'],
                    ['🏆', '18', 'Badges'],
                    ['⭐', '4.9', 'Rating'],
                  ].map(([emoji, value, label]) => (

                    <div
                      key={label}
                      className="rounded-xl bg-surface-secondary p-3 text-center"
                    >

                      <div className="text-lg">
                        {emoji}
                      </div>

                      <div className="font-black text-primary mt-1">
                        {value}
                      </div>

                      <div className="text-[10px] text-muted">
                        {label}
                      </div>

                    </div>

                  ))}

                </div>


                <div className="mt-6 pt-5 border-t border-default flex items-center justify-between">

                  <div className="flex items-center gap-2">

                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                      <ShieldCheck size={15} />
                    </div>

                    <div>

                      <p className="text-xs font-bold text-primary">
                        Verified Reputation
                      </p>

                      <p className="text-[10px] text-muted">
                        Built through real contributions
                      </p>

                    </div>

                  </div>

                  <Star
                    size={17}
                    className="text-amber-500"
                    fill="currentColor"
                  />

                </div>

              </div>

            </div>

          </motion.div>

        </div>

      </section>


      {/* =====================================================
          COMMUNITY / TRUST SECTION
      ===================================================== */}

      <section className="py-20 px-6 lg:px-12">

        <div className="max-w-6xl mx-auto">

          <div className="text-center max-w-2xl mx-auto mb-12">

            <span className="badge badge-primary text-xs font-bold uppercase">
              Built Around People
            </span>

            <h2 className="text-3xl lg:text-4xl font-black text-primary mt-3">
              More than a platform.
              <span className="gradient-text"> A community.</span>
            </h2>

            <p className="text-sm text-muted mt-3 leading-relaxed">
              A place where experience is passed forward, relationships
              compound and every generation contributes to the next.
            </p>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {[
              {
                icon: GraduationCap,
                title: 'Students',
                value: 'Learn & Grow',
                description:
                  'Discover mentors, build skills, attend sessions and unlock career opportunities.',
                className: 'text-cyan-500',
              },
              {
                icon: Users,
                title: 'Alumni',
                value: 'Connect & Contribute',
                description:
                  'Give back to your university, build your reputation and monetize your expertise.',
                className: 'text-indigo-500',
              },
              {
                icon: Heart,
                title: 'Professors',
                value: 'Guide & Inspire',
                description:
                  'Extend academic impact beyond the classroom through meaningful knowledge exchange.',
                className: 'text-rose-500',
              },
            ].map((item, index) => {

              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: index * 0.1,
                  }}
                  whileHover={{
                    y: -5,
                  }}
                  className="card p-7 text-center"
                >

                  <div
                    className={`w-14 h-14 mx-auto rounded-2xl bg-surface-secondary flex items-center justify-center ${item.className}`}
                  >
                    <Icon size={25} />
                  </div>

                  <p className="text-xs uppercase tracking-wider font-bold text-muted mt-5">
                    {item.title}
                  </p>

                  <h3 className="text-xl font-black text-primary mt-1">
                    {item.value}
                  </h3>

                  <p className="text-xs text-muted leading-relaxed mt-3">
                    {item.description}
                  </p>

                </motion.div>
              );
            })}

          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="py-24 px-6 lg:px-12">

        <div className="max-w-5xl mx-auto">

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            className="relative overflow-hidden rounded-[2rem] border border-default bg-surface-secondary p-10 lg:p-16 text-center"
          >

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-indigo-500/10 blur-[100px]" />

            <div className="absolute bottom-0 left-1/4 w-64 h-32 bg-violet-500/10 blur-[90px]" />


            <div className="relative">

              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-6">
                <Sparkles size={25} />
              </div>


              <h2 className="text-3xl lg:text-5xl font-black text-primary">
                Your legacy starts today.
              </h2>


              <p className="text-sm lg:text-base text-muted max-w-xl mx-auto mt-4 leading-relaxed">
                Join the university ecosystem where knowledge is shared,
                relationships compound and every contribution matters.
              </p>


              <div className="flex flex-wrap justify-center gap-3 mt-8">

                <Link to="/signup">

                  <Button
                    size="xl"
                    variant="primary"
                    className="gap-2 font-bold shadow-xl"
                  >
                    Join Legacy Sphere
                    <ArrowRight size={17} />
                  </Button>

                </Link>


                <Link to="/login">

                  <Button
                    size="xl"
                    variant="secondary"
                    className="font-semibold"
                  >
                    Explore the Platform
                  </Button>

                </Link>

              </div>

            </div>

          </motion.div>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="mt-auto py-12 px-6 lg:px-12 border-t border-default bg-surface text-secondary text-xs">

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">

          <Logo
            asLink
            to="/"
            size="sm"
            subtitle="A Lifelong University Ecosystem"
          />

          <p className="text-muted">
            © 2026 Legacy Sphere Inc. Designed for universities,
            alumni associations, and students.
          </p>

          <div className="flex gap-4 font-semibold">

            <a
              href="#"
              className="hover:text-primary"
            >
              Privacy
            </a>

            <a
              href="#"
              className="hover:text-primary"
            >
              Terms
            </a>

            <a
              href="#"
              className="hover:text-primary"
            >
              Contact
            </a>

          </div>

        </div>

      </footer>

    </div>
  );
}