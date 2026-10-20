/** Gentle wheel inertia for the introduction page; other input stays native. */
(() => {
  const page = document.querySelector('.landing-body');
  if (!page) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let target = page.scrollTop, frame = null, previous = 0;
  const limit = () => Math.max(0, page.scrollHeight - page.clientHeight);
  function stop() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null; previous = 0; target = page.scrollTop;
  }
  function tick(now) {
    const dt = previous ? Math.min(40, now - previous) : 16;
    previous = now;
    target = Math.max(0, Math.min(limit(), target));
    const current = page.scrollTop, difference = target - current;
    if (Math.abs(difference) < .75) {
      page.scrollTo({ top: target, behavior: 'instant' }); stop(); return;
    }
    page.scrollTo({ top: current + difference * (1 - Math.exp(-dt / 95)), behavior: 'instant' });
    frame = requestAnimationFrame(tick);
  }
  page.addEventListener('wheel', event => {
    if (reduced.matches || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || !event.deltaY) return;
    // Let nested document areas and controls handle their own scrolling.
    for (let node = event.target instanceof Element ? event.target : null; node && node !== page; node = node.parentElement) {
      if (node.matches('textarea, input, select, [contenteditable="true"]')) return;
      if (node.scrollHeight > node.clientHeight + 1 && /auto|scroll/.test(getComputedStyle(node).overflowY)) return;
    }
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? page.clientHeight : 1);
    if (frame === null) target = page.scrollTop;
    if ((target <= 0 && delta < 0) || (target >= limit() && delta > 0)) return;
    event.preventDefault();
    // Bound momentum to prevent a long delayed catch-up after a fast wheel flick.
    target = Math.max(0, Math.min(limit(), page.scrollTop + Math.max(-450, Math.min(450, target - page.scrollTop + delta * .8))));
    if (frame === null) frame = requestAnimationFrame(tick);
  }, { passive: false });
  document.addEventListener('pointerdown', stop, { passive: true });
  document.addEventListener('keydown', stop);
  document.addEventListener('click', stop, true);
  page.addEventListener('touchstart', stop, { passive: true });
  window.addEventListener('resize', stop);
  window.addEventListener('blur', stop);
  document.addEventListener('visibilitychange', stop);
  reduced.addEventListener('change', stop);
})();
