const XAI_API_URL = 'https://api.x.ai/v1/chat/completions';

if (!process.env.XAI_API_KEY) {
  throw new Error('Missing XAI_API_KEY environment variable');
}

async function callOpenAI(messages: any[]) {
  try {
    console.log('Starting fetch request to xAI');
    
    const response = await fetch(XAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages,
        temperature: 0.7,
        max_tokens: 1000
      }),
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    console.log('xAI response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content;
    
  } catch (error: any) {
    console.error('Fetch error:', {
      message: error.message,
      cause: error.cause
    });
    throw new Error(`xAI API 调用失败: ${error.message}`);
  }
}

export async function generateMail({ content, type, language }: GenerateMailParams) {
  const messages = [
    {
      role: "system",
      content: `You are a professional email writing assistant. Please respond in ${language}.
        Style: ${type}
        Guidelines:
        - Maintain appropriate tone for ${type} style
        - Ensure clarity and professionalism
        - Follow standard email format`
    },
    {
      role: "user",
      content: `Please help optimize this email content:\n\n${content}`
    }
  ];

  return callOpenAI(messages);
}

export async function generateReply({ originalMail, replyDraft }: GenerateReplyParams) {
  const messages = [
    {
      role: "system",
      content: "你是一位专业的邮件回复助手。请用中文回复。"
    },
    {
      role: "user",
      content: `原始邮件:\n${originalMail}\n\n我的回复草稿:\n${replyDraft}\n\n请帮我优化回复内容，使其更专业得体。`
    }
  ];

  return callOpenAI(messages);
}

interface GenerateMailParams {
  content: string;
  type: string;
  language: string;
}

interface GenerateReplyParams {
  originalMail: string;
  replyDraft: string;
} 