import { NextRequest, NextResponse } from 'next/server';
import { analyzeResume } from '@/lib/gemini';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PDFParse } from 'pdf-parse';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const contentType = req.headers.get('content-type') || '';
    let resumeText = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file');

      if (!file || !(file instanceof Blob)) {
        return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
      }

      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const parser = new PDFParse({ data: buffer });
        const pdfData = await parser.getText();
        resumeText = pdfData.text;
      } else {
        resumeText = await file.text();
      }
    } else {
      const body = await req.json();
      resumeText = body.resumeText;
    }

    if (!resumeText) {
      return NextResponse.json({ message: 'Missing resume text or file' }, { status: 400 });
    }

    const analysis = await analyzeResume(resumeText);
    
    // Attempt to parse JSON response if needed, or return raw string
    try {
      if (typeof analysis === 'string' && analysis.trim().startsWith('{')) {
          return NextResponse.json(JSON.parse(analysis));
      }
      return NextResponse.json(analysis);
    } catch (e) {
      console.warn("Failed to parse Gemini resume JSON:", e);
      return NextResponse.json({ raw: analysis });
    }

  } catch (error) {
    console.error("Resume Analysis Error:", error);
    return NextResponse.json({ message: 'Failed to analyze resume' }, { status: 500 });
  }
}
