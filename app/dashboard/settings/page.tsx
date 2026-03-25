'use client';

import { useSession, signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { User, Bell, Shield, LogOut, Sun, Moon, Laptop, Mail, MessageSquare, Github } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    githubUsername: ''
  });

  // Mock notification settings
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false
  });

  useEffect(() => {
    setMounted(true);
    fetchUserData();
  }, [session]);

  const fetchUserData = async () => {
    if (!session?.user?.email) return;
    try {
      const res = await fetch('/api/user/me');
      if (res.ok) {
        const data = await res.json();
        setFormData({
            name: data.name || '',
            email: data.email || '',
            bio: data.bio || '',
            githubUsername: data.githubProfile?.username || ''
        });
      }
    } catch (error) {
      console.error("Failed to fetch user settings", error);
    } finally {
        setFetching(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
        const res = await fetch('/api/user/me', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: formData.name,
                bio: formData.bio,
                githubUsername: formData.githubUsername
            })
        });

        if (res.ok) {
            toast.success("Settings updated successfully");
            // Optionally reload to reflect changes globally if needed, 
            // but for now local state is enough.
        } else {
            toast.error("Failed to update settings");
        }
    } catch (error) {
        toast.error("Something went wrong");
    } finally {
        setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-neutral-500">Manage your account preferences and application settings.</p>
      </div>

      {/* Profile Section */}
      <section className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-500" />
          Profile Information
        </h2>
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex flex-col items-center gap-4">
            {session?.user?.image ? (
              <Image 
                src={session.user.image} 
                alt="Profile" 
                width={100} 
                height={100} 
                className="rounded-full ring-4 ring-neutral-100 dark:ring-neutral-800"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 text-3xl font-bold ring-4 ring-neutral-100 dark:ring-neutral-800">
                {session?.user?.name?.[0] || 'U'}
              </div>
            )}
            <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Change Avatar
            </button>
          </div>

          <div className="flex-1 space-y-4 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-500">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/50 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-500">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  disabled
                  className="w-full bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg px-4 py-2 text-neutral-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-500 flex items-center gap-2">
                    <Github className="w-4 h-4" />
                    GitHub Username
                </label>
                <input 
                  type="text" 
                  value={formData.githubUsername}
                  onChange={(e) => setFormData({...formData, githubUsername: e.target.value})}
                  placeholder="e.g. torvalds"
                  className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/50 outline-none"
                />
                <p className="text-xs text-neutral-500">Updating this will refresh your skill analysis based on your public repos.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-500">Bio</label>
              <textarea 
                className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/50 outline-none h-24 resize-none"
                placeholder="Tell us a bit about yourself..."
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
              />
            </div>
            <div className="flex justify-end">
              <button 
                onClick={handleSave}
                disabled={loading || fetching}
                className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Appearance Section */}
      <section className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Laptop className="w-5 h-5 text-purple-500" />
          Appearance
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { value: 'light', label: 'Light', icon: Sun },
            { value: 'dark', label: 'Dark', icon: Moon },
            { value: 'system', label: 'System', icon: Laptop },
          ].map((mode) => (
            <button
              key={mode.value}
              onClick={() => setTheme(mode.value)}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                theme === mode.value 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600' 
                  : 'border-transparent bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
            >
              <div className={`p-2 rounded-full ${theme === mode.value ? 'bg-blue-100 dark:bg-blue-800 text-blue-600' : 'bg-white dark:bg-neutral-700 text-neutral-500'}`}>
                <mode.icon className="w-5 h-5" />
              </div>
              <span className="font-medium">{mode.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Notifications Section */}
      <section className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Bell className="w-5 h-5 text-yellow-500" />
          Notifications
        </h2>
        
        <div className="space-y-4">
          {[
            { key: 'email', label: 'Email Notifications', desc: 'Receive updates about your projects via email', icon: Mail },
            { key: 'push', label: 'Push Notifications', desc: 'Get real-time alerts on your desktop', icon: Bell },
            { key: 'marketing', label: 'Marketing Emails', desc: 'Receive news about new features and updates', icon: MessageSquare },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-neutral-500">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-medium">{item.label}</h3>
                    <p className="text-sm text-neutral-500">{item.desc}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={(notifications as any)[item.key]}
                  onChange={() => setNotifications(prev => ({ ...prev, [item.key]: !(prev as any)[item.key] }))}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </section>

      {/* Danger Zone */}
      <section className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-red-600 dark:text-red-400">
          <Shield className="w-5 h-5" />
          Account Actions
        </h2>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
                <h3 className="font-medium text-neutral-900 dark:text-neutral-100">Sign out of all devices</h3>
                <p className="text-sm text-neutral-500">Securely log out of your current session.</p>
            </div>
            <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-4 py-2 bg-white dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors flex items-center gap-2"
            >
                <LogOut className="w-4 h-4" />
                Sign Out
            </button>
        </div>
      </section>
    </div>
  );
}