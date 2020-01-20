const gpmfExtract = require('gpmf-extract');
const fs = require('fs');
const goproTelemetry = require('gopro-telemetry');
const extractFrames = require('ffmpeg-extract-frames')
const ffprobe = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');

const file1 = fs.readFileSync('./sample/karma.mp4');
const file2 = fs.readFileSync('./sample/GH040633.MP4');

// Extract Telemetry
const extractTelemetry = () => gpmfExtract(file2).then(res => {
  console.log('Length of data received:', res.rawData.length);
  console.log('Framerate of data received:', 1 / res.timing.frameDuration);
  // Do what you want with the data
  let telemetry = goproTelemetry(res);
  fs.writeFileSync('output_path.json', JSON.stringify(telemetry));
  console.log('Telemetry saved as JSON');
});

// Extract frames info
const extractFramesInfo = async () => ffprobe('./sample/karma.mp4', { path: ffprobeStatic.path })
  .then(function (info) {
    console.log(info);
    fs.writeFileSync('framesinfo.json', JSON.stringify(info));
    console.log('frames info saved as JSON');
  })
  .catch(function (err) {
    console.error(err);
});

// Extract frames by timestamps
const extractFramesByTimestamps = async function() {
    await extractFrames({
        input: 'sample/GH040633.MP4',
        output: 'frames/frame-%d.png',
        timestamps:['00:00:30', '00:01:00', '00:01:30', '00:02:00', '00:02:01']
    });
}

//extractTelemetry();
//extractFramesInfo()
extractFramesByTimestamps();


