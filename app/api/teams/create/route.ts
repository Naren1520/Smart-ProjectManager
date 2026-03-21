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

    const { name, description } = await req.json();

    if (!name) {
      return NextResponse.json({ message: 'Team name is required' }, { status: 400 });
    }

    await dbConnect();
    
    // Find User ID
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Create Team
    const newTeam = new Team({
      name,
      description,
      members: [{ user: user._id, role: 'Leader' }],
    });

    await newTeam.save();

    // Update User's teams list
    await User.findByIdAndUpdate(user._id, { $push: { teams: newTeam._id } });

    return NextResponse.json({ message: 'Team created successfully', teamId: newTeam._id });
  } catch (error) {
    console.error('Error creating team:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}