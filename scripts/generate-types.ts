/**
 * 生成TypeScript类型声明文件的脚本
 * 此脚本在构建过程中运行，确保类型声明文件正确生成并放置在dist/types目录中
 */
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

// 定义类型
interface TypesConfig {
  rootDir: string
  typesDir: string
  aiSidebarDir: string
  componentsDir: string
}

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 初始化配置
const config: TypesConfig = {
  rootDir: path.resolve(__dirname, '..'),
  typesDir: '',
  aiSidebarDir: '',
  componentsDir: '',
}

// 设置目录路径
config.typesDir = path.resolve(config.rootDir, 'dist/types')
config.componentsDir = path.resolve(config.typesDir, 'components')
config.aiSidebarDir = path.resolve(config.typesDir, 'components/ai-sidebar')

// 确保dist/types目录存在
fs.ensureDirSync(config.typesDir)

console.log('📦 开始生成TypeScript类型声明文件...')

/**
 * 生成主入口类型文件
 */
function generateMainIndexDts(): void {
  const indexContent = `import AiSidebar from './components/ai-sidebar/AiSidebar.vue';
import type { AiSidebarConfig, SendMessageParams, Message, DifyResponse } from './components/ai-sidebar/types';
import { installAiSidebar } from './components/ai-sidebar/index';

export { AiSidebar, installAiSidebar };
export type { AiSidebarConfig, SendMessageParams, Message, DifyResponse };

declare const _default: {
    install: typeof installAiSidebar;
};
export default _default;
`
  fs.writeFileSync(path.resolve(config.typesDir, 'index.d.ts'), indexContent)
  console.log('✅ 手动创建了主入口类型文件 index.d.ts')
}

/**
 * 复制类型定义文件
 */
function copyTypesFile(): void {
  const srcTypesPath = path.resolve(
    config.rootDir,
    'src/components/ai-sidebar/types.ts'
  )
  const destTypesPath = path.resolve(config.aiSidebarDir, 'types.d.ts')

  if (fs.existsSync(srcTypesPath)) {
    const typesContent = fs.readFileSync(srcTypesPath, 'utf-8')
    fs.writeFileSync(destTypesPath, typesContent)
    console.log('✅ 复制了types.ts到types.d.ts')
  } else {
    console.warn('⚠️ 源类型文件不存在:', srcTypesPath)
  }
}

/**
 * 创建组件类型声明文件
 */
function createComponentDts(): void {
  // 创建AiSidebar.vue.d.ts
  const aiSidebarDtsContent = `import { DefineComponent } from 'vue';
import type { AiSidebarConfig } from './types';

declare const AiSidebar: DefineComponent<{
  config: AiSidebarConfig;
}>;

export default AiSidebar;
`
  fs.writeFileSync(
    path.resolve(config.aiSidebarDir, 'AiSidebar.vue.d.ts'),
    aiSidebarDtsContent
  )
  console.log('✅ 创建了AiSidebar.vue.d.ts')

  // 创建index.d.ts
  const aiSidebarIndexContent = `import { App } from 'vue';
import AiSidebar from './AiSidebar.vue';
import type { AiSidebarConfig, SendMessageParams, Message, DifyResponse } from './types';

export { AiSidebar };
export type { AiSidebarConfig, SendMessageParams, Message, DifyResponse };

export function installAiSidebar(app: App): App;

declare const _default: {
    install: typeof installAiSidebar;
};
export default _default;
`
  fs.writeFileSync(
    path.resolve(config.aiSidebarDir, 'index.d.ts'),
    aiSidebarIndexContent
  )
  console.log('✅ 创建了组件index.d.ts')
}

/**
 * 主函数：生成类型声明文件
 */
async function generateTypes(): Promise<void> {
  try {
    // 运行TypeScript编译器生成类型声明文件
    execSync(
      'vue-tsc --declaration --emitDeclarationOnly --outDir dist/types',
      {
        cwd: config.rootDir,
        stdio: 'inherit',
      }
    )

    console.log('✅ TypeScript类型声明文件生成成功！')

    // 检查dist/types目录是否存在文件
    if (fs.existsSync(config.typesDir)) {
      const files = fs.readdirSync(config.typesDir)
      console.log(`📄 dist/types目录中的文件: ${files.join(', ')}`)

      // 确保组件目录结构存在
      fs.ensureDirSync(config.aiSidebarDir)

      // 生成类型文件
      generateMainIndexDts()
      copyTypesFile()
      createComponentDts()

      console.log('✅ 所有类型声明文件生成完成！')
    } else {
      console.error('❌ dist/types目录不存在，类型生成可能失败')
    }
  } catch (error) {
    console.error('❌ 生成类型声明文件时出错:', error)
    process.exit(1)
  }
}

// 执行主函数
generateTypes().catch((error) => {
  console.error('❌ 执行过程中出错:', error)
  process.exit(1)
})
