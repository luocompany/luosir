import { NextResponse } from 'next/server';
import { generateMail, generateReply } from '@/app/services/openai';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('API Route received:', {
      mode: body.mode,
      type: body.type,
      contentLength: body.content?.length
    });

    const { content, type, mode, originalMail, replyDraft } = body;
    
    let result;
    try {
      if (mode === 'mail') {
        result = await generateMail({ 
          content, 
          type,
          language: body.language
        });
      } else {
        result = await generateReply({ originalMail, replyDraft });
      }
    } catch (error: any) {
      console.error('Generation error details:', {
        message: error.message,
        cause: error.cause,
        stack: error.stack
      });
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ result });
    
  } catch (error: any) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: '请求处理失败' },
      { status: 400 }
    );
  }
} 