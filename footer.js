// Footer Component
(function() {
  const year = new Date().getFullYear();
  const footerHTML = `
  <footer class="site-footer" id="site-footer">
    <div class="footer-glow"></div>
    <div class="container">
      <div class="footer-top">
        <div class="footer-brand">
          <a href="/" class="logo" aria-label="Decision Wheel">
            <div class="logo-icon">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" stroke="url(#fLogoGrad)" stroke-width="2"/>
                <path d="M20 2 L20 20 L32 8" stroke="url(#fLogoGrad)" stroke-width="2.5" stroke-linecap="round"/>
                <path d="M20 20 L38 20" stroke="url(#fLogoGrad)" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
                <path d="M20 20 L8 32" stroke="url(#fLogoGrad)" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
                <circle cx="20" cy="20" r="3" fill="url(#fLogoGrad)"/>
                <defs>
                  <linearGradient id="fLogoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#F4A261"/>
                    <stop offset="100%" stop-color="#E76F51"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span class="logo-text">Decision<em>Wheel</em></span>
          </a>
          <p class="footer-tagline">Spin away indecision. Let fate — and fun — decide for you.</p>          
        </div>

        <div class="footer-links">
          <div class="footer-col">
            <h4>App</h4>
            <ul>
              <li><a href="#app">Spin the Wheel</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#use-cases">Use Cases</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Explore</h4>
            <ul>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#tips">Tips & Tricks</a></li>
              <li><a href="#templates">Templates</a></li>              
            </ul>
          </div>
          <div class="footer-col">
            <h4>Legal</h4>
            <ul>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Use</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; ${year} DecisionWheel. All rights reserved. Made with <span class="heart">♥</span> for the indecisive.</p>
        <p class="footer-credit">Free to use &bull; No sign-up required &bull; Privacy-first</p>
      </div>
    </div>
  </footer>
  `;

  document.getElementById('footer-root').innerHTML = footerHTML;
})();
