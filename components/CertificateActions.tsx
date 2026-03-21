'use client';

import { Printer, Share2, Download } from 'lucide-react';

interface CertificateActionsProps {
  userName: string;
}

export default function CertificateActions({ userName }: CertificateActionsProps) {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleDownloadAsImage = async () => {
    try {
      const element = document.querySelector('[data-certificate]');
      if (!element) return;

      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(element as HTMLElement, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
      });

      // Create a link element and download
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `certificate-${userName.replace(/\s+/g, '-')}.png`;
      link.click();
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download certificate image');
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-4 justify-center print:hidden">
        <button
          onClick={handleDownloadAsImage}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
        >
          <Download className="w-5 h-5" />
          Download Image
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
        >
          <Printer className="w-5 h-5" />
          Print Certificate
        </button>
        <button
          onClick={() => {
            const text = `Check out my Certificate of Excellence from TeamForge! ${window.location.href}`;
            navigator.clipboard.writeText(text);
            alert('Certificate link copied to clipboard!');
          }}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
        >
          <Share2 className="w-5 h-5" />
          Share Certificate
        </button>
      </div>

      <style>{`
        @media print {
          body {
            background: white;
            margin: 0;
            padding: 0;
          }
          .print\\:hidden {
            display: none !important;
          }
          div {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </>
  );
}
