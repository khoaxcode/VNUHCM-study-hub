/** Scripted Chatbot illustration; no document upload or AI request is made. */
(() => {
  const host = document.querySelector('.chat-picture');
  if (!host) return;
  host.removeAttribute('role'); host.removeAttribute('aria-label'); host.classList.add('chat-demo');
  host.innerHTML = `<div class="chat-demo-film" aria-hidden="true" data-stage="0">
    <div class="chat-demo-header">STUDYHUB / CHATBOT <small>DEMO</small></div>
    <div class="chat-demo-body">
      <div class="chat-demo-panel chat-demo-pick"><small>01 / CHỌN TÀI LIỆU</small><strong>Bắt đầu từ điều bạn đang học.</strong><div class="chat-demo-file"><i class="fa-regular fa-file-pdf"></i><span>Cấu trúc dữ liệu và giải thuật<small>Bài giảng · Bubble Sort</small></span><b>+</b></div><p>Đặt câu hỏi dựa trên tài liệu đã chọn.</p></div>
      <div class="chat-demo-panel chat-demo-conversation"><div class="chat-demo-attachment">✓ Cấu trúc dữ liệu · PDF</div><div class="chat-demo-question"></div><div class="chat-demo-response"><b>✦ Giải thích từng bước</b><span class="chat-demo-answer-text"></span></div><div class="chat-demo-composer">Hỏi chi tiết hơn… <span>↑</span></div></div>
      <div class="chat-demo-panel chat-demo-practice"><small>03 / TỪ HIỂU ĐẾN THỰC HÀNH</small><strong>Thử lại kiến thức vừa học.</strong><div class="chat-demo-tools"><span class="chat-demo-quiz">✦ Tạo Quiz</span><span class="chat-demo-test">▤ Tạo đề thi</span></div><div class="chat-demo-result"><small class="chat-demo-result-label">QUIZ · BUBBLE SORT</small><b class="chat-demo-result-question">Sau mỗi lượt duyệt, phần tử nào về cuối?</b><div class="chat-demo-option">A. Phần tử nhỏ nhất</div><div class="chat-demo-option correct">B. Phần tử lớn nhất <span>✓</span></div><div class="chat-demo-test-detail">Câu 1. Mô phỏng Bubble Sort với [5, 2, 4, 1].<br><br>Câu 2. Giải thích độ phức tạp O(n²).</div></div></div>
    </div><svg class="chat-demo-cursor" viewBox="0 0 28 32" fill="none"><path d="M4 3v23l6-6 5 9 5-3-5-9 9-1L4 3Z" fill="#243f38" stroke="white" stroke-width="2.5" stroke-linejoin="round"/></svg><span class="chat-demo-click"></span>
    <div class="chat-demo-footer"><span class="chat-demo-caption">Chọn tài liệu</span><span class="chat-demo-dots"><i></i><i></i><i></i><i></i></span></div>
  </div><button class="chat-demo-play" type="button" aria-label="Pause Chatbot animation" aria-pressed="false">Ⅱ</button><span class="sr-only">Minh họa Chatbot: chọn tài liệu Cấu trúc dữ liệu, hỏi chi tiết về Bubble Sort, sau đó tạo quiz và đề thi để luyện tập.</span>`;
  const film = host.querySelector('.chat-demo-film'), cursor = host.querySelector('.chat-demo-cursor');
  const ring = host.querySelector('.chat-demo-click'), caption = host.querySelector('.chat-demo-caption');
  const question = host.querySelector('.chat-demo-question'), answer = host.querySelector('.chat-demo-answer-text');
  const button = host.querySelector('.chat-demo-play'), preference = matchMedia('(prefers-reduced-motion: reduce)');
  const request = 'Giải thích Bubble Sort với dãy [5, 2, 4, 1]. Vì sao vòng lặp giảm n - i - 1?';
  const reply = 'So sánh hai phần tử liền kề rồi đổi chỗ nếu sai thứ tự. Sau lượt đầu, 5 về cuối. n - i - 1 bỏ qua phần cuối đã được sắp xếp.';
  const captions = ['Chọn tài liệu', 'Tài liệu đã sẵn sàng', 'Đặt câu hỏi chi tiết', 'AI giải thích bằng ví dụ', 'Tạo quiz từ tài liệu', 'Luyện tập với câu hỏi', 'Tạo đề thi để tự kiểm tra'];
  let elapsed = 0, previous = 0, frame = null, visible = false, paused = false;
  const route = [[0,null,87,81],[1.1,'.chat-demo-file'],[2.1,'.chat-demo-file'],[2.9,'.chat-demo-composer'],[4.8,'.chat-demo-composer span'],[5.4,'.chat-demo-composer span'],[7.8,'.chat-demo-quiz'],[8.4,'.chat-demo-quiz'],[10.3,'.chat-demo-option.correct'],[11.2,'.chat-demo-option.correct'],[12.4,'.chat-demo-test'],[13.2,'.chat-demo-test'],[15,null,86,84],[18,null,86,84]];
  function draw() {
    const t=elapsed%18000/1000;
    const stage=t<1.3?0:t<2.5?1:t<5.4?2:t<7.4?3:t<8.5?4:t<12?5:6;
    film.dataset.stage=String(stage); caption.textContent=captions[stage];
    film.classList.toggle('chat-demo-reset',t>17.2);
    film.classList.toggle('chat-demo-clicking',[1.2,5.2,8.2,10.9,13].some(point=>t>=point&&t<point+.3));
    film.classList.toggle('chat-demo-show-result',t>=8.6);
    film.classList.toggle('chat-demo-answered',t>=10.9);
    question.textContent=request.slice(0,Math.floor(Math.max(0,t-2.7)*36));
    answer.textContent=reply.slice(0,Math.floor(Math.max(0,t-5.5)*77));
    host.querySelector('.chat-demo-result-label').textContent=t>=13.3?'ĐỀ THI · TỰ LUẬN':'QUIZ · BUBBLE SORT';
    host.querySelector('.chat-demo-result-question').textContent=t>=13.3?'Luyện tập: Thuật toán sắp xếp':'Sau mỗi lượt duyệt, phần tử nào về cuối?';
    film.classList.toggle('chat-demo-test-visible',t>=13.3);
    const bounds=film.getBoundingClientRect();
    function point(index) {
      const p=route[index]; if(!p[1])return[p[2],p[3]];
      const rect=host.querySelector(p[1]).getBoundingClientRect();
      return[(rect.left+rect.width/2-bounds.left)/bounds.width*100,(rect.top+rect.height/2-bounds.top)/bounds.height*100];
    }
    const end=route.findIndex(p=>p[0]>t),aIndex=Math.max(0,end-1),bIndex=end<0?route.length-1:end;
    const a=point(aIndex),b=point(bIndex),u=Math.max(0,Math.min(1,(t-route[aIndex][0])/(route[bIndex][0]-route[aIndex][0]||1)));
    const ease=u*u*(3-2*u),bend=Math.sin(ease*Math.PI)*Math.min(4,Math.hypot(b[0]-a[0],b[1]-a[1])*.12);
    cursor.style.left=ring.style.left=`${a[0]+(b[0]-a[0])*ease+bend}%`;
    cursor.style.top=ring.style.top=`${a[1]+(b[1]-a[1])*ease-bend}%`;
  }
  function tick(now){if(previous)elapsed+=Math.min(100,now-previous);previous=now;draw();frame=requestAnimationFrame(tick);}
  function sync(){
    if(frame!==null)cancelAnimationFrame(frame);frame=null;previous=0;
    if(preference.matches){elapsed=15000;draw();button.hidden=true;return;}
    button.hidden=false;if(!paused&&visible&&!document.hidden)frame=requestAnimationFrame(tick);
  }
  button.addEventListener('click',()=>{paused=!paused;button.setAttribute('aria-pressed',String(paused));button.setAttribute('aria-label',paused?'Play Chatbot animation':'Pause Chatbot animation');button.textContent=paused?'▶':'Ⅱ';sync();});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.15}).observe(host);
  document.addEventListener('visibilitychange',sync);preference.addEventListener('change',sync);draw();sync();
})();
