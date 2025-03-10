<template>
  <!-- 侧边栏遮罩 -->
  <!-- <div
    v-show="isExpanded"
    class="fixed inset-0 z-40 transition-opacity duration-300"
    :class="[isExpanded ? 'opacity-100' : 'opacity-0']"
    @click="closeSidebar"
  /> -->

  <!-- 侧边栏 -->
  <div
    class="ai-sidebar fixed flex flex-col transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 z-50 top-0 bottom-0 w-600px"
    :class="[
      config.position === 'right' ? 'right-0' : 'left-0',
      isExpanded
        ? 'translate-x-0'
        : config.position === 'right'
          ? 'translate-x-full'
          : '-translate-x-full',
      'shadow-2xl',
      { 'transition-none': isResizing },
    ]"
    :style="{ width: `${currentWidth}px` }"
  >
    <!-- 标题栏 -->
    <div
      class="flex items-center px-4 h-12 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-indigo-600"
    >
      <div class="flex items-center">
        <el-icon
          class="text-white mr-2 text-base"
          style="width: 1em; height: 1em"
        >
          <ChatRound />
        </el-icon>
        <span class="text-white font-medium">AI 智能助手</span>
      </div>
      <div class="flex items-center ml-auto space-x-2">
        <el-button
          circle
          size="small"
          class="border-0 bg-transparent text-white hover:bg-white hover:text-blue-500 transition-colors"
          style="width: 32px; height: 32px; padding: 8px"
          @click="closeSidebar"
        >
          <el-icon style="width: 1em; height: 1em"><Close /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 消息列表 -->
    <el-scrollbar
      ref="messageListRef"
      class="flex-1 px-4 py-3"
      view-class="space-y-3"
    >
      <template v-if="messages.length">
        <div v-for="(message, index) in messages" :key="index" class="mb-3">
          <div
            :class="[
              'p-3 rd-lg shadow-sm text-sm',
              message.role === 'user'
                ? 'bg-blue-100 dark:bg-blue-900/30 ml-8'
                : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 mr-8',
            ]"
          >
            <!-- 消息内容 -->
            <div
              v-if="message.role === 'assistant'"
              class="prose prose-sm max-w-none text-gray-800 dark:text-gray-200 markdown-body"
              v-html="renderMarkdown(message.content)"
            />
            <div
              v-else
              class="text-gray-800 dark:text-gray-200 whitespace-pre-wrap"
            >
              {{ message.content }}
            </div>

            <!-- 消息操作按钮 -->
            <div
              v-if="message.role === 'assistant'"
              class="flex justify-end mt-1"
            >
              <el-button
                circle
                size="small"
                class="border-0 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                style="width: 32px; height: 32px; padding: 8px"
                @click="copyToClipboard(message.content)"
              >
                <el-icon style="width: 1em; height: 1em"><Document /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </template>
      <div
        v-else
        class="flex flex-col items-center justify-center h-full text-gray-500 py-16"
      >
        <el-empty description="开始对话吧！">
          <template #image>
            <div
              class="w-full flex justify-center items-center w-20 h-20 rd-full bg-blue-50 dark:bg-blue-900/20 mb-4"
            >
              <el-icon style="font-size: 32px !important">
                <ChatRound class="!text-blue-500 dark:!text-blue-400" />
              </el-icon>
            </div>
          </template>
          <template #description>
            <p class="text-gray-500 dark:text-gray-400 mt-2">
              有什么可以帮助您的吗？
            </p>
          </template>
        </el-empty>
      </div>
    </el-scrollbar>

    <!-- 底部操作区 -->
    <div
      class="flex justify-end items-center space-x-3 px-0.75rem"
      :class="{ 'justify-between': config.showAskQuestion }"
    >
      <div class="flex items-center">
        <el-button
          v-if="config.showAskQuestion"
          type="primary"
          plain
          round
          size="small"
          class="text-blue-600 border-blue-500 hover:bg-blue-500 hover:text-white"
          style="
            display: inline-flex;
            align-items: center;
            justify-content: center;
          "
          @click="analysis"
        >
          <el-icon class="mr-1" style="width: 1em; height: 1em"
            ><Document
          /></el-icon>
          题目解析
        </el-button>
        <el-button
          plain
          round
          size="small"
          class="text-gray-600 border-gray-300 hover:border-blue-500 hover:text-blue-500"
          style="
            display: inline-flex;
            align-items: center;
            justify-content: center;
          "
          @click="clearMessages"
        >
          <el-icon class="mr-1" style="width: 1em; height: 1em"
            ><Delete
          /></el-icon>
          清空对话
        </el-button>
      </div>
      <el-checkbox
        v-if="config.showAskQuestion"
        @change="handleAskQuestionChange"
        v-model="isAskQuestion"
        label="是否询问题目相关内容"
      ></el-checkbox>
    </div>

    <!-- 输入框 -->
    <div class="p-3 bg-white dark:bg-gray-800">
      <el-input
        v-model="inputMessage"
        :placeholder="config.placeholder"
        type="textarea"
        :rows="2"
        resize="none"
        class="rd-lg text-sm"
        @keydown.enter.prevent="handleSend"
      >
        <template #append>
          <el-button
            type="primary"
            :loading="isLoading"
            class="h-full bg-gradient-to-r from-blue-500 to-indigo-600 border-0"
            style="
              display: inline-flex;
              align-items: center;
              justify-content: center;
            "
            @click="handleSend"
          >
            <el-icon
              v-if="!isLoading"
              class="text-base"
              style="width: 1em; height: 1em"
              ><Position
            /></el-icon>
            <span v-else class="text-sm">发送中...</span>
          </el-button>
        </template>
      </el-input>
      <div class="text-xs text-gray-400 dark:text-gray-500 text-center mt-2">
        内容由AI模型生成，无法保证准确可靠。
      </div>
    </div>

    <!-- 拖动调整宽度的把手 -->
    <div
      v-if="config.showResizeHandle"
      class="resize-handle"
      :style="{
        [config.position === 'right' ? 'left' : 'right']: '-4px',
        cursor: 'ew-resize',
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: '8px',
        backgroundColor: isResizing ? 'rgba(96, 165, 250, 0.5)' : 'transparent',
        zIndex: 1000,
      }"
      @mousedown="startResize"
    ></div>

    <!-- 拖拽指示线 -->
    <div
      v-if="isResizing"
      class="resize-indicator"
      :style="{
        position: 'fixed',
        top: 0,
        bottom: 0,
        width: '2px',
        backgroundColor: '#3b82f6',
        boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.5)',
        [config.position === 'right' ? 'left' : 'right']:
          config.position === 'right' ? 0 : 'auto',
        [config.position === 'right' ? 'right' : 'left']:
          config.position === 'right' ? 'auto' : 0,
        zIndex: 1001,
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import {
  ElMessage,
  ElScrollbar,
  ElButton,
  ElInput,
  ElIcon,
  ElEmpty,
  Close,
  Position,
  Document,
  ChatRound,
  Delete,
} from './element-plus-components'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import type { AiSidebarConfig, SendMessageParams } from './types'
import { useAiChat } from './composables/useAiChat'

const props = withDefaults(
  defineProps<{
    config: AiSidebarConfig
  }>(),
  {
    config: () => ({
      apiKey: '',
      apiUrl: '',
      position: 'right',
      width: 480,
      minWidth: 320,
      maxWidth: 800,
      showCloseButton: true,
      showResizeHandle: true,
      showScrollToBottom: true,
      placeholder: '请输入您的问题...',
      theme: 'light',
      showAskQuestion: true,
    }),
  }
)

const isAskQuestion = ref(props.config.showAskQuestion || false)

// 定义事件
const emit = defineEmits<{
  close: []
  analysis: [conversation_id: string]
  send: [params: SendMessageParams]
  askQuestion: [isAskQuestion: boolean]
}>()

// 获取当前组件实例，用于检查是否有事件监听器
const instance = getCurrentInstance()

// 检查是否有事件监听器
function hasListener(event: string): boolean {
  return (
    instance?.vnode?.props?.[
      `on${event.charAt(0).toUpperCase() + event.slice(1)}`
    ] !== undefined
  )
}

// 侧边栏状态
const isExpanded = ref(true) // 默认展开
const currentWidth = ref(props.config.width || 480)
const inputMessage = ref('')
const messageListRef = ref()
const isResizing = ref(false)
const { messages, isLoading, conversationId, sendMessage, clearMessages } =
  useAiChat(props.config)

// 监听键盘事件，按ESC关闭侧边栏
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    closeSidebar()
  }
}

// 初始化 markdown 解析器
const md: MarkdownIt = new MarkdownIt({
  highlight: function (str: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs language-${lang}"><code>${hljs.highlight(str, { language: lang }).value}</code></pre>`
      } catch (__) {
        // 忽略错误
      }
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
  },
  html: true,
  linkify: true,
  breaks: true,
  typographer: true,
})

// 发送消息
async function handleSend() {
  if (!inputMessage.value.trim() || isLoading.value) return

  const message = inputMessage.value
  inputMessage.value = ''

  // 触发send事件，让外部组件处理发送逻辑
  const params: SendMessageParams = {
    conversation_id: conversationId.value,
    content: message,
    question_type: '',
    question_title: '',
    question_options: '',
  }
  emit('send', params)

  // 如果没有监听send事件，则使用默认的发送逻辑
  if (!hasListener('send')) {
    throw new Error('请实现send事件')
  }

  // 滚动到底部
  if (props.config.showScrollToBottom) {
    setTimeout(() => {
      if (messageListRef.value) {
        messageListRef.value.setScrollTop(9999)
      }
    }, 100)
  }
}

// 复制到剪贴板
async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage({
      message: '已复制到剪贴板',
      type: 'success',
      offset: 80,
    })
  } catch (err) {
    ElMessage({
      message: '复制失败',
      type: 'error',
      offset: 80,
    })
  }
}

function renderMarkdown(content: string): string {
  return md.render(content)
}

// 关闭侧边栏
function closeSidebar() {
  isExpanded.value = false
  setTimeout(() => {
    emit('close')
  }, 300) // 等待动画完成后触发关闭事件
}

// 拖动调整宽度
let startX = 0
let startWidth = 0

function startResize(e: MouseEvent) {
  // 阻止事件冒泡和默认行为
  e.stopPropagation()
  e.preventDefault()

  isResizing.value = true
  startX = e.clientX
  startWidth = currentWidth.value || 480

  // 使用事件捕获以确保不会丢失鼠标事件
  window.addEventListener('mousemove', handleResize, true)
  window.addEventListener('mouseup', stopResize, true)

  // 添加禁止选择文本的样式
  document.body.classList.add('select-none')
  document.body.style.cursor = 'ew-resize'
}

function handleResize(e: MouseEvent) {
  if (!isResizing.value) return

  // 计算宽度变化
  let dx = 0
  if (props.config.position === 'right') {
    dx = startX - e.clientX
  } else {
    dx = e.clientX - startX
  }

  let newWidth = startWidth + dx

  // 限制最小和最大宽度
  const minWidth = props.config.minWidth || 320
  const maxWidth = props.config.maxWidth || 800
  newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth))

  // 更新宽度
  currentWidth.value = newWidth

  // 阻止事件冒泡和默认行为
  e.stopPropagation()
  e.preventDefault()
}

function stopResize(e: MouseEvent) {
  if (!isResizing.value) return

  isResizing.value = false

  // 移除事件监听器
  window.removeEventListener('mousemove', handleResize, true)
  window.removeEventListener('mouseup', stopResize, true)

  // 移除禁止选择文本的样式
  document.body.classList.remove('select-none')
  document.body.style.cursor = ''

  // 阻止事件冒泡和默认行为
  e.stopPropagation()
  e.preventDefault()
}

async function analysis() {
  console.log('analysis')
  // 触发analysis事件，让外部组件处理解析逻辑
  emit('analysis', conversationId.value)

  // 如果没有监听analysis事件，则使用默认的解析逻辑
  if (!hasListener('analysis')) {
    throw new Error('请实现analysis事件')
  }

  // 滚动到底部
  if (props.config.showScrollToBottom) {
    setTimeout(() => {
      if (messageListRef.value) {
        messageListRef.value.setScrollTop(9999)
      }
    }, 100)
  }
}

function handleAskQuestionChange() {
  console.log('handleAskQuestionChange', isAskQuestion.value)
  emit('askQuestion', isAskQuestion.value)
}

// 暴露方法给父组件
defineExpose({
  sendMessage,
  clearMessages,
  analysis,
})
</script>

<style lang="scss">
.ai-sidebar {
  @apply transition-transform duration-300 shadow-xl;

  .el-scrollbar__wrap {
    @apply overflow-x-hidden;
  }

  .el-textarea__inner {
    @apply text-gray-900 dark:text-gray-100 min-h-60px dark:bg-gray-700 dark:border-gray-600;
  }

  .el-card {
    @apply border overflow-hidden transition-shadow duration-300;
  }

  .el-card__body {
    @apply p-4;
  }

  pre {
    @apply bg-gray-50 dark:bg-gray-800 p-4 rd-lg overflow-x-auto my-3;
  }

  code {
    @apply font-mono text-sm;
  }

  p {
    @apply mb-3 text-gray-800 dark:text-gray-200;
  }

  ul {
    @apply list-disc list-inside mb-3;
  }

  ol {
    @apply list-decimal list-inside mb-3;
  }

  a {
    @apply text-blue-600 dark:text-blue-400 hover:underline;
  }

  blockquote {
    @apply border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-3 text-gray-600 dark:text-gray-400;
  }

  .prose {
    @apply mb-0;
  }

  .prose-sm {
    font-size: 0.875rem;
    line-height: 1.5;

    p {
      @apply mb-2;
    }

    pre {
      @apply p-3 my-2 rd-lg overflow-x-auto;
      background-color: #f8f9fa;
    }

    code {
      @apply font-mono text-xs;
    }

    ul,
    ol {
      @apply mb-2 pl-5;
    }

    blockquote {
      @apply pl-3 my-2 border-l-4 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400;
    }
  }

  .hljs-comment,
  .hljs-quote {
    color: #998;
    font-style: italic;
  }

  /* 代码高亮样式 */
  .hljs {
    display: block;
    overflow-x: auto;
    padding: 0.5em;
    color: #333;
    background: #f8f9fa;
  }

  .hljs-keyword,
  .hljs-selector-tag,
  .hljs-subst {
    color: #d73a49;
    font-weight: bold;
  }

  .hljs-number,
  .hljs-literal,
  .hljs-variable,
  .hljs-template-variable,
  .hljs-tag .hljs-attr {
    color: #005cc5;
  }

  .hljs-string,
  .hljs-doctag {
    color: #032f62;
  }

  .hljs-title,
  .hljs-section,
  .hljs-selector-id {
    color: #6f42c1;
    font-weight: bold;
  }

  .hljs-subst {
    font-weight: normal;
  }

  .hljs-type,
  .hljs-class .hljs-title {
    color: #458;
    font-weight: bold;
  }

  .hljs-tag,
  .hljs-name,
  .hljs-attribute {
    color: #000080;
    font-weight: normal;
  }

  .hljs-regexp,
  .hljs-link {
    color: #009926;
  }

  .hljs-symbol,
  .hljs-bullet {
    color: #990073;
  }

  .hljs-built_in,
  .hljs-builtin-name {
    color: #0086b3;
  }

  .hljs-meta {
    color: #999;
    font-weight: bold;
  }

  .hljs-deletion {
    background: #fdd;
  }

  .hljs-addition {
    background: #dfd;
  }

  .hljs-emphasis {
    font-style: italic;
  }

  .hljs-strong {
    font-weight: bold;
  }

  /* 用户消息样式 */
  .user-message {
    @apply bg-blue-100 dark:bg-blue-900/30;
  }

  /* AI消息样式 */
  .ai-message {
    @apply bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700;
  }
}

/* 新的resize-handle样式 */
.resize-handle {
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(96, 165, 250, 0.3) !important;
  }
}

/* 动画效果 */
.message-enter-active,
.message-leave-active {
  @apply transition-all duration-300 ease-in-out;
}

.message-enter-from,
.message-leave-to {
  @apply opacity-0 transform translate-y-4;
}
</style>
