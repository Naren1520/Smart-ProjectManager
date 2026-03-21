import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Team from "@/models/Team";
import Document from "@/models/Document";
import DocsClient from "./DocsClient";
import { redirect } from "next/navigation";

export default async function DocsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect('/login');
  }

  await dbConnect();

  const user = await User.findOne({ email: session.user.email });
  
  if (!user) {
      redirect('/login');
  }

  const userTeamIds = user.teams || [];
  
  // Fetch teams for selector
  const teams = await Team.find({ _id: { $in: userTeamIds } }).select('_id name');

  // Fetch docs for user's teams
  const docs = await Document.find({ team: { $in: userTeamIds } })
    .populate('author', 'name')
    .sort({ updatedAt: -1 });

  const docsData = docs.map((doc: any) => ({
    _id: doc._id.toString(),
    title: doc.title,
    type: doc.type,
    category: doc.category,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toLocaleDateString() : 'Just now',
    author: doc.author ? { _id: (doc.author as any)._id.toString(), name: (doc.author as any).name } : { _id: '', name: 'Unknown' },
  }));

  const teamsData = teams.map((team: any) => ({
    _id: team._id.toString(),
    name: team.name
  }));

  return <DocsClient initialDocs={docsData} teams={teamsData} />;
}
