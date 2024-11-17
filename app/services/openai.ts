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
[Subject]
(Generate an appropriate subject line for this email)

[English]
(Your English reply here)

2. THEN CHINESE VERSION:
[主题]
(为这封邮件生成合适的主题)

[中文]
(Your Chinese reply here)

Style: ${type}
- Both versions must be complete and include subject lines
- Both versions must maintain the same professional level
- Both versions must be appropriate for business communication
- DO NOT skip either language version or subject lines`;

  const getMonolingualPrompt = () => `You are a professional email assistant. 
Please reply in ${language} only.
${language === 'English' ? 
  'Start with [Subject] line before the email content.' : 
  '请在邮件内容前添加[主题]行。'}
Style: ${type}`;

  const systemPrompt = language === 'both English and Chinese' 
    ? getBilingualPrompt()
    : getMonolingualPrompt();

  const userPrompt = mode === 'reply'
    ? `Please optimize my reply and generate appropriate subject line(s).
       
Original Email:
${originalMail}

My Draft Reply:
${content}

${language === 'both English and Chinese' ? `REMEMBER: 
1. Start with [Subject] and [English] version
2. Then provide [主题] and [中文] version
3. Include BOTH versions with their subject lines` : 
  language === 'English' ? 
  'Start with [Subject] line before the content.' :
  '请在内容前添加[主题]行。'}
`
    : `Please help optimize this email content and generate appropriate subject line(s):

${content}

${language === 'both English and Chinese' ? `REMEMBER: 
1. Start with [Subject] and [English] version
2. Then provide [主题] and [中文] version
3. Include BOTH versions with their subject lines` :
  language === 'English' ? 
  'Start with [Subject] line before the content.' :
  '请在内容前添加[主题]行。'}`;

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

  // 验证响应是否包含必要的部分
  if (language === 'both English and Chinese') {
    if (!response.includes('[Subject]') || !response.includes('[主题]') || 
        !response.includes('[English]') || !response.includes('[中文]')) {
      console.warn('Response missing required sections:', response);
      // 强制添加缺失的标签
      return `[Subject]
Re: ${content.substring(0, 50)}...

[English]
${response}

[主题]
回复：${content.substring(0, 50)}...

[中文]
${response}`;
    }
  } else {
    const subjectTag = language === 'English' ? '[Subject]' : '[主题]';
    if (!response.includes(subjectTag)) {
      console.warn('Response missing subject line:', response);
      // 强制添加主题行
      return `${subjectTag}
${language === 'English' ? 'Re: ' : '回复：'}${content.substring(0, 50)}...

${response}`;
    }
  }

  return response;
} 