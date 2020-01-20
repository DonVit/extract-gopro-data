## Setup and Run

Run the following commands:

`npm install`

`node index.js`

## Extract Frames

ffmpeg -i GH040633.MP4 -r 1/1 one2one-%03d.png

ffmpeg -i GH040633.MP4 -r 1 -f image2 foo-%03d.jpeg

## Extract Frames Info

ffprobe -show_frames sample/GH040633.MP4


## Docs

[Examples](https://www.binpress.com/generate-video-previews-ffmpeg/)