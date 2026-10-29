if (window.location.pathname.endsWith("/index.html")) {
  try {
    const cleanPath = window.location.pathname.replace(/index\.html$/, "");
    window.history.replaceState(null, "", `${cleanPath}${window.location.search}${window.location.hash}`);
  } catch (error) {
    // Keep the rest of the site scripts running when viewed from file://.
  }
}

const slideshow = document.querySelector("[data-slideshow]");

if (slideshow) {
  const image = slideshow.querySelector(".slideshow-image");
  const count = slideshow.querySelector(".slide-count");
  const previous = slideshow.querySelector(".slide-previous");
  const next = slideshow.querySelector(".slide-next");
  const projectLink = slideshow.querySelector(".cover-project-link");
  const captionLink = slideshow.querySelector(".slide-caption a");
  const slides = [
    {
      source: "assets/slideshow/slide-01.jpg",
      alt: "Garment Printing Club Show 2 broadside graphic",
      href: "gpc/#unavoidable",
      label: "Garment Printing Club",
    },
    {
      source: "assets/slideshow/slide-02.jpg",
      alt: "ñ press screenprinting demonstration",
      href: "n_press/",
      label: "ñ press",
    },
    {
      source: "assets/slideshow/slide-03.jpg",
      alt: "White Heat publication cover",
      href: "white_heat/",
      label: "White Heat",
    },
    {
      source: "assets/slideshow/slide-04.jpg",
      alt: "Ink being pulled across a screen",
      href: "n_press/",
      label: "ñ press",
    },
    {
      source: "assets/slideshow/slide-05.jpg",
      alt: "CRUSHED! Bike grips product package",
      href: "crushed/",
      label: "CRUSHED! Bike grips",
    },
    {
      source: "assets/slideshow/slide-06.jpg",
      alt: "Pea Soup 3D model render",
      href: "3d_work/#models",
      label: "3D Work",
    },
    {
      source: "assets/slideshow/slide-07.jpg",
      alt: "Children watching a printing demonstration",
      href: "n_press/",
      label: "ñ press",
    },
    {
      source: "assets/slideshow/slide-08.jpg",
      alt: "Garment Printing Club Show 2 exhibition view",
      href: "gpc/#unavoidable",
      label: "Garment Printing Club",
    },
    {
      source: "assets/slideshow/slide-09.jpg",
      alt: "MassArt Statehouse Visit shirt documentation",
      href: "community_involvement/#mass-statehouse-visit-shirts",
      label: "Community Involvement",
    },
    {
      source: "assets/slideshow/slide-10.jpg",
      alt: "Multiple Formats workshop documentation",
      href: "n_press/#multiple-formats",
      label: "ñ press",
    },
  ];
  let current = 0;
  let autoplay;
  let touchStartX = 0;
  let touchStartY = 0;
  let requestedSlide = 0;
  const preloadedSlides = new Map();

  slides.forEach(({ source }) => {
    const preload = new Image();
    preload.src = source;
    preloadedSlides.set(source, preload);
  });

  const show = (nextIndex) => {
    const target = (nextIndex + slides.length) % slides.length;
    const slide = slides[target];
    const request = ++requestedSlide;
    const swapSlide = () => {
      if (request !== requestedSlide) return;
      current = target;
      image.src = slide.source;
      image.alt = slide.alt;
      if (projectLink) {
        projectLink.href = slide.href;
        projectLink.setAttribute("aria-label", `View ${slide.label} project`);
      }
      if (captionLink) {
        captionLink.href = slide.href;
        captionLink.textContent = slide.label;
      }
      if (count) {
        count.textContent = `${current + 1} / ${slides.length}`;
      }
    };
    const preload = preloadedSlides.get(slide.source);
    if (preload?.complete) {
      swapSlide();
      return;
    }
    if (preload) {
      preload.addEventListener("load", swapSlide, { once: true });
      preload.addEventListener("error", swapSlide, { once: true });
      return;
    }
    image.src = slide.source;
    image.addEventListener("load", swapSlide, { once: true });
    image.addEventListener("error", swapSlide, { once: true });
  };

  const startAutoplay = () => {
    window.clearInterval(autoplay);
    autoplay = window.setInterval(() => show(current + 1), 4200);
  };

  const changeSlide = (direction) => {
    show(current + direction);
    startAutoplay();
  };

  previous?.addEventListener("click", () => changeSlide(-1));
  next?.addEventListener("click", () => changeSlide(1));

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

const awardOverlayTrigger = document.querySelector("[data-award-overlay]");
const awardOverlay = document.querySelector("#award-words");

if (awardOverlayTrigger && awardOverlay) {
  if (window.location.hash === "#award-words") {
    try {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    } catch (error) {
      window.location.hash = "";
    }
  }

  const openAwardOverlay = () => {
    awardOverlay.classList.add("is-open");
    awardOverlay.setAttribute("aria-hidden", "false");
  };

  const closeAwardOverlay = () => {
    awardOverlay.classList.remove("is-open");
    awardOverlay.setAttribute("aria-hidden", "true");
  };

  awardOverlayTrigger.addEventListener("click", (event) => {
    event.preventDefault();
    openAwardOverlay();
  });

  awardOverlay.addEventListener("click", (event) => {
    closeAwardOverlay();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && awardOverlay.classList.contains("is-open")) {
      closeAwardOverlay();
    }
  });
}
