/**
 * NeuralHeroArt — декоративная AI-нейросеть для hero (только SVG/CSS).
 */
(function () {
  const C = {
    purple: '#8B5CFF',
    cyan: '#22E6D2',
    cherry: '#9A1F4B',
    champagne: '#D8BFA6',
  };

  /** 32 узла — фиксированные позиции для стабильного результата */
  const NODES = [
    { x: 280, y: 60, r: 4.5, fill: C.cyan, op: 0.72 },
    { x: 340, y: 45, r: 3, fill: C.purple, op: 0.65 },
    { x: 400, y: 70, r: 5, fill: C.purple, op: 0.78 },
    { x: 460, y: 40, r: 3.5, fill: C.cyan, op: 0.7 },
    { x: 520, y: 85, r: 4, fill: C.cherry, op: 0.6 },
    { x: 560, y: 55, r: 2.5, fill: C.champagne, op: 0.55 },
    { x: 310, y: 130, r: 3, fill: C.purple, op: 0.68 },
    { x: 370, y: 115, r: 4.5, fill: C.cyan, op: 0.75 },
    { x: 430, y: 140, r: 3, fill: C.purple, op: 0.62 },
    { x: 490, y: 120, r: 5, fill: C.cyan, op: 0.8 },
    { x: 550, y: 150, r: 3.5, fill: C.purple, op: 0.7 },
    { x: 590, y: 110, r: 2.5, fill: C.champagne, op: 0.5 },
    { x: 250, y: 200, r: 3.5, fill: C.purple, op: 0.58 },
    { x: 320, y: 190, r: 4, fill: C.cyan, op: 0.72 },
    { x: 380, y: 220, r: 3, fill: C.cherry, op: 0.55 },
    { x: 440, y: 195, r: 5, fill: C.purple, op: 0.76 },
    { x: 500, y: 230, r: 3.5, fill: C.cyan, op: 0.68 },
    { x: 560, y: 210, r: 4, fill: C.purple, op: 0.74 },
    { x: 610, y: 250, r: 2.5, fill: C.champagne, op: 0.52 },
    { x: 290, y: 290, r: 4, fill: C.cyan, op: 0.7 },
    { x: 350, y: 310, r: 3, fill: C.purple, op: 0.64 },
    { x: 410, y: 280, r: 5, fill: C.purple, op: 0.78 },
    { x: 470, y: 320, r: 3.5, fill: C.cyan, op: 0.72 },
    { x: 530, y: 295, r: 4, fill: C.cherry, op: 0.58 },
    { x: 580, y: 340, r: 3, fill: C.purple, op: 0.66 },
    { x: 320, y: 380, r: 3.5, fill: C.purple, op: 0.6 },
    { x: 390, y: 400, r: 4.5, fill: C.cyan, op: 0.75 },
    { x: 450, y: 370, r: 3, fill: C.champagne, op: 0.55 },
    { x: 510, y: 410, r: 5, fill: C.purple, op: 0.7 },
    { x: 570, y: 390, r: 3.5, fill: C.cyan, op: 0.68 },
    { x: 620, y: 430, r: 2.5, fill: C.cherry, op: 0.5 },
    { x: 480, y: 460, r: 4, fill: C.cyan, op: 0.65 },
    { x: 540, y: 480, r: 3, fill: C.purple, op: 0.62 },
    { x: 360, y: 470, r: 3.5, fill: C.purple, op: 0.58 },
  ];

  const EDGES = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
    [0, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11],
    [6, 12], [12, 13], [13, 14], [14, 15], [15, 16], [16, 17], [17, 18],
    [12, 19], [19, 20], [20, 21], [21, 22], [22, 23], [23, 24],
    [19, 25], [25, 26], [26, 27], [27, 28], [28, 29], [29, 30],
    [25, 33], [33, 26], [28, 31], [31, 32], [32, 33],
    [2, 8], [7, 13], [15, 21], [9, 16], [21, 27], [3, 10], [13, 19], [22, 28],
  ];

  const ORBITS = [
    { cx: 420, cy: 250, rx: 175, ry: 115, rot: -18, stroke: C.purple, op: 0.32 },
    { cx: 440, cy: 260, rx: 130, ry: 85, rot: 12, stroke: C.cyan, op: 0.28 },
    { cx: 400, cy: 240, rx: 210, ry: 140, rot: -8, stroke: C.champagne, op: 0.22 },
    { cx: 460, cy: 280, rx: 95, ry: 60, rot: 25, stroke: C.purple, op: 0.26 },
    { cx: 380, cy: 200, rx: 155, ry: 100, rot: -30, stroke: C.cyan, op: 0.24 },
  ];

  const RIBBONS = [
    { d: 'M180 120 Q320 60 460 100 T620 80', stroke: C.purple, sw: 1.8, op: 0.35 },
    { d: 'M200 350 Q350 280 500 320 T640 290', stroke: C.cyan, sw: 1.5, op: 0.32 },
    { d: 'M220 500 Q380 440 520 480 T660 450', stroke: C.champagne, sw: 1.2, op: 0.28 },
    { d: 'M160 250 Q300 180 440 220 T580 190', stroke: C.purple, sw: 1, op: 0.25 },
  ];

  function strokeColor(fill) {
    if (fill === C.cyan) return C.cyan;
    if (fill === C.cherry) return C.cherry;
    if (fill === C.champagne) return C.champagne;
    return C.purple;
  }

  function buildSvg() {
    let svg = `<svg class="neural-hero-art__svg" viewBox="0 0 680 520" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <filter id="nha-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <linearGradient id="nha-fade" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#F6EFE4" stop-opacity="0"/>
          <stop offset="35%" stop-color="#F6EFE4" stop-opacity="0"/>
          <stop offset="100%" stop-color="#F6EFE4" stop-opacity="0"/>
        </linearGradient>
      </defs>`;

    ORBITS.forEach((o) => {
      svg += `<ellipse class="neural-hero-art__orbit" cx="${o.cx}" cy="${o.cy}" rx="${o.rx}" ry="${o.ry}"
        fill="none" stroke="${o.stroke}" stroke-width="1.2" opacity="${o.op}"
        transform="rotate(${o.rot} ${o.cx} ${o.cy})"/>`;
    });

    RIBBONS.forEach((r) => {
      svg += `<path class="neural-hero-art__ribbon" d="${r.d}" fill="none" stroke="${r.stroke}"
        stroke-width="${r.sw}" opacity="${r.op}" stroke-linecap="round"/>`;
    });

    EDGES.forEach(([a, b], i) => {
      const n1 = NODES[a];
      const n2 = NODES[b];
      const stroke = i % 3 === 0 ? C.cyan : i % 3 === 1 ? C.purple : C.champagne;
      const op = 0.28 + (i % 5) * 0.03;
      svg += `<line class="neural-hero-art__line" x1="${n1.x}" y1="${n1.y}" x2="${n2.x}" y2="${n2.y}"
        stroke="${stroke}" stroke-width="1.2" opacity="${Math.min(op, 0.42)}"/>`;
    });

    NODES.forEach((n, i) => {
      const halo = n.r + 3;
      svg += `<circle class="neural-hero-art__node-halo" cx="${n.x}" cy="${n.y}" r="${halo}"
        fill="${n.fill}" opacity="${n.op * 0.15}"/>`;
      svg += `<circle class="neural-hero-art__node" cx="${n.x}" cy="${n.y}" r="${n.r}"
        fill="${n.fill}" opacity="${n.op}" filter="url(#nha-glow)"/>`;
      if (i % 4 === 0) {
        svg += `<circle class="neural-hero-art__node-ring" cx="${n.x}" cy="${n.y}" r="${n.r + 5}"
          fill="none" stroke="${strokeColor(n.fill)}" stroke-width="0.8" opacity="${n.op * 0.4}"/>`;
      }
    });

    svg += '</svg>';
    return svg;
  }

  function buildInnerDecoSvg() {
    return `<svg class="hero__collage-deco__svg" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">
      <line x1="20" y1="40" x2="380" y2="60" stroke="${C.purple}" stroke-width="1" opacity="0.3"/>
      <line x1="60" y1="120" x2="340" y2="100" stroke="${C.cyan}" stroke-width="1" opacity="0.28"/>
      <line x1="30" y1="200" x2="370" y2="220" stroke="${C.champagne}" stroke-width="1" opacity="0.25"/>
      <line x1="100" y1="30" x2="180" y2="270" stroke="${C.purple}" stroke-width="0.8" opacity="0.22"/>
      <line x1="300" y1="20" x2="220" y2="280" stroke="${C.cyan}" stroke-width="0.8" opacity="0.2"/>
      <circle cx="60" cy="40" r="3" fill="${C.cyan}" opacity="0.55"/>
      <circle cx="380" cy="60" r="2.5" fill="${C.purple}" opacity="0.5"/>
      <circle cx="180" cy="100" r="4" fill="${C.purple}" opacity="0.6"/>
      <circle cx="340" cy="100" r="3" fill="${C.cyan}" opacity="0.55"/>
      <circle cx="100" cy="200" r="2.5" fill="${C.cherry}" opacity="0.45"/>
      <circle cx="300" cy="220" r="3.5" fill="${C.purple}" opacity="0.58"/>
      <circle cx="220" cy="270" r="2" fill="${C.cyan}" opacity="0.5"/>
      <path d="M60 40 Q180 80 340 100" fill="none" stroke="${C.purple}" stroke-width="1" opacity="0.25"/>
      <path d="M100 200 Q200 160 300 220" fill="none" stroke="${C.cyan}" stroke-width="1" opacity="0.22"/>
    </svg>`;
  }

  function render(container) {
    if (!container) return;
    container.innerHTML = `
      <div class="neural-hero-art__glow neural-hero-art__glow--purple"></div>
      <div class="neural-hero-art__glow neural-hero-art__glow--cyan"></div>
      <div class="neural-hero-art__glow neural-hero-art__glow--behind"></div>
      ${buildSvg()}
    `;
    container.setAttribute('aria-hidden', 'true');
  }

  function renderCollageDeco(frame) {
    if (!frame || frame.querySelector('.hero__collage-deco')) return;
    const deco = document.createElement('div');
    deco.className = 'hero__collage-deco';
    deco.setAttribute('aria-hidden', 'true');
    deco.innerHTML = buildInnerDecoSvg();
    frame.insertBefore(deco, frame.firstChild);
  }

  function init() {
    const mount = document.getElementById('neural-hero-art');
    if (mount) render(mount);

    const frame = document.querySelector('.hero__collage-frame');
    renderCollageDeco(frame);

    const hero = document.querySelector('.section--hero');
    if (hero) {
      const staleBg = hero.querySelector('.section-bg--hero');
      if (staleBg) staleBg.remove();
    }
  }

  window.NeuralHeroArt = { render, init };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
