/**
 * HeroNeuralBackground — аккуратный фоновый SVG-слой для hero.
 * Монтируется на весь блок section--hero, под контентом.
 */
(function () {
  const PURPLE = '#8B5CFF';
  const CYAN = '#22E6D2';
  const CHAMPAGNE = '#D8BFA6';

  /** 24 узла — структурированная сетка справа, без хаоса */
  const NODES = [
    { x: 980, y: 130, r: 2.5, fill: CYAN, op: 0.72 },
    { x: 1080, y: 115, r: 2, fill: PURPLE, op: 0.65 },
    { x: 1180, y: 140, r: 3, fill: PURPLE, op: 0.78 },
    { x: 1280, y: 125, r: 2, fill: CHAMPAGNE, op: 0.58 },
    { x: 1360, y: 155, r: 2.5, fill: CYAN, op: 0.7 },

    { x: 960, y: 260, r: 2, fill: PURPLE, op: 0.62 },
    { x: 1060, y: 245, r: 2.5, fill: CYAN, op: 0.68 },
    { x: 1160, y: 270, r: 2, fill: PURPLE, op: 0.66 },
    { x: 1260, y: 255, r: 3, fill: CYAN, op: 0.75 },
    { x: 1350, y: 280, r: 2, fill: CHAMPAGNE, op: 0.55 },

    { x: 990, y: 390, r: 2.5, fill: PURPLE, op: 0.7 },
    { x: 1090, y: 375, r: 2, fill: CYAN, op: 0.64 },
    { x: 1190, y: 400, r: 2.5, fill: PURPLE, op: 0.72 },
    { x: 1290, y: 385, r: 2, fill: CYAN, op: 0.66 },
    { x: 1370, y: 410, r: 2.5, fill: PURPLE, op: 0.68 },

    { x: 970, y: 520, r: 2, fill: CYAN, op: 0.6 },
    { x: 1070, y: 505, r: 2.5, fill: PURPLE, op: 0.68 },
    { x: 1170, y: 530, r: 2, fill: CHAMPAGNE, op: 0.56 },
    { x: 1270, y: 515, r: 3, fill: CYAN, op: 0.74 },
    { x: 1360, y: 540, r: 2, fill: PURPLE, op: 0.62 },

    { x: 1040, y: 650, r: 2, fill: PURPLE, op: 0.58 },
    { x: 1140, y: 635, r: 2.5, fill: CYAN, op: 0.66 },
    { x: 1240, y: 660, r: 2, fill: PURPLE, op: 0.64 },
    { x: 1340, y: 645, r: 2.5, fill: CYAN, op: 0.7 },
  ];

  /** 14 коротких связей — только соседние узлы */
  const EDGES = [
    [0, 1], [1, 2], [2, 3], [3, 4],
    [5, 6], [6, 7], [7, 8], [8, 9],
    [10, 11], [11, 12], [12, 13], [13, 14],
    [1, 6], [7, 12], [6, 11], [2, 7],
  ].slice(0, 14);

  /** 5 мягких волн справа */
  const WAVES = [
    { d: 'M680 160 C860 80, 1040 100, 1440 180', stroke: PURPLE, op: 0.28, sw: 1.5 },
    { d: 'M720 300 C900 220, 1100 260, 1440 320', stroke: CYAN, op: 0.25, sw: 1.2 },
    { d: 'M700 440 C920 360, 1120 400, 1440 460', stroke: PURPLE, op: 0.22, sw: 1.2 },
    { d: 'M740 580 C940 500, 1160 540, 1440 600', stroke: CHAMPAGNE, op: 0.24, sw: 1 },
    { d: 'M760 700 C960 640, 1180 660, 1440 720', stroke: CYAN, op: 0.22, sw: 1 },
  ];

  /** 8 искр / звёздочек */
  const SPARKS = [
    { x: 1120, y: 90, s: 4, fill: CYAN, op: 0.55 },
    { x: 1310, y: 210, s: 3.5, fill: PURPLE, op: 0.5 },
    { x: 1010, y: 340, s: 3, fill: CHAMPAGNE, op: 0.48 },
    { x: 1380, y: 350, s: 3.5, fill: CYAN, op: 0.52 },
    { x: 950, y: 470, s: 3, fill: PURPLE, op: 0.45 },
    { x: 1200, y: 590, s: 4, fill: CYAN, op: 0.5 },
    { x: 1330, y: 480, s: 3, fill: PURPLE, op: 0.48 },
    { x: 1080, y: 690, s: 3.5, fill: CHAMPAGNE, op: 0.46 },
  ];

  function sparkPath(x, y, s) {
    const h = s / 2;
    return `M${x} ${y - h} L${x} ${y + h} M${x - h} ${y} L${x + h} ${y}`;
  }

  function buildSvg() {
    let svg = `<svg class="hero-neural-background__svg" viewBox="0 0 1440 800" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">`;

    WAVES.forEach((w) => {
      svg += `<path class="hero-neural-background__wave" d="${w.d}" fill="none" stroke="${w.stroke}" stroke-width="${w.sw}" opacity="${w.op}" stroke-linecap="round"/>`;
    });

    EDGES.forEach((pair, i) => {
      const [a, b] = pair;
      const n1 = NODES[a];
      const n2 = NODES[b];
      const stroke = i % 2 === 0 ? CHAMPAGNE : PURPLE;
      svg += `<line class="hero-neural-background__line" x1="${n1.x}" y1="${n1.y}" x2="${n2.x}" y2="${n2.y}" stroke="${stroke}" stroke-width="1" opacity="0.28"/>`;
    });

    NODES.forEach((n) => {
      svg += `<circle class="hero-neural-background__node" cx="${n.x}" cy="${n.y}" r="${n.r}" fill="${n.fill}" opacity="${n.op}"/>`;
    });

    SPARKS.forEach((s) => {
      svg += `<path class="hero-neural-background__spark" d="${sparkPath(s.x, s.y, s.s)}" stroke="${s.fill}" stroke-width="1" opacity="${s.op}" stroke-linecap="round"/>`;
    });

    svg += '</svg>';
    return svg;
  }

  function render(mount) {
    if (!mount) return;
    mount.className = 'hero-neural-background';
    mount.setAttribute('aria-hidden', 'true');
    mount.innerHTML = `
      <div class="hero-neural-background__glow hero-neural-background__glow--purple"></div>
      <div class="hero-neural-background__glow hero-neural-background__glow--cyan"></div>
      ${buildSvg()}
    `;
  }

  function init() {
    const hero = document.querySelector('.section--hero');
    if (!hero) return;

    let mount = document.getElementById('hero-neural-background');
    if (!mount) {
      mount = document.createElement('div');
      mount.id = 'hero-neural-background';
      hero.insertBefore(mount, hero.firstChild);
    }

    render(mount);

    document.querySelectorAll('.hero__collage-deco').forEach((el) => el.remove());
    hero.querySelector('.section-bg--hero')?.remove();
    document.getElementById('neural-hero-art')?.remove();
  }

  window.HeroNeuralBackground = { render, init };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
