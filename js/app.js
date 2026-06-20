/* ============================================
   WORLD LITERATURE — ENG-203
   Main Application Logic
   ============================================ */

'use strict';

/* ── NAVIGATION ── */
const navLinks = document.querySelectorAll('.nav-link[data-page]');
const pages    = document.querySelectorAll('.page');
const topbarTitle = document.getElementById('topbar-title');
const sidebar  = document.getElementById('sidebar');
const overlay  = document.getElementById('overlay');
const hamburger = document.getElementById('hamburger');

function navigateTo(pageId) {
  pages.forEach(p => p.classList.remove('active'));
  navLinks.forEach(l => l.classList.remove('active'));
  const page = document.getElementById(pageId);
  if (page) {
    page.classList.add('active');
    window.scrollTo(0, 0);
  }
  const link = document.querySelector(`[data-page="${pageId}"]`);
  if (link) {
    const title = link.querySelector('.nav-text')?.textContent || 'World Literature';
    topbarTitle.textContent = title;
    link.classList.add('active');
  }
  closeSidebar();
  initPageFeatures(pageId);
}

function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
}

navLinks.forEach(link => {
  link.addEventListener('click', () => navigateTo(link.dataset.page));
});

hamburger?.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  overlay.classList.toggle('active');
});
overlay?.addEventListener('click', closeSidebar);

/* ── CHAPTER ACCORDIONS ── */
function initChapters() {
  document.querySelectorAll('.chapter-header').forEach(header => {
    header.addEventListener('click', () => {
      const card = header.closest('.chapter-card');
      card.classList.toggle('open');
    });
  });
}

/* ── Q&A ACCORDIONS ── */
function initQA() {
  document.querySelectorAll('.qa-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.qa-item');
      item.classList.toggle('open');
    });
  });
}

/* ── MCQ ENGINE ── */
let mcqState = {};  // { id: { selected, correct } }

function initMCQ() {
  mcqState = {};
  updateScore();
  document.querySelectorAll('.mcq-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const item = opt.closest('.mcq-item');
      const id   = item.dataset.id;
      if (mcqState[id]?.answered) return;

      const correct = item.dataset.correct;
      const chosen  = opt.dataset.opt;

      mcqState[id] = { answered: true, correct: chosen === correct };

      item.querySelectorAll('.mcq-option').forEach(o => {
        o.classList.remove('selected');
        if (o.dataset.opt === correct)  o.classList.add('correct-opt');
        if (o.dataset.opt === chosen && chosen !== correct) o.classList.add('wrong-opt');
      });
      item.classList.add('answered');
      item.classList.add(chosen === correct ? 'correct' : 'incorrect');
      updateScore();
    });
  });

  // Filter buttons
  document.querySelectorAll('.mcq-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mcq-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.mcq-item').forEach(item => {
        item.style.display = (filter === 'all' || item.dataset.chapter === filter) ? '' : 'none';
      });
    });
  });

  document.getElementById('reset-mcq')?.addEventListener('click', resetMCQ);
}

function updateScore() {
  const answered = Object.keys(mcqState).length;
  const correct  = Object.values(mcqState).filter(s => s.correct).length;
  const el = document.getElementById('mcq-score');
  if (el) el.textContent = `${correct} / ${answered}`;
  const pct = document.getElementById('mcq-pct');
  if (pct) pct.textContent = answered ? `${Math.round((correct/answered)*100)}%` : '—';
}

function resetMCQ() {
  mcqState = {};
  document.querySelectorAll('.mcq-item').forEach(item => {
    item.classList.remove('answered','correct','incorrect');
    item.querySelectorAll('.mcq-option').forEach(o => {
      o.classList.remove('selected','correct-opt','wrong-opt');
    });
  });
  updateScore();
}

/* ── SEARCH ── */
function initSearch(pageId) {
  const input = document.querySelector(`#${pageId} .search-input`);
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    const items = document.querySelectorAll(`#${pageId} .qa-item, #${pageId} .mcq-item`);
    items.forEach(item => {
      item.style.display = item.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
}

/* ── PROGRESS RINGS ── */
function animateRings() {
  document.querySelectorAll('.progress-ring .fill').forEach(fill => {
    const pct = parseFloat(fill.dataset.pct || 0);
    const offset = 157 - (157 * pct / 100);
    setTimeout(() => fill.style.strokeDashoffset = offset, 300);
  });
}

/* ── QUICK NAV CARDS ── */
function initHomeCards() {
  document.querySelectorAll('.qcard[data-goto]').forEach(card => {
    card.addEventListener('click', () => navigateTo(card.dataset.goto));
  });
}

/* ── PAGE FEATURE INIT ── */
function initPageFeatures(pageId) {
  if (pageId === 'home')       { initHomeCards(); animateRings(); }
  if (pageId.startsWith('chapter')) initChapters();
  if (pageId === 'short-q')   { initQA(); initSearch('short-q'); }
  if (pageId === 'long-q')    { initQA(); initSearch('long-q'); }
  if (pageId === 'mcqs')      { initMCQ(); initSearch('mcqs'); }
}

/* ── PRINT ── */
document.getElementById('btn-print')?.addEventListener('click', () => window.print());

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  navigateTo('home');
});
