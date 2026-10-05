const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('js-ready');
const header = document.querySelector('#siteHeader');
const progress = document.querySelector('#progressLine');
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

const updateScrollUI = () => {
  const top = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  header.classList.toggle('is-scrolled', top > 24);
  progress.style.height = `${max > 0 ? Math.min(100, top / max * 100) : 0}%`;
};
updateScrollUI();
window.addEventListener('scroll', updateScrollUI, { passive: true });

if ('IntersectionObserver' in window) {
  document.documentElement.classList.add('reveal-observer');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .14, rootMargin: '0px 0px -5% 0px' });
  document.querySelectorAll('.reveal').forEach((node) => revealObserver.observe(node));

  const chapterObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    const id = visible.target.id;
    navLinks.forEach((link) => link.classList.toggle('is-current', link.getAttribute('href') === `#${id}`));
  }, { threshold: [0.18, .42, .68], rootMargin: '-22% 0px -50% 0px' });
  chapters.forEach((chapter) => chapterObserver.observe(chapter));
} else {
  document.querySelectorAll('.reveal').forEach((node) => node.classList.add('is-visible'));
}

const trace = document.querySelector('.execution-trace');
const traceSteps = [...document.querySelectorAll('.trace-step')];
const activateTrace = (index) => {
  traceSteps.forEach((step, stepIndex) => step.classList.toggle('is-active', stepIndex === index));
  trace.style.setProperty('--trace-progress', `${10 + index * 22.5}%`);
};
traceSteps.forEach((step, index) => {
  step.addEventListener('mouseenter', () => activateTrace(index));
  step.addEventListener('focus', () => activateTrace(index));
});

const architecture = document.querySelector('#native-architecture');
const architectureLayers = [...document.querySelectorAll('.arch-layer')];
const architectureMeter = document.querySelector('#architectureMeter');
const architectureDescription = document.querySelector('#architectureDescription');
const architectureDescriptions = [
  'AI Native 首先改变的是组织计算的方式：系统围绕人的目标、上下文和注意力运行。',
  'Personal Agent 不只回答当前轮次，它跨会话维护目标、记忆、关系和未完成事项。',
  'AI Native Web 让服务通过 API、MCP、结构化工具或受控浏览器能力被 Agent 发现与组合。',
  'Harness 把模型的不确定性装进可治理的运行时：状态、路由、授权、恢复、Trace 与评测。',
  'Android 原型把概念放进设备权限、生命周期、系统 API 和真实构建流程中检验。'
];
let lastArchitectureIndex = -1;
const updateArchitecture = () => {
  if (!architecture) return;
  const rect = architecture.getBoundingClientRect();
  const scrollable = Math.max(1, architecture.offsetHeight - window.innerHeight);
  const local = Math.min(1, Math.max(0, -rect.top / scrollable));
  const index = Math.min(4, Math.floor(local * 5));
  if (index === lastArchitectureIndex) return;
  lastArchitectureIndex = index;
  architectureLayers.forEach((layer, layerIndex) => {
    layer.classList.toggle('is-active', layerIndex === index);
    layer.style.setProperty('--layer-offset', String(layerIndex - index));
  });
  architectureMeter.style.width = `${(index + 1) * 20}%`;
  architectureDescription.textContent = architectureDescriptions[index];
};
updateArchitecture();
window.addEventListener('scroll', updateArchitecture, { passive: true });

if (!reducedMotion) {
  const hero = document.querySelector('.hero-media');
  let frame = 0;
  window.addEventListener('pointermove', (event) => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const x = (event.clientX / window.innerWidth - .5) * 12;
      const y = (event.clientY / window.innerHeight - .5) * 9;
      hero.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.02)`;
    });
  }, { passive: true });
}
