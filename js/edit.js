(() => {
  "use strict";

  const STORAGE_KEY = "lfl-edits-v1";
  const app = document.getElementById("app");
  const editables = Array.from(document.querySelectorAll("[data-edit-key]"));

  // ---------- apply any saved edits on load, regardless of edit mode ----------

  function loadSaved() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch (e) {
      return {};
    }
  }

  function applySaved() {
    const saved = loadSaved();
    editables.forEach((el) => {
      const key = el.dataset.editKey;
      if (Object.prototype.hasOwnProperty.call(saved, key)) {
        el.innerHTML = saved[key];
      }
    });
  }

  applySaved();

  // ---------- edit mode toggle ----------

  const toggleBtn = document.querySelector(".edit-toggle");
  const savedBadge = document.querySelector(".edit-saved-badge");
  let editMode = false;
  let badgeTimer = null;
  const saveTimers = new Map();

  function setEditMode(on) {
    editMode = on;
    app.classList.toggle("edit-mode", on);
    editables.forEach((el) => {
      if (on) {
        el.setAttribute("contenteditable", "true");
        el.setAttribute("spellcheck", "false");
      } else {
        el.removeAttribute("contenteditable");
        el.removeAttribute("spellcheck");
      }
    });
    toggleBtn.setAttribute("aria-pressed", on ? "true" : "false");
  }

  function flashSaved() {
    if (!savedBadge) return;
    savedBadge.classList.add("is-visible");
    window.clearTimeout(badgeTimer);
    badgeTimer = window.setTimeout(() => {
      savedBadge.classList.remove("is-visible");
    }, 1200);
  }

  function saveEdit(key, html) {
    const saved = loadSaved();
    saved[key] = html;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    flashSaved();
  }

  editables.forEach((el) => {
    const key = el.dataset.editKey;

    el.addEventListener("input", () => {
      window.clearTimeout(saveTimers.get(key));
      saveTimers.set(
        key,
        window.setTimeout(() => saveEdit(key, el.innerHTML), 400)
      );
    });

    // these are single flowing text blocks, not multi-paragraph fields
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter") e.preventDefault();
    });
  });

  toggleBtn.addEventListener("click", () => setEditMode(!editMode));

  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "e") {
      e.preventDefault();
      setEditMode(!editMode);
    }
  });

  // ---------- reset ----------

  const resetBtn = document.querySelector(".edit-reset");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (window.confirm("Clear all your edits and restore the original text?")) {
        localStorage.removeItem(STORAGE_KEY);
        window.location.reload();
      }
    });
  }

  // ---------- export ----------

  const exportBtn = document.querySelector(".edit-export");
  const overlay = document.querySelector(".export-overlay");
  const textarea = document.querySelector(".export-textarea");
  const closeBtn = document.querySelector(".export-close");
  const downloadBtn = document.querySelector(".export-download");
  const copyBtn = document.querySelector(".export-copy");

  function buildExportHtml() {
    const clone = document.documentElement.cloneNode(true);

    const clonedApp = clone.querySelector("#app");
    if (clonedApp) clonedApp.classList.remove("edit-mode");

    clone.querySelectorAll("[data-edit-key]").forEach((el) => {
      el.removeAttribute("contenteditable");
      el.removeAttribute("spellcheck");
    });

    clone.querySelectorAll(".view").forEach((el) => {
      el.removeAttribute("data-state");
      el.removeAttribute("tabindex");
    });
    const opening = clone.querySelector("#view-opening");
    if (opening) opening.setAttribute("data-state", "active");

    const clonedOverlay = clone.querySelector(".export-overlay");
    if (clonedOverlay) clonedOverlay.classList.remove("is-visible");

    const clonedProgress = clone.querySelector(".progress");
    if (clonedProgress) {
      clonedProgress.textContent = "";
      clonedProgress.classList.remove("is-visible");
    }
    const clonedMark = clone.querySelector(".mark");
    if (clonedMark) clonedMark.classList.remove("is-visible");

    return "<!doctype html>\n" + clone.outerHTML;
  }

  function openExport() {
    textarea.value = buildExportHtml();
    overlay.classList.add("is-visible");
    textarea.focus();
    textarea.select();
  }

  function closeExport() {
    overlay.classList.remove("is-visible");
  }

  if (exportBtn) exportBtn.addEventListener("click", openExport);
  if (closeBtn) closeBtn.addEventListener("click", closeExport);
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeExport();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-visible")) closeExport();
  });

  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      const blob = new Blob([textarea.value], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "index.html";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(textarea.value);
      } catch (e) {
        textarea.select();
        document.execCommand("copy");
      }
      copyBtn.textContent = "Copied";
      window.setTimeout(() => {
        copyBtn.textContent = "Copy";
      }, 1200);
    });
  }
})();
