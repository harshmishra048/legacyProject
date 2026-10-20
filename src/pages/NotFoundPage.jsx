import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Button, Logo } from '../components/ui';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-base text-primary text-center">
      <motion.div 
        className="max-w-md space-y-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="mb-2">
          <Logo size="lg" asLink to="/" />
        </div>

        <div className="space-y-2">
          <span className="text-6xl font-black gradient-text">404</span>
          <h1 className="text-2xl font-bold text-primary">Page Not Found</h1>
          <p className="text-sm text-muted">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex justify-center gap-3 pt-2">
          <Link to="/">
            <Button variant="primary" size="md" className="gap-2 font-bold">
              <Home size={16} /> Return Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
