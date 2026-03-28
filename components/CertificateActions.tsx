'use client';

import { Printer, Share2, Download, Facebook, Linkedin, MessageCircle } from 'lucide-react';
import { useState } from 'react';

interface CertificateActionsProps {
  userName: string;
  memberId?: string;
}

export default function CertificateActions({ userName, memberId = 'TF-USER' }: CertificateActionsProps) {
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
      
      // Load and process logo to be circular
      const logoUrl = '/logo.png';
      const logoDataUrl = await new Promise<string>((resolve) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
           const canvas = document.createElement('canvas');
           const size = Math.min(img.width, img.height);
           canvas.width = size;
           canvas.height = size;
           const ctx = canvas.getContext('2d');
           if (!ctx) {
             resolve(logoUrl); // Fallback to original url if context fails, though rendering might fail or be square
             return;
           }
           
           // Create circular clipping path
           ctx.beginPath();
           ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
           ctx.closePath();
           ctx.clip();
           
           // Draw image (object-cover logic)
           let dx = 0;
           let dy = 0;
           let dWidth = size;
           let dHeight = size;
           
           // For simple square/center crop
           if (img.width > img.height) {
             const scale = size / img.height;
             dWidth = img.width * scale;
             dx = -(dWidth - size) / 2;
           } else {
             const scale = size / img.width;
             dHeight = img.height * scale;
             dy = -(dHeight - size) / 2;
           }

           ctx.drawImage(img, dx, dy, dWidth, dHeight);
           resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => {
          console.warn('Failed to load logo, continuing without it');
          resolve(''); 
        };
        img.src = logoUrl;
      });

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
      pdf.line(pageWidth - margin, margin + cornerSize, pageWidth - margin, margin); // Top right
      pdf.line(pageWidth - margin - cornerSize, margin, pageWidth - margin, margin);
      pdf.line(margin, pageHeight - margin - cornerSize, margin, pageHeight - margin); // Bottom left
      pdf.line(margin + cornerSize, pageHeight - margin, margin, pageHeight - margin);
      pdf.line(pageWidth - margin, pageHeight - margin - cornerSize, pageWidth - margin, pageHeight - margin); // Bottom right
      pdf.line(pageWidth - margin - cornerSize, pageHeight - margin, pageWidth - margin, pageHeight - margin);

      // Add Logo at Top Center
      if (logoDataUrl) {
         const logoSize = 24; // Scaled down from 35mm
         const logoX = (pageWidth - logoSize) / 2;
         const logoY = margin + 12; // Moved slightly down
         const centerX = logoX + logoSize / 2;
         const centerY = logoY + logoSize / 2;
         const radius = logoSize / 2;

         // Draw circle background for logo
         pdf.setFillColor(255, 255, 255);
         pdf.circle(centerX, centerY, radius, 'F');
         
         // Add circular clipped image
         pdf.addImage(logoDataUrl, 'PNG', logoX, logoY, logoSize, logoSize);
         
         // Decorative border (Gold) - around the image
         pdf.setDrawColor(180, 127, 0);
         pdf.setLineWidth(0.5);
         pdf.circle(centerX, centerY, radius, 'S');

         // Outer ring spinning effect simulation (Amber-300 roughly)
         // We draw a slightly larger circle with a lighter color
         pdf.setDrawColor(252, 211, 77); // #fcd34d
         pdf.setLineWidth(1.5);
         pdf.circle(centerX, centerY, radius + 2, 'S');
      }

      // Title
      pdf.setFontSize(44); // Slightly smaller to fix overlap
      pdf.setTextColor(101, 67, 33); // Dark brown
      pdf.text('CERTIFICATE', pageWidth / 2, margin + 55, { align: 'center' });

      // Subtitle
      pdf.setFontSize(16);
      pdf.setTextColor(139, 90, 43); // Dark golden brown
      pdf.text('OF MEMBERSHIP', pageWidth / 2, margin + 65, { align: 'center' });

      // Divider line
      pdf.setDrawColor(180, 127, 0);
      pdf.setLineWidth(1.5);
      pdf.line(pageWidth / 2 - 30, margin + 70, pageWidth / 2 + 30, margin + 70);

      // Presented to text
      pdf.setFontSize(14);
      pdf.setTextColor(80, 80, 80);
      pdf.text('This is to certify that', pageWidth / 2, margin + 80, { align: 'center' });

      // User name - highlighted
      pdf.setFontSize(28);
      pdf.setTextColor(101, 67, 33);
      pdf.setFont(undefined, 'bold');
      pdf.text(userName, pageWidth / 2, margin + 93, { align: 'center' });

      // Underline name
      pdf.setDrawColor(180, 127, 0);
      pdf.setLineWidth(1);
      pdf.line(pageWidth / 2 - 40, margin + 96, pageWidth / 2 + 40, margin + 96);

      // Achievement text
      pdf.setFont(undefined, 'normal');
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      
      // Calculate split text for accurate spacing
      const achievementText1 = 'is an official member of the TeamForge AI Platform.';
      const achievementText2 = 'As a valued member, they are recognized for being part of our collaborative environment,';
      const achievementText3 = 'contributing to team activities, and engaging in project development and management.';
      const achievementText4 = 'We appreciate their association and look forward to their continued participation';
      const achievementText5 = 'and growth within the platform.';

      pdf.text(achievementText1, pageWidth / 2, margin + 108, { align: 'center' });
      
      pdf.text(achievementText2, pageWidth / 2, margin + 118, { align: 'center' });
      pdf.text(achievementText3, pageWidth / 2, margin + 124, { align: 'center' });
      
      pdf.text(achievementText4, pageWidth / 2, margin + 134, { align: 'center' });
      pdf.text(achievementText5, pageWidth / 2, margin + 140, { align: 'center' });

      // Bottom divider
      pdf.setDrawColor(180, 127, 0);
      pdf.setLineWidth(1.5);
      pdf.line(pageWidth / 2 - 30, pageHeight - margin - 35, pageWidth / 2 + 30, pageHeight - margin - 35);

      // Footer information
      const footerY = pageHeight - margin - 20;

      // Left column (Membership ID & Date)
      pdf.setFontSize(10);
      pdf.setTextColor(180, 127, 0);
      pdf.setFont(undefined, 'bold');
      pdf.text('MEMBERSHIP ID', margin + 30, footerY - 10, { align: 'center' });
      pdf.setTextColor(80, 80, 80);
      pdf.setFont(undefined, 'normal');
      pdf.text(`#${memberId}`, margin + 30, footerY - 4, { align: 'center' });

      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      pdf.setTextColor(180, 127, 0);
      pdf.setFont(undefined, 'bold');
      pdf.text('DATE OF JOINING', margin + 30, footerY + 4, { align: 'center' });
      pdf.setTextColor(80, 80, 80);
      pdf.setFont(undefined, 'normal');
      pdf.text(currentDate, margin + 30, footerY + 10, { align: 'center' });

      // Seal column (center)
      pdf.setFontSize(24);
      pdf.setTextColor(180, 127, 0);
      pdf.setFont(undefined, 'bold');
      pdf.text('TF', pageWidth / 2, footerY - 2, { align: 'center' });
      pdf.setFontSize(8);
      pdf.text('PLATFORM', pageWidth / 2, footerY + 4, { align: 'center' });
      pdf.circle(pageWidth / 2, footerY - 1, 10, 'S');

      // Authority column
      pdf.setFont(undefined, 'italic'); // pseudo-signature
      pdf.setFontSize(18);
      pdf.setTextColor(101, 67, 33);
      pdf.text('Naren S J', pageWidth - margin - 35, footerY - 5, { align: 'center' });
      
      pdf.setDrawColor(80, 80, 80);
      pdf.setLineWidth(0.5);
      pdf.line(pageWidth - margin - 55, footerY, pageWidth - margin - 15, footerY);
      
      pdf.setFont(undefined, 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(180, 127, 0);
      pdf.text('AUTHORIZED SIGNATURE', pageWidth - margin - 35, footerY + 6, { align: 'center' });

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
