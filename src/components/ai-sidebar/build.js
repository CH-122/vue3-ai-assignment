// build.js
const fs = require('fs-extra')
const path = require('path')
const { execSync } = require('child_process')

// 定义源目录和目标目录
const sourceDir = path.resolve(__dirname)
const targetDir = path.resolve(__dirname, '../../../dist/ai-sidebar')

// 创建目标目录
fs.ensureDirSync(targetDir)

// 复制文件
console.log('正在复制文件...')
fs.copySync(sourceDir, targetDir, {
  filter: (src) => {
    // 排除不需要的文件
    return !src.includes('node_modules') &&
      !src.includes('.git') &&
      !src.includes('dist') &&
      !src.endsWith('build.js')
  }
})

// 复制README.md
fs.copySync(
  path.resolve(sourceDir, 'README.md'),
  path.resolve(targetDir, 'README.md')
)

console.log('文件复制完成！')

// 创建package.json
const packageJson = {
  "name": "vue3-ai-sidebar",
  "version": "1.0.0",
  "description": "Vue 3 AI侧边栏组件，包含所有必要的Element Plus组件",
  "main": "index.ts",
  "types": "index.ts",
  "author": "",
  "license": "MIT",
  "dependencies": {
    "markdown-it": "^13.0.1",
    "highlight.js": "^11.7.0"
  },
  "peerDependencies": {
    "vue": "^3.2.0"
  }
}

fs.writeFileSync(
  path.resolve(targetDir, 'package.json'),
  JSON.stringify(packageJson, null, 2)
)

console.log('package.json创建完成！')
console.log('打包完成！') 