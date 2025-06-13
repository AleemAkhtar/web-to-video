const { spawn } = require('child_process');

let ffmpegProcess = null;

function startFFmpeg(outputFile = 'recorded_output.mp4') {
  ffmpegProcess = spawn('ffmpeg', [
    '-y',
    '-f', 'gdigrab',
    '-framerate', '30',
    '-offset_x', '20',
    '-offset_y', '90',
    '-video_size', '480x916',
    '-i', 'desktop',
    '-f', 'dshow',
    '-i', 'audio=CABLE Output (VB-Audio Virtual Cable)',
    '-c:v', 'libx264',
    '-c:a', 'aac',
    '-pix_fmt', 'yuv420p',
    '-r', '30',
    outputFile
  ]);

  ffmpegProcess.stderr.on('data', (data) => {
    console.log(`FFmpeg: ${data}`);
  });

  ffmpegProcess.on('exit', () => {
    console.log('🎬 FFmpeg recording finished.');
  });

  return ffmpegProcess;
}

function stopFFmpeg() {
  if (ffmpegProcess) {
    ffmpegProcess.stdin.write('q');
  }
}

module.exports = { startFFmpeg, stopFFmpeg };
