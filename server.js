// LootRush shared server: serves the site, keeps accounts, balances, chat, battles and rain for everyone.
// Play money only. Run: npm install && npm start   (Render: build "npm install", start "npm start")
const http = require("http"), fs = require("fs"), path = require("path"), crypto = require("crypto");
const { WebSocketServer } = require("ws");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const DATA = process.env.DATA_DIR || path.join(ROOT, "data");
const ADMINS = (process.env.ADMIN_USERS || "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
// Password mode: set SITE_PASSWORD on Render and everyone must enter it (any username) before the site loads.
const SITE_PASSWORD = process.env.SITE_PASSWORD || "";
const gateOk = (req) => { if (!SITE_PASSWORD) return true; const h = req.headers.authorization || ""; if (!h.startsWith("Basic ")) return false;
  const pw = Buffer.from(h.slice(6), "base64").toString().split(":").slice(1).join(":"); const a = Buffer.from(pw), b = Buffer.from(SITE_PASSWORD);
  return a.length === b.length && crypto.timingSafeEqual(a, b); };
const START_BAL = 0;                     // new accounts start empty; the admin gives balance
const TIP_MIN_WAGER = 5000, TIP_DAY_LIMIT = 100000;

// ---------------------------------------------------------------- storage
fs.mkdirSync(DATA, { recursive: true });
const DBF = path.join(DATA, "db.json");
let db = { users: {}, tokens: {} };
try { db = JSON.parse(fs.readFileSync(DBF, "utf8")); } catch (e) {}
let dirty = false; const save = () => { dirty = true; };
setInterval(() => { if (!dirty) return; dirty = false; fs.writeFile(DBF + ".tmp", JSON.stringify(db), (e) => { if (!e) fs.rename(DBF + ".tmp", DBF, () => {}); }); }, 2000);
const hashPw = (pw, salt) => crypto.scryptSync(pw, salt, 32).toString("hex");
const today = () => new Date().toISOString().slice(0, 10);

// ---------------------------------------------------------------- game data (must match app.js)
const V = { pal: 40, visor: 60, tb: 80, lav: 90, charm: 120, bun: 150, kitty: 190, beau: 210, band: 300, big: 400, biv: 650, adu: 900, horns: 2600, rstb: 9500, fed: 9800, clock: 18400, sshf: 27300, bit: 31000, dom: 33900, pstf: 44100, stf: 61200, valk: 96500, dominus: 412000 };
const CASE_ITEMS = ["pal visor tb lav charm bun kitty horns", "visor lav charm bun kitty beau band rstb", "charm kitty beau band big biv adu fed", "beau band big biv adu horns rstb sshf", "big biv adu horns fed clock dom pstf", "biv adu horns rstb clock sshf bit stf", "adu horns fed clock sshf dom pstf valk", "horns rstb clock bit dom stf valk dominus", "clock sshf bit dom pstf stf valk dominus"];
const VOL = 1.35;   // higher = more volatile (cheap items more common, top items rarer)
const POOLS = CASE_ITEMS.map(s => { const its = s.split(" ").map(k => V[k]), w = its.map(v => Math.pow(v, -VOL)), S = w.reduce((a, c) => a + c, 0); return its.map((v, i) => ({ v, ch: w[i] / S * 100 })); });
const PRICE = POOLS.map(p => Math.round(p.reduce((a, x) => a + x.v * x.ch / 100, 0) / .92));
const BOTS = ["BaconHairBandit", "NoobSlayer9000", "Sir_Lags_Alot", "OofMaster", "RobuxBeggar", "GrandmaGamer", "CertifiedNoob", "Sweaty_Tryhard", "LagWizard", "DadOfTheYear", "BuilderGuy404", "ChunkyMilk", "BruhMoment", "UnpaidIntern", "TouchGrassPls", "TaxEvader3000", "Guest_1337", "WiFiBandit", "SpicyNugget", "ClumsyKnight", "MomSaidNo", "PizzaRat", "SnackGoblin", "TrashPanda", "HappyFlop"];
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const rollIdx = (k) => { let x = Math.random() * 100; const p = POOLS[k]; for (let i = 0; i < p.length; i++) { x -= p[i].ch; if (x <= 0) return i; } return 0; };
const rollBonus = () => { const w = [55, 28, 13, 4]; let x = Math.random() * 100; for (let i = 0; i < 4; i++) { x -= w[i]; if (x <= 0) return 4 + i; } return 4; };
const grp = (t) => t.split("v").map(Number), seats = (t) => grp(t).reduce((a, b) => a + b, 0);
const teamOf = (t, i) => { let s = 0; const g = grp(t); for (let k = 0; k < g.length; k++) { if (i < s + g[k]) return k; s += g[k]; } return 0; };
const FORMATS = ["1v1", "1v1v1", "1v1v1v1", "2v2", "3v3", "2v2v2"];

// ---------------------------------------------------------------- state
const clients = new Set();
const battles = new Map(); let nextId = 1;
const chatLog = [];
const rain = { pot: 1500, end: Date.now() + 300000, joined: new Set() };

const send = (ws, o) => { if (ws.readyState === 1) ws.send(JSON.stringify(o)); };
const all = (o) => { const s = JSON.stringify(o); for (const c of clients) if (c.readyState === 1) c.send(s); };
const userOf = (name) => db.users[String(name || "").toLowerCase()];
const sockOf = (name) => [...clients].filter(c => c.user && c.user.toLowerCase() === String(name).toLowerCase());
const meMsg = (u) => ({ t: "me", user: u.u, bal: Math.round(u.bal), wagered: u.wag || 0, tipped: u.tipDay === today() ? u.tipped : 0, admin: ADMINS.includes(u.u.toLowerCase()) });
const pushMe = (u, gain) => sockOf(u.u).forEach(c => send(c, { ...meMsg(u), gain: gain || 0 }));
const sysChat = (text) => { const m = { name: "LootRush", text, ts: Date.now(), sys: 1 }; chatLog.push(m); if (chatLog.length > 60) chatLog.shift(); all({ t: "chat", m }); };

function pub(b) { return { id: b.id, t: b.t, cs: b.cs, mods: b.mods, borrow: b.borrow, shared: b.shared, value: b.value, cost: b.cost, players: b.players, owner: b.owner, state: b.state, startAt: b.startAt, hist: b.hist, bon: b.bon, winner: b.winner, born: b.born }; }
const upd = (b) => all({ t: "battle", b: pub(b) });

// how long the clients' animation takes, so payouts land when the reels do
function duration(b) {
  const fast = b.mods.includes("fast"), round = fast ? 4500 : 8000; let ms = 2400 + b.cs.length * round;
  for (let r = 0; r < b.cs.length; r++) if (b.players.some((_, i) => b.bon[i + "_" + r])) ms += fast ? 5000 : 7000;
  if (b.mods.includes("jackpot") && !b.shared) ms += (fast ? 4200 : 6200) + 2200;
  return ms;
}
function decide(b) {
  if (b.shared) return 0;
  const g = grp(b.t), term = b.mods.includes("terminal"), sc = g.map(() => 0);
  b.players.forEach((p, i) => { const rs = term ? [b.cs.length - 1] : b.cs.map((_, r) => r); rs.forEach(r => sc[teamOf(b.t, i)] += POOLS[b.cs[r]][b.hist[i][r]].v); });
  const adminIn = b.players.findIndex(p => { const u = userOf(p); return u && u.cheatWin && ADMINS.includes(p.toLowerCase()); });
  if (adminIn >= 0) return teamOf(b.t, adminIn);
  const inv = b.mods.includes("underdog");
  if (b.mods.includes("jackpot")) { const w = sc.map(v => inv ? 1 / Math.max(v, 1) : Math.max(v, 0)), S = w.reduce((a, c) => a + c, 0) || 1; let x = Math.random() * S; for (let k = 0; k < w.length; k++) { x -= w[k]; if (x <= 0) return k; } return w.length - 1; }
  return inv ? sc.indexOf(Math.min(...sc)) : sc.indexOf(Math.max(...sc));
}
function startBattle(b) {
  b.state = "live"; b.startAt = Date.now(); b.hist = b.players.map(() => []); b.bon = {};
  const gold = b.players.some(p => { const u = userOf(p); return u && u.cheatBonus && ADMINS.includes(p.toLowerCase()); });
  b.players.forEach((p, i) => b.cs.forEach((k, r) => { const bonus = Math.random() < (gold ? 1 : 1 / 25); b.hist[i][r] = bonus ? rollBonus() : rollIdx(k); if (bonus) b.bon[i + "_" + r] = 1; }));
  b.winner = decide(b); upd(b);
  b.timer = setTimeout(() => finishBattle(b), duration(b));
}
function finishBattle(b) {
  if (b.state === "done") return; b.state = "done"; b.doneAt = Date.now();
  const unboxed = b.players.reduce((a, _, i) => a + b.cs.reduce((s, k, r) => s + POOLS[k][b.hist[i][r]].v, 0), 0), g = grp(b.t), keep = 1 - (b.borrow || 0);
  b.players.forEach((p, i) => { const u = userOf(p); if (!u) return;
    const win = b.shared ? unboxed / b.players.length * keep : teamOf(b.t, i) === b.winner ? unboxed / g[b.winner] * keep : 0;
    if (win > 0) { u.bal += win; save(); pushMe(u, win); } });
  upd(b); setTimeout(() => { battles.delete(b.id); all({ t: "gone", id: b.id }); }, 90000);
}
function fillBot(b, seat) {
  if (b.state !== "waiting" || b.players[seat]) return;
  b.players[seat] = pick(BOTS.filter(n => !b.players.includes(n)));
  if (!b.players.includes(null)) startBattle(b); else upd(b);
}
// clean up battles nobody finished filling
setInterval(() => { for (const b of battles.values()) if (b.state === "waiting" && Date.now() - b.born > 30 * 60000) { battles.delete(b.id); all({ t: "gone", id: b.id }); } }, 60000);

// ---------------------------------------------------------------- rain
setInterval(() => {
  if (Math.random() < .35) rain.pot += 5 + Math.floor(Math.random() * 40);
  if (Date.now() < rain.end) return;
  const js = [...rain.joined].map(userOf).filter(Boolean);
  if (js.length) { const share = rain.pot / js.length; js.forEach(u => { u.bal += share; pushMe(u, share); }); save(); sysChat(`Rain paid ${(rain.pot / 1000).toFixed(2)} to ${js.length} player${js.length > 1 ? "s" : ""}!`); }
  rain.pot = 1000 + Math.floor(Math.random() * 800); rain.end = Date.now() + 300000; rain.joined.clear();
  all({ t: "rain", pot: rain.pot, end: rain.end, joined: false });
}, 1000);
setInterval(() => all({ t: "rain", pot: rain.pot, end: rain.end }), 5000);

// ---------------------------------------------------------------- messages
const lastChat = new WeakMap();
const handlers = {
  hello(ws, m) {
    const name = db.tokens[m.token]; const u = name && userOf(name);
    if (m.token && !u) send(ws, { t: "authfail" });
    if (u) { ws.user = u.u; send(ws, meMsg(u)); }
    send(ws, { t: "init", battles: [...battles.values()].map(pub), chat: chatLog, rain: { pot: rain.pot, end: rain.end, joined: !!(u && rain.joined.has(u.u)) }, online: clients.size, now: Date.now() });
  },
  register(ws, m, rid) {
    const u = String(m.user || "").trim(), email = String(m.email || "").trim().toLowerCase(), pw = String(m.pw || "");
    if (!/^[A-Za-z0-9_]{3,20}$/.test(u)) return send(ws, { t: "res", rid, err: "Username: 3 to 20 letters, numbers or _" });
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return send(ws, { t: "res", rid, err: "Enter a valid email" });
    if (pw.length < 6) return send(ws, { t: "res", rid, err: "Password needs at least 6 characters" });
    if (userOf(u) || BOTS.some(b => b.toLowerCase() === u.toLowerCase()) || u.toLowerCase() === "lootrush") return send(ws, { t: "res", rid, err: "That username is taken" });
    if (Object.values(db.users).some(x => x.email === email)) return send(ws, { t: "res", rid, err: "That email already has an account" });
    const salt = crypto.randomBytes(12).toString("hex");
    db.users[u.toLowerCase()] = { u, email, salt, h: hashPw(pw, salt), bal: START_BAL, wag: 0, at: Date.now() };
    const token = crypto.randomBytes(24).toString("hex"); db.tokens[token] = u; save();
    send(ws, { t: "res", rid, ok: 1, token, user: u });
  },
  login(ws, m, rid) {
    const id = String(m.id || "").trim().toLowerCase(), pw = String(m.pw || "");
    const u = db.users[id] || Object.values(db.users).find(x => x.email === id);
    if (!u || hashPw(pw, u.salt) !== u.h) return send(ws, { t: "res", rid, err: "Wrong username/email or password" });
    const token = crypto.randomBytes(24).toString("hex"); db.tokens[token] = u.u; save();
    send(ws, { t: "res", rid, ok: 1, token, user: u.u });
  },
  logout(ws, m) { delete db.tokens[m.token]; save(); ws.user = null; },
  chat(ws, m) {
    if (!ws.user) return send(ws, { t: "err", msg: "Log in to chat" });
    const text = String(m.text || "").replace(/\s+/g, " ").trim().slice(0, 120); if (!text) return;
    if (Date.now() - (lastChat.get(ws) || 0) < 700) return; lastChat.set(ws, Date.now());
    const msg = { name: ws.user, text, ts: Date.now() }; chatLog.push(msg); if (chatLog.length > 60) chatLog.shift(); all({ t: "chat", m: msg });
  },
  tip(ws, m, rid) {
    const u = ws.user && userOf(ws.user), to = userOf(m.to), amt = Math.round(+m.amount || 0);
    if (!u) return send(ws, { t: "res", rid, err: "Log in first" });
    if (!to) return send(ws, { t: "res", rid, err: "You can only tip real players" });
    if (to === u) return send(ws, { t: "res", rid, err: "You can't tip yourself" });
    if (amt < 10) return send(ws, { t: "res", rid, err: "Minimum tip is 0.01" });
    if ((u.wag || 0) < TIP_MIN_WAGER) return send(ws, { t: "res", rid, err: "Wager more before tipping" });
    if (u.tipDay !== today()) { u.tipDay = today(); u.tipped = 0; }
    if (u.tipped + amt > TIP_DAY_LIMIT) return send(ws, { t: "res", rid, err: "That's over your daily tip limit" });
    if (amt > u.bal) return send(ws, { t: "res", rid, err: "You don't have that much" });
    u.bal -= amt; u.tipped += amt; to.bal += amt; save();
    pushMe(u); pushMe(to, amt); send(ws, { t: "res", rid, ok: 1 });
    sysChat(`${u.u} tipped @${to.u} ${(amt / 1000).toFixed(2)}`);
  },
  create(ws, m, rid) {
    const u = ws.user && userOf(ws.user); if (!u) return send(ws, { t: "res", rid, err: "Log in to create a battle" });
    const t = FORMATS.includes(m.size) ? m.size : "1v1", cs = (Array.isArray(m.cs) ? m.cs : []).map(Number).filter(k => k >= 0 && k < POOLS.length).slice(0, 25);
    if (!cs.length) return send(ws, { t: "res", rid, err: "Add at least one case" });
    const mods = (Array.isArray(m.mods) ? m.mods : []).filter(x => ["jackpot", "underdog", "terminal", "fast", "funded"].includes(x));
    const borrow = mods.includes("funded") ? Math.min(.9, Math.max(.1, Math.round((+m.borrow || .5) * 20) / 20)) : 0;
    const value = cs.reduce((a, k) => a + PRICE[k], 0), cost = Math.round(value * (1 - borrow));
    if (cost > u.bal) return send(ws, { t: "res", rid, err: "Not enough balance" });
    u.bal -= cost; u.wag = (u.wag || 0) + cost; save(); pushMe(u);
    const b = { id: nextId++, t, cs, mods, borrow, shared: !!m.shared && grp(t).every(n => n === 1), value, cost, players: Array(seats(t)).fill(null), owner: u.u, state: "waiting", born: Date.now(), bon: {} };
    b.players[Math.min(Math.max(0, +m.seat || 0), b.players.length - 1)] = u.u; battles.set(b.id, b);
    if (m.bots) { b.players = b.players.map(p => p || pick(BOTS.filter(n => !b.players.includes(n)))); startBattle(b); } else upd(b);
    send(ws, { t: "res", rid, ok: 1, id: b.id });   // after the battle itself, so the creator can open it straight away
  },
  join(ws, m, rid) {
    const u = ws.user && userOf(ws.user), b = battles.get(+m.id), seat = +m.seat;
    if (!u) return send(ws, { t: "res", rid, err: "Log in to join battles" });
    if (!b || b.state !== "waiting") return send(ws, { t: "res", rid, err: "That battle already started" });
    if (b.players.includes(u.u)) return send(ws, { t: "res", rid, err: "You're already in this battle" });
    if (!(seat >= 0 && seat < b.players.length) || b.players[seat]) return send(ws, { t: "res", rid, err: "That seat is taken" });
    if (b.cost > u.bal) return send(ws, { t: "res", rid, err: "Not enough balance" });
    u.bal -= b.cost; u.wag = (u.wag || 0) + b.cost; save(); pushMe(u);
    b.players[seat] = u.u; send(ws, { t: "res", rid, ok: 1 });
    if (!b.players.includes(null)) startBattle(b); else upd(b);
  },
  bot(ws, m) { const b = battles.get(+m.id); if (b && ws.user === b.owner) fillBot(b, +m.seat); },
  bots(ws, m) { const b = battles.get(+m.id); if (!b || ws.user !== b.owner) return; b.players.forEach((p, i) => { if (!p) setTimeout(() => fillBot(b, i), 350 + i * 380); }); },
  rain(ws) { if (!ws.user) return send(ws, { t: "err", msg: "Log in to join the rain" }); rain.joined.add(ws.user); send(ws, { t: "rain", pot: rain.pot, end: rain.end, joined: true }); },
  admin(ws, m, rid) {
    const u = ws.user && userOf(ws.user);
    if (!u || !ADMINS.includes(u.u.toLowerCase())) return send(ws, { t: "res", rid, err: "Not an admin" });
    const target = m.user ? userOf(m.user) : u; if (!target) return send(ws, { t: "res", rid, err: "No player with that name" });
    if (m.a === "set") { target.bal = Math.max(0, Math.round(+m.v || 0)); pushMe(target); }
    if (m.a === "add") { target.bal += Math.round(+m.v || 0); pushMe(target, Math.round(+m.v || 0)); }
    if (m.a === "bonus") u.cheatBonus = !!m.on;
    if (m.a === "win") u.cheatWin = !!m.on;
    if (m.a === "rain") rain.end = Date.now() + 5000;
    if (m.a === "clear") for (const b of battles.values()) if (b.state === "done") { battles.delete(b.id); all({ t: "gone", id: b.id }); }
    save(); send(ws, { t: "res", rid, ok: 1, users: Object.values(db.users).map(x => ({ u: x.u, bal: Math.round(x.bal) })) });
  },
};

// ---------------------------------------------------------------- http + websocket
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".mp4": "video/mp4", ".webm": "video/webm", ".gif": "image/gif", ".ico": "image/x-icon", ".json": "application/json" };
const BLOCK = /^\/(data|node_modules|\.|server\.js|package|old\/|_render)/i;
const server = http.createServer((req, res) => {
  if (!gateOk(req)) { res.writeHead(401, { "www-authenticate": 'Basic realm="LootRush (password needed)"', "content-type": "text/plain" }); return res.end("LootRush is in password mode."); }
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/net-config.js") { res.writeHead(200, { "content-type": "text/javascript", "cache-control": "no-store" }); return res.end("window.LR_SERVER = true;"); }
  if (p === "/") p = "/index.html";
  const f = path.normalize(path.join(ROOT, p)), ext = path.extname(f).toLowerCase();
  if (!f.startsWith(ROOT) || BLOCK.test(p) || !TYPES[ext]) { res.writeHead(404); return res.end("Not found"); }
  fs.stat(f, (e, st) => {
    if (e || !st.isFile()) { res.writeHead(404); return res.end("Not found"); }
    res.writeHead(200, { "content-type": TYPES[ext], "content-length": st.size, "cache-control": ext === ".html" || ext === ".js" || ext === ".css" ? "no-cache" : "public, max-age=86400" });
    fs.createReadStream(f).pipe(res);
  });
});
const wss = new WebSocketServer({ server, path: "/ws", maxPayload: 16 * 1024, verifyClient: (info) => gateOk(info.req) });
wss.on("connection", (ws) => {
  clients.add(ws); all({ t: "online", n: clients.size });
  ws.on("message", (raw) => { let m; try { m = JSON.parse(raw); } catch (e) { return; } const h = handlers[m.t]; if (h) try { h(ws, m, m.rid); } catch (e) { console.error(e); } });
  ws.on("close", () => { clients.delete(ws); all({ t: "online", n: clients.size }); });
});
setInterval(() => { for (const c of clients) { if (c.isAlive === false) { c.terminate(); continue; } c.isAlive = false; try { c.ping(); } catch (e) {} } }, 30000);
wss.on("connection", (ws) => { ws.isAlive = true; ws.on("pong", () => ws.isAlive = true); });
server.listen(PORT, () => console.log("LootRush running on http://localhost:" + PORT + (ADMINS.length ? "  admins: " + ADMINS.join(", ") : "")));
