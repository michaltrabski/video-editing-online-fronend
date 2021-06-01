const objTemplate = {
  videoName: "",
  from: null,
  to: null,
  order: null,
  wholeVideoDuration: null,
  trimedVideoDuration: null,
};

(() => {
  fetch("files.json")
    .then((res) => res.json())
    .then((files) => {
      getVideos(files);
      controls(files);
    })
    .catch((err) => console.log(err));
})();

const getVideos = (files) => {
  const root = document.querySelector("#root");
  const template = document.querySelector("template");
  files.forEach((file) => {
    const templateCopy = template.content.cloneNode(true);
    const video = templateCopy.querySelector("video");
    video.src = `videos/${file.videoName}`;
    video.setAttribute("data-video", file.videoName);
    root.appendChild(templateCopy);
  });
};

const controls = (files) => {
  const wrappers = document.querySelectorAll(".video-wrapper");
  const masterObj = {};

  wrappers.forEach((wrapper, i) => {
    const placeholder = wrapper.querySelector(".obj");
    const allVideos = document.querySelectorAll("video");
    const video = wrapper.querySelector("video");

    const videoName = video.getAttribute("data-video");
    const videoObj = getObj(videoName);
    videoObj.order = i;
    video.onloadedmetadata = function () {
      updateObj(placeholder, videoObj, masterObj);
      video.currentTime = videoObj.from;

      const { duration } = video;
      videoObj.wholeVideoDuration = duration;

      ///////////////////////////////////////////////////////////
      // FROM
      {
        const from = wrapper.querySelector(".from");
        from.value = videoObj.from || 0;
        from.max = duration;

        const fromLabel = wrapper.querySelector(".from-label");
        fromLabel.innerText = time(from.value);
        fromLabel.style.left = `${(from.value / from.max) * 100}%`;
        from.addEventListener("input", () => {
          allVideos.forEach((video) => video.pause());
          fromLabel.innerText = time(from.value);
          fromLabel.style.left = `${(from.value / from.max) * 100}%`;
          videoObj.from = from.value;
          updateObj(placeholder, videoObj, masterObj);
          video.currentTime = from.value;
        });
        from.addEventListener("click", () => video.play());
      }

      ///////////////////////////////////////////////////////////
      // TO
      {
        const to = wrapper.querySelector(".to");
        to.value = videoObj.to || video.duration;
        to.max = duration;

        const toLabel = wrapper.querySelector(".to-label");
        toLabel.innerText = time(to.value);
        toLabel.style.left = `${(to.value / to.max) * 100}%`;
        to.addEventListener("input", () => {
          allVideos.forEach((video) => video.pause());

          const val = duration - to.value < 1 ? duration : to.value;
          toLabel.innerText = time(val);
          toLabel.style.left = `${(to.value / to.max) * 100}%`;
          videoObj.to = val;
          updateObj(placeholder, videoObj, masterObj);
          video.currentTime = val - 2;
        });
        to.addEventListener("click", () => video.play());
      }

      ///////////////////////////////////////////////////////////
      // PLAY
      const play = wrapper.querySelector(".play");
      play.addEventListener("click", () => {
        allVideos.forEach((video) => video.pause());
        video.play();
      });

      ///////////////////////////////////////////////////////////
      // PAUSE
      const pause = wrapper.querySelector(".pause");
      pause.addEventListener("click", () => video.pause());

      // DUPLICATE
      // const duplicate = wrapper.querySelector(".duplicate");
      // duplicate.addEventListener("click", () => {
      //   // console.log(video);

      //   const videoWrapper = video.closest(".video-wrapper");
      //   const videoWrapperCopy = videoWrapper.cloneNode(true);
      //   // console.log(videoWrapper);

      //   videoWrapper.after(videoWrapperCopy);
      // });
    };
  });
};

const getObj = (videoName) => {
  const strFromStorage = localStorage.getItem(videoName);

  return strFromStorage
    ? JSON.parse(strFromStorage)
    : { ...objTemplate, videoName };
};

const updateObj = (placeholder, videoObj, masterObj) => {
  const newVideoObj = { ...videoObj };
  newVideoObj.trimedVideoDuration = newVideoObj.to - newVideoObj.from;

  placeholder.innerText = JSON.stringify(newVideoObj, null, 2);
  localStorage.setItem(newVideoObj.videoName, JSON.stringify(newVideoObj));

  masterObj[newVideoObj.videoName] = newVideoObj;
  // console.log("masterObj", masterObj);

  const allVideosArray = Object.values(masterObj);
  const allVideosArraySorted = allVideosArray.sort((a, b) => a.order - b.order);
  document.getElementById("result").value =
    JSON.stringify(allVideosArraySorted);
};

const time = (sec) => {
  const minutes = Math.floor(sec / 60);
  const seconds = sec - minutes * 60;
  return seconds < 10
    ? `${minutes}:0${seconds.toFixed(1)}`
    : `${minutes}:${seconds.toFixed(1)}`;
};
