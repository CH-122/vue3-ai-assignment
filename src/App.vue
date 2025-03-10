<template>
  <div class="min-h-screen bg-gray-100 p-8 box-border">
    <el-card class="max-w-4xl mx-auto">
      <template #header>
        <div class="flex items-center">
          <el-icon class="mr-2 text-blue-500"><ChatRound /></el-icon>
          <h1 class="text-2xl font-bold text-gray-800">Vue3 AI 侧边栏助手</h1>
        </div>
      </template>

      <div class="py-4">
        <p class="mb-6 text-gray-600">
          这是一个基于 Vue3 + Element Plus 的 AI 侧边栏助手组件，支持 Dify API
          接入。点击右下角悬浮按钮体验 AI 对话功能。
        </p>
      </div>
    </el-card>

    <!-- 悬浮按钮 -->
    <div v-if="!showSidebar" class="fixed right-8 bottom-8 z-40">
      <div
        class="absolute inset-0 rounded-full bg-blue-400 opacity-30 pulse-animation"
      ></div>
      <el-button
        class="relative cursor-pointer shadow-xl rd-full w-16 h-16 p-0 border-0 bg-gradient-to-r from-blue-500 to-indigo-600 hover:(shadow-blue-200 shadow-2xl scale-110) transition-all duration-300 transform"
        @click="openSidebar"
      >
        <el-icon class="text-white text-2xl">
          <ChatRound />
        </el-icon>
      </el-button>
    </div>

    <!-- 使用v-if控制侧边栏显示 -->
    <AiSidebar
      v-if="showSidebar"
      :config="aiConfig"
      @close="showSidebar = false"
      ref="aiSidebarRef"
      @send="handleSend"
      @askQuestion="handleAskQuestion"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AiSidebar } from './components/ai-sidebar'
import type {
  AiSidebarConfig,
  SendMessageParams,
} from './components/ai-sidebar'

// 控制侧边栏显示状态
const showSidebar = ref(false)

const aiConfig: AiSidebarConfig = {
  apiKey: import.meta.env.VITE_API_KEY, // 替换为您的Dify API密钥
  apiUrl: import.meta.env.VITE_API_URL, // Dify API地址
  position: 'right',
  theme: 'light',
  showAskQuestion: true,
  showResizeHandle: true,
  placeholder: '请输入您的问题...',
}

// 打开侧边栏
function openSidebar() {
  showSidebar.value = true
}

const aiSidebarRef = ref<InstanceType<typeof AiSidebar>>()

// 处理发送消息事件
function handleSend(params: SendMessageParams) {
  console.log('用户发送了消息:', params)

  // 调用组件的sendMessage方法，添加自定义参数
  aiSidebarRef.value?.sendMessage({
    content: params.content,
    inputs: {},
  })
}

function handleAskQuestion(isAskQuestion: boolean) {
  console.log('用户是否询问题目相关内容:', isAskQuestion)
}
</script>

<style scoped>
:deep(.el-card__header) {
  @apply bg-gradient-to-r from-blue-50 to-blue-100 py-4;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    opacity: 0.5;
  }
  70% {
    transform: scale(1.2);
    opacity: 0.25;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.5;
  }
}

.pulse-animation {
  animation: pulse 2s infinite;
}
</style>
