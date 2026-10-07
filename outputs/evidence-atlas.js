(() => {
  const root = document.documentElement;
  const header = document.querySelector('#siteHeader');
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primaryNav');
  const navLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
  const chapters = [...document.querySelectorAll('[data-chapter]')];
  const thread = document.querySelector('#threadPath');
  const threadShadow = document.querySelector('.thread-shadow');
  const reduceQuery = matchMedia('(prefers-reduced-motion: reduce)');
  const narrowQuery = matchMedia('(max-width: 620px)');
  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();

  const shapes = {
    hero: 'M76 0 C82 13 32 12 24 24 S78 35 70 50 S33 68 25 100',
    atlas: 'M18 0 C18 18 18 21 34 27 S68 28 72 43 S25 57 18 100',
    business: 'M78 0 C78 16 78 22 64 28 S34 40 45 52 S78 67 78 100',
    projects: 'M22 0 C22 18 26 24 45 29 S77 42 71 55 S30 68 22 100',
    method: 'M20 0 C20 17 20 23 34 29 S67 40 67 51 S20 68 20 100',
    view: 'M76 0 C76 18 73 24 56 30 S27 42 43 54 S74 72 76 100',
    experience: 'M19 0 C19 22 19 27 38 35 S62 50 44 61 S19 76 19 100',
    finale: 'M78 0 C78 26 78 40 60 50 S42 61 42 72 S60 88 78 100'
  };
  const mobileShape = 'M18 0 C18 18 18 25 18 38 S18 65 18 100';
  const setThread = (chapter) => {
    if (!thread) return;
    const path = narrowQuery.matches ? mobileShape : (shapes[chapter] || shapes.hero);
    thread.setAttribute('d', path);
    threadShadow?.setAttribute('d', path);
  };

  const closeMenu = () => {
    menu?.setAttribute('aria-expanded', 'false');
    menu?.setAttribute('aria-label', '打开导航');
    nav?.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? '关闭导航' : '打开导航');
    nav?.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  });
  navLinks.forEach((link) => link.addEventListener('click', closeMenu));
  addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });

  let activeChapter = 'hero';
  const activateChapter = (name) => {
    if (!name || name === activeChapter) return;
    activeChapter = name;
    setThread(name);
    navLinks.forEach((link) => {
      const current = link.hash === '#' + (name === 'hero' ? 'top' : name);
      link.classList.toggle('is-current', current);
      if (current) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
    });
  };
  if ('IntersectionObserver' in window) {
    const chapterObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) activateChapter(visible.target.dataset.chapter);
    }, { rootMargin: '-40% 0px -40% 0px', threshold: [0, .01] });
    chapters.forEach((chapter) => chapterObserver.observe(chapter));
    const topSentinel = document.querySelector('#top');
    if (topSentinel) new IntersectionObserver(([entry]) => header?.classList.toggle('is-scrolled', !entry.isIntersecting), { rootMargin: '-80px 0px 0px' }).observe(topSentinel);
    const slide = document.querySelector('.slide-artifact');
    if (slide) new IntersectionObserver(([entry], observer) => { if (entry.isIntersecting) { slide.classList.add('is-visible'); observer.disconnect(); } }, { threshold: .18 }).observe(slide);
  } else {
    document.querySelector('.slide-artifact')?.classList.add('is-visible');
  }

  document.querySelectorAll('[data-atlas-state] button').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-atlas-state]').forEach((node) => {
        const active = node.contains(button);
        node.classList.toggle('is-active', active);
        node.querySelector('button')?.setAttribute('aria-pressed', String(active));
      });
    });
  });

  const tabs = [...document.querySelectorAll('[data-project-tab]')];
  const panels = [...document.querySelectorAll('[data-project-panel]')];
  const selectProject = (name, focus = false) => {
    tabs.forEach((tab) => {
      const selected = tab.dataset.projectTab === name;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focus) tab.focus();
    });
    panels.forEach((panel) => { panel.hidden = panel.dataset.projectPanel !== name; });
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectProject(tab.dataset.projectTab));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'Home') next = 0; else if (event.key === 'End') next = tabs.length - 1; else next = (index + (['ArrowRight','ArrowDown'].includes(event.key) ? 1 : -1) + tabs.length) % tabs.length;
      selectProject(tabs[next].dataset.projectTab, true);
    });
  });
  if (tabs.length) selectProject(tabs.find((tab) => tab.getAttribute('aria-selected') === 'true')?.dataset.projectTab || tabs[0].dataset.projectTab);

  const settlePointer = (() => {
    let timer = 0;
    const hero = document.querySelector('.hero');
    if (!hero || matchMedia('(pointer: coarse)').matches || reduceQuery.matches) return () => {};
    const move = (event) => {
      const bend = Math.max(-10, Math.min(10, (event.clientX / innerWidth - .5) * 20));
      document.querySelector('#evidenceThread').style.transform = `translateX(${bend.toFixed(1)}px)`;
      clearTimeout(timer);
      timer = setTimeout(() => { document.querySelector('#evidenceThread').style.transform = ''; }, 380);
    };
    hero.addEventListener('pointermove', move, { passive: true });
    return () => hero.removeEventListener('pointermove', move);
  })();

  const updateMedia = () => setThread(activeChapter);
  narrowQuery.addEventListener?.('change', updateMedia);
  reduceQuery.addEventListener?.('change', () => { if (reduceQuery.matches) settlePointer(); });
  setThread('hero');
  requestAnimationFrame(() => root.classList.add('is-ready'));
})();
