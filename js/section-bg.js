/**
 * Декоративные фоновые слои для секций — нейро-графика, glow, волны, узлы.
 * Подключается из layout.js после загрузки DOM.
 */
(function () {
  const SECTION_TYPES = [
    'hero', 'directions', 'portfolio', 'texts', 'sites',
    'automation', 'visual', 'neuroclub', 'about', 'work', 'contacts',
  ];

  function detectType(section) {
    for (const type of SECTION_TYPES) {
      if (section.classList.contains('section--' + type)) return type;
    }
    return null;
  }

  function glow(className) {
    return `<div class="section-bg__glow ${className}"></div>`;
  }

  const SVG = {
    constellation: `<svg class="section-bg__svg section-bg__svg--constellation" viewBox="0 0 240 240" preserveAspectRatio="xMaxYMin meet" aria-hidden="true">
      <circle cx="180" cy="40" r="4" fill="#22E6D2"/><circle cx="220" cy="80" r="3" fill="#8B5CFF"/>
      <circle cx="160" cy="100" r="3.5" fill="#8B5CFF"/><circle cx="200" cy="140" r="2.5" fill="#22E6D2"/>
      <circle cx="120" cy="60" r="2" fill="#D8BFA6"/><circle cx="140" cy="160" r="3" fill="#9A1F4B"/>
      <line x1="180" y1="40" x2="220" y2="80" stroke="#8B5CFF" stroke-width="1" opacity="0.45"/>
      <line x1="220" y1="80" x2="160" y2="100" stroke="#22E6D2" stroke-width="1" opacity="0.4"/>
      <line x1="160" y1="100" x2="200" y2="140" stroke="#8B5CFF" stroke-width="1" opacity="0.35"/>
      <line x1="120" y1="60" x2="180" y2="40" stroke="#D8BFA6" stroke-width="1" opacity="0.35"/>
      <line x1="140" y1="160" x2="200" y2="140" stroke="#9A1F4B" stroke-width="1" opacity="0.3"/>
    </svg>`,

    dotsCluster: `<svg class="section-bg__svg section-bg__svg--dots-bl" viewBox="0 0 200 160" preserveAspectRatio="xMinYMax meet" aria-hidden="true">
      <circle cx="30" cy="130" r="3" fill="#8B5CFF" opacity="0.5"/><circle cx="55" cy="115" r="2" fill="#22E6D2" opacity="0.55"/>
      <circle cx="45" cy="145" r="2.5" fill="#D8BFA6" opacity="0.6"/><circle cx="70" cy="135" r="2" fill="#8B5CFF" opacity="0.4"/>
      <circle cx="90" cy="120" r="3" fill="#22E6D2" opacity="0.45"/><circle cx="65" cy="100" r="1.5" fill="#9A1F4B" opacity="0.4"/>
      <path d="M30 130 Q55 100 90 120" fill="none" stroke="#8B5CFF" stroke-width="1" opacity="0.25"/>
      <path d="M45 145 Q70 110 55 115" fill="none" stroke="#22E6D2" stroke-width="1" opacity="0.2"/>
    </svg>`,

    wave: `<svg class="section-bg__svg section-bg__svg--wave" viewBox="0 0 800 200" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 120 Q200 40 400 100 T800 80 L800 200 L0 200 Z" fill="url(#waveGradW)" opacity="0.55"/>
      <path d="M0 150 Q250 90 500 130 T800 110" fill="none" stroke="#8B5CFF" stroke-width="1.5" opacity="0.22"/>
      <path d="M0 100 Q300 160 600 90 T800 140" fill="none" stroke="#22E6D2" stroke-width="1" opacity="0.18"/>
      <defs><linearGradient id="waveGradW" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#8B5CFF" stop-opacity="0.12"/>
        <stop offset="50%" stop-color="#22E6D2" stop-opacity="0.08"/>
        <stop offset="100%" stop-color="#9A1F4B" stop-opacity="0.06"/>
      </linearGradient></defs>
    </svg>`,

    waveStrong: `<svg class="section-bg__svg section-bg__svg--wave-strong" viewBox="0 0 800 280" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 180 Q200 60 420 140 T800 100 L800 280 L0 280 Z" fill="url(#waveStrongGradS)" opacity="0.65"/>
      <path d="M0 200 Q180 120 380 170 T800 130" fill="none" stroke="#8B5CFF" stroke-width="2" opacity="0.28"/>
      <path d="M0 160 Q320 220 640 150 T800 190" fill="none" stroke="#22E6D2" stroke-width="1.2" opacity="0.22"/>
      <defs><linearGradient id="waveStrongGradS" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#8B5CFF" stop-opacity="0.18"/>
        <stop offset="100%" stop-color="#22E6D2" stop-opacity="0.1"/>
      </linearGradient></defs>
    </svg>`,

    portfolioLinks: `<svg class="section-bg__svg section-bg__svg--portfolio-links" viewBox="0 0 1140 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <line x1="180" y1="120" x2="420" y2="200" stroke="#8B5CFF" stroke-width="1" opacity="0.15" stroke-dasharray="4 6"/>
      <line x1="420" y1="200" x2="680" y2="140" stroke="#22E6D2" stroke-width="1" opacity="0.12" stroke-dasharray="4 6"/>
      <line x1="680" y1="140" x2="920" y2="220" stroke="#D8BFA6" stroke-width="1" opacity="0.14" stroke-dasharray="4 6"/>
      <circle cx="180" cy="120" r="3" fill="#8B5CFF" opacity="0.35"/><circle cx="420" cy="200" r="3" fill="#22E6D2" opacity="0.3"/>
      <circle cx="680" cy="140" r="3" fill="#8B5CFF" opacity="0.3"/><circle cx="920" cy="220" r="3" fill="#9A1F4B" opacity="0.25"/>
    </svg>`,

    textFlow: `<svg class="section-bg__svg section-bg__svg--text-flow" viewBox="0 0 600 120" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <circle cx="80" cy="60" r="5" fill="#22E6D2" opacity="0.5"/><circle cx="300" cy="60" r="5" fill="#8B5CFF" opacity="0.5"/>
      <circle cx="520" cy="60" r="5" fill="#9A1F4B" opacity="0.45"/>
      <path d="M85 60 H295" stroke="#22E6D2" stroke-width="1.5" opacity="0.3"/>
      <path d="M305 60 H515" stroke="#8B5CFF" stroke-width="1.5" opacity="0.3"/>
      <path d="M80 60 Q190 20 300 60" fill="none" stroke="#D8BFA6" stroke-width="1" opacity="0.2"/>
    </svg>`,

    uiWindows: `<svg class="section-bg__svg section-bg__svg--ui-windows" viewBox="0 0 400 320" preserveAspectRatio="xMaxYMid meet" aria-hidden="true">
      <rect x="220" y="40" width="140" height="90" rx="8" fill="#FFFBF4" stroke="#8B5CFF" stroke-width="1" opacity="0.35"/>
      <rect x="230" y="52" width="80" height="6" rx="3" fill="#8B5CFF" opacity="0.2"/>
      <rect x="180" y="160" width="120" height="80" rx="8" fill="#FFFBF4" stroke="#22E6D2" stroke-width="1" opacity="0.3"/>
      <rect x="260" y="200" width="100" height="70" rx="8" fill="#FFFBF4" stroke="#D8BFA6" stroke-width="1" opacity="0.28"/>
      <line x1="290" y1="130" x2="240" y2="160" stroke="#8B5CFF" stroke-width="1" opacity="0.2"/>
      <line x1="300" y1="130" x2="310" y2="200" stroke="#22E6D2" stroke-width="1" opacity="0.18"/>
    </svg>`,

    automationFlow: `<svg class="section-bg__svg section-bg__svg--automation-flow" viewBox="0 0 900 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <circle cx="120" cy="100" r="5" fill="#22E6D2" opacity="0.55"/><circle cx="320" cy="180" r="4" fill="#8B5CFF" opacity="0.5"/>
      <circle cx="520" cy="120" r="5" fill="#22E6D2" opacity="0.5"/><circle cx="720" cy="200" r="4" fill="#8B5CFF" opacity="0.45"/>
      <circle cx="200" cy="320" r="4" fill="#8B5CFF" opacity="0.4"/><circle cx="450" cy="380" r="5" fill="#22E6D2" opacity="0.5"/>
      <circle cx="680" cy="340" r="4" fill="#9A1F4B" opacity="0.35"/>
      <path d="M125 100 L315 180 L515 120 L715 200" fill="none" stroke="#22E6D2" stroke-width="1.2" opacity="0.22"/>
      <path d="M320 185 L200 315 L445 375 L675 340" fill="none" stroke="#8B5CFF" stroke-width="1" opacity="0.18" stroke-dasharray="6 4"/>
      <path d="M520 125 L450 375" fill="none" stroke="#D8BFA6" stroke-width="1" opacity="0.15"/>
      <path d="M120 100 Q250 250 450 380" fill="none" stroke="#22E6D2" stroke-width="1" opacity="0.12"/>
    </svg>`,

    ribbons: `<svg class="section-bg__svg section-bg__svg--ribbons" viewBox="0 0 500 300" preserveAspectRatio="xMaxYMax meet" aria-hidden="true">
      <path d="M400 280 Q460 200 380 120 Q300 60 420 20" fill="none" stroke="#8B5CFF" stroke-width="2" opacity="0.2"/>
      <path d="M450 260 Q500 180 430 100" fill="none" stroke="#22E6D2" stroke-width="1.5" opacity="0.18"/>
      <path d="M350 290 Q400 210 360 140" fill="none" stroke="#F2B84B" stroke-width="1" opacity="0.22"/>
      <circle cx="420" cy="20" r="3" fill="#8B5CFF" opacity="0.4"/><circle cx="380" cy="120" r="2.5" fill="#22E6D2" opacity="0.35"/>
    </svg>`,

    neuroclubGlow: `<svg class="section-bg__svg section-bg__svg--neuroclub" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <ellipse cx="400" cy="200" rx="320" ry="120" fill="url(#ncGradClub)" opacity="0.5"/>
      <circle cx="200" cy="150" r="3" fill="#22E6D2" opacity="0.5"/><circle cx="600" cy="180" r="3" fill="#8B5CFF" opacity="0.45"/>
      <circle cx="350" cy="280" r="2.5" fill="#F2B84B" opacity="0.4"/><circle cx="550" cy="100" r="2" fill="#22E6D2" opacity="0.4"/>
      <line x1="200" y1="150" x2="350" y2="280" stroke="#8B5CFF" stroke-width="1" opacity="0.2"/>
      <line x1="550" y1="100" x2="600" y2="180" stroke="#22E6D2" stroke-width="1" opacity="0.18"/>
      <defs><radialGradient id="ncGradClub"><stop offset="0%" stop-color="#8B5CFF" stop-opacity="0.25"/><stop offset="100%" stop-color="#9A1F4B" stop-opacity="0"/></radialGradient></defs>
    </svg>`,

    orbit: `<svg class="section-bg__svg section-bg__svg--orbit" viewBox="0 0 200 200" preserveAspectRatio="xMinYMin meet" aria-hidden="true">
      <ellipse cx="100" cy="100" rx="70" ry="45" fill="none" stroke="#8B5CFF" stroke-width="1" opacity="0.22" transform="rotate(-20 100 100)"/>
      <ellipse cx="100" cy="100" rx="50" ry="30" fill="none" stroke="#22E6D2" stroke-width="1" opacity="0.18" transform="rotate(15 100 100)"/>
      <circle cx="170" cy="70" r="3" fill="#22E6D2" opacity="0.45"/><circle cx="40" cy="130" r="2.5" fill="#8B5CFF" opacity="0.4"/>
    </svg>`,

    route: `<svg class="section-bg__svg section-bg__svg--route" viewBox="0 0 900 80" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <path d="M60 40 Q225 10 450 40 T840 40" fill="none" stroke="#22E6D2" stroke-width="2" opacity="0.35"/>
      <circle cx="60" cy="40" r="5" fill="#9A1F4B" opacity="0.5"/><circle cx="300" cy="40" r="4" fill="#8B5CFF" opacity="0.45"/>
      <circle cx="540" cy="40" r="4" fill="#8B5CFF" opacity="0.45"/><circle cx="780" cy="40" r="4" fill="#22E6D2" opacity="0.45"/>
    </svg>`,

    heroNetwork: `<svg class="section-bg__svg section-bg__svg--hero-network" viewBox="0 0 500 500" preserveAspectRatio="xMaxYMid meet" aria-hidden="true">
      <circle cx="380" cy="120" r="6" fill="#22E6D2" opacity="0.7"/><circle cx="450" cy="200" r="5" fill="#8B5CFF" opacity="0.65"/>
      <circle cx="320" cy="240" r="4" fill="#8B5CFF" opacity="0.6"/><circle cx="420" cy="340" r="5" fill="#22E6D2" opacity="0.55"/>
      <circle cx="280" cy="380" r="3" fill="#9A1F4B" opacity="0.5"/><circle cx="460" cy="420" r="4" fill="#D8BFA6" opacity="0.55"/>
      <line x1="380" y1="120" x2="450" y2="200" stroke="#8B5CFF" stroke-width="1.5" opacity="0.4"/>
      <line x1="450" y1="200" x2="320" y2="240" stroke="#22E6D2" stroke-width="1.2" opacity="0.35"/>
      <line x1="320" y1="240" x2="420" y2="340" stroke="#8B5CFF" stroke-width="1.2" opacity="0.32"/>
      <line x1="420" y1="340" x2="280" y2="380" stroke="#22E6D2" stroke-width="1" opacity="0.28"/>
      <line x1="420" y1="340" x2="460" y2="420" stroke="#D8BFA6" stroke-width="1" opacity="0.25"/>
      <path d="M200 80 Q320 160 380 120" fill="none" stroke="#8B5CFF" stroke-width="1" opacity="0.2"/>
      <path d="M150 300 Q280 350 320 240" fill="none" stroke="#22E6D2" stroke-width="1" opacity="0.18"/>
    </svg>`,

    footerNetwork: `<svg class="section-bg__svg section-bg__svg--footer-network" viewBox="0 0 1140 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <line x1="0" y1="60" x2="1140" y2="40" stroke="#8B5CFF" stroke-width="1" opacity="0.15"/>
      <line x1="100" y1="80" x2="500" y2="30" stroke="#22E6D2" stroke-width="1" opacity="0.12"/>
      <line x1="600" y1="90" x2="1000" y2="50" stroke="#D8BFA6" stroke-width="1" opacity="0.1"/>
      <circle cx="100" cy="80" r="2.5" fill="#22E6D2" opacity="0.4"/><circle cx="500" cy="30" r="2" fill="#8B5CFF" opacity="0.35"/>
      <circle cx="600" cy="90" r="2.5" fill="#8B5CFF" opacity="0.35"/><circle cx="1000" cy="50" r="2" fill="#F2B84B" opacity="0.3"/>
    </svg>`,
  };

  const LAYERS = {
    hero: () =>
      glow('section-bg__glow--hero-tr') +
      glow('section-bg__glow--hero-bl') +
      glow('section-bg__glow--hero-center') +
      SVG.heroNetwork +
      SVG.wave,

    directions: () =>
      glow('section-bg__glow--dir-center') +
      glow('section-bg__glow--dir-tr') +
      SVG.constellation +
      SVG.dotsCluster,

    portfolio: () =>
      glow('section-bg__glow--port-purple') +
      glow('section-bg__glow--port-cyan') +
      SVG.wave +
      SVG.portfolioLinks,

    texts: () =>
      glow('section-bg__glow--texts-tr') +
      glow('section-bg__glow--texts-bl') +
      SVG.textFlow +
      SVG.dotsCluster,

    sites: () =>
      glow('section-bg__glow--sites-wave') +
      glow('section-bg__glow--sites-tr') +
      SVG.waveStrong +
      SVG.uiWindows,

    automation: () =>
      glow('section-bg__glow--auto-purple') +
      glow('section-bg__glow--auto-cyan') +
      SVG.automationFlow +
      SVG.constellation,

    visual: () =>
      glow('section-bg__glow--visual-gold') +
      glow('section-bg__glow--visual-purple') +
      SVG.ribbons +
      SVG.dotsCluster,

    neuroclub: () =>
      glow('section-bg__glow--nc-main') +
      glow('section-bg__glow--nc-tr') +
      SVG.neuroclubGlow +
      SVG.constellation,

    about: () =>
      glow('section-bg__glow--about-photo') +
      glow('section-bg__glow--about-tr') +
      SVG.wave +
      SVG.orbit,

    work: () =>
      glow('section-bg__glow--work-bl') +
      glow('section-bg__glow--work-tr') +
      SVG.route +
      SVG.dotsCluster,

    contacts: () =>
      glow('section-bg__glow--contacts-form') +
      glow('section-bg__glow--contacts-bl') +
      glow('section-bg__glow--contacts-tr') +
      SVG.wave +
      SVG.dotsCluster,
  };

  function buildSectionBg(type) {
    const fn = LAYERS[type];
    if (!fn) return '';
    return `<div class="section-bg section-bg--${type}" aria-hidden="true">${fn()}</div>`;
  }

  function initSections() {
    document.querySelectorAll('.section[class*="section--"]').forEach((section) => {
      const type = detectType(section);
      if (!type || type === 'hero' || section.querySelector('.section-bg')) return;

      section.classList.add('neuro-deco', 'neuro-deco--' + type);
      section.insertAdjacentHTML('afterbegin', buildSectionBg(type));

      const container = section.querySelector(':scope > .container');
      if (container) container.classList.add('section__content');
    });
  }

  function initFooter() {
    const footer = document.querySelector('.footer');
    if (!footer || footer.querySelector('.section-bg')) return;

    footer.insertAdjacentHTML('afterbegin',
      `<div class="section-bg section-bg--footer" aria-hidden="true">
        ${glow('section-bg__glow--footer-tr')}
        ${glow('section-bg__glow--footer-bl')}
        ${SVG.footerNetwork}
      </div>`
    );
  }

  window.initSectionBackgrounds = function () {
    initSections();
    initFooter();
  };
})();
