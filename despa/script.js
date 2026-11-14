"use strict";

// Works both on GitHub Pages (including a repository subpath) and via file://.
const config = window.DESPA_CONFIG || { links: {} };
const toast = document.querySelector("#toast");
let toastTimer;
function notify(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 3200);
}

const resourceNames = { arxiv: "The arXiv paper", benchmark: "SpaBench on Hugging Face", github: "The GitHub repository" };
document.querySelectorAll("[data-resource]").forEach((link) => {
  const key = link.dataset.resource;
  const url = config.links?.[key]?.trim();
  let validUrl = false;
  try { validUrl = Boolean(url) && ["https:", "http:"].includes(new URL(url).protocol); } catch { /* Keep unreleased resources in the Soon state. */ }
  if (validUrl) {
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.removeAttribute("aria-disabled");
    link.removeAttribute("role");
    link.removeAttribute("tabindex");
    link.querySelector(".release-label")?.remove();
    link.title = resourceNames[key];
  } else {
    link.setAttribute("aria-label", `${resourceNames[key]} — coming soon`);
    link.title = "Coming soon";
    link.addEventListener("click", (event) => {
      event.preventDefault();
      notify(`${resourceNames[key]} is coming soon.`);
    });
    link.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        link.click();
      }
    });
  }
});

const citationButton = document.querySelector("#copy-citation");
citationButton.addEventListener("click", async () => {
  const citation = document.querySelector("#bibtex").textContent;
  let copied = false;
  try {
    await navigator.clipboard.writeText(citation);
    copied = true;
  } catch {
    // Fallback for file:// and older browsers.
    const field = document.createElement("textarea");
    field.value = citation;
    field.style.cssText = "position:fixed;left:-9999px;top:0";
    document.body.append(field);
    field.select();
    try { copied = document.execCommand("copy"); } catch { copied = false; }
    field.remove();
    citationButton.focus({ preventScroll: true });
  }
  if (copied) {
    citationButton.querySelector("span").textContent = "Copied!";
    notify("BibTeX copied to clipboard.");
    window.setTimeout(() => { citationButton.querySelector("span").textContent = "Copy BibTeX"; }, 2400);
  } else {
    const range = document.createRange();
    range.selectNodeContents(document.querySelector("#bibtex"));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    notify("Citation selected. Press Ctrl+C or ⌘C to copy.");
  }
});

const dialog = document.querySelector("#figure-dialog");
document.querySelectorAll("[data-zoom]").forEach((button) => {
  button.addEventListener("click", () => {
    if (typeof dialog.showModal !== "function") {
      window.open(button.dataset.zoom, "_blank", "noopener");
      return;
    }
    const img = document.querySelector("#dialog-image");
    img.src = button.dataset.zoom;
    img.alt = button.querySelector("img").alt;
    document.querySelector("#dialog-original").href = button.dataset.zoom;
    document.querySelector("#dialog-caption").textContent = button.dataset.caption;
    dialog.showModal();
    document.querySelector(".dialog-image-wrap").scrollLeft = 0;
    document.body.classList.add("dialog-open");
  });
});
document.querySelector("#close-dialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
dialog.addEventListener("close", () => document.body.classList.remove("dialog-open"));

if ("IntersectionObserver" in window) {
  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll("nav a")];
  const visible = new Set();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) visible.add(entry.target.id);
      else visible.delete(entry.target.id);
    });
    const current = sections.find((section) => visible.has(section.id));
    navLinks.forEach((link) => {
      if (current && link.hash === `#${current.id}`) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-15% 0px -55% 0px", threshold: 0 });
  sections.forEach((section) => observer.observe(section));
}
