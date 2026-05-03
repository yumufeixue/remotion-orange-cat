/**
 * 批量渲染脚本 - 生成10个不同版本的手术视频
 * 
 * 使用 Lambda 云端渲染，无需本地 Chrome
 * 
 * 使用方式:
 *   npx ts-node scripts/batch-render.ts
 */

import path from 'path';
import { promises as fs } from 'fs';

// ============ 渲染配置 ============
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const COMPOSITION = 'SurgeryVideo';  // Video.tsx 导出的组件名
const ENTRY_POINT = path.join(__dirname, '..', 'src', 'index.ts');

// 视频规格
const FPS = 30;
const DURATION = 15; // 秒
const TOTAL_FRAMES = FPS * DURATION; // 450帧

// 输出目录
const OUTPUT_DIR = path.join(__dirname, '..', 'out');

// ============ 10个不同版本的配置 ============
interface VideoConfig {
  id: number;
  hospitalName: string;
  accentColor: string;
  seed: number;
  outputName: string;
}

const VIDEO_CONFIGS: VideoConfig[] = [
  { id: 1, hospitalName: '仁和医院',      accentColor: '#3b82f6', seed: 101, outputName: '01_仁和医院_蓝.mp4' },
  { id: 2, hospitalName: '中山大学附属医院', accentColor: '#10b981', seed: 202, outputName: '02_中山医院_绿.mp4' },
  { id: 3, hospitalName: '北京协和医院',    accentColor: '#ef4444', seed: 303, outputName: '03_协和医院_红.mp4' },
  { id: 4, hospitalName: '华西医院',        accentColor: '#f59e0b', seed: 404, outputName: '04_华西医院_橙.mp4' },
  { id: 5, hospitalName: '复旦大学附属医院', accentColor: '#8b5cf6', seed: 505, outputName: '05_复旦医院_紫.mp4' },
  { id: 6, hospitalName: '同济医院',        accentColor: '#06b6d4', seed: 606, outputName: '06_同济医院_青.mp4' },
  { id: 7, hospitalName: '南方医科大学',     accentColor: '#ec4899', seed: 707, outputName: '07_南方医大_粉.mp4' },
  { id: 8, hospitalName: '浙江省人民医院',   accentColor: '#84cc16', seed: 808, outputName: '08_浙江医院_黄绿.mp4' },
  { id: 9, hospitalName: '武汉大学人民医院', accentColor: '#f97316', seed: 909, outputName: '09_武大医院_深橙.mp4' },
  { id: 10, hospitalName: '交通大学医学院',  accentColor: '#14b8a6', seed: 1010, outputName: '10_交大医学院_青绿.mp4' },
];

// ============ Lambda 渲染函数 ============
async function renderVideoLambda(config: VideoConfig): Promise<{ success: boolean; outputPath?: string; error?: string }> {
  const { renderOnLambda } = await import('@remotion/lambda');
  
  const inputProps = {
    hospitalName: config.hospitalName,
    accentColor: config.accentColor,
    seed: config.seed,
  };

  try {
    console.log(`🎬 [${config.id}/10] 开始渲染: ${config.outputName}`);
    console.log(`   医院: ${config.hospitalName} | 颜色: ${config.accentColor} | 种子: ${config.seed}`);

    const result = await renderOnLambda({
      region: AWS_REGION,
      serveUrl: process.env.REMOTION_SERVE_URL || '',
      compositionId: COMPOSITION,
      entryPoint: ENTRY_POINT,
      inputProps,
      framesPerLambda: 150,
      outputFormat: 'mp4',
      quality: 80,
      fps: FPS,
      frameRange: [0, TOTAL_FRAMES],
      // 使用 Memory IAM 角色
      concurrency: 2,
    });

    console.log(`   ✅ 完成! Render ID: ${result.renderId}`);
    return { success: true, outputPath: result.outputPath };
  } catch (error: any) {
    console.error(`   ❌ 失败: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// ============ 主流程 ============
async function main() {
  console.log('='.repeat(60));
  console.log('🏥 批量手术视频生成器 - 10个版本');
  console.log('='.repeat(60));
  console.log(`📁 输出目录: ${OUTPUT_DIR}`);
  console.log(`🎞️  视频规格: ${FPS}fps | ${DURATION}秒 | ${TOTAL_FRAMES}帧`);
  console.log(`☁️  AWS区域: ${AWS_REGION}`);
  console.log();

  // 确保输出目录存在
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const startTime = Date.now();
  const results: { config: VideoConfig; result: Awaited<ReturnType<typeof renderVideoLambda>> }[] = [];

  // 逐个渲染（避免并发过高）
  for (const config of VIDEO_CONFIGS) {
    const result = await renderVideoLambda(config);
    results.push({ config, result });
    
    // 渲染间隔（避免 AWS 限流）
    if (config.id < VIDEO_CONFIGS.length) {
      console.log(`   ⏳ 等待 3 秒后继续...\n`);
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  // ============ 汇总报告 ============
  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  const successCount = results.filter(r => r.result.success).length;

  console.log('\n' + '='.repeat(60));
  console.log('📊 渲染报告');
  console.log('='.repeat(60));
  console.log(`⏱️  总耗时: ${totalTime}s`);
  console.log(`✅ 成功: ${successCount}/10`);
  console.log(`❌ 失败: ${10 - successCount}/10`);
  console.log();
  console.log('详细结果:');
  results.forEach(({ config, result }) => {
    const status = result.success ? '✅' : '❌';
    console.log(`  ${status} ${config.outputName} - ${result.success ? '渲染完成' : result.error}`);
  });

  console.log('\n📁 所有视频已保存至:', OUTPUT_DIR);
  console.log('='.repeat(60));

  // 如果有失败的，输出 IAM 配置提示
  if (successCount < 10) {
    console.log('\n⚠️  部分渲染失败，请检查 IAM 权限配置');
    console.log('   所需权限: lambda:*, iam:PassRole 等');
  }
}

main().catch(console.error);
