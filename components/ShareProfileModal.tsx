'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Share2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ShareProfileModal({ uniqueId, userName }: { uniqueId: string, userName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const profileUrl = typeof window !== 'undefined' ? `${window.location.origin}/profile/${uniqueId}` : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success('Profile Link Copied!');
  };

  if (!isOpen) {
    return (
        <button 
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors"
        >
            <Share2 className="w-4 h-4" />
            Share Profile
        </button>  
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 w-full max-w-sm relative">
        <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
        >
            <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
            <h3 className="text-xl font-bold mb-1">Share Your Profile</h3>
            <p className="text-sm text-neutral-500">Let others view your stats & skills</p>
        </div>

        <div className="flex justify-center mb-6 p-4 bg-white rounded-xl border border-neutral-100 shadow-inner">
            <QRCodeSVG 
                value={profileUrl} 
                size={200}
                level="M"
                includeMargin={true}
            />
        </div>

        <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                <div className="flex-1 truncate font-mono text-sm text-neutral-600 dark:text-neutral-300">
                    ID: <span className="font-bold text-neutral-900 dark:text-white select-all">{uniqueId}</span>
                </div>
            </div>

            <button 
                onClick={copyToClipboard}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
                <Copy className="w-4 h-4" />
                Copy Profile Link
            </button>
        </div>
      </div>
    </div>
  );
}