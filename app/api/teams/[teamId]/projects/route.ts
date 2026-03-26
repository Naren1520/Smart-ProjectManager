import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';
import Team from '@/models/Team';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { teamId } = await params;

    await dbConnect();
    
    // Validate team exists
    const team = await Team.findById(teamId);
    if (!team) {
       return NextResponse.json({ message: 'Team not found' }, { status: 404 });
    }

    // TODO: Verify user is member of team (optional security check)

    const projects = await Project.find({ team: teamId }).sort({ createdAt: -1 });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching team projects:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
export async function POST(
  req: Request,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { teamId } = await params;
    const { title, description } = await req.json();

    if (!title) {
      return NextResponse.json({ message: 'Title is required' }, { status: 400 });
    }

    await dbConnect();
    
    // Validate team exists
    const team = await Team.findById(teamId);
    if (!team) {
       return NextResponse.json({ message: 'Team not found' }, { status: 404 });
    }

    const newProject = await Project.create({
      title,
      description,
      team: teamId,
      status: 'Planning'
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Error creating team project:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
