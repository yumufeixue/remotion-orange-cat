import { Config } from '@remotion/cli/config';

Config.setBrowserExecutable('/mnt/c/Program Files/Google/Chrome/Application/chrome.exe');

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setQuality(100);
Config.setFps(30);
Config.setDurationInFrames(150); // 5秒视频 (30fps * 5s)
