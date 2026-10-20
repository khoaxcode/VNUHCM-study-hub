/** One decorative star travels through the homepage as its scroll position changes. */
(() => {
  const page = document.querySelector('.landing-body');
  const original = document.querySelector('.hero-spark');
  if (!page || !original) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const star = document.createElement('span');
  star.className = 'scroll-journey-star';
  star.setAttribute('aria-hidden', 'true');
  star.textContent = '✦';
  page.append(star);
  let stops = [], frame = null;
  function rect(selector) {
    const element = typeof selector === 'string' ? page.querySelector(selector) : selector;
    const box = element.getBoundingClientRect(), root = page.getBoundingClientRect();
    return { x: box.left - root.left, y: box.top - root.top + page.scrollTop, width: box.width, height: box.height };
  }
  function measure() {
    const home = rect(original), documents = rect('#documentsTitle'), guide = rect('#guideTitle');
    const sharing = rect('#sharingTitle'), team = rect('.about-team');
    const compact = page.clientWidth < 700;
    const side = (box, right) => {
      const size = compact ? 30 : 48;
      const x = compact ? (right ? page.clientWidth - 24 : 24) : box.x + (right ? box.width + 40 : -40);
      return { x: Math.max(size / 2 + 8, Math.min(page.clientWidth - size / 2 - 8, x)), y: box.y + (compact ? -20 : box.height / 2) };
    };
    const sectionTop = selector => rect(selector).y;
    stops = [
      { scroll: 0, x: home.x + home.width / 2, y: home.y + home.height / 2, size: compact ? 44 : 68, angle: 0 },
      { scroll: sectionTop('.documents-section'), ...side(documents, false), size: compact ? 30 : 48, angle: 75 },
      { scroll: sectionTop('.guide-section'), ...side(guide, true), size: compact ? 38 : 76, angle: 150 },
      { scroll: sectionTop('.sharing-section'), ...side(sharing, true), size: compact ? 32 : 54, angle: 230 },
      { scroll: sectionTop('.about-section'), x: team.x + team.width / 2, y: team.y + Math.min(team.height * .4, 220), size: compact ? 30 : 82, angle: 360 }
    ];
    schedule();
  }
  function draw() {
    frame = null;
    star.hidden = reduced.matches;
    original.classList.toggle('hero-spark-travelling', !reduced.matches);
    if (reduced.matches || !stops.length) return;
    const scroll = page.scrollTop;
    let index = stops.findIndex(stop => stop.scroll > scroll);
    if (index < 0) index = stops.length - 1;
    const a = stops[Math.max(0, index - 1)], b = stops[index];
    const progress = Math.max(0, Math.min(1, (scroll - a.scroll) / (b.scroll - a.scroll || 1)));
    const ease = progress * progress * (3 - 2 * progress);
    const mix = key => a[key] + (b[key] - a[key]) * ease;
    // A small sideways arc adds life without changing any landing position.
    const arc = Math.sin(progress * Math.PI) * (page.clientWidth < 700 ? 12 : 35);
    const restingSize = mix('size');
    // Add a modest bloom mid-journey, then settle exactly at each section.
    const bloom = Math.pow(Math.sin(progress * Math.PI), 2);
    const screenSize = Math.min(240, Math.min(page.clientWidth, page.clientHeight) * .3);
    const size = restingSize + (screenSize - restingSize) * bloom;
    star.style.width = star.style.height = `${size}px`;
    star.style.fontSize = `${size}px`;
    star.style.transform = `translate3d(${mix('x') - size / 2 + arc}px, ${mix('y') - size / 2}px, 0) rotate(${mix('angle')}deg)`;
  }
  function schedule() { if (frame === null) frame = requestAnimationFrame(draw); }
  page.addEventListener('scroll', schedule, { passive: true });
  new ResizeObserver(measure).observe(page);
  page.querySelectorAll('section').forEach(section => new ResizeObserver(measure).observe(section));
  reduced.addEventListener('change', schedule);
  window.addEventListener('pageshow', measure);
  document.fonts?.ready.then(measure);
  measure();
})();
