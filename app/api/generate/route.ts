import { NextResponse } from 'next/server';
import { generateMail, generateReply } from '@/app/services/openai';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('API Route received:', body);

    let result;
    if (body.mode === 'mail') {
      result = await generateMail({ 
        content: body.content, 
        type: body.type,
        language: body.language
      });
    } else {
      result = await generateReply({ 
        content: body.content,         // 回复草稿
        originalMail: body.originalMail, // 原始邮件
        type: body.type,              // 回复风格
        language: body.language       // 语言选择
      });
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