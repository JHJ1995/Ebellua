(() => {
  "use strict";

  const header = document.querySelector(".site-header");
  if (!header) return;

  const links = [...header.querySelectorAll(".nav-link")];

  // 저장소 루트의 / 경로와 명시적인 index.html을 동일하게 취급한다.
  const normalizePath = (pathname) =>
    pathname.endsWith("/") ? `${pathname}index.html` : pathname;
  const currentPath = normalizePath(window.location.pathname);
  let currentLink = null;

  links.forEach((link) => {
    const target = new URL(link.href, document.baseURI);
    const isCurrent =
      currentLink === null &&
      target.origin === window.location.origin &&
      normalizePath(target.pathname) === currentPath;
    link.classList.toggle("is-active", isCurrent);
    if (isCurrent) {
      link.setAttribute("aria-current", "page");
      currentLink = link;
    } else {
      link.removeAttribute("aria-current");
    }
  });

  const toggle = header.querySelector(".nav-toggle");
  const nav = header.querySelector("#site-nav");
  const label = toggle?.querySelector(".nav-toggle-label");
  if (!toggle || !nav) return;
  const mobile = window.matchMedia("(max-width: 767px)");

  const setExpanded = (expanded) => {
    toggle.setAttribute("aria-expanded", String(expanded));
    if (label) label.textContent = expanded ? "메뉴 닫기" : "메뉴 열기";
  };

  const closeMenu = (restoreFocus = false) => {
    if (!mobile.matches) return;
    // 외부의 포커스는 유지하되 숨겨지는 메뉴 안에 포커스를 남기지 않는다.
    if (restoreFocus || nav.contains(document.activeElement)) toggle.focus();
    nav.hidden = true;
    setExpanded(false);
  };

  const syncViewport = () => {
    if (mobile.matches) {
      toggle.hidden = false;
      closeMenu();
    } else {
      nav.hidden = false;
      if (document.activeElement === toggle) (currentLink || links[0])?.focus();
      toggle.hidden = true;
      setExpanded(false);
    }
  };

  toggle.addEventListener("click", () => {
    if (!mobile.matches) return;
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    if (expanded) {
      closeMenu();
    } else {
      nav.hidden = false;
      setExpanded(true);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobile.matches &&
        toggle.getAttribute("aria-expanded") === "true") {
      event.preventDefault();
      closeMenu(true);
    }
  });

  document.addEventListener("click", (event) => {
    if (mobile.matches && toggle.getAttribute("aria-expanded") === "true" &&
        !nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a[href]")) closeMenu();
  });

  mobile.addEventListener("change", syncViewport);
  syncViewport();
})();
