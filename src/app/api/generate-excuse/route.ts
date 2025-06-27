import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { reason } = await request.json();

    if (!reason) {
      return NextResponse.json(
        { error: 'Reason is required' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an expert at creating creative, humorous, and believable excuses. Given a simple reason, transform it into a more elaborate, funny, and convincing excuse for why someone hasn't responded to a message. Make it creative but not too outrageous. Keep it under 200 words and make it entertaining.`,
        },
        {
          role: 'user',
          content: `Transform this simple reason into a creative excuse: "${reason}"`,
        },
      ],
      max_tokens: 300,
      temperature: 0.8,
    });

    const excuse = completion.choices[0]?.message?.content?.trim();

    if (!excuse) {
      return NextResponse.json(
        { error: 'Failed to generate excuse' },
        { status: 500 }
      );
    }

    return NextResponse.json({ excuse });
  } catch (error) {
    console.error('Error generating excuse:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
