import "./GIFEncoder";
import "./NeuQuant";
import "./LZWEncoder";

function encode64(input) {
  var output = "",
    i = 0,
    l = input.length,
    key = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    chr1,
    chr2,
    chr3,
    enc1,
    enc2,
    enc3,
    enc4;
  while (i < l) {
    chr1 = input.charCodeAt(i++);
    chr2 = input.charCodeAt(i++);
    chr3 = input.charCodeAt(i++);
    enc1 = chr1 >> 2;
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    enc4 = chr3 & 63;
    if (isNaN(chr2)) enc3 = enc4 = 64;
    else if (isNaN(chr3)) enc4 = 64;
    output =
      output +
      key.charAt(enc1) +
      key.charAt(enc2) +
      key.charAt(enc3) +
      key.charAt(enc4);
  }
  return output;
}

//初始化一个video
export function initVideo(src) {
  const video = document.createElement("video");
  video.setAttribute("crossorigin", "anonymous");
  video.setAttribute("src", src);
  video.autoplay = true;
  video.muted = true;
  video.loop = false;
  return video;
}

/**
 * 视频转成gif处理
 * @param src string
 */
export function initVideoToGif(src,video) {
  const video = video || initVideo(src);
  const exportGif = {
    videoW: 0,
    videoH: 0,
    //分割后的文件块
    chunks: [],
    encoder: null,
  };
  video.onloadeddata = () => {
    exportGif.videoW = video.videoWidth;
    exportGif.videoH = video.videoHeight;
  };
  video.oncanplay = () => {
    exportGif.encoder = new GIFEncoder(exportGif.videoW, exportGif.videoH);
    exportGif.encoder.setRepeat(0);
    exportGif.encoder.setDelay(500);
    video.play();
    exportGif.encoder.start();
    const canvas = document.createElement("canvas");
    canvas.setAttribute("crossorigin", "anonymous");
    canvas.width = exportGif.videoW;
    canvas.height = exportGif.videoH;
    const ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);
    const render = function () {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      exportGif.encoder.addFrame(ctx);
      //转换后是base64的字符串
      canvas.toDataURL();
      requestAnimationFrame(render);
    };
    render();
  };

  video.onended = () => {
    exportGif.encoder.finish();
    const fileType = "image/gif";
    const readableStream = exportGif.encoder.stream();
    console.log(readableStream);
    const binary_gif = readableStream.getData();
    const b64Str = "data:" + fileType + ";base64," + encode64(binary_gif);
    console.log(b64Str);
    // const a = document.createElement("a");
    // a.download = "test";
    // a.href = b64Str;
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a)
    exportGif.encoder.download()
  };

  //自定义用户点击结束时的情况
  video.onpause = () => {
    exportGif.encoder.finish();
    const fileType = "image/gif";
    const readableStream = exportGif.encoder.stream();
    console.log(readableStream);
    const binary_gif = readableStream.getData();
    const b64Str = "data:" + fileType + ";base64," + encode64(binary_gif);
    console.log(b64Str);
    const a = document.createElement("a");
    a.download = "test";
    a.href = b64Str;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a)
  }
}
