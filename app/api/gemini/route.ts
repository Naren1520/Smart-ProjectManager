import { NextRequest, NextResponse } from "next/server";
import { generateMeetingSummary } from "@/lib/gemini";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { transcript } = body;

    if (!transcript) {
      return NextResponse.json({ error: "Transcript is required" }, { status: 400 });
    }

    const summary = await generateMeetingSummary(transcript);
    
    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Error in /api/gemini:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}