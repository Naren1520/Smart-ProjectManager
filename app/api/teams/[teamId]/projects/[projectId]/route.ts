import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ teamId: string, projectId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { teamId, projectId } = await params;
    await dbConnect();
    
    const project = await Project.findOne({ _id: projectId, team: teamId });
    if (!project) return NextResponse.json({ message: 'Project not found' }, { status: 404 });

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
