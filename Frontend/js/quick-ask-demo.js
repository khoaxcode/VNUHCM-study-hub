/** Scripted preview of the upcoming Quick Ask feature; no live AI request. */
(() => {
  const host = document.querySelector('.highlight-picture');
  if (!host) return;
  host.removeAttribute('role'); host.removeAttribute('aria-label');
  host.classList.add('quick-ask-demo');
  host.innerHTML = `<div class="qa-film" aria-hidden="true" data-step="0">
    <div class="qa-header"><span>STUDYHUB / QUICK ASK</span><small>PREVIEW</small></div>
    <div class="qa-library"><span class="qa-kicker">KHO TÀI LIỆU</span><strong>Học từ tài liệu của bạn.</strong><div class="qa-document"><i class="fa-regular fa-file-pdf"></i><b>Cấu trúc dữ liệu<br>và giải thuật<small>Bài giảng · PDF</small></b><span>↗</span></div></div>
    <div class="qa-reader"><div class="qa-reader-bar">Cấu trúc dữ liệu và giải thuật <span>PDF</span></div><div class="qa-viewport"><div class="qa-paper"><h4>Chương 3. Sắp xếp</h4><p>Tổ chức dữ liệu theo một thứ tự xác định.</p><div class="qa-lines"></div><h5>1. Các thuật toán cơ bản</h5><p>So sánh các phần tử và đổi chỗ để đưa chúng về đúng vị trí.</p><div class="qa-lines"></div><h5>2. Bubble Sort</h5><p>So sánh từng cặp phần tử liền kề.</p><pre class="qa-code"><code>for (int i = 0; i &lt; n - 1; i++) {
  for (int j = 0; j &lt; n - i - 1; j++) {
    if (a[j] &gt; a[j + 1])
      swap(a[j], a[j + 1]);
  }
}</code></pre><div class="qa-ask">✦ Quick Ask</div><p>Phần tử lớn nhất dần được đưa về cuối dãy.</p></div></div></div>
    <div class="qa-answer"><div class="qa-answer-heading"><span>✦</span><b>Giải thích Bubble Sort</b><small>AI · Minh họa</small></div><div class="qa-quote">“if (a[j] &gt; a[j + 1]) …”</div><p class="qa-answer-text"></p><span class="qa-writing">Đang giải thích…</span></div>
    <svg class="qa-cursor" viewBox="0 0 28 32" fill="none"><path d="M4 3v23l6-6 5 9 5-3-5-9 9-1L4 3Z" fill="#243558" stroke="white" stroke-width="2.5" stroke-linejoin="round"/></svg><span class="qa-click"></span>
    <div class="qa-caption"><span class="qa-caption-text">Mở tài liệu</span><span class="qa-progress-dots"><i></i><i></i><i></i><i></i></span></div>
  </div><button class="qa-play" type="button" aria-label="Pause Quick Ask preview" aria-pressed="false">Ⅱ</button><span class="sr-only">Minh họa tính năng sắp ra mắt: mở tài liệu Cấu trúc dữ liệu và giải thuật, cuộn đến Bubble Sort, chọn mã và dùng Quick Ask để xem giải thích.</span>`;
  const premiumLink = document.createElement('a');
  premiumLink.className = 'quick-ask-premium-link';
  premiumLink.href = 'premium.html';
  premiumLink.setAttribute('aria-label', 'Khám phá StudyHub Premium và Quick Ask');
  premiumLink.innerHTML = '<span class="qa-premium-link-label">Premium &rarr;</span>';
  host.append(premiumLink);
  const premiumCursor = document.createElement('span');
  premiumCursor.className = 'qa-premium-cursor';
  premiumCursor.textContent = 'Premium →';
  premiumCursor.setAttribute('aria-hidden', 'true');
  document.body.append(premiumCursor);
  function clearPremiumCursor() {
    premiumCursor.classList.remove('is-visible');
    document.documentElement.classList.remove('premium-cursor-active');
  }
  function showPremiumCursor(event) {
    if (event.pointerType === 'touch') return;
    if (event.target.closest('.qa-play')) { clearPremiumCursor(); return; }
    premiumCursor.style.left = `${Math.max(8, Math.min(innerWidth - 138, event.clientX + 12))}px`;
    premiumCursor.style.top = `${Math.max(8, Math.min(innerHeight - 52, event.clientY + 12))}px`;
    premiumCursor.classList.add('is-visible');
    document.documentElement.classList.add('premium-cursor-active');
  }
  host.addEventListener('pointerenter', showPremiumCursor);
  host.addEventListener('pointermove', showPremiumCursor, true);
  host.addEventListener('pointerleave', clearPremiumCursor);
  premiumLink.addEventListener('click', clearPremiumCursor);
  // Navigation is handled in capture phase, before the link's own click handler.
  document.addEventListener('click', clearPremiumCursor, true);
  window.addEventListener('blur', clearPremiumCursor);
  window.addEventListener('pageshow', clearPremiumCursor);
  document.addEventListener('visibilitychange', clearPremiumCursor);
  const film = host.querySelector('.qa-film'), cursor = host.querySelector('.qa-cursor');
  cursor.insertAdjacentHTML('beforeend', '<g class="qa-text-cursor" stroke="#243558" stroke-width="2" stroke-linecap="round"><path d="M4 3v18M0 3h8M0 21h8" stroke="white" stroke-width="4"/><path d="M4 3v18M0 3h8M0 21h8"/></g>');
  const caption = host.querySelector('.qa-caption-text'), answer = host.querySelector('.qa-answer-text');
  const button = host.querySelector('.qa-play'), ring = host.querySelector('.qa-click');
  const paper = host.querySelector('.qa-paper'), code = host.querySelector('.qa-code');
  const codeText = code.querySelector('code');
  const characters = Array.from(codeText.textContent, character => {
    const span = document.createElement('span');
    span.textContent = character;
    return span;
  });
  codeText.replaceChildren(...characters);
  let selectedCount = -1;
  function fitDocument() { paper.style.setProperty('--qa-scroll', `${Math.max(0, code.offsetTop - 28)}px`); }
  new ResizeObserver(fitDocument).observe(host);
  fitDocument();
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const explanation = 'Mỗi lượt duyệt so sánh hai phần tử liền kề. Nếu phần tử bên trái lớn hơn, swap đổi chỗ chúng. Sau mỗi lượt, phần tử lớn nhất còn lại nằm ở cuối. n - i - 1 giúp bỏ qua phần đã sắp xếp. Độ phức tạp: O(n²), bộ nhớ phụ: O(1).';
  const captions = ['Mở tài liệu', 'Đọc bài giảng', 'Cuộn đến Bubble Sort', 'Bôi đen đoạn mã', 'Chọn Quick Ask', 'AI giải thích từng bước'];
  let elapsed = 0, previous = 0, frame = null, paused = false, visible = false;
  const waypoints = [[0,88,79],[.9,80,48],[1.2,80,48],[2.4,82,62],[5.2,78,70],[5.8,12,49],[6.2,14,51],[7.4,87,72],[7.9,85,72],[8.5,72,77],[9.1,73,77],[10.2,83,85],[17,83,85]];
  function draw() {
    const t = elapsed % 17000 / 1000;
    const step = t < 1.4 ? 0 : t < 2.8 ? 1 : t < 5.8 ? 2 : t < 8 ? 3 : t < 9.4 ? 4 : 5;
    film.dataset.step = String(step);
    film.classList.toggle('qa-reset', t > 16.2);
    film.classList.toggle('qa-clicking', [1.2,9.1].some(point => t >= point && t < point + .3));
    film.classList.toggle('qa-dragging', t >= 6.2 && t < 7.7);
    caption.textContent = captions[step];
    answer.textContent = explanation.slice(0, Math.floor(Math.max(0,t-9.7)*48));
    film.classList.toggle('qa-answer-done', t > 15);
    const end = waypoints.findIndex(point => point[0] > t);
    const a = waypoints[Math.max(0,end-1)], b = waypoints[end < 0 ? waypoints.length-1 : end];
    const u = Math.max(0,Math.min(1,(t-a[0])/(b[0]-a[0] || 1))), ease = u*u*(3-2*u);
    const bend = step === 3 ? 0 : Math.sin(ease*Math.PI)*3;
    let x = a[1]+(b[1]-a[1])*ease+bend, y = a[2]+(b[2]-a[2])*ease-bend;
    const selection = Math.max(0, Math.min(1, (t - 6.2) / 1.5));
    const count = t < 5.2 ? 0 : Math.floor(selection * characters.length);
    if (count !== selectedCount) {
      characters.forEach((character, index) => character.classList.toggle('qa-selected-character', index < count));
      selectedCount = count;
    }
    // Follow the actual selected character, including line breaks and indentation.
    function selectionTip() {
      const bounds = film.getBoundingClientRect();
      const first = characters[0].getBoundingClientRect();
      const last = characters[characters.length - 1].getBoundingClientRect();
      // A held drag travels directly from the first character to the last;
      // text selection fills the intervening lines as a native selection would.
      const left = first.left + (last.right - first.left) * selection;
      const top = first.top + first.height / 2 + (last.top + last.height / 2 - first.top - first.height / 2) * selection;
      return [(left - bounds.left) / bounds.width * 100, (top - bounds.top) / bounds.height * 100];
    }
    if (t >= 5.2 && t < 8.5) {
      const target = selectionTip();
      const approach = Math.max(0, Math.min(1, (t - 5.2) / .8));
      const smooth = approach * approach * (3 - 2 * approach);
      x += (target[0] - x) * smooth;
      y += (target[1] - y) * smooth;
    }
    // Land on the actual Quick Ask chip, even when the illustration resizes.
    if (t >= 8.5 && t < 9.5) {
      const bounds = film.getBoundingClientRect(), target = host.querySelector('.qa-ask').getBoundingClientRect();
      const blend = Math.min(1,(t-8.5)/.55);
      const from = selectionTip(), smooth = blend * blend * (3 - 2 * blend);
      x = from[0] + ((target.left+target.width/2-bounds.left)/bounds.width*100-from[0])*smooth;
      y = from[1] + ((target.top+target.height/2-bounds.top)/bounds.height*100-from[1])*smooth;
    }
    cursor.style.left = ring.style.left = `${x}%`; cursor.style.top = ring.style.top = `${y}%`;
  }
  function tick(now) { if(previous) elapsed+=Math.min(100,now-previous); previous=now;draw();frame=requestAnimationFrame(tick); }
  function sync() {
    if(frame!==null) cancelAnimationFrame(frame); frame=null;previous=0;
    if(preference.matches) { film.dataset.step='5';answer.textContent=explanation;caption.textContent='Quick Ask · Sắp ra mắt';film.classList.add('qa-answer-done');button.hidden=true;return; }
    button.hidden=false;
    if(!paused && visible && !document.hidden) frame=requestAnimationFrame(tick);
  }
  button.addEventListener('click',()=>{paused=!paused;button.setAttribute('aria-pressed',String(paused));button.setAttribute('aria-label',paused?'Play Quick Ask preview':'Pause Quick Ask preview');button.textContent=paused?'▶':'Ⅱ';sync();});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.15}).observe(host);
  document.addEventListener('visibilitychange',sync);preference.addEventListener('change',sync);
  draw();sync();
})();
