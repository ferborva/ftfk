/* ============================================================
   EL JUEGO DENTRO DEL JUEGO — app engine
   nav · language · theme · tooltips · pitch diagrams · quizzes
   ============================================================ */
(function () {
  "use strict";

  /* ---------------- chapters ---------------- */
  var CH = [
    { f: "01-acciones.html", id: "c1",
      es: { t: "El fútbol es un juego de acciones", d: "Por qué «pon más ganas» no significa nada, y qué decir en su lugar." },
      en: { t: "Football is a game of actions", d: "Why «try harder» means nothing, and what to say instead." } },
    { f: "02-mapa.html", id: "c2",
      es: { t: "El mapa del partido", d: "Atacar, defender, transición. Y las cuatro tareas que hay dentro." },
      en: { t: "The map of a match", d: "Attacking, defending, transition. And the four jobs inside them." } },
    { f: "03-transicion.html", id: "c3",
      es: { t: "Los 2 segundos que deciden todo", d: "La transición: el momento más caótico y más valioso del fútbol." },
      en: { t: "The 2 seconds that decide everything", d: "Transition: football's most chaotic and most valuable moment." } },
    { f: "04-secretos.html", id: "c4",
      es: { t: "Los 4 secretos de toda acción", d: "Posición, momento, dirección y velocidad. Todo cabe aquí." },
      en: { t: "The 4 secrets of every action", d: "Position, moment, direction and speed. Everything fits in here." } },
    { f: "05-decidir.html", id: "c5",
      es: { t: "¿No lo vi, o no me salió?", d: "La pregunta que convierte un error en una mejora." },
      en: { t: "Didn't see it, or couldn't do it?", d: "The question that turns a mistake into an improvement." } },
    { f: "06-piezas.html", id: "c6",
      es: { t: "Las 4 piezas de un jugador", d: "Comunicación, visión de juego, técnica y físico. En este orden." },
      en: { t: "The 4 pieces of a player", d: "Communication, game insight, technique and fitness. In that order." } },
    { f: "07-mejor-y-mas.html", id: "c7",
      es: { t: "Mejor, más, y hasta el final", d: "Cómo se mide de verdad tu nivel: calidad, cantidad y aguante." },
      en: { t: "Better, more, and to the end", d: "How your level is really measured: quality, quantity and staying power." } },
    { f: "08-sistemas.html", id: "c8",
      es: { t: "Todo lo que haces mueve el campo", d: "Cada acción abre puertas y cierra otras. Pensar en cadenas." },
      en: { t: "Everything you do moves the pitch", d: "Every action opens doors and shuts others. Thinking in chains." } },
    { f: "09-equipo.html", id: "c9",
      es: { t: "Primero el equipo: la intención", d: "Once buenos jugadores no son un equipo. Lo que sí lo es." },
      en: { t: "Team first: intention", d: "Eleven good players are not a team. What actually is." } },
    { f: "10-entrenar.html", id: "c10",
      es: { t: "Cómo entrenar tu cabeza", d: "Qué hacer el lunes por la tarde para ser mejor el domingo." },
      en: { t: "How to train your head", d: "What to do on a Monday afternoon to be better on Sunday." } }
  ];

  var LS = { lang: "jdj.lang", theme: "jdj.theme", read: "jdj.read" };
  var H = document.documentElement;
  var lang = H.getAttribute("data-lang") || "es";

  function get(k, dflt) { try { return localStorage.getItem(k) || dflt; } catch (e) { return dflt; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function readList() { try { return JSON.parse(get(LS.read, "[]")) || []; } catch (e) { return []; } }
  function saveRead(a) { set(LS.read, JSON.stringify(a)); }
  function tx(v) { return v == null ? "" : (typeof v === "string" ? v : (v[lang] || v.es || v.en || "")); }
  function el(t, c, h) { var n = document.createElement(t); if (c) n.className = c; if (h != null) n.innerHTML = h; return n; }

  var UI = {
    menu:      { es: "Capítulos",      en: "Chapters" },
    chapters:  { es: "Capítulos",      en: "Chapters" },
    glossary:  { es: "Glosario",       en: "Glossary" },
    home:      { es: "Inicio",         en: "Home" },
    prev:      { es: "Anterior",       en: "Previous" },
    next:      { es: "Siguiente",      en: "Next" },
    markRead:  { es: "Marcar este capítulo como leído",  en: "Mark this chapter as read" },
    isRead:    { es: "¡Capítulo leído! Buen trabajo",    en: "Chapter read! Nice work" },
    ofCh:      { es: "capítulos leídos", en: "chapters read" },
    resetP:    { es: "Reiniciar",      en: "Reset" },
    what:      { es: "¿PARA QUÉ?",     en: "WHAT FOR?" },
    startHere: { es: "Empezar por el capítulo 1", en: "Start with chapter 1" }
  };

  /* ============================================================
     1. LANGUAGE + THEME
     ============================================================ */
  function applyLang(l, save) {
    lang = l;
    H.setAttribute("data-lang", l);
    H.setAttribute("lang", l === "es" ? "es" : "en");
    if (save) set(LS.lang, l);
    document.querySelectorAll(".langsw button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.lang === l));
    });
    hideTip();
    renderAll();
    buildNav();
  }

  function applyTheme(t, save) {
    H.setAttribute("data-theme", t);
    if (save) set(LS.theme, t);
    var b = document.getElementById("themeBtn");
    if (b) {
      b.innerHTML = t === "dark"
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
      b.setAttribute("aria-label", t === "dark" ? "Light mode" : "Dark mode");
    }
  }

  /* ============================================================
     2. HEADER / DRAWER / PAGER
     ============================================================ */
  function buildNav() {
    var page = document.body.dataset.page || "";

    // drawer chapter list
    var list = document.getElementById("drawerList");
    if (list) {
      var read = readList();
      list.innerHTML = "";
      var hm = el("a", "dlink", '<em>◆</em><span>' + tx(UI.home) + "</span>");
      hm.href = "index.html";
      if (page === "home") hm.setAttribute("aria-current", "page");
      list.appendChild(hm);
      CH.forEach(function (c, i) {
        var a = el("a", "dlink" + (read.indexOf(c.id) > -1 ? " done" : ""),
          "<em>" + (i + 1) + "</em><span></span>");
        a.querySelector("span").textContent = c[lang].t;
        a.href = c.f;
        if (page === c.id) a.setAttribute("aria-current", "page");
        list.appendChild(a);
      });
      var gl = el("a", "dlink", '<em>★</em><span>' + tx(UI.glossary) + "</span>");
      gl.href = "glosario.html";
      if (page === "gloss") gl.setAttribute("aria-current", "page");
      list.appendChild(gl);
    }

    document.querySelectorAll("[data-ui]").forEach(function (n) {
      var k = n.dataset.ui; if (UI[k]) n.textContent = tx(UI[k]);
    });

    // prev / next
    var pager = document.getElementById("pager");
    if (pager) {
      var i = CH.map(function (c) { return c.id; }).indexOf(page);
      pager.innerHTML = "";
      var prev = i > 0 ? CH[i - 1] : null;
      var next = i > -1 && i < CH.length - 1 ? CH[i + 1] : null;
      if (prev) pager.appendChild(pcard(prev.f, tx(UI.prev), prev[lang].t, ""));
      else if (i === 0) pager.appendChild(pcard("index.html", tx(UI.prev), tx(UI.home), ""));
      if (next) pager.appendChild(pcard(next.f, tx(UI.next), next[lang].t, "nx"));
      else if (i === CH.length - 1) pager.appendChild(pcard("glosario.html", tx(UI.next), tx(UI.glossary), "nx"));
    }

    // home grid
    var grid = document.getElementById("homeGrid");
    if (grid) {
      var rd = readList();
      grid.innerHTML = "";
      CH.forEach(function (c, i) {
        var a = el("a", "card" + (rd.indexOf(c.id) > -1 ? " done" : ""));
        a.href = c.f;
        a.innerHTML = '<span class="n">' + (i + 1) + "</span><span><h3></h3><p></p></span><span class='tick'>✓</span>";
        a.querySelector("h3").textContent = c[lang].t;
        a.querySelector("p").textContent = c[lang].d;
        grid.appendChild(a);
      });
      updateReadout();
    }
    updateReadBtn();
  }

  function pcard(href, kicker, title, cls) {
    var a = el("a", cls); a.href = href;
    a.innerHTML = "<small></small><b></b>";
    a.querySelector("small").textContent = (cls === "nx" ? "" : "← ") + kicker + (cls === "nx" ? " →" : "");
    a.querySelector("b").textContent = title;
    return a;
  }

  function updateReadout() {
    var box = document.getElementById("readout"); if (!box) return;
    var n = readList().filter(function (id) { return CH.some(function (c) { return c.id === id; }); }).length;
    var pct = Math.round(n / CH.length * 100);
    box.querySelector(".rtxt b").textContent = n + " / " + CH.length + " " + tx(UI.ofCh);
    box.querySelector(".rpct").textContent = pct + "%";
    var ring = box.querySelector(".ring");
    var c = 2 * Math.PI * 18;
    ring.innerHTML = '<svg viewBox="0 0 46 46"><circle cx="23" cy="23" r="18" fill="none" style="stroke:var(--bg-4)" stroke-width="5"/>' +
      '<circle cx="23" cy="23" r="18" fill="none" style="stroke:var(--lime)" stroke-width="5" stroke-linecap="round" ' +
      'stroke-dasharray="' + c + '" stroke-dashoffset="' + (c * (1 - n / CH.length)) + '" transform="rotate(-90 23 23)"/></svg>';
  }

  function updateReadBtn() {
    var b = document.getElementById("readBtn"); if (!b) return;
    var page = document.body.dataset.page;
    var on = readList().indexOf(page) > -1;
    b.className = "readbtn" + (on ? " on" : "");
    b.textContent = on ? "✓ " + tx(UI.isRead) : tx(UI.markRead);
  }

  /* ============================================================
     2b. ICONS + AUTO CALLOUT LABELS
     ============================================================ */
  var S = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
  var ICONS = {
    pitch: S + '<rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="M12 4.5v15"/><circle cx="12" cy="12" r="3.2"/></svg>',
    bulb:  S + '<path d="M9.5 18h5M10.5 21h3"/><path d="M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z"/></svg>',
    star:  S + '<path d="m12 2.6 2.7 6.1 6.6.6-5 4.4 1.5 6.5L12 16.7l-5.8 3.5 1.5-6.5-5-4.4 6.6-.6z"/></svg>',
    team:  S + '<circle cx="8.5" cy="8" r="3"/><circle cx="17" cy="9.5" r="2.4"/><path d="M2.5 19.5a6 6 0 0 1 12 0M15 19.5a5 5 0 0 1 6.5-4.4"/></svg>',
    warn:  S + '<path d="M12 3.2 2.6 20h18.8z"/><path d="M12 9.5v4.6M12 17.2v.1"/></svg>',
    quiz:  S + '<circle cx="12" cy="12" r="9"/><path d="M9.3 9.4a2.9 2.9 0 0 1 5.5 1c0 1.9-2.8 2.2-2.8 4"/><path d="M12 17.4v.1"/></svg>',
    target:S + '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r=".8" fill="currentColor"/></svg>',
    chain: S + '<path d="M9.5 14.5 14.5 9.5"/><path d="M13 6.5 15 4.5a3.9 3.9 0 0 1 5.5 5.5l-2 2"/><path d="M11 17.5 9 19.5A3.9 3.9 0 0 1 3.5 14l2-2"/></svg>',
    eye:   S + '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/></svg>',
    clock: S + '<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3.2 2"/></svg>',
    bolt:  S + '<path d="M13.5 2.5 4.5 13.5h6l-1 8 9-11h-6z"/></svg>',
    arrow: S + '<path d="M4 12h14M13 6l6 6-6 6"/></svg>',
    gauge: S + '<path d="M3.5 18.5a9 9 0 1 1 17 0z"/><path d="M12 14l4.2-4.6"/></svg>',
    pin:   S + '<path d="M12 21.2S19 15 19 10.2a7 7 0 1 0-14 0C5 15 12 21.2 12 21.2z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    swap:  S + '<path d="M4 8h13l-3.5-3.5M20 16H7l3.5 3.5"/></svg>'
  };
  var TAGS = {
    match:  { es: "En el partido",   en: "In the match",     ic: "pitch" },
    think:  { es: "Piénsalo tú",     en: "Think it through",  ic: "bulb" },
    key:    { es: "La idea clave",   en: "The key idea",      ic: "star" },
    team:   { es: "Primero el equipo", en: "Team first",      ic: "team" },
    trap:   { es: "Trampa común",    en: "Common trap",       ic: "warn" }
  };

  function decorate() {
    document.querySelectorAll("[data-ic]").forEach(function (n) {
      if (ICONS[n.dataset.ic]) n.innerHTML = ICONS[n.dataset.ic];
    });
    document.querySelectorAll(".box").forEach(function (b) {
      var k = ["match", "think", "key", "team", "trap"].filter(function (x) { return b.classList.contains(x); })[0];
      if (!k) return;
      var tag = b.querySelector(":scope > .tag");
      if (!tag) { tag = el("div", "tag"); b.insertBefore(tag, b.firstChild); }
      tag.innerHTML = ICONS[TAGS[k].ic] + "<span></span>";
      tag.querySelector("span").textContent = TAGS[k][lang];
    });
    document.querySelectorAll(".quiz").forEach(function (q) {
      var tag = q.querySelector(":scope > .tag");
      if (!tag) { tag = el("div", "tag"); q.insertBefore(tag, q.firstChild); }
      tag.innerHTML = ICONS.quiz + "<span></span>";
      tag.querySelector("span").textContent = lang === "es" ? "Decide tú" : "You decide";
    });
    document.querySelectorAll(".challenge").forEach(function (q) {
      var tag = q.querySelector(":scope > .tag");
      if (!tag) { tag = el("div", "tag"); q.insertBefore(tag, q.firstChild); }
      tag.innerHTML = ICONS.target + "<span></span>";
      tag.querySelector("span").textContent = lang === "es" ? "Tu reto" : "Your challenge";
    });
    document.querySelectorAll(".forwhat").forEach(function (f) {
      var lb = f.querySelector(":scope > .lbl");
      if (!lb) { lb = el("div", "lbl"); f.insertBefore(lb, f.firstChild); }
      lb.textContent = lang === "es" ? "¿PARA QUÉ?" : "WHAT FOR?";
    });
    document.querySelectorAll("details.rev > summary").forEach(function (s) {
      var sp = s.querySelector("span.auto");
      if (sp) sp.textContent = lang === "es" ? "Ver una pista" : "See a hint";
    });
  }

  /* ============================================================
     3. TOOLTIPS
     ============================================================ */
  var tip = null, tipFor = null, hoverTimer = null;
  function ensureTip() {
    if (!tip) { tip = el("div", ""); tip.id = "tip"; tip.setAttribute("role", "tooltip"); document.body.appendChild(tip); }
    return tip;
  }
  function showTip(node) {
    var g = (window.GLOSS || {})[node.dataset.t];
    if (!g) return;
    var d = g[lang] || g.es;
    var t = ensureTip();
    t.innerHTML = "";
    t.appendChild(el("b", "", d.t));
    t.appendChild(el("span", "", d.d));
    t.style.left = "0px"; t.style.top = "0px"; t.classList.add("on");
    var r = node.getBoundingClientRect(), tw = t.offsetWidth, th = t.offsetHeight;
    var x = r.left + r.width / 2 - tw / 2;
    x = Math.max(10, Math.min(x, window.innerWidth - tw - 10));
    /* prefer below; flip above only if it fits without hiding under the sticky header */
    var y = r.bottom + window.scrollY + 9;
    var fitsBelow = r.bottom + th + 20 <= window.innerHeight;
    var fitsAbove = r.top - th - 12 >= 62;
    if (!fitsBelow && fitsAbove) y = r.top + window.scrollY - th - 9;
    t.style.left = x + "px"; t.style.top = y + "px";
    tipFor = node;
  }
  function hideTip() { if (tip) tip.classList.remove("on"); tipFor = null; }

  function wireTips() {
    var canHover = window.matchMedia && window.matchMedia("(hover: hover)").matches;
    document.addEventListener("click", function (e) {
      var n = e.target.closest ? e.target.closest(".t") : null;
      if (n) { e.preventDefault(); (tipFor === n) ? hideTip() : showTip(n); }
      else if (!e.target.closest || !e.target.closest("#tip")) hideTip();
    });
    if (canHover) {
      document.addEventListener("mouseover", function (e) {
        var n = e.target.closest ? e.target.closest(".t") : null;
        if (!n) return;
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(function () { showTip(n); }, 110);
      });
      document.addEventListener("mouseout", function (e) {
        var n = e.target.closest ? e.target.closest(".t") : null;
        if (n) { clearTimeout(hoverTimer); if (tipFor === n) hideTip(); }
      });
    }
    document.addEventListener("focusin", function (e) {
      if (e.target.classList && e.target.classList.contains("t")) showTip(e.target);
    });
    window.addEventListener("scroll", hideTip, { passive: true });
    window.addEventListener("resize", hideTip);
  }

  /* ============================================================
     4. PITCH DIAGRAM RENDERER
     ============================================================ */
  /* Crops stay deliberately wide: a narrow crop of a 105x68 pitch produces a
     portrait figure that swallows the whole screen. Text and stroke widths are
     scale-invariant (see setScale), so a wider crop costs nothing in legibility. */
  var VIEWS = {
    full:      [-4, -4, 113, 76],
    "half-att":[22, -3, 89, 74],
    "half-def":[-3, -3, 89, 74],
    "third-att":[24, -2, 87, 72],
    "third-def":[-2, -2, 87, 72],
    middle:    [10, -3, 93, 74],
    "box-att": [30, 1, 81, 66],
    "box-def": [-6, 1, 81, 66],
    blank:     [-4, -4, 113, 76]
  };
  var COL = { a: "var(--lime)", b: "var(--pink)", c: "var(--cyan)", v: "var(--violet)", w: "var(--amber)", n: "var(--text-2)", ball: "#ffffff" };
  function col(k) { return COL[k] || COL[k === undefined ? "a" : k] || k; }

  /* K keeps annotation (text, strokes, arrowheads) the same on-screen size in
     every crop; PS scales player/ball marks a little more gently. */
  /* TB boosts label text on narrow screens: K keeps text constant relative to the
     figure, but a 315px-wide phone figure would still render 8px text. */
  var K = 1, PS = 1, TB = 1;
  function setScale(vb, cw) {
    K = vb[2] / 113; PS = Math.sqrt(K);
    TB = Math.min(1.85, Math.max(1, 520 / (cw || 700)));
  }
  function r2(n) { return Math.round(n * 1000) / 1000; }

  function pitchLines() {
    var s = 'style="fill:none;stroke:var(--grass-line);stroke-width:' + r2(.45 * K) + '"';
    var o = "";
    o += '<rect x="0" y="0" width="105" height="68" rx="1" style="fill:var(--grass);stroke:var(--grass-line);stroke-width:' + r2(.5 * K) + '"/>';
    o += '<path d="M52.5 0V68" ' + s + "/>";
    o += '<circle cx="52.5" cy="34" r="9.15" ' + s + "/>";
    o += '<circle cx="52.5" cy="34" r="' + r2(.7 * K) + '" style="fill:var(--grass-line)"/>';
    o += '<rect x="0" y="13.85" width="16.5" height="40.3" ' + s + "/>";
    o += '<rect x="88.5" y="13.85" width="16.5" height="40.3" ' + s + "/>";
    o += '<rect x="0" y="24.85" width="5.5" height="18.3" ' + s + "/>";
    o += '<rect x="99.5" y="24.85" width="5.5" height="18.3" ' + s + "/>";
    o += '<circle cx="11" cy="34" r="' + r2(.7 * K) + '" style="fill:var(--grass-line)"/>';
    o += '<circle cx="94" cy="34" r="' + r2(.7 * K) + '" style="fill:var(--grass-line)"/>';
    var gw = 'style="fill:none;stroke:var(--grass-line);stroke-width:' + r2(.8 * K) + '"';
    o += '<rect x="-2" y="30.34" width="2" height="7.32" ' + gw + "/>";
    o += '<rect x="105" y="30.34" width="2" height="7.32" ' + gw + "/>";
    return o;
  }

  function arrow(a, b, c, dash, curve, width) {
    var x1 = a[0], y1 = a[1], x2 = b[0], y2 = b[1];
    var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1;
    var t0 = 3.1 * PS, t1 = 3.6 * PS;
    x1 += dx / L * t0; y1 += dy / L * t0; x2 -= dx / L * t1; y2 -= dy / L * t1;
    dx = x2 - x1; dy = y2 - y1; L = Math.hypot(dx, dy) || 1;
    var w = (width || 0.85) * K, out = "", ex, ey, tx2, ty2;
    var da = dash ? ";stroke-dasharray:" + r2(2.6 * K) + " " + r2(2 * K) : "";
    if (curve) {
      var mx = (x1 + x2) / 2 - dy / L * curve, my = (y1 + y2) / 2 + dx / L * curve;
      out += '<path d="M' + x1 + " " + y1 + "Q" + mx + " " + my + " " + x2 + " " + y2 + '" style="fill:none;stroke:' + c +
        ";stroke-width:" + r2(w) + ';stroke-linecap:round' + da + '"/>';
      tx2 = x2 - mx; ty2 = y2 - my;
    } else {
      out += '<path d="M' + x1 + " " + y1 + "L" + x2 + " " + y2 + '" style="fill:none;stroke:' + c +
        ";stroke-width:" + r2(w) + ';stroke-linecap:round' + da + '"/>';
      tx2 = dx; ty2 = dy;
    }
    var tl = Math.hypot(tx2, ty2) || 1; ex = tx2 / tl; ey = ty2 / tl;
    var hl = 2.9 * K, hw = 1.9 * K;
    var px = -ey, py = ex;
    out += '<path d="M' + x2 + " " + y2 + "L" + (x2 - ex * hl + px * hw) + " " + (y2 - ey * hl + py * hw) +
      "L" + (x2 - ex * hl - px * hw) + " " + (y2 - ey * hl - py * hw) + 'Z" style="fill:' + c + '"/>';
    return out;
  }

  function wavy(a, b, c) {
    var x1 = a[0], y1 = a[1], x2 = b[0], y2 = b[1];
    var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1;
    var ex = dx / L, ey = dy / L, px = -ey, py = ex;
    x1 += ex * 3.1 * PS; y1 += ey * 3.1 * PS; L -= 6.6 * PS;
    var d = "M" + x1 + " " + y1, n = Math.max(2, Math.round(L / (4 * K))), amp = 1.5 * K;
    for (var i = 1; i <= n; i++) {
      var t = L * i / n, s = (i % 2 ? 1 : -1) * amp;
      var cx = x1 + ex * (t - L / n / 2) + px * s, cy = y1 + ey * (t - L / n / 2) + py * s;
      d += "Q" + cx + " " + cy + " " + (x1 + ex * t) + " " + (y1 + ey * t);
    }
    var out = '<path d="' + d + '" style="fill:none;stroke:' + c + ';stroke-width:' + r2(.85 * K) + ';stroke-linecap:round"/>';
    var hx = x1 + ex * L, hy = y1 + ey * L, hl = 2.9 * K, hw = 1.9 * K;
    out += '<path d="M' + hx + " " + hy + "L" + (hx - ex * hl + px * hw) + " " + (hy - ey * hl + py * hw) +
      "L" + (hx - ex * hl - px * hw) + " " + (hy - ey * hl - py * hw) + 'Z" style="fill:' + c + '"/>';
    return out;
  }

  function label(x, y, text, c, size, anchor) {
    return '<text x="' + x + '" y="' + y + '" text-anchor="' + (anchor || "middle") +
      '" style="fill:' + (c || "var(--text)") + ';font:700 ' + r2((size || 3.1) * K * TB) + 'px var(--font, sans-serif)' +
      ';paint-order:stroke;stroke:var(--bg-2);stroke-width:' + r2(1.1 * K * TB) + ';stroke-linejoin:round">' + esc(text) + "</text>";
  }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  function renderPitch(node) {
    var spec;
    try { spec = JSON.parse(node.dataset.pitch); } catch (e) { node.innerHTML = "<!-- bad pitch spec -->"; return; }
    var vb = spec.vb || VIEWS[spec.view || "full"] || VIEWS.full;
    setScale(vb, node.clientWidth);
    var o = "";
    if (spec.view !== "blank") o += pitchLines();

    (spec.shade || []).forEach(function (s) {
      o += '<rect x="' + s.x + '" y="' + (s.y || 0) + '" width="' + s.w + '" height="' + (s.h || 68) +
        '" style="fill:' + col(s.c || "b") + ';opacity:' + (s.o || .13) + '"/>';
      if (s.label) o += label(s.x + s.w / 2, (s.y || 0) + (s.h || 68) / 2, tx(s.label), col(s.c || "b"), 3.4);
    });

    (spec.spaces || []).forEach(function (s) {
      o += '<ellipse cx="' + s.x + '" cy="' + s.y + '" rx="' + (s.rx || 8) + '" ry="' + (s.ry || 6) +
        '" style="fill:' + col(s.c || "a") + ';fill-opacity:.16;stroke:' + col(s.c || "a") +
        ';stroke-width:' + r2(.6 * K) + ';stroke-dasharray:' + r2(2.2 * K) + " " + r2(1.8 * K) + '"/>';
      if (s.label) o += label(s.x, s.y + 1.1, tx(s.label), col(s.c || "a"), s.size || 3.1);
    });

    (spec.arrows || []).forEach(function (a) {
      var c = col(a.c || (a.k === "bpass" || a.k === "brun" || a.k === "bad" ? "b" : "a"));
      if (a.k === "drib") o += wavy(a.from, a.to, c);
      else o += arrow(a.from, a.to, c, a.k === "run" || a.k === "brun" || a.k === "bad", a.curve || 0, a.w);
      if (a.k === "bad") {
        var mx = (a.from[0] + a.to[0]) / 2, my = (a.from[1] + a.to[1]) / 2, xs = 2 * K;
        o += '<g style="stroke:' + c + ';stroke-width:' + r2(1.1 * K) + ';stroke-linecap:round"><path d="M' + (mx - xs) + " " + (my - xs) +
          "L" + (mx + xs) + " " + (my + xs) + 'M' + (mx + xs) + " " + (my - xs) + "L" + (mx - xs) + " " + (my + xs) + '"/></g>';
      }
      if (a.label) {
        var lx = (a.from[0] + a.to[0]) / 2, ly = (a.from[1] + a.to[1]) / 2;
        var dx = a.to[0] - a.from[0], dy = a.to[1] - a.from[1], L = Math.hypot(dx, dy) || 1;
        var off = (a.lo == null ? 3.4 : a.lo) * K;
        o += label(lx - dy / L * off - (a.curve || 0) * .5, ly + dx / L * off + K, tx(a.label), c, a.ls || 2.9);
      }
    });

    (spec.players || []).forEach(function (p) {
      var c = col(p.s === "b" || p.s === "gkb" ? "b" : (p.s === "n" ? "n" : "a"));
      var isGk = p.s === "gk" || p.s === "gkb";
      var r = (p.r || 3.1) * PS;
      if (p.ring) o += '<circle cx="' + p.x + '" cy="' + p.y + '" r="' + r2(r + 1.7 * K) + '" style="fill:none;stroke:' + c +
        ';stroke-width:' + r2(.6 * K) + ';stroke-dasharray:' + r2(1.6 * K) + " " + r2(1.4 * K) + ';opacity:.85"/>';
      o += '<circle cx="' + p.x + '" cy="' + p.y + '" r="' + r2(r) + '" style="fill:' + c +
        (isGk ? ";fill-opacity:.35;stroke:" + c + ";stroke-width:" + r2(.8 * K) : "") + '"/>';
      if (p.n != null && p.n !== "") o += '<text x="' + p.x + '" y="' + r2(p.y + 1.15 * K) + '" text-anchor="middle" style="fill:' +
        (isGk ? c : "var(--on-accent)") + ';font:800 ' + r2((p.fs || 3.2) * K * TB) + 'px var(--font, sans-serif)">' + esc(p.n) + "</text>";
      if (p.note) o += label(p.x + (p.nx || 0), r2(p.y - r - 1.6 * K + (p.ny || 0)), tx(p.note), c, p.ns || 2.9);
    });

    (spec.labels || []).forEach(function (l) {
      o += label(l.x, l.y, tx(l.text), col(l.c || "n"), l.size || 3.2, l.anchor);
    });

    if (spec.ball) {
      o += '<circle cx="' + spec.ball.x + '" cy="' + spec.ball.y + '" r="' + r2(1.75 * PS) +
        '" style="fill:#fff;stroke:#111;stroke-width:' + r2(.4 * K) + '"/>';
      o += '<circle cx="' + spec.ball.x + '" cy="' + spec.ball.y + '" r="' + r2(.55 * PS) + '" style="fill:#111"/>';
    }

    node.innerHTML = '<svg viewBox="' + vb.join(" ") + '" role="img" aria-label="' +
      esc(tx(spec.alt || { es: "Diagrama de una situación de juego", en: "Diagram of a game situation" })) + '">' + o + "</svg>";
  }

  /* ============================================================
     5. X-CHART (quality / quantity over 90 minutes)
     ============================================================ */
  function renderChart(node) {
    var spec;
    try { spec = JSON.parse(node.dataset.chart); } catch (e) { return; }
    var W = 300, rowH = 34, padL = 8, padT = 16;
    /* same idea as TB in the pitch renderer: keep labels readable on a phone */
    var cb = Math.min(1.8, Math.max(1, 520 / (node.clientWidth || 700)));
    var rows = spec.rows || [];
    var Hh = padT + rows.length * rowH + 16;
    var o = "";
    rows.forEach(function (r, ri) {
      var y = padT + ri * rowH + 12;
      var c = col(r.c || "a");
      o += '<text x="' + padL + '" y="' + (y - 9) + '" style="fill:var(--text-2);font:700 ' + r2(7 * cb) + 'px var(--font,sans-serif)">' + esc(tx(r.label)) + "</text>";
      o += '<path d="M' + padL + " " + y + "H" + (W - 8) + '" style="stroke:var(--line);stroke-width:.7"/>';
      var span = W - padL - 22, t = 0, guard = 0;
      while (t <= 100 && guard++ < 120) {
        var f = t / 100;
        var q = (r.q0 == null ? 100 : r.q0) + ((r.q1 == null ? 100 : r.q1) - (r.q0 == null ? 100 : r.q0)) * f;
        var s = 1.9 + (q / 100) * 3.3;
        var x = padL + 6 + span * f;
        o += '<g style="stroke:' + c + ';stroke-width:' + (1.1 + q / 100 * .9) + ';stroke-linecap:round;opacity:' + (.45 + q / 100 * .55) + '">' +
          '<path d="M' + (x - s) + " " + (y - s) + "L" + (x + s) + " " + (y + s) + "M" + (x + s) + " " + (y - s) + "L" + (x - s) + " " + (y + s) + '"/></g>';
        var gap = (r.g0 == null ? 6 : r.g0) + ((r.g1 == null ? 6 : r.g1) - (r.g0 == null ? 6 : r.g0)) * f;
        t += gap;
      }
    });
    var yb = padT + rows.length * rowH + 4;
    o += '<text x="' + (padL + 6) + '" y="' + yb + '" text-anchor="middle" style="fill:var(--text-3);font:700 ' + r2(6 * cb) + 'px var(--font,sans-serif)">0\'</text>';
    o += '<text x="' + (padL + 6 + (W - padL - 22) / 2) + '" y="' + yb + '" text-anchor="middle" style="fill:var(--text-3);font:700 ' + r2(6 * cb) + 'px var(--font,sans-serif)">45\'</text>';
    o += '<text x="' + (padL + 6 + (W - padL - 22)) + '" y="' + yb + '" text-anchor="middle" style="fill:var(--text-3);font:700 ' + r2(6 * cb) + 'px var(--font,sans-serif)">90\'</text>';
    node.innerHTML = '<svg viewBox="0 0 ' + W + " " + Hh + '" role="img" aria-label="' +
      esc(tx(spec.alt || { es: "Gráfico de acciones a lo largo del partido", en: "Chart of actions across the match" })) + '">' + o + "</svg>";
  }

  function renderAll() {
    decorate();
    document.querySelectorAll("[data-pitch]").forEach(renderPitch);
    document.querySelectorAll("[data-chart]").forEach(renderChart);
    if (document.getElementById("glist")) buildGlossary();
  }

  /* ============================================================
     6. GLOSSARY PAGE
     ============================================================ */
  function buildGlossary(q) {
    var box = document.getElementById("glist"); if (!box) return;
    var inp = document.getElementById("gsearch");
    q = (q == null ? (inp ? inp.value : "") : q).trim().toLowerCase();
    var G = window.GLOSS || {};
    var items = Object.keys(G).map(function (k) { return G[k][lang] || G[k].es; })
      .filter(function (d) { return !q || (d.t + " " + d.d).toLowerCase().indexOf(q) > -1; })
      .sort(function (a, b) {
        /* words whose name matches come first; a search for "pie" should not be
           topped by definitions that merely contain "em-pie-za" */
        if (q) {
          var am = a.t.toLowerCase().indexOf(q) > -1 ? 0 : 1,
              bm = b.t.toLowerCase().indexOf(q) > -1 ? 0 : 1;
          if (am !== bm) return am - bm;
        }
        return a.t.localeCompare(b.t, lang);
      });
    box.innerHTML = "";
    if (!items.length) { box.appendChild(el("p", "gempty", lang === "es" ? "No hay nada con esa palabra." : "Nothing matches that word.")); return; }
    items.forEach(function (d) {
      var n = el("div", "gitem", "<h3></h3><p></p>");
      n.querySelector("h3").textContent = d.t;
      n.querySelector("p").textContent = d.d;
      box.appendChild(n);
    });
    var cnt = document.getElementById("gcount");
    if (cnt) cnt.textContent = items.length + (lang === "es" ? " palabras" : " words");
  }

  /* ============================================================
     7. QUIZZES
     ============================================================ */
  function wireQuiz() {
    document.querySelectorAll(".quiz").forEach(function (q) {
      q.querySelectorAll(".opt").forEach(function (btn) {
        btn.addEventListener("click", function () {
          if (q.classList.contains("answered")) return;
          q.classList.add("answered");
          q.querySelectorAll(".opt").forEach(function (b) {
            b.disabled = true;
            if (b.dataset.ok === "1") b.classList.add("right");
            else if (b === btn) b.classList.add("wrong");
          });
          q.querySelectorAll(".why").forEach(function (w) { w.classList.add("show"); });
        });
      });
    });
  }

  /* ============================================================
     8. READING PROGRESS BAR
     ============================================================ */
  function wireProgress() {
    var bar = document.querySelector(".progress > i"); if (!bar) return;
    function upd() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 40 ? Math.min(100, Math.max(0, window.scrollY / h * 100)) : 0) + "%";
    }
    window.addEventListener("scroll", upd, { passive: true });
    window.addEventListener("resize", upd);
    upd();
  }

  /* ============================================================
     9. BOOT
     ============================================================ */
  function boot() {
    applyTheme(get(LS.theme, "dark"), false);
    applyLang(get(LS.lang, "es"), false);

    document.querySelectorAll(".langsw button").forEach(function (b) {
      b.addEventListener("click", function () { applyLang(b.dataset.lang, true); });
    });
    var tb = document.getElementById("themeBtn");
    if (tb) tb.addEventListener("click", function () {
      applyTheme(H.getAttribute("data-theme") === "dark" ? "light" : "dark", true);
    });

    var mb = document.getElementById("menuBtn"), dr = document.getElementById("drawer"), sc = document.getElementById("scrim");
    function openMenu(v) {
      if (!dr) return;
      dr.classList.toggle("on", v); sc.classList.toggle("on", v);
      if (mb) mb.setAttribute("aria-expanded", String(v));
      document.body.style.overflow = v ? "hidden" : "";
      if (v) { var f = dr.querySelector(".dlink"); if (f) f.focus(); }
    }
    if (mb) mb.addEventListener("click", function () { openMenu(!dr.classList.contains("on")); });
    if (sc) sc.addEventListener("click", function () { openMenu(false); });
    var cb = document.getElementById("closeDrawer");
    if (cb) cb.addEventListener("click", function () { openMenu(false); });

    var rb = document.getElementById("readBtn");
    if (rb) rb.addEventListener("click", function () {
      var page = document.body.dataset.page, a = readList(), i = a.indexOf(page);
      if (i > -1) a.splice(i, 1); else a.push(page);
      saveRead(a); updateReadBtn(); buildNav();
    });
    var rs = document.getElementById("resetBtn");
    if (rs) rs.addEventListener("click", function () { saveRead([]); buildNav(); });

    var gs = document.getElementById("gsearch");
    if (gs) gs.addEventListener("input", function () { buildGlossary(); });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { hideTip(); openMenu(false); }
      if (e.target.matches && e.target.matches("input, textarea")) return;
      var i = CH.map(function (c) { return c.id; }).indexOf(document.body.dataset.page);
      if (i < 0) return;
      if (e.key === "ArrowRight" && i < CH.length - 1) location.href = CH[i + 1].f;
      if (e.key === "ArrowLeft" && i > 0) location.href = CH[i - 1].f;
    });

    wireTips(); wireQuiz(); wireProgress(); renderAll(); buildNav();

    var rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(function () {
        document.querySelectorAll("[data-pitch]").forEach(renderPitch);
        document.querySelectorAll("[data-chart]").forEach(renderChart);
      }, 180);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
