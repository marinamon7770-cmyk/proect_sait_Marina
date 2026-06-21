/**
 * Target Cursor — vanilla JS (адаптация React Bits + GSAP)
 */
(function () {
  function getContainingBlock(element) {
    let node = element?.parentElement;
    while (node && node !== document.documentElement) {
      const style = getComputedStyle(node);
      if (
        style.transform !== 'none' ||
        style.perspective !== 'none' ||
        style.filter !== 'none' ||
        style.willChange.includes('transform') ||
        style.willChange.includes('perspective') ||
        style.willChange.includes('filter') ||
        /paint|layout|strict|content/.test(style.contain)
      ) {
        return node;
      }
      node = node.parentElement;
    }
    return null;
  }

  function getContainingBlockOffset(block) {
    if (!block) return { x: 0, y: 0 };
    const rect = block.getBoundingClientRect();
    return { x: rect.left + block.clientLeft, y: rect.top + block.clientTop };
  }

  function isMobileDevice() {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const small = window.innerWidth <= 768;
    const ua = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      (navigator.userAgent || '').toLowerCase()
    );
    return (hasTouch && small) || ua;
  }

  function markCursorTargets(selector) {
    document.querySelectorAll('a, button, .direction-card, .portfolio-card, .filter-btn, .hero__photo-frame, input, textarea, select, label').forEach((el) => {
      el.classList.add('cursor-target');
    });
  }

  function initTargetCursor(options) {
    if (typeof gsap === 'undefined') return null;
    if (window.__targetCursorInitialized) return null;
    if (isMobileDevice()) return null;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

    window.__targetCursorInitialized = true;

    const config = {
      targetSelector: '.cursor-target',
      spinDuration: 2,
      hideDefaultCursor: true,
      hoverDuration: 0.2,
      parallaxOn: true,
      cursorColor: '#EDE8F5',
      cursorColorOnTarget: '#F97316',
      ...options,
    };

    markCursorTargets(config.targetSelector);

    const wrapper = document.createElement('div');
    wrapper.className = 'target-cursor-wrapper';
    wrapper.innerHTML = `
      <div class="target-cursor-dot"></div>
      <div class="target-cursor-corner corner-tl"></div>
      <div class="target-cursor-corner corner-tr"></div>
      <div class="target-cursor-corner corner-br"></div>
      <div class="target-cursor-corner corner-bl"></div>
    `;
    document.body.appendChild(wrapper);
    document.body.classList.add('has-target-cursor');

    const dot = wrapper.querySelector('.target-cursor-dot');
    const corners = wrapper.querySelectorAll('.target-cursor-corner');
    const borderWidth = 3;
    const cornerSize = 12;

    dot.style.backgroundColor = config.cursorColor;
    corners.forEach((c) => {
      c.style.borderColor = config.cursorColor;
    });

    const originalCursor = document.body.style.cursor;
    if (config.hideDefaultCursor) {
      document.body.style.cursor = 'none';
    }

    let containingBlock = getContainingBlock(wrapper);
    let activeTarget = null;
    let currentLeaveHandler = null;
    let resumeTimeout = null;
    let spinTl = null;
    let isActive = false;
    let targetCornerPositions = null;
    let activeStrength = { current: 0 };

    const getOffset = () => getContainingBlockOffset(containingBlock);

    const initialOffset = getOffset();
    gsap.set(wrapper, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2 - initialOffset.x,
      y: window.innerHeight / 2 - initialOffset.y,
    });

    function createSpinTimeline() {
      spinTl?.kill();
      spinTl = gsap.timeline({ repeat: -1 }).to(wrapper, {
        rotation: '+=360',
        duration: config.spinDuration,
        ease: 'none',
      });
    }

    createSpinTimeline();

    function moveCursor(x, y) {
      const { x: offsetX, y: offsetY } = getOffset();
      gsap.to(wrapper, { x: x - offsetX, y: y - offsetY, duration: 0.14, ease: 'power3.out' });
    }

    function tickerFn() {
      if (!targetCornerPositions || !corners.length) return;
      const strength = activeStrength.current;
      if (strength === 0) return;

      const cursorX = gsap.getProperty(wrapper, 'x');
      const cursorY = gsap.getProperty(wrapper, 'y');

      corners.forEach((corner, i) => {
        const currentX = gsap.getProperty(corner, 'x');
        const currentY = gsap.getProperty(corner, 'y');
        const targetX = targetCornerPositions[i].x - cursorX;
        const targetY = targetCornerPositions[i].y - cursorY;
        const finalX = currentX + (targetX - currentX) * strength;
        const finalY = currentY + (targetY - currentY) * strength;
        const duration = strength >= 0.99 ? (config.parallaxOn ? 0.2 : 0) : 0.05;

        gsap.to(corner, {
          x: finalX,
          y: finalY,
          duration,
          ease: duration === 0 ? 'none' : 'power1.out',
          overwrite: 'auto',
        });
      });
    }

    function cleanupTarget(target) {
      if (currentLeaveHandler) target.removeEventListener('mouseleave', currentLeaveHandler);
      currentLeaveHandler = null;
    }

    function resetCorners() {
      gsap.killTweensOf(corners, 'x,y');
      const positions = [
        { x: -cornerSize * 1.5, y: -cornerSize * 1.5 },
        { x: cornerSize * 0.5, y: -cornerSize * 1.5 },
        { x: cornerSize * 0.5, y: cornerSize * 1.5 },
        { x: -cornerSize * 1.5, y: cornerSize * 1.5 },
      ];
      const tl = gsap.timeline();
      corners.forEach((corner, index) => {
        tl.to(corner, { x: positions[index].x, y: positions[index].y, duration: 0.3, ease: 'power3.out' }, 0);
      });
    }

    function resumeSpin() {
      if (activeTarget || !spinTl) return;
      const currentRotation = gsap.getProperty(wrapper, 'rotation');
      const normalizedRotation = currentRotation % 360;
      spinTl.kill();
      spinTl = gsap.timeline({ repeat: -1 }).to(wrapper, {
        rotation: '+=360',
        duration: config.spinDuration,
        ease: 'none',
      });
      gsap.to(wrapper, {
        rotation: normalizedRotation + 360,
        duration: config.spinDuration * (1 - normalizedRotation / 360),
        ease: 'none',
        onComplete: () => spinTl?.restart(),
      });
    }

    const moveHandler = (e) => moveCursor(e.clientX, e.clientY);
    window.addEventListener('mousemove', moveHandler);

    const mouseDownHandler = () => {
      gsap.to(dot, { scale: 0.7, duration: 0.3 });
      gsap.to(wrapper, { scale: 0.9, duration: 0.2 });
    };
    const mouseUpHandler = () => {
      gsap.to(dot, { scale: 1, duration: 0.3 });
      gsap.to(wrapper, { scale: 1, duration: 0.2 });
    };
    window.addEventListener('mousedown', mouseDownHandler);
    window.addEventListener('mouseup', mouseUpHandler);

    const scrollHandler = () => {
      if (!activeTarget) return;
      const { x: offsetX, y: offsetY } = getOffset();
      const mouseX = gsap.getProperty(wrapper, 'x') + offsetX;
      const mouseY = gsap.getProperty(wrapper, 'y') + offsetY;
      const el = document.elementFromPoint(mouseX, mouseY);
      const stillOver =
        el && (el === activeTarget || el.closest(config.targetSelector) === activeTarget);
      if (!stillOver && currentLeaveHandler) currentLeaveHandler();
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });

    const enterHandler = (e) => {
      let current = e.target;
      let target = null;
      while (current && current !== document.body) {
        if (current.matches(config.targetSelector)) {
          target = current;
          break;
        }
        current = current.parentElement;
      }
      if (!target || activeTarget === target) return;

      if (activeTarget) cleanupTarget(activeTarget);
      if (resumeTimeout) clearTimeout(resumeTimeout);

      activeTarget = target;
      gsap.killTweensOf(corners, 'x,y');
      gsap.killTweensOf(wrapper, 'rotation');
      spinTl?.pause();
      gsap.set(wrapper, { rotation: 0 });

      gsap.to(corners, { borderColor: config.cursorColorOnTarget, duration: 0.15, ease: 'power2.out' });
      gsap.to(dot, { backgroundColor: config.cursorColorOnTarget, duration: 0.15, ease: 'power2.out' });

      const rect = target.getBoundingClientRect();
      const { x: offsetX, y: offsetY } = getOffset();
      const cursorX = gsap.getProperty(wrapper, 'x');
      const cursorY = gsap.getProperty(wrapper, 'y');

      targetCornerPositions = [
        { x: rect.left - borderWidth - offsetX, y: rect.top - borderWidth - offsetY },
        { x: rect.right + borderWidth - cornerSize - offsetX, y: rect.top - borderWidth - offsetY },
        { x: rect.right + borderWidth - cornerSize - offsetX, y: rect.bottom + borderWidth - cornerSize - offsetY },
        { x: rect.left - borderWidth - offsetX, y: rect.bottom + borderWidth - cornerSize - offsetY },
      ];

      isActive = true;
      gsap.ticker.add(tickerFn);
      gsap.to(activeStrength, { current: 1, duration: config.hoverDuration, ease: 'power2.out' });

      corners.forEach((corner, i) => {
        gsap.to(corner, {
          x: targetCornerPositions[i].x - cursorX,
          y: targetCornerPositions[i].y - cursorY,
          duration: 0.2,
          ease: 'power2.out',
        });
      });

      const leaveHandler = () => {
        gsap.ticker.remove(tickerFn);
        isActive = false;
        targetCornerPositions = null;
        gsap.set(activeStrength, { current: 0, overwrite: true });

        gsap.to(corners, { borderColor: config.cursorColor, duration: 0.15, ease: 'power2.out' });
        gsap.to(dot, { backgroundColor: config.cursorColor, duration: 0.15, ease: 'power2.out' });

        resetCorners();
        activeTarget = null;
        resumeTimeout = setTimeout(resumeSpin, 50);
        cleanupTarget(target);
      };

      currentLeaveHandler = leaveHandler;
      target.addEventListener('mouseleave', leaveHandler);
    };

    window.addEventListener('mouseover', enterHandler, { passive: true });

    const resizeHandler = () => {
      containingBlock = getContainingBlock(wrapper);
    };
    window.addEventListener('resize', resizeHandler);

    return () => {
      gsap.ticker.remove(tickerFn);
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseover', enterHandler);
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('resize', resizeHandler);
      window.removeEventListener('mousedown', mouseDownHandler);
      window.removeEventListener('mouseup', mouseUpHandler);
      if (activeTarget) cleanupTarget(activeTarget);
      spinTl?.kill();
      wrapper.remove();
      document.body.classList.remove('has-target-cursor');
      document.body.style.cursor = originalCursor;
    };
  }

  window.initTargetCursor = initTargetCursor;

  initTargetCursor();
})();
