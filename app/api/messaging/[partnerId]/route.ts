import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import DirectMessage from '@/models/DirectMessage';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ partnerId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { partnerId } = await params;
    await dbConnect();

    const currentUser = await User.findOne({ email: session.user.email });
    const partnerUser = await User.findOne({ uniqueId: partnerId });

    if (!currentUser || !partnerUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const messages = await DirectMessage.find({
      $or: [
        { sender: currentUser._id, receiver: partnerUser._id },
        { sender: partnerUser._id, receiver: currentUser._id }
      ]
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'name email uniqueId image')
      .lean();

    return NextResponse.json({ 
      messages, 
      partner: { name: partnerUser.name, uniqueId: partnerUser.uniqueId, image: partnerUser.image } 
    });

  } catch (error) {
    console.error('Error fetching direct messages:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ partnerId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { partnerId } = await params;
    const body = await req.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    await dbConnect();

    const currentUser = await User.findOne({ email: session.user.email });
    const partnerUser = await User.findOne({ uniqueId: partnerId });

    if (!currentUser || !partnerUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const newMessage = await DirectMessage.create({
      content,
      sender: currentUser._id,
      receiver: partnerUser._id
    });

    await newMessage.populate('sender', 'name email uniqueId image');

    return NextResponse.json({ message: newMessage }, { status: 201 });

  } catch (error) {
    console.error('Error sending direct message:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}