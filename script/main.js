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

  // Applications: app cards (defined in script/apps.js), each opening a gallery of its screens
  var appsGrid = document.getElementById('apps-grid');
  var apps = window.IWB_APPS || [];
  if (appsGrid) {
    var el = function (tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; };
    var viewer = document.getElementById('apps-viewer');
    var vImg = viewer ? viewer.querySelector('#apps-viewer-stage img') : null;
    var vTitle = document.getElementById('apps-viewer-title');
    var vCount = document.getElementById('apps-viewer-count');
    var vCaption = document.getElementById('apps-viewer-caption');
    var vPrev = document.getElementById('apps-viewer-prev');
    var vNext = document.getElementById('apps-viewer-next');
    var vApp = null, vIndex = 0;

    var show = function (i) {
      var list = vApp.screens;
      vIndex = Math.max(0, Math.min(list.length - 1, i));
      var sc = list[vIndex];
      vImg.src = sc.image;
      vImg.alt = sc.alt || sc.title || vApp.name;
      vCount.textContent = (vIndex + 1) + ' / ' + list.length;
      vCaption.textContent = '';
      if (sc.title) { vCaption.appendChild(el('strong', '', sc.title)); }
      if (sc.caption) { vCaption.appendChild(el('span', '', (sc.title ? ' — ' : '') + sc.caption)); }
      vPrev.disabled = vIndex === 0;
      vNext.disabled = vIndex === list.length - 1;
      vPrev.hidden = vNext.hidden = list.length < 2;
      // Warm the next image so stepping through feels instant
      if (list[vIndex + 1]) { var pre = new Image(); pre.src = list[vIndex + 1].image; }
    };
    var openGallery = function (app, i) {
      if (!viewer || typeof viewer.showModal !== 'function') { window.open(app.screens[i || 0].image, '_blank', 'noopener'); return; }
      vApp = app;
      vTitle.textContent = app.name;
      viewer.querySelector('.apps-viewer-stage').style.background = app.background || '';
      show(i || 0);
      viewer.showModal();
    };
    if (viewer) {
      vPrev.addEventListener('click', function () { show(vIndex - 1); });
      vNext.addEventListener('click', function () { show(vIndex + 1); });
      document.getElementById('apps-viewer-close').addEventListener('click', function () { viewer.close(); });
      viewer.addEventListener('click', function (e) { if (e.target === viewer) viewer.close(); });
      viewer.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); show(vIndex + 1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); show(vIndex - 1); }
      });
      // Swipe between screens on touch screens
      var sx = null, sy = null;
      var stage = document.getElementById('apps-viewer-stage');
      stage.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
      stage.addEventListener('touchend', function (e) {
        if (sx === null) return;
        var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(vIndex + (dx < 0 ? 1 : -1));
        sx = null;
      }, { passive: true });
    }

    apps.forEach(function (app) {
      var screens = app.screens || [];
      var li = el('li', 'app-card');
      var thumb;
      if (screens.length) {
        thumb = el('button', 'app-thumb');
        thumb.type = 'button';
        thumb.setAttribute('aria-label', 'Open ' + app.name + ' gallery, ' + screens.length + (screens.length === 1 ? ' screen' : ' screens'));
        if (app.background) thumb.style.background = app.background;
        var img = new Image();
        img.src = screens[0].image;
        img.alt = '';
        img.loading = 'lazy';
        img.decoding = 'async';
        thumb.appendChild(img);
        thumb.appendChild(el('span', 'app-count', screens.length + (screens.length === 1 ? ' screen' : ' screens')));
        thumb.addEventListener('click', function () { openGallery(app, 0); });
      } else {
        thumb = el('div', 'app-thumb is-empty');
        thumb.appendChild(el('span', 'app-empty', 'Preview coming soon'));
      }
      var body = el('div', 'app-body');
      if (app.category) body.appendChild(el('p', 'app-cat', app.category));
      body.appendChild(el('h3', '', app.name));
      if (app.description) body.appendChild(el('p', 'app-desc', app.description));
      if (app.platforms && app.platforms.length) {
        var tags = el('ul', 'app-tags');
        app.platforms.forEach(function (t) { tags.appendChild(el('li', '', t)); });
        body.appendChild(tags);
      }
      if (screens.length) {
        var open = el('button', 'app-open', 'View screens →');
        open.type = 'button';
        open.addEventListener('click', function () { openGallery(app, 0); });
        body.appendChild(open);
      }
      li.appendChild(thumb); li.appendChild(body);
      appsGrid.appendChild(li);
    });

    // Closing card invites the next app project
    var next = el('li', 'app-card app-card-next');
    next.appendChild(el('p', 'app-cat', 'Your app next'));
    next.appendChild(el('h3', '', 'Have an app in mind?'));
    next.appendChild(el('p', '', 'From clinic systems to booking platforms, we design and build apps that teams use every day.'));
    var cta = el('a', 'btn btn-primary', 'Start a project');
    cta.href = '#contact';
    next.appendChild(cta);
    appsGrid.appendChild(next);
  }
});
