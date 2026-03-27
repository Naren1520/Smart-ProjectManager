'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useSession } from 'next-auth/react';
import { Send, Hash, ArrowLeft, Loader2, MoreVertical, Edit2, Trash2, Reply, X, Check } from 'lucide-react';
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
  isEdited?: boolean;
  replyTo?: {
    _id: string;
    content: string;
    sender: string; // just ID here from basic populate, but could be object if we populate deeper. Let's assume lightly populated or just content is shown.
  };
}

export default function TeamChatPage({ params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = use(params);
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [teamName, setTeamName] = useState('Team');
  
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [editContent, setEditContent] = useState('');
  
  const [activeMenu, setActiveMenu] = useState<string | null>(null); // message ID

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/teams/${teamId}/chat`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
        setTeamName(data.teamName || 'Team');
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
  }, [teamId]);

  useEffect(() => {
    if (!editingMessage) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, replyingTo]);

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    const tempContent = newMessage;
    const tempReplyTo = replyingTo?._id;
    
    setNewMessage('');
    setReplyingTo(null);
    setIsSending(true);

    try {
      const res = await fetch(`/api/teams/${teamId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: tempContent, replyTo: tempReplyTo })
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

  const handleDelete = async (msgId: string) => {
    setActiveMenu(null);
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    // Optistic update
    setMessages(prev => prev.filter(m => m._id !== msgId));
    
    try {
      const res = await fetch(`/api/teams/${teamId}/chat/${msgId}`, { method: 'DELETE' });
      if (!res.ok) {
          toast.error('Failed to delete message');
          fetchMessages(); // revert
      }
    } catch (error) {
      toast.error('Network error');
      fetchMessages();
    }
  };

  const startEdit = (msg: Message) => {
      setActiveMenu(null);
      setEditingMessage(msg);
      setEditContent(msg.content);
  };

  const submitEdit = async () => {
    if (!editingMessage || !editContent.trim()) return;

    const originalContent = editingMessage.content;
    
    // Optimistic
    setMessages(prev => prev.map(m => m._id === editingMessage._id ? { ...m, content: editContent, isEdited: true } : m));
    setEditingMessage(null);

    try {
      const res = await fetch(`/api/teams/${teamId}/chat/${editingMessage._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent })
      });

      if (!res.ok) throw new Error('Fail');
    } catch (error) {
      toast.error('Failed to edit message');
      // Revert optimistic update
      setMessages(prev => prev.map(m => m._id === editingMessage._id ? { ...m, content: originalContent, isEdited: false } : m));
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
      <div className="flex items-center gap-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 rounded-t-3xl shadow-sm z-10">
        <Link href={`/dashboard/teams/${teamId}`} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition">
          <ArrowLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
        </Link>
        <div className="flex items-center gap-2">
          <Hash className="w-6 h-6 text-indigo-500" />
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white">{teamName} Chat</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-neutral-50 dark:bg-neutral-950 border-x border-neutral-200 dark:border-neutral-800 p-4 space-y-5">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-neutral-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.sender.email === session?.user?.email;
            
            return (
              <div key={msg._id || idx} className={`flex flex-col group ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`mb-1 px-1 text-xs text-neutral-500`}>
                  {isMe ? 'You' : msg.sender.name}
                </div>
                
                <div className={`flex items-start gap-2 relative max-w-[75%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Message Bubble */}
                    <div className={`px-4 py-3 rounded-2xl flex flex-col ${
                      isMe 
                        ? 'bg-indigo-600 text-white rounded-tr-sm' 
                        : 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-tl-sm border border-neutral-200 dark:border-neutral-700'
                    }`}>
                      {/* Replied to context */}
                      {msg.replyTo && (
                          <div className={`mb-2 p-2 rounded-lg text-xs border-l-4 ${isMe ? 'bg-indigo-700/50 border-white text-indigo-100' : 'bg-neutral-100 dark:bg-neutral-700 border-indigo-500 text-neutral-500 dark:text-neutral-400'}`}>
                              <p className="line-clamp-2 italic">{typeof msg.replyTo === 'object' ? msg.replyTo.content : (messages.find(m => m._id === String(msg.replyTo))?.content || 'Message context')}</p>
                          </div>
                      )}
                      
                      {/* Main Message Content */}
                      {editingMessage?._id === msg._id ? (
                          <div className="flex items-center gap-2">
                              <input 
                                  autoFocus
                                  value={editContent}
                                  onChange={e => setEditContent(e.target.value)}
                                  onKeyDown={e => { if (e.key === 'Enter') submitEdit(); if (e.key === 'Escape') setEditingMessage(null); }}
                                  className="bg-transparent text-white border-b border-indigo-300 focus:outline-none w-full min-w-[200px]"
                              />
                              <button onClick={submitEdit} className="p-1 hover:bg-indigo-700 rounded-full"><Check className="w-4 h-4"/></button>
                              <button onClick={() => setEditingMessage(null)} className="p-1 hover:bg-indigo-700 rounded-full"><X className="w-4 h-4"/></button>
                          </div>
                      ) : (
                          <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                      )}

                      <div className={`mt-1 flex items-center gap-1.5 text-[10px] ${isMe ? 'text-indigo-200' : 'text-neutral-400'}`}>
                        <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {msg.isEdited && <span>(edited)</span>}
                      </div>
                    </div>

                    {/* Context Menu Trigger */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity relative">
                        <button onClick={() => setActiveMenu(activeMenu === msg._id ? null : msg._id)} className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-full transition-colors mt-1">
                            <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown Box */}
                        {activeMenu === msg._id && (
                             <div ref={menuRef} className={`absolute top-10 ${isMe ? 'right-0' : 'left-0'} z-50 w-36 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg py-1 flex flex-col`}>
                                 <button onClick={() => { setReplyingTo(msg); setActiveMenu(null); }} className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left w-full">
                                     <Reply className="w-4 h-4" /> Reply
                                 </button>
                                 {isMe && (
                                     <>
                                        <button onClick={() => startEdit(msg)} className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left w-full">
                                            <Edit2 className="w-4 h-4" /> Edit
                                        </button>
                                        <div className="h-px w-full bg-neutral-200 dark:bg-neutral-800 my-1" />
                                        <button onClick={() => handleDelete(msg._id)} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-left w-full">
                                            <Trash2 className="w-4 h-4" /> Delete
                                        </button>
                                     </>
                                 )}
                             </div>
                        )}
                    </div>

                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-b-3xl flex flex-col z-10 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] clip-path-[inset(-20px_0_0_0)] overflow-hidden">
        
        {/* Reply Context Banner */}
        {replyingTo && (
           <div className="px-4 py-3 bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-800 flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                 <Reply className="w-4 h-4 text-indigo-500 shrink-0" />
                 <div className="flex flex-col">
                    <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-400">Replying to {replyingTo.sender.name || 'User'}</span>
                    <span className="text-xs text-neutral-600 dark:text-neutral-400 truncate max-w-md">{replyingTo.content}</span>
                 </div>
              </div>
              <button type="button" onClick={() => setReplyingTo(null)} className="p-1.5 hover:bg-indigo-200 dark:hover:bg-indigo-800/50 rounded-full text-indigo-600 dark:text-indigo-400 transition-colors">
                  <X className="w-4 h-4" />
              </button>
           </div>
        )}

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
                placeholder="Message the team..."
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