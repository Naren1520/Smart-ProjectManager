import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Team from '@/models/Team';
import User from '@/models/User';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Ensure params are awaited
    const { teamId } = await params;

    const { uniqueId } = await req.json();

    if (!uniqueId) {
      return NextResponse.json({ message: 'Unique ID is required' }, { status: 400 });
    }

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json({ message: 'Team not found' }, { status: 404 });
    }

    // Check if current user is the leader/admin of the team (or at least a member with permission)
    // For now, allow any member to add? User requested "Create Team workspace... take to seperate page where i can add team members". Usually the creator does this.
    const isLeader = team.members.some((member: any) => member.user.toString() === user._id.toString() && member.role === 'Leader');
    
    // For now, assuming only leader can add. If user is just a member, maybe they can't.
    // The user just created the team, so they are the leader.
    if (!isLeader) {
        return NextResponse.json({ message: 'Only team leaders can add members' }, { status: 403 });
    }

    // Find the user to add (case-insensitive)
    const memberToAdd = await User.findOne({ 
        uniqueId: { $regex: new RegExp(`^${uniqueId}$`, 'i') } 
    });
    if (!memberToAdd) {
        return NextResponse.json({ message: 'User with this Unique ID not found' }, { status: 404 });
    }

    // Check if already a member
    const isAlreadyMember = team.members.some((member: any) => member.user.toString() === memberToAdd._id.toString());
    if (isAlreadyMember) {
      return NextResponse.json({ message: 'User is already a member of this team' }, { status: 400 });
    }

    // Add to Team
    team.members.push({ user: memberToAdd._id, role: 'Member' });
    await team.save();

    // Add to User's teams
    await User.findByIdAndUpdate(memberToAdd._id, { $push: { teams: team._id } });

    return NextResponse.json({ message: 'Member added successfully', member: {
        _id: memberToAdd._id,
        name: memberToAdd.name,
        email: memberToAdd.email,
        uniqueId: memberToAdd.uniqueId,
        role: 'Member' 
    }});

  } catch (error) {
    console.error('Error adding team member:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
