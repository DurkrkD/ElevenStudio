/* Eleven Studio · interações leves (sem bibliotecas) */
(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var waFloat = document.querySelector('.wa-float');
  var hero = document.querySelector('.hero');

  // Header muda ao rolar; botão flutuante aparece depois do topo da página
  var ticking = false;
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-scrolled', y > 12);
    if (waFloat) {
      var limit = hero ? hero.offsetHeight * 0.6 : 400;
      waFloat.classList.toggle('is-visible', y > limit);
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  // Entrada suave dos elementos ao aparecerem na tela
  var items = document.querySelectorAll('[data-reveal]');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { observer.observe(el); });
  }

  // Ano atual no rodapé
  var year = document.getElementById('ano');
  if (year) year.textContent = new Date().getFullYear();
})();
