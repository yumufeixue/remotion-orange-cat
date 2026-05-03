import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';

// ============ 工具函数 ============
const fadeIn = (frame: number, delay = 0) =>
  interpolate(Math.max(0, frame - delay), [0, 20], [0, 1]);

const bounce = (frame: number, config: { damping?: number; stiffness?: number } = {}) =>
  spring({ frame, fps: 30, config: { damping: 200, stiffness: 100, ...config } });

const bounceIn = (frame: number, delay = 0, config: { damping?: number; stiffness?: number } = {}) =>
  spring({ frame: Math.max(0, frame - delay), fps: 30, config: { damping: 200, stiffness: 100, ...config } });

// ============ 场景1: 橘猫大厨登场 ============
const ChefScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 橘猫整体弹入
  const catBounce = bounce(frame);

  // 围裙从下方滑入
  const apronSlide = interpolate(Math.max(0, frame - 15), [0, 25], [80, 0]);

  // 星星闪烁
  const starVisible = frame > 10 ? 1 : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#FFF8E7',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* 顶部标题 */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          color: '#E67E22',
          fontSize: 36,
          fontWeight: 700,
          opacity: fadeIn(frame, 0),
        }}
      >
        🍊 橘猫大厨上线啦！
      </div>

      {/* 星星装饰 */}
      {starVisible > 0 && (
        <div style={{ position: 'absolute', top: 100, left: '50%', transform: 'translateX(-50%)' }}>
          {['✨', '⭐', '✨'].map((star, i) => (
            <span
              key={i}
              style={{
                fontSize: 24,
                position: 'absolute',
                left: (i - 1) * 50,
                opacity: interpolate(frame, [10 + i * 5, 20 + i * 5], [0, 1]),
                transform: `scale(${interpolate(frame, [10 + i * 5, 20 + i * 5], [0.5, 1])})`,
              }}
            >
              {star}
            </span>
          ))}
        </div>
      )}

      {/* 橘猫本体 */}
      <div
        style={{
          transform: `scale(${catBounce})`,
          textAlign: 'center',
        }}
      >
        {/* 猫头 */}
        <div style={{ fontSize: 120 }}>🐱</div>
        {/* 厨师帽 */}
        <div
          style={{
            fontSize: 60,
            marginTop: -20,
            marginLeft: 10,
            transform: `rotate(${interpolate(frame, [5, 15], [-10, 5])}deg)`,
          }}
        >
          👨‍🍳
        </div>
        {/* 猫身体 + 围裙 */}
        <div
          style={{
            fontSize: 100,
            marginTop: -10,
            position: 'relative',
          }}
        >
          {/* 围裙 */}
          <div
            style={{
              position: 'absolute',
              top: 30,
              left: '50%',
              transform: `translateX(-50%) translateY(${apronSlide}px)`,
              fontSize: 50,
            }}
          >
            👏
          </div>
          🐾
        </div>
      </div>

      {/* 底部说明 */}
      <div
        style={{
          position: 'absolute',
          bottom: 50,
          color: '#C0392B',
          fontSize: 28,
          fontWeight: 600,
          opacity: fadeIn(frame, 20),
        }}
      >
        今晚吃什么好呢？
      </div>
    </AbsoluteFill>
  );
};

// ============ 场景2: 做饭中 ============
const CookingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const relativeFrame = frame - 50;

  // 食材飞入
  const ingredient1X = interpolate(Math.max(0, relativeFrame - 0), [0, 20], [-200, 0]);
  const ingredient2X = interpolate(Math.max(0, relativeFrame - 8), [0, 20], [200, 0]);
  const ingredient3X = interpolate(Math.max(0, relativeFrame - 16), [0, 20], [-150, 0]);

  // 锅铲翻炒动画
  const spatulaAngle = interpolate(frame, [50, 70, 90, 110], [0, -30, 30, 0]);

  // 蒸汽上升
  const steam1Y = interpolate(Math.max(0, frame - 50), [0, 30], [0, -60]);
  const steam2Y = interpolate(Math.max(0, frame - 55), [0, 30], [0, -50]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#FFEAA7',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* 标题 */}
      <div
        style={{
          position: 'absolute',
          top: 30,
          color: '#D35400',
          fontSize: 32,
          fontWeight: 700,
        }}
      >
        🍳 一起做饭吧！
      </div>

      {/* 食材飞入区 */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          display: 'flex',
          gap: 30,
          fontSize: 50,
        }}
      >
        <span style={{ transform: `translateX(${ingredient1X}px)` }}>🥕</span>
        <span style={{ transform: `translateX(${ingredient2X}px)` }}>🍖</span>
        <span style={{ transform: `translateX(${ingredient3X}px)` }}>🧅</span>
      </div>

      {/* 灶台和锅 */}
      <div style={{ position: 'relative', marginTop: 60 }}>
        {/* 锅 */}
        <div style={{ fontSize: 140 }}>🍳</div>
        {/* 锅铲 */}
        <div
          style={{
            position: 'absolute',
            top: 20,
            right: -50,
            fontSize: 50,
            transform: `rotate(${spatulaAngle}deg)`,
          }}
        >
          🥄
        </div>
        {/* 蒸汽 */}
        {frame > 50 && (
          <>
            <div
              style={{
                position: 'absolute',
                top: -10,
                left: 30,
                fontSize: 30,
                opacity: 0.7,
                transform: `translateY(${steam1Y}px)`,
              }}
            >
              💨
            </div>
            <div
              style={{
                position: 'absolute',
                top: -5,
                left: 70,
                fontSize: 24,
                opacity: 0.5,
                transform: `translateY(${steam2Y}px)`,
              }}
            >
              💨
            </div>
          </>
        )}
      </div>

      {/* 橘猫厨师 */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          fontSize: 60,
        }}
      >
        🐱✨
      </div>

      {/* 进度条 */}
      <div
        style={{
          position: 'absolute',
          bottom: 30,
          width: 300,
          height: 12,
          backgroundColor: '#DDD',
          borderRadius: 6,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${interpolate(relativeFrame, [0, 50], [0, 100])}%`,
            height: '100%',
            backgroundColor: '#E67E22',
            borderRadius: 6,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ============ 场景3: 美食完成 ============
const FinalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const relativeFrame = frame - 100;

  // 美食盘子放大弹出
  const dishScale = bounceIn(relativeFrame, 10, { damping: 80, stiffness: 100 });

  // 爱心飞出
  const heartsOpacity = fadeIn(relativeFrame, 20);
  const heart1Scale = bounceIn(relativeFrame, 20);
  const heart2Scale = bounceIn(relativeFrame, 23);

  // 喵喵叫文字
  const meowOpacity = fadeIn(relativeFrame, 15);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#FDEDEC',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* 标题 */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          color: '#E74C3C',
          fontSize: 36,
          fontWeight: 700,
          opacity: fadeIn(relativeFrame, 0),
        }}
      >
        🎉 美食完成！
      </div>

      {/* 美食盘子 */}
      <div
        style={{
          fontSize: 140,
          transform: `scale(${dishScale})`,
        }}
      >
        🍲
      </div>

      {/* 配菜 */}
      <div
        style={{
          display: 'flex',
          gap: 20,
          marginTop: 10,
          fontSize: 40,
          opacity: fadeIn(relativeFrame, 15),
        }}
      >
        <span>🍚</span>
        <span>🥬</span>
        <span>🍳</span>
      </div>

      {/* 爱心 */}
      {heartsOpacity > 0 && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '40%',
              left: '30%',
              fontSize: 30,
              opacity: heartsOpacity,
              transform: `scale(${heart1Scale})`,
            }}
          >
            ❤️
          </div>
          <div
            style={{
              position: 'absolute',
              top: '45%',
              right: '30%',
              fontSize: 24,
              opacity: heartsOpacity * 0.8,
              transform: `scale(${heart2Scale})`,
            }}
          >
            ❤️
          </div>
        </>
      )}

      {/* 橘猫 */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          fontSize: 70,
          opacity: fadeIn(relativeFrame, 5),
        }}
      >
        🐱🍳
      </div>

      {/* 喵喵文字 */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          color: '#E67E22',
          fontSize: 26,
          fontWeight: 600,
          opacity: meowOpacity,
        }}
      >
        喵呜～ 好吃！😋
      </div>
    </AbsoluteFill>
  );
};

// ============ 主视频组件 ============
export const DemoVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 场景1: 登场 (0-50帧) */}
      <Sequence from={0} durationInFrames={50}>
        <ChefScene />
      </Sequence>

      {/* 场景2: 做饭 (50-100帧) */}
      <Sequence from={50} durationInFrames={50}>
        <CookingScene />
      </Sequence>

      {/* 场景3: 完成 (100-150帧) */}
      <Sequence from={100} durationInFrames={50}>
        <FinalScene />
      </Sequence>
    </AbsoluteFill>
  );
};

export default DemoVideo;
