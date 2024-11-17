import { NextResponse } from 'next/server';

const XAI_API_URL = 'https://api.x.ai/v1/chat/completions';

// 添加邮件相关的类型定义
interface EmailPrompt {
  customerReply?: string;
  contentIdeas: string[];
  companyInfo?: {
    name: string;
    signature?: string;
  };
  language: 'en' | 'zh' | 'both';
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'development') {
    console.log('Environment check:', {
      nodeEnv: process.env.NODE_ENV,
      hasApiKey: !!process.env.XAI_API_KEY,
      apiKeyPrefix: process.env.XAI_API_KEY?.slice(0, 5)
    });
  }

  try {
    const body = await request.json();
    console.log('Proxy request:', {
      body,
      hasApiKey: !!process.env.XAI_API_KEY,
      url: XAI_API_URL
    });

    // 构建更专业的 prompt
    const systemPrompt = {
      role: 'system',
      content: `You are a professional foreign trade email assistant. Guidelines:
        - Maintain formal business tone
        - Include provided company information
        - Address key points from customer replies
        - Ensure clarity and conciseness
        - Provide translations when requested`
    };

    // 修改请求体
    const xaiResponse = await fetch(XAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.XAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [systemPrompt, ...body.messages],
        temperature: 0.7,
        max_tokens: 2000  // 增加 token 限制以支持更长的邮件
      })
    });

    console.log('xAI response status:', xaiResponse.status);
    
    if (!xaiResponse.ok) {
      const error = await xaiResponse.json();
      console.error('xAI Error:', error);
      throw new Error(JSON.stringify(error));
    }

    const data = await xaiResponse.json();
    console.log('xAI success response:', data);
    
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Proxy Error:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    
    return NextResponse.json(
      { error: '生成失败，请稍后重试' },
      { status: 500 }
    );
  }
} 