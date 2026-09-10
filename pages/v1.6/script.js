const article = document.querySelector('.prose');
if (article) {
  const headingBar = document.getElementById('currentHeading');
  const headings = [...article.querySelectorAll('h1, h2')];

  // Give every major heading a stable id.
  headings.forEach((h, i) => {
    if (!h.id) h.id = 'section-' + i;
  });

  // Build the persistent left-side TOPICS navigation.
  const main = document.querySelector('main');
  if (main && !document.querySelector('.reading-layout')) {
    const layout = document.createElement('div');
    layout.className = 'reading-layout';

    const sidebar = document.createElement('aside');
    sidebar.className = 'reading-sidebar';
    sidebar.innerHTML = '<div class="sidebar-label">TOPICS</div><nav aria-label="Topics"></nav>';
    const nav = sidebar.querySelector('nav');

    headings.forEach((h, i) => {
      const link = document.createElement('a');
      link.href = '#' + h.id;
      link.dataset.index = i;
      link.innerHTML = `<span>${String(i + 1).padStart(2, '0')}</span><em>${h.textContent.replace(/^\d+\.\s*/, '').replace(/\s+/g, ' ').trim()}</em>`;
      nav.appendChild(link);
    });

    const articleShell = document.createElement('div');
    articleShell.className = 'reading-main';
    main.insertBefore(layout, headingBar);
    layout.appendChild(sidebar);
    layout.appendChild(articleShell);
    articleShell.appendChild(headingBar);
    articleShell.appendChild(article);
  }

  const sidebarLinks = [...document.querySelectorAll('.reading-sidebar a')];

  // Add visual transitions between major ideas.
  headings.forEach((h, i) => {
    if (i > 0 && !h.previousElementSibling?.classList.contains('thought-bridge')) {
      const bridge = document.createElement('a');
      bridge.className = 'thought-bridge';
      bridge.href = '#' + h.id;
      bridge.innerHTML = `<span class="bridge-line"></span><span class="bridge-copy">Continue into <strong>${h.textContent.replace(/^\d+\.\s*/, '').replace(/\s+/g, ' ').trim()}</strong></span><span class="bridge-arrow">↓</span>`;
      h.parentNode.insertBefore(bridge, h);
    }
  });

  // Remove old ASCII diagrams; the page's visual scenes communicate those ideas.
  article.querySelectorAll('pre').forEach(pre => {
    const text = pre.textContent.trim();
    if (!text || /[┌┐└┘│─↓→←↘↗]/.test(text) || /Generation \d+/.test(text) || /ARTIFICIAL EARTH/.test(text)) pre.remove();
  });

  const themes = {
    mind: { rgb: [244, 239, 228], ink: [25, 25, 24], accent: [154, 95, 55] },
    cosmos: { rgb: [17, 22, 34], ink: [239, 241, 246], accent: [88, 142, 214] },
    cell: { rgb: [226, 239, 226], ink: [25, 38, 27], accent: [62, 137, 89] },
    tech: { rgb: [228, 233, 242], ink: [18, 23, 31], accent: [102, 83, 190] },
    question: { rgb: [239, 232, 221], ink: [38, 31, 26], accent: [186, 101, 52] }
  };

  function themeForHeading(h) {
    const text = (h?.textContent || '').toLowerCase();
    if (text.includes('artificial') || text.includes('neuroevolution') || text.includes('technology') || text.includes('neural network') || text.includes('genome') || text.includes('architecture') || text.includes('software') || text.includes('project')) return 'tech';
    if (text.includes('dinosaur') || text.includes('fossil') || text.includes('bird')) return 'cosmos';
    if (text.includes('life') || text.includes('organism') || text.includes('evolution') || text.includes('environment') || text.includes('reproduction')) return 'cell';
    if (text.includes('why') || text.includes('question') || text.includes('conclusion')) return 'question';
    return 'mind';
  }

  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  const stops = headings.map(h => ({ h, key: themeForHeading(h) }));

  function applyTheme() {
    const y = window.scrollY + window.innerHeight * 0.38;
    let index = 0;
    for (let i = 0; i < stops.length; i++) if (stops[i].h.offsetTop <= y) index = i;
    const next = Math.min(index + 1, stops.length - 1);
    const a = themes[stops[index]?.key || 'mind'];
    const b = themes[stops[next]?.key || stops[index]?.key || 'mind'];
    const start = stops[index]?.h?.offsetTop || 0;
    const end = stops[next]?.h?.offsetTop || start + 1;
    const t = next === index ? 0 : Math.max(0, Math.min(1, (y - start) / Math.max(1, end - start)));
    // Keep the background transition smooth, but never interpolate text color.
    document.body.style.setProperty('--bg-rgb', mix(a.rgb, b.rgb, t).join(','));
    document.body.style.setProperty('--accent-rgb', mix(a.accent, b.accent, t).join(','));
    const textTheme = t < 0.5 ? a : b;
    document.body.style.setProperty('--ink-rgb', textTheme.ink.join(','));
    document.body.dataset.theme = textTheme === a ? (stops[index]?.key || 'mind') : (stops[next]?.key || stops[index]?.key || 'mind');
  }

  function updateReadingState() {
    const marker = window.scrollY + 170;
    let current = 0;
    headings.forEach((h, i) => {
      if (h.getBoundingClientRect().top + window.scrollY <= marker) current = i;
    });

    const cleanTitle = headings[current]?.textContent.replace(/^\d+\.\s*/, '').replace(/\s+/g, ' ').trim() || 'The Evolution of Intelligence';
    if (headingBar) headingBar.textContent = cleanTitle;

    sidebarLinks.forEach((link, i) => {
      const active = i === current;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const pct = maxScroll > 0 ? Math.min(100, Math.max(0, window.scrollY / maxScroll * 100)) : 0;
    document.documentElement.style.setProperty('--reading-progress', pct + '%');
  }

  const revealTargets = article.querySelectorAll('p, h2, h3, blockquote, table, figure, .concept-scene, .visual-gallery, hr');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); });
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
  revealTargets.forEach(el => { el.classList.add('reveal-on-scroll'); observer.observe(el); });

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateReadingState();
      applyTheme();
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  updateReadingState();
  applyTheme();
}
