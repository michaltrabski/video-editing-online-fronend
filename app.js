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
    video.src = `videos/${file.name}`;
    video.setAttribute("data-video", file.name);
    root.appendChild(templateCopy);
  });
};

const controls = (files) => {
  const wrappers = document.querySelectorAll(".video-wrapper");
  const masterObj = {};

  wrappers.forEach((wrapper, i) => {
    // wrapper.addEventListener("click", () => {
    //   console.log("change => recreate list");
    //   console.log(videoObj);
    // });
    const placeholder = wrapper.querySelector(".obj");
    const allVideos = document.querySelectorAll("video");
    const video = wrapper.querySelector("video");

    const name = video.getAttribute("data-video");
    const videoObj = getObj(name);
    videoObj.order = i;
    video.onloadedmetadata = function () {
      updateObj(placeholder, videoObj, masterObj);
      video.currentTime = videoObj.from;

      // FROM
      const from = wrapper.querySelector(".from");
      from.value = videoObj.from || 0;
      from.max = video.duration;

      const fromLabel = wrapper.querySelector(".from-label");
      fromLabel.innerText = time(from.value);

      from.addEventListener("input", () => {
        allVideos.forEach((video) => video.pause());
        fromLabel.innerText = time(from.value);
        videoObj.from = from.value;
        updateObj(placeholder, videoObj, masterObj);
        video.currentTime = from.value;
      });
      from.addEventListener("click", () => video.play());

      // TO
      const to = wrapper.querySelector(".to");
      to.value = videoObj.to || video.duration;
      to.max = video.duration;

      const toLabel = wrapper.querySelector(".to-label");
      toLabel.innerText = time(to.value);
      // toLabel.style.left = "calc(200px +200px)";
      to.addEventListener("input", () => {
        allVideos.forEach((video) => video.pause());
        toLabel.innerText = time(to.value);

        videoObj.to = to.value;
        updateObj(placeholder, videoObj, masterObj);
        video.currentTime = to.value - 2;
      });
      to.addEventListener("click", () => video.play());

      // PLAY
      const play = wrapper.querySelector(".play");
      play.addEventListener("click", () => {
        allVideos.forEach((video) => video.pause());
        video.play();
      });

      // PAUSE
      const pause = wrapper.querySelector(".pause");
      pause.addEventListener("click", () => {
        video.pause();
      });
    };
  });
};

const getObj = (name) => {
  const strFromStorage = localStorage.getItem(name);

  return strFromStorage
    ? JSON.parse(strFromStorage)
    : { name, from: null, to: null };
};

const updateObj = (placeholder, videoObj, masterObj) => {
  placeholder.innerText = JSON.stringify(videoObj, null, 2);
  localStorage.setItem(videoObj.name, JSON.stringify(videoObj));

  masterObj[videoObj.name] = videoObj;
  console.log("masterObj", masterObj);
};

const time = (sec) => {
  const minutes = Math.floor(sec / 60);
  const seconds = sec - minutes * 60;
  return `${minutes}:${seconds}`;
};
