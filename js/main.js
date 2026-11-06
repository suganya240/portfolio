(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Boot overlay: once per session, click/key to skip */
  const boot = $('#bootOverlay');
  if (boot) {
    if (sessionStorage.getItem('booted')) boot.remove();
    else {
      sessionStorage.setItem('booted', '1');
      const lines = ['> initializing portfolio...', '> loading skills.json', '> connecting to github', '> rendering sections', '> welcome, visitor'];
      const el = $('#bootLines'); let done = false;
      const end = () => { if (done) return; done = true; boot.classList.add('hide'); setTimeout(() => boot.remove(), 600); };
      boot.addEventListener('click', end); addEventListener('keydown', end, { once: true });
      (function next(i) {
        if (done) return;
        if (i >= lines.length) return setTimeout(end, 400);
        const p = document.createElement('p'); el.appendChild(p); let c = 0;
        const t = setInterval(() => { p.textContent += lines[i][c++] || ''; if (c >= lines[i].length) { clearInterval(t); setTimeout(() => next(i + 1), 150); } }, 20);
      })(0);
    }
  }

  /* Nav: mobile toggle, scrolled state, active link, progress bar */
  const btn = $('.navbar-btn'), menu = $('.navbar-item');
  btn.addEventListener('click', () => { const o = menu.classList.toggle('active'); btn.setAttribute('aria-expanded', o); });
  $$('.navbar-item a').forEach(a => a.addEventListener('click', () => menu.classList.remove('active')));
  const links = $$('.navbar-item a'), secs = $$('main section, section[id]');
  const bar = $('#scrollProgress'), header = $('#header');
  addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (h > 0 ? scrollY / h * 100 : 0) + '%';
    header.classList.toggle('scrolled', scrollY > 40);
    let cur = '';
    secs.forEach(s => { if (scrollY >= s.offsetTop - 140) cur = s.id; });
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
  }, { passive: true });

  /* Nav logo + hero role typewriter */
  $('#navLogo').textContent = 'Suganya';
  const roles = ['Data Analytics Enthusiast', 'Full-Stack Developer', 'React Learner', 'Problem Solver'];
  const role = $('#roleText'); let ri = 0, ci = 0, del = false;
  (function type() {
    const w = roles[ri];
    role.textContent = w.slice(0, del ? --ci : ++ci);
    let d = del ? 40 : 85;
    if (!del && ci === w.length) { del = true; d = 1400; }
    else if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; d = 300; }
    setTimeout(type, reduce ? 99999 : d);
  })();
  if (reduce) role.textContent = roles[0];

  /* Reveal + XP bars fill when visible */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visible'); io.unobserve(e.target);
    $$('.xp-fill', e.target).forEach(f => { f.style.width = f.dataset.w; });
    $$('[data-count]', e.target).forEach(n => {
      const to = +n.dataset.count; let v = 0;
      const st = Math.ceil(to / 30), t = setInterval(() => { v = Math.min(to, v + st); n.textContent = v; if (v >= to) clearInterval(t); }, 40);
    });
  }), { threshold: 0.1 });
  $$('.reveal').forEach(el => io.observe(el));

  /* Hero constellation canvas (data-node network reacting to the cursor) */
  const cv = $('#net'), cx = cv.getContext('2d'); let W, H, pts = [], m = { x: -999, y: -999 };
  const size = () => { W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight;
    pts = Array.from({ length: Math.min(70, W / 14 | 0) }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 })); };
  size(); addEventListener('resize', size);
  cv.parentElement.addEventListener('mousemove', e => { const r = cv.getBoundingClientRect(); m.x = e.clientX - r.left; m.y = e.clientY - r.top; });
  (function draw() {
    cx.clearRect(0, 0, W, H);
    pts.forEach((p, i) => {
      if (!reduce) { p.x += p.vx; p.y += p.vy; }
      if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1;
      cx.fillStyle = 'rgba(0,247,255,.7)'; cx.beginPath(); cx.arc(p.x, p.y, 1.8, 0, 7); cx.fill();
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 110) { cx.strokeStyle = `rgba(0,170,255,${.25 * (1 - d / 110)})`; cx.beginPath(); cx.moveTo(p.x, p.y); cx.lineTo(q.x, q.y); cx.stroke(); }
      }
      const dm = Math.hypot(p.x - m.x, p.y - m.y);
      if (dm < 150) { cx.strokeStyle = `rgba(255,215,0,${.6 * (1 - dm / 150)})`; cx.beginPath(); cx.moveTo(p.x, p.y); cx.lineTo(m.x, m.y); cx.stroke(); }
    });
    requestAnimationFrame(draw);
  })();

  /* Cursor ring */
  const dot = $('#cursorDot'), ring = $('#cursorRing'); let rx = 0, ry = 0, mx = 0, my = 0;
  addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.left = mx + 'px'; dot.style.top = my + 'px'; });
  (function f() { rx += (mx - rx) * .15; ry += (my - ry) * .15; ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; requestAnimationFrame(f); })();
  $$('a, button, .skill-card, .project-card, .level-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover')); el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });

  /* Project filters + 3D tilt */
  $$('.filter').forEach(b => b.addEventListener('click', () => {
    $$('.filter').forEach(x => x.classList.toggle('on', x === b));
    $$('.project-card').forEach(c => c.classList.toggle('gone', b.dataset.f !== 'all' && !c.dataset.tags.includes(b.dataset.f)));
  }));
  if (!reduce) $$('.project-card').forEach(c => {
    c.addEventListener('mousemove', e => { const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      c.style.transform = `perspective(700px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`; });
    c.addEventListener('mouseleave', () => c.style.transform = '');
  });

  /* Certificate lightbox */
  const lb = $('#lightbox');
  $$('.cert-open').forEach(a => a.addEventListener('click', e => { e.preventDefault(); $('img', lb).src = a.href; lb.classList.add('show'); }));
  lb.addEventListener('click', () => lb.classList.remove('show'));
  addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('show'); });

  /* Theme (remembered) */
  const tg = $('#themeToggle');
  const setTheme = l => { document.body.classList.toggle('light-mode', l); tg.firstElementChild.className = l ? 'bx bx-sun' : 'bx bx-moon'; try { localStorage.setItem('theme', l ? 'l' : 'd'); } catch (e) {} };
  try { if (localStorage.getItem('theme') === 'l') setTheme(true); } catch (e) {}
  tg.addEventListener('click', () => setTheme(!document.body.classList.contains('light-mode')));

  /* Contact: copy chips + form opens a pre-filled email */
  const toast = (msg) => { const t = $('#thankYouMsg'); $('span:last-child', t).textContent = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 3500); };
  $$('.chip[data-copy]').forEach(c => c.addEventListener('click', () => { navigator.clipboard?.writeText(c.dataset.copy); toast('Copied ' + c.dataset.copy); }));
  $('#contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const v = id => $('#' + id).value.trim(); let ok = true;
    [['name', v('name'), 'Enter your name'], ['email', /^[^ @]+@[^ @]+\.[a-z]{2,}$/i.test(v('email')) ? 'x' : '', 'Enter a valid email'], ['message', v('message'), 'Write a short message']]
      .forEach(([id, val, err]) => { $('#' + id + 'Error').textContent = val ? '' : err; if (!val) ok = false; });
    if (!ok) return;
    $('#paperPlane').classList.add('fly'); setTimeout(() => $('#paperPlane').classList.remove('fly'), 1300);
    location.href = `mailto:csuganya2400@gmail.com?subject=${encodeURIComponent('Portfolio message from ' + v('name'))}&body=${encodeURIComponent(v('message') + '\n\n' + v('name') + ' (' + v('email') + ')')}`;
    toast('Opening your email app to send the message'); e.target.reset();
  });

  /* Konami easter egg */
  const k = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']; let kp = 0;
  addEventListener('keydown', e => { kp = e.key === k[kp] ? kp + 1 : (e.key === k[0] ? 1 : 0);
    if (kp === k.length) { kp = 0; toast('🎮 Konami unlocked! Thanks for exploring.'); } });
  $('#year').textContent = new Date().getFullYear();
})();
