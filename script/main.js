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

  // Applications slider (slides are defined in script/apps.js)
  var appsTrack = document.getElementById('apps-track');
  var apps = window.IWB_APPS || [];
  if (appsTrack && apps.length) {
    var appsSection = document.getElementById('apps');
    var dotsWrap = document.getElementById('apps-dots');
    var prevBtn = document.getElementById('apps-prev');
    var nextBtn = document.getElementById('apps-next');
    var curEl = document.getElementById('apps-current');
    var totEl = document.getElementById('apps-total');
    var bar = document.getElementById('apps-bar');
    var status = document.getElementById('apps-status');
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var el = function (tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; };
    var placeholder = function () {
      var ph = el('div', 'app-ph');
      ph.setAttribute('aria-hidden', 'true');
      for (var k = 0; k < 3; k++) {
        var phone = el('div', 'app-ph-phone');
        var screen = el('div', 'app-ph-screen');
        ['app-ph-bar w60', 'app-ph-card', 'app-ph-bar w80', 'app-ph-bar w40', 'app-ph-row'].forEach(function (c) { screen.appendChild(el('span', c)); });
        phone.appendChild(screen);
        ph.appendChild(phone);
      }
      ph.appendChild(el('span', 'app-ph-chip', 'Preview coming soon'));
      return ph;
    };
    var slides = [], dots = [];
    apps.forEach(function (app, i) {
      var li = el('li', 'app-slide');
      li.setAttribute('role', 'group');
      li.setAttribute('aria-roledescription', 'slide');
      li.setAttribute('aria-label', (i + 1) + ' of ' + apps.length + ': ' + app.name);
      var stage = el('div', 'app-stage');
      if (app.image) {
        var img = new Image();
        img.src = app.image;
        img.alt = app.alt || (app.name + ' app screens');
        img.loading = 'lazy';
        img.decoding = 'async';
        stage.appendChild(img);
      } else {
        stage.classList.add('is-placeholder');
        stage.appendChild(placeholder());
      }
      var meta = el('div', 'app-meta');
      var title = el('div', 'app-title');
      if (app.category) title.appendChild(el('p', 'app-cat', app.category));
      title.appendChild(el('h3', '', app.name));
      var body = el('div', 'app-body');
      if (app.description) body.appendChild(el('p', 'app-desc', app.description));
      if (app.platforms && app.platforms.length) {
        var tags = el('ul', 'app-tags');
        app.platforms.forEach(function (t) { tags.appendChild(el('li', '', t)); });
        body.appendChild(tags);
      }
      if (app.link) {
        var a = el('a', 'app-link', (app.linkLabel || 'View app') + ' ↗');
        a.href = app.link; a.target = '_blank'; a.rel = 'noopener';
        body.appendChild(a);
      }
      meta.appendChild(title); meta.appendChild(body);
      li.appendChild(stage); li.appendChild(meta);
      appsTrack.appendChild(li);
      slides.push(li);

      var dot = el('button', 'apps-dot');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Show application ' + (i + 1) + ': ' + app.name);
      dot.addEventListener('click', function () { go(i); });
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });
    if (totEl) totEl.textContent = pad(apps.length);
    if (apps.length < 2) appsSection.classList.add('apps-single');

    var current = -1;
    var setActive = function (i, announce) {
      if (i === current) return;
      current = i;
      slides.forEach(function (s, k) { s.classList.toggle('is-active', k === i); });
      dots.forEach(function (d, k) { if (k === i) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
      if (curEl) curEl.textContent = pad(i + 1);
      if (bar) bar.style.transform = 'scaleX(' + ((i + 1) / apps.length) + ')';
      prevBtn.disabled = i === 0;
      nextBtn.disabled = i === apps.length - 1;
      if (announce && status) status.textContent = 'Application ' + (i + 1) + ' of ' + apps.length + ': ' + apps[i].name;
    };
    var go = function (i) {
      i = Math.max(0, Math.min(apps.length - 1, i));
      var s = slides[i];
      var left = s.offsetLeft - parseFloat(getComputedStyle(appsTrack).paddingLeft || 0);
      appsTrack.scrollTo({ left: left, behavior: reduceMotion ? 'auto' : 'smooth' });
      setActive(i, true);
    };
    var nearest = function () {
      var base = parseFloat(getComputedStyle(appsTrack).paddingLeft || 0);
      var x = appsTrack.scrollLeft, best = 0, bestD = Infinity;
      slides.forEach(function (s, k) { var d = Math.abs(s.offsetLeft - base - x); if (d < bestD) { bestD = d; best = k; } });
      if (appsTrack.scrollLeft + appsTrack.clientWidth >= appsTrack.scrollWidth - 2) best = slides.length - 1;
      return best;
    };
    var raf = false;
    appsTrack.addEventListener('scroll', function () {
      if (raf) return; raf = true;
      requestAnimationFrame(function () { raf = false; setActive(nearest(), false); });
    }, { passive: true });
    prevBtn.addEventListener('click', function () { go(current - 1); });
    nextBtn.addEventListener('click', function () { go(current + 1); });
    appsTrack.addEventListener('keydown', function (e) {
      if (e.target !== appsTrack) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); go(current + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(current - 1); }
      else if (e.key === 'Home') { e.preventDefault(); go(0); }
      else if (e.key === 'End') { e.preventDefault(); go(apps.length - 1); }
    });
    setActive(0, false);
  }
});
