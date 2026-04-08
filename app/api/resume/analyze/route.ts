import { NextRequest, NextResponse } from 'next/server';
import { generateGeminiResponse } from '@/lib/gemini';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const contentType = req.headers.get('content-type') || '';
    let analysis;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file');

      if (!file || !(file instanceof Blob)) {
        return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
      }

      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const base64Data = Buffer.from(arrayBuffer).toString('base64');
        
        const prompt = `You are an expert HR and Technical Recruiter AI. Please analyze the attached resume and extract the key skills, experience level, a brief summary, details about personal or professional projects, and suggest roles.
        
        For each suggested role, include which skills from the resume make them a good fit. For each project, include the specific skills applied.
        
        Return a JSON object with the following structure:
        {
          "summary": "Brief professional summary",
          "skills": ["Skill 1", "Skill 2", ...],
          "experienceLevel": "Junior/Mid-level/Senior",
          "suggestedRoles": [{"role": "Role Name", "matchingSkills": ["Skill A", "Skill B"]}],
          "projects": [{"title": "Project Name", "description": "Brief description or impact", "appliedSkills": ["Skill X", "Skill Y"]}]
        }
        Do not include any markdown formatting, just the raw JSON object.`;

        analysis = await generateGeminiResponse(prompt, { data: base64Data, mimeType: 'application/pdf' });
      } else {
        const resumeText = await file.text();
        const prompt = `You are an expert HR and Technical Recruiter AI. Please analyze the following resume text and extract the key skills, experience level, a brief summary, details about personal or professional projects, and suggest roles.
        
        For each suggested role, include which skills from the resume make them a good fit. For each project, include the specific skills applied.
        
        Resume Text:
        "${resumeText}"

        Return a JSON object with the following structure:
        {
          "summary": "Brief professional summary",
          "skills": ["Skill 1", "Skill 2", ...],
          "experienceLevel": "Junior/Mid-level/Senior",
          "suggestedRoles": [{"role": "Role Name", "matchingSkills": ["Skill A", "Skill B"]}],
          "projects": [{"title": "Project Name", "description": "Brief description or impact", "appliedSkills": ["Skill X", "Skill Y"]}]
        }
        Do not include any markdown formatting, just the raw JSON object.`;
        analysis = await generateGeminiResponse(prompt);
      }
    } else {
      const body = await req.json();
      const resumeText = body.resumeText;
      if (!resumeText) {
        return NextResponse.json({ message: 'Missing resume text' }, { status: 400 });
      }
      const prompt = `You are an expert HR and Technical Recruiter AI. Please analyze the following resume text and extract the key skills, experience level, a brief summary, details about personal or professional projects, and suggest roles.
      
      For each suggested role, include which skills from the resume make them a good fit. For each project, include the specific skills applied.

      Resume Text:
      "${resumeText}"

      Return a JSON object with the following structure:
      {
        "summary": "Brief professional summary",
        "skills": ["Skill 1", "Skill 2", ...],
        "experienceLevel": "Junior/Mid-level/Senior",
        "suggestedRoles": [{"role": "Role Name", "matchingSkills": ["Skill A", "Skill B"]}],
        "projects": [{"title": "Project Name", "description": "Brief description or impact", "appliedSkills": ["Skill X", "Skill Y"]}]
      }
      Do not include any markdown formatting, just the raw JSON object.`;
      analysis = await generateGeminiResponse(prompt);
    }
    
    // Attempt to parse JSON response if needed, or return raw string
    try {
      if (typeof analysis === 'string') {
          // Clean possible markdown formatting from Gemini response
          const cleanedJson = analysis.replace(/```json/gi, '').replace(/```/g, '').trim();
          if (cleanedJson.startsWith('{')) {
              return NextResponse.json(JSON.parse(cleanedJson));
          }
      }
      return NextResponse.json(analysis);
    } catch (e) {
      console.warn("Failed to parse Gemini resume JSON:", e, analysis);
      return NextResponse.json({ raw: analysis });
    }

  } catch (error) {
    console.error("Resume Analysis Error:", error);
    return NextResponse.json({ message: 'Failed to analyze resume' }, { status: 500 });
  }
}
