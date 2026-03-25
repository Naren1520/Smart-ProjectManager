'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Github, Upload, Code2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export function OnboardingForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    githubLink: '',
    role: 'Member',
    bio: '',
    skills: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      if (step === 1 && !formData.githubLink) {
        toast.error("Please enter your GitHub profile link");
        return;
      }
      setStep(step + 1);
      return;
    }

    setLoading(true);
    // Simulate AI parsing and updating backend
    try {
      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' },
      });

      
      if (response.ok) {
        toast.success("Profile Analyzed & Created!");
        router.push('/dashboard');
      } else {
        toast.error("Failed to update profile");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/70 dark:bg-black/40 backdrop-blur-2xl border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-2xl"
    >
      <div className="flex justify-between items-center mb-8 px-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`flex items-center gap-2 ${step >= i ? 'text-blue-600' : 'text-neutral-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= i ? 'bg-blue-100 text-blue-700' : 'bg-neutral-100 text-neutral-500'}`}>
              {i}
            </div>
            <span className="text-sm font-medium hidden sm:block">
              {i === 1 ? 'GitHub' : i === 2 ? 'Skills' : 'Review'}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">GitHub Profile Link</label>
                <div className="relative">
                  <Github className="absolute left-4 top-3.5 w-5 h-5 text-neutral-400" />
                  <input
                    type="url"
                    required
                    placeholder="https://github.com/username"
                    value={formData.githubLink}
                    onChange={e => setFormData({ ...formData, githubLink: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <p className="text-xs text-neutral-500 mt-2">
                  We&apos;ll analyze your repositories to suggest skills automatically.
                </p>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Technical Skills</label>
                <div className="flex flex-wrap gap-2 mb-3">
                    {formData.skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold flex items-center gap-2">
                             {skill} <button type="button" onClick={() => setFormData({...formData, skills: formData.skills.filter(s => s !== skill)})}>×</button>
                        </span>
                    ))}
                </div>
                <div className="relative">
                  <Code2 className="absolute left-4 top-3.5 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Type skill and press Enter (e.g. React, Python)"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            const val = e.currentTarget.value.trim();
                            if (val && !formData.skills.includes(val)) {
                                setFormData({...formData, skills: [...formData.skills, val]});
                                e.currentTarget.value = '';
                            }
                        }
                    }}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
            </motion.div>
          )}

           {step === 3 && (
            <motion.div
              key="step3"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-4 text-center"
            >
              <div className="py-8 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer group">
                <Upload className="w-12 h-12 mx-auto text-neutral-400 group-hover:text-blue-500 transition-colors mb-4" />
                <p className="font-medium text-neutral-600 dark:text-neutral-300">
                  Upload Resume (PDF)
                </p>
                <p className="text-sm text-neutral-500 mt-2">
                    AI will extract your experience and achievements
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-4 flex justify-between">
            {step > 1 && (
                <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium transition-colors"
                >
                    Back
                </button>
            )}
            <button
                type="submit"
                disabled={loading}
                className="ml-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all font-medium flex items-center gap-2"
            >
                {loading ? 'Processing...' : step === 3 ? 'Finish Setup' : 'Continue'}
                {!loading && step !== 3 && <ArrowRight className="w-4 h-4" />}
            </button>
        </div>
      </form>
    </motion.div>
  );
}