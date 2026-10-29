(() => {
  const titles = [...document.querySelectorAll('.movie-title[data-poster]')];
  if (!titles.length) return;
  const preview = document.createElement('img');
  preview.className = 'movie-poster-preview';
  preview.alt = '';
  preview.setAttribute('aria-hidden', 'true');
  document.body.append(preview);
  let active;
  let pointer;
  const place = () => {
    if (!active || !pointer) return;
    const rowHeight = active.closest('li').getBoundingClientRect().height;
    const height = Math.min(rowHeight * 3.5, window.innerHeight - 24);
    preview.style.height = `${height}px`;
    const width = height * 2 / 3;
    const left = Math.min(pointer.x - width / 2, window.innerWidth - width - 12);
    const top = Math.min(pointer.y - height / 2, window.innerHeight - height - 12);
    preview.style.left = `${Math.max(12, left)}px`;
    preview.style.top = `${Math.max(12, top)}px`;
  };
  const hide = () => {
    active = null;
    preview.classList.remove('is-visible');
  };
  const show = (title, x, y) => {
    active = title;
    pointer = {x, y};
    preview.classList.remove('is-visible');
    preview.src = title.dataset.poster;
    place();
    if (preview.complete && preview.naturalWidth) preview.classList.add('is-visible');
  };
  preview.addEventListener('load', () => {
    if (active) preview.classList.add('is-visible');
  });
  preview.addEventListener('error', hide);
  titles.forEach(title => {
    title.addEventListener('pointerenter', event => {
      if (event.pointerType === 'touch') return;
      show(title, event.clientX, event.clientY);
    });
    title.addEventListener('pointermove', event => {
      if (active !== title) return;
      pointer = {x:event.clientX, y:event.clientY};
      place();
    });
    title.addEventListener('pointerleave', hide);
    title.addEventListener('focus', () => {
      const rect = title.getBoundingClientRect();
      show(title, rect.left, rect.top);
    });
    title.addEventListener('blur', hide);
  });
  document.addEventListener('keydown', event => {if (event.key === 'Escape') hide();});
  window.addEventListener('scroll', () => {
    if (active && document.activeElement === active) {
      const rect = active.getBoundingClientRect();
      pointer = {x:rect.left, y:rect.top};
      place();
    } else hide();
  }, {passive:true});
  window.addEventListener('resize', hide);
})();
