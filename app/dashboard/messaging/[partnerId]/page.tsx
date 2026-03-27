'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useSession } from 'next-auth/react';
import { Send, ArrowLeft, Loader2, User } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DirectMessage {
  _id: string;
  content: string;
  sender: {
    _id: string;
    name: string;
    email: string;
    uniqueId: string;
  };
  createdAt: string;
}

export default function DirectChatPage({ params }: { params: Promise<{ partnerId: string }> }) {
  const { partnerId } = use(params);
  const { data: session } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [partnerInfo, setPartnerInfo] = useState<{name: string, uniqueId: string, image?: string} | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/messaging/${partnerId}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
        setPartnerInfo(data.partner);
      } else if (res.status === 404) {
          toast.error('User not found');
          router.push('/dashboard/messaging');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      if (loading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); 
    return () => clearInterval(interval);
  }, [partnerId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    const tempContent = await newMessage;
    setNewMessage('');
    setIsSending(true);

    try {
      const res = await fetch(`/api/messaging/${partnerId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: tempContent })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, data.message]);
      } else {
        toast.error('Failed to send message');
        setNewMessage(tempContent);
      }
    } catch (error) {
      toast.error('An error occurred');
      setNewMessage(tempContent);
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex items-center justify-between bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 rounded-t-3xl shadow-sm z-10">
        <div className="flex items-center gap-4">
            <Link href="/dashboard/messaging" className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition">
              <ArrowLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            </Link>
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-600 flex items-center justify-center shrink-0">
                    {partnerInfo?.image ? (
                        <img src={partnerInfo.image} alt={partnerInfo.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                        <User className="w-5 h-5" />
                    )}
                </div>
              <div>
                 <h1 className="text-lg font-bold text-neutral-900 dark:text-white leading-tight">{partnerInfo?.name || 'Loading...'}</h1>
                 <p className="text-xs text-neutral-500">#{partnerInfo?.uniqueId}</p>
              </div>
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-neutral-50 dark:bg-neutral-950 border-x border-neutral-200 dark:border-neutral-800 p-4 space-y-5">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-neutral-500">
            No messages yet. Say hi!
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.sender.email === session?.user?.email;
            
            return (
              <div key={msg._id || idx} className={`flex flex-col group ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`flex items-start gap-2 relative max-w-[75%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`px-4 py-3 rounded-2xl flex flex-col ${
                      isMe 
                        ? 'bg-indigo-600 text-white rounded-tr-sm' 
                        : 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-tl-sm border border-neutral-200 dark:border-neutral-700'
                    }`}>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                      <div className={`mt-1 flex items-center gap-1.5 text-[10px] ${isMe ? 'text-indigo-200' : 'text-neutral-400'}`}>
                        <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-b-3xl flex flex-col z-10 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] clip-path-[inset(-20px_0_0_0)] overflow-hidden">
        <form onSubmit={handleSendMessage} className="p-4 flex gap-2 items-end">
             <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                   if (e.key === 'Enter' && !e.shiftKey) {
                     e.preventDefault();
                     handleSendMessage(e);
                   }
                }}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 max-h-32 min-h-[50px] bg-neutral-100 dark:bg-neutral-800 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 transition-colors text-neutral-900 dark:text-white rounded-2xl focus:ring-2 focus:ring-indigo-500 resize-none outline-none hide-scrollbar text-sm"
                rows={1}
             />
             <button
                type="submit"
                disabled={!newMessage.trim() || isSending}
                className="p-3.5 mb-0.5 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-700 disabled:text-neutral-500 dark:disabled:text-neutral-500 transition-all shrink-0"
             >
                {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
             </button>
          </form>
      </div>
    </div>
  );
}