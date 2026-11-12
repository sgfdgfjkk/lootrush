// LootRush demo login. Accounts are saved only in this browser (no server yet), passwords are stored hashed.
(() => {
  const LS = { get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } }, set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  let session = LS.get("lr2_session", null); try { session = session || JSON.parse(sessionStorage.getItem("lr2_session")); } catch (e) {}
  window.LR_USER = session && session.u && (!window.LR_SERVER || session.token) ? session.u : null;

  const hash = async (s) => {
    try { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("lootrush:" + s)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join(""); }
    catch (e) { let h = 0; for (const c of "lootrush:" + s) h = (h * 31 + c.charCodeAt(0)) | 0; return "x" + h; }
  };
  const ICON = {
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    discord: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.5 5.3A17 17 0 0 0 15.3 4l-.5 1a15.6 15.6 0 0 0-5.6 0l-.5-1a17 17 0 0 0-4.2 1.3C1.8 9.3 1.1 13.2 1.4 17a17 17 0 0 0 5.2 2.6l1.1-1.8a11 11 0 0 1-1.7-.8l.4-.3a12.2 12.2 0 0 0 11.2 0l.4.3c-.5.3-1.1.6-1.7.8l1.1 1.8a17 17 0 0 0 5.2-2.6c.4-4.4-.7-8.3-3.1-11.7zM8.7 14.7c-1 0-1.9-1-1.9-2.1s.8-2.1 1.9-2.1 1.9 1 1.9 2.1-.8 2.1-1.9 2.1zm6.6 0c-1 0-1.9-1-1.9-2.1s.8-2.1 1.9-2.1 1.9 1 1.9 2.1-.8 2.1-1.9 2.1z"/></svg>',
    google: '<svg viewBox="0 0 24 24"><path fill="#fff" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3z"/><path fill="#fff" opacity=".85" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z"/><path fill="#fff" opacity=".7" d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 0 0 0 9.2z"/><path fill="#fff" opacity=".55" d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.4L6.4 10C7.2 7.7 9.4 5.9 12 5.9z"/></svg>',
    roblox: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.2 2 2 17.8 17.8 22 22 6.2zM10.3 9.2l4.5 1.2-1.2 4.5-4.5-1.2z"/></svg>',
  };

  const m = document.createElement("div"); m.className = "lg-modal"; m.hidden = true;
  m.innerHTML = `<div class="lg">
    <button class="lg-x" title="Close">${ICON.x}</button>
    <div class="lg-brand"><img src="img/logo.png" alt=""><span>LOOT<b>RUSH</b></span></div>
    <div class="lg-in" data-pane="form">
      <div class="lg-tabs"><button class="on" data-t="login">Log In</button><button data-t="register">Register</button><i></i></div>
      <form class="lg-form" novalidate>
        <label class="lg-f reg-only"><span>Username</span><div class="lg-inp">${ICON.user}<input name="user" autocomplete="username" maxlength="20" placeholder="Pick a username"></div></label>
        <label class="lg-f"><span class="lg-l1">Email or username</span><div class="lg-inp">${ICON.mail}<input name="id" autocomplete="username" placeholder="example@email.com or username"></div></label>
        <label class="lg-f"><span>Password</span><div class="lg-inp">${ICON.lock}<input name="pw" type="password" autocomplete="current-password" placeholder="Enter password"><button type="button" class="lg-eye" title="Show password">${ICON.eye}</button></div></label>
        <div class="lg-row"><label class="lg-chk"><input type="checkbox" name="keep" checked><i></i>Keep me logged in</label><a href="#" class="lg-forgot login-only">Forgot password?</a></div>
        <p class="lg-err" aria-live="polite"></p>
        <button class="lg-go" type="submit">Log In</button>
      </form>
      <div class="lg-or"><span>or continue with</span></div>
      <div class="lg-soc"><button data-soc="Discord" class="d">${ICON.discord}Discord</button><button data-soc="Google" class="g">${ICON.google}Google</button><button data-soc="Roblox" class="r">${ICON.roblox}Roblox</button></div>
      <p class="lg-foot">LootRush is a play-money demo. No real money is used or paid out.</p>
    </div>
    <div class="lg-in" data-pane="me" hidden>
      <div class="lg-me"><span class="lg-av"></span><b class="lg-name"></b><small class="lg-since"></small></div>
      <button class="lg-go lg-out" type="button">Log Out</button>
    </div>
  </div>`;
  document.body.appendChild(m);
  const $ = (s) => m.querySelector(s), form = $(".lg-form"), err = $(".lg-err");
  let mode = "login";
  const setMode = (k) => {
    mode = k; m.classList.toggle("reg", k === "register");
    m.querySelectorAll(".lg-tabs button").forEach(b => b.classList.toggle("on", b.dataset.t === k));
    $(".lg-l1").textContent = k === "register" ? "Email" : "Email or username";
    form.id.placeholder = k === "register" ? "example@email.com" : "example@email.com or username";
    form.pw.autocomplete = k === "register" ? "new-password" : "current-password";
    $(".lg-go").textContent = k === "register" ? "Create Account" : "Log In"; err.textContent = "";
  };
  m.querySelector(".lg-tabs").onclick = (e) => { const b = e.target.closest("button"); if (b) setMode(b.dataset.t); };
  $(".lg-eye").onclick = () => { const p = form.pw; p.type = p.type === "password" ? "text" : "password"; $(".lg-eye").classList.toggle("on", p.type === "text"); };
  $(".lg-forgot").onclick = (e) => { e.preventDefault(); err.textContent = window.LR_SERVER ? "Ask the site admin to reset your account." : "Demo accounts live in this browser only, so there's nothing to reset. Make a new one."; };
  m.querySelectorAll("[data-soc]").forEach(b => b.onclick = () => { err.textContent = `${b.dataset.soc} login comes with the online version.`; });
  const close = () => { m.hidden = true; };
  $(".lg-x").onclick = close; m.addEventListener("click", (e) => { if (e.target === m) close(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !m.hidden) close(); });
  const done = (u, keep) => { try { (keep ? localStorage : sessionStorage).setItem("lr2_session", JSON.stringify({ u })); } catch (e) {} location.reload(); };

  const store = (sess, keep) => { try { localStorage.removeItem("lr2_session"); sessionStorage.removeItem("lr2_session"); (keep ? localStorage : sessionStorage).setItem("lr2_session", JSON.stringify(sess)); } catch (e) {} };
  form.onsubmit = async (e) => {
    e.preventDefault(); err.textContent = "";
    if (window.LR_SERVER && window.LR_NET) {   // online: accounts live on the server
      const go = $(".lg-go"); go.disabled = true;
      const r = mode === "register" ? await LR_NET.req("register", { user: form.user.value.trim(), email: form.id.value.trim(), pw: form.pw.value }) : await LR_NET.req("login", { id: form.id.value.trim(), pw: form.pw.value });
      go.disabled = false; if (r.err) return err.textContent = r.err;
      store({ u: r.user, token: r.token }, form.keep.checked); return location.reload();
    }
    const acc = LS.get("lr2_accounts", {}), id = form.id.value.trim(), pw = form.pw.value;
    if (mode === "register") {
      const u = form.user.value.trim();
      if (!/^[A-Za-z0-9_]{3,20}$/.test(u)) return err.textContent = "Username: 3 to 20 letters, numbers or _";
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(id)) return err.textContent = "Enter a valid email";
      if (pw.length < 6) return err.textContent = "Password needs at least 6 characters";
      const key = u.toLowerCase();
      if (acc[key]) return err.textContent = "That username is taken";
      if (Object.values(acc).some(a => a.email === id.toLowerCase())) return err.textContent = "That email already has an account";
      acc[key] = { u, email: id.toLowerCase(), h: await hash(pw), at: Date.now() }; LS.set("lr2_accounts", acc);
      return done(u, form.keep.checked);
    }
    const a = acc[id.toLowerCase()] || Object.values(acc).find(x => x.email === id.toLowerCase());
    if (!a || a.h !== await hash(pw)) return err.textContent = "Wrong username/email or password";
    done(a.u, form.keep.checked);
  };
  $(".lg-out").onclick = () => { if (window.LR_NET && session && session.token) LR_NET.send({ t: "logout", token: session.token }); try { localStorage.removeItem("lr2_session"); sessionStorage.removeItem("lr2_session"); } catch (e) {} location.reload(); };

  window.LR_AUTH = {
    open(tab = "login") {
      const u = window.LR_USER; m.querySelector('[data-pane="form"]').hidden = !!u; m.querySelector('[data-pane="me"]').hidden = !u;
      if (u) { const a = LS.get("lr2_accounts", {})[u.toLowerCase()]; $(".lg-name").textContent = u; $(".lg-av").textContent = u[0].toUpperCase();
        $(".lg-since").textContent = a ? "Member since " + new Date(a.at).toLocaleDateString() : ""; }
      else { setMode(tab); form.reset(); }
      m.hidden = false; setTimeout(() => (u ? $(".lg-out") : (tab === "register" ? form.user : form.id)).focus(), 50);
    },
  };
})();
