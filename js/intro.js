// Optional, once-per-tab-session introduction. Main content is never hidden or inert.
(() => {
  const overlay = document.querySelector('#entry-intro');
  if (!overlay) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  try {
    if (sessionStorage.getItem('ebellua-entry-seen')) { overlay.remove(); return; }
    sessionStorage.setItem('ebellua-entry-seen', '1');
  } catch { overlay.remove(); return; } // Storage unavailable: keep navigation unobstructed.
  if (motion.matches) { overlay.remove(); return; }
  const skip = overlay.querySelector('button');
  let timer;
  const finish = () => {
    const focused = overlay.contains(document.activeElement);
    clearTimeout(timer); overlay.remove();
    document.removeEventListener('keydown', keyboard);
    motion.removeEventListener('change', finish);
    if (focused) document.querySelector('#main-content')?.focus({preventScroll:true});
  };
  const keyboard = event => {
    if (event.key === 'Escape') { event.preventDefault(); finish(); }
    else if (event.key === 'Tab') { event.preventDefault(); skip.focus(); }
  };
  // Register timeout before showing anything; CSS also hides the cover after 2.2 seconds.
  timer = setTimeout(finish, 2300);
  try {
    const source = document.querySelector('.world-map img');
    if (source) {
      const image = document.createElement('img');
      image.alt = ''; image.decoding = 'async'; image.src = source.currentSrc || source.src;
      overlay.querySelector('.entry-art').append(image);
    }
    skip.addEventListener('click', finish);
    overlay.addEventListener('animationend', event => { if (event.target === overlay) finish(); });
    document.addEventListener('keydown', keyboard);
    motion.addEventListener('change', finish);
    overlay.hidden = false; skip.focus({preventScroll:true});
  } catch { finish(); }
})();
