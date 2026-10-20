/** Decorative Planner walkthrough; never submits or changes the user's plan. */
(() => {
  const host = document.querySelector('.planner-picture');
  if (!host) return;
  host.removeAttribute('role');
  host.removeAttribute('aria-label');
  host.classList.add('planner-demo');
  host.innerHTML = `<div class="demo-film" aria-hidden="true" data-scene="0">
    <div class="demo-film-heading"><span>STUDYHUB / PLANNER</span><span class="demo-live-dot"></span></div>
    <div class="demo-camera">
      <div class="demo-panel demo-choose"><small>01 / CHỌN TÀI LIỆU</small><strong>Bắt đầu từ môn bạn muốn học.</strong><div class="demo-file"><i class="fa-regular fa-file-pdf"></i><span>Cấu trúc dữ liệu<small>Bài giảng · PDF</small></span><b class="demo-selected">✓</b></div><div class="demo-file muted"><i class="fa-regular fa-file-lines"></i><span>Bài tập thực hành<small>Chương 1–3 · DOC</small></span><b>+</b></div></div>
      <div class="demo-panel demo-schedule"><small>02 / CHỌN NHỊP HỌC</small><strong>Mỗi ngày, tiến thêm một chút.</strong><div class="demo-duration"><span>Thời gian ôn tập</span><b>5 ngày</b></div><div class="demo-slider"><i></i></div><div class="demo-ticks"><span>1 ngày</span><span>5 ngày</span><span>1 tháng</span></div><div class="demo-time-options"><span>30 phút</span><span>1 giờ</span><span class="demo-two-hours">2 giờ</span></div></div>
      <div class="demo-panel demo-prompt"><small>03 / THÊM MỤC TIÊU</small><strong>Bạn muốn tập trung vào đâu?</strong><div class="demo-prompt-box"><span class="demo-typed"></span><span class="demo-type-caret">|</span></div><div class="demo-generate">✦ Tạo lộ trình ôn tập <span>→</span></div></div>
      <div class="demo-panel demo-finished"><span class="demo-success-check">✓</span><strong>Sẵn sàng bắt đầu!</strong><p>Lộ trình 5 ngày · 2 giờ mỗi ngày</p><div class="demo-result-row">✓ Ngày 1 <span>Kiến thức nền tảng</span></div><div class="demo-result-row">2 Ngày 2 <span>Luyện tập theo chủ đề</span></div></div>
    </div>
    <svg class="demo-cursor" viewBox="0 0 28 32" fill="none"><path d="M4 3v23l6-6 5 9 5-3-5-9 9-1L4 3Z" fill="#17355b" stroke="white" stroke-width="2.5" stroke-linejoin="round"/></svg><span class="demo-click-ring"></span>
    <div class="demo-film-caption"><span class="demo-caption-text">Chọn tài liệu</span><span class="demo-film-dots"><i></i><i></i><i></i><i></i></span></div>
  </div><button class="demo-play-toggle" type="button" aria-label="Pause Planner animation" aria-pressed="false">Ⅱ</button><span class="sr-only">Minh họa: chọn tài liệu, đặt lịch 5 ngày và 2 giờ mỗi ngày, nhập yêu cầu rồi tạo lộ trình.</span>`;
  const film = host.querySelector('.demo-film');
  const button = host.querySelector('.demo-play-toggle');
  const typed = host.querySelector('.demo-typed');
  const caption = host.querySelector('.demo-caption-text');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const prompt = 'Ưu tiên chương 3. Ôn lý thuyết trước, sau đó luyện bài tập.';
  const captions = ['Chọn tài liệu', 'Đã chọn tài liệu', 'Đặt 5 ngày ôn tập', 'Chọn 2 giờ mỗi ngày', 'Thêm yêu cầu của bạn', 'Tạo lộ trình', 'Kế hoạch đã sẵn sàng!'];
  let paused = false, visible = false, elapsed = 0, previous = 0, frame = null;
  const cursor = host.querySelector('.demo-cursor');
  const clickRing = host.querySelector('.demo-click-ring');
  // Timed waypoints keep the pointer moving continuously between real targets.
  const route = [
    [0, 88, 84], [.35, 86, 78], [1.15, 81, 37], [1.35, 82, 38],
    [2.65, 82, 38], [3.5, 45, 52], [3.68, 46, 53],
    [4.3, 46, 53], [5.16, 79, 75], [5.38, 78, 76],
    [6.1, 78, 76], [6.9, 31, 48], [7.25, 34, 49],
    [8.6, 34, 49], [9.45, 77, 78], [9.65, 76, 79],
    [10.5, 76, 79], [11.35, 85, 87], [14, 85, 87]
  ];
  function moveCursor(t) {
    const bounds = film.getBoundingClientRect();
    function waypoint(index) {
      const point = route[index];
      const selector = index >= 2 && index <= 4 ? '.demo-selected'
        : index >= 5 && index <= 7 ? '.demo-slider i'
        : index >= 8 && index <= 10 ? '.demo-two-hours'
        : index >= 11 && index <= 13 ? '.demo-prompt-box'
        : index >= 14 && index <= 16 ? '.demo-generate' : null;
      if (!selector || !bounds.width || !bounds.height) return point;
      const target = host.querySelector(selector).getBoundingClientRect();
      return [point[0], (target.left + target.width / 2 - bounds.left) / bounds.width * 100,
        (target.top + target.height / 2 - bounds.top) / bounds.height * 100];
    }
    const end = route.findIndex(point => point[0] > t);
    const a = waypoint(Math.max(0, end - 1)), b = waypoint(end < 0 ? route.length - 1 : end);
    const progress = Math.max(0, Math.min(1, (t - a[0]) / (b[0] - a[0] || 1)));
    const eased = progress * progress * (3 - 2 * progress);
    // Bend the middle of each journey, while landing exactly on the click target.
    const distance = Math.hypot(b[1] - a[1], b[2] - a[2]);
    const arc = Math.sin(eased * Math.PI) * Math.min(distance * .18, 7);
    const x = a[1] + (b[1] - a[1]) * eased + arc;
    const y = a[2] + (b[2] - a[2]) * eased - arc * .65;
    cursor.style.left = clickRing.style.left = `${x}%`;
    cursor.style.top = clickRing.style.top = `${y}%`;
    cursor.style.rotate = `${Math.sin(eased * Math.PI) * Math.sign(b[1] - a[1]) * 9}deg`;
  }
  function render() {
    const t = (elapsed % 14000) / 1000;
    const scene = t < 1.4 ? 0 : t < 3 ? 1 : t < 4.7 ? 2 : t < 6.3 ? 3 : t < 9.5 ? 4 : t < 11 ? 5 : 6;
    film.dataset.scene = String(scene);
    moveCursor(t);
    film.classList.toggle('demo-resetting', t > 13.25);
    film.classList.toggle('demo-clicking', [1.4, 3.7, 5.4, 9.7].some(point => t >= point && t < point + .32));
    typed.textContent = prompt.slice(0, Math.floor(Math.max(0, t - 6.5) * 23));
    caption.textContent = captions[scene];
  }
  function tick(now) {
    if (previous) elapsed += Math.min(now - previous, 100);
    previous = now; render(); frame = requestAnimationFrame(tick);
  }
  function sync() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null; previous = 0;
    if (preference.matches) { film.dataset.scene = '6'; caption.textContent = captions[6]; button.hidden = true; return; }
    button.hidden = false;
    if (!paused && visible && !document.hidden) frame = requestAnimationFrame(tick);
  }
  button.addEventListener('click', () => {
    paused = !paused;
    button.setAttribute('aria-pressed', String(paused));
    button.setAttribute('aria-label', paused ? 'Play Planner animation' : 'Pause Planner animation');
    button.textContent = paused ? '▶' : 'Ⅱ'; sync();
  });
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }, { threshold: .15 }).observe(host);
  document.addEventListener('visibilitychange', sync);
  preference.addEventListener('change', sync);
  render(); sync();
})();
