/* ============================================================
   Gradvera site — interactions
   Robust against environments where IntersectionObserver / CSS
   keyframes on injected nodes don't run: reveals use a scroll
   checker, the hero draw-in uses the Web Animations API, and
   everything is visible by default (animation is enhancement).
   ============================================================ */
(function () {
  'use strict';
  var docEl = document.documentElement;
  docEl.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SVGNS = 'http://www.w3.org/2000/svg';
  var EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

  /* ---------------- Hero blueprint ---------------- */
  var heroAnims = []; // {el, delay, dur} for stroke draw / node fade
  var seq = 0;
  function delayFor() { seq++; return 0.12 + seq * 0.011; }

  function mk(name, attrs) {
    var n = document.createElementNS(SVGNS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }
  function stroke(g, node, w, o, dur) {
    node.setAttribute('fill', 'none');
    node.setAttribute('stroke', 'var(--amber)');
    node.setAttribute('stroke-width', w || 1.4);
    node.setAttribute('stroke-opacity', o == null ? 1 : o);
    node.setAttribute('stroke-linecap', 'round');
    node.setAttribute('stroke-linejoin', 'round');
    node.setAttribute('pathLength', '1');
    g.appendChild(node);
    heroAnims.push({ el: node, kind: 'draw', delay: delayFor(), dur: dur || 1.0 });
  }
  function line(g, x1, y1, x2, y2, w, o) { stroke(g, mk('line', { x1: x1, y1: y1, x2: x2, y2: y2 }), w, o); }
  function path(g, d, w, o) { stroke(g, mk('path', { d: d }), w, o); }
  function node(g, x, y, r, fill) {
    var c = mk('circle', { cx: x, cy: y, r: r || 2.4, fill: fill || 'var(--amber)' });
    g.appendChild(c);
    heroAnims.push({ el: c, kind: 'fade', delay: 0.4 + seq * 0.01, dur: 0.5 });
  }
  function text(g, x, y, str, size, o, anchor, rot) {
    var a = { x: x, y: y, fill: 'var(--amber)', 'fill-opacity': o == null ? 0.5 : o,
      'font-family': 'IBM Plex Mono, monospace', 'font-size': size || 11, 'letter-spacing': '0.08em',
      'text-anchor': anchor || 'start' };
    if (rot != null) a.transform = 'rotate(' + rot + ' ' + x + ' ' + y + ')';
    var t = mk('text', a); t.textContent = str; g.appendChild(t);
    heroAnims.push({ el: t, kind: 'fade', delay: 0.55 + seq * 0.008, dur: 0.5 });
  }
  function cross(g, x, y, s, o) { // surveyor cross-mark
    s = s || 6;
    line(g, x - s, y, x + s, y, 0.8, o == null ? 0.45 : o);
    line(g, x, y - s, x, y + s, 0.8, o == null ? 0.45 : o);
  }

  function buildHero() {
    var svg = document.getElementById('hero-bp');
    if (!svg) return;
    svg.setAttribute('viewBox', '0 0 1000 780');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    // layer groups (back -> front) for parallax
    var gBack = mk('g', { id: 'bp-back', 'data-depth': '0.22' });
    var gAnno = mk('g', { id: 'bp-anno', 'data-depth': '0.40' });
    var gMain = mk('g', { id: 'bp-main', 'data-depth': '0.62' });
    var gFore = mk('g', { id: 'bp-fore', 'data-depth': '1.0' });
    svg.appendChild(gBack); svg.appendChild(gAnno); svg.appendChild(gMain); svg.appendChild(gFore);

    var gy = 640;

    /* ---- ground glow (grounds the building) ---- */
    var defs = mk('defs', {});
    var rg = mk('radialGradient', { id: 'bpGlow', cx: '50%', cy: '50%', r: '50%' });
    rg.appendChild(mk('stop', { offset: '0%', 'stop-color': 'var(--amber)', 'stop-opacity': '0.20' }));
    rg.appendChild(mk('stop', { offset: '60%', 'stop-color': 'var(--amber)', 'stop-opacity': '0.05' }));
    rg.appendChild(mk('stop', { offset: '100%', 'stop-color': 'var(--amber)', 'stop-opacity': '0' }));
    defs.appendChild(rg); svg.insertBefore(defs, gBack);
    var glow = mk('ellipse', { cx: 540, cy: 642, rx: 250, ry: 54, fill: 'url(#bpGlow)' });
    gBack.appendChild(glow);
    heroAnims.push({ el: glow, kind: 'fade', delay: 0.2, dur: 0.9 });

    /* ---- distant skyline (faint, depth) ---- */
    function farTower(x, w, top, op) {
      line(gBack, x, gy, x, top, 1, op);
      line(gBack, x + w, gy, x + w, top, 1, op);
      line(gBack, x, top, x + w, top, 1, op);
      for (var k = 1; k * 46 < gy - top; k++) line(gBack, x, top + k * 46, x + w, top + k * 46, 0.7, op * 0.7);
    }
    farTower(232, 58, 250, 0.13);
    farTower(150, 40, 372, 0.10);
    farTower(902, 60, 300, 0.10);

    /* ---- ground: perspective + baseline ---- */
    var vpx = 520, i, r;
    for (i = -6; i <= 9; i++) { var bx = 110 + i * 64; line(gFore, bx, gy, vpx + (bx - vpx) * 0.16, gy + 120, 1, 0.09); }
    for (r = 0; r < 4; r++) { var yy = gy + 16 + r * 28 * (1 - r * 0.12); line(gFore, 60, yy, 968, yy, 1, 0.075); }
    line(gFore, 60, gy, 968, gy, 1.2, 0.5); // strong baseline (ground line)

    /* ---- main building: tall slim tower, two-point perspective (under construction) ---- */
    var fx0 = 418, fx1 = 660, fyTop = 130, fyBot = gy;   // outer silhouette bounds — callout anchors rely on these (also in setupHeroScan)
    var xL = fx0, xR = fx1, xN = 505;                    // left edge / right edge / near (closest) corner, left-of-centre for a dynamic 3/4 tilt
    var lTop = 144, lBot = 632, nTop = 80, nBot = 656, rTop = 120, rBot = 640;
    var FL = 12, i, t, j;
    var gBldg = mk('g', { id: 'bp-bldg', transform: 'translate(1078 0) scale(-1 1)' }); gMain.appendChild(gBldg); // horizontal mirror about x=539 (building only; text/cranes/callouts untouched)
    function lp(a, bb, k) { return a + (bb - a) * k; }
    function yL(k) { return lp(lBot, lTop, k); }
    function yN(k) { return lp(nBot, nTop, k); }
    function yR(k) { return lp(rBot, rTop, k); }

    // floor framing (light) + slab edges; top 2 floors left open (under construction)
    for (i = 1; i < FL; i++) {
      t = i / FL;
      line(gBldg, xL, yL(t), xN, yN(t), 0.9, 0.42);
      line(gBldg, xN, yN(t), xR, yR(t), 0.9, 0.42);
      if (i >= 2 && i < FL - 2) {
        line(gBldg, xL, yL(t) + 4, xN, yN(t) + 4, 0.6, 0.16);
        line(gBldg, xN, yN(t) + 4, xR, yR(t) + 4, 0.6, 0.16);
      }
    }
    // columns on each face (medium weight)
    [0.34, 0.68].forEach(function (u) {
      var xa = lp(xL, xN, u); line(gBldg, xa, lp(lBot, nBot, u), xa, lp(lTop, nTop, u), 0.8, 0.4);
    });
    [0.28, 0.55, 0.82].forEach(function (u) {
      var xb = lp(xN, xR, u); line(gBldg, xb, lp(nBot, rBot, u), xb, lp(nTop, rTop, u), 0.8, 0.4);
    });
    // faint glazing mullions on completed floors
    for (i = 2; i < FL - 1; i++) {
      t = i / FL; var tn = (i + 1) / FL;
      var ma = lp(xL, xN, 0.5); line(gBldg, ma, lp(yL(t), yN(t), 0.5), ma, lp(yL(tn), yN(tn), 0.5), 0.5, 0.12);
      var mb = lp(xN, xR, 0.45); line(gBldg, mb, lp(yN(t), yR(t), 0.45), mb, lp(yN(tn), yR(tn), 0.45), 0.5, 0.12);
    }
    // diagonal bracing on the larger right face, mid-height
    for (i = 3; i <= 6; i++) {
      t = i / FL; var tn2 = (i + 1) / FL;
      line(gBldg, lp(xN, xR, 0.0), lp(yN(t), yR(t), 0.0), lp(xN, xR, 0.55), lp(yN(tn2), yR(tn2), 0.55), 0.6, 0.26);
      line(gBldg, lp(xN, xR, 0.55), lp(yN(t), yR(t), 0.55), lp(xN, xR, 0.0), lp(yN(tn2), yR(tn2), 0.0), 0.6, 0.26);
    }

    // heavy structural edges (drawn on top)
    line(gBldg, xL, lBot, xN, nBot, 1.8, 0.95);   // base front-left
    line(gBldg, xN, nBot, xR, rBot, 1.8, 0.95);   // base front-right
    line(gBldg, xL, lTop, xN, nTop, 1.7, 0.92);   // roof front-left
    line(gBldg, xN, nTop, xR, rTop, 1.7, 0.92);   // roof front-right
    line(gBldg, xL, lTop, xL, lBot, 1.7, 0.9);    // left silhouette (callout edge)
    line(gBldg, xR, rTop, xR, rBot, 1.7, 0.9);    // right silhouette (callout edge)
    line(gBldg, xN, nTop, xN, nBot, 2.2, 1);      // near corner (heaviest)

    // setback crown above the near corner
    var swL = lp(xL, xN, 0.30), swR = lp(xN, xR, 0.60), sTopY = 44;
    var swLb = lp(yL(1), yN(1), 0.30), swRb = lp(yN(1), yR(1), 0.60);
    line(gBldg, swL, swLb, swL, sTopY + 20, 1.2, 0.72);
    line(gBldg, xN, yN(1), xN, sTopY, 1.5, 0.88);
    line(gBldg, swR, swRb, swR, sTopY + 12, 1.2, 0.72);
    line(gBldg, swL, sTopY + 20, xN, sTopY, 1.2, 0.7);
    line(gBldg, xN, sTopY, swR, sTopY + 12, 1.2, 0.7);
    for (j = 1; j <= 2; j++) { var sk = j / 3; line(gBldg, lp(swL, xN, sk), lp(swLb, sTopY, sk), lp(xN, swR, sk), lp(sTopY, sTopY + 12, sk), 0.7, 0.3); }

    // lift / stair core rising highest
    line(gBldg, xN - 17, sTopY + 8, xN - 17, 18, 1.2, 0.7);
    line(gBldg, xN + 13, sTopY + 4, xN + 13, 14, 1.2, 0.7);
    line(gBldg, xN - 17, 18, xN + 13, 14, 1.2, 0.7);
    line(gBldg, xN - 17, sTopY + 8, xN + 13, sTopY + 4, 0.8, 0.4);

    // nodes on key corners
    node(gBldg, xN, nTop, 2.6); node(gBldg, xN, nBot, 2.4);
    node(gBldg, xL, lBot, 2.2); node(gBldg, xR, rBot, 2.2);
    node(gBldg, xL, lTop, 2.0); node(gBldg, xR, rTop, 2.0);

    /* ---- reflection stubs below baseline ---- */
    [xL, xN, xR].forEach(function (x) { line(gBldg, x, gy, x, gy + 24, 1, 0.12); });

    /* ---- scaffolding (multi-lift, left face) ---- */
    var scOut = xL - 26, sl, lifts = 9, scTop = 226;
    line(gBldg, scOut, scTop, scOut, lBot, 1, 0.42);           // outer standard
    line(gBldg, scOut - 13, scTop, scOut - 13, lBot, 1, 0.3);  // inner standard
    for (sl = 0; sl <= lifts; sl++) {
      var ly = lp(scTop, lBot, sl / lifts);
      line(gBldg, scOut - 13, ly, scOut, ly, 0.9, 0.34);       // ledger
      line(gBldg, scOut, ly, xL, ly, 0.7, 0.18);               // transom tie to facade
      if (sl < lifts) line(gBldg, scOut - 13, ly, scOut, lp(scTop, lBot, (sl + 1) / lifts), 0.6, 0.16); // brace
    }
    line(gBldg, scOut - 13, scTop - 9, scOut, scTop - 9, 0.8, 0.4);   // top guardrail
    line(gBldg, scOut - 19, lBot, scOut - 7, lBot, 1, 0.4);           // base plate
    path(gBldg, 'M ' + (scOut - 25) + ' ' + (scTop + 150) + ' l 12 0 l 0 20 l -12 0 z', 0.9, 0.45); // material hoist car

    /* ---- tower crane (mast + jib + counter-jib) ---- */
    var mx = 812, ml;
    line(gMain, mx, fyBot, mx, 92, 2, 1);
    line(gMain, mx + 16, fyBot, mx + 16, 92, 1, 0.45);
    for (ml = 0; ml < 16; ml++) { var my0 = 92 + ml * (fyBot - 92) / 16, my1 = 92 + (ml + 1) * (fyBot - 92) / 16; line(gMain, mx, my0, mx + 16, my1, 0.7, 0.22); line(gMain, mx + 16, my0, mx, my1, 0.7, 0.22); line(gMain, mx, my0, mx + 16, my0, 0.7, 0.2); }
    path(gMain, 'M ' + (mx - 4) + ' 92 l 24 0 l 0 22 l -24 0 z', 1.1, 0.8);
    var jibY = 80, jibTip = 452, jl;
    line(gMain, mx + 8, jibY, jibTip, jibY, 1.8, 1);
    line(gMain, mx + 8, jibY - 16, jibTip + 14, jibY, 1.1, 0.7);
    for (jl = 0; jl <= 9; jl++) { var jx = jibTip + (mx + 8 - jibTip) * jl / 9, topY = jibY - 16 * (jx - jibTip) / (mx + 8 - jibTip); line(gMain, jx, jibY, jx, topY, 0.7, 0.3); }
    var cjTip = 928, cl;
    line(gMain, mx + 8, jibY, cjTip, jibY + 6, 1.4, 0.9);
    line(gMain, mx + 8, jibY - 14, cjTip - 8, jibY - 2, 1, 0.55);
    for (cl = 0; cl <= 4; cl++) { var cx2 = (mx + 8) + (cjTip - mx - 8) * cl / 4; line(gMain, cx2, jibY + 6 * cl / 4, cx2, jibY - 14 + 12 * cl / 4, 0.7, 0.3); }
    path(gMain, 'M ' + (cjTip - 34) + ' ' + (jibY + 6) + ' l 30 0 l 0 30 l -30 0 z', 1.2, 0.85);
    line(gMain, mx + 8, jibY - 16, mx + 8, 40, 1, 0.6);
    line(gMain, mx + 8, 40, jibTip + 80, jibY - 2, 0.9, 0.45);
    line(gMain, mx + 8, 40, cjTip - 60, jibY - 6, 0.9, 0.45);
    // hook in its own group (sways)
    var gHook = mk('g', { id: 'bp-hook' }); gMain.appendChild(gHook);
    var hkx = 540;
    line(gHook, hkx, jibY, hkx, 322, 1, 0.8);
    path(gHook, 'M ' + (hkx - 8) + ' 322 l 16 0 l 0 14 l -16 0 z', 1, 0.8);
    line(gHook, hkx, 336, hkx, 350, 1, 0.7);
    // load pulse travelling down the hoist cable
    var pulse = mk('circle', { cx: hkx, cy: jibY, r: 2.8, fill: 'var(--amber)', 'fill-opacity': 0.95 });
    gHook.appendChild(pulse); heroPulse = pulse;
    node(gMain, mx + 8, jibY, 2.6); node(gMain, jibTip, jibY, 2.4);

    /* ---- foreground mobile crane ---- */
    var bcx = 150, bcy = 608;
    path(gFore, 'M ' + (bcx - 26) + ' ' + bcy + ' l 52 0 l -8 -26 l -36 0 z', 1.1, 0.75);
    line(gFore, bcx - 22, bcy, bcx - 22, bcy + 14, 1, 0.5);
    line(gFore, bcx + 22, bcy, bcx + 22, bcy + 14, 1, 0.5);
    gFore.appendChild(mk('circle', { cx: bcx - 14, cy: bcy + 16, r: 8, fill: 'none', stroke: 'var(--amber)', 'stroke-width': 1, 'stroke-opacity': 0.5 }));
    gFore.appendChild(mk('circle', { cx: bcx + 14, cy: bcy + 16, r: 8, fill: 'none', stroke: 'var(--amber)', 'stroke-width': 1, 'stroke-opacity': 0.5 }));
    line(gFore, bcx, bcy - 22, bcx + 150, bcy - 150, 2, 0.95);
    line(gFore, bcx, bcy - 22, bcx + 8, bcy - 30, 1, 0.5);
    line(gFore, bcx + 150, bcy - 150, bcx + 150, bcy - 96, 1, 0.7);
    path(gFore, 'M ' + (bcx + 144) + ' ' + (bcy - 96) + ' l 12 0 l 0 10 l -12 0 z', 1, 0.7);
    line(gFore, bcx - 30, bcy - 22, bcx + 30, bcy - 22, 1.2, 0.6);
    node(gFore, bcx, bcy - 22, 2.4);

    /* ---- dimension annotations + surveyor marks (technical authenticity) ---- */
    var dlx = 330;
    line(gAnno, dlx, fyTop, dlx, fyBot, 0.9, 0.4);
    path(gAnno, 'M ' + dlx + ' ' + (fyTop + 9) + ' l -4 9 l 8 0 z', 0.8, 0.55);
    path(gAnno, 'M ' + dlx + ' ' + (fyBot - 9) + ' l -4 -9 l 8 0 z', 0.8, 0.55);
    line(gAnno, dlx - 6, fyTop, dlx + 6, fyTop, 0.8, 0.4);
    line(gAnno, dlx - 6, fyBot, dlx + 6, fyBot, 0.8, 0.4);
    text(gAnno, dlx - 10, (fyTop + fyBot) / 2, 'H 42.00', 12, 0.55, 'middle', -90);
    // top width dim
    var tdy = fyTop - 26;
    line(gAnno, fx0, tdy, fx1, tdy, 0.9, 0.4);
    line(gAnno, fx0, tdy - 6, fx0, tdy + 6, 0.8, 0.4);
    line(gAnno, fx1, tdy - 6, fx1, tdy + 6, 0.8, 0.4);
    text(gAnno, (fx0 + fx1) / 2, tdy - 8, 'B 28.40', 12, 0.55, 'middle');
    // labels
    text(gAnno, fx0, fyBot + 22, 'GL  \u00b10.00', 11, 0.45);
    text(gAnno, 60, 132, 'SECTION  A\u2013A', 12, 0.5);
    text(gAnno, 968, gy + 40, 'SCALE 1:200', 11, 0.4, 'end');
    cross(gAnno, fx1 + 40, fyBot - 8, 6, 0.4);
    cross(gAnno, fx0 - 60, 220, 6, 0.35);
    cross(gAnno, 760, 470, 5, 0.3);

    parallaxLayers = [gBack, gAnno, gMain, gFore];
    hookGroup = gHook;
  }
  var parallaxLayers = [], hookGroup = null, heroPulse = null;

  /* ---------------- Hero "estimating scan" engine ----------------
     A single rAF clock drives: a beam that rises up the blueprint reading the
     structure, AI price tags (✦) that pop onto each element as the beam passes,
     pulse rings on structural nodes, the crane hook sway + load pulse, and a HUD
     that counts the offer value up. Purely additive over the always-visible
     building; a timer fallback forces the finished state if rAF is frozen. */
  /* ---------------- Tolerance: uncertainty as a material property ----------------
     Every line of the building being estimated is born inside a hatched ± envelope —
     the band the true geometry has not settled into yet. As the survey beam passes an
     element, that element's envelope collapses onto its line. It never collapses
     completely: the topmost ~13% of the structure (the façade, the least certain thing
     in any real takeoff) stays in tolerance forever. So the HUD's "87% confidence" and
     the drawing's line quality are the same fact, read two ways.

     Scoped to #bp-bldg only — you take off the building, not the cranes, the ground
     plane or the annotations. That keeps the paint cost bounded on the LCP fold. */
  var TOL_CONFIDENCE = 0.87;
  function setupTolerance() {
    var bldg = document.getElementById('bp-bldg');
    if (!bldg || typeof bldg.getBBox !== 'function') return null;
    var src = [].slice.call(bldg.querySelectorAll('line, path')); // capture before cloning
    if (!src.length) return null;

    var gTol = mk('g', { id: 'bp-tol' });
    bldg.insertBefore(gTol, bldg.firstChild); // behind the true geometry, inside the mirror

    var ghosts = [];
    src.forEach(function (el) {
      var topOf;
      // Key on the element's TOP, not its centre: a full-height column is not certain
      // until the survey has passed its highest point. Centre-keying made long verticals
      // snap crisp while their upper half was still unsurveyed.
      try { var b = el.getBBox(); topOf = b.y; } catch (e) { return; }
      var g = el.cloneNode(false);
      g.removeAttribute('pathLength');
      var w = parseFloat(el.getAttribute('stroke-width')) || 1;
      var env = w * 3.0 + 2.0;         // the ± envelope the true line lives inside
      g.setAttribute('stroke-width', env.toFixed(2));
      g.setAttribute('stroke-opacity', '0.15');
      // No dasharray: at render scale a dashed wide stroke reads as serration across the
      // line, not as a band around it. A soft, wide, low-opacity envelope reads as "the
      // line is somewhere in here" — and dense structure blurs into unresolved mass.
      g.setAttribute('stroke-linecap', 'round');
      gTol.appendChild(g);
      ghosts.push({ el: g, y: topOf, env: env });
    });
    if (!ghosts.length) return null;

    ghosts.sort(function (a, b) { return b.y - a.y; }); // ground-up: the beam's own order
    var N = ghosts.length;
    var resolvable = Math.round(N * TOL_CONFIDENCE);    // the top (N - resolvable) never resolve

    // One composited group-opacity breathe beats N per-element paint animations.
    if (gTol.animate) {
      try {
        gTol.animate([{ opacity: 0.66 }, { opacity: 1 }, { opacity: 0.66 }],
          { duration: 3200, iterations: Infinity, easing: 'ease-in-out' });
      } catch (e) {}
    }

    var ptr = 0, resolved = 0;
    function collapse(gh) {
      resolved++;
      if (gh.el.animate) {
        try {
          gh.el.animate([{ strokeWidth: String(gh.env), strokeOpacity: 0.15 },
                         { strokeWidth: '0', strokeOpacity: 0 }],
            { duration: 560, easing: EASE, fill: 'forwards' });
          return;
        } catch (e) {}
      }
      gh.el.setAttribute('stroke-opacity', '0');
    }
    return {
      total: N,
      // Ghosts are sorted along the beam's path, so this is amortised O(1) per frame.
      onBeam: function (scanY) {
        while (ptr < N && scanY <= ghosts[ptr].y) {
          var gh = ghosts[ptr++];
          if (ptr > resolvable) continue; // the façade keeps its tolerance
          collapse(gh);
        }
      },
      // The beam retires at topY, but a little geometry sits above it. When the survey
      // completes, resolve everything the survey was meant to resolve — otherwise the
      // confidence figure under-fills and stops matching the drawing.
      //
      // Then PROMOTE the residual. Once the other 87% has snapped crisp, sixteen thin
      // ghosts are far too faint to read, and an unreadable 13% turns the confidence
      // figure back into a claim. The façade that never resolved becomes a visibly
      // hatched tolerance band — a provisional line, which is what it is.
      finish: function () {
        while (ptr < resolvable) collapse(ghosts[ptr++]);
        for (var i = resolvable; i < N; i++) {
          var r = ghosts[i];
          r.el.setAttribute('stroke-dasharray', '2.4 3.6');
          if (r.el.animate) {
            try {
              r.el.animate([{ strokeOpacity: 0.15 }, { strokeOpacity: 0.38 }],
                { duration: 900, easing: EASE, fill: 'forwards' });
              continue;
            } catch (e) {}
          }
          r.el.setAttribute('stroke-opacity', '0.38');
        }
      },
      confidence: function () { return Math.round(resolved / N * 100); }
    };
  }

  function setupHeroScan() {
    var svg = document.getElementById('hero-bp');
    if (!svg || reduce) return; // reduced motion: no scan, no ghosts — a crisp, resolved drawing
    var NS = SVGNS;
    var tol = setupTolerance();
    var gy = 640, fx0 = 418, fx1 = 660, topY = 142;
    var scanSpan = gy - topY;

    var gScan = mk('g', { id: 'bp-scan' });
    svg.appendChild(gScan); // top-most layer

    // soft glow band + bright beam line
    var bandGrad = svg.querySelector('#scanGrad');
    if (!bandGrad) {
      var defs = svg.querySelector('defs') || svg.insertBefore(mk('defs', {}), svg.firstChild);
      var lg = mk('linearGradient', { id: 'scanGrad', x1: '0', y1: '0', x2: '0', y2: '1' });
      lg.appendChild(mk('stop', { offset: '0%', 'stop-color': 'var(--amber)', 'stop-opacity': '0' }));
      lg.appendChild(mk('stop', { offset: '55%', 'stop-color': 'var(--amber)', 'stop-opacity': '0.16' }));
      lg.appendChild(mk('stop', { offset: '100%', 'stop-color': 'var(--amber)', 'stop-opacity': '0' }));
      defs.appendChild(lg);
    }
    var bx0 = fx0 - 60, bx1 = fx1 + 200, bw = bx1 - bx0;
    var band = mk('rect', { x: bx0, width: bw, height: 64, fill: 'url(#scanGrad)', opacity: 0 });
    var beam = mk('line', { x1: bx0, x2: bx1, stroke: 'var(--amber)', 'stroke-width': 1.4, 'stroke-opacity': 0, 'stroke-linecap': 'round' });
    var beamTickL = mk('line', { stroke: 'var(--amber)', 'stroke-width': 2, 'stroke-opacity': 0 });
    var beamTickR = mk('line', { stroke: 'var(--amber)', 'stroke-width': 2, 'stroke-opacity': 0 });
    gScan.appendChild(band); gScan.appendChild(beam); gScan.appendChild(beamTickL); gScan.appendChild(beamTickR);

    // pulse rings on structural nodes (fire as beam passes their height)
    var nodeYs = [];
    for (var f = 0; f <= 10; f++) { var yy = 124 + (640 - 124) * f / 10; nodeYs.push({ x: fx1, y: yy, fired: false }); nodeYs.push({ x: fx0, y: yy, fired: false }); }
    var rings = [];
    function spawnRing(x, y) {
      var c = mk('circle', { cx: x, cy: y, r: 2, fill: 'none', stroke: 'var(--amber)', 'stroke-width': 1.4, 'stroke-opacity': 0.9 });
      gScan.appendChild(c); rings.push({ el: c, t: 0 });
    }

    // AI price tags that pop on as the beam passes — the estimating story
    var chipDefs = [
      { ay: 566, side: 'r', label: 'Earthworks',         price: '€15 / m³' },
      { ay: 452, side: 'l', label: 'Concrete C25/30',     price: '€170 / m³' },
      { ay: 330, side: 'r', label: 'Reinf. steel B500B',  price: '€1,500 / t' },
      { ay: 224, side: 'l', label: 'Façade system',       price: '€280 / m²' }
    ];
    var chips = chipDefs.map(function (d) {
      var W = 172, H = 40, anchorX = d.side === 'r' ? fx1 : fx0;
      var boxX = d.side === 'r' ? anchorX + 30 : anchorX - 30 - W;
      var leadX2 = d.side === 'r' ? boxX : boxX + W;
      var g = mk('g', { opacity: 0 });
      var lead = mk('line', { x1: anchorX, y1: d.ay, x2: leadX2, y2: d.ay, stroke: 'var(--amber)', 'stroke-width': 1, 'stroke-opacity': 0.7 });
      var dot = mk('circle', { cx: anchorX, cy: d.ay, r: 3, fill: 'var(--amber)' });
      var box = mk('rect', { x: boxX, y: d.ay - H / 2, width: W, height: H, rx: 9, fill: 'rgba(10,16,32,0.9)', stroke: 'var(--amber)', 'stroke-opacity': 0.55, 'stroke-width': 1 });
      var spk = mk('text', { x: boxX + 13, y: d.ay - 4, fill: 'var(--amber)', 'font-family': 'IBM Plex Mono, monospace', 'font-size': 12 }); spk.textContent = '✦';
      var lab = mk('text', { x: boxX + 27, y: d.ay - 3, fill: '#EEF2FA', 'font-family': 'IBM Plex Sans, sans-serif', 'font-size': 12.5, 'font-weight': 600 }); lab.textContent = d.label;
      var pr = mk('text', { x: boxX + 27, y: d.ay + 13, fill: 'var(--amber)', 'font-family': 'IBM Plex Mono, monospace', 'font-size': 11.5, 'letter-spacing': '0.02em' }); pr.textContent = d.price;
      g.appendChild(lead); g.appendChild(dot); g.appendChild(box); g.appendChild(spk); g.appendChild(lab); g.appendChild(pr);
      gScan.appendChild(g);
      return { g: g, ay: d.ay, on: 0 };
    });

    // HUD elements
    var hud = document.querySelector('.hero-hud');
    var hudNum = document.getElementById('hud-num');
    var hudFill = document.getElementById('hud-fill');
    var hudStatus = document.getElementById('hud-status');
    var hudConf = document.getElementById('hud-conf');
    var TOTAL = 1.24;

    // This script has no i18n access, so Hero.astro hands the localized HUD copy in on
    // data-* attributes (the pattern DemoForm uses for validation messages). English
    // fallbacks keep the readout sane if the attributes ever go missing.
    var TXT_ANALYZING = (hud && hud.getAttribute('data-analyzing')) || 'Analyzing structure';
    var TXT_READY = (hud && hud.getAttribute('data-ready')) || 'Estimate ready';
    var TXT_CONF = (hud && hud.getAttribute('data-confidence')) || '{pct}% confidence';
    function confText(pct) { return '✦ ' + TXT_CONF.replace('{pct}', pct); }

    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
    function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

    var T = 6400, ranOnce = false, start = null, tolDone = false;
    function frame(now) {
      ranOnce = true;
      if (start == null) start = now;
      // One pass, then settle. This clock used to loop forever, so the fold never came
      // to rest. The survey now completes once and the residual tolerance — the 13% the
      // envelope never gives up — is what you are left looking at.
      var c = clamp01((now - start) / T);
      var rise = clamp01(c / 0.78);
      var er = easeOut(rise);
      var scanY = gy - er * scanSpan;

      // beam + band — the beam retires once its pass is done; the drawing stays
      var beamLit = c < 0.80 ? 1 : clamp01(1 - (c - 0.80) / 0.20);
      beam.setAttribute('y1', scanY); beam.setAttribute('y2', scanY);
      beam.setAttribute('stroke-opacity', (0.9 * beamLit).toFixed(3));
      band.setAttribute('y', scanY - 56); band.setAttribute('opacity', (beamLit).toFixed(3));
      beamTickL.setAttribute('x1', bx0); beamTickL.setAttribute('x2', bx0); beamTickL.setAttribute('y1', scanY - 6); beamTickL.setAttribute('y2', scanY + 6); beamTickL.setAttribute('stroke-opacity', (0.9 * beamLit).toFixed(3));
      beamTickR.setAttribute('x1', bx1); beamTickR.setAttribute('x2', bx1); beamTickR.setAttribute('y1', scanY - 6); beamTickR.setAttribute('y2', scanY + 6); beamTickR.setAttribute('stroke-opacity', (0.9 * beamLit).toFixed(3));

      // node rings
      for (var i = 0; i < nodeYs.length; i++) {
        var n = nodeYs[i];
        if (!n.fired && scanY <= n.y) { n.fired = true; spawnRing(n.x, n.y); }
      }
      for (var r = rings.length - 1; r >= 0; r--) {
        var rg = rings[r]; rg.t += 0.045;
        if (rg.t >= 1) { rg.el.remove(); rings.splice(r, 1); continue; }
        rg.el.setAttribute('r', (2 + rg.t * 16).toFixed(1));
        rg.el.setAttribute('stroke-opacity', (0.9 * (1 - rg.t)).toFixed(3));
      }

      // chips pop on as the beam passes and stay — the estimate is not undone
      chips.forEach(function (ch) {
        var target = scanY <= ch.ay ? 1 : 0;
        ch.on += (target - ch.on) * 0.16;
        ch.g.setAttribute('opacity', ch.on.toFixed(3));
      });

      // collapse each element's tolerance envelope as the beam passes it
      if (tol) { tol.onBeam(scanY); if (rise >= 0.999 && !tolDone) { tolDone = true; tol.finish(); } }

      // HUD readout. The confidence figure is not decoration: it is the share of the
      // structure whose tolerance envelope has collapsed. The number and the drawing
      // are the same measurement.
      var val = er * TOTAL;
      if (hudNum) hudNum.textContent = val.toFixed(2);
      if (hudFill) hudFill.style.width = (er * 100).toFixed(1) + '%';
      var introEnv = clamp01((now - start) / 520);
      if (hud) hud.style.opacity = introEnv.toFixed(3);
      if (hudStatus) hudStatus.textContent = rise < 0.995 ? TXT_ANALYZING : TXT_READY;
      if (hudConf) {
        hudConf.style.opacity = rise > 0.5 ? '1' : '0';
        if (tol) hudConf.textContent = confText(tol.confidence());
      }

      // crane hook sway + load pulse (folded into the same clock)
      if (hookGroup) {
        var sway = Math.sin(now / 1400) * 3;
        hookGroup.setAttribute('transform', 'translate(' + sway.toFixed(2) + ' 0) rotate(' + (sway * 0.18).toFixed(2) + ' 540 80)');
      }
      if (heroPulse) {
        var pc = ((now / 2600) % 1);
        var py = easeOut(clamp01(pc / 0.9));
        heroPulse.setAttribute('transform', 'translate(0 ' + (py * 236).toFixed(1) + ')');
        heroPulse.setAttribute('opacity', (pc < 0.08 ? pc / 0.08 : pc > 0.92 ? (1 - pc) / 0.08 : 1).toFixed(2));
      }

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    // static fallback if rAF never advances (frozen-timeline preview): show finished estimate
    setTimeout(function () {
      if (ranOnce) return;
      chips.forEach(function (ch) { ch.g.setAttribute('opacity', '1'); });
      if (tol) { tol.finish(); if (hudConf) hudConf.textContent = confText(tol.confidence()); }
      if (hudStatus) hudStatus.textContent = TXT_READY;
      if (hud) hud.style.opacity = '1';
      if (hudConf) hudConf.style.opacity = '1';
      if (hudFill) hudFill.style.width = '100%';
    }, 700);
  }

  function setupHeroMotion() {
    if (reduce) return;
    // pointer + scroll parallax
    var hero = document.querySelector('.hero');
    if (!hero || !parallaxLayers.length) return;
    var raf = 0, tx = 0, ty = 0;
    function apply() {
      raf = 0;
      var sp = Math.min(1.2, (window.scrollY || 0) / (hero.offsetHeight || 800));
      parallaxLayers.forEach(function (g) {
        var d = parseFloat(g.getAttribute('data-depth')) || 0.5;
        var px = tx * d, py = ty * d - sp * 70 * d; // scroll drifts nearer layers up faster
        g.setAttribute('transform', 'translate(' + px.toFixed(1) + ' ' + py.toFixed(1) + ')');
      });
    }
    function queue() { if (!raf) raf = requestAnimationFrame(apply); }
    hero.addEventListener('pointermove', function (e) {
      if (window.innerWidth < 920) return;
      var rct = hero.getBoundingClientRect();
      tx = ((e.clientX - rct.left) / rct.width - 0.5) * 26;
      ty = ((e.clientY - rct.top) / rct.height - 0.5) * 16;
      queue();
    });
    hero.addEventListener('pointerleave', function () { tx = 0; ty = 0; queue(); });
    window.addEventListener('scroll', queue, { passive: true });
  }

  function animateHero() {
    heroAnims.forEach(function (a) {
      if (!a.el.animate) return; // no WAAPI -> stays visible
      try {
        if (a.kind === 'draw') {
          a.el.style.strokeDasharray = '1';
          a.el.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }],
            { duration: a.dur * 1000, delay: a.delay * 1000, easing: EASE, fill: 'both' })
            .onfinish = function () { a.el.style.strokeDasharray = ''; a.el.style.strokeDashoffset = ''; };
        } else {
          a.el.animate([{ opacity: 0 }, { opacity: 1 }],
            { duration: a.dur * 1000, delay: a.delay * 1000, easing: 'ease', fill: 'both' });
        }
      } catch (e) {}
    });
  }

  /* ---------------- Header solid on scroll + progress + scrollspy ---------------- */
  var hdr = document.querySelector('.hdr');
  var progress = document.querySelector('.scroll-progress');
  var navLinks = [].slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  var spyTargets = navLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  var heroScroll = document.querySelector('.hero-scroll');
  var scrollTicking = false;
  function applyScroll() {
    scrollTicking = false;
    var y = window.scrollY || window.pageYOffset;
    var vh = window.innerHeight;
    // ---- reads first: batch all layout reads before any write so a scroll
    //      tick no longer forces two synchronous reflows (read-after-write). ----
    var docH = document.documentElement.scrollHeight;
    var mid = y + vh * 0.35, active = -1;
    for (var i = 0; i < spyTargets.length; i++) {
      var t = spyTargets[i];
      if (t && t.offsetTop <= mid) active = i;
    }
    // ---- writes ----
    if (hdr) hdr.classList.toggle('solid', y > 40);
    if (progress) {
      var h = docH - vh;
      progress.style.width = (h > 0 ? Math.min(100, (y / h) * 100) : 0) + '%';
    }
    navLinks.forEach(function (a, i) { var on = i === active; a.classList.toggle('active', on); if (on) { a.setAttribute('aria-current', 'true'); } else { a.removeAttribute('aria-current'); } });
    if (heroScroll) heroScroll.style.opacity = Math.max(0, 1 - y / 220);
  }
  // rAF-coalesce: at most one layout pass per frame instead of per scroll event.
  function onScroll() { if (!scrollTicking) { scrollTicking = true; requestAnimationFrame(applyScroll); } }
  window.addEventListener('scroll', onScroll, { passive: true }); applyScroll();

  /* ---------------- Mobile menu ---------------- */
  var mb = document.querySelector('.menu-btn'), mn = document.querySelector('.mobile-nav');
  if (mb && mn) {
    mb.addEventListener('click', function () { mn.classList.toggle('open'); });
    mn.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { mn.classList.remove('open'); }); });
  }

  /* ---------------- Scroll reveals (no IntersectionObserver) ---------------- */
  var reveals = [].slice.call(document.querySelectorAll('.reveal, [data-stagger]'));
  function revealCheck() {
    var vh = window.innerHeight || docEl.clientHeight;
    for (var i = reveals.length - 1; i >= 0; i--) {
      var n = reveals[i];
      var rct = n.getBoundingClientRect();
      if (rct.top < vh * 0.92 && rct.bottom > 0) {
        if (n.hasAttribute('data-stagger')) {
          var kids = n.children, j = 0;
          [].forEach.call(kids, function (k) { k.style.transitionDelay = (reduce ? 0 : j * 0.07) + 's'; j++; });
        }
        n.classList.add('in');
        reveals.splice(i, 1);
      }
    }
  }
  window.addEventListener('scroll', revealCheck, { passive: true });
  window.addEventListener('resize', revealCheck);

  /* ---------------- Capability annotations: clone for mobile + connectors ---------------- */
  function setupCaps() {
    document.querySelectorAll('.cap-annot').forEach(function (cap) {
      var mob = cap.parentElement.querySelector('.mobile-ann:not([data-static])');
      if (mob && !mob.dataset.filled) {
        cap.querySelectorAll('.rail .ann').forEach(function (a) { mob.appendChild(a.cloneNode(true)); });
        mob.dataset.filled = '1';
      }
    });
    drawConnectors();
  }
  function drawConnectors() {
    var wide = window.innerWidth > 1000;
    document.querySelectorAll('.cap-annot').forEach(function (cap) {
      var svg = cap.querySelector('.conns'), shot = cap.querySelector('.shot');
      if (!svg || !shot) return;
      var shotImg = shot.querySelector('img') || shot;
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      if (!wide) return;
      var cr = cap.getBoundingClientRect(), sr = shotImg.getBoundingClientRect();
      svg.setAttribute('viewBox', '0 0 ' + cr.width + ' ' + cr.height);
      svg.setAttribute('width', cr.width); svg.setAttribute('height', cr.height);
      cap.querySelectorAll('.ann[data-ax]').forEach(function (ann) {
        var ar = ann.getBoundingClientRect();
        var side = ann.getAttribute('data-side') || 'left';
        var color = ann.getAttribute('data-color') || 'var(--amber)';
        var ax = parseFloat(ann.getAttribute('data-ax')), ay = parseFloat(ann.getAttribute('data-ay'));
        var sx = (side === 'left' ? ar.right : ar.left) - cr.left;
        var sy = (ar.top + ar.height / 2) - cr.top;
        var ex = (sr.left + ax * sr.width) - cr.left;
        var ey = (sr.top + ay * sr.height) - cr.top;
        var midx = sx + (ex - sx) * 0.55;
        var d = 'M ' + sx + ' ' + sy + ' C ' + midx + ' ' + sy + ', ' + midx + ' ' + ey + ', ' + ex + ' ' + ey;
        svg.appendChild(mk('path', { d: d, fill: 'none', stroke: color, 'stroke-width': 1.5, 'stroke-opacity': 0.9 }));
        svg.appendChild(mk('circle', { cx: ex, cy: ey, r: 3.5, fill: color }));
        svg.appendChild(mk('circle', { cx: sx, cy: sy, r: 2.5, fill: color }));
      });
    });
  }
  var rt;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { drawConnectors(); drawCap2(); }, 120); });

  /* ---------------- Capability 2: callout connectors to live panel elements ---------------- */
  function drawCap2() {
    var stage = document.querySelector('.cap2-stage');
    if (!stage) return;
    var svg = stage.querySelector('.cap2-conns');
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    if (window.innerWidth <= 1000) return;
    var NS = 'http://www.w3.org/2000/svg';
    var sr = stage.getBoundingClientRect();
    svg.setAttribute('viewBox', '0 0 ' + sr.width + ' ' + sr.height);
    svg.setAttribute('width', sr.width); svg.setAttribute('height', sr.height);
    stage.querySelectorAll('.c2card[data-target]').forEach(function (card) {
      var tgt = stage.querySelector(card.getAttribute('data-target'));
      if (!tgt) return;
      var side = card.getAttribute('data-side');
      var cr = card.getBoundingClientRect(), tr = tgt.getBoundingClientRect();
      var sx = (side === 'left' ? cr.right : cr.left) - sr.left;
      var sy = (cr.top + cr.height / 2) - sr.top;
      var ty = parseFloat(card.getAttribute('data-ty')); if (isNaN(ty)) ty = 0.5;
      var ex = (side === 'left' ? tr.left : tr.right) - sr.left;
      var ey = (tr.top + tr.height * ty) - sr.top;
      var d;
      if (card.hasAttribute('data-low')) {
        // bow the line downward through the middle (clears content above), rising back to the fixed endpoint
        var sag = parseFloat(card.getAttribute('data-sag')) || 22;
        var c1x = sx + (ex - sx) * 0.22, c2x = sx + (ex - sx) * 0.72;
        d = 'M ' + sx + ' ' + sy + ' C ' + c1x + ' ' + (ey + sag) + ', ' + c2x + ' ' + (ey + sag) + ', ' + ex + ' ' + ey;
      } else {
        var midx = sx + (ex - sx) * 0.5;
        d = 'M ' + sx + ' ' + sy + ' C ' + midx + ' ' + sy + ', ' + midx + ' ' + ey + ', ' + ex + ' ' + ey;
      }
      function n(name, attrs) { var e = document.createElementNS(NS, name); for (var k in attrs) e.setAttribute(k, attrs[k]); return e; }
      svg.appendChild(n('path', { d: d, fill: 'none', stroke: 'var(--brand-primary)', 'stroke-width': 1.5, 'stroke-opacity': 0.85 }));
      svg.appendChild(n('circle', { cx: ex, cy: ey, r: 3.5, fill: 'var(--brand-primary)' }));
      svg.appendChild(n('circle', { cx: sx, cy: sy, r: 2.5, fill: 'var(--brand-primary)' }));
    });
  }

  /* ---------------- Demo form ---------------- */
  var form = document.getElementById('demo-form');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault(); form.style.display = 'none';
    var ok = document.querySelector('.form-ok'); if (ok) ok.classList.add('show');
  });

  /* ---------------- motion detection ----------------
     Some preview/verifier iframes freeze the animation timeline (transitions,
     keyframes & WAAPI never progress, IntersectionObserver never fires) while
     timers still run. In that case we must NOT depend on animation to reach a
     visible end-state. Probe a transition; if it doesn't advance, render static. */
  function detectMotion(cb) {
    if (reduce) { cb(false); return; }
    var p = document.createElement('div');
    p.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:4px;height:4px;opacity:0.02;transition:opacity .3s linear;pointer-events:none;';
    document.body.appendChild(p);
    p.getBoundingClientRect();
    p.style.opacity = '1';
    setTimeout(function () {
      var v = parseFloat(getComputedStyle(p).opacity);
      p.remove();
      cb(v > 0.1); // mid/after transition -> timeline advancing
    }, 130);
  }

  /* ---------------- Scale vector product screens (Capability 1) ---------------- */
  function scaleScreens() {
    document.querySelectorAll('.gv-screen').forEach(function (s) {
      var holder = s.parentElement;
      s.style.transform = 'none';
      s.style.marginLeft = '0';
      var nh = s.scrollHeight, dw = s.offsetWidth || 800; // read authored width (stays in sync with CSS)
      var scale = Math.min(1, holder.clientWidth / dw); // never upscale (keeps text crisp, avoids sub-pixel overlap)
      s.style.transform = 'scale(' + scale + ')';
      holder.style.height = Math.round(nh * scale) + 'px';
      var extra = holder.clientWidth - dw * scale;
      if (extra > 1) s.style.marginLeft = (extra / 2) + 'px'; // center within wider frame
    });
  }
  window.addEventListener('resize', scaleScreens);
  window.addEventListener('load', scaleScreens);

  /* ---------------- init ----------------
     Resting state is fully visible (CSS) and buildHero leaves all strokes at their
     natural (visible) state — no dasharray is ever pre-set. Nothing about visibility
     depends on a timer, transition, or animation completing, so a frozen/suspended
     timeline can never strand content hidden. Motion below only animates already-visible
     elements via transforms (parallax, hook sway, load pulse). */
  function init() {
    buildHero();
    setupCaps();
    scaleScreens();
    if (!reduce) { setupHeroMotion(); setupHeroScan(); }
    else {
      var hud = document.querySelector('.hero-hud');
      if (hud) hud.style.opacity = '1';
      var hc = document.getElementById('hud-conf'); if (hc) hc.style.opacity = '1';
      var hf = document.getElementById('hud-fill'); if (hf) hf.style.width = '100%';
    }
    setTimeout(drawConnectors, 160);
    setTimeout(scaleScreens, 120);
    setTimeout(drawCap2, 220);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.addEventListener('load', function () { setTimeout(function () { drawConnectors(); drawCap2(); }, 80); });
})();
