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

export async function generateReply({ content, originalMail, type, language }: GenerateReplyParams) {
  const getBilingualPrompt = () => `You are a professional email assistant. 
IMPORTANT: You MUST reply in BOTH English and Chinese as follows:

1. ENGLISH VERSION FIRST:
[English]
(Your English reply here)

2. THEN CHINESE VERSION:
[中文]
(Your Chinese reply here)

Style: ${type}
- Both versions must be complete
- Both versions must maintain the same professional level
- Both versions must be appropriate for business communication
- DO NOT skip either language version`;

  const getMonolingualPrompt = () => `You are a professional email assistant. 
Please reply in ${language} only.
Style: ${type}`;

  const messages = [
    {
      role: "system",
      content: language === 'both English and Chinese' 
        ? getBilingualPrompt()
        : getMonolingualPrompt()
    },
    {
      role: "user",
      content: language === 'both English and Chinese'
        ? `Please optimize my reply in both English and Chinese.
           
Original Email:
${originalMail}

My Draft Reply:
${content}

REMEMBER: 
1. Start with [English] version
2. Then provide [中文] version
3. Include BOTH versions in your response`
        : `Please optimize my reply.

Original Email:
${originalMail}

My Draft Reply:
${content}`
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
  content: string;
  originalMail: string;
  type: string;
  language: string;
} 