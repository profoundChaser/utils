<script setup lang="ts">
import { bigFileSlice, downloadByLink, calculateFileHash } from "./utils/file";
import { ref, reactive } from "vue";

const download = (url: string) => {
  console.log(url);
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.src = url;
  image.onload = function () {
    console.log(image.style);
    let canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 280;
    document.body.appendChild(canvas);
    const context = canvas.getContext("2d");
    if (context) {
      context.drawImage(image, 0, 0);
      let dataUrl = canvas.toDataURL();
      console.log(dataUrl);
    }
  };
};

const slice = () => {
  const filesDom = document.getElementById("file1");
  if (filesDom) {
    const files = (filesDom as any).files;
    const file = files[0];
    console.log(file, file.size);
    const uploadSize = 1024 * 1024 * 50;
    const arr = [];
    for (let i = 0; i < file.size; i += uploadSize) {
      const index = i / uploadSize + 1;
      console.log(index, uploadSize * index);
      arr.push(file.slice(i, uploadSize * index));
    }
    console.log("文件切片", arr);
    downloadFiles(arr, "mv");
  }
};

const merge = () => {
  const filesDom = document.getElementById("file2");
  if (filesDom) {
    const files = (filesDom as any).files;
    console.log(files);
    const arr = [...files].map((v) => {
      return v.slice(0, v.size);
    });
    const file = new File(arr, name);
    console.log("切片合并", file);
    downloadFile(file, "test.mp4");
  }
};

const downloadFiles = (arr, name) => {
  arr.forEach((v, i) => {
    downloadFile(v, name + "-" + i);
  });
};

const downloadFile = (v, name) => {
  const a = document.createElement("a");
  a.setAttribute("download", name + ".mp4");
  a.href = URL.createObjectURL(v);
  a.click();
};

/* test 分割的视频 */
const videoSrc = ref("");
const myVideo = ref<HTMLVideoElement>(null);
const uploadFile = (e) => {
  console.log(e.target.files);
  const fileReader = new FileReader();
  fileReader.readAsDataURL(e.target.files[0]);
  fileReader.onload = function (e) {
    console.log(e.target?.result);
    myVideo.value.src = e.target?.result;
    myVideo.value.addEventListener("load", () => {
      myVideo.value.play();
    });
  };
};

const mediaRecorder = ref<MediaRecorder>(null);
const chunks = ref([]);
const audioCtx = new AudioContext();
const canvas = ref<HTMLCanvasElement>(null);
const streamStore = ref<MediaStream>(null);
const audiSrc = ref("");
const audioRef = ref<HTMLAudioElement>(null);
const visualize = () => {
  // streamStore.value = stream
  //音源节点
  console.log(audioRef.value);
  const sourceNode = audioCtx.createMediaElementSource(audioRef.value);
  //分析节点
  const analyserNode = audioCtx.createAnalyser();
  // 定义长度
  analyserNode.fftSize = 256;
  // const bufferLength = analyserNode.frequencyBinCount;
  const bufferLength = analyserNode.fftSize;
  // 生成 fftSize 长度一半的 Uint8Array 数组
  const dataArray = new Uint8Array(bufferLength);
  console.log(dataArray);
  // 合并流数据
  sourceNode.connect(analyserNode);
  console.log("analyser", analyserNode);
  console.log("source", sourceNode);
  const ctx = canvas.value.getContext("2d");
  const W = canvas.value.width;
  const H = canvas.value.height;
  console.log(W, H);
  ctx.clearRect(0, 0, W, H);
  const draw = () => {
    requestAnimationFrame(draw);
    analyserNode.getByteTimeDomainData(dataArray);
    let barW = (W / bufferLength) * 2.5;
    let barHeight = 0;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] + 50;
      ctx.fillStyle = `rgb(${barHeight + 100},50,50)`;
      ctx.fillRect(x, H - barHeight / 2, barW, barHeight / 2);
      x += barW + 5;
    }
  };
  draw();
};

function onSuccess(stream) {
  let duration = 0;
  let startTime = 0;
  // visualize(stream)
  mediaRecorder.value = new MediaRecorder(stream, {
    audioBitsPerSecond: 250000,
  });
  mediaRecorder.value.start(10);
  mediaRecorder.value.ondataavailable = (event) => {
    chunks.value.push(event.data);
  };
  mediaRecorder.value.onstart = () => {
    startTime = new Date().getTime();
  };
  mediaRecorder.value.onstop = () => {
    duration = new Date().getTime() - startTime;
    console.log(chunks.value);
    let blob = new Blob(chunks.value, {
      type: "audio/webm",
    });
    audiSrc.value = URL.createObjectURL(blob);
    console.log(audiSrc.value);
    console.log(blob);
    visualize();
  };
}

const stop = () => {
  mediaRecorder.value.stop();
  // streamStore.value.getTracks(track=>track.stop())
  console.log(streamStore.value);
};

function onError() {}

const getUserMediaPermission = () => {
  if (navigator.mediaDevices.getUserMedia) {
    let constraints = { audio: true };
    window.navigator.mediaDevices
      .getUserMedia(constraints)
      .then(onSuccess, onError);
  }
};

const blob = new Blob(["wsq", "ewds"], { type: "text/plain" });
console.log(blob);
console.log(blob.stream());
console.log(await blob.text());
const sliceBlob = blob.slice(0, 5);
console.log(sliceBlob);
const blobUrl = URL.createObjectURL(blob);
console.log(blobUrl);
blob.text().then((res) => {
  console.log(res);
});
// 转成Arraybuffer
blob.arrayBuffer().then((res) => {
  console.log(res);
});

// const handle = await window.showSaveFilePicker({
//       suggestedName: filename,
//       types: [
//         {
//           description: "PNG file",
//           accept: {
//             "image/png": [".png"],
//           },
//         },
//         {
//           description: "Jpeg file",
//           accept: {
//             "image/jpeg": [".jpeg"],
//           },
//          },
//       ],
//      });

/*
进行大文件分片上传
*/
const getFile = async () => {
  const filesDom = document.getElementById("file1");
  if (filesDom) {
    const files = filesDom.files;
    const file = files[0];
    console.log(file);
    const chunks = bigFileSlice(file);
    console.log("chunks", chunks);
    //进行hash计算标识文件
    const hash = await calculateFileHash(chunks);
    console.log(hash);
    //先获取已经上传的数据量
    let fileData = chunks.map((blob, i) => ({
      fileHash: hash,
      file: blob,
      index: i,
      size: blob.size,
    }));
  }
};
</script>

<template>
  <div>
    <input type="file" id="file1" />
    <button @click="getFile">点击我上传</button>
  </div>
  <!-- <div>
    <input type="file" id="file2" multiple>
    <button @click="merge"></button>
  </div>
  <input type="file" id="file3" @change="uploadFile">
  <video :src="videoSrc" width="600" height="300" ref="myVideo" controls></video>
  <canvas width="600" height="300" ref="canvas"></canvas>
  <button @click="getUserMediaPermission">开始</button>
  <button @click="stop">结束</button>
  <audio :src="audiSrc" controls ref="audioRef"></audio> -->
  <!-- <router-view></router-view> -->
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
