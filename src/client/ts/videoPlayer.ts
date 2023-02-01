import { ChangeEvent } from "react";

// variables
const video = document.querySelector("video") as HTMLVideoElement;
const playBtn = document.getElementById("play") as HTMLButtonElement;
const playBtnIcon = playBtn.querySelector("i") as HTMLElement;
const muteBtn = document.getElementById("mute") as HTMLButtonElement;
const muteBtnIcon = muteBtn.querySelector("i") as HTMLElement;
const currenTime = document.getElementById("currenTime") as HTMLSpanElement;
const volumeRange = document.getElementById("volume") as HTMLInputElement;
const timeline = document.getElementById("timeline") as HTMLInputElement;
const fullScreenBtn = document.getElementById(
  "fullScreen"
) as HTMLButtonElement;
const fullScreenIcon = fullScreenBtn.querySelector("i") as HTMLElement;
const videoContainer = document.getElementById(
  "videoContainer"
) as HTMLDivElement;
const videoControls = document.getElementById(
  "videoControls"
) as HTMLDivElement;

// initialize variables
let controlsTimeout: any; // setTimeout 반환 키
let controlsMovementTimeout: any; // setTimeout 반환 키
let volumeValue = 0.5;
video.volume = volumeValue;

/**
 * Handle play btn on click
 * @param {click play btn event} e
 */
const handlePlayClick = (e: Event) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList.add(video.paused ? "fas fa-play" : "fas fa-pause");
};

/**
 * Handle mute btn on click
 * @param {click mute btn event} e
 */
const handleMuteClick = (e: Event) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtnIcon.classList.add(
    video.muted ? "fas fa-volume-mute" : "fas fa-volume-up"
  );

  volumeRange.value = (video.muted ? 0 : volumeValue).toString();
};

/**
 * Handle volumn range on change
 * @param {volumn change input event} event
 */
const handleVolumeChange = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;

  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }
  volumeValue = Number(value);
  video.volume = volumeValue;
};

/**
 * Get current video time func
 * @param {video current } seconds
 * @returns
 */
const formatTime = (seconds: number) =>
  new Date(seconds * 1000).toISOString().slice(11, 19).slice(3, 8);

/**
 * Updating video time func
 */
const handleTimeUpdate = () => {
  currenTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime).toString();
};

/**
 * Updating video timeline progress bar func
 * @param {input range step changing event} event
 */
const handleTimelineChange = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  video.currentTime = Number(value);
};

/**
 * Get & exit full screen on click
 */
const handleFullscreen = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
    fullScreenIcon.classList.add("fas", "fa-expand");
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList.add("fas", "fa-compress");
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

export {};
