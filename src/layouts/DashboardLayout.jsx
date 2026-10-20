import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 6,
  },

  enter: {
    opacity: 1,
    y: 0,
  },

  exit: {
    opacity: 0,
    y: -6,
  },
};

export function DashboardLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div
      className="flex h-screen w-full overflow-hidden"
      style={{
        background: 'var(--bg-base)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Column */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        <TopNavbar
          onMenuClick={() => setMobileMenuOpen(true)}
        />

        <main
          className="flex-1 overflow-y-auto overflow-x-hidden min-w-0"
          style={{
            background: 'var(--bg-base)',
            color: 'var(--text-primary)',
          }}
        >
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="enter"
            exit="exit"
            variants={pageVariants}
            transition={{
              duration: 0.2,
              ease: 'easeOut',
            }}
            className="w-full min-h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}