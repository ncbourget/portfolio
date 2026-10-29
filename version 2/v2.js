(() => {
  const filters = [...document.querySelectorAll('[data-filter]')];
  const views = [...document.querySelectorAll('[data-view]')];
  const grid = document.querySelector('.archive-grid');
  const index = document.querySelector('.archive-index');
  const count = document.querySelector('#archive-count');
  if (grid) {
    function sizeArchive() {
      const style = getComputedStyle(grid);
      const columns = style.gridTemplateColumns.split(' ').length;
      const tiles = grid.querySelectorAll('.archive-item');
      if (!tiles.length) return;
      const ratio = getComputedStyle(tiles[0]).aspectRatio.split('/').map(Number);
      const aspect = ratio[0] / (ratio[1] || 1);
      const columnGap = parseFloat(style.columnGap) || 0;
      const rowGap = parseFloat(style.rowGap) || 0;
      const rows = Math.ceil(tiles.length / columns);
      const tileWidth = (grid.clientWidth - columnGap * (columns - 1)) / columns;
      grid.style.minHeight = `${rows * tileWidth / aspect + (rows - 1) * rowGap}px`;
    }
    sizeArchive();
    new ResizeObserver(sizeArchive).observe(grid);
  }
  let filter = 'All';
  function applyFilter(value) {
    filter = value;
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === value)));
    document.querySelectorAll('.archive-item,.index-row').forEach(item => {
      item.hidden = value !== 'All' && item.dataset.category !== value;
    });
    const projects = document.querySelectorAll('.index-row:not([hidden])').length;
    if (count) count.textContent = `${projects} ${projects === 1 ? 'project' : 'projects'}`;
  }
  filters.forEach(button => button.addEventListener('click', () => applyFilter(button.dataset.filter)));
  views.forEach(button => button.addEventListener('click', () => {
    const isIndex = button.getAttribute('aria-pressed') !== 'true';
    grid.hidden = isIndex;
    index.hidden = !isIndex;
    button.setAttribute('aria-pressed', String(isIndex));
  }));
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let slidesPaused = motion.matches;
  motion.addEventListener('change', event => {
    slidesPaused = event.matches;
  });
  document.querySelectorAll('[data-tile-slideshow]').forEach((tile, tileNumber) => {
    const images = [...tile.querySelectorAll('.archive-slide')];
    let current = 0;
    let interacting = false;
    const show = next => {
      current = next;
      images.forEach((image, i) => {
        image.classList.toggle('is-active', i === current);
        image.setAttribute('aria-hidden', String(i !== current));
      });
    };
    tile.addEventListener('mouseenter', () => { interacting = true; });
    tile.addEventListener('mouseleave', () => { interacting = false; });
    window.setInterval(() => {
      if (slidesPaused || document.hidden || tile.hidden || grid?.hidden || interacting || tile.contains(document.activeElement)) return;
      const rect = tile.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const next = (current + 1) % images.length;
      if (images[next].complete && images[next].naturalWidth) show(next);
    }, 3050 + tileNumber * 230);
  });
  if (grid && ['#about', '#contact', '#award-words'].includes(location.hash)) {
    location.replace(`info.html${location.hash}`);
  }
  const award = document.querySelector('#award-words');
  const trigger = document.querySelector('[data-award-overlay]');
  if (award && trigger) {
    const close = award.querySelector('.award-close');
    const hide = () => {
      award.classList.remove('is-open');
      award.setAttribute('aria-hidden', 'true');
      document.documentElement.classList.remove('dialog-open');
      trigger.focus();
    };
    trigger.addEventListener('click', () => {
      award.classList.add('is-open');
      award.setAttribute('aria-hidden', 'false');
      award.setAttribute('aria-modal', 'true');
      document.documentElement.classList.add('dialog-open');
      close.focus();
    });
    close.addEventListener('click', hide);
    award.addEventListener('click', event => { if (event.target === award) hide(); });
    award.addEventListener('keydown', event => {
      if (event.key === 'Escape') hide();
      if (event.key === 'Tab') { event.preventDefault(); close.focus(); }
    });
  }
  const chapterLinks = [...document.querySelectorAll('.project-index-links a')];
  if (chapterLinks.length) {
    const chapters = [...document.querySelectorAll('.project-chapter[id]')];
    const chapterObserver = new IntersectionObserver(entries => {
      const visible = entries.find(entry => entry.isIntersecting);
      if (!visible) return;
      chapterLinks.forEach(link => {
        if (link.hash === `#${visible.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, {rootMargin: '-5% 0px -65% 0px'});
    chapters.forEach(chapter => chapterObserver.observe(chapter));
  }
  const lightbox = document.querySelector('.image-lightbox');
  if (lightbox) {
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Project image preview');
    let origin;
    document.querySelectorAll('.zoomable-image').forEach(image => {
      image.addEventListener('click', () => { origin = image; });
      image.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') origin = image;
      });
    });
    new MutationObserver(() => {
      if (lightbox.getAttribute('aria-hidden') === 'true') origin?.focus({preventScroll:true});
    }).observe(lightbox, {attributes:true, attributeFilter:['aria-hidden']});
    lightbox.addEventListener('keydown', event => {
      if (event.key === 'Tab') {event.preventDefault(); lightbox.querySelector('button').focus();}
    });
  }
})();
