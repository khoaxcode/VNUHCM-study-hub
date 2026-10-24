(() => {
  const host = document.querySelector('.sharing-preview');
  if (!host) return;
  host.removeAttribute('role'); host.removeAttribute('aria-label');
  host.classList.add('shared-plans-showcase');
  document.querySelector('.sharing-copy > p:not(.eyebrow)').textContent = 'Khám phá hàng trăm lộ trình học được chia sẻ bởi các sinh viên hàng đầu từ nhiều trường đại học. Tìm cảm hứng, chọn lộ trình phù hợp và bắt đầu hành trình của riêng bạn.';
  const plans = [
    { title: 'Lộ trình học Giải tích (CTTT) 1 tuần', school: 'UIT', days: 7, rating: '4.9', votes: 128, color: 'blue', icon: 'fa-chart-area', formula: '∫ f(x) dx', topics: ['Giới hạn & liên tục', 'Đạo hàm & ứng dụng', 'Tích phân & luyện đề'] },
    { title: 'Lộ trình học Cấu trúc dữ liệu 2 tuần', school: 'UIT', days: 14, rating: '4.9', votes: 96, color: 'violet', icon: 'fa-diagram-project', formula: '{ Node* next; }', topics: ['Mảng & danh sách liên kết', 'Stack, Queue & cây', 'Sắp xếp & tự đánh giá'] },
    { title: 'Lộ trình học Hệ điều hành 2 tuần', school: 'UIT', days: 14, rating: '4.8', votes: 84, color: 'mint', icon: 'fa-desktop', formula: 'process → thread', topics: ['Tiến trình & luồng', 'Quản lý bộ nhớ', 'Đồng bộ & luyện tập'] },
    { title: 'Lộ trình học Lập trình Web 3 tuần', school: 'UIT', days: 21, rating: '4.9', votes: 112, color: 'peach', icon: 'fa-code', formula: '</build your future>', topics: ['HTML, CSS & bố cục', 'JavaScript tương tác', 'Hoàn thiện dự án nhỏ'] }
  ];

  const section = host.closest('.sharing-section');
  section.classList.add('sharing-marquee-section', 'sharing-immersive');
  const copy = section.querySelector('.sharing-copy');
  copy.classList.add('section-heading');
  copy.querySelector('.sharing-steps')?.remove();
  const action = copy.querySelector('.landing-button');
  const cards = plans.map(plan => `<article class="shared-showcase-slide"><div class="showcase-art showcase-${plan.color}"><div class="showcase-art-grid"></div><i class="fa-solid ${plan.icon}" aria-hidden="true"></i><span class="showcase-formula">${plan.formula.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</span><span class="showcase-days">${plan.days} days</span></div><div class="showcase-card-content"><div class="showcase-tags"><span>${plan.school}</span><span>Shared path</span></div><h3>${plan.title}</h3><div class="showcase-rating"><span class="showcase-stars" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</span><strong>${plan.rating}</strong><span>(${plan.votes} demo ratings)</span></div><ol>${plan.topics.map(topic=>`<li>${topic}</li>`).join('')}</ol></div></article>`).join('');
  host.setAttribute('aria-hidden', 'true');
  host.inert = true;
  let wallLayout = '';
  function fillBackground() {
    const rowCount = Math.max(5, Math.ceil((section.clientHeight + section.clientWidth * .25) / 254) + 2);
    const copies = Math.max(2, Math.ceil(section.clientWidth * 1.5 / (plans.length * 324)) + 1);
    const layout = `${rowCount}:${copies}`;
    if (layout === wallLayout) return;
    wallLayout = layout;
    const set = cards.repeat(copies);
    const lane = reverse => `<div class="shared-path-marquee ${reverse ? 'lane-reverse' : ''}"><div class="shared-path-track"><div class="shared-path-set">${set}</div><div class="shared-path-set">${set}</div></div></div>`;
    host.innerHTML = `<div class="shared-path-wall">${Array.from({length:rowCount},(_,i)=>lane(i%2===1)).join('')}</div>`;
  }
  new ResizeObserver(fillBackground).observe(section);
  fillBackground();
  action.firstChild.textContent = 'Explore ';
  const actions = document.createElement('div');
  actions.className='section-action shared-path-actions';
  actions.append(action);
  const pause=document.createElement('button');
  pause.type='button';pause.className='motion-control';pause.textContent='Pause animation';pause.setAttribute('aria-pressed','false');
  actions.append(pause);
  const note=document.createElement('p');note.className='showcase-demo-note';note.textContent='Illustrative learning paths and ratings';actions.append(note);
  section.append(actions);
  let paused=false;
  pause.addEventListener('click',()=>{paused=!paused;host.classList.toggle('is-paused',paused);pause.setAttribute('aria-pressed',String(paused));pause.textContent=paused?'Play animation':'Pause animation';});
  document.addEventListener('visibilitychange',()=>host.classList.toggle('is-background',document.hidden));
  new IntersectionObserver(entries=>host.classList.toggle('is-offscreen',!entries[0].isIntersecting),{threshold:.05}).observe(host);
})();
