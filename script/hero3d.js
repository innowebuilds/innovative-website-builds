/* Hero background: floating wireframe 3D shapes drawn on a 2D canvas.
   No libraries. Pauses when the hero is off screen or the tab is hidden,
   and renders a single still frame for visitors who prefer reduced motion. */
(function () {
  var canvas = document.getElementById('hero-canvas');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var hero = canvas.parentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- geometry helpers ----------
  // Extrude 2D polylines into 3D wireframe segments: front face, back face, and depth edges.
  function extrude(polys, depth) {
    var segs = [];
    polys.forEach(function (pl) {
      for (var i = 0; i < pl.length; i++) {
        var a = pl[i];
        if (i < pl.length - 1) {
          var b = pl[i + 1];
          segs.push([[a[0], a[1], depth], [b[0], b[1], depth]]);
          segs.push([[a[0], a[1], -depth], [b[0], b[1], -depth]]);
        }
        segs.push([[a[0], a[1], depth], [a[0], a[1], -depth]]);
      }
    });
    return segs;
  }
  function circle(cx, cy, r, n) {
    var pts = [];
    for (var i = 0; i <= n; i++) {
      var t = (i / n) * Math.PI * 2;
      pts.push([cx + Math.cos(t) * r, cy + Math.sin(t) * r]);
    }
    return pts;
  }
  function arc(cx, cy, r, a0, a1, n) {
    var pts = [];
    for (var i = 0; i <= n; i++) {
      var t = a0 + (a1 - a0) * (i / n);
      pts.push([cx + Math.cos(t) * r, cy + Math.sin(t) * r]);
    }
    return pts;
  }
  function boxEdges(w, h, d) {
    var v = [];
    [-1, 1].forEach(function (x) { [-1, 1].forEach(function (y) { [-1, 1].forEach(function (z) { v.push([x * w, y * h, z * d]); }); }); });
    var segs = [];
    for (var i = 0; i < 8; i++) for (var j = i + 1; j < 8; j++) {
      var diff = 0;
      for (var k = 0; k < 3; k++) if (v[i][k] !== v[j][k]) diff++;
      if (diff === 1) segs.push([v[i], v[j]]);
    }
    return segs;
  }
  function octa(r) {
    var v = [[r, 0, 0], [-r, 0, 0], [0, r, 0], [0, -r, 0], [0, 0, r], [0, 0, -r]];
    var segs = [];
    for (var i = 0; i < 6; i++) for (var j = i + 1; j < 6; j++) {
      if (Math.floor(i / 2) !== Math.floor(j / 2)) segs.push([v[i], v[j]]);
    }
    return segs;
  }

  // ---------- shape library (coding & web themed) ----------
  var SHAPES = {
    // </>
    tag: extrude([
      [[-0.55, 0.55], [-1.2, 0], [-0.55, -0.55]],
      [[-0.2, -0.8], [0.2, 0.8]],
      [[0.55, 0.55], [1.2, 0], [0.55, -0.55]]
    ], 0.14),
    // { }
    braces: extrude([
      [[-0.55, 0.9], [-0.8, 0.85], [-0.85, 0.2], [-1.1, 0], [-0.85, -0.2], [-0.8, -0.85], [-0.55, -0.9]],
      [[0.55, 0.9], [0.8, 0.85], [0.85, 0.2], [1.1, 0], [0.85, -0.2], [0.8, -0.85], [0.55, -0.9]]
    ], 0.14),
    // browser window with address bar and code lines
    browser: extrude([
      [[-1.3, 0.9], [1.3, 0.9], [1.3, -0.9], [-1.3, -0.9], [-1.3, 0.9]],
      [[-1.3, 0.55], [1.3, 0.55]],
      circle(-1.08, 0.73, 0.07, 8),
      circle(-0.86, 0.73, 0.07, 8),
      circle(-0.64, 0.73, 0.07, 8),
      [[-1.0, 0.2], [0.2, 0.2]],
      [[-0.8, -0.1], [0.7, -0.1]],
      [[-0.8, -0.4], [0.3, -0.4]]
    ], 0.06),
    // terminal prompt >_
    prompt: extrude([
      [[-0.9, 0.45], [-0.35, 0], [-0.9, -0.45]],
      [[-0.1, -0.5], [0.8, -0.5]]
    ], 0.14),
    // cursor pointer
    cursor: extrude([
      [[0, 0.9], [0, -0.55], [0.32, -0.25], [0.55, -0.8], [0.72, -0.72], [0.5, -0.18], [0.92, -0.18], [0, 0.9]]
    ], 0.1),
    // layers / stack
    stack: [].concat(
      boxEdges(0.9, 0.06, 0.6).map(function (s) { return s.map(function (p) { return [p[0], p[1] + 0.45, p[2]]; }); }),
      boxEdges(0.9, 0.06, 0.6),
      boxEdges(0.9, 0.06, 0.6).map(function (s) { return s.map(function (p) { return [p[0], p[1] - 0.45, p[2]]; }); })
    ),
    cube: boxEdges(0.6, 0.6, 0.6),
    octa: octa(0.85),
    // gear (settings / maintenance)
    gear: (function () {
      var outer = [], n = 8;
      for (var i = 0; i < n; i++) {
        var a0 = (i / n) * Math.PI * 2, a1 = a0 + Math.PI / n * 0.55, a2 = a0 + Math.PI / n, a3 = a0 + Math.PI / n * 1.45;
        outer.push([Math.cos(a0) * 0.72, Math.sin(a0) * 0.72], [Math.cos(a1) * 0.95, Math.sin(a1) * 0.95], [Math.cos(a2) * 0.95, Math.sin(a2) * 0.95], [Math.cos(a3) * 0.72, Math.sin(a3) * 0.72]);
      }
      outer.push(outer[0]);
      return extrude([outer, circle(0, 0, 0.3, 14)], 0.12);
    })(),
    // curly arc / brackets [ ]
    brackets: extrude([
      [[-0.6, 0.9], [-1.0, 0.9], [-1.0, -0.9], [-0.6, -0.9]],
      [[0.6, 0.9], [1.0, 0.9], [1.0, -0.9], [0.6, -0.9]],
      arc(0, 0, 0.18, 0, Math.PI * 2, 10)
    ], 0.12)
  };

  // Positions in hero space (-1..1), kept away from the centred text.
  var LAYOUT = [
    { s: 'tag',      x: -0.78, y: -0.52, z: 0.2,  k: 1.15 },
    { s: 'browser',  x:  0.74, y: -0.48, z: -0.1, k: 1.25 },
    { s: 'braces',   x: -0.86, y:  0.42, z: -0.2, k: 0.95 },
    { s: 'cube',     x:  0.86, y:  0.38, z: 0.3,  k: 0.95 },
    { s: 'prompt',   x: -0.42, y:  0.82, z: 0.1,  k: 0.8 },
    { s: 'gear',     x:  0.46, y:  0.84, z: -0.3, k: 0.85 },
    { s: 'octa',     x: -0.5,  y: -0.88, z: -0.4, k: 0.7 },
    { s: 'stack',    x:  0.4,  y: -0.86, z: 0.2,  k: 0.75 },
    { s: 'cursor',   x:  0.98, y: -0.02, z: -0.2, k: 0.75 },
    { s: 'brackets', x: -1.0,  y:  0.0,  z: 0.0,  k: 0.7 }
  ];

  // On phones, shapes sit above and below the text instead of beside it.
  var MOBILE_LAYOUT = [
    { s: 'tag',     x: -0.62, y: -0.9,  z: 0.1,  k: 0.8 },
    { s: 'cube',    x:  0.7,  y: -0.92, z: 0.2,  k: 0.7 },
    { s: 'braces',  x: -0.7,  y:  0.93, z: -0.1, k: 0.7 },
    { s: 'gear',    x:  0.66, y:  0.92, z: 0.0,  k: 0.7 },
    { s: 'octa',    x:  0.02, y: -1.02, z: -0.3, k: 0.5 }
  ];

  var items = [], W = 0, H = 0, dpr = 1, mobile = false;
  var mouse = { x: 0, y: 0, tx: 0, ty: 0 };

  function build() {
    var list = mobile ? MOBILE_LAYOUT : LAYOUT;
    items = list.map(function (l, i) {
      return {
        segs: SHAPES[l.s], x: l.x, y: l.y, z: l.z, k: l.k,
        rx: Math.random() * 6.28, ry: Math.random() * 6.28, rz: (Math.random() - 0.5) * 0.6,
        vx: (0.08 + Math.random() * 0.12) * (i % 2 ? 1 : -1),
        vy: (0.1 + Math.random() * 0.14) * (i % 3 ? 1 : -1),
        phase: Math.random() * 6.28,
        accent: i % 3 === 0,
        flat: ['tag', 'braces', 'browser', 'prompt', 'cursor', 'brackets'].indexOf(l.s) !== -1
      };
    });
  }

  function resize() {
    var r = hero.getBoundingClientRect();
    W = r.width; H = r.height;
    mobile = W < 760;
    dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    build();
  }

  function draw(t) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    var unit = Math.min(W, H) * (mobile ? 0.09 : 0.085);
    var cam = 5;
    var spreadX = W * (mobile ? 0.5 : 0.47), spreadY = H * (mobile ? 0.47 : 0.44);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (var n = 0; n < items.length; n++) {
      var it = items[n];
      // Flat glyphs sway so they stay readable; solids spin freely.
      var ax, ay, az = it.rz;
      if (it.flat) {
        ax = -0.35 + Math.sin(t * Math.abs(it.vx) * 2 + it.phase) * 0.35;
        ay = Math.sin(t * Math.abs(it.vy) * 2.2 + it.phase * 1.7) * 0.75;
      } else {
        ax = it.rx + t * it.vx; ay = it.ry + t * it.vy;
      }
      var cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay), cz = Math.cos(az), sz = Math.sin(az);
      var bob = Math.sin(t * 0.6 + it.phase) * 6;
      var par = 1 + it.z * 0.6;
      var ox = W / 2 + it.x * spreadX + mouse.x * 18 * par;
      var oy = H / 2 + it.y * spreadY + bob + mouse.y * 12 * par;
      var size = unit * it.k * (1 + it.z * 0.25);
      var depthAlpha = 0.55 + it.z * 0.35;

      ctx.strokeStyle = it.accent ? 'rgba(31,95,209,' + (0.55 * depthAlpha).toFixed(3) + ')' : 'rgba(14,26,43,' + (0.32 * depthAlpha).toFixed(3) + ')';
      ctx.lineWidth = it.accent ? 1.3 : 1.1;
      ctx.beginPath();
      for (var s = 0; s < it.segs.length; s++) {
        for (var e = 0; e < 2; e++) {
          var p = it.segs[s][e];
          // rotate X, then Y, then Z
          var y1 = p[1] * cx - p[2] * sx, z1 = p[1] * sx + p[2] * cx;
          var x2 = p[0] * cy + z1 * sy, z2 = -p[0] * sy + z1 * cy;
          var x3 = x2 * cz - y1 * sz, y3 = x2 * sz + y1 * cz;
          var f = cam / (cam + z2);
          var px = ox + x3 * size * f, py = oy - y3 * size * f;
          if (e === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
    }
  }

  var running = false, visible = true, start = performance.now(), raf = 0;
  function loop(now) {
    if (!running) return;
    draw((now - start) / 1000);
    raf = requestAnimationFrame(loop);
  }
  function play() {
    if (reduce || running || !visible || document.hidden) return;
    running = true;
    raf = requestAnimationFrame(loop);
  }
  function pause() { running = false; cancelAnimationFrame(raf); }

  resize();
  draw(0);
  canvas.classList.add('ready');

  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { resize(); draw((performance.now() - start) / 1000); }, 150);
  });

  if (reduce) return;

  window.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) play(); else pause();
    }).observe(hero);
  }
  document.addEventListener('visibilitychange', function () { if (document.hidden) pause(); else play(); });
  play();
})();
