(() => {
  fetch("data.json")
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      getVideos(data);
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

    video.onloadedmetadata = function () {
      const { duration } = video;
      controls();
    };

    // // from range
    // const from = templateCopy.querySelector(".from");
    // from.setAttribute("data-id", id);

    // // top range
    // const to = templateCopy.querySelector(".to");
    // to.setAttribute("data-id", id);

    // // play
    // const play = templateCopy.querySelector(".play");
    // play.setAttribute("data-id", id);
    root.appendChild(templateCopy);
  });
};

const controls = () => {
  const wrappers = document.querySelectorAll(".video-wrapper");

  wrappers.forEach((wrapper) => {
    const allVideos = document.querySelectorAll("video");
    const video = wrapper.querySelector("video");

    const play = wrapper.querySelector(".play");
    play.addEventListener("click", () => {
      allVideos.forEach((video) => video.pause());
      video.play();
    });
    // console.log(id, video, play);
  });
};
