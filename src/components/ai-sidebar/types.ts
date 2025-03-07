export interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface AiSidebarConfig {
  apiKey: string
  apiUrl?: string
  defaultPrompt?: string
  placeholder?: string
  theme?: 'light' | 'dark'
  position?: 'left' | 'right'
  width?: number
  minWidth?: number
  maxWidth?: number
  showCloseButton?: boolean
  showResizeHandle?: boolean
  showScrollToBottom?: boolean
  showAskQuestion?: boolean
}

// 发送消息的参数接口
export interface SendMessageParams {
  content: string
  question_type?: string
  question_title?: string
  question_options?: string
  inputs?: Record<string, any>
  query?: string
}

// Dify API 响应类型
export interface DifyResponse {
  conversation_id: string
  message_id: string
  created_at: number
  answer: string
  event: 'message' | 'error' | 'ping'
  status?: 'success' | 'error'
  metadata?: {
    usage?: {
      prompt_tokens: number
      completion_tokens: number
      total_tokens: number
    }
  }
}
