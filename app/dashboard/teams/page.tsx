import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Team from "@/models/Team";
import { redirect } from "next/navigation";
import TeamsClient from "./TeamsClient";

// Force model registration to prevent tree-shaking
const _TeamModel = Team;

export default async function TeamsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect('/login');
  }

  await dbConnect();

  const user = await User.findOne({ email: session.user.email }).populate('teams');
  
  if (!user) {
      redirect('/login');
  }

  const teams = user.teams || [];

  // Important: Serialize POJOs if they are Mongoose documents to prevent serialization errors
  const serializedTeams = teams.map((team: any) => ({
      _id: team._id.toString(),
      name: team.name,
      description: team.description,
      members: team.members.map((m: any) => ({
          role: m.role || 'Member'
      })) || []
  }));

  return <TeamsClient teams={serializedTeams} />;
}