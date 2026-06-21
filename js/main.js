/**
 * Логика страниц: портфолио, форма заявки
 */

document.addEventListener('DOMContentLoaded', () => {
  initPortfolioPage();
  initContactForm();
});

const STATUS_CLASS = {
  ready: 'status--ready',
  testing: 'status--testing',
  soon: 'status--soon',
  developing: 'status--developing',
};

/* ---- Портфолио: полный список или превью на главной ---- */

function initPortfolioPage() {
  const grid = document.getElementById('portfolio-grid');
  if (!grid || typeof portfolioItems === 'undefined') return;

  const limit = grid.dataset.limit ? parseInt(grid.dataset.limit, 10) : null;
  const items = limit ? portfolioItems.slice(0, limit) : portfolioItems;

  renderPortfolioCards(grid, items);

  if (window.siteAnimations) window.siteAnimations.refreshReveal();
  document.dispatchEvent(new CustomEvent('portfolio:rendered'));

  const filtersContainer = document.getElementById('portfolio-filters');
  if (filtersContainer) initPortfolioFilters(filtersContainer, grid);
}

function renderPortfolioCards(grid, items) {
  grid.innerHTML = items
    .map(
      (item) => `
    <article class="portfolio-card" data-category="${item.category}">
      <div class="img-placeholder img-placeholder--preview portfolio-card__preview">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"/></svg>
        <span>${item.previewLabel || 'Превью работы'}</span>
      </div>
      <div class="portfolio-card__body">
        <p class="portfolio-card__category">${item.categoryLabel}</p>
        <h3 class="portfolio-card__title">${item.title}</h3>
        <p class="portfolio-card__desc">${item.description}</p>
        <div class="portfolio-card__done"><strong>Что было сделано:</strong> ${item.done}</div>
      </div>
      <div class="portfolio-card__footer">
        <span class="status ${STATUS_CLASS[item.status] || 'status--soon'}">${item.statusLabel}</span>
        <a href="${item.buttonLink || 'contacts.html'}" class="btn btn--outline btn--small">${item.buttonText || 'Посмотреть'}</a>
      </div>
    </article>
  `
    )
    .join('');
}

function initPortfolioFilters(container, grid) {
  const buttons = container.querySelectorAll('.filter-btn');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      buttons.forEach((b) => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');

      grid.querySelectorAll('.portfolio-card').forEach((card) => {
        const category = card.dataset.category;
        const show = filter === 'all' || category === filter;

        if (show) {
          card.classList.remove('portfolio-card--hidden');
          requestAnimationFrame(() => card.classList.remove('portfolio-card--hiding'));
        } else if (!card.classList.contains('portfolio-card--hidden')) {
          card.classList.add('portfolio-card--hiding');
          card.addEventListener(
            'transitionend',
            (e) => {
              if (e.propertyName !== 'opacity') return;
              card.classList.add('portfolio-card--hidden');
              card.classList.remove('portfolio-card--hiding');
            },
            { once: true }
          );
        }
      });
    });
  });
}

/* ---- Форма заявки (визуальная) ---- */

function initContactForm() {
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.style.display = 'none';
    if (success) success.classList.add('form__success--visible');
  });
}
