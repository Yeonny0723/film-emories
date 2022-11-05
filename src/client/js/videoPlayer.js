// variables
const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const currenTime = document.getElementById("currenTime");
const volumeRange = document.getElementById("volume");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

// initialize variables
let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

/**
 * Handle play btn on click
 * @param {click play btn event} e 
 */
const handlePlayClick = (e) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

/**
 * Handle mute btn on click
 * @param {click mute btn event} e 
 */
const handleMuteClick = (e) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtnIcon.classList = video.muted
  ? "fas fa-volume-mute"
  : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

/**
 * Handle volumn range on change
 * @param {volumn change input event} event 
 */
const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }
  volumeValue = value;
  video.volume = value;
};

/**
 * Get current video time func
 * @param {video current } seconds 
 * @returns 
 */
const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().slice(11, 19).slice(3,8);

/**
 * Updating video time func
 */
const handleTimeUpdate = () => {
  currenTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

/**
 * Updating video timeline progress bar func
 * @param {input range step changing event} event 
 */
const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value; 
};

/**
 * Get & exit full screen on click
 */
const handleFullscreen = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
  }
};

/** Hide video controls on screen */
const hideControls = () => videoControls.classList.remove("showing");

/** Handle video controls hide & show movement */
const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};

/** Hide video controls on mouse leave */
const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
};

/** Add views count once after watching full video */
const handleEnded = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, {
    method: "POST",
  });
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("timeupdate", handleTimeUpdate);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullscreen);
video.addEventListener("ended", handleEnded);


// key shortcut for video
// window.addEventListener("keydown", (event) => {
//   if (event.code === 'Space'){
//     playBtn.click();
//   }
//   if (event.key === 'm' || event.key === 'M'){
//     muteBtn.click();
//   }
//   if (event.key === 'f' || event.key === 'F'){
//     fullScreenBtn.click();
//   }
// });