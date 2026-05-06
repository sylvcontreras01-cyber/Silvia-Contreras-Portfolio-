/* ============================================================
   SILVIA CONTRERAS · PORTFOLIO — Interactions & Animations
   ============================================================ */

/* ── Theme toggle ───────────────────────────────────────────── */
(function () {
  const btns = [
    document.getElementById('themeToggleNav'),
    document.getElementById('themeToggle')
  ].filter(Boolean);
  const body = document.body;
  const LIGHT = 'light-mode';

  function apply(isLight) {
    body.classList.toggle(LIGHT, isLight);
    btns.forEach(b => b.textContent = isLight ? '🌙' : '☀️');
  }

  apply(false);

  btns.forEach(btn => btn.addEventListener('click', () => {
    const isLight = !body.classList.contains(LIGHT);
    apply(isLight);
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  }));
})();

/* ── Navbar scroll ──────────────────────────────────────────── */
(function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();

/* ── Menu overlay ───────────────────────────────────────────── */
(function () {
  const toggle  = document.getElementById('navToggle');
  const overlay = document.getElementById('menuOverlay');
  const closeBtn = document.getElementById('menuClose');
  if (!toggle || !overlay) return;

  function openMenu() {
    overlay.classList.add('active');
    toggle.classList.add('open');
    document.body.classList.add('menu-open');
  }
  function closeMenu() {
    overlay.classList.remove('active');
    toggle.classList.remove('open');
    document.body.classList.remove('menu-open');
  }

  toggle.addEventListener('click', () => {
    overlay.classList.contains('active') ? closeMenu() : openMenu();
  });
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  overlay.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
})();

/* ── Scroll progress bar ────────────────────────────────────── */
(function () {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });
})();

/* ── Custom cursor glow ─────────────────────────────────────── */
(function () {
  const glow = document.getElementById('cursorGlow');
  if (!glow || window.matchMedia('(pointer: coarse)').matches) {
    if (glow) glow.style.display = 'none';
    return;
  }
  let mx = -200, my = -200, cx = -200, cy = -200;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function loop() {
    cx += (mx - cx) * 0.1;
    cy += (my - cy) * 0.1;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a, button, .project-card, .service-card').forEach(el => {
    el.addEventListener('mouseenter', () => glow.classList.add('big'));
    el.addEventListener('mouseleave', () => glow.classList.remove('big'));
  });
})();

/* ── Scroll reveal (IntersectionObserver) ───────────────────── */
(function () {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
        if (e.target.classList.contains('section-title')) {
          e.target.classList.add('line-in');
        }
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* Trigger clients-section rail fade-in */
  const clientsSec = document.getElementById('clientsSection');
  if (clientsSec) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { clientsSec.classList.add('visible'); cio.unobserve(clientsSec); }
      });
    }, { threshold: 0.15 });
    cio.observe(clientsSec);
  }
})();

/* ── Methodology line fill ──────────────────────────────────── */
(function () {
  const line  = document.getElementById('methodLine');
  const steps = document.getElementById('methodSteps');
  if (!line || !steps) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        line.classList.add('filled');
        steps.querySelectorAll('.method-step').forEach((step, i) => {
          setTimeout(() => step.classList.add('active'), i * 260 + 400);
        });
        io.unobserve(steps);
      }
    });
  }, { threshold: 0.25 });
  io.observe(steps);
})();

/* ── Number counters (eased) ────────────────────────────────── */
(function () {
  function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();
      function update(now) {
        const t = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(easeOutQuart(t) * target) + suffix;
        if (t < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-num[data-target]').forEach(el => io.observe(el));
})();

/* ── Particles flotantes (hero) ─────────────────────────────── */
(function () {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  /* Mobile/tablet: sin partículas para mantener rendimiento */
  if (window.matchMedia('(max-width: 1024px)').matches) return;

  /* Desktop: 45 partículas completas */
  for (let i = 0; i < 45; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size     = Math.random() * 7 + 2;
    const isPurple = Math.random() > 0.45;
    const dx  = (Math.random() - 0.5) * 80;
    const dy  = -(Math.random() * 80 + 30);
    const dx2 = (Math.random() - 0.5) * 60;
    const dy2 = -(Math.random() * 100 + 60);
    p.style.cssText = [
      `width:${size}px`,
      `height:${size}px`,
      `left:${Math.random() * 100}%`,
      `top:${Math.random() * 100}%`,
      `--dur:${(Math.random() * 10 + 8).toFixed(1)}s`,
      `--del:${(Math.random() * 10).toFixed(1)}s`,
      `--dx:${dx.toFixed(0)}px`,
      `--dy:${dy.toFixed(0)}px`,
      `--dx2:${dx2.toFixed(0)}px`,
      `--dy2:${dy2.toFixed(0)}px`,
      isPurple ? 'background:rgba(81,0,135,.6)' : 'background:rgba(101,6,1,.55)',
    ].join(';');
    container.appendChild(p);
  }
})();

/* ── Constellation canvas (full-page background) ─────────────── */
(function () {
  const canvas = document.getElementById('constellation');
  if (!canvas) return;

  /* Mobile/tablet: desactivar completamente */
  if (window.matchMedia('(max-width: 1024px)').matches) {
    canvas.style.display = 'none';
    return;
  }

  /* Desktop: constelación completa con interacción de cursor */
  const ctx = canvas.getContext('2d');
  let W, H, pts = [], mx = -9999, my = -9999;
  const N = 80, LINK = 135;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function init() {
    resize();
    pts = [];
    for (let i = 0; i < N; i++) {
      pts.push({
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r:  Math.random() * 1.8 + 0.5,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < N; i++) {
      const a = pts[i];
      for (let j = i + 1; j < N; j++) {
        const b = pts[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < LINK * LINK) {
          const dist = Math.sqrt(d2);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(81,0,135,${(1 - dist / LINK) * 0.2})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
      /* Líneas al cursor */
      const cdx = a.x - mx, cdy = a.y - my;
      const cd2 = cdx * cdx + cdy * cdy;
      if (cd2 < 200 * 200) {
        const cd = Math.sqrt(cd2);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(mx, my);
        ctx.strokeStyle = `rgba(81,0,135,${(1 - cd / 200) * 0.45})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(81,0,135,.45)';
      ctx.fill();

      a.x += a.vx; a.y += a.vy;
      if (a.x < 0 || a.x > W) a.vx *= -1;
      if (a.y < 0 || a.y > H) a.vy *= -1;
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', init);
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  init();
  draw();
})();

/* ── Hero typewriter roles ────────────────────────────────────── */
(function () {
  const el = document.getElementById('heroTypedRole');
  if (!el) return;
  const roles = [
    'Creadora Multilingüe',
    'Consultora de IA',
    'Estratega de Contenido',
    'Copywriting',
  ];
  let ri = 0, ci = 0, deleting = false;
  function tick() {
    const s = roles[ri];
    if (!deleting) {
      ci++;
      el.textContent = s.slice(0, ci);
      if (ci === s.length) { deleting = true; return setTimeout(tick, 1800); }
    } else {
      ci--;
      el.textContent = s.slice(0, ci);
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
    }
    setTimeout(tick, deleting ? 38 : 72);
  }
  setTimeout(tick, 1900);
})();

/* ── 3-D card tilt (project cards) ──────────────────────────── */
(function () {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateY(-10px) scale(1.01)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();

/* ── Parallax — hero photo on scroll ────────────────────────── */
(function () {
  const visual = document.querySelector('.hero-visual');
  if (!visual) return;
  window.addEventListener('scroll', () => {
    visual.style.transform = `translateY(${window.scrollY * 0.22}px)`;
  }, { passive: true });
})();

/* ── Ripple on primary buttons ──────────────────────────────── */
(function () {
  document.querySelectorAll('.btn-primary, .btn-cta').forEach(btn => {
    btn.addEventListener('click', e => {
      const r = document.createElement('span');
      r.className = 'ripple';
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px`;
      btn.appendChild(r);
      setTimeout(() => r.remove(), 600);
    });
  });
})();

/* ── Sparkles on CTA button hover ───────────────────────────── */
(function () {
  const cta = document.querySelector('.btn-cta');
  if (!cta) return;
  let interval;
  function addSparkle() {
    const s = document.createElement('span');
    s.className = 'sparkle';
    const rect = cta.getBoundingClientRect();
    const angle = Math.random() * 360;
    const dist  = 30 + Math.random() * 30;
    s.style.cssText = [
      `left:${Math.random() * rect.width}px`,
      `top:${Math.random() * rect.height}px`,
      `--sx:${Math.cos(angle) * dist}px`,
      `--sy:${Math.sin(angle) * dist - 40}px`,
      `background:${['#fbbf24','#ff6b6b','#fff','#669BBC'][Math.floor(Math.random()*4)]}`,
    ].join(';');
    cta.appendChild(s);
    setTimeout(() => s.remove(), 600);
  }
  cta.addEventListener('mouseenter', () => { interval = setInterval(addSparkle, 120); });
  cta.addEventListener('mouseleave', () => { clearInterval(interval); });
})();

/* ── Magnetic buttons ───────────────────────────────────────── */
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width  / 2) * 0.28;
      const dy = (e.clientY - rect.top  - rect.height / 2) * 0.28;
      btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-2px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
})();

/* ── Active nav link on scroll ──────────────────────────────── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !links.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => io.observe(s));
})();

/* ── Project Modal ──────────────────────────────────────────── */
(function () {
  const modal    = document.getElementById('projectModal');
  const backdrop = document.getElementById('modalBackdrop');
  const closeBtn = document.getElementById('modalClose');
  const scroll   = document.getElementById('modalScroll');
  if (!modal) return;

  const projects = [
    {
      title:       'Fundación Entre Soles y Lunas',
      category:    'Estrategia Digital · Gestión de Contenidos',
      year:        '2025',
      emoji:       '🌟',
      bg:          'mbg-1',
      cover:       'Projects/ESL/PortadaESL.jpg',
      badgeLabel:  'Impacto Social',
      intro:       'Desarrollé e implementé la estrategia de comunicación digital completa de la Fundación: desde el reposicionamiento de marca y la dirección de activos digitales, hasta la elaboración de contenido educativo sobre patrimonio, regeneración y migración. Ejecuté el ciclo completo de contenido centralizando la operación en Meta Business Suite.',
      challengeCards: [
        { icon: '🏛️', title: 'El contexto', body: 'La Fundación necesitaba diferenciarse visualmente de Universo Mola, restablecer coherencia de marca y desarrollar contenido educativo que comunicara auténticamente su misión en patrimonio, regeneración y movilidad migratoria.' },
        { icon: '🎯', title: 'Los objetivos', body: 'Impulsar la misión institucional mediante una estrategia digital medible, con KPIs de participación y retención que permitieran evaluar y optimizar la dirección de contenidos de forma continua.' },
      ],
      steps: [
        { num: '01', title: 'Reposicionamiento de marca',   desc: 'Se precisó la identidad de la Fundación y se la distinguió visualmente de Universo Mola para restablecer el reconocimiento y la coherencia comunicativa.' },
        { num: '02', title: 'Dirección de contenidos',      desc: 'Implementé un sistema de contenidos orientado a la misión, enfocado en patrimonio, regeneración y movilidad migratoria, con Content Planning semanal estructurado.' },
        { num: '03', title: 'Elaboración de contenidos',    desc: 'Transformé temas estratégicos en formatos estructurados: carruseles educativos, vídeos breves y narrativas persuasivas adaptadas al algoritmo orgánico de Meta.' },
        { num: '04', title: 'Optimización del rendimiento', desc: 'Supervisé KPIs y datos de Meta Ads para perfeccionar la estrategia, aumentar la interacción y expandir el alcance. Monitoreo de métricas y optimización de algoritmos orgánicos desde Meta Business Suite.' },
        { num: '05', title: 'Campaña de recaudación',       desc: 'Lideré una campaña de crowdfunding en Instagram que recaudó $300.000 COP en donaciones, generando aprendizajes clave sobre educación de audiencia y coherencia narrativa para futuras iniciativas de conversión.' },
      ],
      quote:       'La coherencia narrativa entre misión e identidad visual no es estética — es la base que convierte seguidores en donantes y aliados en causas de impacto real.',
      quoteSource: '— Silvia Contreras, Estratega de Contenidos',
      results: [
        { icon: '📈', title: '+171% interacción en Instagram', body: 'Incremento de engagement orgánico sostenido durante 6 meses de gestión continua.' },
        { icon: '👥', title: '+93% interacción en Facebook',   body: 'Crecimiento de participación en la segunda plataforma clave de la Fundación.' },
        { icon: '👁️', title: '3.000 espectadores en Instagram', body: 'Alcance de audiencia real en contenido educativo sobre patrimonio y migración.' },
        { icon: '🚀', title: '+1.000 nuevos seguidores',       body: 'Crecimiento orgánico de comunidad en un periodo de 6 meses sin inversión en pauta.' },
      ],
      showcase: {
        video: 'Projects/ESL/VIDEO FUNDACION.mp4',
        images: [
          { src: 'Projects/ESL/INDIGENEAS.jpg',  alt: 'Comunidades Indígenas' },
          { src: 'Projects/ESL/INDIGENEAS1.jpg', alt: 'Comunidades Indígenas 1' },
          { src: 'Projects/ESL/INDIGENEAS3.jpg', alt: 'Comunidades Indígenas 3' },
          { src: 'Projects/ESL/INDIGENEAS5.jpg', alt: 'Comunidades Indígenas 5' },
        ],
      },
      feed: [
        { src: 'Projects/ESL/CP1.jpg',              alt: 'Entre Soles y Lunas — CP1' },
        { src: 'Projects/ESL/CP2.jpg',              alt: 'Entre Soles y Lunas — CP2' },
        { src: 'Projects/ESL/CP3.jpg',              alt: 'Entre Soles y Lunas — CP3' },
        { src: 'Projects/ESL/CHOCOLATE1.jpg',       alt: 'Entre Soles y Lunas — Chocolate' },
        { src: 'Projects/ESL/MODA COLOMBIA.jpg',    alt: 'Entre Soles y Lunas — Moda Colombia' },
        { src: 'Projects/ESL/post12.jpg',           alt: 'Entre Soles y Lunas — Post 12' },
        { src: 'Projects/ESL/RERPRESENTACION.jpg',  alt: 'Entre Soles y Lunas — Representación' },
        { src: 'Projects/ESL/NOTICIAS.jpg',         alt: 'Entre Soles y Lunas — Noticias' },
        { src: 'Projects/ESL/INDIGENEAS.jpg',        alt: 'Entre Soles y Lunas — Comunidades Indígenas' },
      ],
      tags:  ['Estrategia Digital', 'Meta Business Suite', 'Content Planning', 'Identidad Visual', 'KPIs & Analytics'],
      stats: [
        { num: '+171%', lbl: 'Interacción Instagram' },
        { num: '+1K',   lbl: 'Nuevos seguidores' },
        { num: '$300K', lbl: 'COP recaudados' },
      ],
    },
    {
      title:       'Sheknoows',
      category:    'Estrategia Digital · Comunidad · Eventos',
      year:        '2023',
      emoji:       '💼',
      bg:          'mbg-2',
      cover:       'Sheknoows/sheknoows portada.png',
      badgeLabel:  'Comunidad Femenina',
      intro:       'Sheknoows es una comunidad que conecta a mujeres con conocimientos especializados, incrementando su visibilidad y apoyándolas en su desarrollo profesional y personal. Su misión es enlazarlas con empresas, medios de comunicación, eventos y la sociedad en su conjunto. Lideré la reactivación digital y el reposicionamiento de marca tras dos años de inactividad, con el objetivo de atraer ponentes de alto nivel para su festival anual.',
      challengeCards: [
        { icon: '💤', title: 'El contexto',  body: 'Dos años de inactividad digital habían erosionado el posicionamiento orgánico de la comunidad. Era necesario revitalizar la marca y generar confianza antes del festival.' },
        { icon: '🎯', title: 'Los objetivos', body: 'Incrementar la interacción un 50%, captar 10 ponentes de alto impacto y coordinar la postproducción audiovisual de más de 50 oradores en YouTube.' },
      ],
      steps: [
        { num: '01', title: 'Estrategia de expansión de audiencia', desc: 'Diseñé un plan de contenidos transmedia de 3 meses para Instagram, YouTube y Facebook. Definí KPIs críticos y monitoreé el desempeño con herramientas de analítica empresarial para optimización en tiempo real. Administré el sitio web en WordPress.' },
        { num: '02', title: 'Activación de la comunidad',           desc: 'Desarrollé una estrategia de reactivación de clientes potenciales para antiguos asistentes mediante campañas segmentadas en Mailchimp. Creé una comunidad en WhatsApp para fomentar la participación orgánica.' },
        { num: '03', title: 'Selección y coordinación de ponentes', desc: 'Establecí un proceso sistemático de difusión y coordinación para asegurar y programar a los ponentes del festival de dos días, logrando la captación de 10 perfiles de alto impacto.' },
        { num: '04', title: 'Potenciación de contenido en evento',  desc: 'Grabé las sesiones, elaboré resúmenes optimizados y diseñé miniaturas personalizadas para maximizar el alcance post-evento. Publiqué en WordPress y realicé seguimiento de rendimiento con analítica empresarial.' },
      ],
      quote:       'Reactivar una comunidad dormida requiere más que publicar — requiere reconstruir la confianza. Cada pieza de contenido fue una invitación a volver a pertenecer.',
      quoteSource: '— Silvia Contreras, Estratega de Contenidos',
      results: [
        { icon: '🎤', title: '+40 oradores',          body: 'Líderes y expertos captados para el festival, superando el objetivo inicial de 10 ponentes de alto impacto.' },
        { icon: '🌍', title: '+11 países',             body: 'Participación internacional que amplió el alcance de la comunidad más allá de las fronteras locales.' },
        { icon: '👁️', title: '+200 espectadores',      body: 'Alcance orgánico conseguido durante el evento gracias a la estrategia transmedia y la activación de comunidad.' },
        { icon: '♻️', title: '+20 espacios cocreación', body: 'Círculos femeninos, conferencias y espacios de cocreación generados como resultado del festival.' },
      ],
      feed: [
        { src: 'Sheknoows/S1.jpg', alt: 'Sheknoows — S1' },
        { src: 'Sheknoows/S2.jpg', alt: 'Sheknoows — S2' },
        { src: 'Sheknoows/S3.jpg', alt: 'Sheknoows — S3' },
        { src: 'Sheknoows/S4.jpg', alt: 'Sheknoows — S4' },
        { src: 'Sheknoows/S5.jpg', alt: 'Sheknoows — S5' },
        { src: 'Sheknoows/S6.jpg', alt: 'Sheknoows — S6' },
        { src: 'Sheknoows/S7.jpg', alt: 'Sheknoows — S7' },
        { src: 'Sheknoows/S8.jpg', alt: 'Sheknoows — S8' },
        { src: 'Sheknoows/S9.jpg', alt: 'Sheknoows — S9' },
      ],
      showcase: {
        video: 'Sheknoows/VIDEO SHEKNOOWS.mp4',
        images: [
          { src: 'Sheknoows/S7.jpg',   alt: 'Sheknoows — S7' },
          { src: 'Sheknoows/carr2.jpg', alt: 'Sheknoows — 2' },
          { src: 'Sheknoows/carr3.jpg', alt: 'Sheknoows — 3' },
          { src: 'Sheknoows/carr4.jpg', alt: 'Sheknoows — 4' },
        ],
      },
      tags:  ['Estrategia Digital', 'Gestión de Comunidad', 'Email Marketing', 'WordPress', 'Eventos', 'YouTube'],
      stats: [
        { num: '+40',  lbl: 'Oradores y líderes' },
        { num: '+11',  lbl: 'Países representados' },
        { num: '+200', lbl: 'Espectadores' },
        { num: '+8',   lbl: 'Conferencias Google #IamRemarkable' },
      ],
    },
    {
      title:       'High Ticket Converting',
      category:    'B2B Marketing · LinkedIn Strategy',
      year:        '2024',
      emoji:       '🎯',
      bg:          'mbg-3',
      cover:       'Sheknoows/HIGH PORTADA.png',
      badgeLabel:  'Marketing B2B',
      intro:       'High Ticket Converting es una agencia de marketing especializada en estrategias B2B de alta conversión: prospección en frío y campañas en LinkedIn para vincular empresas con las oportunidades idóneas. Con más de 24 empresas activas, mi rol fue la gestión integral de contenido B2B en LinkedIn, sincronizando alcance orgánico con estrategias Outbound e implementando herramientas de IA para escalar la producción de contenido de alta conversión y guiones audiovisuales.',
      challengeCards: [
        { icon: '🏢', title: 'El contexto',    body: 'Agencia con historial comprobado de resultados B2B que colabora con más de 24 empresas. Necesitaba contenido que construyera Thought Leadership, atrajera audiencia cualificada y alimentara el pipeline de prospección.' },
        { icon: '🎯', title: 'Los objetivos',  body: 'Optimizar el Pipeline B2B con contenido de alta conversión y Social Selling; consolidar Thought Leadership para maximizar alcance orgánico; y sincronizar SEO y Copywriting con flujos Outbound para elevar la tasa de cierre.' },
      ],
      steps: [
        { num: '01', title: 'Investigación y posicionamiento estratégico', desc: 'Identifiqué las debilidades de la audiencia, las propuestas de valor diferenciales y las oportunidades de palabras clave para alinear los mensajes con la demanda real del mercado.' },
        { num: '02', title: 'Generación de contenido enfocada en conversión', desc: 'Desarrollé una estrategia de Content Marketing en LinkedIn diseñada para nutrir el Buyer\'s Journey. Implementé narrativas persuasivas (Copywriting) y CTAs estratégicos para captar el interés de Decision Makers y convertir leads.' },
        { num: '03', title: 'Integración de comunicación divulgativa', desc: 'Alineé el contenido orgánico con tácticas de Cold Outreach para garantizar una comunicación coherente en todo el Embudo de Ventas B2B, asegurando consistencia de mensaje en cada punto de contacto.' },
        { num: '04', title: 'Optimización del rendimiento', desc: 'Auditoría constante de KPIs de interacción para el refinamiento de mensajes. Optimización basada en datos para elevar Brand Authority, visibilidad orgánica y la calidad del Lead Scoring.' },
      ],
      quote:       'En el mercado B2B de alto valor, la autoridad de contenido no es opcional — es el primer filtro que los decisores aplican antes de responder cualquier mensaje.',
      quoteSource: '— Silvia Contreras, Estratega de Contenidos B2B',
      results: [
        { icon: '📊', title: '+25% alcance en LinkedIn',           body: 'Incremento en el alcance orgánico mediante contenido estratégico alineado con el algoritmo de LinkedIn.' },
        { icon: '👥', title: '+20% crecimiento de audiencia B2B', body: 'Tasa de crecimiento sostenida de audiencia cualificada, con perfiles de Decision Makers y C-Level.' },
        { icon: '💬', title: '+20% tasa de interacción',          body: 'Mejora en engagement gracias a narrativas persuasivas y CTAs optimizados para el Buyer\'s Journey.' },
        { icon: '🤖', title: '+30% reducción en producción',      body: 'Implementación de herramientas de IA que redujeron el tiempo de producción de contenido y guiones audiovisuales.' },
      ],
      tags:  ['B2B Strategy', 'LinkedIn Marketing', 'Social Selling', 'Copywriting', 'IA aplicada', 'Outbound'],
      stats: [
        { num: '+25%', lbl: 'Alcance LinkedIn' },
        { num: '+20%', lbl: 'Audiencia B2B' },
        { num: '+30%', lbl: 'Eficiencia con IA' },
        { num: '24+',  lbl: 'Empresas activas' },
      ],
      feed: [
        { src: 'Higticket fotos/high1.jpg', alt: 'High Ticket — 1' },
        { src: 'Higticket fotos/high2.jpg', alt: 'High Ticket — 2' },
        { src: 'Higticket fotos/high3.jpg', alt: 'High Ticket — 3' },
        { src: 'Higticket fotos/high4.jpg', alt: 'High Ticket — 4' },
        { src: 'Higticket fotos/high5.jpg', alt: 'High Ticket — 5' },
        { src: 'Higticket fotos/high6.jpg', alt: 'High Ticket — 6' },
        { src: 'Higticket fotos/high7.jpg', alt: 'High Ticket — 7' },
        { src: 'Higticket fotos/high8.jpg', alt: 'High Ticket — 8' },
        { src: 'Higticket fotos/high9.jpg', alt: 'High Ticket — 9' },
      ],
      showcase: {
        images: [
          { src: 'Higticket fotos/ca1.jpg', alt: 'High Ticket — Carrusel 1' },
          { src: 'Higticket fotos/ca2.jpg', alt: 'High Ticket — Carrusel 2' },
          { src: 'Higticket fotos/ca3.jpg', alt: 'High Ticket — Carrusel 3' },
        ],
      },
      videos: [
        'Higticket fotos/video1.mp4',
        'Higticket fotos/video2.mp4',
      ],
    },
  ];

  function openModal(idx) {
    const p = projects[idx];
    scroll.innerHTML = `
      <div class="modal-hero-visual">
        ${p.cover
          ? `<img class="modal-hero-cover" src="${p.cover}" alt="${p.title}" />`
          : `<div class="mbg ${p.bg}">${p.emoji}</div>`}
        <div class="modal-hero-badge">${p.badgeLabel}</div>
      </div>
      <div class="modal-content">
        <div class="modal-meta">
          <span class="modal-category">${p.category}</span>
          <span class="modal-year">${p.year}</span>
        </div>
        <h2 class="modal-title">${p.title}</h2>
        <p class="modal-intro">${p.intro}</p>
        <div class="modal-tags">
          ${p.tags.map(t => `<span class="modal-tag">${t}</span>`).join('')}
        </div>

        <div class="cs-block">
          <span class="cs-label">Contexto</span>
          <div class="cs-grid-2">
            ${p.challengeCards.map(c => `
              <div class="cs-card">
                <div class="cs-card-icon">${c.icon}</div>
                <div class="cs-card-title">${c.title}</div>
                <div class="cs-card-body">${c.body}</div>
              </div>`).join('')}
          </div>
        </div>

        <div class="cs-block">
          <span class="cs-label">Proceso</span>
          <h3 class="cs-block-title">Cómo lo hice</h3>
          <div class="cs-steps">
            ${p.steps.map(s => `
              <div class="cs-step">
                <span class="cs-step-num">${s.num}</span>
                <div>
                  <div class="cs-step-title">${s.title}</div>
                  <div class="cs-step-desc">${s.desc}</div>
                </div>
              </div>`).join('')}
          </div>
        </div>

        <div class="cs-quote">
          <div class="cs-quote-text">${p.quote}</div>
          <div class="cs-quote-source">${p.quoteSource}</div>
        </div>

        <div class="cs-block">
          <span class="cs-label">Resultados</span>
          <h3 class="cs-block-title">Impacto logrado</h3>
          <div class="cs-results-grid">
            ${p.results.map(r => `
              <div class="cs-result-item">
                <span class="cs-result-icon">${r.icon}</span>
                <div class="cs-result-text">
                  <strong>${r.title}</strong>${r.body}
                </div>
              </div>`).join('')}
          </div>
        </div>

        <div class="modal-divider"></div>
        <div class="modal-highlights">
          ${p.stats.map(s => `
            <div class="modal-highlight-item">
              <span class="modal-highlight-num">${s.num}</span>
              <span class="modal-highlight-lbl">${s.lbl}</span>
            </div>`).join('')}
        </div>

        ${p.feed ? `
        <div class="cs-feed">
          <span class="cs-label">Visuales del proyecto</span>
          <div class="cs-feed-grid">
            ${p.feed.map(img => `
              <div class="cs-feed-item">
                <img src="${img.src}" alt="${img.alt}" loading="lazy" />
              </div>`).join('')}
          </div>
        </div>` : p.gallery ? `
        <div class="cs-gallery">
          <span class="cs-label">Visuales del proyecto</span>
          <div class="cs-gallery-track">
            ${p.gallery.map(img => `
              <div class="cs-gallery-item${img.featured ? ' featured' : ''}">
                <img src="${img.src}" alt="${img.alt}" loading="lazy" />
              </div>`).join('')}
          </div>
        </div>` : ''}

        ${p.showcase ? `
        <div class="cs-showcase">
          <span class="cs-label">Contenido en Movimiento</span>
          <div class="cs-showcase-layout">
            <div class="cs-showcase-strip">
              ${p.showcase.images.map(img => `
                <div class="cs-showcase-card">
                  <img src="${img.src}" alt="${img.alt}" loading="lazy" />
                </div>`).join('')}
            </div>
            ${p.showcase.video ? `<div class="cs-phone-centered">
              <div class="cs-phone-outer">
                <div class="cs-phone-glow"></div>
                <div class="cs-phone">
                  <div class="cs-phone-notch"></div>
                  <div class="cs-phone-screen">
                    <video loop playsinline>
                      <source src="${p.showcase.video}" type="video/mp4" />
                    </video>
                    <div class="cs-phone-play-btn" role="button" aria-label="Reproducir / Pausar">
                      <div class="cs-phone-play-icon">
                        <svg class="icon-play" viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M8 5v14l11-7z"/></svg>
                        <svg class="icon-pause" viewBox="0 0 24 24" fill="currentColor" width="22" height="22" style="display:none"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>` : ''}
          </div>
        </div>` : ''}

        ${p.videos ? `
        <div class="cs-videos">
          <span class="cs-label">Videos del proyecto</span>
          <div class="cs-videos-grid">
            ${p.videos.map(v => `
              <div class="cs-phone-outer">
                <div class="cs-phone-glow"></div>
                <div class="cs-phone">
                  <div class="cs-phone-notch"></div>
                  <div class="cs-phone-screen">
                    <video loop playsinline>
                      <source src="${v}" type="video/mp4" />
                    </video>
                    <div class="cs-phone-play-btn" role="button" aria-label="Reproducir / Pausar">
                      <div class="cs-phone-play-icon">
                        <svg class="icon-play" viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M8 5v14l11-7z"/></svg>
                        <svg class="icon-pause" viewBox="0 0 24 24" fill="currentColor" width="22" height="22" style="display:none"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>`).join('')}
          </div>
        </div>` : ''}

        <div class="modal-actions">
          <a href="https://wa.me/573193383155?text=Hola%20Silvia!%20Vi%20tu%20proyecto%20${encodeURIComponent(p.title)}%20y%20me%20gustar%C3%ADa%20hablar"
             target="_blank" class="btn btn-primary">
            Hablar de este proyecto
          </a>
        </div>
      </div>`;
    scroll.scrollTop = 0;
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    /* Lightbox for feed/gallery images */
    if (p.feed || p.gallery) {
      let lb = document.getElementById('csLightbox');
      if (!lb) {
        lb = document.createElement('div');
        lb.id = 'csLightbox';
        lb.className = 'cs-lightbox';
        lb.innerHTML = '<span class="cs-lightbox-close" aria-label="Cerrar">×</span><img src="" alt="" />';
        document.body.appendChild(lb);
        lb.addEventListener('click', e => {
          if (e.target === lb || e.target.classList.contains('cs-lightbox-close')) lb.classList.remove('open');
        });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('open'); });
      }
      const lbImg = lb.querySelector('img');
      scroll.querySelectorAll('.cs-gallery-item img, .cs-feed-item img, .cs-showcase-card img').forEach(img => {
        img.parentElement.style.cursor = 'zoom-in';
        img.parentElement.addEventListener('click', () => {
          lbImg.src = img.src;
          lbImg.alt = img.alt;
          lb.classList.add('open');
        });
      });
    }

    /* Play / pause — wires up every phone in the modal */
    scroll.querySelectorAll('.cs-phone-screen').forEach(screen => {
      const video   = screen.querySelector('video');
      const btn     = screen.querySelector('.cs-phone-play-btn');
      if (!video || !btn) return;
      const iPlay  = btn.querySelector('.icon-play');
      const iPause = btn.querySelector('.icon-pause');
      btn.addEventListener('click', () => {
        if (video.paused) {
          video.play();
          btn.classList.add('playing');
          iPlay.style.display  = 'none';
          iPause.style.display = 'block';
        } else {
          video.pause();
          btn.classList.remove('playing');
          iPlay.style.display  = 'block';
          iPause.style.display = 'none';
        }
      });
      video.addEventListener('ended', () => {
        btn.classList.remove('playing');
        iPlay.style.display  = 'block';
        iPause.style.display = 'none';
      });
    });
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    /* Pause all phone videos when modal closes */
    modal.querySelectorAll('.cs-phone-screen video').forEach(v => v.pause());
  }

  document.querySelectorAll('.project-card').forEach((card, i) => {
    card.addEventListener('click', () => openModal(i));
  });

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
})();

/* ── Testimonials slider ─────────────────────────────────── */
(function () {
  const slides  = Array.from(document.querySelectorAll('.testi-slide'));
  const dots    = Array.from(document.querySelectorAll('.testi-dot'));
  const btnPrev = document.getElementById('testiPrev');
  const btnNext = document.getElementById('testiNext');
  const track   = document.getElementById('testiTrack');
  const slider  = document.getElementById('testiSlider');
  if (!slides.length) return;

  let current = 0;
  let timer;
  const DELAY = 5000;

  function goTo(n) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(next, DELAY);
  }

  dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); startAuto(); }));
  btnPrev.addEventListener('click', () => { prev(); startAuto(); });
  btnNext.addEventListener('click', () => { next(); startAuto(); });

  /* Pause on hover */
  slider.addEventListener('mouseenter', () => clearInterval(timer));
  slider.addEventListener('mouseleave', startAuto);

  /* Swipe */
  let touchX = 0;
  track.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const delta = e.changedTouches[0].clientX - touchX;
    if (Math.abs(delta) > 45) { delta < 0 ? next() : prev(); startAuto(); }
  });

  goTo(0);
  startAuto();
})();
