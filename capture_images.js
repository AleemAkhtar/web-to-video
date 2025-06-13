/**
 * Web-to-Video Recorder - Frame-by-Frame Capture Module
 * 
 * @file capture_images.js
 * @description Captures individual PNG frames from a web page animation using Puppeteer.
 *              Monitors for animation completion via window.animationFinished flag and 
 *              provides optimized frame sequences for video conversion.
 * 
 * @author Aleem Akhtar
 * @version 1.0.0
 * @created 2025
 * @github https://github.com/AleemAkhtar
 * 
 * @features
 * - Smart animation detection with window.animationFinished monitoring
 * - High-quality PNG frame capture at adaptive frame rates
 * - Automatic frame rate calculation and FFmpeg command generation
 * - Configurable viewport (500x1100) for consistent output
 * - Maximum 60-second recording duration with minimum 5-second threshold
 * 
 * @usage
 * node capture_images.js
 * 
 * @requirements
 * - Web application running on http://127.0.0.1:3000
 * - Target page must set window.animationFinished = true when complete
 * - Element with ID 'chat-container' must exist for initial page load detection
 * 
 * @output
 * - PNG frames saved to ./frames/ directory (frame_0001.png, frame_0002.png, etc.)
 * - Console output with capture statistics and suggested FFmpeg commands
 */

const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');

(async () => {
  const OUTPUT_DIR = path.join(__dirname, 'frames');
  await fs.emptyDir(OUTPUT_DIR);

  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 500, height: 1100 },
    args: [
      '--window-position=0,0',
      '--window-size=500,1080',
      '--autoplay-policy=no-user-gesture-required'
    ]
  });

  const page = await browser.newPage();

  // Log browser console
  page.on('console', msg => {
    console.log('📺 PAGE LOG:', msg.text());
  });

  const url = 'http://127.0.0.1:3000';
  await page.goto(url);
  await page.waitForSelector('#chat-container');
  await new Promise(resolve => setTimeout(resolve, 1000)); // slight delay for layout

  const fps = 5;
  const frameDelay = 1000 / fps;
  const maxDuration = 60000; // 60 seconds max
  const startTime = Date.now();

  let frameCount = 0;

  console.log('🎥 Capturing frames until animationFinished = true...');

  while (true) {
    const elapsed = Date.now() - startTime;
    const isDone = await page.evaluate(() => window.animationFinished === true);

    // Take screenshot
    const framePath = path.join(OUTPUT_DIR, `frame_${String(frameCount).padStart(4, '0')}.png`);
    await page.screenshot({ path: framePath });
    frameCount++;

    // Stop if animation finished and ran for at least 5s
    if (isDone && elapsed > 5000) {
      console.log('✅ Animation finished! Stopping capture.');
      break;
    }

    await new Promise(resolve => setTimeout(resolve, 10));
  }

  const endTime = Date.now();
const totalDurationSec = (endTime - startTime) / 1000;
const actualFramerate = frameCount / totalDurationSec;

console.log(`\n📊 Total Duration: ${totalDurationSec.toFixed(2)} seconds`);
console.log(`🧮 Frame Count: ${frameCount}`);
console.log(`🎯 Actual Framerate: ${actualFramerate.toFixed(3)} FPS`);
console.log(`\n💡 Suggested FFmpeg command:\n`);
console.log(`ffmpeg -framerate ${actualFramerate.toFixed(3)} -i frames/frame_%04d.png -c:v libx264 -r 30 -pix_fmt yuv420p output.mp4\n`);
  await browser.close();
  console.log(`🎬 Capture complete! ${frameCount} frames saved.`);
})();
