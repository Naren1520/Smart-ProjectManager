'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
// import { links } from './Sidebar'; // Importing shared links configuration

// Re-defining directly to include icon component type
import { LayoutDashboard, Users, FolderKanban, MessageSquare, Video, FileText, Award, Sparkles, UserCircle } from 'lucide-react';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/profile', label: 'Public Profile', icon: UserCircle },
  { href: '/dashboard/ai-tools', label: 'AI Tools', icon: Sparkles },
  { href: '/dashboard/teams', label: 'Teams', icon: Users },
  { href: '/dashboard/projects', label: 'Projects', icon: FolderKanban },
  { href: '/dashboard/chat', label: 'AI Chat', icon: MessageSquare },
  { href: '/dashboard/meet', label: 'Meeting', icon: Video },
  { href: '/dashboard/docs', label: 'Docs', icon: FileText },
  { href: '/dashboard/rewards', label: 'Rewards', icon: Award },
];

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="md:hidden">
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
        aria-label="Open Menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
              />
              {/* Sidebar Panel */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className="fixed top-0 left-0 bottom-0 w-3/4 max-w-sm bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 z-[10000] p-6 shadow-2xl overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    TeamForge AI
                  </h2>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <nav className="space-y-2">
                  {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                          isActive 
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
                            : "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                        )}
                      >
                        <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-neutral-200")} />
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    );
                  })}
                  
                  <div className="h-px bg-neutral-200 dark:bg-neutral-800 my-2 mx-4" />
                  
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                      pathname === '/dashboard/settings'
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
                        : "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                    )}
                  >
                    <Settings className={cn("w-5 h-5", pathname === '/dashboard/settings' ? "text-white" : "text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-neutral-200")} />
                    <span className="font-medium">Settings</span>
                  </Link>
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}