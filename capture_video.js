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
