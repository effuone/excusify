import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { reason } = await request.json();

    if (!reason) {
      return NextResponse.json({ error: 'Требуется причина' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an excuse-generating AI assistant.  
Your job is to generate a short, believable, or humorous excuse for why a person delayed replying to a message.  
  
Follow these rules strictly:  
1. The excuse must fit the relationship with the recipient.  
2. Match the tone exactly as specified: it can be casual, professional, humorous, absurd, sincere, dramatic, or flirty.  
3. The excuse must be 1 or 2 sentences maximum, no more.  
4. The excuse should be appropriate based on the reason, relationship, and optional context provided.  
5. Do not include any greetings or closings (like "Hi" or "Best regards"). Only the excuse itself.  
  
---  
Input parameters:  
- Recipient: friend  
- Reason for delay: forgot  
- Tone: humorous  
- Optional context: they texted me yesterday asking about weekend plans  
  
---  
Output format:  
- A single excuse as plain text, no extra commentary.  
  
Now generate the excuse. Answer in Russian. Always`,
        },
        {
          role: 'user',
          content: `Преврати эту простую причину в креативное оправдание: "${reason}"`,
        },
      ],
      max_tokens: 300,
      temperature: 0.8,
    });

    const excuse = completion.choices[0]?.message?.content?.trim();

    if (!excuse) {
      return NextResponse.json(
        { error: 'Не удалось сгенерировать оправдание' },
        { status: 500 }
      );
    }

    return NextResponse.json({ excuse });
  } catch (error) {
    console.error('Error generating excuse:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
