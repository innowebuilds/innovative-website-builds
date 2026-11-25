document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', function () {
  // Mobile menu
  var toggle = document.getElementById('menu-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  // Header border once scrolled
  var header = document.querySelector('.header');
  var onScroll = function () { if (header) header.classList.toggle('scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Current year
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Pricing buttons preselect the project type
  document.querySelectorAll('[data-plan]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var select = document.getElementById('websiteType');
      if (select) select.value = btn.getAttribute('data-plan');
    });
  });

  // Track form submissions (conversion fires on the thank-you page)
  var form = document.getElementById('lead-form');
  if (form) {
    form.addEventListener('submit', function () {
      try {
        if (typeof gtag === 'function') gtag('event', 'form_submit', { form_id: 'lead-form' });
        if (typeof fbq === 'function') fbq('track', 'Lead');
      } catch (e) { /* never block the form */ }
    });
  }

  // Subtle reveal on scroll; content is visible if JS or observers are unavailable
  var targets = document.querySelectorAll('.section-head, .work-card, .service, .step, .plan, .about > *, .contact-grid > *');
  if ('IntersectionObserver' in window) {
    targets.forEach(function (el) { el.classList.add('reveal'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  }

  var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 3D tilt and light-follow on service cards
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--ry', ((px - 0.5) * 10).toFixed(2) + 'deg');
        card.style.setProperty('--rx', ((0.5 - py) * 10).toFixed(2) + 'deg');
        card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
      });
      card.addEventListener('pointerleave', function () {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  // Process timeline fills as the section scrolls into view
  var wrap = document.querySelector('.process-wrap');
  if (wrap) {
    var steps = wrap.querySelectorAll('.step');
    var ticking = false;
    var update = function () {
      ticking = false;
      var r = wrap.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = (vh * 0.75 - r.top) / (r.height + vh * 0.1);
      p = Math.max(0, Math.min(1, p));
      wrap.style.setProperty('--progress', p.toFixed(3));
      steps.forEach(function (st, i) {
        st.classList.toggle('active', p >= (i / steps.length) + 0.02);
      });
    };
    if (reduceMotion) { wrap.style.setProperty('--progress', '1'); steps.forEach(function (st) { st.classList.add('active'); }); }
    else {
      window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
      window.addEventListener('resize', update);
      update();
    }
  }
});
