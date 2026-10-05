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
  'AI Native 终端提供身份、权限与环境，是 Personal Agent 的载体。',
  'Personal Agent 以用户的目标、上下文和注意力为中心，持续推进得到授权的任务。',
  'AI Native Web 通过 API、MCP、工具或受控浏览器连接外部服务。',
  'Harness 管理上下文、状态、路由、授权、恢复、Trace 与评测。',
  'Android 原型已完成配置、测试和构建；设备端完整行为仍需继续验证。'
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
