// LootRush blackjack rules, shared by the site (offline) and server.js (online).
// 6-deck shoe shuffled every hand, dealer stands on all 17s, blackjack pays 3:2, double on any two cards.
(function (root) {
  const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"], SUITS = ["s", "h", "d", "c"];
  function shoe(rand) { const d = []; for (let k = 0; k < 6; k++) for (const r of RANKS) for (const s of SUITS) d.push(r + s);
    for (let i = d.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [d[i], d[j]] = [d[j], d[i]]; } return d; }
  const rank = (c) => c.slice(0, -1);
  function total(cards) { let t = 0, aces = 0; for (const c of cards) { const r = rank(c); if (r === "A") { aces++; t += 11; } else t += r.length === 2 || "JQK".includes(r) ? 10 : +r; }
    while (t > 21 && aces) { t -= 10; aces--; } return { t, soft: aces > 0 }; }
  const isBJ = (cards) => cards.length === 2 && total(cards).t === 21;
  function start(bet, rand = Math.random) {
    const d = shoe(rand), g = { bet, deck: d, player: [d.pop()], dealer: [d.pop()], done: false, doubled: false };
    g.player.push(d.pop()); g.dealer.push(d.pop());
    if (isBJ(g.player) || isBJ(g.dealer)) settle(g); return g;
  }
  function settle(g) {
    const p = total(g.player).t;
    if (p <= 21 && !isBJ(g.player)) while (total(g.dealer).t < 17) g.dealer.push(g.deck.pop());
    const d = total(g.dealer).t, pb = isBJ(g.player), db = isBJ(g.dealer);
    let res, pay;
    if (p > 21) { res = "bust"; pay = 0; }
    else if (pb && db) { res = "push"; pay = g.bet; }
    else if (pb) { res = "blackjack"; pay = g.bet * 2.5; }
    else if (db) { res = "lose"; pay = 0; }
    else if (d > 21 || p > d) { res = "win"; pay = g.bet * 2; }
    else if (p === d) { res = "push"; pay = g.bet; }
    else { res = "lose"; pay = 0; }
    g.done = true; g.result = res; g.payout = Math.round(pay); return g;
  }
  // returns { err } or { g, extra } where extra = extra stake taken (double)
  function act(g, a) {
    if (!g || g.done) return { err: "No hand in play" };
    if (a === "hit") { g.player.push(g.deck.pop()); if (total(g.player).t >= 21) settle(g); return { g, extra: 0 }; }
    if (a === "stand") { settle(g); return { g, extra: 0 }; }
    if (a === "double") { if (g.player.length !== 2) return { err: "You can only double on your first two cards" };
      const extra = g.bet; g.bet *= 2; g.doubled = true; g.player.push(g.deck.pop()); settle(g); return { g, extra }; }
    return { err: "Unknown move" };
  }
  // what a player may see: the dealer's second card stays hidden until the hand ends
  const view = (g) => g && { bet: g.bet, player: g.player, dealer: g.done ? g.dealer : [g.dealer[0], null], done: g.done, result: g.result, payout: g.payout, doubled: g.doubled,
    pt: total(g.player), dt: g.done ? total(g.dealer) : total([g.dealer[0]]) };
  const BJ = { start, act, view, total, isBJ };
  if (typeof module !== "undefined" && module.exports) module.exports = BJ; else root.LR_BJ = BJ;
})(this);
