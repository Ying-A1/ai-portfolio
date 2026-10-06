const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
const root = document.documentElement;
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('motion-ready')));

const header = document.querySelector('#siteHeader');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#primaryNav');
const navLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
const chapters = [...document.querySelectorAll('[data-chapter]')];
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const closeMenu = () => {
  if (!menuButton || !nav) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', '打开导航');
  nav.classList.remove('is-open');
  document.body.classList.remove('menu-open');
};

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? '关闭导航' : '打开导航');
  nav?.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
});
navLinks.forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });

if ('IntersectionObserver' in window) {
  const chapterObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach((link) => link.classList.toggle('is-current', link.getAttribute('href') === '#' + visible.target.id));
  }, { threshold: [.12, .28, .52], rootMargin: '-18% 0px -56% 0px' });
  chapters.forEach((chapter) => chapterObserver.observe(chapter));
}

const architectureDescriptions = [
  'AI Native 终端提供身份、权限与环境，是 Personal Agent 的载体。',
  'Personal Agent 以用户的目标、上下文和注意力为中心，持续推进得到授权的任务。',
  'AI Native Web 通过 API、MCP、工具或受控浏览器连接外部服务。',
  'Harness 管理上下文、状态、路由、授权、恢复、Trace 与评测。'
];
const architectureStatuses = ['载体与环境', '产品形态', '能力网络', '运行治理'];
const architectureEvidenceCopy = [
  '研究对象包括身份、权限、设备事件与执行环境；当前以 Android 原型验证系统约束。',
  '围绕用户目标、上下文与注意力持续推进得到授权的任务，仍需真实场景持续验证。',
  'API、MCP、工具与受控浏览器构成外部能力入口，具体可用性取决于服务和权限。',
  'Harness 负责上下文、状态、路由、授权、恢复、Trace 与评测，是可靠运行的关键层。'
];
const architectureLayers = [...document.querySelectorAll('.arch-layer')];
const architectureDescription = document.querySelector('#architectureDescription');
const architectureStatus = document.querySelector('#architectureStatus');
const architectureEvidence = document.querySelector('#architectureEvidence');

const activateArchitectureLayer = (index) => {
  const safeIndex = clamp(index, 0, architectureLayers.length - 1);
  architectureLayers.forEach((layer, layerIndex) => layer.classList.toggle('is-active', layerIndex === safeIndex));
  if (architectureDescription) architectureDescription.textContent = architectureDescriptions[safeIndex];
  if (architectureStatus) architectureStatus.textContent = architectureStatuses[safeIndex];
  if (architectureEvidence) architectureEvidence.textContent = architectureEvidenceCopy[safeIndex];
};
architectureLayers.forEach((layer, index) => {
  layer.addEventListener('mouseenter', () => activateArchitectureLayer(index));
  layer.addEventListener('focus', () => activateArchitectureLayer(index));
  layer.addEventListener('click', () => activateArchitectureLayer(index));
});

const ledgerRows = [...document.querySelectorAll('.ledger-row[data-preview]')];
const previewPanels = [...document.querySelectorAll('[data-preview-panel]')];
const activatePreview = (name) => {
  ledgerRows.forEach((row) => row.classList.toggle('is-active', row.dataset.preview === name));
  previewPanels.forEach((panel) => panel.classList.toggle('is-active', panel.dataset.previewPanel === name));
};
ledgerRows.forEach((row) => {
  const activate = () => activatePreview(row.dataset.preview);
  row.addEventListener('mouseenter', activate);
  row.addEventListener('focusin', activate);
  row.addEventListener('click', (event) => { if (!event.target.closest('a')) activate(); });
});

const thesis = document.querySelector('#thesis');
const storyPhases = [...document.querySelectorAll('[data-story-phase]')];
const method = document.querySelector('#method');
const methodSteps = [...document.querySelectorAll('[data-method-step]')];
const methodCounter = document.querySelector('#methodCounter');
const nativeSection = document.querySelector('#native-architecture');
const viewSection = document.querySelector('#view');
const viewSteps = [...document.querySelectorAll('[data-view-step]')];
const slideStory = document.querySelector('#slideStudioStory');
const hero = document.querySelector('.hero');

const sectionProgress = (element) => {
  if (!element) return 0;
  const rect = element.getBoundingClientRect();
  const travel = Math.max(1, element.offsetHeight - window.innerHeight);
  return clamp(-rect.top / travel);
};

const activatePhase = (element, steps, index) => {
  if (!element || !steps.length) return;
  const phase = clamp(index, 0, steps.length - 1);
  element.dataset.phase = String(phase);
  element.style.setProperty('--phase', phase);
  steps.forEach((step, stepIndex) => step.classList.toggle('is-active', stepIndex === phase));
};

let scrollFrame = 0;
const updateScrollScenes = () => {
  scrollFrame = 0;
  const documentTravel = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  root.style.setProperty('--page-progress', (window.scrollY / documentTravel * 100).toFixed(3) + '%');
  header?.classList.toggle('is-scrolled', window.scrollY > 24);

  const heroProgress = sectionProgress(hero);
  root.style.setProperty('--hero-progress', heroProgress.toFixed(3));

  const thesisProgress = sectionProgress(thesis);
  const thesisPhase = Math.min(2, Math.floor(clamp(thesisProgress * 3, 0, 2.999)));
  activatePhase(thesis, storyPhases, thesisPhase);

  const methodProgress = sectionProgress(method);
  const methodPhase = Math.min(4, Math.floor(clamp(methodProgress * 5, 0, 4.999)));
  activatePhase(method, methodSteps, methodPhase);
  if (methodCounter) methodCounter.textContent = String(methodPhase + 1).padStart(2, '0') + ' / 05';

  const nativeProgress = sectionProgress(nativeSection);
  const nativePhase = Math.min(3, Math.floor(clamp(nativeProgress * 4, 0, 3.999)));
  if (nativeSection) {
    nativeSection.dataset.phase = String(nativePhase);
    nativeSection.style.setProperty('--phase', nativePhase);
  }
  activateArchitectureLayer(nativePhase);

  const viewProgress = sectionProgress(viewSection);
  const viewPhase = Math.min(3, Math.floor(clamp(viewProgress * 4, 0, 3.999)));
  activatePhase(viewSection, viewSteps, viewPhase);

  if (slideStory) {
    const slideProgress = sectionProgress(slideStory);
    slideStory.style.setProperty('--slide-progress', clamp(slideProgress * 1.55).toFixed(3));
  }
};
const scheduleScrollScenes = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollScenes); };
window.addEventListener('scroll', scheduleScrollScenes, { passive: true });
window.addEventListener('resize', scheduleScrollScenes);
updateScrollScenes();

const contextCanvas = document.querySelector('#contextField');
if (contextCanvas && hero) {
  const context = contextCanvas.getContext('2d');
  const nodes = Array.from({ length: 16 }, (_, index) => ({
    seedX: ((index * 47) % 97) / 97,
    seedY: ((index * 67 + 19) % 101) / 101,
    phase: index * .73,
    lane: index % 3,
    weight: index % 5 === 0 ? 1.8 : 1
  }));
  const pointer = { x: .72, y: .46, tx: .72, ty: .46, active: false };
  let width = 1;
  let height = 1;
  let dpr = 1;
  let fieldVisible = true;
  let animationFrame = 0;
  let lastFrame = 0;

  const resizeCanvas = () => {
    const rect = hero.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = Math.max(1, rect.width);
    height = Math.max(1, Math.min(rect.height, window.innerHeight));
    contextCanvas.width = Math.round(width * dpr);
    contextCanvas.height = Math.round(height * dpr);
    contextCanvas.style.width = width + 'px';
    contextCanvas.style.height = height + 'px';
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const nodePosition = (node, time, progress) => {
    const cloudX = width * (.49 + (node.seedX - .5) * .78);
    const cloudY = height * (.14 + node.seedY * .73);
    const laneX = width * (.48 + node.seedX * .48);
    const laneY = height * ([.28, .53, .76][node.lane] + (node.seedY - .5) * .075);
    const morph = clamp((progress - .48) / .38);
    const amplitude = coarsePointer ? 2.5 : 5.5;
    let x = cloudX + (laneX - cloudX) * morph + Math.sin(time * .00045 + node.phase) * amplitude;
    let y = cloudY + (laneY - cloudY) * morph + Math.cos(time * .00038 + node.phase * 1.3) * amplitude;
    if (!coarsePointer) {
      const dx = x - pointer.x * width;
      const dy = y - pointer.y * height;
      const distance = Math.hypot(dx, dy);
      const radius = 150;
      if (distance < radius && distance > 0) {
        const force = (1 - distance / radius) * 34;
        x += dx / distance * force;
        y += dy / distance * force;
      }
    }
    return { x, y };
  };

  const drawField = (time) => {
    animationFrame = 0;
    if (!fieldVisible || document.hidden) return;
    if (time - lastFrame < 33 && !reducedMotion) { animationFrame = requestAnimationFrame(drawField); return; }
    lastFrame = time;
    pointer.x += (pointer.tx - pointer.x) * .075;
    pointer.y += (pointer.ty - pointer.y) * .075;
    const progress = sectionProgress(hero);
    context.clearRect(0, 0, width, height);

    const wash = context.createRadialGradient(width * .76, height * .43, 0, width * .76, height * .43, width * .62);
    wash.addColorStop(0, 'rgba(0,181,255,.105)');
    wash.addColorStop(.46, 'rgba(29,78,216,.045)');
    wash.addColorStop(1, 'rgba(9,9,9,0)');
    context.fillStyle = wash;
    context.fillRect(0, 0, width, height);

    const positions = nodes.map((node) => nodePosition(node, time, progress));
    const connections = [[0,3],[0,7],[1,4],[1,8],[2,5],[2,10],[3,6],[4,7],[5,8],[6,9],[7,10],[8,11],[9,12],[10,13],[11,14],[12,15],[2,14],[4,15]];
    connections.forEach(([a, b], connectionIndex) => {
      const p1 = positions[a];
      const p2 = positions[b];
      context.beginPath();
      context.moveTo(p1.x, p1.y);
      const bend = Math.sin(time * .00025 + connectionIndex) * 18;
      context.bezierCurveTo((p1.x+p2.x)/2 + bend, p1.y, (p1.x+p2.x)/2 - bend, p2.y, p2.x, p2.y);
      context.strokeStyle = connectionIndex % 4 === 0 ? 'rgba(0,255,240,.29)' : 'rgba(0,181,255,.16)';
      context.lineWidth = connectionIndex % 4 === 0 ? 1.15 : .7;
      context.stroke();
      const packetProgress = (time * .00011 + connectionIndex * .143) % 1;
      if (connectionIndex % 3 === 0) {
        const px = p1.x + (p2.x - p1.x) * packetProgress;
        const py = p1.y + (p2.y - p1.y) * packetProgress;
        context.fillStyle = 'rgba(0,255,240,.95)';
        context.shadowColor = '#00fff0';
        context.shadowBlur = 10;
        context.fillRect(px - 1.5, py - 1.5, 3, 3);
        context.shadowBlur = 0;
      }
    });

    positions.forEach((position, index) => {
      const node = nodes[index];
      const pulse = 1 + Math.sin(time * .0012 + node.phase) * .22;
      context.beginPath();
      context.arc(position.x, position.y, (2.2 + node.weight) * pulse, 0, Math.PI * 2);
      context.fillStyle = index % 5 === 0 ? 'rgba(0,255,240,.92)' : 'rgba(0,181,255,.72)';
      context.shadowColor = index % 5 === 0 ? '#00fff0' : '#00b5ff';
      context.shadowBlur = index % 5 === 0 ? 16 : 8;
      context.fill();
      context.shadowBlur = 0;
      if (index % 5 === 0) {
        context.font = '500 9px JetBrains Mono, monospace';
        context.fillStyle = 'rgba(229,231,235,.52)';
        context.fillText(['GOAL','CONTEXT','ACTION','VERIFY'][index % 4], position.x + 10, position.y + 4);
      }
    });
    if (!reducedMotion) animationFrame = requestAnimationFrame(drawField);
  };

  const startField = () => { if (!animationFrame && fieldVisible && !document.hidden) animationFrame = requestAnimationFrame(drawField); };
  const stopField = () => { if (animationFrame) cancelAnimationFrame(animationFrame); animationFrame = 0; };
  resizeCanvas();
  startField();
  window.addEventListener('resize', () => { resizeCanvas(); if (reducedMotion) drawField(performance.now()); });
  hero.addEventListener('pointermove', (event) => {
    const rect = hero.getBoundingClientRect();
    pointer.tx = clamp((event.clientX - rect.left) / rect.width);
    pointer.ty = clamp((event.clientY - rect.top) / Math.min(rect.height, window.innerHeight));
    pointer.active = true;
  }, { passive: true });
  hero.addEventListener('pointerleave', () => { pointer.tx = .72; pointer.ty = .46; pointer.active = false; });
  document.addEventListener('visibilitychange', () => document.hidden ? stopField() : startField());
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { fieldVisible = entry.isIntersecting; fieldVisible ? startField() : stopField(); }, { threshold: .02 }).observe(hero);
  }
  if (reducedMotion) drawField(performance.now());
}
