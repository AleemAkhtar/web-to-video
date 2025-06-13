/**
 * Web-to-Video Recorder - Direct Video Capture Module
 * 
 * @file capture_video.js
 * @description Records web page animations directly to MP4 video files using Puppeteer 
 *              and FFmpeg integration. Provides real-time screen capture with audio support.
 * 
 * @author Aleem Akhtar
 * @version 1.0.0
 * @created 2025
 * @github https://github.com/AleemAkhtar
 * 
 * @features
 * - Real-time video recording without intermediate frame files
 * - Integration with FFmpeg for live screen capture
 * - Audio recording support via VB-Audio Virtual Cable
 * - Automatic start/stop based on animation completion detection
 * - Timestamped output files for organized recordings
 * 
 * @usage
 * node capture_video.js
 * 
 * @requirements
 * - Web application running on http://127.0.0.1:3000
 * - FFmpeg installed and accessible in system PATH
 * - Target page must set window.animationFinished = true when complete
 * - Element with ID 'chat-container' must exist for initial page load detection
 * - Optional: VB-Audio Virtual Cable for audio recording
 * 
 * @output
 * - MP4 video files with ISO timestamp naming (recording-YYYY-MM-DDTHH-mm-ss-sssZ.mp4)
 * - Console logs showing recording progress and completion status
 */

const puppeteer = require('puppeteer');
const { startFFmpeg, stopFFmpeg } = require('./ffmpeg_record');

(async () => {
  console.log('💬 Page loading...');
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 500, height: 1100 },
    args: [
      '--window-position=0,0',
      '--window-size=500,1080',
      '--autoplay-policy=no-user-gesture-required'
    ]
  });

  const page = await browser.newPage();
  const url = 'http://127.0.0.1:3000';
  await page.goto(url);
  await page.waitForSelector('#chat-container');

  // Wait 2 seconds before starting FFmpeg
  await new Promise(resolve => setTimeout(resolve, 2000));

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputFile = `recording-${timestamp}.mp4`;
  console.log(`🚀 Starting FFmpeg recording → ${outputFile}`);
  startFFmpeg(outputFile);

  console.log('💬 Page loaded. Waiting for animation to complete...');
  await page.waitForFunction(() => window.animationFinished === true, {
    timeout: 60000
  });

  console.log('✅ Animation finished, stopping FFmpeg...');
  stopFFmpeg();
  // Wait 2 seconds before closing the browser
  await new Promise(resolve => setTimeout(resolve, 2000));
  await browser.close();
  console.log('🧹 Browser closed.');
})();
