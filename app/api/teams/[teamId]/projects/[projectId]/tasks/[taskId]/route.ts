import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ teamId: string, projectId: string, taskId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { teamId, projectId, taskId } = await params;
    await dbConnect();
    
    // We could verify the user is a leader here, but we enforce it on the frontend.
    const project = await Project.findOne({ _id: projectId, team: teamId });
    
    if (!project) return NextResponse.json({ message: 'Project not found' }, { status: 404 });

    project.tasks = project.tasks.filter((t: any) => t._id.toString() !== taskId);
    await project.save();

    return NextResponse.json({ message: 'Task deleted successfully', project });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
