'use client';

import { FileText, Search, ChevronRight, FileCode, Plus, X, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Doc {
  _id: string;
  title: string;
  type: string;
  category: string;
  updatedAt: string;
  author: {
    _id: string;
    name: string;
  };
}

interface DocsClientProps {
  initialDocs: Doc[];
  teams: { _id: string; name: string }[];
}

export default function DocsClient({ initialDocs, teams }: DocsClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewDocModal, setShowNewDocModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Create Doc Form State
  const [newDocData, setNewDocData] = useState({
    title: '',
    type: 'Guide',
    category: 'General',
    content: '',
    teamId: teams.length > 0 ? teams[0]._id : '',
  });

  const filteredDocs = initialDocs.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/docs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDocData),
      });

      if (response.ok) {
        setShowNewDocModal(false);
        setNewDocData({
          title: '',
          type: 'Guide',
          category: 'General',
          content: '',
          teamId: teams.length > 0 ? teams[0]._id : '',
        });
        router.refresh();
      } else {
        console.error('Failed to create document');
      }
    } catch (error) {
      console.error('Error creating document:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-3xl font-bold mb-2">Documentation</h1>
           <p className="text-neutral-500">Centralized knowledge base for your team.</p>
        </div>
        <div className="flex gap-3">
             {/* <button className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-2 rounded-lg font-medium text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                Filter
            </button> */}
             <button 
                onClick={() => setShowNewDocModal(true)}
                className="bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-lg shadow-black/20 dark:shadow-white/20 flex items-center gap-2"
             >
                <Plus className="w-4 h-4" />
                New Doc
            </button>
        </div>
      </div>

       <div className="relative mb-8 max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Search documentation..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Docs List */}
        <div className="lg:col-span-2 space-y-4">
            <h2 className="font-semibold text-lg mb-4">Recent Documents</h2>
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden min-h-[200px]">
                {filteredDocs.length > 0 ? (
                    filteredDocs.map((doc, i) => (
                        <div key={doc._id} className={`p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer group ${i !== filteredDocs.length - 1 ? 'border-b border-neutral-100 dark:border-neutral-800' : ''}`}>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-black dark:text-white">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-medium group-hover:text-black dark:group-hover:text-white transition-colors">{doc.title}</h3>
                                    <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                                        <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800">{doc.type}</span>
                                        <span>•</span>
                                        <span>Updated {doc.updatedAt} by {doc.author?.name || 'Unknown'}</span>
                                    </div>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-neutral-500" />
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-neutral-500 h-full">
                        <FileCode className="w-12 h-12 mb-4 opacity-20" />
                        <p>No documents found.</p>
                        <button onClick={() => setShowNewDocModal(true)} className="text-black dark:text-white mt-2 hover:underline text-sm">Create your first document</button>
                    </div>
                )}
            </div>
        </div>

        {/* Quick Stats / Sidebar */}
        <div className="space-y-6">
             <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-2">AI Summary</h3>
                <p className="text-white/80 text-sm mb-4">
                    Your team has created {filteredDocs.length} documents. Keep your knowledge base growing!
                </p>
                {/* <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-2 rounded-lg text-sm font-medium transition-colors">
                    View Insights
                </button> */}
             </div>

             <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4">Categories</h3>
                <div className="space-y-3">
                    {['General', 'Guide', 'API', 'Meeting', 'Design', 'DevOps'].map((cat) => {
                        const count = initialDocs.filter(d => d.type === cat || d.category === cat).length;
                        if (count === 0 && cat !== 'General') return null;
                        return (
                            <div key={cat} className="flex items-center justify-between text-sm group cursor-pointer">
                                <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200">
                                    <FileCode className="w-4 h-4" />
                                    {cat}
                                </div>
                                <span className="text-xs bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-full text-neutral-500">{count}</span>
                            </div>
                        );
                    })}
                </div>
             </div>
        </div>
      </div>

      {/* New Doc Modal */}
      {showNewDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-lg shadow-2xl border border-neutral-200 dark:border-neutral-800">
            <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
              <h2 className="text-xl font-bold">Create New Document</h2>
              <button onClick={() => setShowNewDocModal(false)} className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white" title="Close" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateDoc} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input 
                  type="text" 
                  required
                  value={newDocData.title}
                  onChange={(e) => setNewDocData({...newDocData, title: e.target.value})}
                  className="w-full p-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Q4 Roadmap"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select 
                    value={newDocData.type}
                    title="Document Type"
                    aria-label="Document Type"
                    onChange={(e) => setNewDocData({...newDocData, type: e.target.value})}
                    className="w-full p-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Guide">Guide</option>
                    <option value="API">API</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Design">Design</option>
                    <option value="DevOps">DevOps</option>
                    <option value="General">General</option>
                  </select>
                </div>
                 <div>
                  <label className="block text-sm font-medium mb-1">Team</label>
                  <select 
                    value={newDocData.teamId}
                    title="Select Team"
                     aria-label="Select Team"
                    onChange={(e) => setNewDocData({...newDocData, teamId: e.target.value})}
                    className="w-full p-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {teams.map(team => (
                        <option key={team._id} value={team._id}>{team.name}</option>
                    ))
                    }
                    {teams.length === 0 && <option value="">No Teams Found</option>}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Content (Markdown)</label>
                <textarea 
                  required
                  rows={4}
                  value={newDocData.content}
                  onChange={(e) => setNewDocData({...newDocData, content: e.target.value})}
                  className="w-full p-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="# Hello World"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowNewDocModal(false)}
                  className="px-4 py-2 text-neutral-600 hover:text-neutral-900 font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting || teams.length === 0}
                  className="px-6 py-2 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Doc'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
