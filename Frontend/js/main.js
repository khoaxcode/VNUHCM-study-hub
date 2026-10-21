/**
 * VNU - StudyHub | Shared JavaScript
 * Utility functions used across all pages
 */

function isStudyHubSignedIn() {
  try {
    const session = JSON.parse(sessionStorage.getItem('studyhub-session'));
    return session?.role === 'student' || session?.role === 'admin';
  } catch { return false; }
}

function initHeaderSession() {
  if (isStudyHubSignedIn()) return;
  document.querySelectorAll('.topbar-actions').forEach(actions => {
    actions.innerHTML = '<a class="header-login-button" href="index.html">Sign in</a>';
  });
}

// Reveal the actual pricing page inside a center-out liquid mask.
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let navigating = false, preview = null;
  function prepare(url) {
    if (preview) return preview;
    const layer = document.createElement('div');
    layer.className = 'premium-liquid-curtain';
    layer.setAttribute('aria-hidden', 'true');
    layer.inert = true;
    const iframe = document.createElement('iframe');
    iframe.title = 'Pricing transition preview';
    iframe.tabIndex = -1;
    const ready = new Promise(resolve => {
      const timeout = setTimeout(() => resolve(false), 5000);
      iframe.addEventListener('load', async () => {
        try { await Promise.race([iframe.contentDocument.fonts.ready, new Promise(done => setTimeout(done, 700))]); } catch {}
        clearTimeout(timeout); resolve(true);
      }, { once: true });
    });
    iframe.src = url.href;
    layer.append(iframe); document.body.append(layer);
    preview = { layer, ready };
    return preview;
  }
  document.addEventListener('pointerover', event => {
    if (reduced.matches || location.pathname.endsWith('/premium.html')) return;
    const link = event.target instanceof Element ? event.target.closest('.header-premium-button') : null;
    if (link) prepare(new URL(link.href));
  }, { passive: true });
  document.addEventListener('click', async event => {
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.target === '_blank' || link.hasAttribute('download')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !url.pathname.endsWith('/premium.html') || location.pathname.endsWith('/premium.html') || reduced.matches) return;
    event.preventDefault(); event.stopImmediatePropagation();
    if (navigating) return;
    navigating = true;
    const { layer, ready } = prepare(url);
    try {
      if (await ready && layer.animate) {
        const radius = Math.hypot(innerWidth, innerHeight) * .6;
        const stages = [0, .1, .28, .5, .75, 1];
        const frames = stages.map((progress, index) => {
          const points = Array.from({ length: 64 }, (_, point) => {
            const angle = point / 64 * Math.PI * 2;
            const wave = 1 + Math.sin(angle * 4 + progress * 7) * .085 * (1 - progress);
            const r = radius * progress * wave;
            return `${innerWidth / 2 + Math.cos(angle) * r}px ${innerHeight / 2 + Math.sin(angle) * r}px`;
          });
          return { clipPath: `polygon(${points.join(',')})`, offset: index / (stages.length - 1) };
        });
        layer.style.visibility = 'visible';
        await layer.animate(frames, { duration: 950, easing: 'cubic-bezier(.25,.1,.25,1)', fill: 'forwards' }).finished;
      }
    } catch { /* Failed previews never block navigation. */ }
    location.assign(url.href);
  }, true);
  window.addEventListener('pageshow', event => {
    if (event.persisted) { preview?.layer.remove(); preview = null; navigating = false; }
  });
})();

function initPremiumLink() {
  document.querySelectorAll('.topbar-actions').forEach(actions => {
    if (actions.querySelector('.header-premium-button')) return;
    const link = document.createElement('a');
    link.className = 'header-premium-button';
    link.href = 'premium.html';
    link.innerHTML = '<i class="fa-solid fa-crown" aria-hidden="true"></i><span>Premium</span>';
    if (location.pathname.endsWith('/premium.html')) link.setAttribute('aria-current', 'page');
    actions.prepend(link);
  });
}

function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const activePage = document.body.dataset.activeNav || currentPage;
  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    const active = item.dataset.page === activePage;
    item.classList.toggle('active', active);
    if (active) item.setAttribute('aria-current', 'page');
    else item.removeAttribute('aria-current');
  });
}

// ── Toggle password visibility ────────────────────────────────
function initPasswordToggles() {
  document.querySelectorAll('.eye-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.form-group').querySelector('input');
      const isHidden = input.type === 'password';
      input.type = isHidden ? 'text' : 'password';
      btn.querySelector('i').className = isHidden
        ? 'fa-regular fa-eye-slash'
        : 'fa-regular fa-eye';
    });
  });
}

// ── Notification toast ────────────────────────────────────────
function showToast(message, type = 'info', duration = 3000) {
  const colors = { info: '#2563eb', success: '#22c55e', error: '#ef4444' };
  const icons  = { info: 'fa-circle-info', success: 'fa-circle-check', error: 'fa-circle-xmark' };

  const toast = document.createElement('div');
  toast.innerHTML = `
    <i class="fa-solid ${icons[type]}"></i>
    <span>${message}</span>
  `;
  Object.assign(toast.style, {
    position: 'fixed', bottom: '24px', right: '24px',
    background: colors[type], color: '#fff',
    padding: '12px 18px', borderRadius: '10px',
    display: 'flex', alignItems: 'center', gap: '8px',
    fontSize: '13.5px', fontWeight: '500',
    boxShadow: '0 8px 24px rgba(0,0,0,.18)',
    zIndex: '9999', opacity: '0',
    transform: 'translateY(12px)',
    transition: 'opacity .25s, transform .25s',
  });
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px)';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ── Format file size ──────────────────────────────────────────
function formatSize(bytes) {
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  if (bytes >= 1024) return (bytes / 1024).toFixed(0) + ' KB';
  return bytes + ' B';
}

// ── Debounce ──────────────────────────────────────────────────
function debounce(fn, ms = 300) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

// Sidebar preference is shared by both static and template-rendered pages.
function initSidebarToggle() {
  const sidebar = document.querySelector('.sidebar');
  const header = document.querySelector('.app-shell .topbar');
  if (!sidebar || !header || document.querySelector('.header-menu-toggle')) return;
  const shell = document.querySelector('.app-shell');
  shell.classList.add('has-header-navigation');
  shell.prepend(header);
  sidebar.id = 'pageNavigation';
  sidebar.setAttribute('aria-label', 'Page navigation');
  sidebar.querySelector('.sidebar-logo')?.remove();
  const controls = document.createElement('div');
  controls.className = 'header-navigation';
  controls.innerHTML = `<button class="header-menu-toggle" type="button" aria-label="Open pages menu" aria-expanded="false" aria-controls="pageNavigation"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><g stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path class="menu-line menu-line-top" d="M4 6h16"/><path class="menu-line menu-line-middle" d="M4 12h16"/><path class="menu-line menu-line-bottom" d="M4 18h16"/></g></svg></button><a class="header-brand" href="dashboard.html" aria-label="StudyHub home"><img class="studyhub-mark" src="assets/studyhub-mark.svg" width="42" height="42" alt=""><span class="studyhub-wordmark">Study<span class="studyhub-hub">Hub</span></span></a><a class="university-button" href="universities.html">University</a>`;
  header.prepend(controls);
  const button = controls.querySelector('button');
  const backdrop = document.createElement('button');
  backdrop.type = 'button';
  backdrop.className = 'navigation-backdrop';
  backdrop.setAttribute('aria-label', 'Close pages menu');
  backdrop.tabIndex = -1;
  shell.append(backdrop);
  let open = false;
  function render() {
    sidebar.classList.remove('is-collapsed');
    sidebar.classList.add('is-expanded');
    sidebar.inert = !open;
    sidebar.setAttribute('aria-hidden', String(!open));
    shell.classList.toggle('navigation-open', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close pages menu' : 'Open pages menu');
    backdrop.hidden = !open;
  }
  function close() { open = false; render(); button.focus(); }
  button.addEventListener('click', () => { open = !open; render(); });
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && open) { event.preventDefault(); close(); }
  });
  sidebar.addEventListener('click', event => { if (event.target.closest('a')) close(); });
  render();
}

function initCustomCursor() {
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (!finePointer.matches) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const layers = ['glow', 'ring', 'dot'].map(name => {
    const layer = document.createElement('div');
    layer.className = `custom-cursor cursor-${name}`;
    layer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer);
    return layer;
  });
  let targetX = 0, targetY = 0, ringX = 0, ringY = 0, glowX = 0, glowY = 0;
  let visible = false, frame = null, previousTime = 0;
  const place = (layer, x, y) => { layer.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`; };
  function animate(time) {
    const delta = previousTime ? Math.min(time - previousTime, 50) : 16.67;
    previousTime = time;
    const ringSpeed = reducedMotion.matches ? 1 : 1 - Math.exp(-delta / 32);
    const glowSpeed = reducedMotion.matches ? 1 : 1 - Math.exp(-delta / 45);
    ringX += (targetX - ringX) * ringSpeed;
    ringY += (targetY - ringY) * ringSpeed;
    glowX += (ringX - glowX) * glowSpeed;
    glowY += (ringY - glowY) * glowSpeed;
    const settled = Math.max(Math.abs(targetX - ringX), Math.abs(targetY - ringY), Math.abs(targetX - glowX), Math.abs(targetY - glowY)) < .1;
    if (settled) { ringX = glowX = targetX; ringY = glowY = targetY; }
    place(layers[1], ringX, ringY); place(layers[0], glowX, glowY);
    frame = settled ? null : requestAnimationFrame(animate);
    if (settled) previousTime = 0;
  }
  function hide() {
    visible = false;
    document.documentElement.classList.remove('custom-cursor-active');
    layers.forEach(layer => layer.classList.remove('is-visible'));
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null; previousTime = 0;
  }
  document.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || !finePointer.matches) { hide(); return; }
    targetX = event.clientX; targetY = event.clientY;
    // Keep the cursor visible above native modal dialogs in the browser's top layer.
    const parent = event.target.closest('dialog[open]') || document.body;
    layers.forEach(layer => { if (layer.parentElement !== parent) parent.appendChild(layer); });
    if (!visible) {
      ringX = glowX = targetX; ringY = glowY = targetY;
      visible = true;
      layers.forEach(layer => layer.classList.add('is-visible'));
      document.documentElement.classList.add('custom-cursor-active');
    }
    place(layers[2], targetX, targetY);
    layers[1].classList.toggle('is-interactive', Boolean(event.target.closest('a, button, input, textarea, select, label, [role="button"]')));
    if (frame === null) frame = requestAnimationFrame(animate);
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', hide);
  window.addEventListener('blur', hide);
  document.addEventListener('visibilitychange', () => { if (document.hidden) hide(); });
  finePointer.addEventListener('change', hide);
  document.addEventListener('pointerdown', () => layers[1].classList.add('is-pressed'));
  document.addEventListener('pointerup', () => layers[1].classList.remove('is-pressed'));
  document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('close', hide));
}

function initLiquidNavigation() {
  const nav = document.querySelector('.sidebar-nav');
  const active = nav?.querySelector('.nav-item.active');
  if (!nav || !active) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const highlight = document.createElement('span');
  highlight.className = 'nav-liquid-highlight';
  highlight.setAttribute('aria-hidden', 'true');
  nav.prepend(highlight);
  nav.classList.add('has-liquid-highlight');
  let current = active, navigating = false;
  function bounds(item) {
    const rect = item.getBoundingClientRect(), parent = nav.getBoundingClientRect();
    return { x: rect.left - parent.left, y: rect.top - parent.top + nav.scrollTop, width: rect.width, height: rect.height };
  }
  function place(item) {
    const box = bounds(item);
    highlight.style.left = `${box.x}px`; highlight.style.top = `${box.y}px`;
    highlight.style.width = `${box.width}px`; highlight.style.height = `${box.height}px`;
  }
  place(current);
  if (window.ResizeObserver) new ResizeObserver(() => { if (!navigating) place(current); }).observe(nav);
  nav.addEventListener('click', async event => {
    const link = event.target.closest('a.nav-item[data-page]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.target === '_blank' || link.hasAttribute('download')) return;
    if (link === current || reduced.matches || !highlight.animate) return;
    event.preventDefault();
    if (navigating) return;
    navigating = true;
    const from = bounds(current), to = bounds(link);
    current.classList.remove('active'); link.classList.add('active');
    const distance = to.y - from.y;
    const middleTop = Math.min(from.y, to.y) + Math.abs(distance) * .25;
    const middleHeight = from.height + Math.min(Math.abs(distance) * .45, 70);
    const animation = highlight.animate([
      { top: `${from.y}px`, left: `${from.x}px`, width: `${from.width}px`, height: `${from.height}px`, borderRadius: '10px', offset: 0 },
      { top: `${middleTop}px`, left: `${to.x + 2}px`, width: `${Math.max(1, to.width - 4)}px`, height: `${middleHeight}px`, borderRadius: '18px', offset: .45 },
      { top: `${to.y}px`, left: `${to.x}px`, width: `${to.width}px`, height: `${to.height}px`, borderRadius: '10px', offset: 1 }
    ], { duration: 420, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'forwards' });
    try { await animation.finished; } catch { /* Continue navigation if interrupted. */ }
    window.location.assign(link.href);
  });
  window.addEventListener('pageshow', event => { if (event.persisted) { navigating = false; highlight.getAnimations().forEach(animation => animation.cancel()); setActiveNav(); current = nav.querySelector('.nav-item.active') || active; place(current); } });
}

// ── DOMContentLoaded bootstrap ────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initHeaderSession();
  initPremiumLink();
  setActiveNav();
  initPasswordToggles();
  initSidebarToggle();
  initLiquidNavigation();
  initCustomCursor();
});

// Refresh session-dependent controls when restoring a page from browser history.
window.addEventListener('pageshow', event => {
  if (event.persisted) {
    const hasLogin = Boolean(document.querySelector('.header-login-button'));
    if (document.querySelector('.topbar-actions') && hasLogin === isStudyHubSignedIn()) location.reload();
  }
});

// Returning home from the homepage scrolls its content instead of reloading it.
document.addEventListener('click', event => {
  if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  const link = event.target.closest('a[href]');
  if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
  const destination = new URL(link.href, location.href);
  if (destination.origin !== location.origin || destination.hash || destination.search || !destination.pathname.endsWith('/dashboard.html') || !location.pathname.endsWith('/dashboard.html')) return;
  const page = document.querySelector('.landing-body');
  if (!page) return;
  event.preventDefault();
  page.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  if (location.hash) history.replaceState(null, '', location.pathname + location.search);
}, true);
