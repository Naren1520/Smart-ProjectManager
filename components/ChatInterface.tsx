'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Send, Bot, Paperclip, Video, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
  _id: string;
  content: string;
  sender: { name: string; image?: string; _id: string };
  isAI: boolean;
  createdAt: string;
};

export function ChatInterface({ teamId }: { teamId: string }) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    // In production, use SWR or query params
    const res = await fetch(`/api/chat?teamId=${teamId}`);
    if (res.ok) {
        const data = await res.json();
        setMessages(data);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Poll every 3s
    return () => clearInterval(interval);
  }, [teamId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const tempId = Date.now().toString();
    const tempMsg = {
        _id: tempId,
        content: input,
        sender: { name: session?.user?.name || 'You', _id: 'me', image: session?.user?.image || '' },
        isAI: false,
        createdAt: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, tempMsg]);
    setInput('');
    setLoading(true);

    try {
        await fetch('/api/chat', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ teamId, content: tempMsg.content })
        });
        await fetchMessages(); // Refresh immediately
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-50/30 dark:bg-black/20 backdrop-blur-sm">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        <AnimatePresence>
            {messages.map((msg, i) => {
                const isMe = msg.sender?._id === session?.user?.id || msg.sender?._id === 'me';
                const isAI = msg.isAI || !msg.sender; // Fallback if sender is missing
                
                return (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={msg._id || i} 
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}
                    >
                        {!isMe && (
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs text-white shadow-sm ${isAI ? 'bg-gradient-to-br from-violet-600 to-indigo-600' : 'bg-blue-500'}`}>
                                {isAI ? <Bot className="w-4 h-4" /> : (msg.sender?.image ? <img src={msg.sender.image} className="w-full h-full rounded-full" /> : msg.sender?.name?.[0])}
                            </div>
                        )}
                        <div className={`max-w-[70%] p-3 rounded-2xl shadow-sm text-sm ${
                            isMe 
                            ? 'bg-blue-600 text-white rounded-br-none' 
                            : isAI 
                                ? 'bg-white dark:bg-neutral-800 border-l-4 border-violet-500 rounded-bl-none text-neutral-800 dark:text-neutral-200'
                                : 'bg-white dark:bg-neutral-800 rounded-bl-none text-neutral-800 dark:text-neutral-200'
                        }`}>
                            {!isMe && <div className="text-xs font-bold mb-1 opacity-70">{isAI ? 'TeamForge AI' : msg.sender?.name}</div>}
                            <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                            {isAI && msg.content.includes("Task Breakdown") && (
                                <div className="mt-3 p-2 bg-neutral-50 dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-500 flex items-center gap-2 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                                    <PlayCircle className="w-4 h-4 text-green-500" />
                                    <span>Click to view interactive Timeline</span>
                                </div>
                            )}
                            <div className="text-[10px] mt-1 opacity-60 text-right">
                                {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </AnimatePresence>
        <div ref={scrollRef} />
      </div>

      <div className="p-4 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800">
        <form onSubmit={sendMessage} className="flex gap-2 items-center relative">
          <button type="button" className="p-2 text-neutral-400 hover:text-blue-500 transition-colors rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <Paperclip className="w-5 h-5" />
          </button>
          <button type="button" className="p-2 text-neutral-400 hover:text-blue-500 transition-colors rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <Video className="w-5 h-5" />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Describe your project, assign tasks, or ask for help..."
            className="flex-1 bg-neutral-100 dark:bg-neutral-800 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 border border-transparent focus:border-blue-500 transition-all text-sm"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || loading}
            className="p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full shadow-lg shadow-blue-500/30 transition-all transform active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}