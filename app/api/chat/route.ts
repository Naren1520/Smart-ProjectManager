import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get('teamId');

    await dbConnect();
    
    if (!teamId) return NextResponse.json([], { status: 400 });

    const messages = await Message.find({ team: teamId }).sort({ createdAt: 1 }).populate('sender', 'name image');
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { teamId, content } = await req.json();
  if (!teamId || !content) return NextResponse.json({ message: 'Missing fields' }, { status: 400 });

  await dbConnect();

  // Save user message
  const userMsg = new Message({
    content,
    sender: session.user?.id,
    team: teamId,
    isAI: false,
    createdAt: new Date(),
  });
  await userMsg.save();

  // AI Logic Simulation
  // Simple heuristic: if message asks for "plan", "task", "assign", or contains "project"
  const msgLower = content.toLowerCase();
  let aiResponseContent = "";

  if (msgLower.includes("plan") || msgLower.includes("project")) {
    aiResponseContent = "I can help with that! Based on the team's skills (React, Node.js), I recommend breaking down the project into:\n\n1. Frontend Setup (Next.js) - Assigned to You\n2. API Development (Node) - Assigned to John\n3. Database Schema (MongoDB) - Assigned to Sarah\n\nWould you like me to create these tasks?";
  } else if (msgLower.includes("create task") || msgLower.includes("yes")) {
    aiResponseContent = "Understood. I've created user stories and tasks in the backlog. I've also set up a preliminary Gantt chart timeline for a 2-week sprint.";
  } else if (msgLower.includes("hello") || msgLower.includes("hi")) {
    aiResponseContent = "Hello! I'm TeamForge AI. How can I assist with your project management today?";
  }

  if (aiResponseContent) {
    // Simulate thinking delay
    setTimeout(async () => {
        const aiMsg = new Message({
            content: aiResponseContent,
            sender: null, // or a dedicated AI bot user ID
            team: teamId,
            isAI: true,
            createdAt: new Date(),
        });
        await aiMsg.save();
    }, 1000); // This won't work serverless reliably. Better to save immediately or use background job.
    // For demo, save immediately but with slightly later timestamp
    const aiMsg = new Message({
        content: aiResponseContent,
        sender: null, // AI
        team: teamId,
        isAI: true,
        createdAt: new Date(Date.now() + 100),
    });
    await aiMsg.save();
  }

  return NextResponse.json({ message: 'Message sent' });
}