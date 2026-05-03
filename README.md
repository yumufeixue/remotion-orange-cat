# Remotion 视频生成演示项目

一个基于 React + TypeScript 的 Remotion 视频生成项目，包含开场动画、数据统计、结尾三个场景。

## 📁 项目结构

```
remotion-demo/
├── src/
│   ├── index.ts          # 入口文件
│   └── Video.tsx         # 视频组件（核心代码）
├── scripts/
│   └── batch-render.ts    # 批量渲染脚本
├── out/                   # 视频输出目录
├── package.json
├── tsconfig.json
├── remotion.config.ts
└── README.md
```

## 🚀 快速开始

### 安装依赖

```bash
cd remotion-demo
npm install
```

### 预览视频

```bash
npm start
```

这会启动 Remotion Studio，你可以在浏览器中实时预览和调试视频。

### 渲染单个视频

```bash
npm run render
```

输出文件: `out/demo.mp4`

### 批量生成视频

```bash
# 首先生成 bundle
npm run bundle

# 运行批量渲染脚本
npx ts-node scripts/batch-render.ts
```

## ⚙️ 自定义配置

### 修改视频参数

在 `remotion.config.ts` 中调整：

```ts
Config.setFps(60);              // 帧率
Config.setDurationInFrames(300); // 10秒视频 (60fps * 10s)
Config.setQuality(90);          // 质量 0-100
```

### 修改视频内容

编辑 `src/Video.tsx` 中的组件 Props：

```ts
const videoProps = {
  title: '自定义标题',
  subtitle: '自定义副标题',
  backgroundColor: '#1a0a2e',  // 背景色
  accentColor: '#9333ea',       // 强调色
};
```

### 命令行参数渲染

```bash
npx remotion render src/index.ts out/custom.mp4 \
  --props='{"title":"Hello","subtitle":"World"}'
```

## 🎬 视频组成

| 场景 | 时间 | 内容 |
|------|------|------|
| 开场 | 0-2秒 | 标题动画 + 装饰效果 |
| 数据 | 2-4秒 | 统计数字滚动动画 |
| 结尾 | 4-5秒 | 感谢观看 |

## 🛠️ 常用 Remotion API

- `useCurrentFrame()` - 获取当前帧
- `useVideoConfig()` - 获取视频配置
- `interpolate()` - 数值插值（动画核心）
- `spring()` - 弹簧动画
- `Sequence` - 时间轴片段
- `AbsoluteFill` - 填充整个画布

## 📚 学习资源

- [Remotion 官方文档](https://www.remotion.dev/docs)
- [Remotion GitHub](https://github.com/remotion-dev/remotion)
- [Remotion Studio](https://remotion.studio)

## 🤖 自动化思路

1. **数据驱动**: 从 CSV/JSON 读取数据，批量生成视频
2. **API 集成**: 调用外部 API 获取实时数据（如天气、股价）
3. **Lambda 渲染**: 使用 `@remotion/lambda` 云端并行渲染，加速批量生成
4. **CI/CD**: 结合 GitHub Actions 实现代码推送自动渲染

---

Built with ❤️ by 小雪 ❄️
