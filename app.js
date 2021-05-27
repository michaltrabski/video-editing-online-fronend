const videos = document.querySelectorAll("video");
const videos1 = document.querySelectorAll(".video-1");
const videos2 = document.querySelectorAll(".video-2");

const activeVideo = document.querySelector(".wrapper__video--active");

const btnPlay = document.querySelector(".play");
const btnPause = document.querySelector(".pause");
const btnVideo1 = document.querySelector(".btn-video1");
const btnVideo2 = document.querySelector(".btn-video2");

videos.forEach((video) => {
  video.addEventListener("click", function () {
    // videos.forEach((video) => video.classList.remove("active"));

    const clickedVideo = this;
    console.log(clickedVideo);
  });
});

btnPlay.addEventListener("click", () => {
  videos.forEach((video) => {
    video.currentTime = 200;
    video.play();
  });
});
btnPause.addEventListener("click", () => {
  videos.forEach((video) => video.pause());
});
btnVideo1.addEventListener("click", () => {
  videos.forEach((video) => video.classList.remove("active"));
  videos1.forEach((video) => video.classList.add("active"));
});
btnVideo2.addEventListener("click", () => {
  videos.forEach((video) => video.classList.remove("active"));
  videos2.forEach((video) => video.classList.add("active"));
});
