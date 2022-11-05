// libaries import
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

// variables
// For coloring frame
const colors = document.getElementsByClassName("color");
// For video recording
const actionBtn = document.getElementById("actionBtn");
const pauseBtn = document.getElementById("pauseBtn");
const stopBtn = document.getElementById("stopBtn");
const resumeBtn = document.getElementById("resumeBtn");
const video = document.getElementById("preview");
const frame1 = document.getElementsByClassName("frame1")[1];
const frame2 = document.getElementsByClassName("frame2")[1];
const frame3 = document.getElementsByClassName("frame3")[1];
const frame4 = document.getElementsByClassName("frame4")[1];
const imgDownloadBtn = document.getElementById("download-img");
const videoDownloadBtn = document.getElementById("download-video");
const completeBtn = document.getElementById("completeBtn");

// initialize vairbles for recorder
let stream;
let recorder;
let videoFile;
let videoUrl
const count = 3 // timer
const total_take = 4 // total number of photoshoot
const videoName = "film-emories.mp4"; // user download video filename
const photoName = "film-emories.png" // user download img filename


/**
 * Coloring frame on click func
 * @param {pick frane color event} e 
 */
const handleColorChange = async(e) => {
  const color = "#" + e.target.dataset.color;
  var frames = document.getElementsByClassName("frame-container")
  var frames_arr = [...frames]; // convert nodelist to array
  frames_arr.forEach((frame)=>{
    frame.style.backgroundColor = color
  });
}

/**
 * Download file func
 * @param {browser created file downloadable url} fileUrl 
 * @param {custom file name}} fileName 
 */
const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
};

/** Download video */
const downloadVideo = () => {
  downloadFile(videoUrl,  videoName);
}

/** Download photo */
const downloadPhoto = () => {
  // target: an element you are going to capture 
  const target = document.getElementsByClassName("capture_area")[1];
  html2canvas(target).then(function(canvas){
    var myImage = canvas.toDataURL();
    downloadFile(myImage, photoName) 
  });
}

// Filenames you want to name to while using ffmpeg 
const files = {
  input: "recording.webm",
  output: "output.mp4",
  thumb1: "film-emories_1.jpg",
  thumb2: "film-emories_2.jpg",
  thumb3: "film-emories_3.jpg",
  thumb4: "film-emories_4.jpg",
};

const processRecordedData = async() => {
  actionBtn.removeEventListener("click", processRecordedData);
  actionBtn.innerText = "This could take up to a min...";
  actionBtn.disabled = true;

  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();``
  ffmpeg.FS('writeFile', files.input, await fetchFile(videoFile));
  await ffmpeg.run('-i', files.input, '-r', '60', files.output);

  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:02",
    "-frames:v",
    "1",
    files.thumb1,
  );
  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:05",
    "-frames:v",
    "1",
    files.thumb2,
  );
  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:08",
    "-frames:v",
    "1",
    files.thumb3,
  );
  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:11",
    "-frames:v",
    "1",
    files.thumb4,
  );
  
  const mp4File = ffmpeg.FS("readFile", files.output);
  const thumbFile1 = ffmpeg.FS("readFile", files.thumb1);
  const thumbFile2 = ffmpeg.FS("readFile", files.thumb2);
  const thumbFile3 = ffmpeg.FS("readFile", files.thumb3);
  const thumbFile4 = ffmpeg.FS("readFile", files.thumb4);

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob1 = new Blob([thumbFile1.buffer], { type: "image/jpg" });
  const thumbBlob2 = new Blob([thumbFile2.buffer], { type: "image/jpg" });
  const thumbBlob3 = new Blob([thumbFile3.buffer], { type: "image/jpg" });
  const thumbBlob4 = new Blob([thumbFile4.buffer], { type: "image/jpg" });

  // download images
  videoUrl = URL.createObjectURL(mp4Blob);
  const thumbUrl1 = URL.createObjectURL(thumbBlob1);
  const thumbUrl2 = URL.createObjectURL(thumbBlob2);
  const thumbUrl3 = URL.createObjectURL(thumbBlob3);
  const thumbUrl4 = URL.createObjectURL(thumbBlob4);

  const img1 = document.createElement("img");
  img1.src = thumbUrl1;
  frame1.appendChild(img1);
  const img2 = document.createElement("img");
  img2.src = thumbUrl2
  frame2.appendChild(img2);
  const img3 = document.createElement("img");
  img3.src = thumbUrl3
  frame3.appendChild(img3);
  const img4 = document.createElement("img");
  img4.src = thumbUrl4
  frame4.appendChild(img4);

  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumb1);
  ffmpeg.FS("unlink", files.thumb2);
  ffmpeg.FS("unlink", files.thumb3);
  ffmpeg.FS("unlink", files.thumb4);

  // revoke html created blob link for speed improvement
  // URL.revokeObjectURL(videoUrl);
  // URL.revokeObjectURL(thumbUrl1);
  // URL.revokeObjectURL(thumbUrl2);
  // URL.revokeObjectURL(thumbUrl3);
  // URL.revokeObjectURL(thumbUrl4);
  // URL.revokeObjectURL(videoFile);

  actionBtn.disabled = false;
  actionBtn.innerText = "Record Again";
  take = total_take;
  actionBtn.addEventListener("click", handleStart);
  completeBtn.classList.remove("hide");
};

const handleStop = () => {
  // console.log("stopped!")
  recorder.stop();
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
    actionBtn.innerText = "Click to continue!";
    actionBtn.disabled = false;
    actionBtn.addEventListener("click", processRecordedData);
  }
}

/**
 * JS sleeping func
 * @param {milliseconds} ms 
 * @returns 
 */
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Remaining time updating func
 */
const timer = async() => {
  for (let i=count; i>0; i--){
    actionBtn.innerHTML = i
    await sleep(1000);
  }
}

const timeOut = 1200 * count // we set timeout per 1200m considering js built-in delay
let take = 1; // the variable to tell which number of photos they are out of total_take

/**
 * Handling video pause func
 */
const handlePause = () => {
  // console.log("paused!")
  actionBtn.disabled = false;
  recorder.pause();
  actionBtn.removeEventListener("click", handleStart);
  actionBtn.addEventListener("click", handleResume);
  if (take === total_take){
    actionBtn.innerText = "Final take" + " 👆"
  } else {
    actionBtn.innerText = "Take " + String(take) + " 👆"
  }
}

/**
 * Handling resume video func
 */
const handleResume = () => {
  // console.log("resumed!")
  // if it is the last take
  if (take === total_take) {
    actionBtn.removeEventListener("click", handleResume);
    setTimeout(()=>{stopBtn.click();}, timeOut);
    timer();
    actionBtn.disabled = true;
    recorder.resume();
  } else {
    setTimeout(()=>{pauseBtn.click();}, timeOut);
    timer();
    actionBtn.disabled = true;
    recorder.resume();
    actionBtn.removeEventListener("click", handleResume);
    actionBtn.addEventListener("click", handlePause);
    take += 1;
  }
}

/**
 * Handle start video recording func
 */
const handleStart = () => {
  recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  setTimeout(()=>{pauseBtn.click();}, timeOut);
  timer(); // initiate timer
  actionBtn.disabled = true;
  recorder.start(); // start recording video
  take += 1;
};

/**
 * Init video recording func
 */
const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      width: 1024,
      height: 576,
    },
  });
  video.srcObject = stream;
  video.play();
};
init();



// Add event listeners to each color
Array.from(colors).forEach((color)=>{
  color.addEventListener("click", handleColorChange)
})

// Add event listeners for recording
actionBtn.addEventListener("click", handleStart);
pauseBtn.addEventListener("click", handlePause);
stopBtn.addEventListener("click", handleStop);
resumeBtn.addEventListener("click", handleResume);

imgDownloadBtn.addEventListener("click", downloadPhoto);
videoDownloadBtn.addEventListener("click", downloadVideo);