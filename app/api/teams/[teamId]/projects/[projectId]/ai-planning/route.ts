import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';
import Team from '@/models/Team';
import User from '@/models/User';
import { generateGeminiResponse } from '@/lib/gemini';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ teamId: string, projectId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { teamId, projectId } = await params;
    const body = await req.json();
    const { message, history, finalize, fileData } = body;

    await dbConnect();
    
    const team = await Team.findById(teamId).populate('members.user');
    const project = await Project.findById(projectId);

    if (!team || !project) {
        return NextResponse.json({ error: 'Project or team not found' }, { status: 404 });
    }

    // Identify team member skills for distribution
    const membersData = team.members.map((m: any) => ({
      id: m.user._id,
      name: m.user.name,
      role: m.role,
      skills: m.user.skills || []
    }));

    if (finalize) {
        // AI reads history, analyzes requirements, breaking into tasks
        const systemPrompt = `You are an expert technical project manager. A team leader is finalizing project requirements.
Based on the chat history, your job is to distribute tasks matching the available team members' skills.

Team members available: ${JSON.stringify(membersData)}

Return your task distribution strictly as a JSON object (no markdown, no backticks, just raw JSON).
Structure:
{
  "reply": "Summary message to the leader",
  "projectUpdated": true,
  "tasks": [
    { "title": "Task Name", "description": "Details", "status": "Pending", "assignedTo": "User ID matching the right skill", "priority": "High/Medium/Low" }
  ]
}`;

        const fullPrompt = systemPrompt + "\n\nChat History:\n" + JSON.stringify(history);
        const aiResponse = await generateGeminiResponse(fullPrompt);
        
        try {
            // Strip out markdown if api accidentally returns it
            const cleanedText = aiResponse.replace(/```json/g, '').replace(/```/g, '');
            const parsedData = JSON.parse(cleanedText);
            
            project.tasks = parsedData.tasks;
            project.status = 'InProgress';
            await project.save();

            return NextResponse.json({
               reply: parsedData.reply || "Tasks finalized and distributed!",
               projectUpdated: true,
               updatedProject: project
            });
        } catch(err) {
            console.log(err, aiResponse);
            return NextResponse.json({ error: 'Failed to process AI task distribution. AI returned invalid JSON.' }, { status: 500 });
        }
    } else {
        // Normal interactive chat mode
        const systemPrompt = `You are an AI Product Management Assistant helping a team leader define project requirements.
Read their inputs, clarify doubts, and ask engaging questions. Ask if they want to finalize or make changes. Keep your responses short and friendly like a WhatsApp chat.
Do not distribute tasks yet; wait until they are ready to finalize.`;
        
        // build context
        const context = history.map((mh: any) => `${mh.role}: ${mh.content}`).join('\n');
        
        let prompt = systemPrompt + "\n\n" + context + `\nuser: ${message}\nai:`;
        if (fileData) {
            prompt += `\n[User also attached a file: ${fileData.mimeType}]`;
        }
        
        const aiResponse = await generateGeminiResponse(prompt, fileData);

        return NextResponse.json({
            reply: aiResponse,
            projectUpdated: false
        });
    }

  } catch (error) {
    console.error('Error in AI planning:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
