'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MessageCircle, Plus, Search, User, ArrowRight } from 'lucide-react';
import { Loader } from '@/components/Loader';
import toast from 'react-hot-toast';

interface Conversation {
  partner: {
    name: string;
    uniqueId: string;
    email: string;
    image?: string;
  };
  lastMessage: string;
  lastMessageAt: string;
}

export default function MessagingPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [newChatId, setNewChatId] = useState('');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch('/api/messaging', {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache' }
        });
        if (res.ok) {
          const data = await res.json();
          setConversations(data.conversations);
        }
      } catch (error) {
        toast.error('Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatId.trim()) return;
    router.push(`/dashboard/messaging/${newChatId.trim()}`);
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 h-[calc(100vh-100px)] flex flex-col gap-6">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center bg-white dark:bg-neutral-900 p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm shrink-0">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-neutral-900 dark:text-white flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-indigo-500" />
            Direct Messaging
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400">Connect privately with anyone using their Unique ID</p>
        </div>
        <form onSubmit={handleStartChat} className="flex w-full md:w-auto gap-2">
           <input 
             type="text"
             placeholder="Enter User's Unique ID..."
             value={newChatId}
             onChange={e => setNewChatId(e.target.value)}
             className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all flex-1 min-w-[200px]"
           />
           <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center gap-2 transition-colors whitespace-nowrap">
             <Plus className="w-4 h-4" /> Message
           </button>
        </form>
      </div>

      <div className="flex-1 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
           <h2 className="text-lg font-semibold flex items-center gap-2">Recents</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {conversations.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-neutral-500 opacity-60">
                   <MessageCircle className="w-12 h-12 mb-3" />
                   <p>No recent conversations</p>
                   <p className="text-sm mt-1">Start a new chat using someone's ID</p>
                </div>
            ) : (
                conversations.map((conv) => (
                    <Link href={`/dashboard/messaging/${conv.partner.uniqueId}`} key={conv.partner.uniqueId} className="flex p-4 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 group items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-600 flex items-center justify-center shrink-0">
                            {conv.partner.image ? (
                                <img src={conv.partner.image} alt={conv.partner.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <User className="w-6 h-6" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-1">
                               <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">{conv.partner.name} <span className="font-normal text-xs text-neutral-400">#{conv.partner.uniqueId}</span></h3>
                               <span className="text-xs text-neutral-400 shrink-0">{new Date(conv.lastMessageAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}</span>
                            </div>
                            <p className="text-sm text-neutral-500 truncate">{conv.lastMessage}</p>
                        </div>
                        <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowRight className="w-5 h-5 text-indigo-500" />
                        </div>
                    </Link>
                ))
            )}
        </div>
      </div>
    </div>
  );
}