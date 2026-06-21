/**
 * Typewriter для главного заголовка (vanilla JS, адаптация TextType)
 */

(function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initHeroTypewriter() {
    const container = document.getElementById('hero-typewriter');
    const contentEl = document.getElementById('hero-typewriter-text');
    const cursorEl = container?.querySelector('.text-type__cursor');
    if (!container || !contentEl) return;

    let texts = [];
    try {
      texts = JSON.parse(container.dataset.texts || '[]');
    } catch {
      return;
    }
    if (!texts.length) return;

    if (prefersReducedMotion) {
      contentEl.textContent = texts[0];
      if (cursorEl) cursorEl.classList.add('text-type__cursor--hidden');
      return;
    }

    const typingSpeed = Number(container.dataset.typingSpeed) || 95;
    const deletingSpeed = Number(container.dataset.deletingSpeed) || 35;
    const pauseDuration = Number(container.dataset.pauseDuration) || 2200;
    const initialDelay = Number(container.dataset.initialDelay) || 500;
    const loop = container.dataset.loop !== 'false';
    const hideCursorWhileDeleting = container.dataset.hideCursorWhileDeleting === 'true';
    const variableSpeed = container.dataset.variableSpeed !== 'false';
    const cursorChar = container.dataset.cursor || '|';

    if (cursorEl) cursorEl.textContent = cursorChar;

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let displayed = '';
    let timeoutId = null;

    function getTypingDelay() {
      if (!variableSpeed) return typingSpeed;
      return typingSpeed + Math.random() * 28 - 10;
    }

    function setCursorVisible(visible) {
      if (!cursorEl) return;
      cursorEl.classList.toggle('text-type__cursor--hidden', !visible);
    }

    function tick() {
      const current = texts[textIndex];

      if (isDeleting) {
        if (hideCursorWhileDeleting) setCursorVisible(false);

        if (displayed.length === 0) {
          isDeleting = false;
          if (!loop && textIndex === texts.length - 1) {
            setCursorVisible(false);
            return;
          }

          textIndex = loop ? (textIndex + 1) % texts.length : textIndex + 1;
          if (textIndex >= texts.length) return;

          charIndex = 0;
          setCursorVisible(true);
          timeoutId = setTimeout(tick, 500);
          return;
        }

        displayed = displayed.slice(0, -1);
        contentEl.textContent = displayed;
        timeoutId = setTimeout(tick, deletingSpeed);
        return;
      }

      setCursorVisible(true);

      if (charIndex < current.length) {
        displayed += current[charIndex];
        charIndex += 1;
        contentEl.textContent = displayed;
        timeoutId = setTimeout(tick, getTypingDelay());
        return;
      }

      if (!loop && textIndex === texts.length - 1) return;

      timeoutId = setTimeout(() => {
        isDeleting = true;
        tick();
      }, pauseDuration);
    }

    timeoutId = setTimeout(tick, initialDelay);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && timeoutId) clearTimeout(timeoutId);
    });
  }

  document.addEventListener('DOMContentLoaded', initHeroTypewriter);
})();
