// LootRush demo, v2 site: home page. Everything is fake: play-money coins, bot chat, random bets. No images.
(() => {
  const $ = (s) => document.querySelector(s), $$ = (s) => [...document.querySelectorAll(s)];
  const rand = (a, b) => a + Math.random() * (b - a), ri = (a, b) => Math.floor(rand(a, b + 1));
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  // money shown in USD: 1,000 coins = $1.00
  const fmt = (n) => (Math.round(n) / 1000).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const two = (n) => String(n).padStart(2, "0");
  // online = the page is served by server.js (it serves net-config.js); otherwise everything is local with bots
  const NET = { on: !!window.LR_SERVER, ws: null, rid: 0, wait: {}, q: [],
    send(o) { if (this.ws && this.ws.readyState === 1) this.ws.send(JSON.stringify(o)); else this.q.push(o); },
    req(t, o = {}) { const rid = ++this.rid; this.send({ ...o, t, rid }); return new Promise(res => { this.wait[rid] = res; setTimeout(() => { if (this.wait[rid]) { delete this.wait[rid]; res({ err: "Server didn't answer, try again" }); } }, 8000); }); } };
  window.LR_NET = NET;
  const ME = window.LR_USER || (NET.on ? "Guest" : "Player_8869");

  // ---------- icons (line icons, painted into [data-i]) ----------
  const I = {
    hexlogo: '<path d="M12 2.5 20.5 7.3v9.4L12 21.5 3.5 16.7V7.3z"/><path d="M9 8.5h3.5a2.2 2.2 0 0 1 0 4.4H9zM9 12.9V16M12.4 12.9l2.6 3.1"/>',
    sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>',
    down: '<path d="m6 9 6 6 6-6"/>', right: '<path d="m9 6 6 6-6 6"/>', x: '<path d="M6 6l12 12M18 6 6 18"/>',
    reply: '<path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 5 5v5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5v.5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
    cart: '<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.5 12h11L21 7H6.2"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>', home: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/>',
    swords: '<path d="M14.5 17.5 3 6V3h3l11.5 11.5"/><path d="m13 19 6-6M16 16l4 4M14.5 6.5 18 3h3v3l-3.5 3.5M5 14l4 4M7 17l-3 3"/>',
    box: '<path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>', up: '<path d="M12 4 4 13h5v7h6v-7h5z"/>',
    gem: '<path d="M7 3h10l5 6-10 12L2 9z"/><path d="M2 9h20"/>', tower: '<path d="M5 21V8l3-3 3 3V4h2v4l3-3 3 3v13z"/><path d="M10 21v-5h4v5"/>',
    chicken: '<path d="M15 4c2 0 3.5 1.5 3.5 3.5 0 .7-.2 1.3-.5 1.8L21 11l-3 .5c-.6 4.5-4 8.5-9 8.5-3 0-5-2-5-4.5C4 12 7 9 11 9c.3-2.8 2-5 4-5z"/><circle cx="15.5" cy="7" r=".8"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>', bolt: '<path d="M13 2 4 14h6l-1 8 9-12h-6z"/>',
    crown: '<path d="M3 18 2 7l5.5 4L12 4l4.5 7L22 7l-1 11z"/>', flag: '<path d="M5 21V4h11l-2 4 2 4H5"/>', clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/>', send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>', smile: '<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0M9 9.5h.01M15 9.5h.01"/>',
    pin: '<path d="M12 22v-6M8 4h8l-1 6 3 3H6l3-3z"/>', play: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10 9 5 3-5 3z"/>', mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    check: '<path d="M20 6 9 17l-5-5"/>', plus: '<path d="M12 5v14M5 12h14"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
    skull: '<path d="M12 3a8 8 0 0 0-8 8c0 3 1.5 4.8 3 5.8V20h10v-3.2c1.5-1 3-2.8 3-5.8a8 8 0 0 0-8-8z"/><circle cx="9" cy="11.5" r="1.6"/><circle cx="15" cy="11.5" r="1.6"/><path d="M11 20v-2M13 20v-2"/>',
    arrowdn: '<path d="M12 4v15M6 13l6 6 6-6"/>', money: '<path d="M9 3h6l-1.5 3h-3z"/><path d="M10.5 6C6 8 4 12 4 15a6 6 0 0 0 6 6h4a6 6 0 0 0 6-6c0-3-2-7-6.5-9"/><path d="M12 10v7M10 12.5c0-1 .9-1.5 2-1.5s2 .5 2 1.5-4 1-4 2.5c0 1 .9 1.5 2 1.5s2-.5 2-1.5"/>',
    left: '<path d="m15 6-6 6 6 6"/>', search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', minus: '<path d="M5 12h14"/>',
    sortdn: '<path d="M4 6h10M4 12h7M4 18h4M18 5v14M15 16l3 3 3-3"/>', sortup: '<path d="M4 6h4M4 12h7M4 18h10M18 19V5M15 8l3-3 3 3"/>',
    shuffle: '<path d="M3 7h3c4 0 6 10 10 10h5M3 17h3c1.5 0 2.7-1.4 3.8-3M14 8.8C15 7.6 16 7 17 7h4M18 4l3 3-3 3M18 14l3 3-3 3"/>',
    broom: '<path d="M14 4 20 10M17 7l-7 7M4 20l4-1 6-6-3-3-6 6z"/>', seat: '<circle cx="12" cy="9" r="3.4"/><path d="M6 19a6 6 0 0 1 12 0"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>', shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.8-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.8z"/>',
    ghost: '<circle cx="12" cy="9" r="3.6"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/>', eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>', vol: '',
  };
  const ic = (n) => `<i data-i><svg viewBox="0 0 24 24">${I[n] || ""}</svg></i>`;
  const paint = (root = document) => root.querySelectorAll("[data-i]").forEach(e => { const n = e.getAttribute("data-i"); if (n && I[n] && !e.firstChild) e.innerHTML = `<svg viewBox="0 0 24 24">${I[n]}</svg>`; });

  // ---------- toast + balance ----------
  let tt; const toast = (h) => { const t = $("#toast"); t.innerHTML = h; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 2200); };
  let bal = 2500; try { bal = NET.on ? 0 : parseFloat(localStorage.getItem("lr2_balance")) || 2500; } catch (e) {}
  let shown = 0;
  const countTo = (v, ms = 700) => { const f = shown, t0 = performance.now(); (function s(t) { const k = Math.min(1, (t - t0) / ms); shown = f + (v - f) * (1 - (1 - k) ** 3); $("#bal").textContent = fmt(shown); if (k < 1) requestAnimationFrame(s); })(t0); };
  countTo(bal, 1000);
  const save = () => { if (NET.on) return; try { localStorage.setItem("lr2_balance", bal); } catch (e) {} };
  function addCoins(n, from) {
    bal += n; save();
    const a = from.getBoundingClientRect(), b = $(".bal").getBoundingClientRect();
    for (let i = 0; i < 9; i++) {
      const c = document.createElement("span"); c.className = "coin fly"; c.style.left = a.left + a.width / 2 + "px"; c.style.top = a.top + a.height / 2 + "px"; document.body.appendChild(c);
      const dx = b.left + 18 - a.left - a.width / 2, dy = b.top + b.height / 2 - a.top - a.height / 2;
      c.animate([{ transform: "translate(0,0) scale(.5)", opacity: 0 }, { transform: `translate(${dx / 2 + rand(-40, 40)}px,${dy / 2 + rand(20, 70)}px) scale(1.1)`, opacity: 1, offset: .5 }, { transform: `translate(${dx}px,${dy}px) scale(.8)`, opacity: .9 }],
        { duration: 600 + i * 45, easing: "cubic-bezier(.3,.7,.2,1)" }).onfinish = () => c.remove();
    }
    setTimeout(() => { countTo(bal); const e = $(".bal"); e.classList.remove("bump"); void e.offsetWidth; e.classList.add("bump"); }, 600);
  }
  let wagered = 0, tipped = 0; try { wagered = +localStorage.getItem("lr2_wagered") || 0; tipped = +localStorage.getItem("lr2_tipped_" + new Date().toDateString()) || 0; } catch (e) {}
  window.LR = { toast, get bal() { return bal; }, addCoins, get wagered() { return wagered; },
    setBal(v) { bal = v; countTo(bal, 500); }, setWager(w, t) { wagered = w; tipped = t; },
    spend(n, wager = true) { if (n > bal) return false; bal -= n; if (wager) { wagered += n; if (!NET.on) try { localStorage.setItem("lr2_wagered", wagered); } catch (e) {} } save(); countTo(bal, 400); return true; } };
  let last = 0;
  $("#claim") && $("#claim").addEventListener("click", (e) => {
    const w = 10000 - (Date.now() - last);
    if (w > 0) return toast(`${ic("clock")} Free coins again in ${Math.ceil(w / 1000)}s`);
    last = Date.now(); const n = ri(25, 100) * 10; addCoins(n, e.currentTarget); toast(`<span class="coin"></span> +${fmt(n)} play coins`);
  });
  $("#bell").addEventListener("click", (e) => { const b = e.currentTarget; b.classList.remove("ring"); void b.offsetWidth; b.classList.add("ring"); b.querySelector(".dot")?.remove(); toast(`${ic("bell")} Welcome to the LootRush demo!`); });
  $$(".wc-name").forEach(e => e.textContent = ME); $(".hb-me").title = window.LR_USER ? ME + " · Level 13" : "Log in";
  $(".hb-me").addEventListener("click", (e) => { e.stopImmediatePropagation(); window.LR_AUTH && LR_AUTH.open(); }, true);
  if (!window.LR_USER) { const b = document.createElement("button"); b.className = "btn blue hb-login"; b.textContent = "Log In"; b.onclick = () => LR_AUTH.open(); $(".hb-me").before(b); }
  const d = new Date(); $("#joined").textContent = `Joined on ${two(d.getMonth() + 1)}/${two(d.getDate())}/${d.getFullYear()}`;
  setTimeout(() => $("#xpbar").style.width = "58.8%", 300);

  // generic "coming soon" for anything not built yet
  document.addEventListener("click", (e) => { const s = e.target.closest("[data-soon]"); if (!s) return; e.preventDefault(); toast(`${ic("clock")} ${s.dataset.soon} is coming in the next update`); });

  // ---------- games dropdown ----------
  const GAMES = [
    { n: "Battles", i: "swords", s: "wide", live: 1, go: "battles", gl: "rgba(47,125,255,.32)" },
    { n: "Cases", i: "box", live: 1, gl: "rgba(57,208,255,.26)" },
    { n: "Upgrader", i: "up", live: 1, gl: "rgba(255,255,255,.14)", gi: "#ffffff" },
    { n: "Mines", i: "gem", live: 1, gl: "rgba(120,140,255,.28)" },
    { n: "Tower", i: "tower", live: 1, tag: "NEW", gl: "rgba(47,125,255,.26)" },
    { n: "Chicken", i: "chicken", live: 1, tag: "NEW", gl: "rgba(255,201,77,.18)", gi: "#ffc94d" },
    { n: "Coming Soon", i: "lock", soon: 1, tag: "NEW" },
  ];
  $("#gamesMenu").innerHTML = GAMES.filter(g => !g.soon).map(g => `<a href="#" ${g.go ? `data-go="${g.go}"` : `data-soon="${g.n}"`}>${ic(g.i)}${g.n}${g.tag ? `<em>${g.tag}</em>` : ""}</a>`).join("");
  const dd = $(".dd");
  $("#gamesBtn").addEventListener("click", (e) => { e.stopPropagation(); dd.classList.toggle("open"); });
  document.addEventListener("click", (e) => { if (!e.target.closest(".dd")) dd.classList.remove("open"); });


  // ---------- Roblox items (images from Roblox's CDN; drawn fallbacks if a link fails) ----------
  // value in coins (1,000 = $1). Cheap common hair/hats are the bad pulls, big limiteds are the good ones.
  const RBX = [
    { k: "pal", id: 63690008, n: "Pal Hair", v: 40, u: "https://tr.rbxcdn.com/180DAY-9584b86683630361b51f29117503044f/150/150/HairAccessory/Png/noFilter", fb: "hat" },
    { k: "visor", id: 2646473721, n: "Roblox Visor", v: 60, u: "https://tr.rbxcdn.com/180DAY-1506b019c1cbf95988a6b404e0182546/150/150/Hat/Png/noFilter", fb: "hat" },
    { k: "tb", id: 451221329, n: "True Blue Hair", v: 80, u: "https://tr.rbxcdn.com/180DAY-0dd60c23e726ef3cbdd42dcd4e394fac/150/150/HairAccessory/Png/noFilter", fb: "hat" },
    { k: "lav", id: 451220849, n: "Lavender Updo", v: 90, u: "https://tr.rbxcdn.com/180DAY-26fb7799b53fd174149d924114ad0367/150/150/HairAccessory/Png/noFilter", fb: "hat" },
    { k: "charm", id: 376548738, n: "Brown Charmer Hair", v: 120, u: "https://tr.rbxcdn.com/180DAY-dfbceeb2533c14c862a3934fe2b88980/150/150/HairAccessory/Png/noFilter", fb: "hat" },
    { k: "bun", id: 25308317, n: "Messy Amber Bun", v: 150, u: "https://tr.rbxcdn.com/180DAY-baf60c8f432862fe097b871a47ec45d0/150/150/HairAccessory/Png/noFilter", fb: "hat" },
    { k: "kitty", id: 1374269, n: "Kitty Ears", v: 190, u: "https://tr.rbxcdn.com/180DAY-ec9a659343e50a4892f2f28a22dae77c/150/150/Hat/Png/noFilter", fb: "pet" },
    { k: "beau", id: 16630147, n: "Beautiful Hair for Beautiful People", v: 210, u: "https://tr.rbxcdn.com/180DAY-e6b3bea674f4ea1073debd8ad220c8c9/150/150/HairAccessory/Png/noFilter", fb: "hat" },
    { k: "band", id: 134822978, n: "Nice Red Bandana", v: 300, u: "https://tr.rbxcdn.com/180DAY-2bd2dd5ef3adc5efc0aaae03bfcc2fba/150/150/FaceAccessory/Png/noFilter", fb: "shades" },
    { k: "big", id: 1048037, n: "Bighead", v: 400, u: "https://tr.rbxcdn.com/180DAY-d9861256dda2bcdef1e98de4817b8664/150/150/Hat/Png/noFilter", fb: "hat" },
    { k: "biv", id: 2163548026, n: "Black Iron Visor", v: 650, u: "https://tr.rbxcdn.com/180DAY-9d9e4316eae7c48496ee3f9e1082324d/150/150/Hat/Png/noFilter", fb: "shades" },
    { k: "adu", id: 2705862977, n: "Adurite Bandana", v: 900, u: "https://tr.rbxcdn.com/180DAY-0affeed9296cc95a61bfbf5b9f033e0a/150/150/FaceAccessory/Png/noFilter", fb: "shades" },
    { k: "horns", id: 628771505, n: "Black Iron Horns", v: 2600, u: "https://tr.rbxcdn.com/180DAY-21c65f4e2ae8aba8cc39a5dad1de8f27/150/150/Hat/Png/noFilter", fb: "crown" },
    { k: "rstb", id: 1360039144, n: "Red Sparkle Time Bandana", v: 9500, u: "https://tr.rbxcdn.com/180DAY-3846a4470225946a33e14289ef93dc8b/150/150/FaceAccessory/Png/noFilter", fb: "shades" },
    { k: "fed", id: 1029025, n: "The Classic ROBLOX Fedora", v: 9800, u: "https://tr.rbxcdn.com/180DAY-1de084fa35fdeace0b12fd5b21077677/150/150/Hat/Png/noFilter", fb: "hat" },
    { k: "clock", id: 1235488, n: "Clockwork's Headphones", v: 18400, u: "https://tr.rbxcdn.com/180DAY-d0db3468dbf03000a63aea76ed970dcf/150/150/Hat/Png/noFilter", fb: "halo" },
    { k: "sshf", id: 494291269, n: "Super Super Happy Face", v: 27300, u: "https://tr.rbxcdn.com/180DAY-c23824ccd04260f4261de2d2d2aa43a9/150/150/Face/Png/noFilter", fb: "pet" },
    { k: "bit", id: 450557238, n: "8-Bit Clockwork Shades", v: 31000, u: "https://tr.rbxcdn.com/180DAY-e1415bc5a85d5a11f921caa5d56f6550/150/150/FaceAccessory/Png/noFilter", fb: "shades" },
    { k: "dom", id: 1031429, n: "Domino Crown", v: 33900, u: "https://tr.rbxcdn.com/180DAY-bbbc2b3aac37c532de6f1be052dab630/150/150/Hat/Png/noFilter", fb: "crown" },
    { k: "pstf", id: 63043890, n: "Purple Sparkle Time Fedora", v: 44100, u: "https://tr.rbxcdn.com/180DAY-a16175e0a0535364f3694fa4d8aeaf96/150/150/Hat/Png/noFilter", fb: "hat" },
    { k: "stf", id: 1285307, n: "Sparkle Time Fedora", v: 61200, u: "https://tr.rbxcdn.com/180DAY-021f90eeacf6ea627994dd5ce8365460/150/150/Hat/Png/noFilter", fb: "hat" },
    { k: "valk", id: 1365767, n: "Valkyrie Helm", v: 96500, u: "https://tr.rbxcdn.com/180DAY-33ebc9fedab2e19a669b6686ad7a656b/150/150/Hat/Png/noFilter", fb: "wings" },
    { k: "dominus", id: 21070012, n: "Dominus Empyreus", v: 412000, u: "https://tr.rbxcdn.com/180DAY-6e4a60bf8300b35bae657874937adc28/150/150/Hat/Png/noFilter", fb: "crown" },
  ];
  window.LR_ITEMS = RBX;
  const itemImg = (it, cls = "") => `<img class="${cls}" src="${it.u}" alt="${it.n}" title="${it.n}" data-fb="img/items/${it.fb}.png" draggable="false" referrerpolicy="no-referrer">`;
  // any item image that fails falls back to our drawn version
  document.addEventListener("error", (e) => { const t = e.target; if (t.tagName === "IMG" && t.dataset.fb && t.src.indexOf(t.dataset.fb) < 0) t.src = t.dataset.fb; }, true);
  // battles card: plays the opening on hover, then loops the floating Dominus part
  const LOOP_AT = 72 / 30;
  document.addEventListener("mouseover", (e) => { const g = e.target.closest && e.target.closest(".g"); const v = g && g.querySelector(".ba-vid"); if (!v || v._on) return; v._on = true; v.currentTime = 0; v.play().catch(() => {}); });
  document.addEventListener("mouseout", (e) => { const g = e.target.closest && e.target.closest(".g"); const v = g && g.querySelector(".ba-vid"); if (!v || (e.relatedTarget && g.contains(e.relatedTarget))) return; v._on = false; v.pause(); v.currentTime = 0; });
  document.addEventListener("ended", (e) => { const v = e.target; if (false) { v.currentTime = LOOP_AT; v.play().catch(() => {}); } }, true);
  // try to refresh the (expiring) Roblox links; if the browser blocks it we keep the saved ones
  fetch(`https://thumbnails.roblox.com/v1/assets?assetIds=${RBX.map(x => x.id).join(",")}&size=150x150&format=Png&isCircular=false`)
    .then(r => r.json()).then(j => (j.data || []).forEach(d => { const it = RBX.find(x => x.id === d.targetId); if (it && d.imageUrl && d.state === "Completed" && d.imageUrl !== it.u) { document.querySelectorAll(`img[title="${it.n}"]`).forEach(im => im.src = d.imageUrl); it.u = d.imageUrl; } }))
    .catch(() => {});

  // ---------- Battles tile art: arched hex-tile room, open case with loot inside, zoom on hover ----------
  const SEAM = "polygon(0 0,100% 0,100% 27%,75% 40%,62% 43%,21% 37%,0 37%)";
  const SEAM_B = "polygon(0 37%,21% 37%,62% 43%,75% 40%,100% 27%,100% 100%,0 100%)";
  const VIDS = { battles: 1, cases: 1, upgrader: 1, mines: 1, tower: 1 };
  const cardArt = (k) => `<div class="ca bv-card" aria-hidden="true"><video class="ba-vid" poster="img/card_${k}.jpg" muted playsinline loop preload="auto"><source src="img/card_${k}.webm" type="video/webm"><source src="img/card_${k}.mp4" type="video/mp4"></video></div>`;

  // ---------- house games grid ----------
  $("#games").innerHTML = GAMES.map(g => `<div class="g deal ${g.s || ""} ${g.soon ? "soon" : ""} ${VIDS[g.n.toLowerCase()] ? "vcard" : ""}" ${g.soon ? "" : g.go ? `data-go="${g.go}"` : `data-soon="${g.n}"`} style="${g.gl ? `--gl:${g.gl};` : ""}${g.gi ? `--gi:${g.gi}` : ""}">
      <div class="g-h">${ic(g.i)}${g.n}</div>${g.tag ? `<span class="g-tag">${g.tag}</span>` : ""}
      ${g.soon ? `<div class="soon-x">${ic("lock")}</div>` : VIDS[g.n.toLowerCase()] ? cardArt(g.n.toLowerCase()) : `<div class="art-slot" data-slot="${g.n.toLowerCase()}-art"></div><div class="g-live"><span class="on-dot"></span><span class="num">${ri(20, 400)}</span> playing</div>`}
    </div>`).join("");
  setInterval(() => $$(".g-live .num").forEach(n => { if (Math.random() < .4) n.textContent = Math.max(5, +n.textContent + ri(-4, 4)); }), 2400);

  // ---------- promo slider + countdown ----------
  const slides = $$(".slide"), dots = $("#dots"); let cur = 0, timer;
  slides.forEach((_, i) => { const b = document.createElement("button"); b.onclick = () => { go(i); restart(); }; dots.appendChild(b); });
  function go(i) { slides[cur].classList.remove("on"); dots.children[cur].classList.remove("on"); cur = (i + slides.length) % slides.length; slides[cur].classList.add("on"); dots.children[cur].classList.add("on"); }
  const restart = () => { clearInterval(timer); timer = setInterval(() => go(cur + 1), 6000); };
  go(0); restart();
  const weekEnd = () => { const n = new Date(), e = new Date(n); e.setDate(n.getDate() + (7 - n.getDay()) % 7 + 1); e.setHours(0, 0, 0, 0); return e; };
  const cdTick = () => { let s = Math.max(0, Math.floor((weekEnd() - Date.now()) / 1000)); const p = [Math.floor(s / 86400), Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60];
    $("#cd").innerHTML = p.map((v, i) => `<div><b>${two(v)}</b><small>${["Days", "Hours", "Min", "Sec"][i]}</small></div>`).join(""); };
  cdTick(); setInterval(cdTick, 1000);

  // ---------- battle highlights (fake) ----------
  const NAMES = ["Babyalien", "Downyluck", "Elonmusk", "Jamal", "Saint", "Speed"];
  // cartoon block-head avatars, drawn per name (same name = same face)
  const FACE = {};
  function faceURI(n) {
    if (FACE[n]) return FACE[n]; let h = 0; for (const c of n) h = (h * 31 + c.charCodeAt(0)) >>> 0; const r = (k) => (h >>> (k * 3)) % 7;
    const bg = ["#3d8bff", "#a78bfa", "#ffc94d", "#ff7a59", "#36c2b4", "#f472b6", "#7c8796"][r(0)], skin = ["#ffd84a", "#f3c79b", "#c98e5b", "#8a5a3b", "#ffd84a", "#ffe08a", "#e0b48a"][r(1)];
    const eyes = [`<circle cx="23" cy="27" r="3"/><circle cx="41" cy="27" r="3"/>`, `<rect x="19" y="25" width="9" height="4" rx="2"/><rect x="36" y="25" width="9" height="4" rx="2"/>`, `<path d="M19 28q4-5 8 0M37 28q4-5 8 0" fill="none" stroke="#15171b" stroke-width="3" stroke-linecap="round"/>`, `<rect x="15" y="22" width="34" height="9" rx="3"/><rect x="18" y="24" width="10" height="4" fill="#3d8bff"/>`, `<circle cx="23" cy="27" r="4.5" fill="#fff" stroke="#15171b" stroke-width="2"/><circle cx="41" cy="27" r="4.5" fill="#fff" stroke="#15171b" stroke-width="2"/><circle cx="24" cy="28" r="2"/><circle cx="40" cy="28" r="2"/>`, `<path d="M18 26l9 3M46 26l-9 3" stroke="#15171b" stroke-width="3" stroke-linecap="round"/><circle cx="23" cy="30" r="2.5"/><circle cx="41" cy="30" r="2.5"/>`, `<circle cx="23" cy="27" r="3"/><path d="M37 27h8" stroke="#15171b" stroke-width="3" stroke-linecap="round"/>`][r(2)];
    const mouth = [`<path d="M23 38q9 8 18 0" fill="none" stroke="#15171b" stroke-width="3" stroke-linecap="round"/>`, `<path d="M22 37q10 10 20 0z"/>`, `<path d="M25 41h14" stroke="#15171b" stroke-width="3" stroke-linecap="round"/>`, `<ellipse cx="32" cy="40" rx="5" ry="6"/>`, `<path d="M23 42q9-7 18 0" fill="none" stroke="#15171b" stroke-width="3" stroke-linecap="round"/>`, `<path d="M22 37q10 10 20 0z"/><rect x="28" y="37" width="8" height="4" fill="#fff"/>`, `<path d="M24 39q4 4 8 0q4 4 8 0" fill="none" stroke="#15171b" stroke-width="3" stroke-linecap="round"/>`][r(3)];
    const hat = [``, `<path d="M10 16h44v-4c0-6-6-10-22-10S10 6 10 12z" fill="#15171b"/><rect x="6" y="14" width="52" height="5" rx="2" fill="#15171b"/>`, `<path d="M12 18c0-10 8-16 20-16s20 6 20 16z" fill="#ff5468" stroke="#15171b" stroke-width="2.5"/><rect x="30" y="0" width="4" height="6" fill="#fff"/>`, `<path d="M12 16q20-18 40 0z" fill="#6b4a2f" stroke="#15171b" stroke-width="2.5"/>`, ``, `<path d="M14 14l6-12 6 9 6-9 6 9 6-9 6 12z" fill="#ffc94d" stroke="#15171b" stroke-width="2.5" stroke-linejoin="round"/>`, `<rect x="10" y="8" width="44" height="10" rx="5" fill="#3d8bff" stroke="#15171b" stroke-width="2.5"/>`][r(4)];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${bg}"/><rect x="12" y="12" width="40" height="44" rx="8" fill="${skin}" stroke="#15171b" stroke-width="3"/><g fill="#15171b">${eyes}${mouth}</g>${hat}</svg>`;
    return FACE[n] = "data:image/svg+xml," + encodeURIComponent(svg);
  }
  // bot pfps: uses img/bots/<BotName>.jpg if it exists, otherwise the block face
  const face = (n) => {
    if (!n) return "?";
    if (n === ME || n === "Player_8869" || n === "You" || n === "LootRush") return n[0].toUpperCase();
    const fb = faceURI(n);
    return `<img class="fc" src="img/bots/${encodeURIComponent(n)}.jpg" onerror="this.onerror=null;this.src='${fb}'" alt="" draggable="false">`;
  };
  const MODES = [["CLASSIC", "swords"], ["JACKPOT", "crown"], ["TERMINAL", "flag"]];
  function hbHTML() {
    const t = pick(["1v1", "2v2", "1v1v1", "3v3"]), g = t.split("v").map(Number), m = pick(MODES), nC = ri(3, 9), val = ri(40, 900) * 50;
    const win = ri(0, g.length - 1); let ps = "";
    g.forEach((n, k) => { for (let j = 0; j < n; j++) { const nm = pick(NAMES); ps += `<span class="av ${k === win ? "win" : ""}" title="${nm}">${face(nm)}</span>`; } if (k < g.length - 1) ps += '<span class="x">vs</span>'; });
    const cases = Array.from({ length: Math.min(nC, 4) }, () => { const k = ri(0, CASES.length - 1); return `<span class="hb-case" title="${CASES[k].n}"><img src="img/case.png" alt="" style="filter:${CASES[k].f}" draggable="false"></span>`; }).join("") + (nC > 4 ? `<span class="hb-more">+${nC - 4}</span>` : "");
    return `<div class="hb deal"><div class="hb-top"><span class="hb-mode">${ic(m[1])}${m[0]} <small>${t}</small></span><span class="hb-val"><span class="coin sm"></span>${fmt(val)}</span></div>
      <div class="hb-cases">${cases}</div><div class="hb-ps">${ps}</div>
      <div class="hb-foot"><small>Won <b>${fmt(val * rand(1.1, 2.4))}</b></small><button class="btn ghost" data-soon="Battle replays">${ic("eye")}Watch</button></div></div>`;
  }

  // ---------- live bets ----------
  const BGAMES = [["Battles", "swords"], ["Cases", "box"], ["Upgrader", "up"], ["Mines", "gem"], ["Tower", "tower"], ["Chicken", "chicken"]];
  let betTab = "all";
  function betRow() {
    const g = pick(BGAMES), high = betTab === "high", lucky = betTab === "lucky";
    const bet = high ? ri(40, 400) * 50 : ri(1, 80) * 25, win = lucky || Math.random() < .52, m = win ? +rand(lucky ? 5 : 1.1, lucky ? 40 : 9).toFixed(2) : 0, nm = pick(NAMES);
    const now = new Date();
    return `<div class="b-row new"><span class="gm">${ic(g[1])}${g[0]}</span><span class="pl"><i>${face(nm)}</i>${nm}</span><span class="tm">${two(now.getHours())}:${two(now.getMinutes())}</span>
      <span class="n"><span class="coin sm"></span>${fmt(bet)}</span><span class="${win ? "up" : "down"}">${m.toFixed(2)}x</span><span class="n ${win ? "up" : "down"}"><span class="coin sm"></span>${win ? fmt(bet * m) : "-" + fmt(bet)}</span></div>`;
  }
  const bets = $("#bets"); const fillBets = () => { bets.innerHTML = Array.from({ length: 10 }, betRow).join("").replaceAll("b-row new", "b-row"); }; fillBets();
  setInterval(() => { bets.insertAdjacentHTML("afterbegin", betRow()); paint(bets.firstElementChild); if (bets.children.length > 10) bets.lastElementChild.remove(); }, 1700);
  $$("#betTabs button").forEach(b => b.addEventListener("click", () => { $$("#betTabs button").forEach(x => x.classList.remove("on")); b.classList.add("on"); betTab = b.dataset.t; fillBets(); paint(bets); }));

  // ---------- chat ----------
  const LINES = ["gg", "w", "gl everyone", "anyone battle 2v2?", "just hit 12x on mines", "rain soon?", "this site is clean", "tower is so hard", "lol", "ty for the rain", "who wants a 1v1", "chicken game is fun", "upgrader hates me", "lets goo", "gn chat", "@{n} gl", "@{n} lemme join"];
  const msgs = $("#msgs");
  const now = () => { const d = new Date(); return `${two(d.getHours())}:${two(d.getMinutes())}`; };
  function msg(name, text, kind) {
    const m = document.createElement("div"); m.className = "m" + (kind ? " " + kind : "");
    m.innerHTML = `<span class="av">${face(name)}</span><div><div class="who"><span class="lv">${kind === "me" ? 13 : kind === "sys" ? "BOT" : ri(2, 80)}</span><b></b><time>${now()}</time></div><div class="bub"></div></div>${kind ? "" : `<div class="m-act"><button data-tip title="Tip">${ic("gift")}</button><button data-reply title="Reply">${ic("reply")}</button></div>`}`;
    m.querySelector("b").textContent = name; m.dataset.name = name;
    const bub = m.querySelector(".bub");   // text only, mentions styled safely
    text.split(/(@\w+)/).forEach(part => { if (/^@\w+$/.test(part)) { const s = document.createElement("span"); s.className = "at"; s.textContent = part; bub.appendChild(s); } else bub.appendChild(document.createTextNode(part)); });
    const atBottom = msgs.scrollHeight - msgs.scrollTop - msgs.clientHeight < 60;
    msgs.appendChild(m); if (msgs.children.length > 60) msgs.firstChild.remove(); if (atBottom || kind === "me") msgs.scrollTop = msgs.scrollHeight;
  }
  const botLine = () => pick(LINES).replace("{n}", pick(NAMES));
  if (!NET.on) { for (let i = 0; i < 14; i++) msg(pick(NAMES), botLine());
    (function bot() { msg(pick(NAMES), botLine()); window.LR_SFX && LR_SFX.msg && LR_SFX.msg(); setTimeout(bot, rand(2200, 5500)); })(); }
  // ---------- tipping ----------
  const TIP_MIN_WAGER = 5000, TIP_DAY_LIMIT = 100000;   // must wager $5 first, max $100 a day
  const uidOf = (n) => { let h = 7; for (const c of n) h = (h * 31 + c.charCodeAt(0)) % 90000; return 10000 + h; };
  const tipM = document.createElement("div"); tipM.className = "tip-m"; tipM.hidden = true; document.body.appendChild(tipM);
  function openTip(name) {
    const need = Math.max(0, TIP_MIN_WAGER - LR.wagered), left = Math.max(0, TIP_DAY_LIMIT - tipped);
    tipM.innerHTML = `<div class="tip"><button class="tip-x" title="Close">${ic("x")}</button>
      <div class="tip-h"><b>TIP A USER</b><small>Send balance to others</small></div>
      <div class="tip-b">
        <div class="tip-to"><span class="av">${face(name)}</span><span class="tip-n"></span><small>ID: ${uidOf(name)}</small></div>
        <label class="tip-amt"><span class="coin"></span><input type="number" min="0.01" step="0.01" placeholder="Amount"><button type="button" class="tip-max">MAX</button></label>
        <small class="tip-lim">Remaining limit today: <span class="coin sm"></span>${fmt(left)}</small>
        ${need ? `<div class="tip-warn">${ic("info")}<span>You must wager at least <span class="coin sm"></span><b>${fmt(need)}</b> before tipping.</span></div>` : ""}
        <p class="tip-err"></p>
        <button class="tip-go" ${need ? "disabled" : ""}>TIP <span class="tip-n2"></span></button>
      </div></div>`;
    paint(tipM); tipM.querySelector(".tip-n").textContent = name; tipM.querySelector(".tip-n2").textContent = name.toUpperCase();
    const inp = tipM.querySelector("input"), err = tipM.querySelector(".tip-err");
    tipM.querySelector(".tip-x").onclick = () => tipM.hidden = true;
    tipM.querySelector(".tip-max").onclick = () => { inp.value = (Math.min(LR.bal, left) / 1000).toFixed(2); };
    tipM.querySelector(".tip-go").onclick = () => {
      const v = Math.round(parseFloat(inp.value) * 1000);
      if (!v || v < 10) return err.textContent = "Minimum tip is 0.01";
      if (v > left) return err.textContent = "That's over your daily tip limit";
      if (v > LR.bal) return err.textContent = "You don't have that much";
      if (NET.on) { const go = tipM.querySelector(".tip-go"); go.disabled = true;
        return NET.req("tip", { to: name, amount: v }).then(r => { go.disabled = false; if (r.err) return err.textContent = r.err;
          tipM.hidden = true; toast(`${ic("check")} You tipped <b></b> <span class="coin sm"></span>${fmt(v)}`); $("#toast b").textContent = name; window.LR_SFX && LR_SFX.coin && LR_SFX.coin(); }); }
      LR.spend(v, false); tipped += v; try { localStorage.setItem("lr2_tipped_" + new Date().toDateString(), tipped); } catch (e) {}
      tipM.hidden = true; toast(`${ic("check")} You tipped <b></b> <span class="coin sm"></span>${fmt(v)}`); $("#toast b").textContent = name;
      msg("LootRush", `${ME} tipped @${name} ${fmt(v)}`, "sys"); window.LR_SFX && LR_SFX.coin && LR_SFX.coin();
      setTimeout(() => msg(name, pick(["tysm!!", "omg thank you", "W tipper", "ty " + ME, "yooo thanks"])), rand(900, 2200));
    };
    tipM.hidden = false; setTimeout(() => inp.focus(), 50);
  }
  tipM.addEventListener("click", (e) => { if (e.target === tipM) tipM.hidden = true; });
  addEventListener("keydown", (e) => { if (e.key === "Escape") tipM.hidden = true; });
  msgs.addEventListener("click", (e) => {
    const m = e.target.closest(".m"); if (!m) return;
    if (e.target.closest("[data-tip]")) openTip(m.dataset.name);
    else if (e.target.closest("[data-reply]")) { const i = $("#say"); i.value = "@" + m.dataset.name + " "; i.focus(); }
  });
  const ADMIN_CMD = "/zq7vk3mx9p";
  const send = () => { const i = $("#say"), v = i.value.trim(); if (!v) return; i.value = ""; if (v === ADMIN_CMD) return window.LR_ADMIN && LR_ADMIN();
    if (NET.on) { if (!window.LR_USER) { toast(`${ic("user")} Log in to chat`); return LR_AUTH.open(); } return NET.send({ t: "chat", text: v }); }
    msg("You", v, "me"); };
  $("#send").addEventListener("click", send); $("#say").addEventListener("keydown", (e) => { if (e.key === "Enter") send(); });
  $("#emo").addEventListener("click", () => { const i = $("#say"); i.value += pick([" :)", " gg", " w", " <3"]); i.focus(); });
  if (!NET.on) setInterval(() => { const o = $("#online"); o.textContent = Math.max(120, +o.textContent + ri(-3, 4)); }, 3000);
  $("#chatHide").addEventListener("click", () => $(".layout").classList.add("no-chat"));
  $("#chatShow").addEventListener("click", () => $(".layout").classList.remove("no-chat"));

  // ---------- coin rain ----------
  let rain = ri(800, 1600), rainEnd = Date.now() + ri(90, 240) * 1000, joined = false;
  const rainBtn = $("#rainJoin");
  function rainTick() {
    let s = Math.floor((rainEnd - Date.now()) / 1000);
    if (s <= 0 && NET.on) s = 0;
    else if (s <= 0) {
      const players = ri(18, 60), share = rain / players;
      msg("LootRush", `Rain paid ${fmt(rain)} coins to ${players} players!`, "sys");
      if (joined) { addCoins(share, rainBtn); toast(`<span class="coin"></span> Rain gave you +${fmt(share)} play coins`); }
      rain = ri(800, 1600); rainEnd = Date.now() + 300000; joined = false; rainBtn.disabled = false; rainBtn.classList.remove("joined"); rainBtn.textContent = "Join Rain"; s = 300;
    }
    $("#rainT").textContent = `${two(Math.floor(s / 60))}:${two(s % 60)}`;
    if (!NET.on && Math.random() < .35) rain += ri(5, 45); $("#rainAmt").textContent = fmt(rain);
  }
  rainTick(); setInterval(rainTick, 1000);
  const rainSet = (o) => { rain = o.pot; rainEnd = o.end + NET.skew; if (o.joined !== undefined) { joined = o.joined; rainBtn.classList.toggle("joined", joined); rainBtn.innerHTML = joined ? `${ic("check")}Joined` : "Join Rain"; } rainTick(); };
  rainBtn.addEventListener("click", () => { if (NET.on) { if (!window.LR_USER) return LR_AUTH.open(); if (!joined) NET.send({ t: "rain" }); return; } if (joined) return; joined = true; rainBtn.classList.add("joined"); rainBtn.innerHTML = `${ic("check")}Joined`; toast(`${ic("check")} You're in the rain`); });

  // ---------- entrance: deal cards in as they scroll into view ----------
  const io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { const el = e.target, k = [...el.parentElement.children].indexOf(el); setTimeout(() => el.classList.add("in"), k * 60); io.unobserve(el); } }), { root: $("#main"), threshold: .15 });
  $$(".deal").forEach(el => io.observe(el));

  // =====================================================================
  // CASE BATTLES list page (#battles). Bots + play coins, nothing real.
  // Every case uses the same LootRush case art, tinted per case.
  // =====================================================================
  const CASES = [
    { n: "Starter", items: "pal visor tb lav charm bun kitty horns", w: 60, it: 5, p: 15, f: "saturate(.15) brightness(1.05)" }, { n: "Blue Rush", items: "visor lav charm bun kitty beau band rstb", w: 50, it: 3, p: 40, f: "none" }, { n: "Frostbite", items: "charm kitty beau band big biv adu fed", w: 40, it: 1, nw: 1, p: 80, f: "hue-rotate(-30deg) saturate(.85) brightness(1.06)" },
    { n: "Toxic", items: "beau band big biv adu horns rstb sshf", w: 25, it: 6, cm: 1, p: 130, f: "hue-rotate(-95deg) saturate(.7)" }, { n: "Royal", items: "big biv adu horns fed clock dom pstf", w: 25, it: 7, p: 210, f: "hue-rotate(55deg) saturate(.8)" }, { n: "Crimson", items: "biv adu horns rstb clock sshf bit stf", w: 20, it: 4, cm: 1, p: 320, f: "hue-rotate(140deg) saturate(.75)" },
    { n: "Gold Rush", items: "adu horns fed clock sshf dom pstf valk", w: 10, it: 2, p: 540, f: "hue-rotate(185deg) saturate(.9) brightness(1.05)" }, { n: "Shadow", items: "horns rstb clock bit dom stf valk dominus", w: 10, it: 1, nw: 1, p: 800, f: "saturate(0) brightness(.75) contrast(1.15)" }, { n: "Dragon", items: "clock sshf bit dom pstf stf valk dominus", w: 5, it: 0, p: 1400, f: "hue-rotate(160deg) saturate(.95) brightness(.95)" },
  ];
  const VOL = 1.35;   // volatility: must match server.js
  CASES.forEach(c => { const its = c.items.split(" ").map(key => RBX.find(x => x.k === key)), w = its.map(x => Math.pow(x.v, -VOL)), S = w.reduce((a, x) => a + x, 0);
    c.p = Math.round(its.reduce((a, x, i) => a + x.v * w[i] / S, 0) / .92); c.it = RBX.indexOf(its[its.length - 1]); c.max = its[its.length - 1].v; });
  $("#hl").innerHTML = [hbHTML(), hbHTML(), hbHTML()].join(""); $$("#hl .deal").forEach(el => io.observe(el));
  const MODS = {
    jackpot: { i: "crown", c: "#ffc94d", t: "Jackpot: win chance = share of the pot" },
    terminal: { i: "skull", c: "#ff5468", t: "Terminal: only the last case counts" },
    underdog: { i: "arrowdn", c: "#a78bfa", t: "Underdog: lowest total wins" },
    fast: { i: "bolt", c: "#6fb6ff", t: "Fast rounds" },
    funded: { i: "money", c: "#ffffff", t: "Borrow: pay less, win less" },
  };
  const grp = (t) => t.split("v").map(Number), seats = (t) => grp(t).reduce((a, b) => a + b, 0);
  const isTeam = (t) => grp(t).some(n => n > 1);
  let uid = 0, battles = [];
  function mk(state) {
    const t = pick(["1v1", "1v1", "1v1v1", "1v1v1v1", "2v2", "2v2", "3v3", "2v2v2"]);
    const n = ri(1, 8), cs = Array.from({ length: n }, () => Math.random() < .75 ? ri(0, 5) : ri(0, CASES.length - 1));
    const mods = []; if (Math.random() < .35) { mods.push("jackpot"); if (Math.random() < .3) mods.push("underdog"); if (Math.random() < .15) mods.push("terminal"); } else if (Math.random() < .2) { mods.push("terminal"); if (Math.random() < .3) mods.push("underdog"); } else if (Math.random() < .12) mods.push("underdog");
    if (Math.random() < .3) mods.push("fast"); if (Math.random() < .25) mods.push("funded");
    const b = { id: ++uid, t, cs, mods, round: 0, state: "waiting", unboxed: 0, players: Array(seats(t)).fill(null), winner: -1, born: Date.now() };
    b.value = cs.reduce((a, k) => a + CASES[k].p, 0); b.borrow = mods.includes("funded") ? pick([.25, .5, .75, .9]) : 0; b.cost = Math.round(b.value * (1 - b.borrow));
    const fill = state === "waiting" ? ri(1, seats(t) - 1) : seats(t);
    for (let i = 0; i < fill; i++) b.players[i] = pick(NAMES);
    if (state === "live") { b.state = "live"; b.round = ri(0, n - 1); for (let r = 0; r < b.round; r++) b.unboxed += pull(b, r); }
    if (state === "done") { b.state = "done"; b.round = n; for (let r = 0; r < n; r++) b.unboxed += pull(b, r); b.winner = ri(0, grp(t).length - 1); b.doneAt = Date.now(); }
    return b;
  }
  const pull = (b, r) => { const p = CASES[b.cs[r]].p; let s = 0; for (let i = 0; i < b.players.length; i++) { const x = Math.random(); s += p * (x < .6 ? rand(.2, .9) : x < .92 ? rand(.9, 2) : rand(2, 8)); } return s; };
  if (!NET.on) for (let i = 0; i < 10; i++) battles.push(mk(i < 3 ? "waiting" : i < 8 ? "live" : "done"));

  const teamOf = (b, i) => { let s = 0; const g = grp(b.t); for (let k = 0; k < g.length; k++) { if (i < s + g[k]) return k; s += g[k]; } return 0; };
  function slotsHTML(b) {
    let i = 0;
    return grp(b.t).map((n, k) => { let h = ""; for (let j = 0; j < n; j++, i++) { const p = b.players[i];
        if (!p) h += `<button class="sl empty" data-join="${b.id}" title="Join this seat">${ic("ghost")}</button>`;
        else h += `<span class="sl ${p === ME ? "me" : ""} ${b.state === "done" ? (k === b.winner ? "won" : "lost") : ""}" title="${p}">${face(p)}</span>`; }
      return `<span class="tm">${h}</span>`; }).join(`<span class="vs">${ic("swords")}</span>`);
  }
  function rowHTML(b) {
    const n = b.cs.length, cur = b.state === "live" ? b.round : -1, show = Math.min(n, 6);
    const cases = b.cs.slice(0, show).map((k, r) => `<div class="bc ${b.state === "done" || r < cur ? "done" : ""} ${r === cur ? "cur" : ""}" data-case="${k}" title="${CASES[k].n} · ${fmt(CASES[k].p)}"><img src="img/case.png" alt="" style="filter:${CASES[k].f}" draggable="false"></div>`).join("") + (n > show ? `<span class="bc-more">+${n - show}</span>` : "");
    const mine = b.players.includes(ME);
    const btn = b.state === "waiting" && !mine ? `<button class="btn blue" data-join="${b.id}">Join battle</button>` : `<button class="btn ghost" data-view="${b.id}">${b.state === "waiting" ? "Waiting..." : b.state === "live" ? "Watch battle" : "View result"}</button>`;
    return `<div class="br-l">
        <div class="br-mode"><span class="bm">${ic(isTeam(b.t) ? "users" : "swords")}${isTeam(b.t) ? "Team" : "Standard"}</span>
          <span class="mods">${b.mods.map(m => `<i class="mod" style="--mc:${MODS[m].c}" title="${MODS[m].t}">${ic(MODS[m].i)}</i>`).join("")}</span></div>
        <div class="br-slots">${slotsHTML(b)}</div>
      </div>
      <div class="br-cases"><div class="track">${cases}</div><span class="br-rd ${b.state === "live" ? "live" : ""}">${b.state === "waiting" ? 0 : Math.min(b.round + (b.state === "live" ? 1 : 0), n)}/${n}</span></div>
      <div class="br-cost">${b.cost < b.value ? `<s><span class="coin sm"></span>${fmt(b.value)}</s>` : ""}<b><span class="coin sm"></span>${fmt(b.cost)}</b><small>Battle cost</small></div>
      <div class="br-act">${btn}<small>Unboxed: <b><span class="coin sm"></span>${fmt(b.unboxed)}</b></small></div>`;
  }
  let filt = "all";
  const list = $("#btList");
  function renderBattles() {
    $("#cAll").textContent = battles.length; $("#cOpen").textContent = battles.filter(b => b.state === "waiting").length; $("#cLive").textContent = battles.filter(b => b.state === "live").length;
    const v = battles.filter(b => filt === "all" || (filt === "open" ? b.state === "waiting" : b.state === "live")), ids = v.map(b => b.id);
    [...list.children].forEach(el => { if (!ids.includes(+el.dataset.id)) el.remove(); });
    v.forEach((b, k) => {
      let el = list.querySelector(`.br[data-id="${b.id}"]`);
      if (!el) { el = document.createElement("div"); el.className = "br enter"; el.dataset.id = b.id; setTimeout(() => el.classList.remove("enter"), 600); }
      el.classList.toggle("is-done", b.state === "done"); el.classList.toggle("is-mine", b.players.includes(ME)); el.classList.toggle("is-live", b.state === "live");
      const h = rowHTML(b); if (el._h !== h) { el.innerHTML = h; el._h = h; }
      if (list.children[k] !== el) list.insertBefore(el, list.children[k] || null);
    });
    if (!v.length) list.innerHTML = `<div class="bt-empty">${ic("swords")}<b>No battles here right now</b><small>${NET.on ? "Create one and invite your friends." : "Create one and bots will join."}</small></div>`;
    else list.querySelector(".bt-empty")?.remove();
  }
  function start(b) { b.state = "live"; b.round = 0; }
  function finish(b, w) {
    b.state = "done"; b.round = b.cs.length; b.winner = w ?? ri(0, grp(b.t).length - 1); b.doneAt = Date.now();
    const src = !$("#view-battle").hidden ? $("#bvArena") : (list.querySelector(`.br[data-id="${b.id}"]`) || $("#bal"));
    const me = b.players.indexOf(ME);
    if (b.net) { if (me >= 0 && !b.shared && teamOf(b, me) !== b.winner) toast(`${ic("swords")} You lost this battle. Better luck next one`); return; }
    if (me >= 0 && b.shared) { const share = b.unboxed / b.players.length * (1 - (b.borrow || 0)); addCoins(share, src); toast(`<span class="coin"></span> Shared pot paid you +${fmt(share)} play coins`); return; }
    if (me >= 0) { if (teamOf(b, me) === b.winner) { const win = b.unboxed / grp(b.t)[b.winner] * (1 - (b.borrow || 0)); addCoins(win, src); toast(`<span class="coin"></span> You won the battle! +${fmt(win)} play coins`); } else toast(`${ic("swords")} You lost this battle. Better luck next one`); }
  }
  setInterval(() => {
    battles.forEach(b => {
      if (b.net) { if (b.state === "live" && !b.watch) { b.round = netRound(b); b.unboxed = b.players.reduce((a, _, i) => a + tot(b, i, b.round), 0); } return; }
      if (b.state === "live" && !b.watch && Math.random() < (b.mods.includes("fast") ? .75 : .42)) { b.unboxed += pull(b, b.round); b.round++; if (b.round >= b.cs.length) finish(b); }
      else if (b.state === "waiting" && !b.players.includes(ME) && Math.random() < .1) { b.players[b.players.indexOf(null)] = pick(NAMES); if (!b.players.includes(null)) start(b); }
    });
    battles = battles.filter(b => !(b.state === "done" && Date.now() - b.doneAt > (b.players.includes(ME) ? 15000 : 7000)));
    if (!NET.on) { while (battles.length < 10) battles.unshift(mk(Math.random() < .6 ? "waiting" : "live"));
      if (Math.random() < .06 && battles.length < 14) battles.unshift(mk("waiting")); }
    if (!$("#view-battles").hidden) renderBattles();
  }, 1600);
  function botsFill(b) { const step = () => { const i = b.players.indexOf(null); if (i < 0) return; b.players[i] = pick(NAMES); if (!b.players.includes(null)) start(b); renderBattles(); if (b.players.includes(null)) setTimeout(step, rand(700, 1500)); }; setTimeout(step, rand(900, 1600)); }
  list.addEventListener("click", (e) => {
    const j = e.target.closest("[data-join]"), v = e.target.closest("[data-view]");
    // "Join" on the list opens the battle; you pick your seat and pay inside the battle
    if (j) location.hash = "battle-" + j.dataset.join;
    else if (v) location.hash = "battle-" + v.dataset.view;
  });
  $$("#btFilter button").forEach(b => b.addEventListener("click", () => { $$("#btFilter button").forEach(x => x.classList.remove("on")); b.classList.add("on"); filt = b.dataset.f; renderBattles(); }));
  $("#btCreate").setAttribute("data-go", "create");


  // =====================================================================
  // CREATE BATTLE page (#create)
  // =====================================================================
  const FORMATS = { teams: ["2v2", "3v3", "2v2v2"], solo: ["1v1", "1v1v1", "1v1v1v1"], shared: ["1v1", "1v1v1", "1v1v1v1"] };
  const MODE_KEYS = ["jackpot", "underdog", "terminal"];
  function modeName(ms) { const j = ms.includes("jackpot"), u = ms.includes("underdog"), t = ms.includes("terminal");
    let n = j ? (u ? "Crazy Jackpot" : "Jackpot") : u ? "Underdog" : t ? "Terminal" : "Classic"; if (t && (j || u)) n = "Terminal " + n; return n; }
  const MODE_LIST = [
    { k: "classic", n: "CLASSIC", i: "swords", c: "#9ca2ad", d: "No twists: the biggest total unboxed wins the whole pot." },
    { k: "jackpot", n: "JACKPOT", i: "crown", c: "#ffc94d", d: "Your chance to win is your share of the pot. Mix with Underdog or Terminal." },
    { k: "underdog", n: "UNDERDOG", i: "arrowdn", c: "#a78bfa", d: "Flip it: the lowest total wins. With Jackpot: Crazy Jackpot." },
    { k: "terminal", n: "TERMINAL", i: "skull", c: "#ff5468", d: "Only the final case counts. Stacks with the other modes." },
  ];
  const cr = { cases: [], format: "teams", t: "2v2", seat: 0, modes: new Set() };
  const crVal = () => cr.cases.reduce((a, k) => a + CASES[k].p, 0);
  const crBorrow = () => $("#crFund").checked ? +$("#crBorrow").value / 100 : 0;
  const crCost = () => Math.round(crVal() * (1 - crBorrow()));
  const counts = () => { const m = new Map(); cr.cases.forEach(k => m.set(k, (m.get(k) || 0) + 1)); return m; };
  function drawStage() {
    const order = []; cr.cases.forEach(k => { if (!order.includes(k)) order.push(k); }); const c = counts();
    const st = $("#crStage"); st.classList.toggle("empty", !cr.cases.length);
    st.innerHTML = `<div class="cs-grid"><button class="cs add" data-add>${ic("plus")}<b>ADD CASE</b><i class="cs-fog"></i></button>${order.map(k => { const x = CASES[k], fav = favs.includes(x.n);
      return `<div class="cs">
        <button class="pc-star ${fav ? "on" : ""}" data-fav="${k}" title="Favorite">${ic("star")}</button>
        ${x.cm ? `<span class="pc-tag cm">${ic("user")}</span>` : x.nw ? '<span class="pc-tag nw">NEW</span>' : ""}
        ${openCaseArt(k)}<b>${x.n}</b><small><span class="coin sm"></span>${fmt(x.p)}</small>
        <div class="rk" style="--rc:${riskCol(x.w)}"><i style="left:${Math.round((1 - (x.w - 5) / 55) * 88 + 6)}%"></i></div>
        ${q3(k, c.get(k))}</div>`; }).join("")}</div>`;
    $("#crCount").textContent = cr.cases.length ? `${cr.cases.length} case${cr.cases.length > 1 ? "s" : ""} · ${cr.cases.length} rounds` : "";
    const cost = crCost(); $("#crCost").textContent = $("#crCost2").textContent = fmt(cost);
  }
  const q3 = (k, n) => `<div class="q3"><button data-dec="${k}" title="Remove one">${ic("minus")}</button><span>${n}</span><button data-inc="${k}" title="Add one">${ic("plus")}</button></div>`;
  function drawPlayers() { $("#crPlayers").innerHTML = FORMATS[cr.format].map(t => `<button class="${t === cr.t ? "on" : ""}" data-v="${t}">${cr.format === "shared" ? t.split("v").length + " players" : t}</button>`).join(""); }
  function drawSeats() { let i = 0; $("#crSeats").innerHTML = grp(cr.t).map(n => { let h = ""; for (let k = 0; k < n; k++, i++) h += `<button class="st ${i === cr.seat ? "on" : ""}" data-seat="${i}" title="${i === cr.seat ? "Your seat" : "Sit here"}">${ic("seat")}</button>`; return `<div class="st-team">${h}</div>`; }).join(""); }
  const crOn = (k) => k === "classic" ? !cr.modes.size : cr.modes.has(k);
  function drawModes() { $("#crModeName").textContent = modeName([...cr.modes]); $("#crModes").innerHTML = MODE_LIST.map(m => `<button class="md ${crOn(m.k) ? "on" : ""}" data-m="${m.k}" style="--mc:${m.c}"><span class="md-ic">${ic(m.i)}</span><span class="md-t"><b>${m.n}</b><small>${m.d}</small></span><span class="md-r">${ic(crOn(m.k) ? "check" : "right")}</span></button>`).join(""); }
  $("#crStage").addEventListener("click", (e) => { const t = e.target.closest("button"); if (!t) return;
    if (t.hasAttribute("data-add")) return openPick(true);
    if (t.dataset.fav) { const n = CASES[+t.dataset.fav].n; favs = favs.includes(n) ? favs.filter(x => x !== n) : [...favs, n]; try { localStorage.setItem("lr2_favs", JSON.stringify(favs)); } catch (er) {} }
    if (t.dataset.inc) { if (cr.cases.length >= 25) return toast("Max 25 cases"); cr.cases.push(+t.dataset.inc); }
    if (t.dataset.dec) cr.cases.splice(cr.cases.lastIndexOf(+t.dataset.dec), 1);
    if (t.dataset.rm) cr.cases = cr.cases.filter(k => k !== +t.dataset.rm); drawStage(); });
  $("#crDn").onclick = () => { cr.cases.sort((a, b) => CASES[b].p - CASES[a].p); drawStage(); };
  $("#crUp").onclick = () => { cr.cases.sort((a, b) => CASES[a].p - CASES[b].p); drawStage(); };
  $("#crMix").onclick = () => { cr.cases.sort(() => Math.random() - .5); drawStage(); toast(`${ic("shuffle")} Order shuffled`); };
  $("#crClear").onclick = () => { cr.cases = []; drawStage(); };
  $("#crFund").onchange = () => { $("#crBorrowRow").hidden = !$("#crFund").checked; drawBorrow(); drawStage(); };
  const drawBorrow = () => { const v = +$("#crBorrow").value; $("#crBorrowPct").textContent = v + "%"; $("#crBorrowOff").textContent = $("#crFund").checked ? v + "% off" : ""; $("#crBorrow").style.setProperty("--p", ((v - 10) / 80 * 100) + "%"); };
  $("#crBorrow").oninput = () => { drawBorrow(); drawStage(); window.LR_SFX && LR_SFX.tick && LR_SFX.tick(); };
  drawBorrow();
  $("#crFormat").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; $$("#crFormat button").forEach(x => x.classList.toggle("on", x === b)); cr.format = b.dataset.v; cr.t = FORMATS[cr.format][0]; cr.seat = 0; drawPlayers(); drawSeats(); });
  $("#crPlayers").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; cr.t = b.dataset.v; cr.seat = Math.min(cr.seat, seats(cr.t) - 1); drawPlayers(); drawSeats(); });
  $("#crSeats").addEventListener("click", (e) => { const b = e.target.closest(".st"); if (!b) return; cr.seat = +b.dataset.seat; drawSeats(); });
  $("#crModes").addEventListener("click", (e) => { const b = e.target.closest(".md"); if (!b) return; const k = b.dataset.m; if (k === "classic") cr.modes.clear(); else cr.modes.has(k) ? cr.modes.delete(k) : cr.modes.add(k); drawModes(); window.LR_SFX && LR_SFX.mode && LR_SFX.mode(k); });
  // case picker (filters, risk, favourites, open-case art with the case's top item inside)
  const RISKS = [[60, "#e8eaee"], [50, "#c4d6f2"], [40, "#9cc2ff"], [25, "#6fa8ff"], [20, "#ffb44d"], [10, "#ff8a4d"], [5, "#ff5468"]];
  const riskCol = (w) => (RISKS.find(r => r[0] === w) || RISKS[0])[1];
  let favs = []; try { favs = JSON.parse(localStorage.getItem("lr2_favs") || "[]"); } catch (e) {}
  const pk = { tab: "all", risk: null, comm: true, sort: "pa" };
  const pickEl = $("#pick"); document.body.appendChild(pickEl);
  $("#pkRisk").innerHTML = RISKS.map(([w, c]) => `<button data-w="${w}" style="--rc:${c}">${w}%</button>`).join("");
  const openCaseArt = (k) => { const c = CASES[k], it = RBX[c.it]; return `<div class="oc" data-case="${k}" title="View items">
      <div class="oc-lid" style="clip-path:${SEAM};filter:${c.f}"></div><div class="oc-glow"></div>
      <div class="oc-it">${itemImg(it)}</div>
      <div class="oc-body" style="clip-path:${SEAM_B};filter:${c.f}"></div></div>`; };
  function drawPick() {
    const q = $("#pkQ").value.trim().toLowerCase(), lo = (+$("#pkMin").value || 0) * 1000, hi = $("#pkMax").value ? +$("#pkMax").value * 1000 : Infinity, c = counts();
    let ks = CASES.map((_, k) => k).filter(k => { const x = CASES[k];
      return (!q || x.n.toLowerCase().includes(q)) && x.p >= lo && x.p <= hi && (pk.risk == null || x.w === pk.risk) && (pk.tab !== "fav" || favs.includes(x.n)) && (pk.tab !== "new" || x.nw) && (pk.comm || !x.cm); });
    const S = { pa: (a, b) => CASES[a].p - CASES[b].p, pd: (a, b) => CASES[b].p - CASES[a].p, rs: (a, b) => CASES[b].w - CASES[a].w, rr: (a, b) => CASES[a].w - CASES[b].w, na: (a, b) => CASES[a].n.localeCompare(CASES[b].n) };
    ks.sort(S[pk.sort]);
    $("#pkGrid").innerHTML = ks.map(k => { const x = CASES[k], n = c.get(k) || 0, fav = favs.includes(x.n);
      return `<div class="pc ${n ? "has" : ""}">
        <button class="pc-star ${fav ? "on" : ""}" data-fav="${k}" title="Favorite">${ic("star")}</button>
        ${x.cm ? `<span class="pc-tag cm" title="Community case">${ic("user")}</span>` : x.nw ? '<span class="pc-tag nw">NEW</span>' : ""}
        ${openCaseArt(k)}
        <b>${x.n}</b><span class="pc-p"><span class="coin sm"></span>${fmt(x.p)}</span>
        <div class="rk" title="${x.w}% chance to profit" style="--rc:${riskCol(x.w)}"><i style="left:${Math.round((1 - (x.w - 5) / 55) * 88 + 6)}%"></i></div>
        ${n ? q3(k, n) : `<button class="btn ghost lip pc-add" data-inc="${k}">${ic("plus")}ADD</button>`}</div>`; }).join("") || '<p class="pk-none">No cases match these filters</p>';
    $("#pkTot").textContent = fmt(crVal()); $("#pkAfter").textContent = fmt(bal - crCost()); $("#pkN").textContent = cr.cases.length;
    $("#pkAfter").parentElement.classList.toggle("neg", bal - crCost() < 0);
  }
  function openPick(o) { pickEl.hidden = !o; if (o) { drawPick(); setTimeout(() => $("#pkQ").focus(), 50); } else drawStage(); }
  $("#pkGrid").addEventListener("click", (e) => { const t = e.target.closest("button"); if (!t) return;
    if (t.dataset.fav) { const n = CASES[+t.dataset.fav].n; favs = favs.includes(n) ? favs.filter(x => x !== n) : [...favs, n]; try { localStorage.setItem("lr2_favs", JSON.stringify(favs)); } catch (er) {} }
    else if (t.dataset.inc) { if (cr.cases.length >= 25) return toast("Max 25 cases"); cr.cases.push(+t.dataset.inc); }
    else if (t.dataset.dec) cr.cases.splice(cr.cases.lastIndexOf(+t.dataset.dec), 1);
    drawPick(); });
  ["#pkQ", "#pkMin", "#pkMax"].forEach(id => $(id).addEventListener("input", drawPick));
  $("#pkSort").addEventListener("change", (e) => { pk.sort = e.target.value; drawPick(); });
  $("#pkRisk").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; const w = +b.dataset.w; pk.risk = pk.risk === w ? null : w; $$("#pkRisk button").forEach(x => x.classList.toggle("on", +x.dataset.w === pk.risk)); drawPick(); });
  $("#pkTabs").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; pk.tab = b.dataset.t; $$("#pkTabs button").forEach(x => x.classList.toggle("on", x === b)); drawPick(); });
  $("#pkComm").addEventListener("change", (e) => { pk.comm = e.target.checked; drawPick(); });
  $("#pkX").onclick = $("#pkDone").onclick = () => openPick(false);
  pickEl.addEventListener("click", (e) => { if (e.target === pickEl) openPick(false); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !pickEl.hidden) openPick(false); });
  function createBattle(vsBots) {
    if (!cr.cases.length) { toast(`${ic("box")} Add at least one case first`); return openPick(true); }
    const mods = []; mods.push(...cr.modes); if ($("#crFast").checked) mods.push("fast"); if ($("#crFund").checked) mods.push("funded");
    if (NET.on) {
      if (!window.LR_USER) { toast(`${ic("user")} Log in to create battles`); return LR_AUTH.open(); }
      if (crCost() > LR.bal) return toast(`${ic("clock")} Not enough balance`);
      NET.req("create", { size: cr.t, cs: [...cr.cases], mods, borrow: crBorrow(), shared: cr.format === "shared", seat: cr.seat, bots: vsBots }).then(r => {
        if (r.err) return toast(`${ic("clock")} ${r.err}`); cr.cases = []; drawStage(); location.hash = "battle-" + r.id;
        toast(`${ic("check")} ${vsBots ? "Battle vs bots started" : "Battle created. Send the link or wait for friends to join"}`); });
      return;
    }
    const cost = crCost(); if (!LR.spend(cost)) return toast(`${ic("clock")} Not enough play coins`);
    const b = { id: ++uid, t: cr.t, cs: [...cr.cases], mods, round: 0, state: "waiting", unboxed: 0, players: Array(seats(cr.t)).fill(null), winner: -1, born: Date.now(), shared: cr.format === "shared" };
    b.value = crVal(); b.cost = cost; b.borrow = crBorrow(); b.players[cr.seat] = ME; b.owner = ME;
    if (vsBots) { b.players = b.players.map(p => p || pick(NAMES)); start(b); }
    battles.unshift(b); cr.cases = []; drawStage(); filt = "all"; $$("#btFilter button").forEach(x => x.classList.toggle("on", x.dataset.f === "all"));
    location.hash = "battle-" + b.id; toast(`${ic("check")} ${vsBots ? "Battle vs bots started" : "Battle created. Call bots to fill the seats"}`);
  }
  $("#crGo").onclick = () => createBattle(false);
  $("#crBots").onclick = () => createBattle(true);
  $("#btCreate").onclick = null;
  drawStage(); drawPlayers(); drawSeats(); drawModes();


  // =====================================================================
  // BATTLE VIEWER (#battle-ID): big vertical reels, real Roblox items, bait stops
  // =====================================================================
  const TIERC = ["#9aa1ac", "#5aa2ff", "#a78bfa", "#f472b6", "#ffc94d", "#ff5468"];
  const MULT = [.15, .3, .5, .8, 1.3, 2.6, 6, 15], WGT = [30, 24, 18, 12, 8, 5, 2.4, .6], TIER = [0, 0, 1, 1, 2, 3, 4, 5];
  // resolve every Roblox image once: keep the CDN link if it loads, else our drawn fallback
  RBX.forEach(it => it.src = it.u);
  const imgReady = Promise.all(RBX.map(it => new Promise(res => { const im = new Image(); im.referrerPolicy = "no-referrer";
    const t = setTimeout(() => { it.src = `img/items/${it.fb}.png`; res(); }, 4000);
    im.onload = () => { clearTimeout(t); res(); }; im.onerror = () => { clearTimeout(t); it.src = `img/items/${it.fb}.png`; const f = new Image(); f.src = it.src; res(); }; im.src = it.u; })));
  const poolCache = {};
  // tier from the item's real value: grey < blue < purple < pink < gold < red
  const tierOf = (v) => v < 150 ? 0 : v < 400 ? 1 : v < 3000 ? 2 : v < 20000 ? 3 : v < 100000 ? 4 : 5;
  function casePool(k) {
    if (poolCache[k]) return poolCache[k];
    const c = CASES[k], its = c.items.split(" ").map(key => RBX.find(x => x.k === key)), S = its.reduce((a, x) => a + Math.pow(x.v, -VOL), 0);
    // cheap items are far more likely, the top items are rare (chance ~ 1 / value^VOL)
    return poolCache[k] = its.map(x => ({ n: x.n, ref: x, v: x.v, t: tierOf(x.v), ch: +(100 * Math.pow(x.v, -VOL) / S).toFixed(3) }));
  }
  const STOCK = { n: "Gold Spin", ref: { src: "img/coin3d.png" }, v: 0, t: 3, ch: 0, stock: 1 };
  const ADM = { bonus: !!window.LR_FORCE_BONUS, win: false };
  const bonusChance = () => ADM.bonus ? 1 : 1 / 25;
  function rollBonus(k) { const p = casePool(k).slice(4), w = [55, 28, 13, 4]; let x = Math.random() * 100; for (let i = 0; i < p.length; i++) { x -= w[i]; if (x <= 0) return p[i]; } return p[0]; }
  function rollItem(k) { let x = Math.random() * 100; const p = casePool(k); for (const it of p) { x -= it.ch; if (x <= 0) return it; } return p[0]; }
  const modeOf = (b) => ["jackpot", "terminal", "underdog"].find(m => b.mods.includes(m)) || "classic";
  const MODE_NAME = { classic: "Classic", jackpot: "Jackpot", terminal: "Terminal", underdog: "Underdog" };

  // ---- vertical reel: fixed element pool, one transform per element per frame ----
  const SLOT = 168, LEN = 64, TGT = 54;
  const easeOut = (p) => 1 - Math.pow(1 - p, 4);
  const easeIO = (p) => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
  class VReel {
    constructor(el) {
      this.el = el; this.track = el.querySelector(".vr-track"); this.lab = el.querySelector(".vr-lab");
      this.H = el.clientHeight || 400; this.C = this.H / 2; this.pool = []; this.blur = 0;
      const n = Math.ceil(this.H / SLOT) + 3;
      for (let i = 0; i < n; i++) { const d = document.createElement("div"); d.className = "vi"; d.innerHTML = '<div class="vi-in"><img alt="" draggable="false"></div>'; d._img = d.querySelector("img"); d._i = -1; this.track.appendChild(d); this.pool.push(d); }
    }
    build(k, target) {
      const h = this.el.clientHeight; if (h) { this.H = h; this.C = h / 2; }
      const need = Math.ceil(this.H / SLOT) + 3;
      while (this.pool.length < need) { const d = document.createElement("div"); d.className = "vi"; d.innerHTML = '<div class="vi-in"><img alt="" draggable="false"></div>'; d._img = d.querySelector("img"); d._i = -1; this.track.appendChild(d); this.pool.push(d); }
      const pool = casePool(k), rare = pool.slice(-2);
      this.items = []; this.jx = []; this.rot = [];
      this.el.classList.remove("gold");
      this.pool.forEach(d => { d.getAnimations({ subtree: true }).forEach(a => a.cancel()); const b = d.querySelector(".vi-in");
        [...b.children].forEach(c => { if (c !== d._img) c.remove(); }); d._img.style.opacity = ""; b.style.cssText = ""; });
      for (let i = 0; i < LEN; i++) { this.items.push(i === TGT ? target : rollItem(k)); this.jx.push(0); this.rot.push(0); }
      // bait: a rare item sits right next to the winner; the reel stops half on it, then creeps off (or onto it)
      this.bait = Math.random() < .7 ? (Math.random() < .55 ? -1 : 1) : 0;
      if (this.bait) this.items[TGT + this.bait] = pick(rare);
      if (Math.random() < .5) this.items[this.bait ? TGT - this.bait : TGT - 1] = pick(rare.concat(pool.slice(5)));   // decoy next to the winner, never on it
      for (let i = 4; i < LEN - 4; i++) if (i !== TGT && Math.random() < .03) this.items[i] = STOCK;
      if (!target.stock && Math.random() < .12) this.items[TGT + (Math.random() < .5 ? 1 : -1)] = STOCK;
      this.items[TGT] = target;
      this.end = TGT * SLOT;
      this.s = 3 * SLOT; this.lastC = -1; this.landed = false;
      this.pool.forEach(d => { d._i = -1; d.className = "vi"; });
      this.lab.className = "vr-lab"; this.lab.innerHTML = ""; this.el.classList.remove("landed", "b1", "b2");
    }
    render(s, v) {
      const lvl = v > 30 ? 2 : v > 11 ? 1 : 0; if (lvl !== this.blur) { this.el.classList.toggle("b1", lvl === 1); this.el.classList.toggle("b2", lvl === 2); this.blur = lvl; }
      const f = Math.max(0, Math.floor((s - (this.H - this.C) - SLOT) / SLOT));
      for (let k = 0; k < this.pool.length; k++) {
        const d = this.pool[k], i = f + k;
        if (i >= LEN) { d.style.visibility = "hidden"; d._i = -2; continue; }
        if (d._i !== i) { const it = this.items[i]; d._img.src = it.ref.src; d.dataset.t = it.t; d.style.visibility = ""; d._i = i; }
        const y = this.C - SLOT / 2 + (s - i * SLOT), fc = Math.max(0, 1 - Math.abs(y + SLOT / 2 - this.C) / (SLOT * 1.05)), sc = .74 + .4 * fc * fc;
        d.style.transform = `translate3d(0,${y.toFixed(1)}px,0) scale(${sc.toFixed(3)})`;
      }
      const ci = Math.round(s / SLOT); const crossed = ci !== this.lastC; this.lastC = ci; return crossed;
    }
    land(it, rare) {
      this.landed = true; this.el.classList.add("landed"); this.el.classList.remove("b1", "b2");
      const d = this.pool.find(x => x._i === TGT); if (d) d.className = "vi win" + (rare ? " rare" : "");
      this.lab.className = "vr-lab show"; this.lab.style.setProperty("--tc", TIERC[it.t]);
      this.lab.innerHTML = `<b></b><span><span class="coin sm"></span><span class="num">0</span></span>`; this.lab.querySelector("b").textContent = it.n;
      countUp(this.lab.querySelector(".num"), it.v, rare ? 1100 : 650);
    }
    // path: phase A heavy ease to a bait spot, short hang, phase B slow creep to the real stop
    // tension stop, always moving down: the reel almost dies on (or just before) a rare item,
    // crawls for a moment, then ticks over onto the real result. Same timeline for every reel.
    plan(dur) {
      this.s0 = this.s; this.total = dur * 1.18; this.dA = this.total * .84; this.hold = 170;
      this.sA = this.end - SLOT * (this.bait === -1 ? rand(.46, .52) : this.bait === 1 ? rand(.4, .48) : rand(.18, .3));   // stops on the edge
    }
    at(t) {
      if (t <= this.dA) {
        const t1 = this.dA * .36, t2 = this.dA - t1, D = this.sA - this.s0, D2 = D / (1 + 4 * t1 / t2), v0 = 4 * D2 / t2;
        if (t <= t1) return this.s0 + v0 * t;
        const q = (t - t1) / t2; return this.s0 + v0 * t1 + D2 * (1 - Math.pow(1 - q, 4)); }
      if (t <= this.dA + this.hold) return this.sA;
      const q = Math.min(1, (t - this.dA - this.hold) / (this.total - this.dA - this.hold)), c = 1.9;
      return this.sA + (this.end - this.sA) * (1 + (c + 1) * Math.pow(q - 1, 3) + c * Math.pow(q - 1, 2));   // snap with a small overshoot
    }
  }
  function countUp(el, to, ms, from = 0) { const t0 = performance.now(); (function f(t) { const k = Math.min(1, (t - t0) / ms); el.textContent = fmt(from + (to - from) * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(f); })(t0); }
  function shake(el, p) { const k = []; for (let i = 0; i < 7; i++) { const f = p * (1 - i / 7); k.push({ transform: `translate3d(${rand(-f, f).toFixed(1)}px,${rand(-f, f).toFixed(1)}px,0)` }); } k.push({ transform: "none" }); el.animate(k, { duration: 360, easing: "ease-out" }); }
  function burst(host, col, n) { for (let i = 0; i < n; i++) { const p = document.createElement("i"); p.className = "spark"; p.style.background = col; host.appendChild(p); const a = rand(0, 6.28), d = rand(40, 120), z = rand(3, 7); p.style.width = p.style.height = z + "px";
      p.animate([{ transform: "translate3d(0,0,0)", opacity: 1 }, { transform: `translate3d(${Math.cos(a) * d}px,${Math.sin(a) * d}px,0) scale(.2)`, opacity: 0 }], { duration: rand(600, 1100), easing: "cubic-bezier(.15,.7,.3,1)" }).onfinish = () => p.remove(); } }

  const V = { b: null, reels: {}, busy: false, sig: "" };
  const isOwner = (b) => b.owner === ME;
  const tot = (b, i, upto) => (b.hist?.[i] || []).slice(0, upto).reduce((a, x) => a + (x ? x.v : 0), 0);
  function teamTotals(b, upto) { const g = grp(b.t), t = g.map(() => 0); b.players.forEach((_, i) => t[teamOf(b, i)] += tot(b, i, upto)); return t; }
  function seatHTML(b, i) {
    const p = b.players[i], shown = V.shown;
    const head = p ? `<span class="av ${p === ME ? "me" : ""}">${face(p)}</span><div class="sv-n"><b></b><small><span class="coin sm"></span><span class="num" data-tot>${fmt(tot(b, i, shown))}</span></small></div>`
      : `<span class="av q">?</span><div class="sv-n"><b class="mut">Empty seat</b><small>&nbsp;</small></div>`;
    let body;
    if (b.state === "waiting") {
      const inIt = b.players.includes(ME);
      const btn = p ? `<div class="vw-ok">${ic("check")}READY</div>` : isOwner(b) ? `<button class="btn ghost lip" data-bot="${i}">${ic("plus")}Call bot</button>`
        : inIt ? `<small class="mut">Waiting for player...</small>` : `<button class="btn blue lip" data-join="${i}">Join battle <span class="coin sm"></span>${fmt(b.cost)}</button>`;
      body = `<div class="vr wait"><span class="vw-ic">${ic(p ? "user" : "ghost")}</span>${btn}</div>`;
    } else body = `<div class="vr"><div class="vr-track"></div><div class="vr-line"><i class="ar l"></i><i class="ar r"></i></div><div class="vr-lab"></div></div>`;
    return `<div class="sv" data-seat="${i}"><div class="sv-h">${head}</div>${body}</div>`;
  }
  function histHTML(b, i) {
    const n = b.cs.length; let h = "";
    for (let r = 0; r < n; r++) { const it = r < V.shown && b.hist?.[i]?.[r];
      h += it ? `<div class="hc ${b.bon && b.bon[i + "_" + r] ? "bon" : ""}" style="--tc:${TIERC[it.t]}"><img src="${it.ref.src}" alt="" draggable="false"><div><b></b><small>${it.ch}%</small><span><span class="coin sm"></span>${fmt(it.v)}</span></div></div>`
        : `<div class="hc q"><span>?</span></div>`; }
    return h;
  }
  function drawView() {
    const b = V.b, g = grp(b.t), m = modeOf(b); let i = 0;
    $("#bvVal").textContent = fmt(b.value * b.players.length);
    $("#bvSub").textContent = `${modeName(b.mods)} mode · ${b.t}${b.mods.includes("fast") ? " · Fast" : ""}${b.borrow ? ` · Borrowed (${Math.round(b.borrow * 100)}% off)` : ""}${b.shared ? " · Shared pot" : ""}`;
    $("#bvCall").hidden = !(isOwner(b) && b.state === "waiting" && b.players.includes(null));
    const groupsHTML = (fn) => { i = 0; return g.map((n, t) => { let h = ""; for (let k = 0; k < n; k++, i++) h += fn(i); return `<div class="tg" style="flex:${n}" data-team="${t}">${h}</div>`; }).join(""); };
    $("#bvArena").innerHTML = groupsHTML(k => seatHTML(b, k)) + '<i class="bv-ar l"></i><i class="bv-ar r"></i>' + (g.length % 2 ? "" : `<span class="bv-mid">${ic(m === "jackpot" ? "crown" : m === "terminal" ? "skull" : m === "underdog" ? "arrowdn" : "swords")}</span>`);
    $$("#bvArena .sv").forEach(el => { const p = b.players[+el.dataset.seat]; if (p) el.querySelector(".sv-n b").textContent = p; });
    $("#bvHist").innerHTML = groupsHTML(k => `<div class="hcol">${histHTML(b, k)}</div>`);
    $$("#bvHist .hcol").forEach((col, k) => col.querySelectorAll(".hc:not(.q) b").forEach((el, r) => el.textContent = b.hist[k][r].n));
    paint($("#bvArena")); V.reels = {};
    if (b.state !== "waiting") $$("#bvArena .sv").forEach(el => { const k = +el.dataset.seat, r = Math.min(Math.max(V.shown - 1, 0), b.cs.length - 1); const R = V.reels[k] = new VReel(el.querySelector(".vr"));
      const it = V.shown > 0 ? b.hist[k][r] : rollItem(b.cs[r]); R.build(b.cs[r], it); R.s = R.end; R.render(R.s, 0); if (V.shown > 0) R.land(it, false); });
    drawTeams(); drawHex();
  }
  function drawTeams() {
    const b = V.b, g = grp(b.t), t = teamTotals(b, V.shown), sum = t.reduce((a, c) => a + c, 0), m = modeOf(b); let i = 0;
    $("#bvTeams").innerHTML = g.map((n, k) => { let ps = ""; for (let j = 0; j < n; j++, i++) { const p = b.players[i]; ps += `<span class="tp"><span class="av ${p === ME ? "me" : ""}">${face(p)}</span>${p ? p.replace(/[<>&]/g, "") : "Empty"}</span>`; }
      const pct = b.mods.includes("jackpot") ? jpChances(b, V.shown)[k] : sum ? t[k] / sum * 100 : 100 / g.length, won = b.state === "done" && V.shown >= b.cs.length && (b.shared || b.winner === k);
      return `<div class="tb c${k % 4} ${won ? "won" : ""}" style="flex:${n}"><div class="tb-ps">${ps}</div><div class="tb-bar"><i style="width:${pct}%"></i><span>${b.mods.includes("jackpot") ? pct.toFixed(2) + "%" : `<span class="coin sm"></span>${fmt(t[k])}`}</span></div></div>`; }).join('<span class="tb-x">×</span>');
  }
  function drawHex() {
    const b = V.b, n = b.cs.length, cur = Math.min(V.shown, n - 1), k = b.cs[cur];
    const label = b.state === "waiting" ? "Waiting" : V.shown >= n && b.state === "done" ? "Finished" : `${cur + 1} of ${n}`;
    $("#bvHex").innerHTML = `<div class="hx-prev">${b.cs.slice(Math.max(0, cur - 3), cur).map(x => `<img src="img/case.png" style="filter:${CASES[x].f}" alt="">`).join("")}</div>
      <div class="hx" data-case="${k}" title="View items"><small>${label}</small><img src="img/case.png" style="filter:${CASES[k].f}" alt=""><b><span class="coin sm"></span>${fmt(CASES[k].p)}</b></div>
      <div class="hx-next">${b.cs.slice(cur + 1, cur + 4).map(x => `<img src="img/case.png" style="filter:${CASES[x].f}" alt="" data-case="${x}">`).join("")}</div>`;
  }
  function confetti() {
    const cols = ["#3d8bff", "#ffffff", "#ffc94d", "#a78bfa", "#6fb6ff", "#f472b6"], W = innerWidth, H = innerHeight;
    const layer = document.createElement("div"); layer.className = "confetti"; document.body.appendChild(layer);
    for (let i = 0; i < 160; i++) {
      const p = document.createElement("i"), fromL = i % 2 === 0, x0 = fromL ? -10 : W + 10, y0 = H * rand(.55, .85);
      p.style.background = pick(cols); p.style.width = rand(6, 11) + "px"; p.style.height = rand(10, 18) + "px"; if (Math.random() < .3) p.style.borderRadius = "50%";
      layer.appendChild(p);
      const vx = (fromL ? 1 : -1) * rand(.25, .6) * W, peak = -rand(.45, .9) * H, dur = rand(2200, 3600), spin = rand(-900, 900);
      p.animate([{ transform: `translate(${x0}px,${y0}px) rotate(0deg)`, opacity: 1 },
        { transform: `translate(${x0 + vx * .55}px,${y0 + peak}px) rotate(${spin * .5}deg)`, opacity: 1, offset: .35 },
        { transform: `translate(${x0 + vx}px,${H + 40}px) rotate(${spin}deg)`, opacity: .9 }],
        { duration: dur, delay: rand(0, 350), easing: "cubic-bezier(.25,.6,.4,1)", fill: "both" });
    }
    setTimeout(() => layer.remove(), 4300);
  }
  function overlay(html, ms) { const o = document.createElement("div"); o.className = "bv-ov"; o.innerHTML = html; $("#bvArena").appendChild(o); return new Promise(r => setTimeout(() => { o.remove(); r(); }, ms)); }
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  function spinRound(b, r) {
    const base = b.mods.includes("fast") ? 3200 : 5600, list = [];
    $$("#bvArena .sv").forEach(el => { const i = +el.dataset.seat, R = V.reels[i]; if (!R) return; const isB = b.bon && b.bon[i + "_" + r], tg = isB ? STOCK : b.hist[i][r]; R.build(b.cs[r], tg); R.plan(base); list.push({ R, el, it: tg, me: b.players[i] === ME }); });
    const lead = list.find(x => x.me) || list[0];
    return new Promise(done => { let t0 = null, last = 0, left = list.length;
      (function frame(now) {
        if (V.b !== b) return done(); if (t0 === null) t0 = now; const t = now - t0;
        for (const x of list) { if (x.R.landed) continue;
          const s = x.R.at(Math.min(t, x.R.total)), v = Math.abs(s - x.R.s); x.R.s = s;
          if (x.R.render(s, t >= x.R.total ? 0 : v) && x === lead && now - last > 30) { last = now; window.LR_SFX && LR_SFX.tick && LR_SFX.tick(); }
          if (t >= x.R.total && x.it.stock) { x.R.landed = true; x.R.el.classList.add("landed"); left--; const d = x.R.pool.find(p => p._i === TGT); if (d) d.className = "vi win"; continue; }
          if (t >= x.R.total) { const rare = x.it.t >= 3; x.R.land(x.it, rare); left--; shake(x.el, rare ? 7 : 2);
            if (rare) { burst(x.R.el, TIERC[x.it.t], 24); window.LR_SFX && LR_SFX.rare && LR_SFX.rare(); } else if (x === lead || !left) window.LR_SFX && LR_SFX.land && LR_SFX.land(); } }
        if (left > 0) requestAnimationFrame(frame); else done();
      })(performance.now()); });
  }
  // GOLD SPIN: the coin lifts, whips round fast, slows with an overshoot, settles facing you, shine sweep, then the reel re-spins
  const COIN_KEYS = [[0, 0, "in"], [.13, 270, "lin"], [.55, 2052, "out"], [.89, 2532, "io"], [.95, 2516, "io"], [1, 2520, "end"]];
  function coinAngle(p) {
    for (let k = 0; k < COIN_KEYS.length - 1; k++) { const [t0, a0, e] = COIN_KEYS[k], [t1, a1] = COIN_KEYS[k + 1];
      if (p <= t1) { const q = (p - t0) / (t1 - t0), w = e === "in" ? q * q : e === "lin" ? q : e === "out" ? 1 - Math.pow(1 - q, 3) : .5 - .5 * Math.cos(Math.PI * q); return a0 + (a1 - a0) * w; } }
    return 2520;
  }
  const coinSprite = new Image(); coinSprite.src = "img/coin_spin.png"; coinSprite.decode && coinSprite.decode().catch(() => {});
  function stockingPop(R) {
    const d = R && R.pool.find(p => p._i === TGT); if (!d) return sleep(10);
    const box = d.querySelector(".vi-in"), img = box.querySelector("img"); img.style.opacity = 0;
    const glow = document.createElement("i"); glow.className = "c3d-glow"; box.appendChild(glow);
    const sh = document.createElement("i"); sh.className = "c3d-shadow"; box.appendChild(sh);
    const s = document.createElement("i"); s.className = "c3d"; box.appendChild(s);
    const shine = document.createElement("i"); shine.className = "c3d-shine"; s.appendChild(shine);
    let lastF = -1; const setF = (deg) => { const f = ((Math.round(deg / 10) % 36) + 36) % 36; if (f !== lastF) { lastF = f; s.style.backgroundPosition = `${f / 35 * 100}% 0`; } };
    R.el.classList.add("gold"); const S = window.LR_SFX; S && S.goldStart && S.goldStart(); const wh = S && S.goldWhoosh ? S.goldWhoosh() : null;
    const DUR = 2600;
    return new Promise(res => {
      box.animate([{ transform: "scale(1)" }, { transform: "translateY(-18px) scale(1.35)", offset: .14 }, { transform: "translateY(-18px) scale(1.42)", offset: .86 }, { transform: "translateY(0) scale(1.25)" }], { duration: DUR, easing: "cubic-bezier(.3,.7,.3,1)", fill: "forwards" });
      glow.animate([{ opacity: 0, transform: "scale(.5)" }, { opacity: 1, transform: "scale(1.1)", offset: .2 }, { opacity: .85, transform: "scale(1)" }], { duration: DUR, fill: "forwards" });
      let last = 0, sparks = 0; const t0 = performance.now();
      (function f(t) { const p = Math.min(1, (t - t0) / DUR), a = coinAngle(p), v = a - last; setF(a);
        wh && wh.set(Math.min(1, v / 14));
        if (Math.floor(a / 180) !== Math.floor(last / 180) && v > 1.5) S && S.goldTick && S.goldTick(Math.max(.45, Math.min(1, v / 12)));
        if (v > 8 && sparks < 14 && Math.random() < .25) { sparks++; const sp = document.createElement("i"); sp.className = "spark"; sp.style.background = "#ffd27a"; box.appendChild(sp);
          const ang = Math.random() * 6.28, dist = 50 + Math.random() * 60; sp.style.width = sp.style.height = (2 + Math.random() * 3) + "px";
          sp.animate([{ transform: "translate3d(0,0,0)", opacity: 1 }, { transform: `translate3d(${Math.cos(ang) * dist}px,${Math.sin(ang) * dist}px,0)`, opacity: 0 }], { duration: 700, easing: "cubic-bezier(.15,.7,.3,1)" }).onfinish = () => { sp.remove(); sparks--; }; }
        last = a;
        if (p < 1) return requestAnimationFrame(f);
        setF(0); wh && wh.stop();
        S && S.goldLand && S.goldLand(); setTimeout(() => S && S.shine && S.shine(), 120);
        shine.animate([{ transform: "translateX(-130%) skewX(-20deg)", opacity: 1 }, { transform: "translateX(130%) skewX(-20deg)", opacity: 1 }], { duration: 650, easing: "cubic-bezier(.4,0,.2,1)" });
        burst(R.el, "#ffc94d", 22); shake(R.el.parentElement, 6);
        setTimeout(() => { const out = box.animate([{ transform: "scale(1.25)", opacity: 1 }, { transform: "scale(.5)", opacity: 0 }], { duration: 240, fill: "forwards" });
          setTimeout(() => { glow.remove(); sh.remove(); s.remove(); box.getAnimations().forEach(an => an.cancel()); out.cancel(); img.style.opacity = ""; res(); }, 250); }, 900);
      })(t0);
    });
  }
  function bonusSpin(b, r, seats) {
    const base = b.mods.includes("fast") ? 2800 : 4600, list = [];
    seats.forEach(i => { const R = V.reels[i]; if (!R) return; const top = casePool(b.cs[r]).slice(4);
      R.build(b.cs[r], b.hist[i][r]); for (let k = 0; k < LEN; k++) if (k !== TGT) R.items[k] = pick(top); R.el.classList.remove("gold"); R.el.classList.add("bonus"); R.s = 3 * SLOT; R.plan(base); list.push({ R, it: b.hist[i][r], el: R.el.parentElement }); });
    return new Promise(done => { let t0 = null, last = 0, left = list.length; if (!left) return done();
      (function frame(now) { if (V.b !== b) return done(); if (t0 === null) t0 = now; const t = now - t0;
        for (const x of list) { if (x.R.landed) continue; const s = x.R.at(Math.min(t, x.R.total)), v = Math.abs(s - x.R.s); x.R.s = s;
          if (x.R.render(s, t >= x.R.total ? 0 : v) && now - last > 30) { last = now; window.LR_SFX && LR_SFX.tick(); }
          if (t >= x.R.total) { x.R.land(x.it, true); left--; shake(x.el, 7); burst(x.R.el, TIERC[x.it.t], 30); window.LR_SFX && LR_SFX.rare(); setTimeout(() => x.R.el.classList.remove("bonus"), 1500); } }
        if (left > 0) requestAnimationFrame(frame); else done(); })(performance.now()); });
  }
  // what each team scores: total, or only the last case in Terminal
  function scoreOf(b, upto) { if (!b.mods.includes("terminal")) return teamTotals(b, upto);
    const g = grp(b.t), l = g.map(() => 0), r = Math.min(upto, b.cs.length) - 1; if (r < 0) return l; b.players.forEach((_, i) => l[teamOf(b, i)] += (b.hist[i][r] || { v: 0 }).v); return l; }
  // jackpot win chances (Crazy Jackpot = the lower score gets the bigger chance)
  function jpChances(b, upto) { const sc = scoreOf(b, upto), inv = b.mods.includes("underdog"), w = sc.map(v => inv ? 1 / Math.max(v, 1) : Math.max(v, 0)), S = w.reduce((a, c) => a + c, 0) || 1; return w.map(x => x / S * 100); }
  function decide(b) {
    if (b.net) return b.netWinner;
    if (b.shared) return 0;
    if (ADM.win && b.players.includes(ME)) return teamOf(b, b.players.indexOf(ME));
    if (b.mods.includes("jackpot")) { const c = jpChances(b, b.cs.length); let x = Math.random() * 100; for (let k = 0; k < c.length; k++) { x -= c[k]; if (x <= 0) return k; } return c.length - 1; }
    const t = scoreOf(b, b.cs.length);
    return b.mods.includes("underdog") ? t.indexOf(Math.min(...t)) : t.indexOf(Math.max(...t));
  }
  function ensureHist(b) {
    if (b.net) { if (!b.hist) b.hist = b.players.map(() => []); return; }
    b.hist = b.hist || b.players.map(() => []);
    const upto = b.state === "done" ? b.cs.length : b.state === "live" ? b.round : 0;
    for (let r = 0; r < b.cs.length; r++) b.players.forEach((_, i) => { if (!b.hist[i][r]) { const bon = Math.random() < bonusChance(); b.hist[i][r] = bon ? rollBonus(b.cs[r]) : rollItem(b.cs[r]); if (bon) (b.bon = b.bon || {})[i + "_" + r] = 1; } });
    if (upto) b.unboxed = b.players.reduce((a, _, i) => a + tot(b, i, upto), 0);
  }
  function showResult(b) {
    $$("#bvArena .tg").forEach(el => el.classList.add(b.shared || +el.dataset.team === b.winner ? "win" : "lose"));
    let best = null; b.players.forEach((_, i) => b.hist[i].forEach((it, r) => { if (!best || it.v > best.it.v) best = { i, r, it }; }));
    const el = $(`#bvArena .sv[data-seat="${best.i}"]`); if (el) { el.classList.add("is-mvp"); el.querySelector(".sv-h").insertAdjacentHTML("beforeend", `<span class="mvp-tag">MVP</span>`); }
    $$("#bvHist .hcol")[best.i]?.children[best.r]?.classList.add("is-mvp");
    const me = b.players.indexOf(ME), g = grp(b.t), won = me >= 0 && (b.shared || teamOf(b, me) === b.winner), pay = (b.shared ? b.unboxed / b.players.length : b.unboxed / g[b.winner]) * (1 - (b.borrow || 0));
    const winners = b.players.map((p, i) => ({ p, i })).filter(x => b.shared || teamOf(b, x.i) === b.winner);
    const kicker = me < 0 ? (b.shared ? "POT SHARED" : winners.length > 1 ? "WINNERS" : "WINNER") : won ? "YOU WON" : "YOU LOST";
    const w = document.createElement("div"); w.className = "bv-win" + (won ? " me-won" : me >= 0 ? " me-lost" : "");
    w.innerHTML = `<div class="bw-rays"></div><div class="bw-in">
        <span class="bw-k">${kicker}</span>
        <div class="bw-ps">${winners.map((x, k) => `<div class="bw-p" style="--d:${.15 + k * .09}s"><span class="bw-av ${x.p === ME ? "me" : ""}">${face(x.p)}</span><b></b></div>`).join("")}</div>
        <div class="bw-amt"><span class="coin"></span><span class="num" id="bwAmt">0</span>${winners.length > 1 ? "<small>each</small>" : ""}</div>
        <button class="btn blue lip big" data-again>CREATE SAME BATTLE <span class="coin sm"></span>${fmt(b.cost)}</button>
        <button class="btn ghost lip big" data-edit>EDIT BATTLE SETTINGS</button>
        <a href="#battles" class="bw-back" data-go="battles">Back to battle list</a>
      </div>`;
    w.querySelectorAll(".bw-p b").forEach((el, k) => el.textContent = winners[k].p);
    $("#bvArena").appendChild(w);
    setTimeout(() => countUp($("#bwAmt"), pay, 1400), 450);
    if (won) confetti();
    if (won) { const host = w; for (let i = 0; i < 34; i++) { const c = document.createElement("span"); c.className = "coin bw-c"; c.style.left = rand(2, 98) + "%"; c.style.setProperty("--s", rand(.6, 1.4)); host.appendChild(c);
        c.animate([{ transform: `translateY(-40px) rotate(0deg) scale(var(--s))`, opacity: 0 }, { opacity: 1, offset: .1 }, { transform: `translateY(${host.clientHeight + 40}px) rotate(${rand(-540, 540)}deg) scale(var(--s))`, opacity: .9 }],
          { duration: rand(1600, 2800), delay: rand(200, 1400), easing: "cubic-bezier(.4,.1,.7,1)", fill: "both" }).onfinish = () => c.remove(); }
    }
    if (window.LR_SFX) (me >= 0 && !won ? LR_SFX.lose : LR_SFX.win)();
    $$("#bvTeams .tb").forEach((el, k) => el.classList.add(b.shared || k === b.winner ? "won" : "lost"));
    const loadSettings = () => { cr.cases = [...b.cs]; cr.t = b.t; cr.format = b.shared ? "shared" : isTeam(b.t) ? "teams" : "solo"; cr.modes = new Set(b.mods.filter(m => MODE_KEYS.includes(m))); cr.seat = 0;
      $("#crFast").checked = b.mods.includes("fast"); $("#crFund").checked = b.mods.includes("funded"); if (b.borrow) $("#crBorrow").value = Math.round(b.borrow * 100); $("#crBorrowRow").hidden = !$("#crFund").checked; drawBorrow();
      $$("#crFormat button").forEach(x => x.classList.toggle("on", x.dataset.v === cr.format)); drawPlayers(); drawSeats(); drawModes(); drawStage(); };
    w.querySelector("[data-again]").onclick = () => { loadSettings(); createBattle(false); };
    w.querySelector("[data-edit]").onclick = () => { loadSettings(); location.hash = "create"; };
    $("#bvRes").hidden = true;
  }
  // JACKPOT: a strip of team slices (width = win chance) slides under the pointer and stops on the winner
  const TEAMC = ["#3d8bff", "#ff5468", "#36d0ff", "#e6e9ef"];
  function jackpotPick(b, w) {
    const t = teamTotals(b, b.cs.length), sum = t.reduce((a, c) => a + c, 0) || 1, g = grp(b.t);
    const ch = jpChances(b, b.cs.length); let i = 0; const teams = g.map((n, k) => { const ps = b.players.slice(i, i + n); i += n; return { k, ps, pct: ch[k] }; });
    const o = document.createElement("div"); o.className = "jp-ov";
    o.innerHTML = `<div class="jp-pot">${modeName(b.mods).toUpperCase()} <span class="coin"></span><b>${fmt(sum)}</b></div><small class="jp-k">PICKING WINNER</small><div class="jp-win"><i class="jp-ptr"></i><div class="jp-track"></div></div>`;
    $("#bvArena").appendChild(o);
    const win = o.querySelector(".jp-win"), track = o.querySelector(".jp-track"), VW = win.clientWidth, CW = Math.max(VW * 1.25, 900), REP = 9, LAND = 7;
    const GAP = 10, segW = teams.map(x => Math.max(96, x.pct / 100 * CW)), cyc = segW.reduce((a, c) => a + c + GAP, 0);
    let html = ""; for (let r = 0; r < REP; r++) teams.forEach((x, k) => {
      html += `<div class="jp-seg" data-k="${k}" style="--c:${TEAMC[k % 4]};width:${segW[k]}px"><div class="jp-in"><span class="jp-avs">${x.ps.map(p => `<span class="av ${p === ME ? "me" : ""}">${face(p)}</span>`).join("")}</span><b>${x.pct.toFixed(2)}%</b></div></div>`; });
    track.innerHTML = html;
    const before = segW.slice(0, w).reduce((a, c) => a + c + GAP, 0), target = LAND * cyc + before + segW[w] * rand(.12, .88);
    const startX = VW / 2 - (cyc * .5 + rand(0, cyc * .3)), endX = VW / 2 - target, dur = b.mods.includes("fast") ? 4200 : 6200;
    const edges = []; { let x = 0; for (let r = 0; r < REP; r++) segW.forEach(sw => { x += sw + GAP; edges.push(x - GAP / 2); }); }
    window.LR_SFX && LR_SFX.riser && LR_SFX.riser(1200);
    return new Promise(done => { let t0 = null, lastC = -1;
      (function f(now) { if (V.b !== b) { o.remove(); return done(); } if (t0 === null) t0 = now; const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 4.2), x = startX + (endX - startX) * e;
        track.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
        const at = VW / 2 - x; let c = 0; while (c < edges.length && edges[c] < at) c++; if (c !== lastC) { if (lastC >= 0 && window.LR_SFX) LR_SFX.tick(); lastC = c; }
        if (p < 1) return requestAnimationFrame(f);
        const hit = track.children[c]; o.classList.add("done"); hit && hit.classList.add("hit");
        o.querySelector(".jp-k").textContent = "WINNER PICKED"; window.LR_SFX && LR_SFX.rare(); hit && burst(hit, TEAMC[w % 4], 26); shake(o, 5);
        setTimeout(() => { o.classList.add("out"); setTimeout(() => { o.remove(); done(); }, 300); }, 1700);
      })(performance.now()); });
  }
  // pre-battle: cover the reels and "wait for the EOS block" (demo: block + hash are made up locally)
  function eosWait(b) {
    const o = document.createElement("div"); o.className = "eos-ov"; o.innerHTML = `<b>Waiting for EOS block...</b>`;
    $("#bvArena").appendChild(o);
    return new Promise(done => setTimeout(() => { o.classList.add("out"); setTimeout(() => { o.remove(); done(); }, 250); }, 1800));
  }
  async function run(b) {
    if (V.busy) return; V.busy = true;
    try {
      await imgReady; if (V.b !== b) return;
      if (V.shown === 0 && b.round === 0) { await eosWait(b); if (V.b !== b) return; }
      while (V.b === b && b.state === "live" && b.round < b.cs.length) {
        const r = b.round; drawHex();
        await spinRound(b, r); if (V.b !== b) return;
        const bon = b.players.map((_, i) => i).filter(i => b.bon && b.bon[i + "_" + r]);
        if (bon.length) { await Promise.all(bon.map(i => stockingPop(V.reels[i]))); if (V.b !== b) return; await bonusSpin(b, r, bon); if (V.b !== b) return; }
        V.shown = r + 1; b.round = r + 1; b.unboxed = b.players.reduce((a, _, i) => a + tot(b, i, V.shown), 0);
        $$("#bvArena .sv").forEach(el => { const i = +el.dataset.seat, e = el.querySelector("[data-tot]"); if (e) { countUp(e, tot(b, i, V.shown), 700, tot(b, i, r)); e.parentElement.classList.remove("bump"); void e.offsetWidth; e.parentElement.classList.add("bump"); } });
        $$("#bvHist .hcol").forEach((col, i) => { const it = b.hist[i][r], c = col.children[r]; c.className = "hc fresh" + (b.bon && b.bon[i + "_" + r] ? " bon" : ""); c.style.setProperty("--tc", TIERC[it.t]);
          c.innerHTML = `<img src="${it.ref.src}" alt="" draggable="false"><div><b></b><small>${it.ch}%</small><span><span class="coin sm"></span>${fmt(it.v)}</span></div>`; c.querySelector("b").textContent = it.n; });
        drawTeams();
        await sleep(b.mods.includes("fast") ? 700 : 1400);
      }
      if (V.b === b && b.state === "live") { const w = decide(b); if (b.mods.includes("jackpot") && !b.shared) { await jackpotPick(b, w); if (V.b !== b) return; } finish(b, w); V.sig = b.state + "|" + b.players.join(","); drawTeams(); drawHex(); showResult(b); }
    } finally { V.busy = false; }
  }
  function vTick() {
    const b = V.b; if (!b) return;
    const sig = b.state + "|" + b.players.join(","); if (sig !== V.sig && !V.busy) { V.sig = sig; ensureHist(b); drawView(); }
    if (b.state === "live" && !V.busy) run(b);
  }
  let vTimer = null;
  function openView(id) {
    closeView(); const b = battles.find(x => x.id === id);
    if (!b) { toast(`${ic("clock")} That battle has ended`); location.hash = "battles"; return; }
    if (b.net && b.state === "live") b.round = netRound(b);
    V.b = b; b.watch = true; V.sig = ""; ensureHist(b); V.shown = b.state === "done" ? b.cs.length : b.state === "live" ? b.round : 0;
    $("#bvRes").hidden = true; vTick(); if (b.state === "done") showResult(b);
    vTimer = setInterval(vTick, 300);
  }
  function closeView() { if (V.b) V.b.watch = false; V.b = null; clearInterval(vTimer); }
  $("#bvArena").addEventListener("click", (e) => {
    const b = V.b; if (!b) return; const bot = e.target.closest("[data-bot]"), j = e.target.closest("[data-join]");
    if (bot) { callBot(b, +bot.dataset.bot); return; }
    if (j && b.net) { if (!window.LR_USER) { toast(`${ic("user")} Log in to join`); return LR_AUTH.open(); }
      if (LR.bal < b.cost) return toast(`${ic("clock")} You need <span class="coin sm"></span>${fmt(b.cost)} to join`);
      j.disabled = true; NET.req("join", { id: b.id, seat: +j.dataset.join }).then(r => { j.disabled = false; toast(r.err ? `${ic("clock")} ${r.err}` : `${ic("check")} Joined the battle`); }); return; }
    if (j) { const seat = +j.dataset.join; if (b.state !== "waiting" || b.players[seat]) return; if (b.players.includes(ME)) return toast(`${ic("check")} You're already in this battle`);
      if (LR.bal < b.cost) return toast(`${ic("clock")} You need <span class="coin sm"></span>${fmt(b.cost)} to join. Press + for more`);
      LR.spend(b.cost); b.players[seat] = ME; toast(`${ic("check")} Joined the battle`); if (!b.players.includes(null)) start(b); else botsFill(b); }
    V.sig = ""; vTick();
  });
  // bots take a moment to join (spinner on the seat), one after another
  const joining = new Set();
  function callBot(b, seat, delay = 0) {
    if (b.players[seat] || joining.has(seat)) return; joining.add(seat);
    setTimeout(() => { const btn = $(`#bvArena [data-bot="${seat}"]`); if (btn) { btn.disabled = true; btn.innerHTML = '<i class="spin"></i>Joining...'; } }, delay);
    if (b.net) { setTimeout(() => NET.send({ t: "bot", id: b.id, seat }), delay + rand(400, 650)); setTimeout(() => joining.delete(seat), delay + 2000); return; }
    setTimeout(() => { joining.delete(seat); if (V.b !== b || b.players[seat]) return;
      b.players[seat] = pick(NAMES.filter(n => !b.players.includes(n))); window.LR_SFX && LR_SFX.join();
      if (!b.players.includes(null)) { start(b); ensureHist(b); } V.sig = ""; vTick();
      const el = $(`#bvArena .sv[data-seat="${seat}"]`); el && el.classList.add("joined"); }, delay + rand(550, 800));
  }
  $("#bvCall").onclick = () => { const b = V.b; if (!b) return; let d = 0; b.players.forEach((p, i) => { if (!p) { callBot(b, i, d); d += 420; } }); };
  $("#bvLink").onclick = () => { try { navigator.clipboard.writeText(location.href); } catch (e) {} toast(`${ic("check")} Battle link copied`); };
  $("#bvFair").onclick = () => toast(`${ic("check")} Demo: results use your browser's random numbers`);
  addEventListener("resize", () => { if (V.b && !V.busy) { V.sig = ""; vTick(); } });


  // ---------- case contents ("items in this case") ----------
  const caseModal = document.createElement("div"); caseModal.className = "modal cm-modal"; caseModal.hidden = true; document.body.appendChild(caseModal);
  function showCase(k) {
    const c = CASES[k], items = [...casePool(k)].sort((a, b) => b.ch - a.ch), d = new Date();
    const pct = (x) => (x < 1 ? x.toFixed(2) : x % 1 ? x.toFixed(1) : x) + "%";
    caseModal.innerHTML = `<div class="cm">
      <div class="cm-top"><b>${ic("box")}${items.length} ITEMS IN <span></span></b><small>${ic("clock")}Last update: ${d.toLocaleDateString()} - ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</small><button class="cm-x" title="Close">${ic("x")}</button></div>
      <div class="cm-row">${items.map((it, i) => `<div class="cmi" style="--tc:${TIERC[it.t]};--d:${i * .03}s"><span class="cmi-ch">${pct(it.ch)}</span><img src="${it.ref.src}" alt="" draggable="false"><b></b><span class="cmi-v"><span class="coin sm"></span>${fmt(it.v)}</span></div>`).join("")}</div>
    </div>`;
    caseModal.querySelector(".cm-top b span").textContent = c.n.toUpperCase();
    caseModal.querySelectorAll(".cmi b").forEach((el, i) => { el.textContent = items[i].n; el.title = items[i].n; });
    caseModal.querySelector(".cm-x").onclick = () => caseModal.hidden = true;
    caseModal.hidden = false;
  }
  caseModal.addEventListener("click", (e) => { if (e.target === caseModal) caseModal.hidden = true; });
  addEventListener("keydown", (e) => { if (e.key === "Escape") caseModal.hidden = true; });
  document.addEventListener("click", (e) => { const t = e.target.closest("[data-case]"); if (!t || t.closest(".cm")) return; e.stopPropagation(); showCase(+t.dataset.case); }, true);

  // ---------- routing ----------
  function route() {
    const h = location.hash.replace("#", ""), bm = h.match(/^battle-(\d+)$/);
    $("#view-home").hidden = h === "battles" || h === "create" || !!bm; $("#view-battles").hidden = h !== "battles"; $("#view-create").hidden = h !== "create"; $("#view-battle").hidden = !bm;
    $(".foot").hidden = h === "create" || !!bm;
    if (bm) openView(+bm[1]); else closeView();
    $$("[data-nav]").forEach(a => a.classList.toggle("on", a.dataset.nav === h || (a.dataset.nav === "battles" && (h === "create" || h.startsWith("battle-")))));
    $("#main").scrollTop = 0; if (h === "battles") renderBattles();
    $$(".deal:not(.in)").forEach(el => io.observe(el));
  }
  document.addEventListener("click", (e) => { const g = e.target.closest("[data-go]"); if (!g) return; e.preventDefault(); dd.classList.remove("open"); location.hash = g.dataset.go; if (!g.dataset.go) route(); });
  addEventListener("hashchange", route);
  route();

  paint();
  // ---------- admin panel (type the secret command in chat) ----------
  const adm = document.createElement("div"); adm.className = "adm"; adm.hidden = true; document.body.appendChild(adm);
  const admDraw = () => {
    adm.innerHTML = `<div class="adm-in"><div class="adm-h"><b>${ic("bolt")} Admin panel</b><button class="adm-x" data-a="close">${ic("x")}</button></div>
      <div class="adm-s"><small>Balance</small><div class="adm-r"><span class="adm-v"><span class="coin sm"></span>${fmt(LR.bal)}</span>
        <input id="admBal" type="number" min="0" step="0.01" placeholder="Set $"><button data-a="set">Set</button></div>
        <div class="adm-r"><button data-a="add" data-v="10000">+$10</button><button data-a="add" data-v="100000">+$100</button><button data-a="add" data-v="1000000">+$1,000</button><button data-a="zero">Set $0</button></div></div>
      <div class="adm-s"><small>Battles</small>
        <label class="adm-t"><input type="checkbox" data-a="bonus" ${ADM.bonus ? "checked" : ""}><i></i>Every pull is a Gold Spin</label>
        <label class="adm-t"><input type="checkbox" data-a="win" ${ADM.win ? "checked" : ""}><i></i>I always win my battles</label>
        <div class="adm-r"><button data-a="spawn">Spawn 3 battles</button><button data-a="clear">Clear finished</button></div></div>
      <div class="adm-s"><small>Site</small><div class="adm-r"><button data-a="rain">Start rain now</button><button data-a="accounts">Wipe accounts</button></div></div>
      <p class="adm-n">Demo only. Once the site is online, admin has to live on the server, not in this file.</p></div>`;
    paint(adm);
  };
  window.LR_ADMIN = () => { admDraw(); adm.hidden = false; };
  adm.addEventListener("click", (e) => {
    if (e.target === adm) return adm.hidden = true;
    const b = e.target.closest("[data-a]"); if (!b || b.tagName === "INPUT") return; const a = b.dataset.a;
    if (a === "close") return adm.hidden = true;
    if (a === "set") { const v = parseFloat($("#admBal").value); if (isNaN(v) || v < 0) return; LR.spend(LR.bal); LR.addCoins(Math.round(v * 1000), b); }
    if (a === "add") LR.addCoins(+b.dataset.v, b);
    if (a === "zero") LR.spend(LR.bal);
    if (a === "spawn") { for (let k = 0; k < 3; k++) battles.unshift(mk("waiting")); renderBattles(); }
    if (a === "clear") { battles = battles.filter(x => x.state !== "done"); renderBattles(); }
    if (a === "rain") { rainEnd = Date.now() + 5000; }
    if (a === "accounts") { try { localStorage.removeItem("lr2_accounts"); localStorage.removeItem("lr2_session"); sessionStorage.removeItem("lr2_session"); } catch (err) {} return location.reload(); }
    toast(`${ic("check")} Done`); setTimeout(admDraw, 650);
  });
  adm.addEventListener("change", (e) => { const a = e.target.dataset.a; if (a === "bonus" || a === "win") { ADM[a] = e.target.checked; toast(`${ic("check")} ${a === "bonus" ? "Gold Spin" : "Always win"} ${e.target.checked ? "on" : "off"}`); } });

  // =====================================================================
  // ONLINE: talk to server.js (shared chat, battles, balances, tips, rain)
  // =====================================================================
  NET.skew = 0;
  // where the clients' animation should be right now (matches server.js duration())
  function netRound(b) {
    const fast = b.mods.includes("fast"), per = fast ? 4500 : 8000; let t = Date.now() - (b.startAt + NET.skew) - 2400, r = 0;
    while (r < b.cs.length) { const extra = b.players.some((_, i) => b.bon && b.bon[i + "_" + r]) ? (fast ? 5000 : 7000) : 0; if (t < per + extra) break; t -= per + extra; r++; }
    return Math.max(0, r);
  }
  function fromSrv(s) {
    const b = { ...s, net: 1, round: 0, unboxed: 0, winner: -1, netWinner: s.winner, hist: null, bon: s.bon || {} };
    if (s.hist) { b.hist = s.hist.map(row => row.map((ix, r) => casePool(s.cs[r])[ix])); b.srvHist = 1; }
    if (s.state === "live") b.round = netRound(b);
    if (s.state === "done") { b.round = b.cs.length; b.winner = s.winner; b.doneAt = Date.now(); }
    if (b.hist && b.round) b.unboxed = b.players.reduce((a, _, i) => a + tot(b, i, b.round), 0);
    return b;
  }
  function upsert(s) {
    const L = battles.find(x => x.net && x.id === s.id);
    if (!L) battles.unshift(fromSrv(s));
    else {
      L.players = s.players; L.owner = s.owner;
      if (s.hist && !L.srvHist) { L.hist = s.hist.map(row => row.map((ix, r) => casePool(s.cs[r])[ix])); L.bon = s.bon || {}; L.srvHist = 1; L.startAt = s.startAt; L.netWinner = s.winner; if (L.state === "waiting") { L.state = "live"; L.round = 0; } }
      if (s.state === "done" && L.state !== "done" && !L.watch) { L.state = "done"; L.round = L.cs.length; L.winner = s.winner; L.doneAt = Date.now(); L.unboxed = L.players.reduce((a, _, i) => a + tot(L, i, L.round), 0); }
    }
    if (!$("#view-battles").hidden) renderBattles();
    if (V.b && V.b.id === s.id && V.b.net) vTick();
  }
  function meIn(m) {
    LR.setWager(m.wagered, m.tipped); NET.admin = m.admin;
    if (m.gain > 0) { LR.setBal(m.bal - m.gain); LR.addCoins(m.gain, $("#bal")); } else LR.setBal(m.bal);
  }
  const ON = {
    me: meIn,
    authfail() { try { localStorage.removeItem("lr2_session"); sessionStorage.removeItem("lr2_session"); } catch (e) {} location.reload(); },
    init(m) {
      NET.skew = Date.now() - m.now;
      if (!NET.chatShown) { NET.chatShown = 1; m.chat.forEach(x => msg(x.name, x.text, x.sys ? "sys" : x.name === ME ? "me" : "")); }
      battles = battles.filter(b => !b.net || m.battles.some(s => s.id === b.id)); m.battles.forEach(upsert);
      rainSet(m.rain); $("#online").textContent = m.online; renderBattles(); if (V.b) { const id = V.b.id; closeView(); openView(id); }
    },
    chat(m) { msg(m.m.name, m.m.text, m.m.sys ? "sys" : m.m.name === ME ? "me" : ""); if (m.m.name !== ME) window.LR_SFX && LR_SFX.msg && LR_SFX.msg(); },
    battle(m) { upsert(m.b); },
    gone(m) { const i = battles.findIndex(b => b.net && b.id === m.id); if (i >= 0 && !battles[i].watch) battles.splice(i, 1); if (!$("#view-battles").hidden) renderBattles(); },
    online(m) { $("#online").textContent = m.n; },
    rain(m) { rainSet(m); },
    err(m) { toast(`${ic("clock")} ${m.msg}`); },
    res(m) { const f = NET.wait[m.rid]; if (f) { delete NET.wait[m.rid]; f(m); } },
  };
  function connect() {
    const ws = NET.ws = new WebSocket((location.protocol === "https:" ? "wss://" : "ws://") + location.host + "/ws");
    ws.onopen = () => { NET.tries = 0; let tok = null; try { tok = (JSON.parse(localStorage.getItem("lr2_session")) || JSON.parse(sessionStorage.getItem("lr2_session")) || {}).token; } catch (e) {}
      ws.send(JSON.stringify({ t: "hello", token: tok })); NET.q.splice(0).forEach(o => ws.send(JSON.stringify(o))); $(".layout").classList.remove("offline"); };
    ws.onmessage = (e) => { let m; try { m = JSON.parse(e.data); } catch (er) { return; } const h = ON[m.t]; if (h) h(m); };
    ws.onclose = () => { $(".layout").classList.add("offline"); const d = Math.min(8000, 600 * Math.pow(2, NET.tries = (NET.tries || 0) + 1)); setTimeout(connect, d); };
  }
  if (NET.on) {
    connect();
    $("#bvFair").onclick = () => toast(`${ic("check")} Results are rolled on the server, everyone sees the same spin`);
    if (!window.LR_USER) setTimeout(() => toast(`${ic("user")} Log in to chat, battle and tip`), 1200);
  }
  // online admin panel (server checks you're on its ADMIN_USERS list)
  if (NET.on) window.LR_ADMIN = async () => {
    const r = await NET.req("admin", { a: "list" }); if (r.err) return toast(`${ic("clock")} ${r.err}`);
    adm.innerHTML = `<div class="adm-in"><div class="adm-h"><b>${ic("bolt")} Admin panel</b><button class="adm-x" data-n="close">${ic("x")}</button></div>
      <div class="adm-s"><small>Give balance</small><div class="adm-r"><input id="admU" placeholder="Player" list="admL" style="width:130px"><datalist id="admL">${r.users.map(x => `<option value="${x.u}">`).join("")}</datalist>
        <input id="admV" type="number" step="0.01" placeholder="$" style="width:80px"><button data-n="add">Add</button><button data-n="set">Set</button></div>
        <div class="adm-r adm-ul">${r.users.map(x => `<span><b></b> <span class="coin sm"></span>${fmt(x.bal)}</span>`).join("")}</div></div>
      <div class="adm-s"><small>Cheats (only your battles)</small>
        <label class="adm-t"><input type="checkbox" data-n="bonus"><i></i>Every pull is a Gold Spin</label>
        <label class="adm-t"><input type="checkbox" data-n="win"><i></i>I always win my battles</label></div>
      <div class="adm-s"><small>Site</small><div class="adm-r"><button data-n="rain">Start rain now</button><button data-n="clear">Clear finished battles</button></div></div></div>`;
    paint(adm); adm.querySelectorAll(".adm-ul b").forEach((el, k) => el.textContent = r.users[k].u); adm.hidden = false;
  };
  adm.addEventListener("click", async (e) => {
    const b = e.target.closest("[data-n]"); if (!NET.on || !b || b.tagName === "INPUT") return; e.stopImmediatePropagation(); const a = b.dataset.n;
    if (a === "close") return adm.hidden = true;
    const o = { a }; if (a === "add" || a === "set") { o.user = $("#admU").value.trim() || ME; o.v = Math.round(parseFloat($("#admV").value) * 1000); if (isNaN(o.v)) return toast(`${ic("clock")} Enter an amount`); }
    const r = await NET.req("admin", o); toast(r.err ? `${ic("clock")} ${r.err}` : `${ic("check")} Done`); if (!r.err && (a === "add" || a === "set")) LR_ADMIN();
  }, true);
  adm.addEventListener("change", (e) => { const a = e.target.dataset.n; if (NET.on && (a === "bonus" || a === "win")) NET.req("admin", { a, on: e.target.checked }).then(r => toast(r.err ? r.err : `${ic("check")} ${a === "bonus" ? "Gold Spin" : "Always win"} ${e.target.checked ? "on" : "off"}`)); }, true);

})();

// =====================================================================
// Sounds: all made live with the browser's audio engine (no files).
// Clicks are short "wet" bloops, reels tick like a ratchet, big moments get
// risers, impacts and sparkles instead of musical notes.
// =====================================================================
(() => {
  const $ = (s) => document.querySelector(s);
  let ctx = null, master = null, comp = null, muted = false, nbuf = null;
  try { muted = localStorage.getItem("lr_muted") === "1"; } catch (e) {}
  function init() {
    if (ctx) return; const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    ctx = new AC(); comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4; comp.connect(ctx.destination);
    master = ctx.createGain(); master.gain.value = muted ? 0 : .55; master.connect(comp);
    nbuf = ctx.createBuffer(1, ctx.sampleRate * 2.5, ctx.sampleRate); const d = nbuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  addEventListener("pointerdown", init, { once: true, capture: true }); addEventListener("keydown", init, { once: true, capture: true });
  const on = () => ctx && !muted;
  function tone(freq, dur, { type = "sine", vol = .2, to = null, delay = 0, attack = .003 } = {}) {
    if (!on()) return; const t = ctx.currentTime + delay, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t); if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + attack); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + .03);
  }
  function noise({ freq = 3000, to = null, q = 1, dur = .02, vol = .3, delay = 0, type = "bandpass", attack = .001 } = {}) {
    if (!on()) return; const t = ctx.currentTime + delay, src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    src.buffer = nbuf; f.type = type; f.Q.value = q; f.frequency.setValueAtTime(freq, t); if (to) f.frequency.exponentialRampToValueAtTime(to, t + dur);
    g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(vol, t + attack); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(master); src.loop = dur > 2.3; src.start(t, Math.max(0, Math.random() * (2.5 - dur - .1))); src.stop(t + dur + .03);
  }
  // a small crowd going "awww": detuned voices through vowel formants, pitch sliding down
  function aww() {
    if (!on()) return; const t = ctx.currentTime, out = ctx.createGain(); out.gain.value = .9; out.connect(master);
    const f1 = ctx.createBiquadFilter(), f2 = ctx.createBiquadFilter(); f1.type = f2.type = "bandpass";
    f1.frequency.setValueAtTime(820, t); f1.frequency.linearRampToValueAtTime(600, t + 1.1); f1.Q.value = 6;
    f2.frequency.setValueAtTime(1250, t); f2.frequency.linearRampToValueAtTime(950, t + 1.1); f2.Q.value = 8;
    f1.connect(out); f2.connect(out);
    for (let v = 0; v < 7; v++) {
      const o = ctx.createOscillator(), g = ctx.createGain(), st = t + v * .03 + Math.random() * .05, p = (v < 4 ? 260 : 170) * (1 + (Math.random() - .5) * .08);
      o.type = "sawtooth"; o.frequency.setValueAtTime(p * 1.12, st); o.frequency.exponentialRampToValueAtTime(p, st + .25); o.frequency.exponentialRampToValueAtTime(p * .72, st + 1.2);
      const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = 5 + Math.random() * 2; lg.gain.value = p * .015; lfo.connect(lg); lg.connect(o.frequency); lfo.start(st); lfo.stop(st + 1.4);
      g.gain.setValueAtTime(.0001, st); g.gain.linearRampToValueAtTime(.09, st + .12); g.gain.setValueAtTime(.09, st + .55); g.gain.exponentialRampToValueAtTime(.0001, st + 1.3);
      o.connect(g); g.connect(f1); g.connect(f2); o.start(st); o.stop(st + 1.35);
    }
    noise({ freq: 1000, q: .8, dur: 1, vol: .04, attack: .15 });
  }
  // plain soft click: tiny filtered tap + a short low body, no pitch sweep
  const wet = (hi = 1, v = 1) => { noise({ freq: 1700 * hi, q: 1.6, dur: .012, vol: .28 * v }); tone(210 * hi, .03, { vol: .12 * v, type: "triangle" }); };
  const SFX = {
    click: () => wet(1, 1),
    tab: () => wet(1.35, .7),
    add: () => { wet(1.15, 1); noise({ freq: 2600, q: 2, dur: .01, vol: .14, delay: .045 }); },
    pop: () => wet(.8, .8),
    msg: () => noise({ freq: 4200, q: 6, dur: .01, vol: .05 }),
    coin: () => { [0, .05, .11, .16].forEach((d, i) => { noise({ freq: 5200 + i * 600 + Math.random() * 400, q: 14, dur: .09, vol: .28, delay: d }); tone(3100 + i * 260, .05, { vol: .025, delay: d }); }); },
    tick: () => { noise({ freq: 2300 + Math.random() * 300, q: 3.5, dur: .012, vol: .45 }); tone(1500, .014, { vol: .045, to: 600 }); },
    land: () => { tone(300, .13, { vol: .34, to: 85 }); noise({ freq: 900, type: "lowpass", dur: .07, vol: .25 }); },
    rare: () => { tone(95, .55, { vol: .55, to: 38 }); noise({ freq: 5000, to: 250, type: "lowpass", dur: .45, vol: .32 }); noise({ freq: 3200, q: 2, dur: .04, vol: .3 });
      for (let i = 0; i < 9; i++) noise({ freq: 6500 + Math.random() * 3000, q: 10, dur: .05, vol: .12, delay: .15 + i * .07 + Math.random() * .04 }); },
    // countdown: a riser swells under 3-2-1, each number is a harder thump, then a big drop
    riser: (ms = 2000) => { const d = ms / 1000; noise({ freq: 300, to: 6500, q: 1.4, dur: d, vol: .16, attack: d * .92 }); tone(110, d, { vol: .07, to: 330, attack: d * .9, type: "sawtooth" }); },
    count: (n) => { const p = { 3: 1, 2: 1.25, 1: 1.6 }[n] || 1; tone(170 * p, .2, { vol: .5, to: 60 * p }); noise({ freq: 2200 * p, q: 2, dur: .03, vol: .25 }); },
    go: () => { tone(80, .8, { vol: .65, to: 32 }); noise({ freq: 7000, to: 180, type: "lowpass", dur: .6, vol: .4 }); noise({ freq: 3000, q: 1.5, dur: .05, vol: .35 }); },
    join: () => { noise({ freq: 700, to: 2600, q: 1.2, dur: .12, vol: .08, attack: .1 }); wet(1, .9); },
    win: () => { noise({ freq: 400, to: 7000, q: 1.2, dur: .5, vol: .2, attack: .45 }); tone(220, .5, { vol: .08, to: 880, attack: .45, type: "triangle" });
      setTimeout(() => { tone(70, .9, { vol: .6, to: 30 }); noise({ freq: 8000, to: 300, type: "lowpass", dur: .7, vol: .38 });
        for (let i = 0; i < 18; i++) noise({ freq: 6000 + Math.random() * 4000, q: 10, dur: .06, vol: .14, delay: .05 + i * .065 + Math.random() * .05 }); }, 470); },
    lose: () => { aww(); },
    // GOLD SPIN: a launch hit, a whoosh that follows the coin's speed, metal "shing" pings, a big jackpot landing
    goldStart: () => { tone(60, .7, { vol: .75, to: 30 }); noise({ freq: 300, to: 5000, q: .8, dur: .45, vol: .35, attack: .05 }); noise({ freq: 2600, q: 1.2, dur: .06, vol: .5 });
      for (let i = 0; i < 5; i++) noise({ freq: 6000 + Math.random() * 3000, q: 25, dur: .04, vol: .18, delay: .04 + i * .05 }); },
    goldWhoosh: () => { if (!on()) return null; const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      src.buffer = nbuf; src.loop = true; f.type = "bandpass"; f.Q.value = 1.4; f.frequency.value = 400; g.gain.value = 0;
      src.connect(f); f.connect(g); g.connect(master); src.start();
      return { set(speed) { const t = ctx.currentTime; f.frequency.setTargetAtTime(350 + speed * 2600, t, .03); g.gain.setTargetAtTime(Math.min(.55, speed * .6), t, .04); },
        stop() { const t = ctx.currentTime; g.gain.setTargetAtTime(0, t, .06); src.stop(t + .4); } }; },
    goldTick: (k = 1) => { const b = 2900 + Math.random() * 300; [1, 2.76, 5.4].forEach((m, i) => tone(b * m / 2, .07 + .05 * k, { vol: (.11 - i * .03) * k, type: "sine" })); noise({ freq: 6000, q: 3, dur: .012, vol: .25 * k }); },
    // landing: no musical notes - a heavy thud, a crash, then a shower of real-sounding coin clinks
    goldLand: () => { tone(70, .28, { vol: .85, to: 38 }); noise({ freq: 900, type: "lowpass", dur: .18, vol: .7 }); noise({ freq: 7000, to: 1500, type: "lowpass", dur: .5, vol: .32, delay: .02 });
      const clink = (d, v) => { const f = 4200 + Math.random() * 3800; noise({ freq: f, q: 28, dur: .05, vol: v, delay: d }); noise({ freq: f * 1.47, q: 30, dur: .035, vol: v * .6, delay: d + .004 }); };
      for (let i = 0; i < 22; i++) clink(.08 + i * .05 + Math.random() * .04, .34 * (1 - i / 30)); },
    shine: () => { noise({ freq: 1500, to: 9000, q: 1.5, dur: .42, vol: .2, attack: .22 }); },
    thud: () => { tone(240, .7, { vol: .22, to: 70 }); noise({ freq: 1200, to: 150, type: "lowpass", dur: .5, vol: .18 }); },
  };
  // a different sound for each battle mode
  SFX.mode = (m) => {
    if (m === "classic") { tone(520, .09, { vol: .22 }); tone(780, .12, { vol: .18, delay: .07 }); noise({ freq: 4200, q: 3, dur: .05, vol: .12 }); }
    else if (m === "jackpot") { [660, 830, 990, 1320].forEach((f, i) => tone(f, .16, { vol: .14, delay: i * .055, type: "triangle" })); noise({ freq: 7000, q: 8, dur: .25, vol: .08, delay: .18 }); }
    else if (m === "terminal") { tone(140, .35, { vol: .35, to: 60, type: "sawtooth" }); noise({ freq: 600, type: "lowpass", dur: .2, vol: .3 }); }
    else if (m === "underdog") { tone(700, .22, { vol: .2, to: 260, type: "square" }); tone(350, .18, { vol: .12, to: 180, delay: .12 }); }
  };
  window.LR_SFX = SFX;

  // click sounds only (no hover sounds)
  const CLICK = "button,a,.g:not(.soon),.hb,label.cr-row,.br .sl.empty";
  document.addEventListener("click", (e) => {
    const el = e.target.closest(CLICK); if (!el || el.id === "mute" || el.disabled) return;
    if (el.closest(".tabs,.dots,.seg,.tri,.risk-chips")) SFX.tab();
    else if (el.matches("[data-inc],[data-add]")) SFX.add();
    else if (el.matches("[data-bot],[data-join],#bvCall")) SFX.join();
    else SFX.click();
  });
  const bal = $(".bal");
  new MutationObserver(() => { if (bal.classList.contains("bump")) SFX.coin(); }).observe(bal, { attributes: true, attributeFilter: ["class"] });
  const toast = $("#toast");
  new MutationObserver(() => { if (toast.classList.contains("show")) SFX.pop(); }).observe(toast, { attributes: true, attributeFilter: ["class"] });

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
