/* Site background: lit, glass-like 3D shapes (code glyphs and solids) floating
   in depth on one fixed canvas behind every section. Plain canvas 2D, no libraries.
   Shapes drift with scroll (parallax) and dim below the hero so text stays readable.
   Pauses in a hidden tab, runs at 30fps on phones, one still frame for reduced motion. */
(function () {
  var canvas = document.getElementById('bg-canvas');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- mesh helpers: a mesh is { v: [[x,y,z]...], f: [[i,j,k,l]...] } ----------
  function merge(meshes) {
    var v = [], f = [];
    meshes.forEach(function (m) {
      var o = v.length;
      m.v.forEach(function (p) { v.push(p); });
      m.f.forEach(function (face) { f.push(face.map(function (i) { return i + o; })); });
    });
    return { v: v, f: f };
  }
  // A rectangular bar from 2D point a to b, with thickness t and depth d.
  function bar(a, b, t, d) {
    var dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
    var nx = -dy / len * t / 2, ny = dx / len * t / 2;
    var ex = dx / len * t / 2, ey = dy / len * t / 2; // extend ends so joints overlap
    var p = [
      [a[0] - ex + nx, a[1] - ey + ny], [b[0] + ex + nx, b[1] + ey + ny],
      [b[0] + ex - nx, b[1] + ey - ny], [a[0] - ex - nx, a[1] - ey - ny]
    ];
    var v = [];
    p.forEach(function (q) { v.push([q[0], q[1], d]); });
    p.forEach(function (q) { v.push([q[0], q[1], -d]); });
    return { v: v, f: [[0, 1, 2, 3], [7, 6, 5, 4], [0, 4, 5, 1], [1, 5, 6, 2], [2, 6, 7, 3], [3, 7, 4, 0]] };
  }
  function polyBars(pts, t, d) {
    var ms = [];
    for (var i = 0; i < pts.length - 1; i++) ms.push(bar(pts[i], pts[i + 1], t, d));
    return merge(ms);
  }
  function box(w, h, d) {
    var v = [[-w, -h, d], [w, -h, d], [w, h, d], [-w, h, d], [-w, -h, -d], [w, -h, -d], [w, h, -d], [-w, h, -d]];
    return { v: v, f: [[0, 1, 2, 3], [5, 4, 7, 6], [4, 0, 3, 7], [1, 5, 6, 2], [3, 2, 6, 7], [4, 5, 1, 0]] };
  }
  function octa(r) {
    var v = [[r, 0, 0], [-r, 0, 0], [0, r, 0], [0, -r, 0], [0, 0, r], [0, 0, -r]];
    return { v: v, f: [[0, 2, 4], [2, 1, 4], [1, 3, 4], [3, 0, 4], [2, 0, 5], [1, 2, 5], [3, 1, 5], [0, 3, 5]] };
  }
  function ico(r) {
    var t = (1 + Math.sqrt(5)) / 2, s = r / Math.sqrt(1 + t * t);
    var v = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]]
      .map(function (p) { return [p[0] * s, p[1] * s, p[2] * s]; });
    var f = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
      [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
    return { v: v, f: f };
  }
  function torus(R, r, nu, nv) {
    var v = [], f = [];
    for (var i = 0; i < nu; i++) for (var j = 0; j < nv; j++) {
      var u = i / nu * Math.PI * 2, w = j / nv * Math.PI * 2;
      v.push([(R + r * Math.cos(w)) * Math.cos(u), (R + r * Math.cos(w)) * Math.sin(u), r * Math.sin(w)]);
    }
    for (i = 0; i < nu; i++) for (j = 0; j < nv; j++) {
      var a = i * nv + j, b = ((i + 1) % nu) * nv + j, c = ((i + 1) % nu) * nv + (j + 1) % nv, d = i * nv + (j + 1) % nv;
      f.push([a, b, c, d]);
    }
    return { v: v, f: f };
  }

  var T = 0.2, D = 0.16;
  var SHAPES = {
    tag: merge([
      polyBars([[-0.5, 0.55], [-1.15, 0], [-0.5, -0.55]], T, D),
      bar([-0.2, -0.8], [0.2, 0.8], T, D),
      polyBars([[0.5, 0.55], [1.15, 0], [0.5, -0.55]], T, D)
    ]),
    braces: merge([
      polyBars([[-0.45, 0.9], [-0.75, 0.82], [-0.8, 0.2], [-1.05, 0], [-0.8, -0.2], [-0.75, -0.82], [-0.45, -0.9]], 0.17, D),
      polyBars([[0.45, 0.9], [0.75, 0.82], [0.8, 0.2], [1.05, 0], [0.8, -0.2], [0.75, -0.82], [0.45, -0.9]], 0.17, D)
    ]),
    prompt: merge([polyBars([[-0.85, 0.45], [-0.3, 0], [-0.85, -0.45]], T, D), bar([0, -0.5], [0.85, -0.5], T, D)]),
    window: merge([
      box(1.15, 0.8, 0.07),
      bar([-1.0, 0.55], [1.0, 0.55], 0.05, 0.1),
      bar([-0.8, 0.15], [0.3, 0.15], 0.1, 0.1),
      bar([-0.8, -0.15], [0.6, -0.15], 0.1, 0.1),
      bar([-0.8, -0.45], [0.1, -0.45], 0.1, 0.1)
    ]),
    cube: box(0.62, 0.62, 0.62),
    octa: octa(0.9),
    ico: ico(0.9),
    ring: torus(0.68, 0.22, 22, 10)
  };

  var LAYOUT = [
    { s: 'tag',    x: -0.76, y: -0.46, z: 0.25,  k: 1.2,  hue: 218 },
    { s: 'window', x:  0.74, y: -0.5,  z: 0.05,  k: 1.2,  hue: 226 },
    { s: 'ico',    x: -0.86, y:  0.46, z: -0.15, k: 0.95, hue: 205 },
    { s: 'braces', x:  0.84, y:  0.4,  z: 0.2,   k: 1.0,  hue: 212 },
    { s: 'ring',   x: -0.42, y:  0.86, z: -0.35, k: 0.8,  hue: 232 },
    { s: 'cube',   x:  0.46, y:  0.88, z: -0.25, k: 0.75, hue: 220 },
    { s: 'octa',   x: -0.4,  y: -0.92, z: -0.45, k: 0.62, hue: 200 },
    { s: 'prompt', x:  0.38, y: -0.9,  z: -0.4,  k: 0.7,  hue: 214 }
  ];
  var MOBILE_LAYOUT = [
    { s: 'tag',    x: -0.6,  y: -0.88, z: 0.1,  k: 0.85, hue: 218 },
    { s: 'ico',    x:  0.66, y: -0.9,  z: 0.2,  k: 0.75, hue: 205 },
    { s: 'braces', x: -0.66, y:  0.92, z: 0.0,  k: 0.75, hue: 212 },
    { s: 'ring',   x:  0.64, y:  0.9,  z: -0.1, k: 0.7,  hue: 232 }
  ];
  var FLAT = { tag: 1, braces: 1, prompt: 1, window: 1 };

  var LIGHT = (function () { var l = [-0.45, 0.6, 0.66], n = Math.hypot(l[0], l[1], l[2]); return [l[0] / n, l[1] / n, l[2] / n]; })();
  var items = [], dust = [], W = 0, H = 0, dpr = 1, mobile = false;
  var mouse = { x: 0, y: 0, tx: 0, ty: 0 };

  function build() {
    var list = mobile ? MOBILE_LAYOUT : LAYOUT;
    items = list.map(function (l, i) {
      return {
        mesh: SHAPES[l.s], x: l.x, y: l.y, z: l.z, k: l.k, hue: l.hue, flat: !!FLAT[l.s],
        rx: Math.random() * 6.28, ry: Math.random() * 6.28, rz: (Math.random() - 0.5) * 0.5,
        vx: (0.1 + Math.random() * 0.12) * (i % 2 ? 1 : -1),
        vy: (0.12 + Math.random() * 0.14) * (i % 3 ? 1 : -1),
        phase: Math.random() * 6.28
      };
    });
    // drifting light particles for depth
    dust = [];
    var n = mobile ? 26 : 60;
    for (var i = 0; i < n; i++) dust.push({ x: Math.random(), y: Math.random(), z: Math.random(), s: 0.004 + Math.random() * 0.01, p: Math.random() * 6.28 });
  }

  var scrollY = 0;
  function resize(force) {
    var w = window.innerWidth, h = window.innerHeight;
    // Phones change height when the address bar hides; ignore small height-only changes.
    if (!force && w === W && Math.abs(h - H) < 160) return false;
    var widthChanged = w !== W;
    W = w; H = h;
    mobile = W < 760;
    dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.75);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    if (widthChanged || force) build();
    return true;
  }

  function drawShape(it, t) {
    var ax, ay, az = it.rz;
    if (it.flat) {
      ax = -0.3 + Math.sin(t * Math.abs(it.vx) * 2 + it.phase) * 0.3;
      ay = Math.sin(t * Math.abs(it.vy) * 2 + it.phase * 1.7) * 0.7;
    } else { ax = it.rx + t * it.vx; ay = it.ry + t * it.vy; }
    var cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay), cz = Math.cos(az), sz = Math.sin(az);
    var unit = Math.min(W, H) * (mobile ? 0.09 : 0.085);
    var par = 1 + it.z;
    var ox = W / 2 + it.x * W * (mobile ? 0.5 : 0.47) + mouse.x * 22 * par;
    // parallax: nearer shapes move faster against the scroll, then wrap around
    var span = H * 1.4;
    var baseY = H / 2 + it.y * H * (mobile ? 0.47 : 0.44) - scrollY * (0.12 + 0.16 * (it.z + 0.5));
    baseY = ((baseY + H * 0.2) % span + span) % span - H * 0.2;
    var oy = baseY + Math.sin(t * 0.6 + it.phase) * 7 + mouse.y * 14 * par;
    var size = unit * it.k * (1 + it.z * 0.3);
    var cam = 6;

    // soft glow under the shape
    var g = ctx.createRadialGradient(ox, oy, 0, ox, oy, size * 2.1);
    g.addColorStop(0, 'hsla(' + it.hue + ',90%,62%,' + (0.2 + it.z * 0.1).toFixed(3) + ')');
    g.addColorStop(1, 'hsla(' + it.hue + ',90%,62%,0)');
    ctx.fillStyle = g;
    ctx.fillRect(ox - size * 2.2, oy - size * 2.2, size * 4.4, size * 4.4);

    // transform vertices
    var v = it.mesh.v, tv = new Array(v.length), pv = new Array(v.length);
    for (var i = 0; i < v.length; i++) {
      var p = v[i];
      var y1 = p[1] * cx - p[2] * sx, z1 = p[1] * sx + p[2] * cx;
      var x2 = p[0] * cy + z1 * sy, z2 = -p[0] * sy + z1 * cy;
      var x3 = x2 * cz - y1 * sz, y3 = x2 * sz + y1 * cz;
      tv[i] = [x3, y3, z2];
      var f = cam / (cam + z2);
      pv[i] = [ox + x3 * size * f, oy - y3 * size * f];
    }
    // faces: shade and depth-sort
    var faces = [];
    var F = it.mesh.f;
    for (i = 0; i < F.length; i++) {
      var fc = F[i], a = tv[fc[0]], b = tv[fc[1]], c = tv[fc[2]];
      var ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], wx = c[0] - a[0], wy = c[1] - a[1], wz = c[2] - a[2];
      var nx = uy * wz - uz * wy, ny = uz * wx - ux * wz, nz = ux * wy - uy * wx;
      var nl = Math.hypot(nx, ny, nz) || 1; nx /= nl; ny /= nl; nz /= nl;
      var zsum = 0; for (var k = 0; k < fc.length; k++) zsum += tv[fc[k]][2];
      faces.push({ fc: fc, z: zsum / fc.length, nx: nx, ny: ny, nz: nz });
    }
    faces.sort(function (p, q) { return q.z - p.z; });
    var depthA = 0.75 + it.z * 0.35;
    for (i = 0; i < faces.length; i++) {
      var fa = faces[i];
      var facing = -fa.nz; // toward camera when positive (camera looks down +z)
      var lambert = Math.max(0, fa.nx * LIGHT[0] + fa.ny * LIGHT[1] - fa.nz * LIGHT[2]);
      var light = 28 + lambert * 46;
      var alpha = (facing > 0 ? 0.62 : 0.18) * depthA;
      ctx.beginPath();
      for (k = 0; k < fa.fc.length; k++) {
        var q = pv[fa.fc[k]];
        if (k === 0) ctx.moveTo(q[0], q[1]); else ctx.lineTo(q[0], q[1]);
      }
      ctx.closePath();
      ctx.fillStyle = 'hsla(' + it.hue + ',78%,' + light.toFixed(1) + '%,' + alpha.toFixed(3) + ')';
      ctx.fill();
      if (facing > 0) {
        ctx.strokeStyle = 'hsla(' + (it.hue - 8) + ',100%,' + (70 + lambert * 20).toFixed(1) + '%,' + (0.35 + lambert * 0.4).toFixed(3) + ')';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }

  function draw(t) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    // full strength over the hero, softer behind the content below it
    var fade = Math.min(1, scrollY / (H * 0.8));
    ctx.globalAlpha = 1 - fade * (mobile ? 0.6 : 0.5);
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;

    // particles
    for (var i = 0; i < dust.length; i++) {
      var d = dust[i];
      var px = ((d.x + t * d.s * 0.4) % 1) * W + mouse.x * 10 * d.z;
      var py = ((d.y - t * d.s) % 1 + 1) % 1 * H + mouse.y * 6 * d.z;
      var a = (0.15 + d.z * 0.45) * (0.6 + 0.4 * Math.sin(t * 1.3 + d.p));
      ctx.fillStyle = 'rgba(170,200,255,' + a.toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(px, py, 0.6 + d.z * 1.3, 0, 6.283);
      ctx.fill();
    }
    // far shapes first
    var order = items.slice().sort(function (p, q) { return p.z - q.z; });
    for (i = 0; i < order.length; i++) drawShape(order[i], t);
  }

  var running = false, start = performance.now(), raf = 0, last = 0;
  function loop(now) {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    if (mobile && now - last < 32) return; // ~30fps on phones
    last = now;
    draw((now - start) / 1000);
  }
  function play() {
    if (reduce || running || document.hidden) return;
    running = true;
    raf = requestAnimationFrame(loop);
  }
  function pause() { running = false; cancelAnimationFrame(raf); }

  scrollY = window.scrollY || 0;
  resize(true);
  draw(2);
  canvas.classList.add('ready');

  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { if (resize(false) && !running) draw((performance.now() - start) / 1000); }, 150);
  });
  window.addEventListener('scroll', function () {
    scrollY = window.scrollY || 0;
    if (reduce) draw(2);
  }, { passive: true });
  if (reduce) return;

  window.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });
  document.addEventListener('visibilitychange', function () { if (document.hidden) pause(); else play(); });
  play();
})();
