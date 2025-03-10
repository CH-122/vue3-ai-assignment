import {
  defineConfig,
  presetWind,
  presetAttributify,
  presetIcons,
  presetTypography,
} from 'unocss'
import transformerVariantGroup from '@unocss/transformer-variant-group'

export default defineConfig({
  presets: [
    presetWind(), // Tailwind/Windi CSS 兼容预设
    presetAttributify(), // 属性化模式支持
    presetIcons(), // 图标支持
    presetTypography(), // 排版预设
  ],
  transformers: [transformerVariantGroup()],
  // 自定义规则
  rules: [
    // 自定义规则示例
    ['min-h-60px', { 'min-height': '60px' }],
  ],
  // 自定义快捷方式
  shortcuts: {
    // 快捷方式示例
    btn: 'py-2 px-4 font-semibold rd-lg shadow-md',
    'btn-primary': 'text-white bg-blue-500 hover:bg-blue-700',
    'card-hover': 'transition-shadow duration-300 hover:shadow-lg',
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
})
