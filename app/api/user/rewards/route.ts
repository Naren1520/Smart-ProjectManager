import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Initialize rewards data if missing
    let dataChanged = false;

    if (user.points === undefined) {
        user.points = 0;
        dataChanged = true;
    }

    if (user.level === undefined) {
        user.level = 1;
        dataChanged = true;
    }

    if (!user.badges || user.badges.length === 0) {
        // Initialize with default badges structure
        user.badges = [
            {
                name: 'Top Contributor',
                description: 'Completed 5 tasks this week',
                icon: 'Award',
                unlocked: user.points > 100,
                dateEarned: user.points > 100 ? new Date() : null,
            },
            {
                name: 'Team Leader',
                description: 'Lead a team of 3 members',
                icon: 'Users',
                unlocked: user.points > 300,
                dateEarned: user.points > 300 ? new Date() : null,
            },
             {
                name: 'Bug Hunter',
                description: 'Found and fixed a critical bug',
                icon: 'Bug',
                unlocked: false,
                dateEarned: null,
            }
        ];
        dataChanged = true;
    }

    if (dataChanged) {
        await user.save();
    }

    return NextResponse.json({
      points: user.points,
      level: user.level,
      badges: user.badges
    });

  } catch (error) {
    console.error('Error fetching rewards:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
