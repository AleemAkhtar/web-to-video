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
