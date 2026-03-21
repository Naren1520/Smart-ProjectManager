'use client';

import { Printer, Share2, Download, Facebook, Linkedin, MessageCircle } from 'lucide-react';
import { useState } from 'react';

interface CertificateActionsProps {
  userName: string;
}

export default function CertificateActions({ userName }: CertificateActionsProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const certificateUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Check out my Certificate of Excellence from TeamForge AI! 🎓`;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      // Hide everything except certificate
      const style = document.createElement('style');
      style.innerHTML = `
        @media print {
          body * {
            visibility: hidden;
          }
          [data-certificate], [data-certificate] * {
            visibility: visible;
          }
          [data-certificate] {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
          }
          body {
            margin: 0;
            padding: 0;
          }
        }
      `;
      document.head.appendChild(style);
      window.print();
      document.head.removeChild(style);
    }
  };

  const handleDownloadAsImage = async () => {
    try {
      console.log('Starting PDF generation...');
      
      // @ts-ignore
      const { jsPDF } = await import('jspdf/dist/jspdf.umd.min.js');

      // Create landscape PDF
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;

      // Set background color
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');

      // Draw decorative border
      pdf.setDrawColor(180, 127, 0); // Amber/gold color
      pdf.setLineWidth(2);
      pdf.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);

      // Draw inner decorative border
      pdf.setLineWidth(1);
      pdf.rect(margin + 3, margin + 3, pageWidth - 2 * (margin + 3), pageHeight - 2 * (margin + 3));

      // Add decorative corners
      const cornerSize = 8;
      pdf.line(margin, margin + cornerSize, margin, margin);
      pdf.line(margin + cornerSize, margin, margin, margin);

      // Title
      pdf.setFontSize(60);
      pdf.setTextColor(101, 67, 33); // Dark brown
      pdf.text('CERTIFICATE', pageWidth / 2, margin + 25, { align: 'center' });

      // Subtitle
      pdf.setFontSize(28);
      pdf.setTextColor(139, 90, 43); // Dark golden brown
      pdf.text('of Excellence', pageWidth / 2, margin + 40, { align: 'center' });

      // Divider line
      pdf.setDrawColor(180, 127, 0);
      pdf.setLineWidth(1.5);
      pdf.line(pageWidth / 2 - 30, margin + 50, pageWidth / 2 + 30, margin + 50);

      // Presented to text
      pdf.setFontSize(16);
      pdf.setTextColor(80, 80, 80);
      pdf.text('This is proudly presented to', pageWidth / 2, margin + 65, { align: 'center' });

      // User name - highlighted
      pdf.setFontSize(42);
      pdf.setTextColor(101, 67, 33);
      pdf.setFont(undefined, 'bold');
      pdf.text(userName, pageWidth / 2, margin + 85, { align: 'center' });

      // Underline name
      pdf.setDrawColor(180, 127, 0);
      pdf.setLineWidth(1);
      pdf.line(pageWidth / 2 - 50, margin + 92, pageWidth / 2 + 50, margin + 92);

      // Achievement text
      pdf.setFont(undefined, 'normal');
      pdf.setFontSize(13);
      pdf.setTextColor(100, 100, 100);
      const achievementText =
        'For outstanding achievement and dedication to excellence in mastering advanced project management skills and demonstrating exceptional leadership qualities within the TeamForge platform.';
      pdf.text(achievementText, pageWidth / 2, margin + 110, {
        align: 'center',
        maxWidth: pageWidth - 40,
      });

      // Bottom divider
      pdf.setDrawColor(180, 127, 0);
      pdf.setLineWidth(1.5);
      pdf.line(pageWidth / 2 - 30, pageHeight - margin - 35, pageWidth / 2 + 30, pageHeight - margin - 35);

      // Footer information
      const footerY = pageHeight - margin - 20;

      // Date column
      pdf.setFontSize(11);
      pdf.setTextColor(80, 80, 80);
      pdf.text('Date', margin + 20, footerY - 10, { align: 'center' });
      pdf.setFontSize(10);
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      pdf.setDrawColor(80, 80, 80);
      pdf.line(margin + 10, footerY - 3, margin + 30, footerY - 3);
      pdf.text(currentDate, margin + 20, footerY + 3, { align: 'center' });

      // Seal column (center)
      pdf.setFontSize(24);
      pdf.setTextColor(180, 127, 0);
      pdf.text('TF', pageWidth / 2, footerY - 2, { align: 'center' });

      // Authority column
      pdf.setFontSize(11);
      pdf.setTextColor(80, 80, 80);
      pdf.text('Authorized By', pageWidth - margin - 20, footerY - 10, { align: 'center' });
      pdf.setFontSize(10);
      pdf.setDrawColor(80, 80, 80);
      pdf.line(pageWidth - margin - 30, footerY - 3, pageWidth - margin - 10, footerY - 3);
      pdf.text('TeamForge', pageWidth - margin - 20, footerY + 3, { align: 'center' });

      // Save PDF
      pdf.save(`certificate-${userName.replace(/\s+/g, '-')}.pdf`);
      console.log('PDF generated successfully');
      alert('✅ Certificate PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(certificateUrl);
    const encodedText = encodeURIComponent(shareText);
    let url = '';

    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'email':
        url = `mailto:?subject=My TeamForge Certificate&body=${encodedText}%20${encodedUrl}`;
        break;
      default:
        break;
    }

    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
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
          Download PDF
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
        >
          <Printer className="w-5 h-5" />
          Print Certificate
        </button>
        <div className="relative">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
          >
            <Share2 className="w-5 h-5" />
            Share Certificate
          </button>
          
          {showShareMenu && (
            <div className="absolute bottom-full mb-2 right-0 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl p-2 min-w-max z-50">
              <button
                onClick={() => {
                  handleShare('twitter');
                  setShowShareMenu(false);
                }}
                className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded text-neutral-700 dark:text-neutral-300 w-full text-left"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7z" />
                </svg>
                Twitter
              </button>
              <button
                onClick={() => {
                  handleShare('facebook');
                  setShowShareMenu(false);
                }}
                className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded text-neutral-700 dark:text-neutral-300 w-full text-left"
              >
                <Facebook className="w-5 h-5" />
                Facebook
              </button>
              <button
                onClick={() => {
                  handleShare('linkedin');
                  setShowShareMenu(false);
                }}
                className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded text-neutral-700 dark:text-neutral-300 w-full text-left"
              >
                <Linkedin className="w-5 h-5" />
                LinkedIn
              </button>
              <button
                onClick={() => {
                  handleShare('whatsapp');
                  setShowShareMenu(false);
                }}
                className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded text-neutral-700 dark:text-neutral-300 w-full text-left"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </button>
              <button
                onClick={() => {
                  handleShare('email');
                  setShowShareMenu(false);
                }}
                className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded text-neutral-700 dark:text-neutral-300 w-full text-left"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          [data-certificate], [data-certificate] * {
            visibility: visible;
          }
          [data-certificate] {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
          }
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
        }
      `}</style>
    </>
  );
}
