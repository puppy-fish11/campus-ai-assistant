// DeepSeek API配置
export const deepseek = {
  chat: {
    completions: {
      create: async (options) => {
        try {
          const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
              model: "deepseek-chat",
              messages: options.messages,
              max_tokens: options.max_tokens || 2000,
              temperature: options.temperature || 0.7,
              stream: false
            })
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`DeepSeek API错误: ${response.status} - ${errorData.error?.message || '未知错误'}`);
          }
          
          const data = await response.json();
          return data;
        } catch (error) {
          console.error('DeepSeek API调用失败:', error);
          throw error;
        }
      }
    }
  }
};