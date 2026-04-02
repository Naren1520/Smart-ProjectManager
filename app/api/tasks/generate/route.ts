import { NextRequest, NextResponse } from 'next/server';
import { generateTasksWithGroq } from '@/lib/groq';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { message, teamMembers } = await req.json();

    if (!message) {
      return NextResponse.json({ message: 'Missing project description' }, { status: 400 });
    }

    const tasks = await generateTasksWithGroq(message, teamMembers || []);
    
    // Attempt to parse JSON response if needed, or return raw string
    try {
      if (tasks.trim().startsWith('[')) {
          return NextResponse.json(JSON.parse(tasks));
      }
      return NextResponse.json(tasks);
    } catch (e) {
      console.warn("Failed to parse Gemini task JSON:", e);
      return NextResponse.json({ raw: tasks });
    }

  } catch (error) {
    console.error("Task Generation Error:", error);
    return NextResponse.json({ message: 'Failed to generate tasks' }, { status: 500 });
  }
}
