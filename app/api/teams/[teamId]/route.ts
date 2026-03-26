import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Team from '@/models/Team';
import User from '@/models/User';
import Project from '@/models/Project';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    // Check if user is a member of the team
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { teamId } = await params;
    
    const team = await Team.findById(teamId).populate('members.user', 'name email image uniqueId role'); // Populate user details

    if (!team) {
      return NextResponse.json({ message: 'Team not found' }, { status: 404 });
    }

    // Authorization check: Is the user a member?
    // We need to map team members correctly because population changes structure slightly
    // Original: members: [{ user: ObjectId, role: String }]
    // Populated: members: [{ user: { _id, name ... }, role: String }]
    
    // Check if user is in the list
    const isMember = team.members.some((member: any) => {
        // Handle both populated and unpopulated cases safely
        const memberId = member.user._id ? member.user._id.toString() : member.user.toString();
        return memberId === user._id.toString();
    });

    if (!isMember) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Ensure member role from team array is included in response if needed client side
    // Or format it nicely
    // Mongoose population should keep the structure: `members: [{ user: {...}, role: ".." }]`
    
    return NextResponse.json(team);
  } catch (error) {
    console.error('Error fetching team:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { teamId } = await params;

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json({ message: 'Team not found' }, { status: 404 });
    }

    // Check if user is the Leader
    const memberRecord = team.members.find((m: any) => m.user.toString() === user._id.toString());
    
    if (!memberRecord || memberRecord.role !== 'Leader') {
        return NextResponse.json({ message: 'Only the Team Leader can delete the workspace.' }, { status: 403 });
    }

    // 1. Remove team from all members' User documents
    // Extract all member IDs
    const memberIds = team.members.map((m: any) => m.user);
    await User.updateMany(
        { _id: { $in: memberIds } },
        { $pull: { teams: teamId } }
    );

    // 2. Delete all Projects associated with this team
    await Project.deleteMany({ team: teamId });

    // 3. Delete the Team itself
    await Team.findByIdAndDelete(teamId);

    return NextResponse.json({ message: 'Team deleted successfully' });
  } catch (error) {
    console.error('Error deleting team:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
