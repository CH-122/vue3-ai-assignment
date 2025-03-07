import type { App } from 'vue'
import AiSidebar from './AiSidebar.vue'
import {
  registerElementPlusComponents,
  ElButton,
  ElInput,
  ElIcon,
  ElScrollbar,
  ElCard,
  ElEmpty,
  ElMessage,
  Close,
  Position,
  Document,
  ChatRound,
  Delete,
} from './element-plus-components'
import type {
  AiSidebarConfig,
  SendMessageParams,
  Message,
  DifyResponse,
} from './types'

// 导入样式
import '../../style.css'
// 导入UnoCSS样式
import 'uno.css'

// 导出类型
export type { AiSidebarConfig, SendMessageParams, Message, DifyResponse }

// 导出组件
export { AiSidebar }

// 导出Element Plus组件
export {
  ElButton,
  ElInput,
  ElIcon,
  ElScrollbar,
  ElCard,
  ElEmpty,
  ElMessage,
  Close,
  Position,
  Document,
  ChatRound,
  Delete,
}

// 创建一个插件安装函数
export function installAiSidebar(app: App) {
  // 注册Element Plus组件
  registerElementPlusComponents(app)

  // 注册AiSidebar组件
  app.component('AiSidebar', AiSidebar)

  return app
}

// 默认导出
export default {
  install: installAiSidebar,
}
