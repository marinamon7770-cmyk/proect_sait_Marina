/**
 * Общая шапка и футер для всех страниц.
 * Подключать перед main.js: <script src="js/layout.js"></script>
 *
 * На <body> задайте data-page для подсветки меню:
 * home | portfolio | directions | texts | web | automation | visual | neuroclub | about | contacts
 */

(function () {
  const NAV = [
    { href: 'portfolio.html', label: 'Работы', page: 'portfolio' },
    { href: 'directions.html', label: 'Направления', page: 'directions' },
    { href: 'about.html', label: 'Обо мне', page: 'about' },
    { href: 'neuroclub.html', label: 'Нейроклуб', page: 'neuroclub' },
    { href: 'contacts.html', label: 'Контакты', page: 'contacts' },
  ];

  const currentPage = document.body.dataset.page || 'home';

  function renderHeader() {
    const el = document.getElementById('site-header');
    if (!el) return;

    const navItems = NAV.map(
      (item) =>
        `<li><a href="${item.href}" class="nav__link${currentPage === item.page ? ' nav__link--active' : ''}">${item.label}</a></li>`
    ).join('');

    el.innerHTML = `
      <header class="header">
        <div class="container header__inner">
          <a href="index.html" class="header__logo">Марина Моненок</a>
          <nav class="nav">
            <ul class="nav__list">${navItems}</ul>
            <button class="nav__toggle" aria-label="Открыть меню" type="button">
              <span></span><span></span><span></span>
            </button>
          </nav>
        </div>
      </header>`;
  }

  function renderFooter() {
    const el = document.getElementById('site-footer');
    if (!el) return;

    el.innerHTML = `
      <footer class="footer">
        <div class="container footer__inner-wrap">
          <div class="footer__grid">
            <div>
              <p class="footer__brand">Марина Моненок</p>
              <p class="footer__tagline">Сайты, тексты, автоматизация и визуальное оформление</p>
            </div>
            <nav class="footer__nav">
              <a href="portfolio.html">Работы</a>
              <a href="directions.html">Направления</a>
              <a href="about.html">Обо мне</a>
              <a href="neuroclub.html">Нейроклуб</a>
              <a href="contacts.html">Контакты</a>
            </nav>
          </div>
          <div class="footer__bottom">© Марина Моненок, 2026</div>
        </div>
      </footer>`;
  }

  function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    const onScroll = () => header.classList.toggle('header--scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initMobileNav() {
    const toggle = document.querySelector('.nav__toggle');
    const navList = document.querySelector('.nav__list');
    if (!toggle || !navList) return;

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('nav__toggle--open');
      navList.classList.toggle('nav__list--open');
      document.body.style.overflow = navList.classList.contains('nav__list--open') ? 'hidden' : '';
    });

    navList.querySelectorAll('.nav__link').forEach((link) => {
      link.addEventListener('click', () => {
        toggle.classList.remove('nav__toggle--open');
        navList.classList.remove('nav__list--open');
        document.body.style.overflow = '';
      });
    });
  }

  renderHeader();
  renderFooter();
  initHeaderScroll();
  initMobileNav();
  loadTargetCursor();
})();

function loadTargetCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  if (!document.querySelector('link[href="css/target-cursor.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/target-cursor.css';
    document.head.appendChild(link);
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  loadScript('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js')
    .then(() => loadScript('js/target-cursor.js'))
    .catch(() => {});
}
