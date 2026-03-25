import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Project from '@/models/Project';
import { getGithubProfile, getGithubLanguages } from '@/lib/github';

export async function GET(req: Request, { params }: { params: Promise<{ uniqueId: string }> }) {
  try {
    const { uniqueId } = await params;
    await dbConnect();
    
    // Find user by uniqueId
    const user = await User.findOne({ uniqueId: uniqueId.toUpperCase() })
        .select('name image bio skills githubProfile badge points level');

    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Fetch projects where user is leader or member (optional, but requested "projects")
    // For now, let's just return public projects or simplified list
    // Assuming team projects are visible if user shares profile. Or maybe just count.
    // Let's fetch recent projects
    const projects = await Project.find({ 'members.user': user._id }).sort('-createdAt').limit(3).select('title status techStack');


    // Ensure fresh GitHub stats if username exists
    let githubStats = null;
    let githubLanguages: string[] = [];
    if (user.githubProfile?.username) {
        try {
            githubStats = await getGithubProfile(user.githubProfile.username);
            githubLanguages = await getGithubLanguages(user.githubProfile.username);
        } catch (e) {
            console.error("Failed to fetch fresh github data for profile", e);
        }
    }

    return NextResponse.json({
        user: {
            ...user.toObject(),
            githubStats,
            githubLanguages
        },
        projects
    });

  } catch (error) {
    console.error("Error regarding profile fetch:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
