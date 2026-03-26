import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { teamId, title, description, deadline } = await req.json();

    if (!teamId || !title) {
      return NextResponse.json({ message: 'Team ID and Title are required' }, { status: 400 });
    }

    await dbConnect();

    const newProject = new Project({
      title,
      description,
      team: teamId,
      deadline,
      status: 'Planning'
    });

    await newProject.save();

    return NextResponse.json({ message: 'Project created successfully', project: newProject });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}