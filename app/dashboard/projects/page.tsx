import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Project from "@/models/Project";
import ProjectsClient from "./ProjectsClient";
import { redirect } from "next/navigation";

interface ITask {
  status: string;
}

interface ITeam {
  name: string;
  members: any[];
}

interface IProject {
  _id: any;
  title: string;
  description: string;
  status: string;
  tasks: ITask[];
  team?: ITeam;
  deadline?: Date;
}

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect('/login');
  }

  await dbConnect();

  const user = await User.findOne({ email: session.user.email });
  
  if (!user) {
      redirect('/login');
  }

  // Find users teams
  const userTeamIds = user.teams || [];
  
  // Find projects for teams
  const projects = await Project.find({ team: { $in: userTeamIds } })
    .populate('team')
    .sort({ createdAt: -1 });

  // Transform data
  const projectsData = projects.map((project: any) => {
    const p = project as unknown as IProject; // Cast to interface
    // Calculate progress
    const totalTasks = p.tasks ? p.tasks.length : 0;
    const completedTasks = p.tasks ? p.tasks.filter((t: ITask) => t.status === 'Completed').length : 0;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Member count depends on the team
    // If team is populated, use team.members.length, else 0
    const memberCount = p.team && p.team.members ? p.team.members.length : 0;
    
    // Due Date
    const dueDate = p.deadline ? new Date(p.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No Deadline';

    return {
      _id: p._id.toString(),
      title: p.title,
      description: p.description,
      status: p.status, // Planning, InProgress, etc.
      progress: progress,
      members: memberCount,
      dueDate: dueDate,
      deadline: p.deadline ? new Date(p.deadline).toISOString() : undefined
    };
  });

  return <ProjectsClient initialProjects={projectsData} />;
}
