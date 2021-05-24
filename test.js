const ytdl = require("ytdl-core");
const decoder = require('lame').Decoder
const speaker = require('speaker')


ytdl("https://www.youtube.com/watch?v=UKGnIKODsTc")
.pipe(decoder())
.pipe(speaker());
