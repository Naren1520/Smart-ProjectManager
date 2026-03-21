import { ChatInterface } from '@/components/ChatInterface';

export default function ChatPage() {
  // Hardcoded team ID for demo purposes. In a real app, select from list.
  const teamId = "demo-team-id"; 

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center bg-neutral-50/50 dark:bg-neutral-900/50 backdrop-blur-sm">
        <div>
           <h2 className="font-semibold text-lg">Team Alpha Workspace</h2>
           <p className="text-xs text-neutral-500">3 Members • Project Phoenix</p>
        </div>
        <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full dark:bg-green-900/30 dark:text-green-400 font-medium animate-pulse">
                AI Active
            </span>
        </div>
      </div>
      <div className="flex-1 overflow-hidden relative">
        <ChatInterface teamId={teamId} />
      </div>
    </div>
  );
}