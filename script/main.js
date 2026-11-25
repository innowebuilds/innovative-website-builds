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
  var targets = document.querySelectorAll('.section-head, .work-card, .service, .process li, .plan, .about > *, .contact-grid > *');
  if ('IntersectionObserver' in window) {
    targets.forEach(function (el) { el.classList.add('reveal'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  }
});
