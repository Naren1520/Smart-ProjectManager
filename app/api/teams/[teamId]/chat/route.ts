import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';
import Team from '@/models/Team';
import User from '@/models/User';

// GET all messages for a team
export async function GET(
  req: Request,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { teamId } = await params;

    await dbConnect();
    
    // Validate team exists and user is part of the team
    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const team = await Team.findById(teamId);
    if (!team) return NextResponse.json({ error: 'Team not found' }, { status: 404 });

    const isMember = team.members.some((m: any) => m.user.toString() === user._id.toString());
    if (!isMember) {
      return NextResponse.json({ error: 'Not a member of this team' }, { status: 403 });
    }

    const messages = await Message.find({ team: teamId })
      .populate('sender', 'name email')
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({ messages, teamName: team.name });

  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new message
export async function POST(
  req: Request,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { teamId } = await params;
    const body = await req.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    await dbConnect();

    // Verify user and team membership
    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const team = await Team.findById(teamId);
    if (!team) return NextResponse.json({ error: 'Team not found' }, { status: 404 });

    const isMember = team.members.some((m: any) => m.user.toString() === user._id.toString());
    if (!isMember) {
      return NextResponse.json({ error: 'Not a member of this team' }, { status: 403 });
    }

    const newMessage = await Message.create({
      content,
      sender: user._id,
      team: teamId,
      isAI: false
    });

    // Populate sender details before returning
    const populatedMessage = await newMessage.populate('sender', 'name email');

    return NextResponse.json({ message: populatedMessage }, { status: 201 });

  } catch (error) {
    console.error('Error posting chat message:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}