(() => {
  fetch("data.json")
    .then((res) => res.json())
    .then((data) => {
      getVideos(data);
      controls(data);
    })
    .catch((err) => console.log(err));
})();

const getVideos = (data) => {
  const root = document.querySelector("#root");
  const template = document.querySelector("template");
  data.forEach((item) => {
    const templateCopy = template.content.cloneNode(true);
    const id = item.videoName;
    const src = item.src;

    // video
    const video = templateCopy.querySelector("video");
    video.src = `videos/${src}`;

    // from range
    const from = templateCopy.querySelector(".from");
    from.setAttribute("min", 50);

    // // top range
    // const to = templateCopy.querySelector(".to");
    // to.setAttribute("data-id", id);

    // // play
    // const play = templateCopy.querySelector(".play");
    // play.setAttribute("data-id", id);
    root.appendChild(templateCopy);
  });
};

const controls = (data) => {
  const wrappers = document.querySelectorAll(".video-wrapper");

  wrappers.forEach((wrapper) => {
    const allVideos = document.querySelectorAll("video");
    const video = wrapper.querySelector("video");
    video.onloadedmetadata = function () {
      // play button
      const play = wrapper.querySelector(".play");
      play.addEventListener("click", () => {
        allVideos.forEach((video) => video.pause());
        video.play();
      });

      // FROM
      const from = wrapper.querySelector(".from");
      const fromLabel = wrapper.querySelector(".from-label");
      from.value = 0;
      from.max = video.duration;
      from.addEventListener("input", () => {
        allVideos.forEach((video) => video.pause());
        fromLabel.innerText = from.value;
        video.currentTime = from.value;
        video.play();
      });

      // TO
      const to = wrapper.querySelector(".to");
      const toLabel = wrapper.querySelector(".to-label");
      to.value = video.duration;
      to.max = video.duration;
      to.addEventListener("input", () => {
        allVideos.forEach((video) => video.pause());
        video.currentTime = to.value - 2;
        toLabel.innerText = to.value - 2;
        video.play();
      });
    };
  });
};
