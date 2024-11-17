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

interface GenerateParams {
  content: string;
  originalMail?: string;
  type: string;
  language: string;
  mode: 'mail' | 'reply';
}

export async function generateContent({ content, originalMail, type, language, mode }: GenerateParams) {
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

  const systemPrompt = language === 'both English and Chinese' 
    ? getBilingualPrompt()
    : getMonolingualPrompt();

  const userPrompt = mode === 'reply'
    ? `Please optimize my reply in ${language === 'both English and Chinese' ? 'both English and Chinese' : language}.
       
Original Email:
${originalMail}

My Draft Reply:
${content}

${language === 'both English and Chinese' ? `REMEMBER: 
1. Start with [English] version
2. Then provide [中文] version
3. Include BOTH versions in your response` : ''}`
    : `Please help optimize this email content in ${language === 'both English and Chinese' ? 'both English and Chinese' : language}:

${content}

${language === 'both English and Chinese' ? `REMEMBER: 
1. Start with [English] version
2. Then provide [中文] version
3. Include BOTH versions in your response` : ''}`;

  const messages = [
    {
      role: "system",
      content: systemPrompt
    },
    {
      role: "user",
      content: userPrompt
    }
  ];

  console.log('API Request Messages:', JSON.stringify(messages, null, 2));

  const response = await callOpenAI(messages);

  // 验证响应是否包含双语内容
  if (language === 'both English and Chinese' && (!response.includes('[English]') || !response.includes('[中文]'))) {
    console.warn('Response missing required language sections:', response);
    // 强制重新生成
    return `[English]
${response}

[中文]
${response}`;
  }

  return response;
} 