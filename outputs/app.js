const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add('hero-ready')));

const header = document.querySelector('#siteHeader');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#primaryNav');
const navLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
const chapters = [...document.querySelectorAll('[data-chapter]')];

document.querySelector('#year').textContent = new Date().getFullYear();

const closeMenu = () => {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', '打开导航');
  nav.classList.remove('is-open');
  document.body.classList.remove('menu-open');
};

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? '关闭导航' : '打开导航');
  nav.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
});

navLinks.forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });

const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const projectVisual = document.querySelector('.project-visual');
if ('IntersectionObserver' in window) {
  const chapterObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    const id = visible.target.id;
    navLinks.forEach((link) => link.classList.toggle('is-current', link.getAttribute('href') === `#${id}`));
  }, { threshold: [0.18, .42, .68], rootMargin: '-22% 0px -50% 0px' });
  chapters.forEach((chapter) => chapterObserver.observe(chapter));

  const mediaObserver = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      projectVisual.classList.add('is-visible');
      mediaObserver.disconnect();
    }
  }, { threshold: .2 });
  mediaObserver.observe(projectVisual);
  window.setTimeout(() => projectVisual.classList.add('reveal-failsafe'), 1800);
} else {
  projectVisual.classList.add('is-visible');
}

const architectureLayers = [...document.querySelectorAll('.arch-layer')];
const architectureDescription = document.querySelector('#architectureDescription');
const architectureStatus = document.querySelector('#architectureStatus');
const architectureEvidence = document.querySelector('#architectureEvidence');
const architectureDescriptions = [
  'AI Native 终端提供身份、权限与环境，是 Personal Agent 的载体。',
  'Personal Agent 以用户的目标、上下文和注意力为中心，持续推进得到授权的任务。',
  'AI Native Web 通过 API、MCP、工具或受控浏览器连接外部服务。',
  'Harness 管理上下文、状态、路由、授权、恢复、Trace 与评测。',
  'Android 原型已完成配置、测试和构建；设备端完整行为仍需继续验证。'
];
const architectureStatuses = ['载体与环境', '产品形态', '能力网络', '运行治理', '已验证边界'];
const architectureEvidenceCopy = [
  '研究对象包括身份、权限、设备事件与执行环境；当前以 Android 原型验证系统约束。',
  '围绕用户目标、上下文与注意力持续推进得到授权的任务，仍需真实场景持续验证。',
  'API、MCP、工具与受控浏览器构成外部能力入口，具体可用性取决于服务和权限。',
  'Harness 负责上下文、状态、路由、授权、恢复、Trace 与评测，是可靠运行的关键层。',
  '已完成 Provider 接入、定向回归测试与 Android 构建；真机跨应用端到端行为仍未确认。'
];
if (!architectureStatus) {
  const evidencePanel = document.createElement('div');
  evidencePanel.className = 'architecture-evidence';
  evidencePanel.innerHTML = '<span>CURRENT EVIDENCE</span><strong id="architectureStatus">载体与环境</strong><p id="architectureEvidence">研究对象包括身份、权限、设备事件与执行环境；当前以 Android 原型验证系统约束。</p>';
  architectureDescription.insertAdjacentElement('afterend', evidencePanel);
}

const activateArchitectureLayer = (index) => {
  architectureLayers.forEach((layer, layerIndex) => layer.classList.toggle('is-active', layerIndex === index));
  architectureDescription.textContent = architectureDescriptions[index];
  document.querySelector('#architectureStatus').textContent = architectureStatuses[index];
  document.querySelector('#architectureEvidence').textContent = architectureEvidenceCopy[index];
};

architectureLayers.forEach((layer, index) => {
  layer.addEventListener('mouseenter', () => activateArchitectureLayer(index));
  layer.addEventListener('focus', () => activateArchitectureLayer(index));
});

const activateByViewportCenter = (items, callback) => {
  if (!items.length) return;
  let frame = 0;
  const update = () => {
    frame = 0;
    const center = window.innerHeight * .52;
    let closest = 0;
    let distance = Infinity;
    items.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const nextDistance = Math.abs(rect.top + rect.height / 2 - center);
      if (nextDistance < distance) { distance = nextDistance; closest = index; }
    });
    callback(closest);
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  update();
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
};

const thesisSteps = [...document.querySelectorAll('.thesis-step')];
const thesisSequence = document.querySelector('.thesis-sequence');
activateByViewportCenter(thesisSteps, (index) => {
  thesisSteps.forEach((step, stepIndex) => step.classList.toggle('is-active', stepIndex === index));
  thesisSequence.dataset.active = String(index);
});

const methodSteps = [...document.querySelectorAll('.trace-step')];
const executionTrace = document.querySelector('.execution-trace');
activateByViewportCenter(methodSteps, (index) => {
  methodSteps.forEach((step, stepIndex) => step.classList.toggle('is-active', stepIndex === index));
  executionTrace.style.setProperty('--trace-progress', `${((index + 1) / methodSteps.length) * 100}%`);
});
activateByViewportCenter(architectureLayers, activateArchitectureLayer);

const signalPath = document.querySelector('.signal-path');
if ('IntersectionObserver' in window) {
  const signalObserver = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      signalPath.classList.add('is-visible');
      signalPath.style.setProperty('--path-progress', '100%');
      signalObserver.disconnect();
    }
  }, { threshold: .25 });
  signalObserver.observe(signalPath);
} else {
  signalPath.classList.add('is-visible');
  signalPath.style.setProperty('--path-progress', '100%');
}

const evidenceBlocks = [...document.querySelectorAll('[data-evidence]')];
if ('IntersectionObserver' in window) {
  const evidenceObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-evidence-visible');
      evidenceObserver.unobserve(entry.target);
    });
  }, { threshold: .18 });
  evidenceBlocks.forEach((block) => evidenceObserver.observe(block));
  window.setTimeout(() => evidenceBlocks.forEach((block) => block.classList.add('is-evidence-visible')), 2200);
} else {
  evidenceBlocks.forEach((block) => block.classList.add('is-evidence-visible'));
}

const contextCanvas = document.querySelector('#contextField');
const hero = document.querySelector('.hero');
if (contextCanvas && hero) {
  const context = contextCanvas.getContext('2d');
  const pointer = { x: 0, y: 0 };
  let drawFrame = 0;
  const drawContextField = () => {
    drawFrame = 0;
    const rect = hero.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    contextCanvas.width = Math.round(width * dpr);
    contextCanvas.height = Math.round(height * dpr);
    contextCanvas.style.width = `${width}px`;
    contextCanvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);
    const mobile = width < 700;
    const dx = mobile ? 0 : pointer.x * 8;
    const dy = mobile ? 0 : pointer.y * 8;
    const field = context.createLinearGradient(0, 0, width, height);
    field.addColorStop(0, 'rgba(17,19,21,0)');
    field.addColorStop(.57, 'rgba(76,125,255,.035)');
    field.addColorStop(1, 'rgba(196,164,105,.045)');
    context.fillStyle = field;
    context.fillRect(0, 0, width, height);
    const curves = [
      { color: 'rgba(245,244,239,.14)', y: .31, bend: -.06 },
      { color: 'rgba(76,125,255,.42)', y: .52, bend: .08 },
      { color: 'rgba(196,164,105,.34)', y: .74, bend: -.04 }
    ];
    curves.forEach((curve, index) => {
      context.beginPath();
      context.moveTo(width * .43, height * curve.y + dy * .3);
      context.bezierCurveTo(width * .62 + dx, height * (curve.y + curve.bend), width * .78 - dx, height * (curve.y - curve.bend), width * 1.03, height * (curve.y + .02));
      context.strokeStyle = curve.color;
      context.lineWidth = index === 1 ? 1.4 : 1;
      context.stroke();
    });
    context.strokeStyle = 'rgba(245,244,239,.075)';
    context.lineWidth = 1;
    [0.58, .72, .86].forEach((x) => { context.beginPath(); context.moveTo(width * x + dx * .2, height * .19); context.lineTo(width * (x - .08) + dx * .2, height * .89); context.stroke(); });
  };
  const scheduleField = () => { if (!drawFrame) drawFrame = requestAnimationFrame(drawContextField); };
  hero.addEventListener('pointermove', (event) => {
    const rect = hero.getBoundingClientRect();
    pointer.x = (event.clientX - rect.left) / rect.width - .5;
    pointer.y = (event.clientY - rect.top) / rect.height - .5;
    scheduleField();
  }, { passive: true });
  window.addEventListener('resize', scheduleField);
  window.addEventListener('scroll', scheduleField, { passive: true });
  drawContextField();
}

if (reducedMotion) {
  projectVisual.classList.add('is-visible');
  signalPath.classList.add('is-visible');
  evidenceBlocks.forEach((block) => block.classList.add('is-evidence-visible'));
}
