import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getGithubLanguages } from '@/lib/github';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    // Use let for reassignment, include uniqueId in select
    let user = await User.findOne({ email: session.user.email }).select('name email skills githubProfile bio uniqueId');
    
    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Generate uniqueId if missing and persist it
    if (!user.uniqueId) {
      // Simple 8 char hex string from timestamp + random
      const generatedId = Math.random().toString(36).substring(2, 6) + Date.now().toString(36).substring(4, 8);
      const finalId = generatedId.toUpperCase();
      
      try {
        // Use findOneAndUpdate to ensure we write and retrieve the same value atomically
        // This prevents "changing ID" issues if multiple requests come in or previous save failed
        const updatedUser = await User.findOneAndUpdate(
             { email: session.user.email },
             { $set: { uniqueId: finalId } },
             { new: true, upsert: false }
        ).select('name email skills githubProfile bio uniqueId');
        
        if (updatedUser) {
             user = updatedUser;
        }
      } catch (e) {
          console.error("Failed to generate uniqueId", e);
      }
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}


export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    const { name, bio, githubUsername } = data;

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (githubUsername) {
       // Ensure githubProfile exists
       if (!user.githubProfile) {
         user.githubProfile = {};
       }

       // Update profile if username changes or just to refresh data
       if (githubUsername) {
            user.githubProfile.username = githubUsername;
            // Re-fetch languages
            const languages = await getGithubLanguages(githubUsername);
            const existingSkills = user.skills || [];
            const newSkills = [...new Set([...existingSkills, ...languages])];
            user.skills = newSkills;
            user.githubProfile.topLanguages = languages;
       }
    }

    if (name) user.name = name;
    if (bio) user.bio = bio;

    await user.save();

    return NextResponse.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
