/**
 * Анимации: scroll reveal, fade страницы, glow hero
 */

(function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initPageFade() {
    if (prefersReducedMotion) return;
    document.body.classList.add('page-enter');
    requestAnimationFrame(() => {
      document.body.classList.add('page-enter--done');
    });
  }

  function initScrollReveal() {
    const selectors = [
      '.section-header',
      '.direction-card',
      '.portfolio-card',
      '.home-neuroclub-teaser',
      '.about-preview',
      '.home-contacts-teaser',
      '.preview-more',
      '.feature-item',
      '.format-card',
      '.contact__form-wrap',
      '.page-intro',
      '.steps .step',
      '.example-item',
      '.automation-showcase',
      '.sites-mockup',
    ];

    const elements = document.querySelectorAll(
      selectors.map((s) => `${s}:not(.reveal):not(.reveal--visible)`).join(', ')
    );
    if (!elements.length) return;

    if (prefersReducedMotion) {
      elements.forEach((el) => el.classList.add('reveal--visible'));
      return;
    }

    elements.forEach((el) => {
      el.classList.add('reveal');
      const parent = el.parentElement;
      if (parent && (parent.classList.contains('directions-grid') || parent.classList.contains('portfolio-grid'))) {
        const siblings = Array.from(parent.children).filter((c) => c.matches(selectors.join(', ')));
        const index = siblings.indexOf(el);
        el.style.setProperty('--reveal-delay', `${Math.min(index * 0.08, 0.4)}s`);
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );

    elements.forEach((el) => observer.observe(el));
  }

  function initHeroGlow() {
    if (prefersReducedMotion) return;
    const frame = document.querySelector('.hero__photo-frame');
    if (frame) frame.classList.add('hero__photo-frame--glow');
  }

  document.addEventListener('DOMContentLoaded', () => {
    initPageFade();
    initScrollReveal();
    initHeroGlow();
  });

  window.siteAnimations = { refreshReveal: initScrollReveal };

  document.addEventListener('portfolio:rendered', () => {
    document.querySelectorAll('.portfolio-card:not(.cursor-target)').forEach((el) => {
      el.classList.add('cursor-target');
    });
  });
})();
