// LootRush demo home page (v4, simple). Everything is fake: play-money coins, bot chat, random bets. No images.
(() => {
  const $ = (s) => document.querySelector(s), $$ = (s) => [...document.querySelectorAll(s)];
  const rand = (a, b) => a + Math.random() * (b - a), ri = (a, b) => Math.floor(rand(a, b + 1));
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const fmt = (n) => Math.round(n).toLocaleString("en-US");
  const two = (n) => String(n).padStart(2, "0");

  // ---------- icons ----------
  const I = {
    games: '<rect x="2" y="7" width="20" height="12" rx="4"/><path d="M7 11v4M5 13h4"/><circle cx="16" cy="12" r=".6"/><circle cx="18" cy="14" r=".6"/>',
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>', bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>', send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
    home: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/>', users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', left: '<path d="m15 6-6 6 6 6"/>', right: '<path d="m9 6 6 6-6 6"/>',
    bolt: '<path d="M13 2 4 14h6l-1 8 9-12h-6z"/>', crown: '<path d="M3 18 2 7l5.5 4L12 4l4.5 7L22 7l-1 11z"/>', ruler: '<rect x="2" y="8" width="20" height="8" rx="1.5"/><path d="M6 8v3M10 8v4M14 8v3M18 8v4"/>',
    swords: '<path d="M14.5 17.5 3 6V3h3l11.5 11.5"/><path d="m13 19 6-6M16 16l4 4M14.5 6.5 18 3h3v3l-3.5 3.5M5 14l4 4M7 17l-3 3"/>',
    coin: '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9 9.5h4.5a1.75 1.75 0 0 1 0 3.5h-3a1.75 1.75 0 0 0 0 3.5H15"/>',
    dice: '<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1"/><circle cx="15.5" cy="15.5" r="1"/><circle cx="12" cy="12" r="1"/>',
    spade: '<path d="M12 3C8 7 4 9.5 4 13a4 4 0 0 0 7 2.6V19H9v2h6v-2h-2v-3.4A4 4 0 0 0 20 13c0-3.5-4-6-8-10z"/>',
    gem: '<path d="M7 3h10l5 6-10 12L2 9z"/><path d="M2 9h20"/>', tower: '<path d="M5 21V8l3-3 3 3V4h2v4l3-3 3 3v13z"/><path d="M10 21v-5h4v5"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    check: '<path d="M20 6 9 17l-5-5"/>', clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  };
  const ic = (n) => `<i data-i><svg viewBox="0 0 24 24">${I[n] || ""}</svg></i>`;
  const paint = (root = document) => root.querySelectorAll("[data-i]").forEach(e => { const n = e.getAttribute("data-i"); if (n && I[n] && !e.firstChild) e.innerHTML = `<svg viewBox="0 0 24 24">${I[n]}</svg>`; });
  paint();

  // ---------- toast + balance ----------
  let tt; const toast = (h) => { const t = $("#toast"); t.innerHTML = h; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 2000); };
  let bal = 2500; try { bal = parseFloat(localStorage.getItem("lr_balance")) || 2500; } catch (e) {}
  let shown = 0;
  const countTo = (v, ms = 700) => { const f = shown, t0 = performance.now(); (function s(t) { const k = Math.min(1, (t - t0) / ms); shown = f + (v - f) * (1 - (1 - k) ** 3); $("#bal").textContent = fmt(shown); if (k < 1) requestAnimationFrame(s); })(t0); };
  countTo(bal, 1000);
  window.LR = { toast, get bal() { return bal; }, addCoins: (n, from) => addCoins(n, from),
    spend(n) { if (n > bal) return false; bal -= n; try { localStorage.setItem("lr_balance", bal); } catch (e) {} countTo(bal, 400); return true; } };
  function addCoins(n, from) {
    bal += n; try { localStorage.setItem("lr_balance", bal); } catch (e) {}
    const a = from.getBoundingClientRect(), b = $(".bal").getBoundingClientRect();
    for (let i = 0; i < 8; i++) {
      const c = document.createElement("span"); c.className = "coin fly"; c.style.left = a.left + a.width / 2 + "px"; c.style.top = a.top + a.height / 2 + "px"; document.body.appendChild(c);
      const dx = b.left + 16 - a.left - a.width / 2, dy = b.top + b.height / 2 - a.top - a.height / 2;
      c.animate([{ transform: "translate(0,0) scale(.6)", opacity: 0 }, { transform: `translate(${dx / 2 + rand(-20, 20)}px,${dy / 2 + rand(30, 60)}px)`, opacity: 1, offset: .5 }, { transform: `translate(${dx}px,${dy}px) scale(.8)`, opacity: .9 }],
        { duration: 550 + i * 45, easing: "cubic-bezier(.3,.7,.2,1)" }).onfinish = () => c.remove();
    }
    setTimeout(() => { countTo(bal); const e = $(".bal"); e.classList.remove("bump"); void e.offsetWidth; e.classList.add("bump"); }, 550);
  }
  let last = 0;
  $("#claim").addEventListener("click", (e) => {
    const w = 10000 - (Date.now() - last);
    if (w > 0) return toast(`${ic("clock")} Free coins again in ${Math.ceil(w / 1000)}s`);
    last = Date.now(); const n = ri(25, 100) * 10; addCoins(n, e.currentTarget); toast(`<span class="coin"></span> +${fmt(n)} play coins`);
  });
  $("#bell").addEventListener("click", (e) => { const b = e.currentTarget; b.classList.remove("ring"); void b.offsetWidth; b.classList.add("ring"); toast(`${ic("bell")} No new notifications`); });
  setTimeout(() => $("#xpbar").style.width = "49%", 300);

  // ---------- promo slides ----------
  const slides = $$(".slide"), dots = $("#dots"); let cur = 0, timer;
  slides.forEach((_, i) => { const d = document.createElement("button"); d.onclick = () => { go(i); clearInterval(timer); timer = setInterval(() => go(cur + 1), 5000); }; dots.appendChild(d); });
  function go(i) { slides[cur].classList.remove("on"); dots.children[cur].classList.remove("on"); cur = (i + slides.length) % slides.length; slides[cur].classList.add("on"); dots.children[cur].classList.add("on"); }
  go(0); timer = setInterval(() => go(cur + 1), 5000);
  $$(".promo .btn").forEach(b => b.addEventListener("click", () => toast("Opens in the next update")));

  // ---------- game tiles ----------
  const die = (n, cls = "") => { const map = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] }; let h = ""; for (let i = 0; i < 9; i++) h += map[n].includes(i) ? "<i></i>" : "<span></span>"; return `<div class="die ${cls}">${h}</div>`; };
  const gridArt = (cols, rows, marks) => { let h = ""; for (let i = 0; i < cols * rows; i++) h += `<i class="${marks[i] || "x"}"></i>`; return `<div class="gridx" style="grid-template-columns:repeat(${cols},15px)">${h}</div>`; };
  const MULTI = [
    { n: "Roll", i: "crown", art: `<div class="roll"><i></i><i class="w"></i><i class="big"></i><i class="w"></i><i></i></div>` },
    { n: "Slide", i: "ruler", art: `<div class="ruler"></div>` },
    { n: "Case Battles", i: "swords", art: `<div class="box3"><i></i></div><span class="vs-mini">VS</span>` },
    { n: "Coinflip", i: "coin", art: `<div class="coin-big"></div>` },
    { n: "Dice PvP", i: "dice", art: `<div class="pair">${die(5)}${die(3, "d2")}</div>` },
  ];
  const SOLO = [
    { n: "Dice", i: "dice", art: `<div class="pair">${die(6)}${die(2, "d2")}</div>` },
    { n: "Blackjack", i: "spade", art: `<div class="cards"><div class="card-p">A<b>♠</b></div><div class="card-p r">K<b>♥</b></div></div>` },
    { n: "Mines", i: "gem", art: gridArt(5, 4, { 2: "g", 6: "g", 13: "g" }) },
    { n: "Towers", i: "tower", art: `<div class="tower">${[["", "g", ""], ["g", "", ""], ["", "", "g"], ["", "x", ""], ["", "", ""]].map(r => `<div>${r.map(c => `<i class="${c}"></i>`).join("")}</div>`).join("")}</div>` },
    { n: "Keno", i: "grid", art: `<div class="keno">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<i class="${[2, 5, 9].includes(n) ? "on" : ""}">${n}</i>`).join("")}</div>` },
  ];
  function tiles(list, root) {
    root.innerHTML = list.map(g => `<div class="tile" data-name="${g.n.toLowerCase()}"><span class="tic">${ic(g.i)}</span><div><b class="tname">${g.n}</b><span class="tplay"><i></i><span>${ri(12, 340)} playing</span></span></div></div>`).join("");
    root.querySelectorAll(".tile").forEach((t, k) => t.addEventListener("click", () => toast(`${list[k].n} opens in the next update`)));
  }
  tiles(MULTI, $("#multi")); tiles(SOLO, $("#solo"));

  // tabs + search filter
  $$("#tabs button").forEach((b, k) => b.addEventListener("click", () => {
    $$("#tabs button").forEach(x => x.classList.remove("on")); b.classList.add("on");
    $$(".row[data-group]").forEach(r => r.style.display = k === 0 || (k === 1 && r.dataset.group === "multi") || (k === 2 && r.dataset.group === "solo") ? "" : "none");
  }));
  $("#q").addEventListener("input", (e) => { const q = e.target.value.trim().toLowerCase(); $$(".tile").forEach(t => t.classList.toggle("hide", q && !t.dataset.name.includes(q))); });
  $$(".arr,.va").forEach(b => b.addEventListener("click", (e) => { e.preventDefault(); toast("More games coming soon"); }));

  // ---------- latest bets ----------
  const NAMES = ["Worseoor", "KINGtoasty", "shimiepookie", "Ytypical", "NeoDid", "FruitSalad", "Yaga", "spooky", "PizzaKing", "noobmaster", "LunaFox", "Kiwi", "Tater", "vqlres", "ivory"];
  const GAMES = [["Dice", "dice"], ["Mines", "gem"], ["Coinflip", "coin"], ["Towers", "tower"], ["Keno", "grid"], ["Case Battles", "swords"], ["Roll", "crown"], ["Blackjack", "spade"]];
  function betRow() {
    const g = pick(GAMES), bet = ri(1, 80) * 25, win = Math.random() < .55, m = win ? +rand(1.1, 12).toFixed(2) : 0;
    return `<div class="b-row"><span class="g">${ic(g[1])}${g[0]}</span><span>${pick(NAMES)}</span><span class="num"><span class="coin sm"></span>${fmt(bet)}</span><span class="${win ? "up" : "down"}">${m.toFixed(2)}x</span><span class="num ${win ? "up" : "down"}"><span class="coin sm"></span>${win ? "+" + fmt(bet * m) : "-" + fmt(bet)}</span></div>`;
  }
  const bets = $("#bets"); bets.innerHTML = Array.from({ length: 8 }, betRow).join("");
  setInterval(() => { bets.insertAdjacentHTML("afterbegin", betRow()); if (bets.children.length > 8) bets.lastElementChild.remove(); }, 1800);

  // ---------- chat ----------
  const LINES = ["gg", "do the headphones first", "w", "gl", "anyone coinflip?", "dice pvp me", "mines with 3 bombs is crazy", "just hit 8x on keno", "rain soon?", "this demo is clean", "towers is so hard", "lol", "rerun", "ty"];
  const msgs = $("#msgs");
  const now = () => { const d = new Date(); return `${two(d.getHours())}:${two(d.getMinutes())}`; };
  function msg(name, text, me) {
    const m = document.createElement("div"); m.className = "m" + (me ? " me" : "");
    m.innerHTML = `<span class="av">${name[0].toUpperCase()}</span><div style="flex:1;min-width:0"><div class="who"><b></b><span class="lv">${me ? 13 : ri(2, 80)}</span></div><div class="bub"><p></p><time>${now()}</time></div></div>`;
    m.querySelector("b").textContent = name; m.querySelector("p").textContent = text; // text only, never HTML
    msgs.appendChild(m); if (msgs.children.length > 60) msgs.firstChild.remove(); msgs.scrollTop = msgs.scrollHeight;
  }
  for (let i = 0; i < 12; i++) msg(pick(NAMES), pick(LINES));
  (function bot() { msg(pick(NAMES), pick(LINES)); setTimeout(bot, rand(1800, 5000)); })();
  const send = () => { const i = $("#say"), v = i.value.trim(); if (!v) return; msg("You", v, true); i.value = ""; };
  $("#send").addEventListener("click", send); $("#say").addEventListener("keydown", (e) => { if (e.key === "Enter") send(); });
  setInterval(() => { const o = $("#online"); o.textContent = Math.max(140, +o.textContent + ri(-3, 4)); }, 3000);
})();

// =====================================================================
// VFX layer (v5): ambient particles, cursor glow, spotlights, tilt, tile loops, coin sparks.
// =====================================================================
(() => {
  const $ = (s) => document.querySelector(s), $$ = (s) => [...document.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rand = (a, b) => a + Math.random() * (b - a);

  // ambient: slow drifting light motes + faint connecting lines
  const cv = $("#fx"), cx = cv.getContext("2d"); let W, H, dots = [];
  const size = () => { W = cv.width = innerWidth * devicePixelRatio; H = cv.height = innerHeight * devicePixelRatio; cv.style.width = innerWidth + "px"; cv.style.height = innerHeight + "px";
    dots = Array.from({ length: Math.round(innerWidth * innerHeight / 26000) }, () => ({ x: rand(0, W), y: rand(0, H), vx: rand(-.15, .15), vy: rand(-.3, -.05), r: rand(.6, 1.8) * devicePixelRatio, a: rand(.15, .6) })); };
  size(); addEventListener("resize", size);
  let mx = -999, my = -999;
  addEventListener("mousemove", (e) => { mx = e.clientX * devicePixelRatio; my = e.clientY * devicePixelRatio; const g = $("#cglow"); if (g) g.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; });
  function frame() {
    cx.clearRect(0, 0, W, H);
    for (const d of dots) {
      d.x += d.vx; d.y += d.vy; if (d.y < -10) { d.y = H + 10; d.x = rand(0, W); } if (d.x < -10) d.x = W + 10; if (d.x > W + 10) d.x = -10;
      const dx = d.x - mx, dy = d.y - my, dist = Math.hypot(dx, dy), push = dist < 140 * devicePixelRatio ? (1 - dist / (140 * devicePixelRatio)) : 0;
      d.x += dx / (dist || 1) * push * 1.2; d.y += dy / (dist || 1) * push * 1.2;
      cx.beginPath(); cx.arc(d.x, d.y, d.r, 0, 6.283); cx.fillStyle = `rgba(150,200,255,${d.a + push * .4})`; cx.fill();
    }
    for (let i = 0; i < dots.length; i++) for (let j = i + 1; j < dots.length; j++) {
      const a = dots[i], b = dots[j], d = Math.hypot(a.x - b.x, a.y - b.y), lim = 110 * devicePixelRatio;
      if (d < lim) { cx.strokeStyle = `rgba(78,163,255,${(1 - d / lim) * .12})`; cx.lineWidth = devicePixelRatio; cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(b.x, b.y); cx.stroke(); }
    }
    requestAnimationFrame(frame);
  }
  if (!reduce) frame();

  // orbiting dot around the LR mark
  const od = $("#odot"); if (od && !reduce) (function o(t) { const a = t / 700; od.style.transform = `translate(${Math.cos(a) * 56}px,${Math.sin(a) * 22}px)`; od.style.opacity = Math.sin(a) > 0 ? 1 : .35; requestAnimationFrame(o); })(0);

  // mouse spotlight on hero cards + tiles, gentle 3D tilt on tiles
  const track = (el) => el.addEventListener("mousemove", (e) => { const r = el.getBoundingClientRect(); el.style.setProperty("--mx", e.clientX - r.left + "px"); el.style.setProperty("--my", e.clientY - r.top + "px"); });
  $$(".spot").forEach(track);
  function wireTiles() {
    $$(".tile").forEach(t => {
      if (t.dataset.fx) return; t.dataset.fx = 1; t.insertAdjacentHTML("afterbegin", '<span class="glow"></span>'); track(t);
      t.addEventListener("mousemove", (e) => { const r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        t.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-3px)`; });
      t.addEventListener("mouseleave", () => t.style.transform = "");
    });
  }
  wireTiles();

  // tiles keep playing a little: mines reveal, keno picks, towers climb, coinflip result
  const loops = {
    mines(art) { const cells = [...art.querySelectorAll(".gridx i")]; setInterval(() => { cells.forEach(c => c.className = "x"); const order = cells.map((_, i) => i).sort(() => Math.random() - .5); order.slice(0, 4).forEach((k, n) => setTimeout(() => { cells[k].className = "g flip-in"; }, n * 260)); }, 2600); },
    keno(art) { const cells = [...art.querySelectorAll(".keno i")]; setInterval(() => { cells.forEach(c => c.className = ""); const pick = cells.map((_, i) => i).sort(() => Math.random() - .5).slice(0, 3); pick.forEach((k, n) => setTimeout(() => cells[k].className = "on flip-in", n * 220)); }, 2400); },
    towers(art) { const rows = [...art.querySelectorAll(".tower div")].reverse(); setInterval(() => { rows.forEach(r => r.querySelectorAll("i").forEach(i => i.className = "")); rows.forEach((r, n) => setTimeout(() => { const c = r.querySelectorAll("i"); c[Math.floor(Math.random() * 3)].className = n === rows.length - 1 && Math.random() < .5 ? "x flip-in" : "g flip-in"; }, n * 280)); }, 2800); },
  };
  $$(".tile").forEach(t => { const n = t.dataset.name, art = t.querySelector(".art"); if (art && loops[n] && !reduce) loops[n](art); });

  // tab highlight that slides between tabs
  const tabs = $("#tabs"); if (tabs) { const ink = document.createElement("span"); ink.className = "tab-ink"; tabs.prepend(ink);
    const place = () => { const on = tabs.querySelector("button.on"); ink.style.left = on.offsetLeft + "px"; ink.style.width = on.offsetWidth + "px"; };
    tabs.querySelectorAll("button").forEach(b => b.addEventListener("click", () => requestAnimationFrame(place))); place(); addEventListener("resize", place); }

  // click ripple on buttons and tiles
  document.addEventListener("pointerdown", (e) => {
    const b = e.target.closest(".btn,.pill,.sq,.va,.tabs button,.tile"); if (!b) return;
    const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height) * .5, d = document.createElement("span"); d.className = "ripple";
    d.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
    if (getComputedStyle(b).position === "static") b.style.position = "relative"; b.style.overflow = "hidden"; b.appendChild(d); setTimeout(() => d.remove(), 650);
  });

  // when the balance goes up: sparks + a floating "+N"
  const bal = $("#bal"); let prev = 0;
  new MutationObserver(() => {
    const v = +bal.textContent.replace(/,/g, ""); if (prev && v > prev && !document.querySelector(".plus-pop")) {
      const r = bal.getBoundingClientRect(), p = document.createElement("span"); p.className = "plus-pop"; p.style.left = r.left + "px"; p.style.top = r.bottom + "px";
      p.textContent = "+"; document.body.appendChild(p);
      p.animate([{ transform: "translateY(0)", opacity: 1 }, { transform: "translateY(18px)", opacity: 0 }], { duration: 900, easing: "ease-out" }).onfinish = () => p.remove();
    }
    prev = v;
  }).observe(bal, { childList: true, characterData: true, subtree: true });

  // chat: fresh messages glow; bets: wins flash, big wins shine
  new MutationObserver((ms) => ms.forEach(m => m.addedNodes.forEach(n => { if (n.classList?.contains("m")) { n.classList.add("fresh"); setTimeout(() => n.classList.remove("fresh"), 1100); } }))).observe($("#msgs"), { childList: true });
  new MutationObserver((ms) => ms.forEach(m => m.addedNodes.forEach(n => {
    if (!n.classList?.contains("b-row")) return; const up = n.querySelector(".up"); if (!up) return;
    const multi = parseFloat(up.textContent); n.classList.add(multi >= 5 ? "big-win" : "win-flash");
  }))).observe($("#bets"), { childList: true });
})();

// =====================================================================
// Sounds: made with the browser's audio engine, no sound files.
// Soft tick on hover, click on press, coin chime when coins land, pop for toasts.
// =====================================================================
(() => {
  const $ = (s) => document.querySelector(s);
  let ctx = null, master = null, muted = false;
  try { muted = localStorage.getItem("lr_muted") === "1"; } catch (e) {}
  function init() {
    if (ctx) return; const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    ctx = new AC(); master = ctx.createGain(); master.gain.value = muted ? 0 : .5; master.connect(ctx.destination);
  }
  addEventListener("pointerdown", init, { once: true, capture: true }); addEventListener("keydown", init, { once: true, capture: true });
  function tone(freq, dur, { type = "sine", vol = .2, to = null, delay = 0 } = {}) {
    if (!ctx || muted) return; const t = ctx.currentTime + delay;
    const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.setValueAtTime(freq, t);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .004); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + .02);
  }
  const SFX = {
    hover: () => tone(1800, .035, { type: "triangle", vol: .05 }),
    click: () => { tone(600, .06, { type: "triangle", vol: .16, to: 300 }); },
    tab: () => tone(900, .05, { type: "triangle", vol: .1, to: 1200 }),
    coin: () => { [1318, 1760, 2093].forEach((f, i) => tone(f, .18, { type: "sine", vol: .13, delay: i * .06 })); },
    pop: () => tone(520, .09, { type: "sine", vol: .12, to: 880 }),
    msg: () => tone(1400, .04, { type: "sine", vol: .035 }),
    tick: () => { tone(2600 + Math.random() * 500, .022, { type: "square", vol: .028 }); tone(5200, .012, { type: "sine", vol: .02 }); },
    land: () => { tone(150, .22, { type: "sine", vol: .28, to: 70 }); tone(880, .09, { type: "triangle", vol: .08, to: 1320, delay: .02 }); },
    rare: () => { tone(110, .4, { type: "sine", vol: .32, to: 55 }); [1046, 1318, 1568, 2093, 2637].forEach((f, i) => tone(f, .35, { type: "sine", vol: .1, delay: .05 + i * .07 })); },
  };
  window.LR_SFX = SFX;

  const HOVER = ".tile,.pill,.sq,.btn,.va,.arr,.tabs button,.race,.dots button,.say button,.cb,.seg button,.mcase,.cb-sort button,.pk";
  let lastHover = null, lastT = 0;
  document.addEventListener("pointerover", (e) => {
    const el = e.target.closest(HOVER); if (!el || el === lastHover) return; lastHover = el;
    const now = performance.now(); if (now - lastT < 40) return; lastT = now; SFX.hover();
  });
  document.addEventListener("pointerout", (e) => { const el = e.target.closest(HOVER); if (el && !el.contains(e.relatedTarget)) lastHover = null; });
  document.addEventListener("click", (e) => {
    const el = e.target.closest(HOVER); if (!el) return;
    if (el.closest(".tabs,.cb-sort,.seg")) SFX.tab(); else if (el.classList.contains("cb")) return; else if (el.id !== "claim") SFX.click();
  });
  // coin chime when the balance bumps, pop when a toast shows, tiny blip for chat (only if near the bottom)
  const bal = $(".bal");
  new MutationObserver(() => { if (bal.classList.contains("bump")) SFX.coin(); }).observe(bal, { attributes: true, attributeFilter: ["class"] });
  const toast = $("#toast");
  new MutationObserver(() => { if (toast.classList.contains("show")) SFX.pop(); }).observe(toast, { attributes: true, attributeFilter: ["class"] });
  $("#claim").addEventListener("click", () => SFX.click());

  // mute button
  const ICON_ON = '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>';
  const ICON_OFF = '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="m17 9 5 6M22 9l-5 6"/></svg>';
  const btn = $("#mute"), ic = btn.querySelector("[data-i]");
  const draw = () => { ic.innerHTML = muted ? ICON_OFF : ICON_ON; btn.classList.toggle("off", muted); btn.title = muted ? "Sound off" : "Sound on"; };
  draw();
  btn.addEventListener("click", () => {
    init(); muted = !muted; try { localStorage.setItem("lr_muted", muted ? "1" : "0"); } catch (e) {}
    if (master) master.gain.value = muted ? 0 : .5; draw(); if (!muted) SFX.click();
  });
})();

// =====================================================================
// Item art: original items drawn on canvas once, then cached as images
// (sharp + 2 motion-blurred versions) so the reels never redraw during a spin.
// =====================================================================
window.LRArt = (() => {
  const TIER = ["#9aa1ac", "#56c8f0", "#5fd497", "#a58cf0", "#e8c25a", "#e5684d"];
  const SZ = 120, cache = new Map();
  const shapeOf = (n) => /blade|sword/i.test(n) ? "sword" : /crown|jewel/i.test(n) ? "crown" : /halo/i.test(n) ? "halo" : /hat/i.test(n) ? "hat" : /egg/i.test(n) ? "egg"
    : /pet|cat|dino/i.test(n) ? "pet" : /shades/i.test(n) ? "shades" : /wings/i.test(n) ? "wings" : /orb|coin/i.test(n) ? "orb" : /ring|gem/i.test(n) ? "gem"
    : /shield/i.test(n) ? "shield" : /pack/i.test(n) ? "box" : /staff|bow|gun/i.test(n) ? "staff" : "robe";
  const shade = (hex, f) => { const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = n >> 8 & 255, b = n & 255; const m = (v) => Math.max(0, Math.min(255, Math.round(f > 0 ? v + (255 - v) * f : v * (1 + f)))); return `rgb(${m(r)},${m(g)},${m(b)})`; };
  function paint(ctx, shape, col) {
    const g = ctx.createLinearGradient(0, 20, 0, 104); g.addColorStop(0, shade(col, .45)); g.addColorStop(.55, col); g.addColorStop(1, shade(col, -.38));
    ctx.fillStyle = g; ctx.strokeStyle = "#16181c"; ctx.lineWidth = 5; ctx.lineJoin = ctx.lineCap = "round";
    const P = (pts) => { ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fill(); ctx.stroke(); };
    const E = (x, y, rx, ry, fill) => { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); if (fill) { ctx.save(); ctx.fillStyle = fill; ctx.fill(); ctx.restore(); } else ctx.fill(); ctx.stroke(); };
    switch (shape) {
      case "sword": ctx.save(); ctx.translate(60, 60); ctx.rotate(-Math.PI / 4); P([[-7, -46], [0, -54], [7, -46], [7, 16], [-7, 16]]); ctx.fillStyle = "#3a3f48"; P([[-24, 16], [24, 16], [24, 25], [-24, 25]]); P([[-5, 25], [5, 25], [5, 46], [-5, 46]]); ctx.restore(); break;
      case "crown": P([[20, 86], [16, 38], [38, 58], [60, 28], [82, 58], [104, 38], [100, 86]]); E(60, 28, 6, 6, "#fff"); break;
      case "halo": ctx.lineWidth = 14; ctx.strokeStyle = "#16181c"; ctx.beginPath(); ctx.ellipse(60, 58, 40, 16, 0, 0, 7); ctx.stroke(); ctx.lineWidth = 8; ctx.strokeStyle = col; ctx.stroke(); break;
      case "hat": E(60, 82, 46, 12); P([[30, 82], [36, 34], [84, 34], [90, 82]]); ctx.save(); ctx.fillStyle = "#16181c"; ctx.fillRect(32, 64, 56, 9); ctx.restore(); break;
      case "egg": E(60, 62, 32, 42); ctx.save(); ctx.fillStyle = "rgba(255,255,255,.85)"; ctx.fillRect(30, 58, 60, 9); ctx.restore(); break;
      case "pet": P([[30, 44], [36, 16], [52, 34]]); P([[90, 44], [84, 16], [68, 34]]); E(60, 62, 36, 32); E(47, 58, 6, 8, "#16181c"); E(73, 58, 6, 8, "#16181c"); E(60, 74, 5, 3, "#16181c"); break;
      case "shades": ctx.save(); ctx.fillStyle = "#16181c"; ctx.fillRect(44, 52, 32, 6); ctx.restore(); P([[14, 46], [52, 46], [48, 74], [20, 74]]); P([[68, 46], [106, 46], [100, 74], [72, 74]]); break;
      case "wings": P([[58, 70], [16, 30], [22, 70], [10, 80], [40, 88]]); P([[62, 70], [104, 30], [98, 70], [110, 80], [80, 88]]); break;
      case "orb": E(60, 60, 38, 38); E(60, 60, 22, 22, shade(col, -.25)); break;
      case "gem": P([[30, 42], [46, 24], [74, 24], [90, 42], [60, 98]]); ctx.save(); ctx.strokeStyle = "rgba(0,0,0,.25)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(30, 42); ctx.lineTo(90, 42); ctx.moveTo(52, 42); ctx.lineTo(60, 98); ctx.lineTo(68, 42); ctx.stroke(); ctx.restore(); break;
      case "shield": P([[60, 16], [98, 30], [94, 70], [60, 104], [26, 70], [22, 30]]); ctx.save(); ctx.fillStyle = "rgba(255,255,255,.5)"; ctx.fillRect(55, 34, 10, 48); ctx.fillRect(40, 50, 40, 10); ctx.restore(); break;
      case "box": P([[60, 22], [100, 40], [60, 58], [20, 40]]); ctx.save(); ctx.fillStyle = shade(col, -.2); P([[20, 40], [60, 58], [60, 100], [20, 82]]); ctx.fillStyle = shade(col, -.45); P([[100, 40], [60, 58], [60, 100], [100, 82]]); ctx.restore(); break;
      case "staff": ctx.save(); ctx.translate(60, 60); ctx.rotate(Math.PI / 5); ctx.fillStyle = "#6b4a2f"; P([[-5, -30], [5, -30], [5, 50], [-5, 50]]); ctx.restore(); E(46, 30, 18, 18); break;
      default: P([[42, 20], [78, 20], [100, 98], [20, 98]]); ctx.save(); ctx.fillStyle = "rgba(0,0,0,.22)"; ctx.fillRect(56, 20, 8, 78); ctx.restore();
    }
    // glossy highlight
    ctx.save(); ctx.globalCompositeOperation = "source-atop"; const hl = ctx.createRadialGradient(40, 30, 2, 40, 30, 44); hl.addColorStop(0, "rgba(255,255,255,.55)"); hl.addColorStop(1, "rgba(255,255,255,0)"); ctx.fillStyle = hl; ctx.fillRect(0, 0, SZ, SZ); ctx.restore();
  }
  function base(it) {
    const c = document.createElement("canvas"); c.width = c.height = SZ; const ctx = c.getContext("2d");
    const sh = ctx.createRadialGradient(60, 106, 2, 60, 106, 40); sh.addColorStop(0, "rgba(0,0,0,.45)"); sh.addColorStop(1, "rgba(0,0,0,0)"); ctx.fillStyle = sh; ctx.fillRect(10, 92, 100, 28);
    const layer = document.createElement("canvas"); layer.width = layer.height = SZ; paint(layer.getContext("2d"), shapeOf(it.n), TIER[it.t] || TIER[0]); ctx.drawImage(layer, 0, 0);
    return c;
  }
  function blurred(src, px) {   // horizontal motion blur: stack offset copies
    const c = document.createElement("canvas"); c.width = SZ + px * 2; c.height = SZ; const ctx = c.getContext("2d"); const n = 9;
    for (let i = 0; i < n; i++) { ctx.globalAlpha = 1 / n * 1.6; ctx.drawImage(src, (i / (n - 1)) * px * 2, 0); }
    return c;
  }
  function get(it) {
    const k = it.n + "|" + it.t; let a = cache.get(k); if (a) return a;
    const c = base(it); a = { k, src: [c.toDataURL(), blurred(c, 10).toDataURL(), blurred(c, 24).toDataURL()], imgs: [] };
    cache.set(k, a); return a;
  }
  async function preload(items) {   // decode every version before the spin starts
    const jobs = [];
    items.forEach(it => { const a = get(it); if (a.imgs.length) return; a.imgs = a.src.map(u => { const im = new Image(); im.src = u; jobs.push(im.decode ? im.decode().catch(() => {}) : Promise.resolve()); return im; }); });
    await Promise.all(jobs);
  }
  return { get, preload, TIER };
})();

// =====================================================================
// Case Battles page (demo). Bots, play coins and random pulls. Nothing is real.
// =====================================================================
(() => {
  const $ = (s) => document.querySelector(s), $$ = (s) => [...document.querySelectorAll(s)];
  const rand = (a, b) => a + Math.random() * (b - a), ri = (a, b) => Math.floor(rand(a, b + 1)), pick = (a) => a[Math.floor(Math.random() * a.length)];
  const fmt = (n) => Math.round(n).toLocaleString("en-US");
  const sfx = (k) => window.LR_SFX && window.LR_SFX[k] && window.LR_SFX[k]();
  const IC = {
    left: '<path d="m15 6-6 6 6 6"/>', plus: '<path d="M12 5v14M5 12h14"/>', x: '<path d="M6 6l12 12M18 6 6 18"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>', box: '<path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
    swords: '<path d="M14.5 17.5 3 6V3h3l11.5 11.5"/><path d="m13 19 6-6M16 16l4 4M14.5 6.5 18 3h3v3l-3.5 3.5M5 14l4 4M7 17l-3 3"/>',
    crown: '<path d="M3 18 2 7l5.5 4L12 4l4.5 7L22 7l-1 11z"/>', flag: '<path d="M5 21V4h11l-2 4 2 4H5"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>', trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4"/>',
  };
  const ic = (n) => `<i data-i><svg viewBox="0 0 24 24">${IC[n] || ""}</svg></i>`;
  const paint = (root) => root.querySelectorAll("[data-i]").forEach(e => { const n = e.getAttribute("data-i"); if (n && IC[n] && !e.firstChild) e.innerHTML = `<svg viewBox="0 0 24 24">${IC[n]}</svg>`; });
  paint(document);

  // ---------- data ----------
  // r = colour, w = win chance % (risk), nw = new, cm = community made. Sorted cheapest first.
  const CASES = [
    { n: "Starter", p: 25, r: 0, w: 60 }, { n: "Pocket Change", p: 40, r: 5, w: 50, cm: 1 }, { n: "Bronze", p: 60, r: 0, w: 50 },
    { n: "Neon", p: 120, r: 1, w: 40 }, { n: "Slime Time", p: 180, r: 5, w: 25, nw: 1 }, { n: "Frost", p: 250, r: 1, w: 40 },
    { n: "Bacon Hair", p: 340, r: 0, w: 20, cm: 1 }, { n: "Royal", p: 480, r: 2, w: 25 }, { n: "Ember", p: 620, r: 4, w: 20, nw: 1 },
    { n: "Void", p: 900, r: 2, w: 10 }, { n: "Lucky Clover", p: 1100, r: 5, w: 40, cm: 1 }, { n: "Gold Rush", p: 1500, r: 3, w: 25 },
    { n: "Crimson", p: 1850, r: 4, w: 10 }, { n: "Deep Sea", p: 2200, r: 1, w: 20, nw: 1 }, { n: "Dragon", p: 3000, r: 3, w: 10 },
    { n: "Nebula", p: 4200, r: 2, w: 5, nw: 1 }, { n: "Inferno", p: 6500, r: 4, w: 5 }, { n: "Crown Jewel", p: 9800, r: 3, w: 5, cm: 1 },
  ];
  const MODES = { classic: { ic: "swords", t: "CLASSIC" }, jackpot: { ic: "crown", t: "JACKPOT" }, terminal: { ic: "flag", t: "TERMINAL" } };
  const TEAMS = ["1v1", "1v1", "1v1v1", "2v2", "1v1v1v1", "2v2", "4v4"];
  const BOTS = ["Worseoor", "KINGtoasty", "shimiepookie", "Ytypical", "NeoDid", "FruitSalad", "Yaga", "spooky", "PizzaKing", "noobmaster", "LunaFox", "Kiwi", "Tater", "vqlres", "ivory", "Slider", "Fob55"];
  const ME = "Player_8869";
  const groups = (t) => t.split("v").map(Number);
  const seats = (t) => groups(t).reduce((a, b) => a + b, 0);
  const pull = (c) => { const x = Math.random(); const m = x < .55 ? rand(.15, .8) : x < .88 ? rand(.8, 1.8) : x < .98 ? rand(1.8, 4.5) : rand(5, 12); return c.p * m; };
  let uid = 0;
  function makeBattle(state) {
    const t = pick(TEAMS), n = ri(1, 8), cs = Array.from({ length: n }, () => ri(0, Math.random() < .7 ? 9 : CASES.length - 1));
    const b = { id: ++uid, mode: pick(["classic", "classic", "jackpot", "terminal"]), teams: t, cases: cs, round: -1, state: "waiting", players: Array(seats(t)).fill(null), winner: null };
    const fill = state === "waiting" ? ri(1, seats(t) - 1) : seats(t);
    for (let i = 0; i < fill; i++) b.players[i] = { n: pick(BOTS), total: 0, last: 0 };
    if (state === "live") { b.state = "live"; b.round = ri(0, n - 1); for (let r = 0; r <= b.round; r++) roll(b, r); }
    return b;
  }
  const cost = (b) => b.cases.reduce((a, k) => a + CASES[k].p, 0);
  const unboxed = (b) => b.players.reduce((a, p) => a + (p ? p.total : 0), 0);
  // every case gets 8 items (made up names, CSS drawn, no images)
  const ITEM_NAMES = ["Rusty Blade", "Bacon Pack", "Noob Hat", "Neon Shades", "Ice Crown", "Golden Wings", "Dragon Egg", "Void Orb", "Star Cape", "Slime Pet", "Lucky Coin", "Ember Sword", "Pixel Cat", "Frost Bow", "Ruby Ring", "Moon Boots", "Cloud Pet", "Gem Shield", "Royal Robe", "Cosmic Halo", "Laser Gun", "Tiny Dino", "Party Hat", "Crystal Staff"];
  const MULTS = [.2, .35, .55, .85, 1.3, 2.2, 4.5, 10], WEIGHTS = [26, 24, 18, 13, 9, 6, 3, 1];
  CASES.forEach((c, k) => { c.items = MULTS.map((m, i) => ({ n: ITEM_NAMES[(k * 5 + i * 7) % ITEM_NAMES.length], v: Math.round(c.p * m), t: Math.min(5, Math.floor(i * .75)) })); });
  const rollItem = (c) => { let x = Math.random() * 100; for (let i = 0; i < 8; i++) { x -= WEIGHTS[i]; if (x <= 0) return c.items[i]; } return c.items[0]; };
  function roll(b, r) { b.players.forEach(p => { if (!p) return; const it = rollItem(CASES[b.cases[r]]); p.item = it; p.last = it.v; p.total += it.v; (p.hist = p.hist || [])[r] = it; }); }
  const teamOf = (b, i) => { let k = 0, s = 0; for (const g of groups(b.teams)) { if (i < s + g) return k; s += g; k++; } return 0; };
  function decide(b) {
    const g = groups(b.teams), tot = g.map(() => 0), last = g.map(() => 0);
    b.players.forEach((p, i) => { tot[teamOf(b, i)] += p.total; last[teamOf(b, i)] += p.last; });
    if (b.mode === "terminal") return last.indexOf(Math.max(...last));
    if (b.mode === "underdog") return tot.indexOf(Math.min(...tot));
    if (b.mode === "jackpot") { let x = Math.random() * tot.reduce((a, c) => a + c, 0); for (let k = 0; k < tot.length; k++) { x -= tot[k]; if (x <= 0) return k; } return tot.length - 1; }
    return tot.indexOf(Math.max(...tot));
  }
  let battles = [makeBattle("live"), makeBattle("waiting"), makeBattle("live"), makeBattle("waiting"), makeBattle("live"), makeBattle("live"), makeBattle("waiting")];

  // ---------- render ----------
  const list = $("#cbList"); let filter = "all", sortMode = 0;
  const caseEl = (k, cls = "") => `<div class="case r${CASES[k].r} ${cls}" title="${CASES[k].n} · ${fmt(CASES[k].p)}"><i></i></div>`;
  const av = (p, i, b) => {
    if (!p) return `<button class="slot empty" data-join="${b.id}" title="Join">${ic("plus")}</button>`;
    const me = p.n === ME, won = b.state === "done" && teamOf(b, i) === b.winner;
    return `<span class="slot ${me ? "me" : ""} ${won ? "won" : ""} ${b.state === "done" && !won ? "lost" : ""}" title="${p.n}">${p.n[0].toUpperCase()}</span>`;
  };
  function rowHTML(b) {
    const g = groups(b.teams); let i = 0;
    const slots = g.map(n => { let h = ""; for (let k = 0; k < n; k++, i++) h += av(b.players[i], i, b); return `<span class="team">${h}</span>`; }).join('<span class="vs">×</span>');
    const cur = b.state === "live" ? b.round : b.state === "done" ? b.cases.length : -1;
    const cases = b.cases.map((k, r) => caseEl(k, r < cur ? "done" : r === cur ? "cur" : "")).join("");
    const mine = b.players.some(p => p && p.n === ME);
    let btn;
    if (b.state === "waiting") btn = mine ? `<button class="btn ghost" disabled>WAITING FOR PLAYERS</button>` : `<button class="btn blue" data-join="${b.id}">JOIN · <span class="coin sm"></span>${fmt(cost(b))}</button>`;
    else if (b.state === "live") btn = `<button class="btn ghost" data-watch="${b.id}">${ic("eye")}WATCH BATTLE</button>`;
    else btn = `<button class="btn ghost" data-watch="${b.id}">${ic("trophy")}VIEW RESULT</button>`;
    const M = MODES[b.mode];
    return `<div class="cb-top">
        <span class="it">${ic("box")}${b.cases.length}</span><span class="it gold"><span class="coin sm"></span>${fmt(cost(b))}</span>
        <span class="it">${b.state === "live" ? `<span class="live-dot"></span>Round ${b.round + 1}/${b.cases.length}` : b.state === "waiting" ? `${b.players.filter(Boolean).length}/${b.players.length} joined` : "Finished"}</span>
        <span class="unb">Unboxed: <span class="coin sm"></span><b class="num">${fmt(unboxed(b))}</b></span></div>
      <div class="cb-body">
        <div class="cb-mode">${ic(M.ic)}<b>${M.t}</b><small>${b.teams}</small></div>
        <div class="cb-cases"><div class="track">${cases}</div></div>
        <div class="cb-side"><div class="slots">${slots}</div>${btn}</div>
      </div>`;
  }
  function render() {
    let v = battles.filter(b => filter === "all" || (filter === "open" ? b.state === "waiting" : b.state === "live"));
    if (sortMode) v = [...v].sort((a, c) => (cost(c) - cost(a)) * (sortMode === 1 ? 1 : -1));
    const ids = v.map(b => b.id);
    [...list.children].forEach(el => { if (!ids.includes(+el.dataset.id)) el.remove(); });
    v.forEach((b, k) => {
      let el = list.querySelector(`[data-id="${b.id}"]`);
      if (!el) { el = document.createElement("div"); el.className = "cb enter"; el.dataset.id = b.id; setTimeout(() => el.classList.remove("enter"), 500); }
      el.dataset.mode = b.mode; el.classList.toggle("is-done", b.state === "done"); el.classList.toggle("is-mine", b.players.some(p => p && p.n === ME));
      const h = rowHTML(b); if (el._h !== h) { el.innerHTML = h; el._h = h; paint(el); }
      if (list.children[k] !== el) list.insertBefore(el, list.children[k] || null);
    });
    if (!v.length) list.innerHTML = `<div class="cb-empty">No battles here right now. Create one!</div>`;
    else list.querySelector(".cb-empty")?.remove();
    $("#cbLive").textContent = battles.filter(b => b.state === "live").length;
  }

  // ---------- simulation ----------
  function start(b) { b.state = "live"; b.round = 0; roll(b, 0); }
  function finish(b) {
    b.state = "done"; b.winner = decide(b);
    const meIdx = b.players.findIndex(p => p.n === ME);
    if (meIdx >= 0) {
      if (teamOf(b, meIdx) === b.winner) {
        const share = unboxed(b) / groups(b.teams)[b.winner];
        LR.addCoins(share, list.querySelector(`[data-id="${b.id}"]`) || $("#cbList"));
        LR.toast(`<span class="coin"></span> You won the battle! +${fmt(share)} play coins`);
      } else LR.toast("You lost this battle. Better luck next one");
    }
    setTimeout(() => { battles = battles.filter(x => x !== b); if (battles.length < 7) battles.push(makeBattle(Math.random() < .5 ? "waiting" : "live")); render(); }, b.players.some(p => p.n === ME) ? 9000 : 5000);
  }
  setInterval(() => {
    battles.forEach(b => {
      if (b.state === "live" && b.watch) return;
      if (b.state === "live") { if (b.fast || Math.random() < .55) { b.round++; if (b.round >= b.cases.length) { b.round = b.cases.length - 1; finish(b); } else roll(b, b.round); } }
      else if (b.state === "waiting" && !b.players.some(p => p && p.n === ME) && Math.random() < .12) {
        const i = b.players.indexOf(null); b.players[i] = { n: pick(BOTS), total: 0, last: 0 }; if (!b.players.includes(null)) start(b);
      }
    });
    if (battles.length < 8 && Math.random() < .08) battles.unshift(makeBattle("waiting"));
    if (!$("#view-battles").hidden) render();
  }, 1500);

  function joinBattle(b, seat) {
    if (!b || b.state !== "waiting" || b.players.some(p => p && p.n === ME)) return false;
    if (!LR.spend(cost(b))) { LR.toast("Not enough play coins. Press + to claim more"); return false; }
    sfx("click"); const i = seat != null && !b.players[seat] ? seat : b.players.indexOf(null);
    b.players[i] = { n: ME, total: 0, last: 0 };
    if (!b.players.includes(null)) start(b); else botsFill(b);
    LR.toast(`Joined a ${b.teams} battle`); render(); return true;
  }
  function botsFill(b) {
    const step = () => { const i = b.players.indexOf(null); if (i < 0) return; b.players[i] = { n: pick(BOTS), total: 0, last: 0 }; if (!b.players.includes(null)) start(b); render(); if (b.players.includes(null)) setTimeout(step, rand(700, 1600)); };
    setTimeout(step, rand(900, 1800));
  }
  list.addEventListener("click", (e) => {
    const j = e.target.closest("[data-join]"), w = e.target.closest("[data-watch]");
    if (j) {
      if (joinBattle(battles.find(x => x.id === +j.dataset.join))) location.hash = "battle-" + j.dataset.join;
    } else if (w) location.hash = "battle-" + w.dataset.watch;
  });
  $$("#cbSort button").forEach(b => b.addEventListener("click", () => { $$("#cbSort button").forEach(x => x.classList.remove("on")); b.classList.add("on"); filter = b.dataset.s; render(); }));
  $("#cbFilter").addEventListener("click", () => { sortMode = (sortMode + 1) % 3; LR.toast(["Newest first", "Most expensive first", "Cheapest first"][sortMode]); render(); });

  // ---------- create battle page ----------
  Object.assign(IC, {
    sortdn: '<path d="M4 6h10M4 12h7M4 18h4M18 5v14M15 16l3 3 3-3"/>', sortup: '<path d="M4 6h4M4 12h7M4 18h10M18 19V5M15 8l3-3 3 3"/>',
    shuffle: '<path d="M3 7h3c4 0 6 10 10 10h5M3 17h3c1.5 0 2.7-1.4 3.8-3M14 8.8C15 7.6 16 7 17 7h4M18 4l3 3-3 3M18 14l3 3-3 3"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>', check: '<path d="M20 6 9 17l-5-5"/>', user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    minus: '<path d="M5 12h14"/>', down: '<path d="m6 9 6 6 6-6"/>', bot: '<rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01"/>',
  });
  MODES.underdog = { ic: "down", t: "UNDERDOG" }; paint(document);
  const MODE_INFO = {
    classic: "The team with the biggest total after every case wins the whole pot.",
    jackpot: "Your chance to win is your share of the total. Bigger pulls, better odds.",
    terminal: "Only the last case counts. Everything before it is just for show.",
    underdog: "Flip it around: the lowest total wins. Bad luck pays here.",
  };
  const FORMATS = { solo: ["1v1", "1v1v1", "1v1v1v1"], teams: ["2v2", "3v3", "4v4", "2v2v2"] };
  const cr = { cases: [], format: "solo", teams: "1v1", seat: 0, mode: "classic" };
  const $grid = $("#crGrid");
  const crCost = () => cr.cases.reduce((a, k) => a + CASES[k].p, 0);
  const counts = () => { const m = new Map(); cr.cases.forEach(k => m.set(k, (m.get(k) || 0) + 1)); return m; };

  function drawGrid() {
    const order = []; cr.cases.forEach(k => { if (!order.includes(k)) order.push(k); });
    const c = counts();
    $grid.innerHTML = order.map(k => `<div class="cr-case r${CASES[k].r}">
        <button class="cr-x" data-rm="${k}" title="Remove all">${ic("x")}</button>
        ${chest(k)}<b>${CASES[k].n}</b><small><span class="coin sm"></span>${fmt(CASES[k].p)}</small>
        <div class="qty"><button data-dec="${k}">${ic("minus")}</button><span class="num">${c.get(k)}</span><button data-inc="${k}">${ic("plus")}</button></div>
      </div>`).join("") + `<button class="cr-add" id="crAdd">${ic("plus")}<b>ADD CASE</b><small>${cr.cases.length ? "Add more cases" : "Pick the cases for this battle"}</small></button>`;
    paint($grid); drawSum();
  }
  function drawSum() {
    const c = crCost(), n = seats(cr.teams);
    $("#crCost").textContent = fmt(c); $("#crPot").textContent = fmt(c * n);
    $("#crRounds").textContent = `${cr.cases.length} round${cr.cases.length === 1 ? "" : "s"}`;
    $("#crGo").disabled = $("#crBots").disabled = !cr.cases.length;
    $("#crGo").innerHTML = `CREATE BATTLE · <span class="coin sm"></span>${fmt(c)}`;
    $("#crBots").innerHTML = `${ic("bot")}PLAY VS BOTS · <span class="coin sm"></span>${fmt(c)}`;
  }
  function drawPlayers() {
    $("#crPlayers").innerHTML = FORMATS[cr.format].map(t => `<button class="${t === cr.teams ? "on" : ""}" data-v="${t}">${t}</button>`).join("");
  }
  function drawSeats() {
    let i = 0;
    $("#crSeats").innerHTML = groups(cr.teams).map(g => { let h = ""; for (let k = 0; k < g; k++, i++) h += `<button class="seat ${i === cr.seat ? "on" : ""}" data-seat="${i}" title="${i === cr.seat ? "Your seat" : "Sit here"}">${ic("user")}</button>`; return `<div class="seat-team">${h}</div>`; }).join("");
    drawSum();
  }
  function drawModes() {
    $("#crModes").innerHTML = Object.keys(MODE_INFO).map(m => `<button class="mode ${m === cr.mode ? "on" : ""}" data-m="${m}">
      <span class="mode-ic m-${m}">${ic(MODES[m].ic)}</span><span class="mode-t"><b>${MODES[m].t}</b><small>${MODE_INFO[m]}</small></span><span class="mode-ck">${ic("check")}</span></button>`).join("");
  }
  $grid.addEventListener("click", (e) => {
    const t = e.target.closest("button"); if (!t) return;
    if (t.id === "crAdd") return openPicker(true);
    if (t.dataset.inc) { if (cr.cases.length >= 25) return LR.toast("Max 25 cases"); cr.cases.push(+t.dataset.inc); }
    if (t.dataset.dec) { const i = cr.cases.lastIndexOf(+t.dataset.dec); cr.cases.splice(i, 1); }
    if (t.dataset.rm) cr.cases = cr.cases.filter(k => k !== +t.dataset.rm);
    sfx("click"); drawGrid();
  });
  $("#crSortDn").addEventListener("click", () => { cr.cases.sort((a, b) => CASES[b].p - CASES[a].p); drawGrid(); LR.toast("Most expensive first"); });
  $("#crSortUp").addEventListener("click", () => { cr.cases.sort((a, b) => CASES[a].p - CASES[b].p); drawGrid(); LR.toast("Cheapest first"); });
  $("#crShuffle").addEventListener("click", () => { cr.cases.sort(() => Math.random() - .5); drawGrid(); LR.toast("Case order shuffled"); });
  $("#crClear").addEventListener("click", () => { cr.cases = []; drawGrid(); });
  $("#crFormat").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; $$("#crFormat button").forEach(x => x.classList.toggle("on", x === b)); cr.format = b.dataset.v; cr.teams = FORMATS[cr.format][0]; cr.seat = 0; drawPlayers(); drawSeats(); });
  $("#crPlayers").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; cr.teams = b.dataset.v; cr.seat = Math.min(cr.seat, seats(cr.teams) - 1); drawPlayers(); drawSeats(); });
  $("#crSeats").addEventListener("click", (e) => { const b = e.target.closest(".seat"); if (!b) return; cr.seat = +b.dataset.seat; sfx("click"); drawSeats(); });
  $("#crModes").addEventListener("click", (e) => { const b = e.target.closest(".mode"); if (!b) return; cr.mode = b.dataset.m; drawModes(); });

  // case picker popup
  Object.assign(IC, { star: '<path d="m12 3 2.7 5.6 6.1.8-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.8z"/>', users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>' });
  paint(document);
  const RISKS = [60, 50, 40, 25, 20, 10, 5];
  const riskCol = (w) => ({ 60: "#3ccf7a", 50: "#8bd448", 40: "#d6c64a", 25: "#e8a84a", 20: "#e8884a", 10: "#e5684d", 5: "#e5484d" })[w];
  let favs = []; try { favs = JSON.parse(localStorage.getItem("lr_favs") || "[]"); } catch (e) {}
  const pk = { tab: "all", risk: null, community: true, sort: "price-asc" };
  const modal = $("#cbModal");
  $("#mRisk").innerHTML = RISKS.map(w => `<button data-w="${w}" style="--rc:${riskCol(w)}">${w}%</button>`).join("");
  const chest = (k) => `<div class="chest r${CASES[k].r}"><i class="lid"></i><i class="body"></i><i class="lock"></i></div>`;
  function drawPicker() {
    const q = $("#mQ").value.trim().toLowerCase(), c = counts();
    const lo = parseFloat($("#mMin").value) || 0, hi = parseFloat($("#mMax").value) || Infinity;
    let ks = CASES.map((_, k) => k).filter(k => {
      const x = CASES[k];
      return (!q || x.n.toLowerCase().includes(q)) && x.p >= lo && x.p <= hi && (pk.risk == null || x.w === pk.risk)
        && (pk.tab !== "fav" || favs.includes(x.n)) && (pk.tab !== "new" || x.nw) && (pk.community || !x.cm);
    });
    const [key, dir] = pk.sort.split("-"), d = dir === "asc" ? 1 : -1;
    ks.sort((a, b) => key === "name" ? CASES[a].n.localeCompare(CASES[b].n) * d : key === "risk" ? (CASES[b].w - CASES[a].w) * d : (CASES[a].p - CASES[b].p) * d);
    $("#mCases").innerHTML = ks.map(k => {
      const x = CASES[k], n = c.get(k) || 0, fav = favs.includes(x.n);
      return `<div class="pc ${n ? "has" : ""}" data-k="${k}">
        <button class="pc-star ${fav ? "on" : ""}" data-fav="${k}" title="Favorite">${ic("star")}</button>
        ${x.cm ? `<span class="pc-tag" title="Community case">${ic("users")}</span>` : x.nw ? '<span class="pc-tag new">NEW</span>' : ""}
        ${chest(k)}
        <b>${x.n}</b><span class="pc-price"><span class="coin sm"></span>${fmt(x.p)}</span>
        <div class="risk" title="${x.w}% chance to profit"><i style="left:${100 - x.w / 60 * 92}%"></i></div>
        ${n ? `<div class="pc-qty"><button data-dec="${k}">${ic("minus")}</button><span class="num">${n}</span><button data-inc="${k}">${ic("plus")}</button></div>`
            : `<button class="pc-add" data-inc="${k}">${ic("plus")}ADD</button>`}
      </div>`;
    }).join("") || '<p class="m-none">No cases match these filters</p>';
    paint($("#mCases"));
    const tot = crCost(); $("#mTotal").textContent = fmt(tot);
    const after = LR.bal - tot; $("#mAfter").textContent = fmt(after); $("#mAfter").parentElement.classList.toggle("neg", after < 0);
    $("#mCount").textContent = cr.cases.length;
  }
  const openPicker = (o) => { modal.hidden = !o; if (o) { drawPicker(); setTimeout(() => $("#mQ").focus(), 50); } else drawGrid(); };
  $("#mCases").addEventListener("click", (e) => {
    const t = e.target.closest("button"); if (!t) return;
    if (t.dataset.fav) { const n = CASES[+t.dataset.fav].n; favs = favs.includes(n) ? favs.filter(x => x !== n) : [...favs, n]; try { localStorage.setItem("lr_favs", JSON.stringify(favs)); } catch (er) {} }
    else if (t.dataset.inc) { if (cr.cases.length >= 25) return LR.toast("Max 25 cases"); cr.cases.push(+t.dataset.inc); }
    else if (t.dataset.dec) cr.cases.splice(cr.cases.lastIndexOf(+t.dataset.dec), 1);
    sfx("click"); drawPicker();
  });
  ["#mQ", "#mMin", "#mMax"].forEach(id => $(id).addEventListener("input", drawPicker));
  $("#mSort").addEventListener("change", (e) => { pk.sort = e.target.value; drawPicker(); });
  $("#mRisk").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; const w = +b.dataset.w; pk.risk = pk.risk === w ? null : w; $$("#mRisk button").forEach(x => x.classList.toggle("on", +x.dataset.w === pk.risk)); drawPicker(); });
  $("#mTabs").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; pk.tab = b.dataset.t; $$("#mTabs button").forEach(x => x.classList.toggle("on", x === b)); drawPicker(); });
  $("#mComm").addEventListener("change", (e) => { pk.community = e.target.checked; drawPicker(); });
  $("#cbX").addEventListener("click", () => openPicker(false)); $("#mDone").addEventListener("click", () => openPicker(false));
  modal.addEventListener("click", (e) => { if (e.target === modal) openPicker(false); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) openPicker(false); });

  function createBattle(vsBots) {
    const c = crCost(); if (!c) return;
    if (!LR.spend(c)) return LR.toast("Not enough play coins. Press + to claim more");
    const b = { id: ++uid, mode: cr.mode, teams: cr.teams, cases: [...cr.cases], round: -1, state: "waiting", players: Array(seats(cr.teams)).fill(null), winner: null, priv: $("#crPrivate").checked, fast: $("#crFast").checked };
    b.players[cr.seat] = { n: ME, total: 0, last: 0 };
    if (vsBots) { b.players = b.players.map(p => p || { n: pick(BOTS) + " (bot)", total: 0, last: 0 }); start(b); } else botsFill(b);
    battles.unshift(b); cr.cases = []; drawGrid();
    filter = "all"; $$("#cbSort button").forEach(x => x.classList.toggle("on", x.dataset.s === "all"));
    location.hash = "battle-" + b.id; LR.toast(vsBots ? "Battle vs bots started" : "Battle created. Waiting for players...");
  }
  $("#crGo").addEventListener("click", () => createBattle(false));
  $("#crBots").addEventListener("click", () => createBattle(true));
  $("#cbCreate").addEventListener("click", () => { location.hash = "create"; });
  $("#crBack").addEventListener("click", () => { location.hash = "battles"; });
  drawPlayers(); drawSeats(); drawModes(); drawGrid();

  // ---------- battle viewer (#battle-ID) ----------
  Object.assign(IC, { copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>', shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>' });
  paint(document);
  const tok = (it, cls = "") => `<div class="tok t${it.t} ${cls}"><i></i><small class="num">${fmt(it.v)}</small></div>`;
  const V = { b: null, shown: -1, busy: false, sig: "", seeded: false, timer: null, reels: {} };
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  function teamCols(b) { return groups(b.teams); }

  // ---- premium reel: virtual strip + recycled element pool, driven by one rAF loop ----
  const SLOT = 92, LEN = 72, TGT = 62;
  const easeOut = (p) => 1 - Math.pow(1 - p, 4.2);           // heavy ease, between cubic and quint
  class Reel {
    constructor(el) {
      this.el = el; this.track = el.querySelector(".rv-track"); this.label = el.querySelector(".rv-label");
      this.w = el.clientWidth || 300; this.pool = []; this.blur = -1;
      const n = Math.ceil(this.w / (SLOT - 8)) + 4;
      for (let i = 0; i < n; i++) { const d = document.createElement("div"); d.className = "rit"; d.innerHTML = '<div class="rit-in"><img alt="" draggable="false"></div>'; d._img = d.querySelector("img"); d._idx = -1; this.track.appendChild(d); this.pool.push(d); }
    }
    build(caseIdx, target) {   // random-looking strip, target fixed at TGT, near-miss teasers around it
      const c = CASES[caseIdx]; this.items = []; this.xs = []; this.rot = []; let x = 0;
      for (let i = 0; i < LEN; i++) {
        let it = i === TGT ? target : rollItem(c);
        if (target && Math.abs(i - TGT) <= 2 && i !== TGT && Math.random() < .45) it = c.items[ri(5, 7)];
        this.items.push(it); this.xs.push(x); this.rot.push(rand(-7, 7)); x += SLOT + rand(-5, 9);
      }
      this.end = this.xs[TGT] + SLOT / 2 - this.w / 2;
      this.start = this.xs[3] + rand(0, SLOT) - this.w / 2; this.s = this.start; this.lastC = -1; this.landed = false;
      this.pool.forEach(d => { d._idx = -1; d.className = "rit"; });
      this.label.className = "rv-label"; this.label.innerHTML = "";
    }
    render(s, v) {
      const lvl = v > 34 ? 2 : v > 12 ? 1 : 0;
      const relevel = lvl !== this.blur; this.blur = lvl;
      // first visible slot (monotonic, small search)
      let f = Math.max(0, Math.floor((s - SLOT) / (SLOT + 2)) - 1); while (f > 0 && this.xs[f] > s - SLOT) f--; while (f < LEN - 1 && this.xs[f + 1] < s - SLOT) f++;
      for (let k = 0; k < this.pool.length; k++) {
        const d = this.pool[k], i = f + k;
        if (i >= LEN) { if (d._idx !== -2) { d.style.visibility = "hidden"; d._idx = -2; } continue; }
        if (d._idx !== i || relevel) {
          const a = LRArt.get(this.items[i]);
          d._img.src = a.src[lvl]; d._img.className = "b" + lvl; d.dataset.t = this.items[i].t;
          if (d._idx === -2) d.style.visibility = ""; d._idx = i;
        }
        d.style.transform = `translate3d(${(this.xs[i] - s).toFixed(2)}px,0,0) rotate(${(this.rot[i] * (1 - Math.min(1, v / 40))).toFixed(2)}deg)`;
      }
      // tick when a new item crosses the centre line
      const c = s + this.w / 2; let ci = Math.max(0, f); while (ci < LEN - 1 && this.xs[ci + 1] <= c) ci++;
      const crossed = ci !== this.lastC; this.lastC = ci; return crossed;
    }
    frameAt(s) { this.s = s; this.render(s, 0); }
    land(rare) {
      this.landed = true; const it = this.items[TGT];
      const d = this.pool.find(x => x._idx === TGT); if (d) { d.className = "rit win t" + it.t + (rare ? " rare" : ""); d.style.transform = `translate3d(${(this.xs[TGT] - this.end).toFixed(2)}px,0,0)`; }
      this.el.classList.add("landed");
      this.label.className = "rv-label show t" + it.t;
      this.label.innerHTML = `<b>${it.n}</b><span><span class="coin sm"></span><span class="num">0</span></span>`;
      countUp(this.label.querySelector(".num"), it.v, rare ? 1100 : 700);
    }
  }
  function countUp(el, to, ms, from = 0) { const t0 = performance.now(); (function f(t) { const k = Math.min(1, (t - t0) / ms); el.textContent = fmt(from + (to - from) * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(f); })(t0); }
  function shake(el, power) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const k = []; for (let i = 0; i < 8; i++) { const f = power * (1 - i / 8); k.push({ transform: `translate3d(${rand(-f, f).toFixed(1)}px,${rand(-f, f).toFixed(1)}px,0)` }); } k.push({ transform: "translate3d(0,0,0)" });
    el.animate(k, { duration: 380, easing: "ease-out" });
  }
  function burst(el, col, n) {   // particles for rare pulls (created after the reel stops)
    const r = el.getBoundingClientRect(), host = el;
    for (let i = 0; i < n; i++) {
      const p = document.createElement("i"); p.className = "spark"; p.style.background = col; host.appendChild(p);
      const a = rand(0, Math.PI * 2), d = rand(40, 120), sz = rand(3, 7);
      p.style.width = p.style.height = sz + "px";
      p.animate([{ transform: "translate3d(0,0,0) scale(1)", opacity: 1 }, { transform: `translate3d(${Math.cos(a) * d}px,${Math.sin(a) * d * .7}px,0) scale(.2)`, opacity: 0 }],
        { duration: rand(600, 1100), easing: "cubic-bezier(.15,.7,.3,1)" }).onfinish = () => p.remove();
    }
  }
  function spinRound(r, base) {   // every reel starts on the same frame; each stops on its own
    const b = V.b, list = [];
    $$("#bvArena .sv").forEach(el => {
      const i = +el.dataset.seatI, p = b.players[i], R = V.reels[i]; if (!p || !R) return;
      R.build(b.cases[r], p.hist[r]); R.el.classList.remove("landed");
      list.push({ R, d: base + rand(-450, 450), seat: el, it: p.hist[r], mine: p.n === ME });
    });
    const lead = list.find(x => x.mine) || list[0];
    return new Promise(done => {
      let t0 = null, lastTick = 0, left = list.length;
      function frame(now) {
        if (V.b !== b) return done();
        if (t0 === null) t0 = now;
        for (const x of list) {
          if (x.R.landed) continue;
          const p = Math.min(1, (now - t0) / x.d), s = x.R.start + (x.R.end - x.R.start) * easeOut(p);
          const v = Math.abs(s - x.R.s); x.R.s = s;
          const crossed = x.R.render(s, p >= 1 ? 0 : v);
          if (crossed && x === lead && now - lastTick > 28) { lastTick = now; window.LR_SFX && LR_SFX.tick(); }
          if (p >= 1) {
            const rare = x.it.t >= 4; x.R.land(rare); left--;
            shake(x.seat, rare ? 7 : 2.5);
            if (rare) { burst(x.R.el, LRArt.TIER[x.it.t], 26); window.LR_SFX && LR_SFX.rare(); }
            else if (x === lead || left === 0) window.LR_SFX && LR_SFX.land();
          }
        }
        if (left > 0) requestAnimationFrame(frame); else { shake($("#bvArena"), 2); done(); }
      }
      requestAnimationFrame(frame);
    });
  }
  function seatHTML(b, i) {
    const p = b.players[i], hist = p && p.hist ? p.hist.slice(0, V.shown + 1).filter(Boolean) : [];
    const head = p ? `<span class="av ${p.n === ME ? "me" : ""}">${p.n[0].toUpperCase()}</span><span class="sv-n"><b>${p.n}</b><small><span class="coin sm"></span><span class="num" data-tot>${fmt(hist.reduce((a, x) => a + x.v, 0))}</span></small></span>`
                   : `<span class="av q">?</span><span class="sv-n"><b>Open seat</b><small>&nbsp;</small></span>`;
    let body;
    if (b.state === "waiting") body = p ? `<div class="sv-mid ready">READY</div>` : `<div class="sv-mid"><small>WAITING</small><button class="btn blue" data-seat="${i}">JOIN · <span class="coin sm"></span>${fmt(cost(b))}</button></div>`;
    else body = `<div class="reel"><div class="rv-track"></div><span class="rmark"></span><div class="rv-label"></div></div>`;
    return `<div class="sv" data-seat-i="${i}"><div class="sv-h">${head}</div>${body}<div class="sv-hist">${hist.map(it => tok(it, "mini")).join("")}</div></div>`;
  }
  function drawArena() {
    const b = V.b, g = teamCols(b), solo = g.every(x => x === 1); let i = 0;
    const arena = $("#bvArena"); arena.className = "bv-arena " + (solo ? "solo" : "teams"); arena.style.setProperty("--cols", solo ? g.length : g[0]);
    arena.innerHTML = g.map((n, t) => { let h = ""; for (let k = 0; k < n; k++, i++) h += seatHTML(b, i); return `<div class="bv-team" data-team="${t}">${h}</div>` + (t < g.length - 1 ? `<span class="bv-sep">${ic(MODES[b.mode].ic)}</span>` : ""); }).join("");
    paint(arena); V.reels = {}; $("#view-battle .bv-result")?.remove();
    if (b.state !== "waiting") arena.querySelectorAll(".sv").forEach(el => {
      const idx = +el.dataset.seatI, p = b.players[idx], reel = el.querySelector(".reel"); if (!p || !reel) return;
      const R = V.reels[idx] = new Reel(reel), r = Math.max(0, V.shown);
      const it = V.shown >= 0 && p.hist && p.hist[r] ? p.hist[r] : null;
      R.build(b.cases[r], it || rollItem(CASES[b.cases[r]])); R.frameAt(R.end); if (it) R.land(false);
    });
    drawTeams(); drawRound();
  }
  function drawRound() {
    const b = V.b, n = b.cases.length, cur = Math.max(0, Math.min(b.state === "waiting" ? 0 : b.round, n - 1));
    const label = b.state === "waiting" ? "Waiting" : b.state === "done" && V.shown >= n - 1 ? "Finished" : `${cur + 1} of ${n}`;
    const next = b.cases.slice(cur + 1, cur + 4);
    $("#bvRound").innerHTML = `<div class="hex"><small>${label}</small><div class="mini-chest">${chest(b.cases[cur])}</div><b><span class="coin sm"></span>${fmt(CASES[b.cases[cur]].p)}</b></div>
      <div class="bv-next">${next.map(k => `<div class="nx" title="${CASES[k].n}">${chest(k)}</div>`).join("")}${b.cases.length - cur - 1 > 3 ? `<span>+${b.cases.length - cur - 4}</span>` : ""}</div>`;
  }
  function teamTotals(b) { const g = groups(b.teams), tot = g.map(() => 0); b.players.forEach((p, i) => { if (p && p.hist) tot[teamOf(b, i)] += p.hist.slice(0, V.shown + 1).reduce((a, x) => a + (x ? x.v : 0), 0); }); return tot; }
  function drawTeams() {
    const b = V.b, g = groups(b.teams), tot = teamTotals(b), sum = tot.reduce((a, c) => a + c, 0); let i = 0;
    $("#bvTeams").innerHTML = g.map((n, t) => {
      let names = ""; for (let k = 0; k < n; k++, i++) { const p = b.players[i]; names += `<span class="tm-p"><span class="av ${p && p.n === ME ? "me" : p ? "" : "q"}">${p ? p.n[0].toUpperCase() : "?"}</span>${p ? p.n : "Open"}</span>`; }
      const pct = sum ? tot[t] / sum * 100 : 100 / g.length, won = b.state === "done" && V.shown >= b.cases.length - 1 && b.winner === t;
      return `<div class="tm c${t % 4} ${won ? "won" : ""}"><div class="tm-ps">${names}</div><div class="tm-bar"><i style="width:${pct}%"></i><span>${b.mode === "jackpot" ? pct.toFixed(2) + "%" : fmt(tot[t])}</span></div></div>` + (t < g.length - 1 ? '<span class="tm-x">×</span>' : "");
    }).join("");
  }
  function refreshTotals() {
    $$("#bvArena .sv").forEach(el => { const p = V.b.players[+el.dataset.seatI]; if (!p || !p.hist) return; const h = p.hist.slice(0, V.shown + 1).filter(Boolean);
      const tEl = el.querySelector("[data-tot]"), to = h.reduce((a, x) => a + x.v, 0), from = to - (h[h.length - 1] ? h[h.length - 1].v : 0);
      countUp(tEl, to, 650, from); tEl.parentElement.classList.remove("bump"); void tEl.offsetWidth; tEl.parentElement.classList.add("bump");
      el.querySelector(".sv-hist").innerHTML = h.map((it, k) => tok(it, "mini" + (k === h.length - 1 ? " fresh" : ""))).join(""); });
    drawTeams(); drawRound();
  }
  function markMVP() {
    const b = V.b; let best = null;
    b.players.forEach((p, i) => (p.hist || []).forEach((it, r) => { if (it && (!best || it.v > best.it.v)) best = { i, r, it }; }));
    if (!best) return;
    const el = $(`#bvArena .sv[data-seat-i="${best.i}"]`); if (!el) return;
    el.classList.add("mvp"); el.querySelector(".sv-h").insertAdjacentHTML("beforeend", `<span class="mvp-tag">MVP · <span class="coin sm"></span>${fmt(best.it.v)}</span>`);
    const chip = el.querySelectorAll(".sv-hist .tok")[best.r]; if (chip) chip.classList.add("mvp");
  }
  function showResult() {
    const b = V.b, meI = b.players.findIndex(p => p && p.n === ME), g = groups(b.teams);
    $$("#bvArena .bv-team").forEach(el => el.classList.toggle(+el.dataset.team === b.winner ? "win" : "lose", true)); markMVP();
    const meWon = meI >= 0 && teamOf(b, meI) === b.winner, share = unboxed(b) / g[b.winner];
    const box = document.createElement("div"); box.className = "bv-result";
    box.innerHTML = `<b>${meI < 0 ? `TEAM ${b.winner + 1} WINS` : meWon ? "YOU WON" : "YOU LOST"}</b>${meI < 0 || meWon ? `<span><span class="coin"></span>${fmt(share)}${g[b.winner] > 1 ? " each" : ""}</span>` : "<span>Better luck next battle</span>"}
      <div><button class="btn ghost" data-go="battles">Back to battles</button><button class="btn blue" data-go="create">New battle</button></div>`;
    $("#view-battle .bv-result")?.remove(); $("#bvTeams").before(box); box.scrollIntoView({ block: "center", behavior: "smooth" }); if (meWon) window.LR_SFX && LR_SFX.coin();
    box.addEventListener("click", (e) => { const t = e.target.closest("[data-go]"); if (t) location.hash = t.dataset.go; });
  }
  function seedOverlay(ms) {
    const o = document.createElement("div"); o.className = "bv-seed"; o.innerHTML = "<b>ROLLING FAIR SEED</b><i></i>"; $("#bvArena").appendChild(o);
    setTimeout(() => o.remove(), ms);
  }
  const battleItems = (b) => b.cases.flatMap(k => CASES[k].items);
  function vTick() {
    const b = V.b; if (!b || V.busy) return;
    const sig = (b.state === "waiting") + "|" + b.players.map(p => p ? p.n : "-").join(","); if (sig !== V.sig) { V.sig = sig; drawArena(); }
    if (b.state === "live" && V.shown < b.round) {
      V.busy = true; const r = b.round;
      (async () => {
        if (!V.seeded) { V.seeded = true; seedOverlay(1400); await Promise.all([LRArt.preload(battleItems(b)), sleep(1400)]); }
        else await LRArt.preload(battleItems(b));
        if (V.b !== b) return;
        await spinRound(r, b.fast ? 3400 : 6900);
        if (V.b !== b) return;
        V.shown = r; refreshTotals();
        await sleep(b.fast ? 700 : 1500);
        if (V.b !== b) return;
        if (r < b.cases.length - 1) { b.round++; roll(b, b.round); }
        else { finish(b); drawTeams(); drawRound(); await sleep(300); showResult(); }
        V.busy = false;
      })();
    }
  }
  function openViewer(id) {
    closeViewer();
    const b = battles.find(x => x.id === id); if (!b) { LR.toast("That battle has ended"); location.hash = "battles"; return false; }
    V.b = b; b.watch = true; V.sig = ""; V.busy = false;
    V.shown = b.state === "done" ? b.cases.length - 1 : b.state === "live" ? b.round - 1 : -1; V.seeded = b.state !== "waiting";
    $("#bvVal").textContent = fmt(cost(b) * b.players.length);
    $("#bvSub").textContent = `${MODES[b.mode].t[0] + MODES[b.mode].t.slice(1).toLowerCase()} mode · ${b.teams}${b.fast ? " · Fast" : ""}`;
    vTick(); if (b.state === "done") showResult();
    V.timer = setInterval(vTick, 250); return true;
  }
  function closeViewer() { if (V.b) V.b.watch = false; V.b = null; clearInterval(V.timer); }
  $("#bvArena").addEventListener("click", (e) => { const s = e.target.closest("[data-seat]"); if (s) joinBattle(V.b, +s.dataset.seat); });
  $("#bvBack").addEventListener("click", () => { location.hash = "battles"; });
  $("#bvLink").addEventListener("click", () => { try { navigator.clipboard.writeText(location.href); } catch (e) {} LR.toast("Battle link copied"); });
  $("#bvFair").addEventListener("click", () => LR.toast("Demo: results use your browser's random numbers"));
  addEventListener("resize", () => { if (V.b && !V.busy) drawArena(); });

  // ---------- routing: #battles, #create, #battle-ID ----------
  function route() {
    const h = location.hash, bm = h.match(/^#battle-(\d+)$/);
    $("#view-battles").hidden = h !== "#battles"; $("#view-create").hidden = h !== "#create"; $("#view-battle").hidden = !bm;
    $("#view-lobby").hidden = h === "#battles" || h === "#create" || !!bm; $("#betsSec").hidden = h === "#create" || !!bm;
    if (bm) openViewer(+bm[1]); else closeViewer();
    const m = $(".main"); if (m) m.scrollTop = 0;
    if (h === "#battles") render();
  }
  addEventListener("hashchange", route); route();
  document.addEventListener("click", (e) => {
    const t = e.target.closest('.tile[data-name="case battles"]'), promo = e.target.closest(".promo .slide .btn");
    if (t || (promo && /BATTLE/.test(promo.textContent))) { e.stopPropagation(); e.preventDefault(); location.hash = t ? "battles" : "create"; return; }
    const pill = e.target.closest(".pill"); if (pill && /GAMES/i.test(pill.textContent)) { e.preventDefault(); location.hash = ""; }
  }, true);
  $("#cbBack").addEventListener("click", () => { location.hash = ""; });
})();
