import { ref } from 'vue'
import type {
  Message,
  AiSidebarConfig,
  DifyResponse,
  SendMessageParams,
} from '../types'

export function useAiChat(config: AiSidebarConfig) {
  const messages = ref<Message[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const conversationId = ref('')

  async function sendMessage(params: SendMessageParams) {
    try {
      isLoading.value = true
      error.value = null

      // 添加用户消息
      messages.value.push({
        role: 'user',
        content: params.content,
        timestamp: Date.now(),
      })

      // 如果有默认提示且是第一条消息，则使用默认提示
      const messageToSend =
        messages.value.length === 1 && config.defaultPrompt
          ? config.defaultPrompt + '\n\n' + params.content
          : params.query || params.content

      // 创建一个临时的AI回复消息，用于流式显示
      const tempAssistantMessage: Message = {
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      }
      messages.value.push(tempAssistantMessage)

      // 调用 Dify API
      const apiUrl = config.apiUrl || 'http://120.46.24.110/v1/chat-messages'

      // 构建请求体
      const requestBody: any = {
        query: messageToSend,
        response_mode: 'streaming', // 使用流式响应
        conversation_id: conversationId.value || '',
        user: 'user',
      }

      // 如果提供了inputs参数，则使用它
      if (params.inputs) {
        requestBody.inputs = params.inputs
      }
      // 否则使用传统的问题参数
      else if (params.question_type && params.question_title) {
        requestBody.inputs = {
          question_type: params.question_type,
          question_title: params.question_title,
          question_options: params.question_options,
          dialogue_type: 'analysis',
        }
      }

      // 使用fetch API进行流式请求
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`)
      }

      if (!response.body) {
        throw new Error('响应体为空')
      }

      // 处理流式响应
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let receivedConversationId: string | null = null
      let fullContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter((line) => line.trim() !== '')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6)) as DifyResponse

              // 保存会话ID
              if (data.conversation_id && !receivedConversationId) {
                receivedConversationId = data.conversation_id
              }

              // 更新消息内容
              if (data.event === 'message') {
                fullContent += data.answer || ''
                tempAssistantMessage.content = fullContent
                // 强制更新视图
                messages.value = [...messages.value]
              }
            } catch (e) {
              console.error('解析流数据失败:', e)
            }
          }
        }
      }

      // 更新会话ID
      if (receivedConversationId) {
        conversationId.value = receivedConversationId
      }

      return fullContent
    } catch (err) {
      console.error('发送消息失败:', err)
      error.value = '发送消息失败，请稍后重试'

      // 如果出错，移除临时消息
      if (
        messages.value.length > 0 &&
        messages.value[messages.value.length - 1].role === 'assistant'
      ) {
        messages.value.pop()
      }

      return null
    } finally {
      isLoading.value = false
    }
  }

  function clearMessages() {
    messages.value = []
    conversationId.value = ''
    error.value = null
  }

  return {
    messages,
    isLoading,
    error,
    conversationId,
    sendMessage,
    clearMessages,
  }
}
