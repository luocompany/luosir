import { NextResponse } from 'next/server';
import { generateContent } from '@/app/services/openai';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('API Route received:', body);

    const result = await generateContent({
      content: body.content,
      originalMail: body.originalMail,
      type: body.type,
      language: body.language,
      mode: body.mode
    });

    return NextResponse.json({ result });
    
  } catch (error: any) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: '请求处理失败' },
      { status: 400 }
    );
  }
} 