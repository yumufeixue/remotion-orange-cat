import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(100);
Config.setOverwriteOutput(true);
Config.setFps(30);
Config.setDurationInFrames(150); // 5秒视频 (30fps * 5s)