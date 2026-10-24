(() => {
  const container = document.querySelector('.page-body');
  if (!container?.classList.contains('landing-body') || document.querySelector('.site-footer')) return;
  document.querySelector('.landing-footer')?.remove();
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  const flowers = [[25,92,18,'#718fc9'],[66,111,16,'#aec9e4'],[108,91,16,'#f5ca4f'],[150,115,17,'#657fbc'],[192,97,13,'#ef9b97'],[46,142,12,'#e77a50'],[129,145,12,'#edb735'],[182,154,14,'#a5bfd9'],[9,139,11,'#c2a7bc']];
  const garden = flowers.map(([x,y,r,color]) => `<path d="M${x} ${y}Q${x-15} 180 ${x+8} 204" stroke="#438774" stroke-width="2.2" fill="none"/><path d="M${x+2} ${y+40}q-26-19-21-3t21 3M${x+3} ${y+58}q28-27 21-6t-21 6" fill="#5d9b7d"/><g transform="translate(${x} ${y})">${Array.from({length:5},(_,i)=>`<ellipse cy="-${r*.63}" rx="${r*.32}" ry="${r*.63}" fill="${color}" transform="rotate(${i*72})"/>`).join('')}<circle r="${r*.22}" fill="#355164"/></g>`).join('');
  footer.innerHTML = `<div class="footer-brand-area"><a class="footer-brand" href="dashboard.html" aria-label="StudyHub home"><img src="assets/studyhub-mark.svg" width="34" height="34" alt=""><span class="studyhub-wordmark">Study<span class="studyhub-hub">Hub</span></span></a><svg class="footer-garden" viewBox="0 0 220 205" fill="none" aria-hidden="true">${garden}<path d="M0 204q40-35 70 0m-20 0q40-43 80 0m-10 0q40-34 90 0" stroke="#438774" stroke-width="2"/></svg></div>
    <div class="footer-content"><nav class="footer-columns" aria-label="Liên kết cuối trang"><div><h3>StudyHub</h3><a href="dashboard.html">Trang chủ</a><a href="dashboard.html#aboutTitle">About us</a><a href="feedback.html">Góp ý</a></div><div><h3>Khám phá</h3><a href="universities.html">Trường đại học</a><a href="library.html">Kho tài liệu</a><a href="space.html">Chia sẻ lộ trình</a></div><div><h3>Học cùng bạn</h3><a href="planner.html">AI Planner</a><a href="chatbot.html">AI Chatbot</a><a href="profile.html">Hồ sơ cá nhân</a></div></nav><div class="footer-bottom"><p>© ${new Date().getFullYear()} StudyHub. All rights reserved.</p></div></div>`;
  const glassStage = document.createElement('div');
  glassStage.className = 'footer-glass-stage';
  glassStage.append(footer);
  if (container.classList.contains('landing-body')) {
    container.append(glassStage);
  } else {
    // Keep the footer outside page padding, max-widths and dynamic render targets.
    const scrollArea = document.createElement('div');
    scrollArea.className = 'page-scroll-area';
    if (container.classList.contains('profile-page')) scrollArea.classList.add('hide-scrollbar');
    container.before(scrollArea);
    scrollArea.append(container, glassStage);
  }

  let scrollFrame = null;
  function cancelFooterScroll() {
    if (scrollFrame !== null) cancelAnimationFrame(scrollFrame);
    scrollFrame = null;
  }
  container.addEventListener('wheel', cancelFooterScroll, { passive: true });
  container.addEventListener('touchstart', cancelFooterScroll, { passive: true });
  document.addEventListener('pointerdown', cancelFooterScroll, { passive: true });
  document.addEventListener('keydown', cancelFooterScroll);
  footer.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || (url.hash && url.hash !== '#aboutTitle')) return;
    event.preventDefault();
    cancelFooterScroll();
    const start = container.scrollTop;
    const section = container.querySelector('.about-section');
    const destination = url.hash && section ? section.getBoundingClientRect().top - container.getBoundingClientRect().top + start : 0;
    const target = Math.max(0, Math.min(destination, container.scrollHeight - container.clientHeight));
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      container.scrollTo({ top: target, behavior: 'instant' });
    } else {
      const duration = Math.min(2800, Math.max(1600, Math.abs(target - start) * .5));
      const began = performance.now();
      function step(now) {
        const progress = Math.min(1, (now - began) / duration);
        const ease = progress < .5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
        container.scrollTo({ top: start + (target - start) * ease, behavior: 'instant' });
        scrollFrame = progress < 1 ? requestAnimationFrame(step) : null;
      }
      scrollFrame = requestAnimationFrame(step);
    }
    history.replaceState(null, '', url.pathname + url.search + url.hash);
  });
})();
