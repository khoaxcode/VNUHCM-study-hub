/** Browser-local study streak, earned by completing Planner tasks. */
(() => {
  const key = 'studyhub-streak-v1';
  let memory = null, badge;
  function today() {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(new Date());
    const part = type => Number(parts.find(item => item.type === type).value);
    return Math.floor(Date.UTC(part('year'), part('month') - 1, part('day')) / 86400000);
  }
  function read() {
    let data = memory;
    try { data = JSON.parse(localStorage.getItem(key)); } catch { /* Keep progress in memory if storage is unavailable. */ }
    if (memory && (!data || memory.lastDay >= data.lastDay)) data = memory;
    const day = today();
    if (!data || !Number.isInteger(data.count) || data.count < 1 || data.count > 100000 || !Number.isInteger(data.lastDay) || data.lastDay > day) return { count: 0, lastDay: null };
    return data;
  }
  function state() {
    const data = read(), day = today();
    return { count: data.lastDay !== null && day - data.lastDay <= 1 ? data.count : 0, completed: data.lastDay === day };
  }
  function render() {
    if (!badge) return;
    const { count, completed } = state();
    badge.querySelector('.streak-count').textContent = count;
    badge.querySelector('.streak-days').textContent = `${count} ngày liên tiếp`;
    badge.querySelector('.streak-message').textContent = completed ? 'Hôm nay bạn đã giữ lửa. Hẹn ngày mai!' : 'Hoàn thành một nhiệm vụ Planner hôm nay để giữ lửa.';
    badge.querySelector('button').setAttribute('aria-label', `Chuỗi học tập: ${count} ngày. ${completed ? 'Đã hoàn thành hôm nay.' : 'Chưa hoàn thành hôm nay.'}`);
    badge.classList.toggle('streak-earned', completed);
  }
  function recordStudy() {
    if (!isStudyHubSignedIn()) return;
    const day = today(), data = read();
    if (data.lastDay === day) return;
    memory = { count: data.lastDay === day - 1 ? data.count + 1 : 1, lastDay: day };
    try { localStorage.setItem(key, JSON.stringify(memory)); } catch { /* This session can still earn progress. */ }
    render();
    if (badge && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      badge.classList.remove('streak-celebrate');
      void badge.offsetWidth;
      badge.classList.add('streak-celebrate');
    }
  }
  window.StudyHubStreak = { recordStudy };
  function init() {
    const actions = document.querySelector('.topbar-actions');
    if (!actions || !isStudyHubSignedIn()) return;
    badge = document.createElement('div');
    badge.className = 'streak-widget';
    badge.innerHTML = `<button type="button" class="streak-button" aria-expanded="false" aria-controls="studyStreakDetails"><svg class="streak-fire" viewBox="0 0 48 56" fill="none" aria-hidden="true"><defs><linearGradient id="streakWarmFlame" x1="24" y1="6" x2="24" y2="51" gradientUnits="userSpaceOnUse"><stop stop-color="#ffb932"/><stop offset=".6" stop-color="#ff8c22"/><stop offset="1" stop-color="#f56c21"/></linearGradient></defs><path class="streak-flame-body" d="M25 6c2 10-5 15-2 22 4-2 6-6 6-10 7 7 12 15 11 21-1 9-7 13-16 13S8 47 8 39c0-6 3-10 7-15-1 6 1 10 4 11-2-12 0-20 6-29Z" fill="url(#streakWarmFlame)"/><path class="streak-flame-heart" d="M24 29c0 7-7 10-7 16 0 4 3 6 7 6s7-2 7-6c0-5-4-8-7-16Z" fill="#ffdf76"/><path class="streak-flame-light" d="M24 40c-1 3-4 5-4 7 0 2 2 3 4 3s4-1 4-3c0-2-2-4-4-7Z" fill="#fff4c8"/><path class="streak-spark" d="M32 8c-2-2-1-4 1-6 0 3 3 4-1 6Z" fill="#ffb932"/></svg><span class="streak-count">0</span></button><div class="streak-popover" id="studyStreakDetails" role="tooltip"><span class="streak-eyebrow">GIỮ LỬA HỌC TẬP</span><strong class="streak-days">0 ngày liên tiếp</strong><p class="streak-message"></p><small>Mỗi ngày tính một lần · Giờ Việt Nam<br>Chuỗi được lưu trên trình duyệt này.</small></div>`;
    function updateFireMotion() { badge.classList.toggle('streak-motion-paused', document.hidden); }
    document.addEventListener('visibilitychange', updateFireMotion);
    const button = badge.querySelector('button');
    const popup = badge.querySelector('.streak-popover');
    button.setAttribute('aria-describedby', popup.id);
    button.addEventListener('click', () => {
      const open = !badge.classList.contains('streak-open');
      badge.classList.toggle('streak-open', open);
      button.setAttribute('aria-expanded', String(open));
    });
    function close() { badge.classList.remove('streak-open'); button.setAttribute('aria-expanded', 'false'); }
    document.addEventListener('click', event => { if (!badge.contains(event.target)) close(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
    badge.addEventListener('focusout', event => { if (!badge.contains(event.relatedTarget)) close(); });
    const avatar = actions.querySelector('.avatar-btn');
    if (avatar) actions.insertBefore(badge, avatar); else actions.append(badge);
    updateFireMotion();
    render();
  }
  document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('storage', event => { if (event.key === key || event.key === null) { memory = null; render(); } });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) render(); });
  window.addEventListener('pageshow', render);
  setInterval(render, 60000);
})();
