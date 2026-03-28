import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { chatWithAI } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, history } = await req.json();

    const context = history?.map((msg: any) => `${msg.role}: ${msg.content}`).join('\n') || '';

    const aiResponse = await chatWithAI(message, context);

    return NextResponse.json({ reply: aiResponse });
  } catch (error) {
    console.error('Error in AI Assistant:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
