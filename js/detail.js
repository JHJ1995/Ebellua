(() => {
  "use strict";

  const page = document.querySelector(".ebellua-page");
  if (!page) return;
  const toc = page.querySelector("details.toc-panel");
  const compact = window.matchMedia("(max-width: 1199px)");

  const syncToc = () => {
    if (!toc) return;
    if (compact.matches && toc.contains(document.activeElement)) {
      toc.querySelector("summary")?.focus();
    }
    toc.open = !compact.matches;
  };
  compact.addEventListener("change", syncToc);
  syncToc();

  const findTarget = (hash) => {
    if (!hash || hash === "#") return null;
    try {
      return document.getElementById(decodeURIComponent(hash.slice(1)));
    } catch {
      return null;
    }
  };

  const reveal = (target) => {
    for (let node = target; node && node !== page.parentElement; node = node.parentElement) {
      if (node instanceof HTMLDetailsElement) node.open = true;
    }
  };

  const visitHash = (focus = false) => {
    const target = findTarget(window.location.hash);
    if (!target || !page.contains(target)) return;
    reveal(target);
    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "auto", block: "start" });
      if (!focus) return;
      const focusTarget = target instanceof HTMLDetailsElement
        ? target.querySelector("summary") : target;
      if (!focusTarget) return;
      if (!focusTarget.matches("a[href], button, input, select, textarea, summary, [tabindex]")) {
        focusTarget.setAttribute("tabindex", "-1");
      }
      focusTarget.focus({ preventScroll: true });
    });
  };

  page.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey ||
        event.shiftKey || event.altKey || !(event.target instanceof Element)) return;
    const link = event.target.closest("a[href]");
    if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
    const url = new URL(link.href, document.baseURI);
    if (url.origin !== location.origin || url.pathname !== location.pathname ||
        url.search !== location.search) return;
    const target = findTarget(url.hash);
    if (!target || !page.contains(target)) return;
    if (toc?.contains(link) && compact.matches) {
      toc.querySelector("summary")?.focus();
      toc.open = false;
    }
    // 기본 앵커 이동과 브라우저 방문 기록을 유지한다.
    reveal(target);
    if (url.hash === location.hash) visitHash(true);
  });

  window.addEventListener("hashchange", () => visitHash(true));
  visitHash();
})();
