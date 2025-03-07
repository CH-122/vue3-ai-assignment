// 导入Element Plus及其图标
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 导入常用的Element Plus组件
import {
  ElButton,
  ElInput,
  ElIcon,
  ElScrollbar,
  ElCard,
  ElEmpty,
  ElMessage,
  ElMessageBox,
  ElLoading,
  ElNotification,
} from 'element-plus'

// 导入特定的图标
import {
  Close,
  Position,
  Document,
  ChatRound,
  Delete,
} from '@element-plus/icons-vue'

// 导入样式
import 'element-plus/dist/index.css'
import 'highlight.js/styles/github.css'

// 导出Element Plus和图标
export { ElementPlus, ElementPlusIconsVue }

// 导出常用Element Plus组件
export {
  ElButton,
  ElInput,
  ElIcon,
  ElScrollbar,
  ElCard,
  ElEmpty,
  ElMessage,
  ElMessageBox,
  ElLoading,
  ElNotification,
}

// 导出特定图标
export { Close, Position, Document, ChatRound, Delete }

// 创建一个包含所有组件的对象，方便批量注册
export const ElementPlusComponents = {
  ElButton,
  ElInput,
  ElIcon,
  ElScrollbar,
  ElCard,
  ElEmpty,
  ElMessage,
  ElMessageBox,
  ElLoading,
  ElNotification,
}

// 创建一个包含所有图标的对象
export const ElementPlusIcons = {
  Close,
  Position,
  Document,
  ChatRound,
  Delete,
}

// 创建一个注册函数
export function registerElementPlusComponents(app: any) {
  // 注册Element Plus
  app.use(ElementPlus)

  // 注册常用组件
  Object.entries(ElementPlusComponents).forEach(([name, component]) => {
    app.component(name, component)
  })

  // 注册所有图标
  for (const [key, component] of Object.entries(ElementPlusIcons)) {
    app.component(key, component)
  }
}

// 创建一个独立的组件库，不依赖于全局注册
export const createElementPlusBundle = () => {
  return {
    components: ElementPlusComponents,
    icons: ElementPlusIcons,
    message: ElMessage,
    messageBox: ElMessageBox,
    loading: ElLoading,
    notification: ElNotification,
  }
}
