# Web-to-Video Recorder

A Node.js application that captures web page animations and converts them into video files. This tool uses Puppeteer to control a headless browser and provides multiple recording methods to create high-quality videos from dynamic web content.

## 🎯 What This Project Is About

Web-to-Video Recorder is designed to capture animated web pages and convert them into video format. It's particularly useful for:
- Recording web-based animations and interactions
- Creating demos of web applications
- Capturing chat interfaces or streaming content
- Converting dynamic web content into shareable video files

The project monitors a local web application (running on `http://127.0.0.1:3000`) and waits for an animation to complete (detected via `window.animationFinished` flag) before stopping the recording.

## ✨ Features

### 🖼️ Frame-by-Frame Capture (`capture_images.js`)
- **Smart Animation Detection**: Automatically detects when animations are complete using the `window.animationFinished` global variable
- **High-Quality Screenshots**: Captures individual PNG frames at configurable intervals
- **Adaptive Frame Rate**: Calculates actual frame rate based on capture duration
- **Optimized Output**: Provides FFmpeg command suggestions for video conversion
- **Flexible Duration**: Supports recordings from 5 seconds to 60 seconds maximum

### 🎥 Direct Video Recording (`capture_video.js`)
- **Real-Time Recording**: Records video directly without intermediate frame files
- **Screen Capture Integration**: Uses FFmpeg for live screen recording
- **Audio Support**: Includes audio recording capability (VB-Audio Virtual Cable)
- **Automatic Timing**: Starts and stops recording based on animation completion

### 🛠️ FFmpeg Integration (`ffmpeg_record.js`)
- **Screen Region Capture**: Records specific screen regions (480x916 pixels)
- **Audio/Video Sync**: Combines screen capture with audio input
- **High-Quality Encoding**: Uses H.264 codec with optimized settings
- **Background Processing**: Handles FFmpeg processes with proper cleanup

### 📊 Smart Recording Features
- **Viewport Optimization**: Fixed 500x1100 viewport for consistent output
- **Console Logging**: Captures and displays browser console messages
- **Error Handling**: Robust error handling and process management
- **Timestamp Generation**: Automatic file naming with ISO timestamps

## 🚀 Installation and Setup

### Prerequisites
- **Node.js**: Version 14 or higher
- **FFmpeg**: Required for video recording functionality
- **VB-Audio Virtual Cable**: Optional, for audio recording

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AleemAkhtar/web-to-video.git
   cd web-to-video
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install FFmpeg**:
   - **Windows**: Download from [FFmpeg.org](https://ffmpeg.org/download.html) and add to PATH
   - **macOS**: `brew install ffmpeg`
   - **Linux**: `sudo apt install ffmpeg` or `sudo yum install ffmpeg`

4. **Optional - Install VB-Audio Virtual Cable** (for audio recording):
   - Download from [VB-Audio website](https://vb-audio.com/Cable/)

## 🎬 How to Run

### Method 1: Frame-by-Frame Capture
```bash
node capture_images.js
```
- Captures individual frames to the `frames/` directory
- Provides FFmpeg command for video conversion
- Best for high-quality output and custom post-processing

### Method 2: Direct Video Recording
```bash
node capture_video.js
```
- Records video directly to MP4 file
- Includes audio if VB-Audio Virtual Cable is configured
- Generates timestamped output files

### Prerequisites for Recording
- Ensure your web application is running on `http://127.0.0.1:3000`
- Your web page should set `window.animationFinished = true` when the animation is complete
- For audio recording, configure VB-Audio Virtual Cable as your system's audio output

### Example Workflow
1. Start your web application on port 3000
2. Run either recording script
3. The browser will automatically navigate to your page
4. Recording starts after a 2-second delay
5. Recording stops when `window.animationFinished` becomes `true`
6. Output video/frames are saved to the project directory

## 📁 Output Files

- **Frame Capture**: PNG files in `frames/` directory (`frame_0001.png`, `frame_0002.png`, etc.)
- **Video Recording**: MP4 files with timestamp (`recording-2025-06-13T12-30-42-132Z.mp4`)
- **Logs**: Console output with capture statistics and FFmpeg commands

## 🔧 Configuration

### Viewport Settings
- **Width**: 500px
- **Height**: 1100px
- **Window Position**: Top-left corner (0,0)

### Recording Settings
- **Frame Rate**: Dynamic (calculated based on capture speed)
- **Video Quality**: H.264 codec, YUV420p pixel format
- **Audio**: AAC codec (when available)
- **Screen Region**: 480x916 pixels with 20px offset

## 📄 License

This project is licensed under the **MIT License** - a permissive license that allows anyone to use, modify, and distribute this code freely, including for commercial purposes. See the full license text below:

```
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute to this project:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contact
For questions, suggestions, or contributions, please visit my GitHub profile: **[AleemAkhtar](https://github.com/AleemAkhtar)**

---

## 🐛 Troubleshooting

### Common Issues
- **FFmpeg not found**: Ensure FFmpeg is installed and added to your system PATH
- **Port 3000 not accessible**: Make sure your web application is running on the correct port
- **Audio not recording**: Check VB-Audio Virtual Cable configuration
- **Animation not detected**: Ensure your web page sets `window.animationFinished = true`

### Support
If you encounter any issues, please check the console output for error messages and ensure all prerequisites are properly installed.
