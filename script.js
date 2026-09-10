const data = window.LIVING_BOOK || { versions: [] };

const overlay = document.getElementById('contentsOverlay');
const openBtn = document.getElementById('openContents');
const contentsBtn = document.getElementById('contentsBtn');
const closeBtn = document.getElementById('closeContents');
const versionList = document.getElementById('versionList');
const pageList = document.getElementById('pageList');
const previewTitle = document.getElementById('previewTitle');
const previewText = document.getElementById('previewText');
const previewTopics = document.getElementById('previewTopics');
const previewOpen = document.getElementById('previewOpen');

let selectedVersion = data.versions[0] || null;
let selectedPage = selectedVersion?.pages?.[0] || null;

function openContents() {
  if (!overlay) return;
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}
function closeContents() {
  if (!overlay) return;
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

openBtn?.addEventListener('click', openContents);
contentsBtn?.addEventListener('click', openContents);
closeBtn?.addEventListener('click', closeContents);
overlay?.addEventListener('click', e => { if (e.target === overlay) closeContents(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeContents(); });

function renderVersions() {
  if (!versionList) return;
  versionList.innerHTML = '';
  data.versions.forEach(version => {
    const button = document.createElement('button');
    button.className = 'version' + (version.id === selectedVersion?.id ? ' active' : '');
    button.innerHTML = `<span>${version.label}</span><span>${String(version.pages.length).padStart(2, '0')}</span>`;
    button.addEventListener('click', () => {
      selectedVersion = version;
      selectedPage = version.pages[0] || null;
      renderVersions();
      renderPages();
      renderPreview();
    });
    versionList.appendChild(button);
  });
}

function renderPages() {
  if (!pageList) return;
  pageList.innerHTML = '';
  if (!selectedVersion?.pages?.length) {
    pageList.innerHTML = '<p class="empty-state">No webpages in this version yet.</p>';
    return;
  }
  selectedVersion.pages.forEach((page, index) => {
    const wrap = document.createElement('div');
    wrap.className = 'page-entry-wrap';

    const button = document.createElement('button');
    button.className = 'entry' + (page.id === selectedPage?.id ? ' selected' : '');
    button.innerHTML = `<span>${String(index + 1).padStart(2, '0')}</span><strong>${page.title}</strong><small>${page.topics.length} topics</small>`;
    button.addEventListener('click', () => {
      selectedPage = page;
      renderPages();
      renderPreview();
    });
    wrap.appendChild(button);

    pageList.appendChild(wrap);
  });
}

function renderPreview() {
  if (!selectedPage) {
    if (previewTitle) previewTitle.textContent = '—';
    if (previewText) previewText.textContent = 'Select a webpage to see its topics.';
    if (previewTopics) previewTopics.innerHTML = '';
    if (previewOpen) previewOpen.disabled = true;
    return;
  }
  previewTitle.textContent = selectedPage.title;
  previewText.textContent = selectedPage.description || 'A long-form webpage in The Living Book.';
  previewTopics.innerHTML = selectedPage.topics.map((topic, i) => `<button data-topic="${topic.id}"><span>${String(i + 1).padStart(2, '0')}</span>${topic.title}</button>`).join('');
  previewTopics.querySelectorAll('button').forEach((button, i) => {
    button.addEventListener('click', () => openTopic(selectedPage, selectedPage.topics[i]));
  });
  previewOpen.disabled = false;
}

function openTopic(page, topic) {
  closeContents();
  window.location.href = `${page.path}#${topic.id}`;
}

previewOpen?.addEventListener('click', () => {
  if (selectedPage) window.location.href = selectedPage.path;
});

renderVersions();
renderPages();
renderPreview();

if (new URLSearchParams(location.search).get('contents') === '1') openContents();

// Reading pages: persistent left Topics sidebar + sticky current topic + progress.
const statusBar = document.getElementById('readingStatus');
const chapters = [...document.querySelectorAll('.chapter')];
const sidebarLinks = [...document.querySelectorAll('.reading-sidebar a')];

if (statusBar && chapters.length) {
  const currentTopic = document.getElementById('currentTopic');
  const topicCount = document.getElementById('topicCount');
  const progress = document.getElementById('readingProgress');

  function updateReadingStatus() {
    const marker = window.scrollY + 190;
    let currentIndex = 0;
    chapters.forEach((chapter, index) => {
      if (chapter.getBoundingClientRect().top + window.scrollY <= marker) currentIndex = index;
    });

    const heading = chapters[currentIndex]?.querySelector('h1, h2');
    if (heading && currentTopic) currentTopic.textContent = heading.textContent.trim();
    if (topicCount) topicCount.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(chapters.length).padStart(2, '0')}`;

    sidebarLinks.forEach((link, index) => {
      const active = index === currentIndex;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const pct = maxScroll > 0 ? Math.min(100, Math.max(0, (window.scrollY / maxScroll) * 100)) : 0;
    if (progress) progress.style.width = `${pct}%`;
  }

  updateReadingStatus();
  window.addEventListener('scroll', updateReadingStatus, { passive: true });
  window.addEventListener('resize', updateReadingStatus);
}
