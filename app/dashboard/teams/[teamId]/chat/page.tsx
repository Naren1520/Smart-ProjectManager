'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useSession } from 'next-auth/react';
import { Send, Hash, ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function TeamChatPage({ params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = use(params);
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [teamName, setTeamName] = useState('Team');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/teams/${teamId}/chat`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
        setTeamName(data.teamName || 'Team');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Simple polling every 5s
    return () => clearInterval(interval);
  }, [teamId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    const tempContent = newMessage;
    setNewMessage('');
    setIsSending(true);

    try {
      const res = await fetch(`/api/teams/${teamId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: tempContent })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages([...messages, data.message]);
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
      <div className="flex items-center gap-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 rounded-t-3xl shadow-sm">
        <Link href={`/dashboard/teams/${teamId}`} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition">
          <ArrowLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
        </Link>
        <div className="flex items-center gap-2">
          <Hash className="w-6 h-6 text-indigo-500" />
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white">{teamName} Chat</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-neutral-50 dark:bg-neutral-950 border-x border-neutral-200 dark:border-neutral-800 p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-neutral-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.sender.email === session?.user?.email;
            
            return (
              <div key={msg._id || idx} className={`flex flex-col max-w-[70%] ${isMe ? 'ml-auto' : 'mr-auto'}`}>
                <div className={`mb-1 text-xs ${isMe ? 'text-right' : 'text-left'} text-neutral-500`}>
                  {isMe ? 'You' : msg.sender.name}
                </div>
                <div className={`px-4 py-2.5 rounded-2xl ${
                  isMe 
                    ? 'bg-indigo-600 text-white rounded-tr-sm' 
                    : 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-tl-sm border border-neutral-200 dark:border-neutral-700'
                }`}>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                </div>
                <div className={`mt-1 text-[10px] text-neutral-400 ${isMe ? 'text-right' : 'text-left'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 rounded-b-3xl">
        <div className="relative flex items-center">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
               if (e.key === 'Enter' && !e.shiftKey) {
                 e.preventDefault();
                 handleSendMessage(e);
               }
            }}
            placeholder="Message the team..."
            className="w-full pl-4 pr-14 py-3 max-h-32 min-h-[50px] bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-indigo-500 resize-none outline-none hide-scrollbar"
            rows={1}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </form>
    </div>
  );
}