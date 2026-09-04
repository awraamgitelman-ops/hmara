// LIKEMARK — Carousel Module
// Responsibility: swiper-cards track control (mouse drag, touch swipe, pagination, buttons)

(function () {
  'use strict';

  function initCarousel() {
    const track = document.querySelector('.swiper-cards__track');
    const wrapper = track ? track.querySelector('.swiper-wrapper') : null;
    const slides = wrapper ? wrapper.querySelectorAll('.swiper-slide') : [];
    const prevBtn = document.querySelector('.slider-controls__button:not(.slider-controls__button--next)');
    const nextBtn = document.querySelector('.slider-controls__button--next');
    const segments = document.querySelectorAll('.slider-controls__pagination-segment');

    if (!track || !wrapper) return;

    let currentIndex = 0;
    let currentTranslateX = 0;

    function getStepWidth() {
      if (!slides.length) return 396;
      const slide = slides[0];
      const mr = parseFloat(window.getComputedStyle(slide).marginRight) || 16;
      return slide.offsetWidth + mr;
    }

    function getMaxIndex() {
      return segments.length > 0 ? segments.length - 1 : Math.max(0, slides.length - 1);
    }

    function updateSlider(animate) {
      const step = getStepWidth();
      const maxIdx = getMaxIndex();
      currentIndex = Math.max(0, Math.min(currentIndex, maxIdx));

      const trackWidth = track.clientWidth;
      const totalWidth = wrapper.scrollWidth || (slides.length * step);
      const maxScroll = Math.max(0, totalWidth - trackWidth);
      let targetX = Math.min(currentIndex * step, maxScroll);
      currentTranslateX = targetX;

      wrapper.style.transition = animate ? 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' : 'none';
      wrapper.style.transform = `translate3d(-${targetX}px, 0px, 0px)`;

      segments.forEach(function (seg, idx) {
        const isActive = idx === currentIndex;
        seg.classList.toggle('slider-controls__pagination-segment--active', isActive);
        seg[isActive ? 'setAttribute' : 'removeAttribute']('aria-current', 'true');
      });

      if (prevBtn) prevBtn.disabled = currentIndex === 0;
      if (nextBtn) nextBtn.disabled = currentIndex >= maxIdx || targetX >= maxScroll;
    }

    // Button controls
    if (nextBtn) nextBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (currentIndex < getMaxIndex()) { currentIndex++; updateSlider(true); }
    });

    if (prevBtn) prevBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (currentIndex > 0) { currentIndex--; updateSlider(true); }
    });

    segments.forEach(function (seg, idx) {
      seg.addEventListener('click', function (e) {
        e.preventDefault();
        currentIndex = idx;
        updateSlider(true);
      });
    });

    // Mouse drag
    var isDragging = false, startX = 0, initialScrollX = 0;
    var dragDistance = 0, dragStartTime = 0, hasDragged = false;

    track.style.cursor = 'grab';
    track.addEventListener('dragstart', function (e) { e.preventDefault(); });

    track.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;
      isDragging = true; hasDragged = false;
      startX = e.clientX; initialScrollX = currentTranslateX;
      dragDistance = 0; dragStartTime = Date.now();
      wrapper.style.transition = 'none';
      track.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    });

    window.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      var deltaX = e.clientX - startX;
      dragDistance = deltaX;
      if (Math.abs(deltaX) > 5) hasDragged = true;

      var step = getStepWidth();
      var maxScroll = Math.max(0, (wrapper.scrollWidth || slides.length * step) - track.clientWidth);
      var nx = initialScrollX - deltaX;
      if (nx < 0) nx = nx * 0.35;
      else if (nx > maxScroll) nx = maxScroll + (nx - maxScroll) * 0.35;
      wrapper.style.transform = `translate3d(-${nx}px, 0px, 0px)`;
    });

    function endDrag() {
      if (!isDragging) return;
      isDragging = false;
      track.style.cursor = 'grab';
      document.body.style.userSelect = '';
      var velocity = Math.abs(dragDistance) / Math.max(1, Date.now() - dragStartTime);
      if (hasDragged && (Math.abs(dragDistance) > 40 || velocity > 0.25)) {
        if (dragDistance < 0 && currentIndex < getMaxIndex()) currentIndex++;
        else if (dragDistance > 0 && currentIndex > 0) currentIndex--;
      }
      updateSlider(true);
      setTimeout(function () { hasDragged = false; }, 80);
    }

    window.addEventListener('mouseup', endDrag);
    track.addEventListener('click', function (e) {
      if (hasDragged) { e.preventDefault(); e.stopPropagation(); }
    }, true);

    // Touch swipe
    var touchStartX = 0, touchDistance = 0, touchStartTime = 0;

    track.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
      initialScrollX = currentTranslateX;
      touchDistance = 0; touchStartTime = Date.now();
      wrapper.style.transition = 'none';
    }, { passive: true });

    track.addEventListener('touchmove', function (e) {
      touchDistance = e.touches[0].clientX - touchStartX;
      var step = getStepWidth();
      var maxScroll = Math.max(0, (wrapper.scrollWidth || slides.length * step) - track.clientWidth);
      var nx = initialScrollX - touchDistance;
      if (nx < 0) nx = nx * 0.35;
      else if (nx > maxScroll) nx = maxScroll + (nx - maxScroll) * 0.35;
      wrapper.style.transform = `translate3d(-${nx}px, 0px, 0px)`;
    }, { passive: true });

    track.addEventListener('touchend', function () {
      var velocity = Math.abs(touchDistance) / Math.max(1, Date.now() - touchStartTime);
      if (Math.abs(touchDistance) > 40 || velocity > 0.25) {
        if (touchDistance < 0 && currentIndex < getMaxIndex()) currentIndex++;
        else if (touchDistance > 0 && currentIndex > 0) currentIndex--;
      }
      updateSlider(true);
    }, { passive: true });

    window.addEventListener('resize', function () { updateSlider(false); });
    updateSlider(false);
  }

  // Horizontal scroll lock
  function initScrollLock() {
    window.addEventListener('scroll', function () {
      if (window.scrollX !== 0) window.scrollTo(0, window.scrollY);
    }, { passive: true });
  }

  function start() {
    initCarousel();
    initScrollLock();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
}());
