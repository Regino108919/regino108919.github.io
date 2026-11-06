document.addEventListener("DOMContentLoaded", function () {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const dots = Array.from(document.querySelectorAll(".dot"));
  let current = 0, timer = null;

  function showSlide(n) {
    if (!slides.length) return;
    current = (n + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle("active-slide", i === current));
    dots.forEach((d, i) => d.classList.toggle("active", i === current));
  }
  function restart() {
    if (timer) clearInterval(timer);
    if (slides.length > 1) timer = setInterval(() => showSlide(current + 1), 6000);
  }
  const prev = document.querySelector(".prev");
  const next = document.querySelector(".next");
  if (prev) prev.addEventListener("click", function(){ showSlide(current - 1); restart(); });
  if (next) next.addEventListener("click", function(){ showSlide(current + 1); restart(); });
  dots.forEach(d => d.addEventListener("click", function(){ showSlide(Number(d.dataset.slide)); restart(); }));
  showSlide(0); restart();

  function updateClock() {
    const now = new Date();
    const timeEl = document.getElementById("time");
    const dateEl = document.getElementById("date");
    if (timeEl) timeEl.textContent = now.toLocaleTimeString("en-US", {hour:"2-digit", minute:"2-digit", second:"2-digit"});
    if (dateEl) dateEl.textContent = now.toLocaleDateString("en-US", {weekday:"short", month:"short", day:"2-digit", year:"numeric"});
  }
  updateClock();
  setInterval(updateClock, 1000);

  const overlay = document.getElementById("csmOverlay");
  const closeBtn = document.getElementById("csmClose");
  const surveyBtn = document.querySelector(".survey-btn");

  function closeCsm() {
    if (!overlay) return;
    overlay.classList.add("csm-hidden");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("csm-open");
    overlay.style.display = "none";
    overlay.style.pointerEvents = "none";
  }

  function openCsm() {
    if (!overlay) return;
    overlay.classList.remove("csm-hidden");
    overlay.setAttribute("aria-hidden", "false");
    overlay.style.display = "flex";
    overlay.style.pointerEvents = "auto";
    document.body.classList.add("csm-open");
  }

  window.closeCsm = closeCsm;
  window.openCsm = openCsm;

  if (closeBtn) {
    closeBtn.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      closeCsm();
    }, true);
  }

  if (overlay) {
    overlay.addEventListener("click", function(e) {
      if (e.target === overlay) closeCsm();
    });
  }

  if (surveyBtn) {
    surveyBtn.addEventListener("click", function() {
      closeCsm();
    }, true);
  }

  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") closeCsm();
  });

  // Shared navigation: parent and nested menus stay independent.
  const nav = document.querySelector(".main-nav");
  if (nav) {
    const dropdowns = Array.from(nav.querySelectorAll(".nav-dropdown, .nav-subdropdown"));
    function setOpen(item, open) {
      item.classList.toggle("open", open);
      const button = item.querySelector(":scope > .nav-drop-toggle");
      if (button) button.setAttribute("aria-expanded", String(open));
      if (!open) item.querySelectorAll(".nav-subdropdown.open").forEach(child => setOpen(child, false));
    }
    nav.addEventListener("click", function(e) {
      const button = e.target.closest(".nav-drop-toggle");
      if (!button || !nav.contains(button)) return;
      e.preventDefault(); e.stopPropagation();
      const item = button.closest(".nav-dropdown, .nav-subdropdown");
      const willOpen = !item.classList.contains("open");
      const siblings = Array.from(item.parentElement.children).filter(el => el !== item && el.matches(".nav-dropdown, .nav-subdropdown"));
      siblings.forEach(sibling => setOpen(sibling, false));
      setOpen(item, willOpen);
    });
    document.addEventListener("click", function(e) {
      if (!nav.contains(e.target)) dropdowns.forEach(item => setOpen(item, false));
    });
    document.addEventListener("keydown", function(e) {
      if (e.key === "Escape") dropdowns.forEach(item => setOpen(item, false));
    });
    nav.querySelectorAll(".nav-dropdown-menu a").forEach(link => link.addEventListener("click", function() {
      dropdowns.forEach(item => setOpen(item, false));
    }));
  }
});
