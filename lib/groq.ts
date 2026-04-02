import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  console.warn("GROQ_API_KEY is not defined in the environment variables.");
}

const groq = new Groq({ apiKey: apiKey || "" });

export async function generateTasksWithGroq(projectDescription: string, teamMembers: any[]) {
  if (!apiKey) return "API Key missing";

  const prompt = `
    You are an expert Project Manager AI. I have a project described as: "${projectDescription}".
    Here are the team members and their skills:
    ${JSON.stringify(teamMembers)}

    Please break down this project into actionable tasks and assign them to the most suitable team member based on their skills.
    Return a JSON array of objects with the following structure:
    [
      {
        "title": "Task Title",
        "description": "Brief description of the task",
        "assignedTo": "Member Name",
        "priority": "High/Medium/Low",
        "dueDate": "Estimated due date (e.g., '2 days from start')"
      }
    ]
    Do not include any markdown formatting, just the raw JSON array.
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
    });

    return chatCompletion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error thinking:", error);
    return "Error generating tasks";
  }
}

export async function chatWithGroq(message: string, context: string = "") {
  if (!apiKey) return "I'm sorry, I can't help with that right now. Please configure my API key.";
  
  const prompt = `
    You are TeamForge AI, a helpful project management assistant.
    Context: ${context}
    User: ${message}
    Response:
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
    });

    return chatCompletion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error chatting:", error);
    return "I'm having trouble connecting to my brain right now.";
  }
}
