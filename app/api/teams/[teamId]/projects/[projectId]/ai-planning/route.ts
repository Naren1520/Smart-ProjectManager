import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';
import Team from '@/models/Team';
import User from '@/models/User';
import DirectMessage from '@/models/DirectMessage';
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
    const { message, history, finalize, fileData, approve, proposedTasks, reset } = body;

    await dbConnect();
    
    const team = await Team.findById(teamId).populate('members.user');
    const project = await Project.findById(projectId);
    const leader = await User.findOne({ email: session.user.email });

    if (!team || !project || !leader) {
        return NextResponse.json({ error: 'Project, team, or user not found' }, { status: 404 });
    }

    if (reset) {
        project.tasks = [];
        project.status = 'Planning';
        project.aiAnalysis = {};
        await project.save();
        
        return NextResponse.json({
            reply: "Project workspace has been completely reset. All tasks are cleared, and we are back to the planning phase. How would you like to start planning your new goals?",
            projectUpdated: true,
            updatedProject: project
        });
    }

    if (approve) {
        if (!project.tasks) {
            project.tasks = [];
        }
        project.tasks.push(...proposedTasks);
        project.status = 'InProgress';
        
        let maxDeadline = new Date();
        proposedTasks.forEach((task: any) => {
            if (task.dueDate) {
                const date = new Date(task.dueDate);
                if (date > maxDeadline) maxDeadline = date;
            }
        });
        project.deadline = maxDeadline;
        
        project.aiAnalysis = project.aiAnalysis || {};
        project.aiAnalysis.estimatedTimeline = `Project expected to finish around ${maxDeadline.toDateString()}`;
        
        await project.save();

        // Use Gemini API to send personalized messages to each assigned member with estimated time
        for (const task of proposedTasks) {
            if (task.assignedTo && task.estimatedTime) {
                try {
                    const msgPrompt = `You are an AI assistant helping a project leader. Write a short, friendly direct message (1-2 sentences) to a team member who has just been assigned the task "${task.title}" for the project "${project.title}". Strongly emphasize the required task and explicitly mention the estimated completion time of "${task.estimatedTime}". Do not use markdown formatting or placeholders.`;
                    const personalizedMessage = await generateGeminiResponse(msgPrompt);
                    
                    const newDM = new DirectMessage({
                        sender: leader._id,
                        receiver: task.assignedTo,
                        content: personalizedMessage
                    });
                    await newDM.save();
                } catch(e) {
                    console.error('Failed to send task notification:', e);
                }
            }
        }

        return NextResponse.json({
           reply: "Tasks have been officially assigned and team members have been notified via direct messages!",
           projectUpdated: true,
           updatedProject: project
        });
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
Based on the chat history and any documents provided, your job is to distribute tasks ONLY to the team members listed below, strictly matching their specific skills and roles.
Do not invent any fictional team members or leave tasks unassigned. Also, GUESS the estimated time needed to work on that task based on its complexity.

Available Team Members: ${JSON.stringify(membersData)}

Return your task distribution STRICTLY as a JSON object (no markdown, no backticks, just raw JSON).
Structure:
{
  "reply": "Here are the proposed tasks. Please tick right (approve) to distribute them.",
  "projectUpdated": false,
  "tasks": [
    { 
       "title": "Task Name", 
       "description": "Details", 
       "status": "Pending", 
       "assignedTo": "User ID matching the right skill from the Available Team Members list", 
       "priority": "High/Medium/Low",
       "dueDate": "YYYY-MM-DD",
       "estimatedTime": "e.g., 4 hours, 2 days, 1 week"
    }
  ]
}`;

        const fullPrompt = systemPrompt + "\n\nChat History:\n" + JSON.stringify(history);
        const aiResponse = await generateGeminiResponse(fullPrompt);
        
        try {
            // Strip out markdown if api accidentally returns it
            const cleanedText = aiResponse.replace(/```json/g, '').replace(/```/g, '');
            const parsedData = JSON.parse(cleanedText);

            return NextResponse.json({
               reply: parsedData.reply || "Proposed tasks generated. Please approve to distribute.",
               proposedTasks: parsedData.tasks,
               projectUpdated: false
            });
        } catch(err) {
            console.log(err, aiResponse);
            return NextResponse.json({ error: 'Failed to process AI task distribution. AI returned invalid JSON.' }, { status: 500 });
        }
    } else {
        // Normal interactive chat mode
        const systemPrompt = `You are an AI Product Management Assistant helping a team leader define project requirements.
Read their inputs, clarify doubts, and ask engaging questions. Ask if they want to finalize or make changes. Keep your responses short and friendly like a WhatsApp chat.
Do not distribute tasks yet; wait until they are ready to finalize.
IMPORTANT: You already have the list of team members and their skills provided below. DO NOT ask the user for information about their team's skills, roles, or who is in the team.

Available Team Members: ${JSON.stringify(membersData)}`;
        
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
