import { createApp } from 'vue'
import App from './App.vue'
import Vue3AiSidebar, { registerElementPlusComponents } from 'vue3-ai-sidebar'

// 导入样式
import 'vue3-ai-sidebar/dist/vue3-ai-sidebar.css'

const app = createApp(App)

// 方法1：使用插件方式安装（会自动注册所有Element Plus组件）
app.use(Vue3AiSidebar)

// 方法2：手动注册Element Plus组件
// registerElementPlusComponents(app)

// 挂载应用
app.mount('#app')
