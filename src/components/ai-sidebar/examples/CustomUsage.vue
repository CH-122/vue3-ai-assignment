<template>
  <div class="custom-usage-example">
    <button class="open-button" @click="showSidebar = true">打开AI助手</button>

    <AiSidebar
      v-if="showSidebar"
      :config="sidebarConfig"
      @close="showSidebar = false"
      @analysis="handleAnalysis"
      @send="handleSend"
      ref="aiSidebarRef"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AiSidebar } from '../index'
import type { AiSidebarConfig, SendMessageParams } from '../index'

// 侧边栏显示状态
const showSidebar = ref(false)

// 组件引用，用于调用组件方法
const aiSidebarRef = ref()

// 侧边栏配置
const sidebarConfig: AiSidebarConfig = {
  apiKey: 'your-api-key',
  apiUrl: 'your-api-url',
  position: 'right',
  width: 480,
  minWidth: 320,
  maxWidth: 800,
  showCloseButton: true,
  showResizeHandle: true,
  showScrollToBottom: true,
  placeholder: '请输入您的问题...',
  theme: 'light',
}

// 当前题目数据
const currentQuestion = {
  type: 'SingleChoice',
  title: '<p>Java语言编译器的命令是（&nbsp;&nbsp;&nbsp;&nbsp;）。</p>',
  options: [
    { id: 'A', content: '<p>word.exe</p>' },
    { id: 'B', content: '<p>notepad.exe</p>' },
    { id: 'C', content: '<p>javac.exe</p>' },
    { id: 'D', content: '<p>windows</p>' },
  ],
}

// 处理题目解析事件
function handleAnalysis() {
  console.log('用户点击了题目解析按钮')

  // 调用组件的sendMessage方法发送题目解析请求
  aiSidebarRef.value?.sendMessage({
    content: '请解析当前题目',
    inputs: {
      question_type: currentQuestion.type,
      question_title: currentQuestion.title,
      question_options: JSON.stringify(currentQuestion.options),
      // 可以添加其他自定义参数
      analysis_mode: 'detailed',
      user_level: 'beginner',
    },
  })
}

// 处理发送消息事件
function handleSend(params: SendMessageParams) {
  console.log('用户发送了消息:', params.content)

  // 调用组件的sendMessage方法，添加自定义参数
  aiSidebarRef.value?.sendMessage({
    content: params.content,
    inputs: {
      question_type: currentQuestion.type,
      question_title: currentQuestion.title,
      question_options: JSON.stringify(currentQuestion.options),
      // 可以添加其他自定义参数
      user_context: '用户正在学习Java基础',
      session_id: 'session-123456',
    },
  })
}

// 直接调用组件方法示例
function sendCustomMessage() {
  aiSidebarRef.value?.sendMessage({
    content: '这是一个自定义消息',
    query: '这是实际发送给API的查询内容', // 可选，覆盖content
    inputs: {
      custom_param1: '值1',
      custom_param2: '值2',
    },
  })
}

// 清空对话示例
function clearConversation() {
  aiSidebarRef.value?.clearMessages()
}
</script>

<style scoped>
.custom-usage-example {
  padding: 20px;
}

.open-button {
  padding: 10px 20px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.open-button:hover {
  background-color: #2563eb;
}
</style>
