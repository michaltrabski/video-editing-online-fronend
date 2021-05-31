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

  wrappers.forEach((wrapper) => {
    const placeholder = wrapper.querySelector(".obj");
    const allVideos = document.querySelectorAll("video");
    const video = wrapper.querySelector("video");

    const name = video.getAttribute("data-video");
    const obj = getObj(name);
    video.onloadedmetadata = function () {
      update(placeholder, obj);

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

      // FROM
      const from = wrapper.querySelector(".from");
      const fromLabel = wrapper.querySelector(".from-label");
      from.value = 0;
      from.max = video.duration;
      from.addEventListener("input", () => {
        allVideos.forEach((video) => video.pause());
        fromLabel.innerText = time(from.value);
        obj.from = from.value;
        update(placeholder, obj);
        video.currentTime = from.value;
      });
      from.addEventListener("click", () => video.play());

      // TO
      const to = wrapper.querySelector(".to");
      const toLabel = wrapper.querySelector(".to-label");
      to.value = video.duration;
      to.max = video.duration;
      to.addEventListener("input", () => {
        allVideos.forEach((video) => video.pause());
        toLabel.innerText = time(to.value);
        obj.to = to.value;
        update(placeholder, obj);
        video.currentTime = to.value - 2;
        // toLabel.style.transform = `translateX(${
        //   (to.value / to.clientWidth) * 100
        // }px`;
      });
      to.addEventListener("click", () => video.play());
    };
  });
};

const getObj = (name) => {
  const strFromStorage = localStorage.getItem(name);

  return strFromStorage
    ? JSON.parse(strFromStorage)
    : { name, from: null, to: null };
};

const update = (placeholder, obj) => {
  placeholder.innerText = JSON.stringify(obj, null, 2);
  localStorage.setItem(obj.name, JSON.stringify(obj));
};

const time = (sec) => {
  const minutes = Math.floor(sec / 60);
  const seconds = sec - minutes * 60;
  return `${minutes}:${seconds}`;
};
