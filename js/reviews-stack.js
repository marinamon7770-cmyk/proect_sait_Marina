/**
 * Стопка отзывов — листание кнопками, кликом, свайпом и клавишами
 */

(function () {
  function renderStars(rating) {
    const max = 5;
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    const empty = max - full - (half ? 1 : 0);
    let html = '<div class="review-stars" aria-label="Оценка ' + rating + ' из 5">';

    for (let i = 0; i < full; i += 1) {
      html += '<span class="review-stars__icon review-stars__icon--full" aria-hidden="true">★</span>';
    }
    if (half) {
      html += '<span class="review-stars__icon review-stars__icon--half" aria-hidden="true">★</span>';
    }
    for (let i = 0; i < empty; i += 1) {
      html += '<span class="review-stars__icon review-stars__icon--empty" aria-hidden="true">★</span>';
    }
    html += '</div>';
    return html;
  }

  function renderCards(container, items) {
    container.innerHTML = items
      .map(
        (item, index) => `
      <article class="review-card cursor-target" data-index="${index}" role="article">
        <div class="review-card__body">
          ${renderStars(item.rating)}
          <blockquote class="review-card__quote">«${item.text}»</blockquote>
        </div>
        <footer class="review-card__author">
          <div class="review-card__avatar" aria-hidden="true">${item.initials}</div>
          <div>
            <cite class="review-card__name">${item.name}</cite>
            <p class="review-card__role">${item.role}</p>
          </div>
        </footer>
      </article>
    `
      )
      .join('');
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function getStackPos(cardIndex, activeIndex, count) {
    return (cardIndex - activeIndex + count) % count;
  }

  function initReviewsStack() {
    const carousel = document.getElementById('reviews-carousel');
    const stackEl = document.getElementById('reviews-stack');
    const dotsEl = document.getElementById('reviews-dots');
    const prevBtn = document.getElementById('reviews-prev');
    const nextBtn = document.getElementById('reviews-next');

    if (!stackEl || typeof reviewItems === 'undefined') return;

    renderCards(stackEl, reviewItems);

    const cards = Array.from(stackEl.querySelectorAll('.review-card'));
    const count = cards.length;
    let activeIndex = 0;
    let isAnimating = false;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animDuration = reducedMotion ? 0 : 520;

    if (dotsEl) {
      dotsEl.innerHTML = reviewItems
        .map(
          (_, i) =>
            `<button type="button" class="reviews-dot${i === 0 ? ' reviews-dot--active' : ''}" data-index="${i}" role="tab" aria-label="Отзыв ${i + 1} из ${count}" aria-selected="${i === 0}"></button>`
        )
        .join('');
    }

    const dots = dotsEl ? Array.from(dotsEl.querySelectorAll('.reviews-dot')) : [];

    function updateDots(index) {
      dots.forEach((dot, i) => {
        dot.classList.toggle('reviews-dot--active', i === index);
        dot.setAttribute('aria-selected', String(i === index));
      });

      const active = reviewItems[index];
      stackEl.setAttribute('aria-label', `Отзыв ${index + 1} из ${count}: ${active.name}`);
    }

    function applyStack(index, instant) {
      cards.forEach((card, i) => {
        const pos = getStackPos(i, index, count);

        card.classList.remove('review-card--exit', 'review-card--exit-left');

        if (instant) {
          card.classList.add('review-card--no-transition');
        }

        card.dataset.stackPos = String(pos);

        if (pos === 0) {
          card.style.zIndex = String(count + 2);
          card.style.pointerEvents = 'auto';
        } else {
          card.style.zIndex = String(Math.max(1, count - pos));
          card.style.pointerEvents = 'none';
        }
      });

      if (instant) {
        requestAnimationFrame(() => {
          cards.forEach((card) => card.classList.remove('review-card--no-transition'));
        });
      }

      updateDots(index);
    }

    async function animate(direction) {
      if (isAnimating || count <= 1) return;
      isAnimating = true;

      const front = cards[activeIndex];
      const exitClass = direction === 1 ? 'review-card--exit' : 'review-card--exit-left';

      if (animDuration > 0) {
        front.classList.add(exitClass);
        await wait(animDuration);
        front.classList.remove(exitClass);
      }

      activeIndex = (activeIndex + direction + count) % count;
      applyStack(activeIndex, animDuration === 0);
      isAnimating = false;
    }

    async function goTo(targetIndex) {
      if (isAnimating || targetIndex === activeIndex) return;

      const forward = (targetIndex - activeIndex + count) % count;
      const backward = (activeIndex - targetIndex + count) % count;
      const direction = forward <= backward ? 1 : -1;
      const steps = direction === 1 ? forward : backward;

      for (let step = 0; step < steps; step += 1) {
        await animate(direction);
      }
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => animate(1));
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => animate(-1));
    }

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        goTo(Number(dot.dataset.index));
      });
    });

    cards.forEach((card) => {
      card.addEventListener('click', () => {
        if (Number(card.dataset.index) === activeIndex) {
          animate(1);
        }
      });
    });

    if (carousel) {
      carousel.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          event.preventDefault();
          animate(1);
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          event.preventDefault();
          animate(-1);
        }
      });
    }

    let touchStartX = 0;
    let touchStartY = 0;

    stackEl.addEventListener(
      'touchstart',
      (event) => {
        touchStartX = event.changedTouches[0].clientX;
        touchStartY = event.changedTouches[0].clientY;
      },
      { passive: true }
    );

    stackEl.addEventListener(
      'touchend',
      (event) => {
        const dx = event.changedTouches[0].clientX - touchStartX;
        const dy = event.changedTouches[0].clientY - touchStartY;

        if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;

        if (dx < 0) {
          animate(1);
        } else {
          animate(-1);
        }
      },
      { passive: true }
    );

    applyStack(activeIndex, true);
  }

  document.addEventListener('DOMContentLoaded', initReviewsStack);
})();
