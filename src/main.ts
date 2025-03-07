import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

// 导入UnoCSS
import 'uno.css'

// 导入highlight.js样式
import 'highlight.js/styles/github.css'

// 导入Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 创建应用实例
const app = createApp(App)

// 注册所有Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 使用Element Plus
app.use(ElementPlus)

// 挂载应用
app.mount('#app')
