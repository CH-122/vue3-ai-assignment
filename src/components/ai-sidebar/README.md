# AI 侧边栏组件

这是一个Vue 3的AI侧边栏组件，包含了所有必要的Element Plus组件和图标，可以在任何Vue 3项目中使用，无需额外安装Element Plus。

## 特性

- 完全自包含，包括所有必要的Element Plus组件和图标
- 支持左侧或右侧显示
- 可调整宽度
- 支持Markdown渲染
- 代码高亮
- 暗色模式支持
- 响应式设计
- 支持自定义参数和事件

## 安装

将整个`ai-sidebar`文件夹复制到你的项目中，然后在你的项目中导入并使用。

## 使用方法

### 全局注册

在你的`main.ts`文件中：

```ts
import { createApp } from 'vue'
import App from './App.vue'
import AiSidebarPlugin from './components/ai-sidebar'

const app = createApp(App)
app.use(AiSidebarPlugin)
app.mount('#app')
```

### 局部使用

在你的组件中：

```vue
<template>
  <div>
    <button @click="showSidebar = true">打开AI助手</button>
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
import { AiSidebar } from './components/ai-sidebar'
import type {
  AiSidebarConfig,
  SendMessageParams,
} from './components/ai-sidebar'

const showSidebar = ref(false)
const aiSidebarRef = ref()

const sidebarConfig: AiSidebarConfig = {
  apiKey: 'your-api-key',
  apiUrl: 'your-api-url',
  position: 'right', // 'left' 或 'right'
  width: 480,
  minWidth: 320,
  maxWidth: 800,
  showCloseButton: true,
  showResizeHandle: true,
  showScrollToBottom: true,
  placeholder: '请输入您的问题...',
  theme: 'light', // 'light' 或 'dark'
}

// 处理题目解析事件
function handleAnalysis() {
  // 自定义题目解析逻辑
  aiSidebarRef.value?.sendMessage({
    content: '请解析当前题目',
    question_type: 'SingleChoice',
    question_title: '<p>你的题目内容</p>',
    question_options: JSON.stringify([
      { id: 'A', content: '<p>选项A</p>' },
      { id: 'B', content: '<p>选项B</p>' },
      { id: 'C', content: '<p>选项C</p>' },
      { id: 'D', content: '<p>选项D</p>' },
    ]),
  })
}

// 处理发送消息事件
function handleSend(params: SendMessageParams) {
  // 自定义发送消息逻辑
  aiSidebarRef.value?.sendMessage({
    content: params.content,
    inputs: {
      // 自定义输入参数
      question_type: 'SingleChoice',
      question_title: '<p>你的题目内容</p>',
      question_options: JSON.stringify([
        { id: 'A', content: '<p>选项A</p>' },
        { id: 'B', content: '<p>选项B</p>' },
        { id: 'C', content: '<p>选项C</p>' },
        { id: 'D', content: '<p>选项D</p>' },
      ]),
      // 其他自定义参数
      custom_param: '自定义值',
    },
  })
}

// 直接调用组件方法
function sendCustomMessage() {
  aiSidebarRef.value?.sendMessage({
    content: '自定义消息',
    query: '自定义查询内容', // 可选，覆盖content作为实际发送的查询内容
    inputs: {
      // 自定义输入参数
      custom_param1: '值1',
      custom_param2: '值2',
    },
  })
}

// 清空对话
function clearChat() {
  aiSidebarRef.value?.clearMessages()
}
</script>
```

### 更多示例

查看 [examples/CustomUsage.vue](./examples/CustomUsage.vue) 文件，了解更多高级用法，包括：

- 如何处理事件
- 如何使用自定义参数
- 如何直接调用组件方法
- 如何在实际应用场景中使用组件

## 配置选项

| 选项               | 类型              | 默认值              | 描述                   |
| ------------------ | ----------------- | ------------------- | ---------------------- |
| apiKey             | string            | ''                  | API密钥                |
| apiUrl             | string            | ''                  | API地址                |
| position           | 'left' \| 'right' | 'right'             | 侧边栏位置             |
| width              | number            | 480                 | 侧边栏宽度             |
| minWidth           | number            | 320                 | 最小宽度               |
| maxWidth           | number            | 800                 | 最大宽度               |
| showCloseButton    | boolean           | true                | 是否显示关闭按钮       |
| showResizeHandle   | boolean           | true                | 是否显示调整大小的把手 |
| showScrollToBottom | boolean           | true                | 是否自动滚动到底部     |
| placeholder        | string            | '请输入您的问题...' | 输入框占位符           |
| theme              | 'light' \| 'dark' | 'light'             | 主题                   |

## 事件

| 事件名   | 参数              | 描述                     |
| -------- | ----------------- | ------------------------ |
| close    | 无                | 当侧边栏关闭时触发       |
| analysis | 无                | 当点击题目解析按钮时触发 |
| send     | SendMessageParams | 当用户发送消息时触发     |

## 暴露的方法

| 方法名        | 参数              | 返回值                  | 描述             |
| ------------- | ----------------- | ----------------------- | ---------------- |
| sendMessage   | SendMessageParams | Promise\<string\|null\> | 发送消息         |
| clearMessages | 无                | void                    | 清空所有对话消息 |
| analysis      | 无                | Promise\<void\>         | 执行题目解析     |

## SendMessageParams 参数说明

| 参数             | 类型                | 必填 | 描述                                 |
| ---------------- | ------------------- | ---- | ------------------------------------ |
| content          | string              | 是   | 消息内容                             |
| query            | string              | 否   | 自定义查询内容，覆盖content          |
| question_type    | string              | 否   | 题目类型                             |
| question_title   | string              | 否   | 题目标题                             |
| question_options | string              | 否   | 题目选项，JSON字符串                 |
| inputs           | Record<string, any> | 否   | 自定义输入参数，优先级高于单独的参数 |

## 事件处理机制

组件使用了智能的事件处理机制：

1. 当用户点击"发送"按钮或"题目解析"按钮时，组件会首先触发相应的事件（`send`或`analysis`）
2. 如果父组件监听了这些事件，则由父组件处理逻辑
3. 如果父组件没有监听这些事件，组件会自动使用默认的处理逻辑

这种机制使组件既可以独立工作，也可以与父组件紧密集成，提供了极大的灵活性。

## 注意事项

- 此组件已包含所有必要的Element Plus组件和图标，无需额外安装Element Plus
- 如果你的项目中已经安装了Element Plus，不会产生冲突
- 组件使用了Tailwind CSS的类名，但不依赖于Tailwind CSS，所有样式都已内联
- 当使用自定义参数时，inputs参数的优先级高于单独的参数
- 组件使用了Vue 3的Composition API，不支持Vue 2
