import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not defined in the environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateTasks(projectDescription: string, teamMembers: any[]) {
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
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error thinking:", error);
    return "Error generating tasks";
  }
}

export async function analyzeResume(resumeText: string) {
  if (!apiKey) return "API Key missing";

  const prompt = `
    You are an expert HR and Technical Recruiter AI. Please analyze the following resume text and extract the key skills, experience level, and a brief summary.
    
    Resume Text:
    "${resumeText}"

    Return a JSON object with the following structure:
    {
      "summary": "Brief professional summary",
      "skills": ["Skill 1", "Skill 2", ...],
      "experienceLevel": "Junior/Mid-level/Senior",
      "suggestedRoles": ["Role 1", "Role 2"]
    }
    Do not include any markdown formatting, just the raw JSON object.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return "Error analyzing resume";
  }
}

export async function chatWithAI(message: string, context: string = "") {
  if (!apiKey) return "I'm sorry, I can't help with that right now. Please configure my API key.";
  
  const prompt = `
    You are TeamForge AI, a helpful project management assistant.
    Context: ${context}
    User: ${message}
    Response:
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error chatting:", error);
    return "I'm having trouble connecting to my brain right now.";
  }
}
