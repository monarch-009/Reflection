// ============================
// SCRIPT.JS — A & E Reflection
// ============================

// ── Theme ──────────────────────────────────────────
const initTheme = () => {
  const saved = localStorage.getItem('ae-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeBtn(saved);
};

const toggleTheme = () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('ae-theme', next);
  updateThemeBtn(next);
};

const updateThemeBtn = (theme) => {
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.innerHTML   = theme === 'dark' ? '☀️' : '🌙';
    btn.title       = theme === 'dark' ? 'Light mode' : 'Dark mode';
    btn.setAttribute('aria-label', btn.title);
  });
};

// ── Mobile Menu ────────────────────────────────────
const initMobileMenu = () => {
  const hamburger = document.querySelector('.nav-hamburger');
  const menu      = document.querySelector('.mobile-menu');
  if (!hamburger || !menu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    menu.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !menu.contains(e.target)) {
      hamburger.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
};

// ── Progress Bar ───────────────────────────────────
const initProgressBar = () => {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  const update = () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width  = pct + '%';
  };
  window.addEventListener('scroll', update, { passive: true });
};

// ── Active Nav Links ───────────────────────────────
const initActiveNav = () => {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
};

// ── Scroll Animations ──────────────────────────────
const initScrollAnimations = () => {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
};

// ── Tab System ─────────────────────────────────────
const switchTab = (tabId) => {
  const section = document.querySelector(`#${tabId}`)?.closest('div');
  if (!section) return;

  const parent = document.querySelector(`#${tabId}`)?.parentElement;
  if (!parent) return;

  parent.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

  const target = document.getElementById(tabId);
  if (target) target.classList.add('active');

  // Highlight matching button
  document.querySelectorAll('.tab-btn').forEach(btn => {
    if (btn.getAttribute('onclick')?.includes(tabId)) {
      btn.classList.add('active');
    }
  });
};

// ── Charts ─────────────────────────────────────────
const initCharts = () => {
  const securityCtx = document.getElementById('securityChart');
  const conflictCtx = document.getElementById('conflictChart');
  
  if (!securityCtx || !conflictCtx || typeof Chart === 'undefined') return;

  Chart.defaults.color = '#888888';
  Chart.defaults.font.family = '"DM Mono", monospace';
  
  // High-detail Timeline Match
  const labels = [
    "Feb 1", "Feb 9", "Feb 14", "Feb 16", "Feb 18", 
    "Feb 27", "Mar 1", "Mar 3", "Mar 13", "Mar 21", "Mar 22", "Mar 27", "Apr 1"
  ];
  
  const eventDetails = [
    "Calm daily routine: Badminton & calls",
    "Esita starts her first job in Delhi",
    "Valentine's Weekend: The High Point",
    "Aditya secures her Google account",
    "Afterglow: 'Never felt too far'",
    "Aditya builds the personal website",
    "Coffee with colleague triggers conflict",
    "Engagement timeline planned",
    "Failed Delhi trip: 'Secondary'",
    "The Mummy YouTube Video conflict",
    "The All-Day Battle / Ultimatum",
    "40-Minute wait / The 1:39am message",
    "Karan Singh / The gentle reset"
  ];
  
  // Curated, hyper-specific Data points corresponding strictly to the narrative
  const securityData = [85, 75, 98, 95, 100, 92, 25, 80, 20, 30,  5,   2, 50];
  const conflictData = [ 5, 25, 15, 10,   5, 15, 90, 25, 85, 80, 100, 98, 20];

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(10, 10, 15, 0.9)',
        titleFont: { family: '"Cormorant Garamond", serif', size: 16 },
        bodyFont: { family: '"DM Mono", monospace', size: 12 },
        padding: 12,
        cornerRadius: 4,
        displayColors: false,
        callbacks: {
          title: function(context) { return context[0].label; },
          label: function(context) {
            const val = context.parsed.y;
            const eventDesc = eventDetails[context.dataIndex];
            return [`Intensity: ${val}%`, `→ ${eventDesc}`];
          }
        }
      }
    },
    scales: {
      y: { 
        beginAtZero: true, 
        max: 100, 
        grid: { color: 'rgba(136, 136, 136, 0.1)' },
        border: { display: false }
      },
      x: { 
        grid: { display: false },
        border: { display: false }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 8,
        borderWidth: 2,
        hoverBorderWidth: 4,
      }
    }
  };

  new Chart(securityCtx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Relationship Security',
        data: securityData,
        borderColor: '#7a8c7e',
        backgroundColor: 'rgba(122, 140, 126, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#7a8c7e'
      }]
    },
    options: {
      ...commonOptions,
      plugins: {
        ...commonOptions.plugins,
        title: { display: false }
      }
    }
  });

  new Chart(conflictCtx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Volatility & Conflict',
        data: conflictData,
        borderColor: '#a84a52',
        backgroundColor: 'rgba(168, 74, 82, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#a84a52'
      }]
    },
    options: {
      ...commonOptions,
      plugins: {
        ...commonOptions.plugins,
        title: { display: false }
      }
    }
  });
};

// ── Init ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initProgressBar();
  initActiveNav();
  initScrollAnimations();
  initCharts();

  // Theme toggle listeners
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });
});