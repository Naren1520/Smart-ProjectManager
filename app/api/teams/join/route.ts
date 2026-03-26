import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Team from '@/models/Team';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ message: 'Code is required' }, { status: 400 });
    }

    await dbConnect();

    // Check if team exists.
    const team: any = await Team.findOne({ uniqueId: code });
    if (!team) {
      return NextResponse.json({ message: 'Team not found' }, { status: 404 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
         return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (team.members.some((m: any) => m.user.toString() === user._id.toString())) {
      return NextResponse.json({ message: 'Already a member' }, { status: 400 });
    }

    team.members.push({ user: user._id, role: 'Member' });
    await team.save();

    await User.findByIdAndUpdate(user._id, { $push: { teams: team._id } });

    return NextResponse.json({ message: 'Joined team successfully' });
  } catch (error) {
    console.error('Error joining team:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}