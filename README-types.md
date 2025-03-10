# Vue3 AI Sidebar 类型声明文件

本项目在打包时会自动生成TypeScript类型声明文件，存放在`dist/types`目录中。这些类型声明文件可以帮助开发者在使用本组件库时获得更好的类型提示和类型检查。

## 类型声明文件的位置

类型声明文件位于以下位置：

```
dist/
└── types/
    └── components/
        └── ai-sidebar/
            ├── index.d.ts         # 主入口类型声明文件
            ├── AiSidebar.vue.d.ts # 组件类型声明文件
            ├── types.d.ts         # 类型定义声明文件
            └── ...                # 其他相关类型声明文件
```

## 如何使用类型声明文件

当你安装并导入`vue3-ai-sidebar`组件库时，TypeScript会自动识别并使用这些类型声明文件，为你提供类型提示和类型检查。

### 示例

```typescript
import { AiSidebar, type AiSidebarConfig } from 'vue3-ai-sidebar'

// 类型提示和类型检查
const config: AiSidebarConfig = {
  apiKey: 'your-api-key',
  theme: 'light', // 自动提示可选值: 'light' | 'dark'
  position: 'right', // 自动提示可选值: 'left' | 'right'
  width: 400,
  // ...其他配置
}
```

## 可用的类型定义

本组件库导出了以下类型定义：

- `AiSidebarConfig`: AI侧边栏配置选项
- `Message`: 消息对象类型
- `SendMessageParams`: 发送消息的参数类型
- `DifyResponse`: Dify API响应类型

## 手动生成类型声明文件

如果你需要手动生成类型声明文件，可以运行以下命令：

```bash
npm run generate-types
# 或
yarn generate-types
# 或
pnpm generate-types
```

这将在`dist/types`目录中生成最新的类型声明文件。

## 注意事项

- 类型声明文件仅在使用TypeScript项目中才能提供类型提示和类型检查
- 确保你的项目中的TypeScript版本与本组件库兼容
- 如果你在使用类型声明文件时遇到问题，请确保你已经安装了最新版本的组件库
