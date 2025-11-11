import { Client } from '@notionhq/client'

// 创建Notion客户端
export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

// 保存问答记录到Notion数据库
export async function saveToNotion(question, answer) {
  try {
    const response = await notion.pages.create({
      parent: { 
        database_id: process.env.NOTION_DATABASE_ID 
      },
      properties: {
        '问题': {
          title: [
            {
              text: {
                content: question.length > 200 ? question.substring(0, 197) + '...' : question
              }
            }
          ]
        },
        '状态': {
          select: { name: '已回答' }
        },
        '分类': {
          select: { name: 'AI回答' }
        }
      },
      children: [
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: { content: answer }
              }
            ]
          }
        }
      ]
    })
    return response
  } catch (error) {
    console.error('保存到Notion失败:', error)
    throw error
  }
}
