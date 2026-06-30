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
    ["n_press/images/iaritza_open_studio/©IaritzaMenjivar-8844.JPG", "ñ press publication and printed matter"],
    ["n_press/images/iaritza_open_studio/©IaritzaMenjivar-8405.JPG", "ñ press screenprinting demonstration"],
    ["n_press/images/iaritza_open_studio/©IaritzaMenjivar-8476.JPG", "Ink being pulled across a screen"],
    ["n_press/images/iaritza_open_studio/©IaritzaMenjivar-8597.JPG", "Children watching a printing demonstration"],
    ["n_press/images/iaritza_open_studio/©IaritzaMenjivar-8357.JPG", "Hands preparing a screen for printing"],
    ["n_press/images/iaritza_open_studio/©IaritzaMenjivar-8741.JPG", "ñ press workshop environment"],
    ["n_press/images/iaritza_open_studio/©IaritzaMenjivar-8563.JPG", "ñ press printing process"],
    ["n_press/images/iaritza_open_studio/©IaritzaMenjivar-8842.JPG", "ñ press printed matter"],
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

const zoomableImages = Array.from(document.querySelectorAll(".project-images img"));

if (zoomableImages.length) {
  const lightbox = document.createElement("div");
  lightbox.className = "image-lightbox";
  lightbox.setAttribute("aria-hidden", "true");
  lightbox.innerHTML = `
    <button class="image-lightbox-close" type="button" aria-label="Close image">×</button>
    <figure class="image-lightbox-frame">
      <img alt="">
    </figure>
  `;

  document.body.append(lightbox);

  const lightboxImage = lightbox.querySelector("img");
  const closeButton = lightbox.querySelector(".image-lightbox-close");

  const openLightbox = (image) => {
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || "";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("lightbox-open");
    closeButton.focus({ preventScroll: true });
  };

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("lightbox-open");
    lightboxImage.removeAttribute("src");
  };

  zoomableImages.forEach((image) => {
    image.classList.add("zoomable-image");
    image.setAttribute("tabindex", "0");
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", image.alt ? `Open larger image: ${image.alt}` : "Open larger image");

    image.addEventListener("click", () => openLightbox(image));
    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(image);
      }
    });
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox || event.target === closeButton) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });
}
