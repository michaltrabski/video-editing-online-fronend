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
    const objPlace = wrapper.querySelector(".obj");
    const obj = { name: "", from: null, to: null };
    const allVideos = document.querySelectorAll("video");
    const video = wrapper.querySelector("video");
    video.onloadedmetadata = function () {
      obj.name = video.getAttribute("data-video");

      objPlace.innerText = JSON.stringify(obj, null, 2);

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
        objPlace.innerText = JSON.stringify(obj, null, 2);
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
        objPlace.innerText = JSON.stringify(obj, null, 2);
        video.currentTime = to.value - 2;
        // toLabel.style.transform = `translateX(${
        //   (to.value / to.clientWidth) * 100
        // }px`;
      });
      to.addEventListener("click", () => video.play());
    };
  });
};

const time = (sec) => {
  const minutes = Math.floor(sec / 60);
  const seconds = sec - minutes * 60;
  return `${minutes}:${seconds}`;
};
