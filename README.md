# Vue3 AI 侧边栏助手

一个基于 Vue3 + Element Plus 的 AI 侧边栏助手组件，可以轻松集成到任何 Vue3 项目中，支持 Dify API 接入。

## 特性

- 🎨 优雅的 UI 设计，支持亮色/暗色主题
- 📱 响应式设计，支持移动端
- ✨ 可拖拽调整宽度
- 🔥 支持 Markdown 渲染
- 💻 代码高亮显示
- 🔄 历史消息记录
- 🎯 TypeScript 支持
- 🛠 高度可配置
- 📦 内置 Element Plus 和 UnoCSS，无需额外引入

## 安装

```bash
# NPM
npm install vue3-ai-sidebar

# PNPM
pnpm add vue3-ai-sidebar

# Yarn
yarn add vue3-ai-sidebar
```

## 快速开始

1. 在你的项目中引入组件：

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { AiSidebar } from 'vue3-ai-sidebar'
import 'vue3-ai-sidebar/dist/vue3-ai-sidebar.css'

const app = createApp(App)
// 注册组件库，这将自动注册所有Element Plus组件
app.use(AiSidebar)
app.mount('#app')
```

2. 在你的组件中使用：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { AiSidebarConfig } from 'vue3-ai-sidebar'

const showSidebar = ref(false)

const aiConfig: AiSidebarConfig = {
  apiKey: 'your-dify-api-key', // 替换为你的 Dify API 密钥
  apiUrl: 'your-dify-api-url', // 替换为你的 Dify API 地址
  position: 'right', // 侧边栏位置：'left' 或 'right'
  theme: 'light', // 主题：'light' 或 'dark'
}
</script>

<template>
  <!-- 使用Element Plus按钮 -->
  <el-button type="primary" @click="showSidebar = true">
    打开 AI 助手
  </el-button>

  <AiSidebar
    v-if="showSidebar"
    :config="aiConfig"
    @close="showSidebar = false"
  />
</template>
```

## 配置选项

| 参数               | 类型              | 默认值              | 说明                  |
| ------------------ | ----------------- | ------------------- | --------------------- |
| apiKey             | string            | -                   | Dify API 密钥（必填） |
| apiUrl             | string            | -                   | Dify API 地址（必填） |
| position           | 'left' \| 'right' | 'right'             | 侧边栏位置            |
| theme              | 'light' \| 'dark' | 'light'             | 主题模式              |
| width              | number            | 320                 | 侧边栏宽度            |
| minWidth           | number            | 280                 | 最小宽度              |
| maxWidth           | number            | 600                 | 最大宽度              |
| showCloseButton    | boolean           | true                | 是否显示关闭按钮      |
| showResizeHandle   | boolean           | true                | 是否显示宽度调整把手  |
| showScrollToBottom | boolean           | true                | 是否自动滚动到底部    |
| placeholder        | string            | '请输入您的问题...' | 输入框占位文本        |
| defaultPrompt      | string            | -                   | 默认提示语            |

## 事件

| 事件名 | 说明             |
| ------ | ---------------- |
| close  | 关闭侧边栏时触发 |

## Dify API 集成

1. 在 [Dify](https://dify.ai) 创建你的应用
2. 获取 API 密钥和接口地址
3. 在组件配置中填入相应的 `apiKey` 和 `apiUrl`

## 注意事项

- **组件已内置 Element Plus 和 UnoCSS**，无需在项目中额外引入 Element Plus
- **必须在 main.ts 中使用 `app.use(AiSidebar)` 注册组件库**，这将自动注册所有 Element Plus 组件
- **必须引入样式文件 `import 'vue3-ai-sidebar/dist/vue3-ai-sidebar.css'`**，否则组件将无法正常显示
- 如果你的项目中已经使用了 Element Plus，可能会出现版本冲突，请确保版本兼容
- 组件使用了 UnoCSS 的 Tailwind 预设，如果你的项目中也使用了 Tailwind CSS，请注意类名冲突

## 常见问题

### 组件样式显示不正确

如果你发现组件样式显示不正确，请检查以下几点：

1. 确保已引入样式文件：`import 'vue3-ai-sidebar/dist/vue3-ai-sidebar.css'`
2. 确保已注册组件库：`app.use(AiSidebar)`
3. 如果使用的是 Vite，确保 CSS 预处理器配置正确

### Element Plus 组件未注册或样式异常

如果你看到 "Failed to resolve component: el-icon" 等错误，或者按钮、图标样式异常，请确保：

1. 已在 main.ts 中使用 `app.use(AiSidebar)` 注册组件库
2. 如果按钮或图标宽度/高度不正确，可以尝试在你的全局样式中添加以下代码：

```css
/* 修复 Element Plus 组件样式 */
.el-button.is-circle {
  padding: 12px !important;
  width: auto !important;
  height: auto !important;
}

.el-button.el-button--small.is-circle {
  padding: 8px !important;
  width: 32px !important;
  height: 32px !important;
}

.el-icon {
  width: 1em !important;
  height: 1em !important;
  vertical-align: -0.15em !important;
}
```

### Element Plus 组件无法显示

如果 Element Plus 组件（如 el-button、el-icon 等）无法正确显示，请尝试以下解决方案：

1. 确保在 main.ts 中正确注册组件库：

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { AiSidebar } from 'vue3-ai-sidebar'
import 'vue3-ai-sidebar/dist/vue3-ai-sidebar.css'

const app = createApp(App)
app.use(AiSidebar) // 这将注册所有 Element Plus 组件
app.mount('#app')
```

2. 如果仍然无法显示，可以尝试在组件中手动导入并使用 Element Plus 组件：

```vue
<script setup>
// 从组件库中导入 Element Plus 组件
import { ElButton, ElIcon } from 'vue3-ai-sidebar'
import { ref } from 'vue'
import { AiSidebar } from 'vue3-ai-sidebar'
import type { AiSidebarConfig } from 'vue3-ai-sidebar'
import 'vue3-ai-sidebar/dist/vue3-ai-sidebar.css'

// 组件逻辑
const showSidebar = ref(false)

const aiConfig = {
  apiKey: 'your-dify-api-key',
  apiUrl: 'your-dify-api-url',
  position: 'right',
  theme: 'light',
}
</script>

<template>
  <!-- 使用导入的 Element Plus 组件 -->
  <ElButton type="primary" @click="showSidebar = true"> 打开 AI 助手 </ElButton>

  <AiSidebar
    v-if="showSidebar"
    :config="aiConfig"
    @close="showSidebar = false"
  />
</template>
```

3. 如果你使用的是 Vue 3.3 以上版本，可以使用 `defineOptions` 来注册组件：

```vue
<script setup>
import { ref } from 'vue'
import { AiSidebar, ElButton, ElIcon } from 'vue3-ai-sidebar'
import type { AiSidebarConfig } from 'vue3-ai-sidebar'
import 'vue3-ai-sidebar/dist/vue3-ai-sidebar.css'

// 注册组件
defineOptions({
  components: {
    ElButton,
    ElIcon,
    AiSidebar
  }
})

const showSidebar = ref(false)

const aiConfig = {
  apiKey: 'your-dify-api-key',
  apiUrl: 'your-dify-api-url',
  position: 'right',
  theme: 'light',
}
</script>
```

### 版本冲突问题

如果你的项目中已经使用了 Element Plus，可能会出现版本冲突。解决方法：

1. 确保你的项目中使用的 Element Plus 版本与组件库兼容（推荐 2.3.x 或更高版本）
2. 如果出现冲突，可以尝试在你的项目中显式指定 Element Plus 版本：

```bash
npm install element-plus@2.3.8 --save-exact
```

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 许可证

[MIT](LICENSE)
