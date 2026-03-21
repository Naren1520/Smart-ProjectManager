'use client';

import { FileText, Search, Clock, ChevronRight, FileCode, CheckCircle2 } from 'lucide-react';

export default function DocsPage() {
  const docs = [
    { id: 1, title: "Getting Started Guide", type: "Guide", updated: "2 days ago", author: "Sarah" },
    { id: 2, title: "API Documentation v2", type: "API", updated: "5 hours ago", author: "Mike" },
    { id: 3, title: "Meeting Notes: Q4 Planning", type: "Meeting", updated: "1 day ago", author: "AI Assistant" },
    { id: 4, title: "Design System Guidelines", type: "Design", updated: "1 week ago", author: "Emily" },
    { id: 5, title: "Deployment Procedures", type: "DevOps", updated: "3 days ago", author: "Alex" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-3xl font-bold mb-2">Documentation</h1>
           <p className="text-neutral-500">Centralized knowledge base for your team.</p>
        </div>
        <div className="flex gap-3">
             <button className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-2 rounded-lg font-medium text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                Filter
            </button>
             <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-lg shadow-blue-500/20">
                + New Doc
            </button>
        </div>
      </div>

       <div className="relative mb-8 max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Search documentation..." 
          className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Docs List */}
        <div className="lg:col-span-2 space-y-4">
            <h2 className="font-semibold text-lg mb-4">Recent Documents</h2>
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
                {docs.map((doc, i) => (
                    <div key={doc.id} className={`p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer group ${i !== docs.length - 1 ? 'border-b border-neutral-100 dark:border-neutral-800' : ''}`}>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-medium group-hover:text-blue-500 transition-colors">{doc.title}</h3>
                                <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                                    <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800">{doc.type}</span>
                                    <span>•</span>
                                    <span>Updated {doc.updated} by {doc.author}</span>
                                </div>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-neutral-500" />
                    </div>
                ))}
            </div>
        </div>

        {/* Quick Stats / Sidebar */}
        <div className="space-y-6">
             <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-2">AI Summary</h3>
                <p className="text-white/80 text-sm mb-4">
                    Your team has created 12 new documents this week. The most active category is "System Design".
                </p>
                <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-2 rounded-lg text-sm font-medium transition-colors">
                    View Insights
                </button>
             </div>

             <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4">Categories</h3>
                <div className="space-y-3">
                    {['Technical Guides', 'Meeting Notes', 'Project Specs', 'HR & Policies'].map((cat) => (
                        <div key={cat} className="flex items-center justify-between text-sm group cursor-pointer">
                            <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200">
                                <FileCode className="w-4 h-4" />
                                {cat}
                            </div>
                            <span className="text-xs bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-full text-neutral-500">12</span>
                        </div>
                    ))}
                </div>
             </div>
        </div>
      </div>
    </div>
  );
}