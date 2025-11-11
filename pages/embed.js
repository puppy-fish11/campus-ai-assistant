import { useState } from 'react'

export default function EmbedAI() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!question.trim()) return
    
    setLoading(true)
    setError('')
    setAnswer('')
    
    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: question.trim() }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setAnswer(data.answer)
      } else {
        setError(data.error || '请求失败，请重试')
      }
    } catch (error) {
      setError('网络错误，请检查连接后重试')
    }
    
    setLoading(false)
  }

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#1890ff' }}>🎓 校园AI助手</h3>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          基于《大学生存指南》的智能问答
        </p>
      </div>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="输入你的校园生活问题，比如：如何申请奖学金？哪个食堂好吃？..."
          disabled={loading}
          style={{
            width: '100%',
            height: '80px',
            padding: '12px',
            marginBottom: '12px',
            border: '1px solid #d9d9d9',
            borderRadius: '6px',
            resize: 'vertical',
            fontFamily: 'inherit',
            fontSize: '14px'
          }}
        />
        <button 
          type="submit"
          disabled={loading || !question.trim()}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading ? '#ccc' : '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '500'
          }}
        >
          {loading ? '🤔 AI思考中...' : '📤 提问'}
        </button>
      </form>
      
      {error && (
        <div style={{
          padding: '12px',
          backgroundColor: '#fff2f0',
          border: '1px solid #ffccc7',
          borderRadius: '6px',
          marginBottom: '16px',
          color: '#a8071a'
        }}>
          ⚠️ {error}
        </div>
      )}
      
      {answer && (
        <div style={{
          padding: '16px',
          backgroundColor: '#f6ffed',
          border: '1px solid #b7eb8f',
          borderRadius: '6px',
          borderLeft: '4px solid '#52c41a'
        }}>
          <div style={{ 
            fontWeight: '600', 
            marginBottom: '8px',
            color: '#389e0d'
          }}>
            💡 回答：
          </div>
          <div style={{ 
            whiteSpace: 'pre-wrap',
            lineHeight: '1.6',
            fontSize: '14px'
          }}>
            {answer}
          </div>
        </div>
      )}
      
      <div style={{ 
        marginTop: '20px', 
        padding: '12px',
        backgroundColor: '#f0f8ff',
        borderRadius: '6px',
        fontSize: '12px',
        color: '#666',
        textAlign: 'center'
      }}>
        💡 提示：可以询问学习、生活、就业、娱乐等校园相关问题
      </div>
    </div>
  )
}
