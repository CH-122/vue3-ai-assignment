import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import UnoCSS from 'unocss/vite'
import {
  presetAttributify,
  presetIcons,
  presetTypography,
  transformerDirectives,
} from 'unocss'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 8099,
  },
  envDir: './env',
  plugins: [
    vue(),
    UnoCSS({
      presets: [
        presetAttributify(), // 属性化模式支持
        presetIcons(), // 图标支持
        presetTypography(), // 排版预设
      ],
      transformers: [
        transformerDirectives(), // 启用 @apply 指令支持
      ],
      // 自定义规则
      rules: [
        // 自定义规则示例
      ],
      // 自定义快捷方式
      shortcuts: {
        // 快捷方式示例
        btn: 'py-2 px-4 font-semibold rounded-lg shadow-md',
        'btn-primary': 'text-white bg-blue-500 hover:bg-blue-700',
      },
      // 主题配置
      theme: {
        colors: {
          primary: {
            DEFAULT: '#409EFF',
            light: '#79BBFF',
            dark: '#337ECC',
          },
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@use "@/styles/variables.scss" as *;`,
      },
    },
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    lib: {
      entry: resolve(__dirname, 'src/components/ai-sidebar/index.ts'),
      name: 'Vue3AiSidebar',
      fileName: (format) => `vue3-ai-sidebar.${format}.js`,
    },
    rollupOptions: {
      // 只将Vue设为外部依赖，其他依赖打包进组件库
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
        },
        // 确保CSS被正确注入
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'vue3-ai-sidebar.css'
          }
          return assetInfo.name || ''
        },
        // 使用命名导出
        exports: 'named',
        // 确保UnoCSS样式被包含
        inlineDynamicImports: false,
      },
    },
    // 确保CSS被提取到单独的文件
    cssCodeSplit: false,
    // 生成 sourcemap
    sourcemap: true,
    // 确保所有依赖被正确打包
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
})
