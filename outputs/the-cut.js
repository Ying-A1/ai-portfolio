(() => {
  const header = document.querySelector("#siteHead");
  const menuButton = document.querySelector(".menu-button");
  const menu = document.querySelector("#actMenu");
  const cut = document.querySelector("#cutTransition");
  const acts = [...document.querySelectorAll(".act[data-act]")];
  const actCount = document.querySelector("#actCount");
  const actBar = document.querySelector("#actBar");
  const understanding = document.querySelector("[data-understanding]");
  const understandingBeats = [...document.querySelectorAll("[data-understanding-beat]")];
  const slideFrames = [...document.querySelectorAll("[data-slide-frame]")];
  const slideBeats = [...document.querySelectorAll("[data-slide-beat]")];
  const slideIndex = document.querySelector("#slideIndex");
  const slideCaption = document.querySelector("#slideCaption");
  const statusStrip = document.querySelector("[data-status-strip]");
  const reducedQuery = matchMedia("(prefers-reduced-motion: reduce)");
  const desktopQuery = matchMedia("(min-width: 901px)");
  const captions = ["打开后的单文件 Deck", "直接编辑标题与字形", "页面管理器", "重排后的页面顺序", "导出当前 HTML"];
  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();

  const closeMenu = () => {
    menuButton?.setAttribute("aria-expanded", "false");
    menu?.classList.remove("is-open");
    menu?.setAttribute("inert", "");
    document.body.classList.remove("menu-open");
  };
  menuButton?.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    menu?.classList.toggle("is-open", open);
    if (open) menu?.removeAttribute("inert"); else menu?.setAttribute("inert", "");
    document.body.classList.toggle("menu-open", open);
  });
  addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });

  const navigateWithCut = (event) => {
    const link = event.currentTarget;
    const id = link.hash.slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    closeMenu();
    if (reducedQuery.matches || !cut) return;
    event.preventDefault();
    cut.classList.remove("is-cutting");
    void cut.offsetWidth;
    cut.classList.add("is-cutting");
    setTimeout(() => target.scrollIntoView({ behavior: "auto" }), 410);
    setTimeout(() => cut.classList.remove("is-cutting"), 920);
  };
  document.querySelectorAll("a[href^='#']").forEach((link) => link.addEventListener("click", navigateWithCut));

  const setAct = (value) => {
    const number = Number(value);
    if (actCount) actCount.textContent = number ? String(number).padStart(2, "0") + "—05" : "01—05";
    if (actBar) actBar.style.width = number ? number * 20 + "%" : "0";
  };
  const chooseCentered = (elements) => {
    const center = innerHeight / 2;
    return elements.map((element) => {
      const rect = element.getBoundingClientRect();
      const visible = Math.max(0, Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0));
      return { element, score: visible / Math.max(1, rect.height) - Math.abs((rect.top + rect.bottom) / 2 - center) / innerHeight * .2 };
    }).sort((a, b) => b.score - a.score)[0]?.element;
  };
  const setUnderstanding = (index) => {
    understanding?.setAttribute("data-understanding-state", String(index));
    understandingBeats.forEach((beat, i) => beat.classList.toggle("is-active", i === index));
  };
  const setSlide = (index) => {
    slideFrames.forEach((frame, i) => {
      frame.classList.toggle("is-active", i === index);
      frame.setAttribute("aria-hidden", String(i !== index));
    });
    slideBeats.forEach((beat, i) => beat.classList.toggle("is-active", i === index));
    if (slideIndex) slideIndex.textContent = String(index + 1).padStart(2, "0") + " / 05";
    if (slideCaption) slideCaption.textContent = captions[index];
  };

  if ("IntersectionObserver" in window) {
    const actObserver = new IntersectionObserver(() => {
      const active = chooseCentered(acts);
      if (active) setAct(active.dataset.act);
    }, { threshold: [0, .15, .35, .6, .85] });
    acts.forEach((act) => actObserver.observe(act));
    if (desktopQuery.matches && !reducedQuery.matches) {
      const understandingObserver = new IntersectionObserver(() => {
        const active = chooseCentered(understandingBeats);
        if (active) setUnderstanding(Number(active.dataset.understandingBeat));
      }, { threshold: [0, .2, .5, .8] });
      understandingBeats.forEach((beat) => understandingObserver.observe(beat));
      const slideObserver = new IntersectionObserver(() => {
        const active = chooseCentered(slideBeats);
        if (active) setSlide(Number(active.dataset.slideBeat));
      }, { threshold: [0, .2, .5, .8] });
      slideBeats.forEach((beat) => slideObserver.observe(beat));
    }
    if (statusStrip) new IntersectionObserver(([entry], observer) => {
      if (entry.isIntersecting) { statusStrip.classList.add("is-active"); observer.disconnect(); }
    }, { threshold: .3 }).observe(statusStrip);
    const title = document.querySelector("#title");
    if (title) new IntersectionObserver(([entry]) => header?.classList.toggle("is-scrolled", !entry.isIntersecting), { threshold: .05 }).observe(title);
  } else {
    setAct("00");
    setUnderstanding(0);
    setSlide(0);
    statusStrip?.classList.add("is-active");
  }
})();
