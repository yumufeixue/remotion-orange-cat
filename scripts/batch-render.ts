/**
 * 批量渲染脚本 - 自动生成多个视频
 * 
 * 使用方式:
 * 1. 先构建 bundle: npm run bundle
 * 2. 然后运行: npx ts-node batch-render.ts
 * 
 * 或直接运行（开发模式）:
 * npx ts-node batch-render-dev.ts
 */

import path from 'path';
import fs from 'fs';

// 模拟数据 - 可以来自 CSV、数据库、API 等
const videoData = [
  {
    title: 'Q1 季度汇报',
    subtitle: '2026年第一季度总结',
    backgroundColor: '#0f172a',
    accentColor: '#3b82f6',
    outputName: 'q1-report',
  },
  {
    title: '产品发布会',
    subtitle: '全新产品震撼发布',
    backgroundColor: '#1a0a2e',
    accentColor: '#9333ea',
    outputName: 'product-launch',
  },
  {
    title: '用户增长报告',
    subtitle: '月活用户突破 100 万',
    backgroundColor: '#0a1f1a',
    accentColor: '#10b981',
    outputName: 'growth-report',
  },
  {
    title: '年度总结',
    subtitle: '2026 年度回顾',
    backgroundColor: '#1f0a0a',
    accentColor: '#ef4444',
    outputName: 'annual-summary',
  },
];

// 确保输出目录存在
const outputDir = path.join(__dirname, '..', 'out');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('📊 批量视频生成任务已启动');
console.log(`📁 输出目录: ${outputDir}`);
console.log(`📹 待生成视频数量: ${videoData.length}\n`);

// 渲染配置
const fps = 30;
const durationInFrames = 150; // 5秒视频

// TODO: 实际渲染时取消注释下面的代码
/*
import { render } from '@remotion/cli';
import { bundle } from '@remotion/bundler';

async function renderVideo(data: typeof videoData[0]) {
  const startTime = Date.now();
  
  try {
    console.log(`🎬 正在生成: ${data.outputName}`);
    
    // 1. 打包 Remotion 项目
    const bundleLocation = await bundle({
      entryPoint: path.join(__dirname, 'index.ts'),
      on BundleProgress: (progress) => {
        if (progress.stage === 'bundling') {
          process.stdout.write(`\r📦 打包中... ${Math.round(progress.progress * 100)}%`);
        }
      },
    });

    console.log('\n🚀 开始渲染...');

    // 2. 渲染视频
    await render({
      serveUrl: bundleLocation,
      compositionId: 'DemoVideo',
      outputLocation: path.join(outputDir, `${data.outputName}.mp4`),
      inputProps: {
        title: data.title,
        subtitle: data.subtitle,
        backgroundColor: data.backgroundColor,
        accentColor: data.accentColor,
      },
      quality: 100,
      fps,
      frameRange: [0, durationInFrames],
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`✅ 完成: ${data.outputName}.mp4 (耗时 ${duration}s)\n`);
  } catch (error) {
    console.error(`❌ 渲染失败: ${data.outputName}`, error);
  }
}

async function main() {
  console.time('总耗时');
  
  for (const data of videoData) {
    await renderVideo(data);
  }
  
  console.timeEnd('总耗时');
  console.log('\n🎉 全部视频生成完成！');
}

main();
*/

// 当前打印配置信息（实际渲染需要安装依赖）
console.log('📋 渲染配置:');
console.log(`   - FPS: ${fps}`);
console.log(`   - 时长: ${durationInFrames / fps} 秒`);
console.log(`   - 分辨率: 1920x1080 (默认)\n`);

console.log('🎨 视频列表:');
videoData.forEach((data, index) => {
  console.log(`   ${index + 1}. ${data.title}`);
  console.log(`      - 副标题: ${data.subtitle}`);
  console.log(`      - 主色: ${data.accentColor}`);
  console.log(`      - 输出: out/${data.outputName}.mp4\n`);
});

console.log('💡 要执行实际渲染，请运行:');
console.log('   1. cd remotion-demo');
console.log('   2. npm install');
console.log('   3. npm run bundle');
console.log('   4. npx ts-node scripts/batch-render.ts');
