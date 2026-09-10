(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SWOOSH_MS = reducedMotion ? 50 : 700;

  const views = Array.from(document.querySelectorAll(".view"));
  const backBtn = document.querySelector(".nav-arrow--back");
  const forwardBtn = document.querySelector(".nav-arrow--forward");
  const progressEl = document.querySelector(".progress");
  const markEl = document.querySelector(".mark");
  const liveRegion = document.querySelector(".nav-live");

  // index -> { showBack, showForward, progress, announce, mark }
  const config = views.map((view) => ({
    showBack: view.dataset.back === "true",
    showForward: view.dataset.forward === "true",
    progress: view.dataset.progress || "",
    announce: view.dataset.announce || view.id,
    mark: view.dataset.mark !== "false",
  }));

  let currentIndex = views.findIndex((v) => v.dataset.state === "active");
  if (currentIndex < 0) currentIndex = 0;
  let isAnimating = false;

  function updateControls() {
    const cfg = config[currentIndex];
    backBtn.classList.toggle("is-visible", cfg.showBack);
    forwardBtn.classList.toggle("is-visible", cfg.showForward);
    backBtn.setAttribute("aria-hidden", cfg.showBack ? "false" : "true");
    forwardBtn.setAttribute("aria-hidden", cfg.showForward ? "false" : "true");
    backBtn.tabIndex = cfg.showBack ? 0 : -1;
    forwardBtn.tabIndex = cfg.showForward ? 0 : -1;

    if (cfg.progress) {
      progressEl.textContent = cfg.progress;
      progressEl.classList.add("is-visible");
    } else {
      progressEl.classList.remove("is-visible");
    }

    markEl.classList.toggle("is-visible", cfg.mark);
  }

  function navigate(targetIndex, direction) {
    if (isAnimating) return;
    if (targetIndex < 0 || targetIndex >= views.length) return;
    if (targetIndex === currentIndex) return;

    isAnimating = true;

    const outgoing = views[currentIndex];
    const incoming = views[targetIndex];

    incoming.dataset.state = direction === "forward" ? "enter-from-right" : "enter-from-left";

    // force reflow so the enter state is committed before we animate away from it
    void incoming.offsetWidth;

    requestAnimationFrame(() => {
      outgoing.dataset.state = direction === "forward" ? "exit-to-left" : "exit-to-right";
      incoming.dataset.state = "active";
    });

    window.setTimeout(() => {
      outgoing.removeAttribute("data-state");
      currentIndex = targetIndex;
      isAnimating = false;
      updateControls();

      incoming.setAttribute("tabindex", "-1");
      incoming.focus({ preventScroll: true });

      if (liveRegion) {
        liveRegion.textContent = config[currentIndex].announce;
      }
    }, SWOOSH_MS);
  }

  backBtn.addEventListener("click", () => navigate(currentIndex - 1, "back"));
  forwardBtn.addEventListener("click", () => navigate(currentIndex + 1, "forward"));

  document.querySelectorAll("[data-goto]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const target = parseInt(el.dataset.goto, 10);
      const direction = target > currentIndex ? "forward" : "back";
      navigate(target, direction);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (isAnimating) return;
    if (e.key === "ArrowRight" && config[currentIndex].showForward) {
      navigate(currentIndex + 1, "forward");
    } else if (e.key === "ArrowLeft" && config[currentIndex].showBack) {
      navigate(currentIndex - 1, "back");
    }
  });

  // touch swipe, edges reachable but a full-width swipe works too
  let touchStartX = null;
  let touchStartY = null;

  document.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    },
    { passive: true }
  );

  document.addEventListener(
    "touchend",
    (e) => {
      if (touchStartX === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      touchStartX = null;
      touchStartY = null;

      if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy)) return;

      if (dx < 0 && config[currentIndex].showForward) {
        navigate(currentIndex + 1, "forward");
      } else if (dx > 0 && config[currentIndex].showBack) {
        navigate(currentIndex - 1, "back");
      }
    },
    { passive: true }
  );

  // graceful placeholder for photos not yet dropped into assets/photos
  document.querySelectorAll("img[data-photo]").forEach((img) => {
    const markMissing = () => img.closest(".photo-frame").classList.add("is-missing");
    img.addEventListener("error", markMissing, { once: true });
  });

  updateControls();
})();
