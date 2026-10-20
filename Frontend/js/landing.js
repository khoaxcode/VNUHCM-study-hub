(() => {
  const page = document.querySelector('.landing-body');
  const shell = document.querySelector('.app-shell');
  if (page && shell) {
    const updateHeader = () => shell.classList.toggle('header-scrolled', page.scrollTop > 24);
    page.addEventListener('scroll', updateHeader, { passive: true });
    window.addEventListener('pageshow', updateHeader);
    updateHeader();
  }
  const control = document.querySelector('.motion-control');
  const marquee = document.querySelector('.document-marquee');
  if (!control || !marquee) return;
  const track = marquee.querySelector('.document-track');
  const escape = StudyHub.escape;
  const documents = window.StudyHubLibraryDocuments || [];
  const cards = documents.map(item => `<article class="demo-document-card">
    <div class="document-preview art-${escape(item.art)}">
      <span class="preview-visual" aria-hidden="true">${item.visual}</span>
      ${item.image ? `<img class="document-cover" src="${escape(item.image)}" alt="" loading="lazy">` : ''}
      <span class="document-type ${escape(item.type)}">${escape(item.type.toUpperCase())}</span>
    </div>
    <div class="demo-document-details"><h3>${escape(item.title)}</h3><span class="demo-school-tag">${escape(item.school)}</span><span class="demo-document-size">${escape(item.size)}</span></div>
  </article>`).join('');
  track.innerHTML = `<div class="document-set">${cards}</div><div class="document-set" aria-hidden="true">${cards}</div>`;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) control.hidden = true;
  control.addEventListener('click', () => {
    const paused = control.getAttribute('aria-pressed') !== 'true';
    control.setAttribute('aria-pressed', String(paused));
    control.textContent = paused ? 'Play animation' : 'Pause animation';
    marquee.classList.toggle('is-paused', paused);
  });
})();
