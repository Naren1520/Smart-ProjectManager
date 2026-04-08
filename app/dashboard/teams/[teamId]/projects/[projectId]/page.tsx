'use client';
import { useState, useEffect, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Bot, Send, User, CheckCircle, FileText, Loader2, RefreshCw, Paperclip, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Loader } from '@/components/Loader';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export default function ProjectWorkspace({ params }: { params: Promise<{ teamId: string; projectId: string }> }) {
  const { teamId, projectId } = use(params);
  const { data: session } = useSession();
  const [project, setProject] = useState<any>(null);
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isLeader = team?.members?.find((m: any) => m.user?.email === session?.user?.email)?.role === 'Leader';
  
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: "Hello! I am ready to help you plan this project. Please describe your project idea, requirements, or upload any context you have. Once we finalize the scope, I will look at your team's skills and distribute the tasks automatically." }
  ]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<{ data: string; mimeType: string } | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [proposedTasks, setProposedTasks] = useState<any[] | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 4 * 1024 * 1024) {
        toast.error('File must be less than 4MB');
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = (event.target?.result as string).split(',')[1];
        setFileData({
          data: base64String,
          mimeType: selectedFile.type
        });
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pRes = await fetch(`/api/teams/${teamId}/projects/${projectId}`);
        if (!pRes.ok) throw new Error('Project not found');
        const pData = await pRes.json();
        setProject(pData);

        const tRes = await fetch(`/api/teams/${teamId}`);
        const tData = await tRes.json();
        setTeam(tData);
      } catch (error) {
        toast.error('Failed to load workspace.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [teamId, projectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !file) return;

    let userMessage = input.trim();
    if (file && !userMessage) userMessage = `Attached: ${file.name}`;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsSending(true);

    const payload = fileData ? { message: userMessage, history: messages, fileData } : { message: userMessage, history: messages };
    setFile(null);
    setFileData(null);

    try {
      const res = await fetch(`/api/teams/${teamId}/projects/${projectId}/ai-planning`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
        if (data.projectUpdated) {
          setProject(data.updatedProject);
          toast.success('Project tasks updated!');
        }
      } else {
        toast.error(data.error || 'Failed to get response');
      }
    } catch (err) {
      toast.error('Network error during chat');
    } finally {
      setIsSending(false);
    }
  };

  const handleFinalize = async () => {
    setMessages(prev => [...prev, { role: 'user', content: 'Finalize the requirements and distribute tasks based on the team members skills.' }]);
    setIsSending(true);
    
    try {
      const res = await fetch(`/api/teams/${teamId}/projects/${projectId}/ai-planning`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ finalize: true, history: messages })
      });

      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
        if (data.projectUpdated) {
           setProject(data.updatedProject);
        }
        if (data.proposedTasks) {
           setProposedTasks(data.proposedTasks);
           toast.success('Proposed tasks generated. Please approve them!');
        }
      } else {
        toast.error(data.error || 'Failed to finalize');
      }
    } catch {
      toast.error('Error finalising project');
    } finally {
      setIsSending(false);
    }
  };

  const handleApproveTasks = async () => {
    if (!proposedTasks) return;
    setIsSending(true);

    try {
      const res = await fetch(`/api/teams/${teamId}/projects/${projectId}/ai-planning`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approve: true, proposedTasks, history: messages })
      });

      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
        setProject(data.updatedProject);
        setProposedTasks(null); // Clear after approval
        toast.success('Tasks approved and teammates notified!');
      } else {
        toast.error(data.error || 'Failed to approve tasks');
      }
    } catch {
      toast.error('Error approving tasks');
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      const res = await fetch(`/api/teams/${teamId}/projects/${projectId}/tasks/${taskId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const data = await res.json();
        setProject(data.project);
        toast.success('Task deleted successfully');
      } else {
        toast.error('Failed to delete task');
      }
    } catch {
      toast.error('Error deleting task');
    }
  };

  if (loading) return <Loader />;
  if (!project) return <div className="p-8">Project not found</div>;

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-6 px-4 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex justify-between items-center bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">{project.title}</h1>
          <p className="text-neutral-500">{project.description}</p>
        </div>
        <div className="flex gap-2">
           <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                 project.status === 'Planning' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30'
           }`}>
             {project.status}
           </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0 min-w-0">
        
        {/* Chat Interface */}
        <div className="lg:col-span-2 flex flex-col bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
           <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/50 flex justify-between items-center flex-shrink-0">
             <h2 className="font-semibold flex items-center gap-2">
                <Bot className="w-5 h-5 text-indigo-500" />
                AI Planning Assistant
             </h2>
             <button
               onClick={handleFinalize}
               disabled={isSending || (project.tasks && project.tasks.length > 0)}
               className="px-4 py-1.5 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
             >
               <RefreshCw className="w-4 h-4" /> Finalize & Distribute
             </button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                 <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30' : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-700'}`}>
                        {msg.role === 'ai' ? <Bot className="w-5 h-5"/> : <User className="w-5 h-5"/>}
                    </div>
                    <div className={`max-w-[75%] px-4 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-tl-sm'}`}>
                       <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                    </div>
                 </div>
              ))}
              {isSending && (
                 <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                       <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 rounded-tl-sm">
                       <div className="flex gap-1">
                          <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></span>
                          <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                          <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                       </div>
                    </div>
                 </div>
              )}
              <div ref={messagesEndRef} />
           </div>

           <form onSubmit={handleSendMessage} className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex-shrink-0">
              {file && (
                 <div className="flex items-center gap-2 mb-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm w-fit">
                    <FileText className="w-4 h-4" />
                    <span className="truncate max-w-[200px]">{file.name}</span>
                    <button type="button" onClick={() => { setFile(null); setFileData(null); }} className="ml-2 hover:text-red-500 font-bold">&times;</button>
                 </div>
              )}
              <div className="relative flex items-center gap-2">
                 <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,.pdf,.doc,.docx,.txt" />
                 <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-700 transition">
                    <Paperclip className="w-5 h-5" />
                 </button>
                 <div className="relative flex-1">
                     <textarea
                       value={input}
                       onChange={e => setInput(e.target.value)}
                       onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } } }
                       placeholder="Type your requirements or instructions..."
                       className="w-full pl-4 pr-12 py-3 max-h-32 min-h-[48px] rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none hide-scrollbar"
                       rows={1}
                     />
                     <button
                       type="submit"
                       disabled={(!input.trim() && !file) || isSending}
                       className="absolute right-2 bottom-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                     >
                       <Send className="w-4 h-4" />
                     </button>
                 </div>
              </div>
           </form>
        </div>

        {/* Task Dashboard */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col overflow-hidden">
           <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> {proposedTasks ? 'Proposed Tasks (Review)' : 'Distributed Tasks'}
              </h2>
              {proposedTasks && (
                <button
                   onClick={handleApproveTasks}
                   disabled={isSending}
                   className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1 shadow-sm"
                >
                   <CheckCircle className="w-4 h-4" /> Approve & Assign
                </button>
              )}
           </div>
           
           <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {proposedTasks ? (
                 proposedTasks.map((task: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/50">
                       <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-sm">{task.title}</h3>
                          <span className="text-[10px] uppercase font-bold px-2 py-1 bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 rounded-md">{task.priority}</span>
                       </div>
                       <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3">{task.description}</p>
                       {task.estimatedTime && <p className="text-[11px] text-indigo-600 dark:text-indigo-400 mb-2 font-medium">Estimated Time: {task.estimatedTime}</p>}
                       <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                             <User className="w-3.5 h-3.5" />
                             {team?.members?.find((m:any) => m.user?._id === task.assignedTo)?.user?.name || 'Unassigned'}
                          </div>
                          {task.dueDate && <span className="text-orange-600 dark:text-orange-400 font-medium">Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                       </div>
                    </div>
                 ))
              ) : project?.tasks && project.tasks.length > 0 ? (
                 project.tasks.map((task: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
                       <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-sm">{task.title}</h3>
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] uppercase font-bold px-2 py-1 bg-neutral-200 dark:bg-neutral-700 rounded-md">{task.priority}</span>
                             {isLeader && (
                               <button 
                                 onClick={() => handleDeleteTask(task._id)}
                                 className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                                 title="Delete Task"
                               >
                                 <Trash2 className="w-4 h-4" />
                               </button>
                             )}
                          </div>
                       </div>
                       <p className="text-xs text-neutral-500 mb-3">{task.description}</p>
                       {task.estimatedTime && <p className="text-[11px] text-indigo-600 dark:text-indigo-400 mb-2 font-medium">Estimated Time: {task.estimatedTime}</p>}
                       <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                             <User className="w-3.5 h-3.5" />
                             {team?.members?.find((m:any) => m.user?._id === task.assignedTo)?.user?.name || 'Unassigned'}
                          </div>
                          <span className={`px-2 py-1 rounded-md ${task.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                             {task.status}
                          </span>
                       </div>
                    </div>
                 ))
              ) : (
                 <div className="text-center mt-10 text-neutral-400">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">No tasks assigned yet. Chat with AI to finalize scope and map tasks automatically.</p>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
