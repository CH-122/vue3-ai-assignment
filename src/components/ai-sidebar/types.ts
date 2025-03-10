export interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface AiSidebarConfig {
  apiKey: string // Dify API密钥
  apiUrl?: string // Dify API地址
  defaultPrompt?: string // 默认提示
  placeholder?: string // 输入框提示
  theme?: 'light' | 'dark' // 主题
  position?: 'left' | 'right' // 位置
  width?: number // 宽度
  minWidth?: number // 最小宽度
  maxWidth?: number // 最大宽度
  showCloseButton?: boolean // 是否显示关闭按钮
  showResizeHandle?: boolean // 是否显示可调整大小的手柄
  showScrollToBottom?: boolean // 是否显示滚动到底部的按钮
  showAskQuestion?: boolean // 是否显示提问按钮
}

// 发送消息的参数接口
export interface SendMessageParams {
  conversation_id?: string
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
