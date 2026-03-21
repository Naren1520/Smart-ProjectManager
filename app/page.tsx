import Link from 'next/link';
import { ArrowRight, Zap, Shield, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white overflow-hidden relative selection:bg-blue-500/30 font-sans">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-24 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm text-neutral-300 mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Try the AI Project Manager Beta
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-br from-white via-white to-neutral-400 bg-clip-text text-transparent max-w-4xl leading-tight">
          Manage Projects at <br/> <span className="text-blue-500">Light Speed</span> with AI.
        </h1>
        
        <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mb-12 leading-relaxed">
          TeamForge AI automatically breaks down projects, assigns tasks based on skills, and manages your team's workflow intelligently.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-20 justify-center">
            <Link href="/dashboard/teams" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 group">
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/demo" className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full font-semibold transition-all backdrop-blur-md flex items-center justify-center">
                Watch Demo
            </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl text-left">
            {[
                { title: "AI Task Assignment", desc: "Automatically parses requirements and assigns tasks to the best team member.", icon: Zap },
                { title: "Skill Analytics", desc: "Visualizes team strengths with beautiful radar charts and GitHub insights.", icon: Users },
                { title: "Automated Docs", desc: "Converts chats and meetings into structured documentation instantly.", icon: Shield },
            ].map((feature, i) => (
                <div key={i} className="p-8 rounded-3xl bg-neutral-900/50 border border-neutral-800 backdrop-blur-sm hover:bg-neutral-800/50 transition-colors group">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                        <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-neutral-200">{feature.title}</h3>
                    <p className="text-neutral-400 leading-relaxed">
                        {feature.desc}
                    </p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
