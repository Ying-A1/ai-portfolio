const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('js-ready');

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
} else {
  projectVisual.classList.add('is-visible');
}

const architectureLayers = [...document.querySelectorAll('.arch-layer')];
const architectureDescription = document.querySelector('#architectureDescription');
const architectureDescriptions = [
  'AI Native 首先改变的是组织计算的方式：系统围绕人的目标、上下文和注意力运行。',
  'Personal Agent 不只回答当前轮次，它跨会话维护目标、记忆、关系和未完成事项。',
  'AI Native Web 让服务通过 API、MCP、结构化工具或受控浏览器能力被 Agent 发现与组合。',
  'Harness 把模型的不确定性装进可治理的运行时：状态、路由、授权、恢复、Trace 与评测。',
  'Android 原型把概念放进设备权限、生命周期、系统 API 和真实构建流程中检验。'
];

const activateArchitectureLayer = (index) => {
  architectureLayers.forEach((layer, layerIndex) => layer.classList.toggle('is-active', layerIndex === index));
  architectureDescription.textContent = architectureDescriptions[index];
};

architectureLayers.forEach((layer, index) => {
  layer.addEventListener('mouseenter', () => activateArchitectureLayer(index));
  layer.addEventListener('focus', () => activateArchitectureLayer(index));
});

if (reducedMotion) projectVisual.classList.add('is-visible');
