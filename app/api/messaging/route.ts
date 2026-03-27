import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import DirectMessage from '@/models/DirectMessage';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Find all DirectMessages where the user is sender or receiver
    const dms = await DirectMessage.find({
      $or: [{ sender: currentUser._id }, { receiver: currentUser._id }]
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'name email uniqueId image')
      .populate('receiver', 'name email uniqueId image')
      .lean();

    // Group by conversation partner to get recent chats
    const conversationsMap = new Map();

    for (const dm of dms) {
      // Determine who the partner is (the one who is NOT the current user)
      const isSender = dm.sender._id.toString() === currentUser._id.toString();
      const partner = isSender ? dm.receiver : dm.sender;

      // Group by partner ID
      if (partner && !conversationsMap.has(partner._id.toString())) {
        conversationsMap.set(partner._id.toString(), {
          partner: {
            name: partner.name,
            uniqueId: partner.uniqueId,
            email: partner.email,
            image: partner.image
          },
          lastMessage: dm.content,
          lastMessageAt: dm.createdAt
        });
      }
    }

    const conversations = Array.from(conversationsMap.values());

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}