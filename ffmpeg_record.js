/**
 * Web-to-Video Recorder - FFmpeg Integration Module
 * 
 * @file ffmpeg_record.js
 * @description Handles FFmpeg process management for real-time screen and audio recording.
 *              Provides utilities to start and stop FFmpeg recording sessions with optimized
 *              settings for web content capture.
 * 
 * @author Aleem Akhtar
 * @version 1.0.0
 * @created 2025
 * @github https://github.com/AleemAkhtar
 * 
 * @features
 * - Screen region capture using Windows GDI (gdigrab)
 * - Audio capture via DirectShow (VB-Audio Virtual Cable)
 * - H.264 video encoding with AAC audio
 * - Configurable screen offset and capture dimensions
 * - Process lifecycle management with graceful shutdown
 * 
 * @functions
 * - startFFmpeg(outputFile): Initiates FFmpeg recording process
 * - stopFFmpeg(): Gracefully terminates the recording
 * 
 * @configuration
 * - Capture Region: 480x916 pixels at offset (20, 90)
 * - Video: 30fps, H.264 codec, YUV420p pixel format
 * - Audio: AAC codec via CABLE Output (VB-Audio Virtual Cable)
 * 
 * @requirements
 * - FFmpeg installed and accessible in system PATH
 * - Windows OS (uses gdigrab for screen capture)
 * - VB-Audio Virtual Cable for audio recording
 * 
 * @usage
 * const { startFFmpeg, stopFFmpeg } = require('./ffmpeg_record');
 * startFFmpeg('output.mp4');
 * // ... recording happens ...
 * stopFFmpeg();
 */

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
