'use client';

import { Award, CheckCircle, Download } from 'lucide-react';

export default function RewardsPage() {
  const points = 350;

  const downloadCertificate = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [800, 600]
    });

    // Background
    doc.setFillColor(243, 244, 246);
    doc.rect(0, 0, 800, 600, 'F');

    // Branding
    doc.setFontSize(36);
    doc.setTextColor(37, 99, 235);
    doc.text('TeamForge AI', 400, 100, { align: 'center' });

    // Title
    doc.setFontSize(48);
    doc.setTextColor(17, 24, 39);
    doc.text('CERTIFICATE OF ACCOMPLISHMENT', 400, 200, { align: 'center' });

    // Name
    doc.setFontSize(24);
    doc.setTextColor(55, 65, 81);
    doc.text('Presented to', 400, 260, { align: 'center' });

    doc.setFontSize(40);
    doc.setTextColor(17, 24, 39);
    doc.text('John Doe', 400, 320, { align: 'center' }); // Replace with user.name

    // Achievement
    doc.setFontSize(20);
    doc.setTextColor(75, 85, 99);
    doc.text('For successfully completing 10 AI-assisted tasks', 400, 380, { align: 'center' });

    // Footer
    doc.setFontSize(16);
    doc.setTextColor(156, 163, 175);
    doc.text(`Issued by TeamForge AI • ${new Date().toLocaleDateString()}`, 400, 500, { align: 'center' });

    doc.save('TeamForge-Certificate.pdf');
  };

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

      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm text-center">
        <Award className="w-16 h-16 mx-auto text-blue-500 mb-6" />
        <h2 className="text-2xl font-bold mb-2">Claim Your Certificate</h2>
        <p className="text-neutral-500 mb-8 max-w-md mx-auto">
            You've reached a milestone! Download your personalized AI-generated certificate to showcase your skills.
        </p>
        <button 
            onClick={downloadCertificate}
            className="px-8 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 mx-auto"
        >
            <Download className="w-5 h-5" />
            Download Certificate
        </button>
      </div>
    </div>
  );
}