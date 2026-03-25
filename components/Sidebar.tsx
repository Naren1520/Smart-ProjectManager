'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FolderKanban, MessageSquare, Video, FileText, Settings, Award, Sparkles, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils'; // I need to create lib/utils still

export const links = [
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

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-white/50 dark:bg-black/50 backdrop-blur-xl border-neutral-200 dark:border-neutral-800 h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          TeamForge AI
        </h1>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
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
      </nav>
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
        <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </Link>
      </div>
    </aside>
  );
}