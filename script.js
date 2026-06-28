if (window.location.pathname.endsWith("/index.html")) {
  const cleanPath = window.location.pathname.replace(/index\.html$/, "");
  window.history.replaceState(null, "", `${cleanPath}${window.location.search}${window.location.hash}`);
}

const slideshow = document.querySelector("[data-slideshow]");

if (slideshow) {
  const image = slideshow.querySelector(".slideshow-image");
  const count = slideshow.querySelector(".slide-count");
  const previous = slideshow.querySelector(".slide-previous");
  const next = slideshow.querySelector(".slide-next");
  const slides = [
    ["images/n_press/iaritza_open_studio/©IaritzaMenjivar-8844.JPG", "ñ press publication and printed matter"],
    ["images/n_press/iaritza_open_studio/©IaritzaMenjivar-8405.JPG", "ñ press screenprinting demonstration"],
    ["images/n_press/iaritza_open_studio/©IaritzaMenjivar-8476.JPG", "Ink being pulled across a screen"],
    ["images/n_press/iaritza_open_studio/©IaritzaMenjivar-8597.JPG", "Children watching a printing demonstration"],
    ["images/n_press/iaritza_open_studio/©IaritzaMenjivar-8357.JPG", "Hands preparing a screen for printing"],
    ["images/n_press/iaritza_open_studio/©IaritzaMenjivar-8741.JPG", "ñ press workshop environment"],
    ["images/n_press/iaritza_open_studio/©IaritzaMenjivar-8563.JPG", "ñ press printing process"],
    ["images/n_press/iaritza_open_studio/©IaritzaMenjivar-8842.JPG", "ñ press printed matter"],
  ];
  let current = 0;
  let autoplay;
  let touchStartX = 0;
  let touchStartY = 0;

  const show = (nextIndex) => {
    current = (nextIndex + slides.length) % slides.length;
    image.src = slides[current][0];
    image.alt = slides[current][1];
    count.textContent = `${current + 1} / ${slides.length}`;
  };

  const startAutoplay = () => {
    window.clearInterval(autoplay);
    autoplay = window.setInterval(() => show(current + 1), 4500);
  };

  const changeSlide = (direction) => {
    show(current + direction);
    startAutoplay();
  };

  slides.forEach(([source]) => {
    const preload = new Image();
    preload.src = source;
  });

  previous.addEventListener("click", () => changeSlide(-1));
  next.addEventListener("click", () => changeSlide(1));

  slideshow.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
    touchStartY = event.changedTouches[0].clientY;
  }, { passive: true });

  slideshow.addEventListener("touchend", (event) => {
    const distanceX = event.changedTouches[0].clientX - touchStartX;
    const distanceY = event.changedTouches[0].clientY - touchStartY;

    if (Math.abs(distanceX) > 45 && Math.abs(distanceX) > Math.abs(distanceY)) {
      changeSlide(distanceX < 0 ? 1 : -1);
    }
  }, { passive: true });

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") changeSlide(-1);
    if (event.key === "ArrowRight") changeSlide(1);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.clearInterval(autoplay);
    } else {
      startAutoplay();
    }
  });

  startAutoplay();
}
