'use client';

import { Award, CheckCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRef } from 'react';
import CertificateActions from '@/components/CertificateActions';

export default function RewardsPage() {
  const points = 350;
  const { data: session } = useSession();
  const certificateRef = useRef<HTMLDivElement>(null);

  const userName = session?.user?.name || 'Certificate Holder';
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8 text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-white/10 backdrop-blur-3xl z-0" />
        <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-4">Your Achievements</h1>
            <div className="text-6xl font-extrabold mb-2">{points} XP</div>
            <p className="text-blue-100">Level 5 Pro Manager</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
                    <Award className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">Top Contributor</h3>
                    <p className="text-sm text-neutral-500">Completed 5 tasks this week</p>
                </div>
            </div>
            <CheckCircle className="w-6 h-6 text-green-500" />
        </div>
         <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-between opacity-50">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-neutral-100 text-neutral-400 rounded-xl">
                    <Award className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">Team Leader</h3>
                    <p className="text-sm text-neutral-500">Lead a team of 3 members</p>
                </div>
            </div>
            <span className="text-xs px-2 py-1 bg-neutral-200 dark:bg-neutral-800 rounded">Locked</span>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm text-center mb-8">
        <h2 className="text-2xl font-bold mb-6">Your Certificate</h2>
        
        {/* Certificate Container */}
        <div className="mb-8 flex justify-center">
          <div
            ref={certificateRef}
            data-certificate
            className="relative"
            style={{
              width: '100%',
              maxWidth: '1000px',
              aspectRatio: '4 / 3',
              minHeight: '750px',
            }}
          >
            {/* Outer Border */}
            <div className="absolute inset-0 border-4 border-amber-600 rounded-lg shadow-2xl bg-white overflow-hidden">
              {/* Decorative Top Border */}
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-amber-100 to-transparent opacity-50" />

              {/* Decorative Corners */}
              <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-amber-600 rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-amber-600 rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-amber-600 rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-amber-600 rounded-br-lg" />

              {/* Decorative Side Elements */}
              <div className="absolute left-8 top-1/2 transform -translate-y-1/2 text-amber-200 opacity-40">
                <div className="text-6xl">✦</div>
              </div>
              <div className="absolute right-8 top-1/2 transform -translate-y-1/2 text-amber-200 opacity-40">
                <div className="text-6xl">✦</div>
              </div>

              {/* Main Content */}
              <div className="flex flex-col items-center justify-center h-full px-12 py-8 relative z-10">
                {/* Certificate Badge */}
                <div className="mb-6 text-center">
                  <div className="inline-block relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                      <span className="text-3xl">★</span>
                    </div>
                    <div className="absolute inset-0 rounded-full border-2 border-amber-300 animate-spin" style={{ animationDuration: '20s' }} />
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-5xl font-bold text-amber-900 mb-2 text-center tracking-wide">
                  CERTIFICATE
                </h2>
                <h3 className="text-2xl text-amber-700 mb-8 font-semibold">
                  of Excellence
                </h3>

                {/* Divider */}
                <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent mb-8" />

                {/* Content Section */}
                <div className="text-center mb-8 flex-grow flex flex-col justify-center">
                  <p className="text-gray-700 mb-4 text-lg">This is proudly presented to</p>

                  {/* User Name - Main Focus */}
                  <div className="mb-6">
                    <p className="text-4xl font-bold text-amber-900 tracking-wide mb-1">
                      {userName}
                    </p>
                    <div className="w-40 h-0.5 bg-amber-600 mx-auto" />
                  </div>

                  {/* Achievement Text */}
                  <p className="text-gray-700 text-base max-w-lg mx-auto leading-relaxed">
                    For outstanding achievement and dedication to excellence in mastering advanced project management skills and demonstrating exceptional leadership qualities within the TeamForge platform.
                  </p>
                </div>

                {/* Divider */}
                <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent mb-8" />

                {/* Footer Information */}
                <div className="flex justify-between items-end w-full px-8 py-4">
                  {/* Date */}
                  <div className="text-center flex-1">
                    <p className="text-sm text-gray-600 mb-1">Date</p>
                    <p className="text-gray-800 font-semibold border-b border-gray-800 pb-1">
                      {currentDate}
                    </p>
                  </div>

                  {/* Seal/Badge */}
                  <div className="flex-1 flex justify-center">
                    <div className="w-20 h-20 rounded-full border-4 border-amber-600 flex items-center justify-center bg-amber-50">
                      <span className="text-2xl text-amber-600">TF</span>
                    </div>
                  </div>

                  {/* Signature Line */}
                  <div className="text-center flex-1">
                    <p className="text-sm text-gray-600 mb-1">Authorized By</p>
                    <p className="text-gray-800 font-semibold border-b border-gray-800 pb-1">
                      TeamForge
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <CertificateActions userName={userName} />
      </div>
    </div>
  );
}