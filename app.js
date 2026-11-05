/* Hash router + renderers. Routes: #home, #gate1..#gate5, #habits, #library, #how */
(function () {
  const app = document.getElementById("app");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const stageOf = (id) => STAGES.find((s) => s.id === id);
  const gateByKey = (k) => GATES.find((g) => g.key === k);

  /* Per-viewer progress. Browser storage only; may be unavailable. */
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem("7rs:" + k) || "null"); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem("7rs:" + k, JSON.stringify(v)); } catch (e) {} },
  };
  const gateDone = (g) => { const d = store.get(g.key + ":done") || {}; return g.deliverables.every((_, i) => d[i]); };

  /* ---------- Header ---------- */
  const stepper = document.getElementById("stepper");
  stepper.innerHTML = GATES.map((g, i) => `${i ? '<span class="sep" aria-hidden="true"></span>' : ""}<a href="#${g.key}" aria-label="Gate ${g.num}: ${esc(g.title)}"><span class="n">${g.num}</span><span class="t">${esc(g.title)}</span></a>`).join("");
  const sheet = document.getElementById("sheet"), menuBtn = document.getElementById("menuBtn");
  sheet.innerHTML = GATES.map((g) => `<a href="#${g.key}"><span>${esc(g.title)}</span><span class="n">${g.num}</span></a>`).join("")
    + `<a class="guide" href="#habits"><span>The three habits</span></a><a class="guide" href="#library"><span>Library</span></a><a class="guide" href="#how"><span>How it works</span></a>`;
  menuBtn.addEventListener("click", () => { const open = sheet.hidden; sheet.hidden = !open; menuBtn.setAttribute("aria-expanded", String(open)); });
  sheet.addEventListener("click", () => { sheet.hidden = true; menuBtn.setAttribute("aria-expanded", "false"); });

  /* ---------- Shared bits ---------- */
  const libRow = (id) => { const r = RESOURCES[id]; return r ? `<a class="lib-row" href="${esc(r.url)}" target="_blank" rel="noopener"><span class="ty">${esc(r.type)}<small>${esc(r.source)}</small></span><span class="tt">${esc(r.title)}<small>${esc(r.author)}</small></span><span class="why">${esc(r.why)}</span><span class="arr" aria-hidden="true">↗</span></a>` : ""; };
  const resChips = (ids) => ids && ids.length ? `<span class="chips">${ids.map((id) => { const r = RESOURCES[id]; return r ? `<a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.title)}</a>` : ""; }).join("")}</span>` : "";

  /* The AI briefing, built from the gate's own content so it cannot go stale. */
  function promptFor(g) {
    const st = stageOf(g.stage);
    return [
      `You are helping a student consulting team at Cougar Strategy Group (BYU Marriott School of Business) work through Gate ${g.num} of the 7Rs engagement model.`,
      ``,
      `BEFORE WE START: I will not paste client data into this chat. No documents, financials or interview notes. CSG's client NDAs prohibit it. I will describe things in general terms, and you should not ask me for raw client material.`,
      ``,
      `GATE ${g.num}: ${g.title.toUpperCase()}`,
      `This gate closes Stage ${st.num}, ${st.name}. We have roughly ${g.duration.mba} (MBA) or ${g.duration.emba} (EMBA).`,
      `Objective: ${g.objective}`,
      ``,
      `What this gate settles:`,
      ...g.settles.map((s) => `  - ${s}`),
      ``,
      `What we should have worked out by then:`,
      ...g.deliverables.map((d, i) => `  ${i + 1}. ${d.name} (suggested form: ${d.form})\n     ${d.what}\n     A good one: ${d.good.join(" ")}`),
      ``,
      `Questions we should be able to answer at the review:`,
      ...g.review.map((q) => `  - ${q}`),
      ``,
      `OUR PROJECT: [describe the client and the problem in one or two sentences]`,
      `WHERE WE ARE: [what the team has done so far]`,
      ``,
      `Start by asking me whatever you need to know. Then work through the deliverables with me one at a time, in order. Push back when our thinking is vague, and tell us when an answer would not survive the review questions above.`,
    ].join("\n");
  }

  function wirePrompt(g) {
    const btn = app.querySelector("[data-prompt]"), ta = app.querySelector("#promptFallback");
    if (!btn) return;
    btn.addEventListener("click", async () => {
      const text = promptFor(g);
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = "Prompt copied";
        setTimeout(() => { btn.textContent = "Copy AI prompt"; }, 2200);
      } catch (e) {
        ta.hidden = false; ta.value = text; ta.focus(); ta.select();
        btn.textContent = "Copy it from the box";
      }
    });
  }

  /* ---------- Home ---------- */
  const SEG = [{ id: "recognize", w: 26 }, { id: "research", w: 40 }, { id: "recommend", w: 17 }, { id: "retain", w: 17 }];
  const PIN = { gate1: 24, gate2: 45, gate3: 64, gate4: 81, gate5: 98 };
  const px = (p) => 3 + p * 0.94;
  const geoSvg = () => `<svg class="geo" viewBox="0 0 1400 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g fill="none" stroke="rgba(5,28,44,0.10)" stroke-width="1"><circle cx="1180" cy="110" r="260"/><circle cx="1360" cy="340" r="200"/><circle cx="1180" cy="110" r="120"/><line x1="900" y1="110" x2="1400" y2="110"/><line x1="1180" y1="-160" x2="1180" y2="380"/><line x1="980" y1="520" x2="1400" y2="80"/></g>
      <g fill="rgba(34,81,255,0.9)"><circle cx="1180" cy="110" r="2.5"/><circle cx="1360" cy="340" r="2.5"/></g></svg>`;

  function renderHome() {
    let left = 0;
    const segs = SEG.map((s) => { const st = stageOf(s.id); const h = `<div class="seg" data-stage="${s.id}" style="left:${px(left)}%;width:${s.w * 0.94}%"><span class="label">Stage ${st.num}</span><h3>${esc(st.name)}</h3><p>${esc(st.tagline)}</p><span class="weeks"><i>${esc(st.weeks)}</i><span>${st.gates.length === 1 ? "1 gate" : "2 gates"}</span></span></div>`; left += s.w; return h; }).join("");
    const pins = GATES.map((g) => `<button class="gate-pin ${gateDone(g) ? "is-done" : ""}" data-key="${g.key}" data-title="${esc(g.title)}" style="left:${px(PIN[g.key])}%" aria-label="Gate ${g.num}: ${esc(g.title)}"><span class="tick" aria-hidden="true"></span>${g.num}</button>`).join("");
    const mobile = STAGES.map((st) => `<div class="stg"><h3>${esc(st.name)}</h3><span>${esc(st.weeks)}</span></div>${st.gates.map((n) => { const g = GATES[n - 1]; return `<a href="#${g.key}"><span class="n">${g.num}</span><span><b>${esc(g.title)}</b><small>${g.deliverables.length} things to have · ${esc(g.duration.mba)}</small></span><span class="arr">→</span></a>`; }).join("")}`).join("");
    const tile = (r) => `<a class="r" href="#${r.go}"><span class="w"><em>R</em>${esc(r.word.slice(1))}</span><span class="g">${esc(r.gloss)}</span></a>`;
    app.innerHTML = `
      <section class="home-hero"><div class="glow"></div>${geoSvg()}
        <div class="wrap">
          <span class="label"><b>Cougar Strategy Group</b> &nbsp;·&nbsp; Engagement operating model</span>
          <h1>Four stages.<br>Five gates.<br><em>One answer the client acts on.</em></h1>
        </div>
      </section>

      <section class="seven-wrap" aria-label="What the seven R's are">
        <div class="wrap">
          <div class="seven-head"><h2>What the seven R's are</h2><p>${esc(SEVEN.lead)}</p></div>
          <div class="seven">
            <div class="seven-group"><div class="label">Four stages · in order</div><div class="seven-row four">${SEVEN.stages.map(tile).join("")}</div></div>
            <div class="seven-group"><div class="label">Three habits · all the way through</div><div class="seven-row three">${SEVEN.habits.map(tile).join("")}</div></div>
          </div>
        </div>
      </section>

      <section class="journey-wrap" aria-label="The engagement arc"><div class="wrap">
        <div class="journey-key"><h2>Select a gate</h2><p>Each gate shows what you should have and what the review covers. <a href="#how">See the whole process →</a></p></div>
        <div class="journey rise" id="journey" tabindex="0" role="group" aria-label="Stages and gates. Arrow keys move between gates, Enter opens one.">${segs}<div class="rail" aria-hidden="true"><i id="railFill"></i></div>${pins}</div>
        <div class="preview" id="preview" aria-live="polite"></div>
        <div class="journey-m">${mobile}</div>
      </div></section>

      <section class="strip"><div class="wrap">
        <div class="item"><div class="big">20<em>′</em></div><h3>Gate review</h3><p>A working session with your faculty advisor. The questions are published on every gate. <a href="#how">How it works →</a></p></div>
        <div class="item"><div class="big"><em>You</em></div><h3>Choose the method</h3><p>The exercises are a menu, tagged by the kind of project you are running.</p></div>
        <div class="item"><div class="big">1</div><h3>Result</h3><p>A recommendation the client understands, owns and acts on. Everything here points at that.</p></div>
      </div></section>`;

    let sel = store.get("home:sel") || "gate1";
    const journey = document.getElementById("journey"), preview = document.getElementById("preview"), fill = document.getElementById("railFill");
    function select(key) {
      const g = gateByKey(key); if (!g) return; sel = key; store.set("home:sel", key);
      journey.querySelectorAll(".gate-pin").forEach((p) => p.classList.toggle("is-on", p.dataset.key === key));
      journey.querySelectorAll(".seg").forEach((s) => s.classList.toggle("is-on", s.dataset.stage === g.stage));
      fill.style.width = px(PIN[key]) + "%";
      const st = stageOf(g.stage);
      preview.innerHTML = `
        <div><div class="k"><span class="num">${g.num}</span><span class="st"><span>Gate ${g.num} ${g.num === 2 ? "is the midpoint of" : "closes"} <b>Stage ${st.num} · ${esc(st.name)}</b></span><span>MBA ${esc(g.duration.mba)} · EMBA ${esc(g.duration.emba)}</span></span></div>
          <h2>${esc(g.title)}</h2><p class="obj">${esc(g.objective)}</p></div>
        <ul class="dl"><li class="t">What you should have</li>${g.deliverables.map((d, i) => `<li><i>${i + 1}</i><div>${esc(d.name)}<span>${esc(d.form)}</span></div></li>`).join("")}</ul>
        <a class="btn cta" href="#${g.key}">Open Gate ${g.num} <span class="arr">→</span></a>`;
    }
    journey.addEventListener("pointerover", (e) => { const p = e.target.closest(".gate-pin"); if (p) select(p.dataset.key); });
    journey.addEventListener("click", (e) => { const p = e.target.closest(".gate-pin"); if (p) { location.hash = "#" + p.dataset.key; return; } const s = e.target.closest(".seg"); if (s) select(GATES[stageOf(s.dataset.stage).gates[0] - 1].key); });
    journey.addEventListener("keydown", (e) => { const i = GATES.findIndex((g) => g.key === sel); if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); select(GATES[Math.min(i + 1, 4)].key); } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); select(GATES[Math.max(i - 1, 0)].key); } else if (e.key === "Enter") location.hash = "#" + sel; });
    select(sel);
  }

  /* ---------- Gate ---------- */
  function renderGate(g) {
    const st = stageOf(g.stage);
    const done = store.get(g.key + ":done") || {};
    const prev = GATES[g.num - 2], next = GATES[g.num];
    const fits = [...new Set(g.exercises.map((e) => e.fit))];
    app.innerHTML = `
      <div class="wrap gate">
        <header class="g-head rise">
          <span class="label"><b>Gate ${g.num} of 5</b> &nbsp;·&nbsp; Stage ${st.num} ${esc(st.name)} &nbsp;·&nbsp; MBA ${esc(g.duration.mba)} &nbsp;·&nbsp; EMBA ${esc(g.duration.emba)}</span>
          <h1>${esc(g.title)}</h1>
          <p class="obj">${esc(g.objective)}</p>
        </header>

        <section class="g-intro">
          <p class="lead">${esc(g.lead)}</p>
          <div class="settles">
            <div class="label">What this gate settles</div>
            <ul>${g.settles.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
          </div>
        </section>

        <div class="g-grid">
          <section class="bring">
            <h2>What you should have</h2>
            <p class="bring-note">Things to have worked out by the review. The formats are suggestions, not rules. Tick them off as you go; progress stays in this browser.</p>
            <ol class="dl">${g.deliverables.map((d, i) => `
              <li class="${done[i] ? "is-done" : ""}" data-i="${i}">
                <label class="check"><input type="checkbox" id="${g.key}-d${i}" ${done[i] ? "checked" : ""} aria-label="Mark ${esc(d.name)} complete"><span></span></label>
                <div class="body">
                  <div class="nm"><b>${esc(d.name)}</b><span>${esc(d.form)}</span></div>
                  <p>${esc(d.what)}</p>
                  <details><summary>What good looks like</summary><ul>${d.good.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></details>
                  <div class="example">${d.example ? `<a href="${esc(d.example.url)}" target="_blank" rel="noopener">See a passing example · ${esc(d.example.title)} ↗</a>` : `<span class="todo">Example: a redacted past submission will be linked here.</span>`}</div>
                </div>
              </li>`).join("")}</ol>
            <p class="note"><span>Talked through with your faculty advisor in 20–30 minutes. <a href="#how">How it works →</a></span>
              <button class="ghost" data-prompt title="Copies a briefing for ChatGPT or Claude. Never paste client data.">Copy AI prompt</button>
              <button class="reset" data-reset>Reset ticks</button></p>
            <textarea id="promptFallback" hidden rows="6" aria-label="AI prompt text, select and copy"></textarea>
          </section>

          <aside class="asks">
            <h2>Can you answer these?</h2>
            <p class="asks-note">Your advisor may ask these, or others. If the team can answer them without digging, you are ready.</p>
            <ul>${g.review.map((q) => `<li>${esc(q)}</li>`).join("")}</ul>
          </aside>
        </div>

        <section class="moves">
          <div class="moves-head"><h2>Exercises that help</h2><p>None of these are required. Pick what gets your kind of project to strong deliverables.</p></div>
          <div class="filter" role="group" aria-label="Filter exercises by project type">
            <button aria-pressed="true" data-fit="*">All</button>
            ${fits.filter((f) => f !== "Every project").map((f) => `<button aria-pressed="false" data-fit="${esc(f)}">${esc(f)}</button>`).join("")}
          </div>
          <ul class="move-list">${g.exercises.map((e) => `<li class="move" data-fit="${esc(e.fit)}"><b>${esc(e.h)}</b><p>${esc(e.p)}</p>${e.res ? resChips(e.res) : ""}${e.fit !== "Every project" ? `<span class="fit">${esc(e.fit)}</span>` : ""}</li>`).join("")}</ul>
        </section>

        <section class="learn">
          <div class="moves-head"><h2>Learn the tools</h2><p>The few that matter most here. <a href="#library">Full library →</a></p></div>
          <div class="lib">${g.learn.map(libRow).join("")}</div>
        </section>

        <nav class="pager" aria-label="Gate navigation">
          ${prev ? `<a href="#${prev.key}"><small>← Gate ${prev.num}</small><span class="t">${esc(prev.title)}</span></a>` : `<a href="#home"><small>← Home</small><span class="t">The model</span></a>`}
          ${next ? `<a href="#${next.key}"><small>Gate ${next.num} →</small><span class="t">${esc(next.title)}</span></a>` : `<a href="#how"><small>Finish →</small><span class="t">How it works</span></a>`}
        </nav>
      </div>`;

    app.querySelectorAll(".dl input[type=checkbox]").forEach((cb) => cb.addEventListener("change", () => { const li = cb.closest("li"); const d = store.get(g.key + ":done") || {}; d[li.dataset.i] = cb.checked; store.set(g.key + ":done", d); li.classList.toggle("is-done", cb.checked); }));
    app.querySelector("[data-reset]").addEventListener("click", () => { store.set(g.key + ":done", {}); app.querySelectorAll(".dl > li").forEach((li) => { li.classList.remove("is-done"); li.querySelector("input").checked = false; }); });
    app.querySelectorAll(".filter button").forEach((b) => b.addEventListener("click", () => {
      app.querySelectorAll(".filter button").forEach((x) => x.setAttribute("aria-pressed", "false")); b.setAttribute("aria-pressed", "true");
      const f = b.dataset.fit;
      app.querySelectorAll(".move").forEach((m) => { m.hidden = !(f === "*" || m.dataset.fit === f || m.dataset.fit === "Every project"); });
    }));
    wirePrompt(g);
  }

  /* ---------- Habits ---------- */
  function renderHabits() {
    app.innerHTML = `<div class="wrap guide">
      <span class="label rise"><b>The three habits</b> &nbsp;·&nbsp; Looked for at every gate</span>
      <h1 class="rise">Roles, Relationship, Refine</h1>
      <p class="lede rise">Three of the seven R's are not stages. They run through all four, and a reviewer looks for evidence of each one at every gate.</p>
      ${HABITS.map((h) => `<section class="habit" id="${h.key}">
        <h2><em>R</em>${esc(h.name.slice(1))} <small>${esc(h.full)}</small></h2>
        <p class="lede">${esc(h.lead)}</p>
        ${h.roles ? `<ul class="pairs">${h.roles.map(([r, d]) => `<li><b>${esc(r)}</b><span>${esc(d)}</span></li>`).join("")}</ul>` : ""}
        ${h.habits ? `<ul class="plain">${h.habits.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
        <ul class="pairs bygate"><li class="t">What a reviewer looks for</li>${h.byGate.map((x, i) => `<li><b><a href="#gate${i + 1}">Gate ${i + 1}</a></b><span>${esc(x)}</span></li>`).join("")}</ul>
        <p class="learn-chips">${resChips(h.learn)}</p>
      </section>`).join("")}
      <nav class="pager" aria-label="Navigation"><a href="#home"><small>← Home</small><span class="t">The model</span></a><a href="#how"><small>Guide →</small><span class="t">How it works</span></a></nav>
    </div>`;
  }

  /* ---------- How it works ---------- */
  function renderProcess() {
    const col = (t, items) => `<div class="rv-col"><h3>${t}</h3><ul>${items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>`;
    const overview = STAGES.map((st) => `
      <div class="ov-stage">
        <div class="ov-h"><span class="label">Stage ${st.num} · ${esc(st.weeks)}</span><h3>${esc(st.name)}</h3><p>${esc(st.tagline)}</p></div>
        <div class="ov-gates">${st.gates.map((n) => { const g = GATES[n - 1]; return `<a href="#${g.key}"><span class="n">${g.num}</span><span class="b"><b>${esc(g.title)}</b><small>${esc(g.objective)}</small><em>${g.deliverables.map((d) => d.name).join(" · ")}</em></span><span class="arr">→</span></a>`; }).join("")}</div>
      </div>`).join("");
    app.innerHTML = `<div class="wrap guide">
      <span class="label rise"><b>Guide</b> &nbsp;·&nbsp; Start here with a question</span>
      <h1 class="rise">${esc(PROCESS.title)}</h1>
      <p class="lede rise">${esc(PROCESS.lead)}</p>

      <section><h2>The whole process, start to finish</h2>
        <div class="overview">${overview}</div>
        <p class="ov-foot">Roughly 12 to 15 weeks end to end. Stage 1 is the one that cannot slip; everything after it moves when the problem is not defined.</p>
      </section>

      <section><h2>What a gate is</h2><ul class="plain">${PROCESS.whatIsGate.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></section>

      <section><h2>What happens at a review</h2><div class="rv">${Object.entries(PROCESS.review).map(([t, items]) => col(t, items)).join("")}</div></section>

      <section><h2>Five rules of thumb</h2><ul class="pairs rules">${PROCESS.rules.map(([h, p]) => `<li><b>${esc(h)}</b><span>${esc(p)}</span></li>`).join("")}</ul></section>

      <section><h2>How the values show up</h2>
        <p class="lede sm">${esc(PROCESS.values.lead)}</p>
        <ul class="pairs values">${PROCESS.values.rows.map(([v, b, p]) => `<li><b>${esc(v)}<small>${esc(b)}</small></b><span>${esc(p)}</span></li>`).join("")}</ul>
      </section>

      <section><h2>Questions teams ask</h2><ul class="pairs faq">${PROCESS.faq.map(([q, a]) => `<li><b>${esc(q)}</b><span>${esc(a)}</span></li>`).join("")}</ul></section>

      <details class="fold"><summary>What changed from the July 2026 documents</summary><ul class="plain">${PROCESS.changed.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></details>

      <nav class="pager" aria-label="Navigation"><a href="#home"><small>← Home</small><span class="t">The model</span></a><a href="#gate1"><small>Start →</small><span class="t">Gate 1 · Define the problem</span></a></nav>
    </div>`;
  }

  /* ---------- Library ---------- */
  function renderLibrary() {
    app.innerHTML = `<div class="wrap guide">
      <span class="label rise"><b>Library</b> &nbsp;·&nbsp; ${Object.keys(RESOURCES).length} vetted sources</span>
      <h1 class="rise">Where to learn the tools</h1>
      <p class="lede rise">Grouped by what you are trying to do rather than by gate, because the same source often helps at three of them. Each opens in a new tab.</p>
      ${TOPICS.map(([id, name]) => { const ids = Object.keys(RESOURCES).filter((k) => RESOURCES[k].topic === id); return ids.length ? `<section><h2>${esc(name)}</h2><div class="lib">${ids.map(libRow).join("")}</div></section>` : ""; }).join("")}
      <section class="ai"><h2>${esc(AI_INTRO.title)}</h2>
        <p class="lede sm">${esc(AI_INTRO.lead)}</p>
        <p class="warn"><b>One hard rule.</b> ${esc(AI_INTRO.rule)}</p>
      </section>
      <nav class="pager" aria-label="Navigation"><a href="#home"><small>← Home</small><span class="t">The model</span></a><a href="#how"><small>Guide →</small><span class="t">How it works</span></a></nav>
    </div>`;
  }

  /* ---------- Router ---------- */
  function route() {
    const h = (location.hash || "#home").slice(1).replace(/[^a-z0-9]/gi, "");
    const g = gateByKey(h);
    if (g) renderGate(g);
    else if (h === "habits") renderHabits();
    else if (h === "library") renderLibrary();
    else if (h === "how") renderProcess();
    else renderHome();
    const cur = (g || ["habits", "library", "how"].includes(h)) ? h : "home";
    document.querySelectorAll(".stepper a, .links a").forEach((a) => { if (a.getAttribute("href") === "#" + cur) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    sheet.hidden = true; menuBtn.setAttribute("aria-expanded", "false");
    window.scrollTo(0, 0);
    document.title = (g ? `Gate ${g.num} · ${g.title}` : h === "habits" ? "The three habits" : h === "library" ? "Library" : h === "how" ? PROCESS.title : "The 7Rs") + " · CSG";
  }
  document.addEventListener("keydown", (e) => {
    if (e.target.closest("input, textarea, [contenteditable], #journey") || e.metaKey || e.ctrlKey || e.altKey) return;
    const g = gateByKey((location.hash || "").slice(1)); if (!g) return;
    if (e.key === "ArrowRight" && GATES[g.num]) location.hash = "#" + GATES[g.num].key;
    if (e.key === "ArrowLeft" && GATES[g.num - 2]) location.hash = "#" + GATES[g.num - 2].key;
  });
  window.addEventListener("hashchange", route);
  route();
})();
