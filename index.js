const gpmfExtract = require('gpmf-extract');
const fs = require('fs');
const goproTelemetry = require('gopro-telemetry');
const extractFrames = require('ffmpeg-extract-frames')
const ffprobe = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');
const youtubedl = require('youtube-dl')

const getYouTubeVideo = (videoId, saveFileName) => {
  const video = youtubedl(`https://www.youtube.com/watch?v=${videoId}`,
    // Optional arguments passed to youtube-dl.
    ['--format=18'],
    // Additional options can be given for calling `child_process.execFile()`.
    { cwd: __dirname })

  // Will be called when the download starts.
  video.on('info', function(info) {
    console.log('Download started')
    console.log('filename: ' + info._filename)
    console.log('size: ' + info.size)
    info.formats.filter(f=>f.width).map(f=>console.log(`format_id = ${f.format_id} width = ${f.width} height = ${f.height}`))
    fs.writeFileSync('youtubefileinfo.json', JSON.stringify(info));
  })
  // Download Video
  video.pipe(fs.createWriteStream(saveFileName))
}

// Extract Telemetry
const extractTelemetry = (fileName) => {
  const file = fs.readFileSync(fileName);
  gpmfExtract(file).then(res => {
    console.log('Length of data received:', res.rawData.length);
    console.log('Framerate of data received:', 1 / res.timing.frameDuration);
    // Do what you want with the data
    let telemetry = goproTelemetry(res);
    fs.writeFileSync('output_path.json', JSON.stringify(telemetry));
    console.log('Telemetry saved as JSON');
  });
}

// Extract frames info
const extractFramesInfo = async (fileName) => ffprobe(fileName, { path: ffprobeStatic.path })
  .then(function (info) {
    console.log(info);
    fs.writeFileSync('framesinfo.json', JSON.stringify(info));
    console.log('frames info saved as JSON');
  })
  .catch(function (err) {
    console.error(err);
});

// Extract frames by timestamps
const extractFramesByTimestamps = async function(fileName) {
    await extractFrames({
        input: fileName,
        output: 'frames/frame-%d.png',
        timestamps:['00:00:30', '00:01:00', '00:01:30', '00:02:00', '00:02:01']
    });
}

const youTubeId=`eZBI1dZ9-RQ`
const youTubeFileName = `${youTubeId}.mp4`


getYouTubeVideo(youTubeId,youTubeFileName)
extractTelemetry(youTubeFileName);
extractFramesInfo(youTubeFileName)
extractFramesByTimestamps(youTubeFileName);


