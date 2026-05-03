import React, { useRef, useState, useEffect } from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Video,
  Img,
  useVideoTimeline,
} from 'remotion';

// ============ Props 类型 ============
export interface SurgeryVideoProps {
  hospitalName: string;
  videoUrl1?: string;
  videoUrl2?: string;
  ctImageUrl?: string;
  seed?: number;
  accentColor?: string;
}

// ============ 工具函数 ============
const fadeIn = (frame: number, delay = 0) =>
  interpolate(Math.max(0, frame - delay), [0, 20], [0, 1]);

const bounce = (frame: number, delay = 0, config = {}) =>
  spring({ frame: Math.max(0, frame - delay), fps: 30, config: { damping: 200, stiffness: 100, ...config } });

// 简单伪随机（基于 seed）
const seededRandom = (seed: number, index: number) => {
  const x = Math.sin(seed * 9999 + index) * 10000;
  return x - Math.floor(x);
};

// 从视频 URL 列表随机选一个
const pickRandom = (urls: string[], seed: number, index: number) => {
  const idx = Math.floor(seededRandom(seed, index) * urls.length);
  return urls[idx] || urls[0];
};

// ============ 场景1: 医院名称片头 (0-90帧 = 3秒) ============
const OpeningScene: React.FC<{ hospitalName: string; accentColor: string }> = ({
  hospitalName,
  accentColor,
}) => {
  const frame = useCurrentFrame();

  const titleScale = bounce(frame, 0, { damping: 180, stiffness: 90 });
  const titleY = interpolate(bounce(frame, 0), [0.95, 1], [0, 0]);
  const subtitleOpacity = fadeIn(frame, 25);
  const lineScaleX = interpolate(Math.max(0, frame - 40), [0, 30], [0, 1]);
  const bottomFade = fadeIn(frame, 60);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a1628',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* 背景光晕 */}
      <div
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor}30 0%, transparent 70%)`,
          transform: `scale(${interpolate(frame, [0, 60], [0.5, 1.2])})`,
          opacity: fadeIn(frame, 5),
        }}
      />

      {/* 主标题 */}
      <div
        style={{
          textAlign: 'center',
          transform: `scale(${titleScale}) translateY(${titleY}px)`,
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 72,
            fontFamily: 'Arial, sans-serif',
            fontWeight: 800,
            letterSpacing: '0.1em',
            textShadow: `0 0 40px ${accentColor}`,
            opacity: fadeIn(frame, 0),
          }}
        >
          {hospitalName}
        </div>

        <div
          style={{
            color: accentColor,
            fontSize: 28,
            fontFamily: 'Arial, sans-serif',
            marginTop: 16,
            letterSpacing: '0.3em',
            opacity: subtitleOpacity,
          }}
        >
          学术汇报
        </div>

        {/* 装饰线 */}
        <div
          style={{
            width: 200,
            height: 3,
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
            margin: '24px auto 0',
            transform: `scaleX(${lineScaleX})`,
            borderRadius: 2,
          }}
        />
      </div>

      {/* 底部副标题 */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          color: 'rgba(255,255,255,0.4)',
          fontSize: 18,
          fontFamily: 'Arial, sans-serif',
          opacity: bottomFade,
          letterSpacing: '0.2em',
        }}
      >
        2026 年度学术交流
      </div>
    </AbsoluteFill>
  );
};

// ============ 场景2: 视频主体 + CT叠加 (90-450帧 = 12秒) ============
const MainScene: React.FC<SurgeryVideoProps> = ({
  videoUrl1,
  videoUrl2,
  ctImageUrl,
  seed = 42,
  accentColor = '#3b82f6',
}) => {
  const frame = useCurrentFrame();
  const relativeFrame = frame - 90;
  const { fps, width, height } = useVideoConfig();
  const [currentVideo, setCurrentVideo] = useState(0);
  const [showCT, setShowCT] = useState(false);

  // 每4秒切换一次视频
  const clipDuration = fps * 4;
  const currentClip = Math.floor(relativeFrame / clipDuration) % 2;

  // CT 图像淡入淡出
  const ctOpacity = showCT ? interpolate(fadeIn(relativeFrame % clipDuration, 10), [0, 1], [0, 0.85]) : 0;

  // 视频进度（每个片段从头开始播）
  const clipFrame = relativeFrame % clipDuration;

  // CT 图像定时显示
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCT(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // 视频片段
  const videoUrls = [videoUrl1, videoUrl2].filter(Boolean);
  const activeVideoUrl = videoUrls[currentClip] || videoUrl1 || '';

  // 底部进度条
  const progressWidth = interpolate(relativeFrame, [0, 360], [0, 100]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#1a1a2e',
        overflow: 'hidden',
      }}
    >
      {/* 视频背景 */}
      {activeVideoUrl && (
        <Video
          src={activeVideoUrl}
          startFrom={currentClip * clipDuration}
          style={{ opacity: 0.7, objectFit: 'cover' }}
        />
      )}

      {/* 渐变遮罩 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* CT 图像叠加（右下角） */}
      {ctImageUrl && (
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 40,
            width: 280,
            height: 220,
            borderRadius: 12,
            overflow: 'hidden',
            border: `2px solid ${accentColor}`,
            boxShadow: `0 0 20px ${accentColor}60`,
            opacity: ctOpacity,
            transform: showCT ? 'scale(1)' : 'scale(0.8)',
          }}
        >
          <Img
            src={ctImageUrl}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {/* CT 标签 */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              fontSize: 12,
              fontFamily: 'Arial, sans-serif',
              padding: '4px 8px',
              textAlign: 'center',
            }}
          >
            CT DIAGNOSTIC
          </div>
        </div>
      )}

      {/* 左上角视频片段指示 */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          display: 'flex',
          gap: 8,
        }}
      >
        {[0, 1].map(i => (
          <div
            key={i}
            style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: i === currentClip ? accentColor : 'rgba(255,255,255,0.3)',
              transform: `scaleX(${i === currentClip ? 1 : 0.6})`,
            }}
          />
        ))}
      </div>

      {/* 底部进度条 */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          backgroundColor: 'rgba(255,255,255,0.1)',
        }}
      >
        <div
          style={{
            width: `${progressWidth}%`,
            height: '100%',
            backgroundColor: accentColor,
            borderRadius: '0 2px 2px 0',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ============ 主视频组件 ============
export const SurgeryVideo: React.FC<SurgeryVideoProps> = (props) => {
  const { seed = 42, accentColor = '#3b82f6' } = props;

  // 固定使用的视频 URL（来自云存储）
  const VIDEO_URL_1 = 'https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4';
  const VIDEO_URL_2 = 'https://commondatastorage.googleapis.comGTv-videos-bucket/sample/ForBiggerJoyrides.mp4';

  // CT 图片（来自 F 盘）
  const CT_IMAGE = 'https://raw.githubusercontent.com/yumufeixue/medical-ct-images/main/ct-sample.jpg';

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 片头 0-90帧 (3秒) */}
      <Sequence from={0} durationInFrames={90}>
        <OpeningScene
          hospitalName={props.hospitalName || '仁和医院'}
          accentColor={accentColor || '#3b82f6'}
        />
      </Sequence>

      {/* 主体 90-450帧 (12秒) */}
      <Sequence from={90} durationInFrames={360}>
        <MainScene
          {...props}
          videoUrl1={VIDEO_URL_1}
          videoUrl2={VIDEO_URL_2}
          ctImageUrl={CT_IMAGE}
          seed={seed}
          accentColor={accentColor}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

export default SurgeryVideo;
