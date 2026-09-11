(() => {
  "use strict";

  const page = document.querySelector(".ebellua-page");
  if (!page) return;
  const entries = [...page.querySelectorAll('.toc-list a[href^="#"]')]
    .map((link) => {
      try {
        return { link, target: document.getElementById(decodeURIComponent(link.hash.slice(1))) };
      } catch {
        return { link, target: null };
      }
    })
    .filter(({ target }) => target && page.contains(target))
    .sort((a, b) => a.target === b.target ? 0 :
      a.target.compareDocumentPosition(b.target) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
  if (!entries.length) return;

  let scheduled = false;
  const update = () => {
    scheduled = false;
    let current = entries[0];
    for (const entry of entries) {
      const margin = parseFloat(getComputedStyle(entry.target).scrollMarginTop) || 0;
      if (entry.target.getBoundingClientRect().top <= margin + 24) current = entry;
    }
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      current = entries[entries.length - 1];
    }
    entries.forEach(({ link }) => {
      const active = link === current.link;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  };

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  window.addEventListener("load", schedule);
  page.addEventListener("toggle", schedule, true);
  schedule();
})();
