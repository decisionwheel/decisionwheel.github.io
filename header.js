// Header Component
(function() {
  const headerHTML = `
  <header class="site-header" id="site-header">
    <div class="header-inner">
      <a href="/" class="logo" aria-label="Decision Wheel Home">
        <div class="logo-icon">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" stroke="url(#logoGrad)" stroke-width="2"/>
            <path d="M20 2 L20 20 L32 8" stroke="url(#logoGrad)" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M20 20 L38 20" stroke="url(#logoGrad)" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
            <path d="M20 20 L8 32" stroke="url(#logoGrad)" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
            <circle cx="20" cy="20" r="3" fill="url(#logoGrad)"/>
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#F4A261"/>
                <stop offset="100%" stop-color="#E76F51"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span class="logo-text">Decision<em>Wheel</em></span>
      </a>

      <nav class="main-nav" id="main-nav" aria-label="Main Navigation">
        <ul>
          <li><a href="#app">Spin the Wheel</a></li>
          <li><a href="#how-it-works">How It Works</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#use-cases">Use Cases</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
      </nav>

      <div class="header-actions">
        <a href="#app" class="cta-btn header-cta">Try Free</a>
        <button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
    <div class="header-line"></div>
  </header>
  `;

  document.getElementById('header-root').innerHTML = headerHTML;

  // Sticky header on scroll
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    toggle.classList.toggle('open');
    nav.classList.toggle('open');
    document.body.classList.toggle('nav-open');
  });

  // Close menu on nav link click
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.classList.remove('open');
      nav.classList.remove('open');
      document.body.classList.remove('nav-open');
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = nav.querySelectorAll('a[href^="#"]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => observer.observe(s));
})();
