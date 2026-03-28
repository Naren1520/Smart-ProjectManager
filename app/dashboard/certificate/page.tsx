'use client';

import { useSession } from 'next-auth/react';
import { useRef } from 'react';
import Image from 'next/image';
import CertificateActions from '@/components/CertificateActions';

export default function CertificatePage() {
  const { data: session } = useSession();
  const certificateRef = useRef<HTMLDivElement>(null);

  const userName = session?.user?.name || 'Certificate Holder';
  const memberId = session?.user?.email 
    ? `TF-${session.user.email.split('@')[0].toUpperCase()}`
    : `TF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Certificate</h1>
          <p className="text-gray-600">A professional recognition of your achievement</p>
        </div>

        {/* Certificate Container */}
        <div className="mb-8 flex justify-center w-full overflow-x-auto pb-4">
          <div
            ref={certificateRef}
            data-certificate
            className="relative flex-none"
            style={{
              width: '100%',
              minWidth: '800px', // Forces the certificate to stay rectangular and horizontal
              maxWidth: '1000px', 
              aspectRatio: '1.414 / 1', // standard A4 landscape ratio
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
              <div className="flex flex-col items-center justify-between h-full px-8 py-6 relative z-10">
                {/* Header Area */}
                <div className="flex flex-col items-center mt-2">
                  {/* Certificate Badge */}
                  <div className="mb-3 text-center">
                    <div className="inline-block relative">
                      <div className="w-14 h-14 rounded-full bg-white shadow-lg relative overflow-hidden flex items-center justify-center">
                        <Image 
                          src="/logo.png" 
                          alt="TeamForge Logo" 
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 rounded-full border-2 border-amber-300 animate-spin" style={{ animationDuration: '20s' }} />
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-4xl font-bold text-amber-900 mb-1 text-center tracking-wide">
                    CERTIFICATE
                  </h2>
                  <h3 className="text-xl text-amber-700 font-semibold tracking-widest uppercase mb-3">
                    of Membership
                  </h3>

                  {/* Divider */}
                  <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent" />
                </div>

                {/* Content Section */}
                <div className="text-center flex flex-col justify-center max-w-3xl mx-auto px-4 my-2">
                  <p className="text-gray-700 text-lg font-medium mb-3">This is to certify that</p>

                  {/* User Name - Main Focus */}
                  <div className="mb-4">
                    <p className="text-3xl font-bold text-amber-900 tracking-wide mb-1 px-4 truncate">
                      {userName}
                    </p>
                    <div className="w-40 h-0.5 bg-amber-600 mx-auto" />
                  </div>

                  {/* Achievement Text */}
                  <div className="text-gray-700 text-base leading-snug flex flex-col gap-2">
                    <p>
                      is an official member of the <span className="font-semibold text-gray-900">TeamForge AI Platform</span>.
                    </p>
                    <p>
                      As a valued member, they are recognized for being part of our collaborative environment, contributing to team activities, and engaging in project development and management.
                    </p>
                    <p>
                      We appreciate their association and look forward to their continued participation and growth within the platform.
                    </p>
                  </div>
                </div>

                {/* Divider Area */}
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent mb-2" />

                {/* Footer Information */}
                <div className="flex justify-between items-end w-full px-4 pb-2">
                  {/* Left Footer items */}
                  <div className="flex flex-col text-left flex-1 space-y-1 mb-2">
                    <div>
                      <p className="text-[10px] text-amber-700 font-semibold mb-0.5 uppercase tracking-wider">Membership ID</p>
                      <p className="text-xs text-gray-800 font-medium">#{memberId}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-amber-700 font-semibold mb-0.5 uppercase tracking-wider">Date of Joining</p>
                      <p className="text-xs text-gray-800 font-medium">{currentDate}</p>
                    </div>
                  </div>

                  {/* Seal/Badge */}
                  <div className="flex-1 flex justify-center mb-1">
                    <div className="relative group">
                      <div className="w-20 h-20 rounded-full border-4 border-amber-600 flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 shadow-inner">
                        <span className="text-2xl font-bold text-amber-600 tracking-tighter">TF</span>
                        <span className="text-[8px] font-semibold text-amber-700 tracking-widest mt-0.5 uppercase">Platform</span>
                      </div>
                    </div>
                  </div>

                  {/* Signature Line */}
                  <div className="text-center flex-1 mb-2">
                    <div className="flex flex-col items-center justify-end h-full">
                      {/* Signature styling (cursive style text) */}
                      <p className="font-serif text-xl text-amber-900 mb-1" style={{ WebkitFontSmoothing: 'antialiased' }}>
                        Naren S J
                      </p>
                      <div className="w-32 border-b border-gray-400 mb-1"></div>
                      <p className="text-[10px] text-amber-700 font-semibold uppercase tracking-wider">Authorized Signature</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <CertificateActions userName={userName} memberId={memberId} />
      </div>
    </div>
  );
}
