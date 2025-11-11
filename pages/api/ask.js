import { deepseek } from '../../lib/deepseek';
import { saveToNotion } from '../../lib/notion';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question } = req.body;

  if (!question || question.trim().length === 0) {
    return res.status(400).json({ error: '问题不能为空' });
  }

  try {
    // 调用DeepSeek生成回答
    const completion = await deepseek.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `你是一个友好的校园学长，专门帮助大学生解决校园生活中的各种问题。
                   基于《大学生存指南》的内容，提供实用、具体的建议。
                   语气要亲切但专业，像有经验的学长学姐在分享经验。
                   如果遇到不知道答案的问题，不要编造，可以建议用户查看指南的具体章节。`
        },
        {
          role: "user",
          content: question
        }
      ],
      max_tokens: 1500,
      temperature: 0.7
    });

    const answer = completion.choices[0].message.content;

    // 保存到Notion数据库
    if (process.env.NOTION_DATABASE_ID) {
      try {
        await saveToNotion(question, answer);
      } catch (notionError) {
        console.error('保存到Notion失败:', notionError);
        // 继续返回回答，不中断流程
      }
    }

    res.status(200).json({ 
      success: true,
      answer: answer
    });
  } catch (error) {
    console.error('AI服务错误:', error);
    res.status(500).json({ 
      success: false,
      error: 'AI服务暂时不可用，请稍后重试。'
    });
  }
}
