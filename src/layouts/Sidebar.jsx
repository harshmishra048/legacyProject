import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  X,
  LogOut,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { NAV_CONFIG, ROLE_CONFIG } from '../routes/navConfig';
import { Avatar, Logo } from '../components/ui';

const SIDEBAR_COLLAPSED_KEY =
  'legacy_sphere_sidebar_collapsed';

export function Sidebar({
  mobileOpen,
  onMobileClose,
}) {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();

  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(() => {
    return (
      localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true'
    );
  });

  useEffect(() => {
    localStorage.setItem(
      SIDEBAR_COLLAPSED_KEY,
      collapsed
    );
  }, [collapsed]);

  const navItems =
    NAV_CONFIG[user?.role] || NAV_CONFIG.student;

  const roleConf =
    ROLE_CONFIG[user?.role] || ROLE_CONFIG.student;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div
      className="flex flex-col h-full"
      style={{
        background: 'var(--sidebar-bg)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center justify-between gap-2 px-4 h-16 border-b flex-shrink-0"
        style={{
          borderColor: 'var(--sidebar-border)',
        }}
      >
        <Logo
          collapsed={collapsed}
          size="sm"
          asLink
          to="/"
          className="min-w-0"
        />

        <div className="ml-auto flex-shrink-0">
          {/* Desktop collapse */}
          <button
            onClick={() =>
              setCollapsed(!collapsed)
            }
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-80 hidden lg:flex"
            style={{
              background:
                'var(--bg-surface-secondary)',
              color: 'var(--text-muted)',
            }}
            aria-label={
              collapsed
                ? 'Expand sidebar'
                : 'Collapse sidebar'
            }
          >
            {collapsed ? (
              <ChevronRight size={14} />
            ) : (
              <ChevronLeft size={14} />
            )}
          </button>

          {/* Mobile close */}
          <button
            onClick={onMobileClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center lg:hidden"
            style={{
              background:
                'var(--bg-surface-secondary)',
              color: 'var(--text-muted)',
            }}
            aria-label="Close menu"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* User info */}
      <div
        className="px-4 py-3 flex-shrink-0 border-b"
        style={{
          borderColor: 'var(--sidebar-border)',
        }}
      >
        <div
          className={`flex items-center gap-3 p-2 rounded-xl transition-all ${collapsed ? 'justify-center' : ''
            }`}
          style={{
            background:
              'var(--sidebar-item-hover)',
          }}
        >
          <Avatar
            name={user?.name}
            initials={user?.initials}
            size="sm"
          />

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{
                  opacity: 0,
                  x: -10,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -10,
                }}
                className="flex flex-col min-w-0 flex-1"
              >
                <span
                  className="text-sm font-semibold truncate"
                  style={{
                    color: 'var(--text-primary)',
                  }}
                >
                  {user?.name}
                </span>

                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full w-fit mt-0.5"
                  style={{
                    background: roleConf.bg,
                    color: roleConf.color,
                  }}
                >
                  {roleConf.label}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            location.pathname === item.path ||
            (item.path !== '/' &&
              location.pathname.startsWith(
                item.path
              ));

          const badgeCount =
            item.id === 'notifications'
              ? unreadCount
              : item.badge || 0;

          return (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={onMobileClose}
              className={`sidebar-item flex items-center gap-3 w-full min-h-[40px] px-3 py-2 rounded-xl transition-all ${isActive ? 'active' : ''
                } ${collapsed ? 'justify-center' : ''}`}
              title={
                collapsed
                  ? item.label
                  : undefined
              }
            >
              <div className="relative flex-shrink-0">
                <Icon
                  size={18}
                  className="icon"
                />

                {badgeCount > 0 &&
                  collapsed && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {badgeCount > 9
                        ? '9+'
                        : badgeCount}
                    </span>
                  )}
              </div>

              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{
                      opacity: 0,
                      x: -10,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: -10,
                    }}
                    className="flex-1 truncate"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {!collapsed &&
                badgeCount > 0 && (
                  <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500 text-white leading-none">
                    {badgeCount > 9
                      ? '9+'
                      : badgeCount}
                  </span>
                )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div
        className="px-3 py-3 flex-shrink-0 border-t"
        style={{
          borderColor: 'var(--sidebar-border)',
        }}
      >
        <button
          onClick={handleLogout}
          className={`sidebar-item flex items-center gap-3 w-full min-h-[40px] px-3 py-2 rounded-xl transition-all text-rose-500 hover:text-rose-600 ${collapsed ? 'justify-center' : ''
            }`}
          style={{
            '--sidebar-item-hover':
              'rgba(244,63,94,0.08)',
          }}
          title={
            collapsed
              ? 'Logout'
              : undefined
          }
        >
          <LogOut
            size={18}
            className="flex-shrink-0"
          />

          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{
                  opacity: 0,
                  x: -10,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -10,
                }}
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        className="sidebar hidden lg:flex flex-col flex-shrink-0 overflow-hidden h-full z-20"
        style={{
          background: 'var(--sidebar-bg)',
          borderColor: 'var(--sidebar-border)',
        }}
        animate={{
          width: collapsed ? 72 : 240,
        }}
        transition={{
          duration: 0.25,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className="fixed inset-0 z-40 lg:hidden"
              style={{
                background:
                  'var(--bg-overlay)',
              }}
              onClick={onMobileClose}
            />

            {/* Mobile sidebar */}
            <motion.aside
              initial={{
                x: -280,
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: -280,
              }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 300,
              }}
              className="sidebar fixed left-0 top-0 bottom-0 z-50 w-64 flex flex-col lg:hidden"
              style={{
                background:
                  'var(--sidebar-bg)',
              }}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}