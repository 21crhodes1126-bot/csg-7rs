/* Hash router + renderers. Routes: #home, #gate1..#gate5, #roles, #client, #story, #how */
(function () {
  const app = document.getElementById("app");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const pad = (n) => String(n);
  const stageOf = (id) => STAGES.find((s) => s.id === id);
  const gateByKey = (k) => GATES.find((g) => g.key === k);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Per-viewer progress. Browser storage only; may be unavailable. */
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem("7rs:" + k) || "null"); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem("7rs:" + k, JSON.stringify(v)); } catch (e) {} },
  };
  const gateDone = (g) => { const d = store.get(g.key + ":done") || {}; return g.deliverables.every((_, i) => d[i]); };

  /* ---------- Header stepper + mobile sheet ---------- */
  const stepper = document.getElementById("stepper");
  stepper.innerHTML = GATES.map((g, i) => `${i ? '<span class="sep" aria-hidden="true"></span>' : ""}<a href="#${g.key}" aria-label="Gate ${g.num}: ${esc(g.title)}"><span class="n">${g.num}</span><span class="t">${esc(g.title)}</span></a>`).join("");
  const sheet = document.getElementById("sheet"), menuBtn = document.getElementById("menuBtn");
  sheet.innerHTML = GATES.map((g) => `<a href="#${g.key}"><span>${esc(g.title)}</span><span class="n">${g.num}</span></a>`).join("")
    + SPANS.map((s) => `<a class="guide" href="#${s.key}"><span>${esc(s.name)}</span></a>`).join("")
    + `<a class="guide" href="#how"><span>How a gate works</span></a>`;
  menuBtn.addEventListener("click", () => { const open = sheet.hidden; sheet.hidden = !open; menuBtn.setAttribute("aria-expanded", String(open)); });
  sheet.addEventListener("click", () => { sheet.hidden = true; menuBtn.setAttribute("aria-expanded", "false"); });

  /* ---------- Resource renderers ---------- */
  function libRow(id) {
    const r = RESOURCES[id]; if (!r) return "";
    return `<a href="${esc(r.url)}" target="_blank" rel="noopener">
      <div class="ty">${esc(r.type)}<small>${esc(r.source)}</small></div>
      <div><h3>${esc(r.title)}</h3><div class="au">${esc(r.author)}</div></div>
      <p class="why">${esc(r.why)}</p>
      <span class="arr" aria-hidden="true">↗</span></a>`;
  }
  const resChip = (id) => { const r = RESOURCES[id]; return r ? `<a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.type)} · ${esc(r.title)}</a>` : ""; };

  /* ---------- The seven R's ---------- */
  function sevenBlock(compact) {
    const tile = (r) => `<a class="r" href="#${r.go}"><span class="w"><em>R</em>${esc(r.word.slice(1))}</span><span class="g">${esc(r.gloss)}</span></a>`;
    return `<div class="seven ${compact ? "compact" : ""}">
      <div class="seven-group"><div class="label">Four stages · in order</div><div class="seven-row four">${SEVEN.stages.map(tile).join("")}</div></div>
      <div class="seven-group"><div class="label">Three habits · all the way through</div><div class="seven-row three">${SEVEN.habits.map(tile).join("")}</div></div>
    </div>`;
  }

  /* ---------- Home ---------- */
  // stage widths roughly proportional to weeks; gate pins sit at the end of their slice
  const SEG = [{ id: "recognize", w: 26 }, { id: "research", w: 40 }, { id: "recommend", w: 17 }, { id: "retain", w: 17 }];
  const PIN = { gate1: 24, gate2: 45, gate3: 64, gate4: 81, gate5: 98 };
  const px = (p) => 3 + p * 0.94; // keep pins inside the frame

  function geoSvg() {
    // McKinsey-style fine-line geometry: a few large circles and chords, very faint
    return `<svg class="geo" viewBox="0 0 1400 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g fill="none" stroke="rgba(5,28,44,0.10)" stroke-width="1">
        <circle cx="1180" cy="110" r="260"/><circle cx="1360" cy="340" r="200"/><circle cx="1180" cy="110" r="120"/>
        <line x1="900" y1="110" x2="1400" y2="110"/><line x1="1180" y1="-160" x2="1180" y2="380"/>
        <line x1="980" y1="520" x2="1400" y2="80"/>
      </g>
      <g fill="rgba(34,81,255,0.9)"><circle cx="1180" cy="110" r="2.5"/><circle cx="1360" cy="340" r="2.5"/></g>
    </svg>`;
  }

  function renderHome() {
    let left = 0;
    const segs = SEG.map((s) => { const st = stageOf(s.id); const html = `
      <div class="seg" data-stage="${s.id}" style="left:${px(left)}%;width:${s.w * 0.94}%">
        <span class="label">Stage ${st.num}</span>
        <h3>${esc(st.name)}</h3><p>${esc(st.tagline)}</p>
        <span class="weeks"><i>${esc(st.weeks)}</i><span>${st.gates.length === 1 ? "1 gate" : "2 gates"}</span></span>
      </div>`; left += s.w; return html; }).join("");
    const pins = GATES.map((g) => `<button class="gate-pin ${gateDone(g) ? "is-done" : ""}" data-key="${g.key}" data-title="${esc(g.title)}" style="left:${px(PIN[g.key])}%" aria-label="Gate ${g.num}: ${esc(g.title)}"><span class="tick" aria-hidden="true"></span>${g.num}</button>`).join("");
    const mobile = STAGES.map((st) => `
      <div class="stg"><h3>${esc(st.name)}</h3><span>${esc(st.weeks)}</span></div>
      ${st.gates.map((n) => { const g = GATES[n - 1]; return `<a href="#${g.key}"><span class="n">${g.num}</span><span><b>${esc(g.title)}</b><small>${g.deliverables.length} deliverables · ${esc(g.duration.mba)}</small></span><span class="arr">→</span></a>`; }).join("")}`).join("");
    const spanR = ["Roles", "Relationship", "Refine"];
    app.innerHTML = `
      <section class="home-hero">
        <div class="glow"></div>${geoSvg()}
        <div class="wrap">
          <div class="rise">
            <span class="label"><b>Cougar Strategy Group</b> &nbsp;·&nbsp; Engagement operating model</span>
            <h1>Four stages.<br>Five gates.<br><em>One answer the client acts on.</em></h1>
          </div>
          <div class="rise d2">
            <p class="lede">Every CSG engagement runs the same arc, from a sharp problem statement to a recommendation the client puts to work. Each gate asks for <strong>two or three documents</strong> and a short review. How you get there is up to you.</p>
          </div>
        </div>
      </section>

      <section class="seven-wrap" aria-label="What the seven R's are">
        <div class="wrap">
          <div class="seven-head"><h2>What the seven R's are</h2><p>${esc(SEVEN.lead)}</p></div>
          ${sevenBlock(false)}
        </div>
      </section>

      <section class="journey-wrap" aria-label="The engagement arc">
        <div class="wrap">
          <div class="journey-key rise d3">
            <h2>One engagement, left to right</h2>
            <p>Select a gate to preview what it asks for. <b>Research</b> has two gates: one for the plan, one for the findings.</p>
          </div>
          <div class="journey rise d3" id="journey" tabindex="0" role="group" aria-label="Stages and gates. Use arrow keys to move between gates and Enter to open one.">
            ${segs}
            <div class="rail" aria-hidden="true"><i id="railFill"></i></div>
            ${pins}
          </div>
          <div class="preview rise d4" id="preview" aria-live="polite"></div>
          <div class="journey-m">${mobile}</div>
        </div>
      </section>

      <section class="strip">
        <div class="wrap">
          <div class="item"><div class="big">2<em>–</em>3</div><h3>Documents per gate</h3><p>The few things a reviewer needs to judge whether the work holds. Not a checklist.</p></div>
          <div class="item"><div class="big">20<em>′</em></div><h3>Gate review</h3><p>A short working session with your faculty advisor. The questions are published on every gate. <a href="#how">How a gate works →</a></p></div>
          <div class="item"><div class="big"><em>1</em></div><h3>Result</h3><p>A recommendation the client understands, owns and acts on. Everything on this site points at that.</p></div>
        </div>
      </section>`;

    /* interaction: hover/focus selects, click opens, arrows move */
    let sel = store.get("home:sel") || "gate1";
    const journey = document.getElementById("journey"), preview = document.getElementById("preview"), fill = document.getElementById("railFill");
    function select(key, { scrollPreview = false } = {}) {
      const g = gateByKey(key); if (!g) return; sel = key; store.set("home:sel", key);
      journey.querySelectorAll(".gate-pin").forEach((p) => p.classList.toggle("is-on", p.dataset.key === key));
      journey.querySelectorAll(".seg").forEach((s) => s.classList.toggle("is-on", s.dataset.stage === g.stage));
      fill.style.width = px(PIN[key]) + "%";
      const st = stageOf(g.stage);
      preview.innerHTML = `
        <div>
          <div class="k"><span class="num">${g.num}</span><span class="st"><span>Gate ${g.num} ${g.num === 2 ? "is the midpoint of" : "closes"} <b>Stage ${st.num} · ${esc(st.name)}</b></span><span>MBA ${esc(g.duration.mba)} · EMBA ${esc(g.duration.emba)}</span></span></div>
          <h2>${esc(g.title)}</h2>
          <p class="obj">${esc(g.objective)}</p>
        </div>
        <ul class="dl" aria-label="Deliverables"><li class="t" style="display:block;grid-template-columns:1fr">Bring to the gate</li>
          ${g.deliverables.map((d, i) => `<li><i>${i + 1}</i><div>${esc(d.name)}<span>${esc(d.form)}</span></div></li>`).join("")}
        </ul>
        <a class="btn cta" href="#${g.key}">Open Gate ${g.num} <span class="arr">→</span></a>`;
      if (scrollPreview && window.innerWidth > 760) preview.scrollIntoView({ block: "nearest", behavior: reduced ? "auto" : "smooth" });
    }
    journey.addEventListener("pointerover", (e) => { const p = e.target.closest(".gate-pin"); if (p) select(p.dataset.key); });
    journey.addEventListener("click", (e) => {
      const p = e.target.closest(".gate-pin"); if (p) { location.hash = "#" + p.dataset.key; return; }
      const s = e.target.closest(".seg"); if (s) { const st = stageOf(s.dataset.stage); select(GATES[st.gates[0] - 1].key, { scrollPreview: true }); }
    });
    journey.addEventListener("keydown", (e) => {
      const i = GATES.findIndex((g) => g.key === sel);
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); select(GATES[Math.min(i + 1, 4)].key); }
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); select(GATES[Math.max(i - 1, 0)].key); }
      else if (e.key === "Enter") { location.hash = "#" + sel; }
    });
    select(sel);
  }

  /* ---------- Gate ---------- */
  function renderGate(g) {
    const st = stageOf(g.stage);
    const done = store.get(g.key + ":done") || {};
    const prev = GATES[g.num - 2], next = GATES[g.num];
    const fits = [...new Set(g.exercises.map((e) => e.fit))];
    const sections = [
      ["purpose", "Purpose", ""], ["deliverables", "Deliverables", g.deliverables.length], ["approach", "Approach", g.howTo.length],
      ["exercises", "Exercises", g.exercises.length], ["library", "Library", g.resources.length],
    ];
    app.innerHTML = `
      <div class="gate">
        <aside class="gate-side">
          <div class="where rise"><b>Gate ${g.num} of 5</b><span>·</span><span>Stage ${st.num} · ${esc(st.name)}</span></div>
          <div class="titleblock rise d1"><div class="num">${g.num}</div><h1>${esc(g.title)}</h1></div>
          <p class="obj rise d2">${esc(g.objective)}</p>
          <div class="facts rise d3">
            <div><span>Time</span><b>MBA ${esc(g.duration.mba)} · EMBA ${esc(g.duration.emba)}</b></div>
            <div><span>Review</span><b>Faculty advisor, 20–30 min</b></div>
            <div><span>Values</span><div class="chips">${g.values.map((v) => `<span class="chip">${esc(v)}</span>`).join("")}</div></div>
          </div>
          <nav class="secnav rise d4" aria-label="On this page">
            ${sections.map(([id, name, cnt], i) => `<a href="#${g.key}" data-sec="${id}"><i>${i + 1}</i><span>${name}</span><span class="cnt">${cnt}</span></a>`).join("")}
          </nav>
          <div class="side-pager">
            ${prev ? `<a href="#${prev.key}"><span>← Gate ${prev.num}</span><b>${esc(prev.title)}</b></a>` : `<a href="#home"><span>← Home</span><b>The model</b></a>`}
            ${next ? `<a class="next" href="#${next.key}"><span>Gate ${next.num} →</span><b>${esc(next.title)}</b></a>` : `<a class="next" href="#home"><span>Finish →</span><b>Back to the model</b></a>`}
          </div>
        </aside>

        <div class="gate-main">
          <section id="purpose">
            <div class="sec-head"><i>1</i><h2>Purpose of this gate</h2></div>
            <div class="sec-body prose">${g.purpose.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
          </section>

          <section id="deliverables">
            <div class="sec-head"><i>2</i><h2>What you bring to the gate</h2><p>These are required. Each lists what a passing version looks like, and the review questions below them are the ones you will be asked. Tick them off as your team finishes; progress stays in this browser.</p></div>
            <div class="sec-body">
              <div class="ledger">
                ${g.deliverables.map((d, i) => `
                <div class="row ${done[i] ? "is-done" : ""}" data-i="${i}">
                  <div class="n">${i + 1}</div>
                  <div>
                    <h3>${esc(d.name)}</h3>
                    <div class="form">${esc(d.form)}</div>
                    <p class="what">${esc(d.what)}</p>
                    <div class="good"><div class="t">What good looks like</div><ul>${d.good.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
                    <div class="example">${d.example
                      ? `<a href="${esc(d.example.url)}" target="_blank" rel="noopener"><span class="ic" aria-hidden="true"></span>See a passing example · ${esc(d.example.title)} <span class="arr">↗</span></a>`
                      : `<span class="todo"><span class="ic" aria-hidden="true"></span>Passing example: a redacted submission from a past engagement will be linked here.</span>`}</div>
                  </div>
                  <label class="check"><input type="checkbox" id="${g.key}-d${i}" ${done[i] ? "checked" : ""} aria-label="Mark ${esc(d.name)} complete"><span></span></label>
                </div>`).join("")}
              </div>
              <div class="ledger-foot"><span>Reviewed with your faculty advisor in a 20–30 minute gate review.</span><button data-reset>Reset progress</button></div>
              <div class="asks"><div class="t">What the gate review covers</div><ul>${g.conversation.map((q) => `<li>${esc(q)}</li>`).join("")}</ul></div>
            </div>
          </section>

          <section id="approach">
            <div class="sec-head"><i>3</i><h2>How to think about it</h2></div>
            <div class="sec-body steps">${g.howTo.map((h, i) => `<div><span class="i">${i + 1}</span><h3>${esc(h.h)}</h3><p>${esc(h.p)}</p></div>`).join("")}</div>
          </section>

          <section id="exercises">
            <div class="sec-head"><i>4</i><h2>Exercises that help</h2><p>None are required. Pick what gets your kind of project to strong deliverables.</p></div>
            <div class="sec-body">
              <div class="filter" role="group" aria-label="Filter exercises by project type">
                <button aria-pressed="true" data-fit="*">All</button>
                ${fits.map((f) => `<button aria-pressed="false" data-fit="${esc(f)}">${esc(f)}</button>`).join("")}
              </div>
              ${g.exercises.map((e, i) => `
              <details class="ex" data-fit="${esc(e.fit)}">
                <summary><span class="i">${i + 1}</span><h3>${esc(e.h)}</h3><span class="fit ${e.fit === "Every project" ? "every" : ""}">${esc(e.fit)}</span><span class="pm" aria-hidden="true"></span></summary>
                <div class="body"><p>${esc(e.p)}</p>${e.res && e.res.length ? `<div class="res">${e.res.map(resChip).join("")}</div>` : ""}</div>
              </details>`).join("")}
            </div>
          </section>

          <section id="library">
            <div class="sec-head"><i>5</i><h2>Where to learn the tools</h2><p>Vetted sources. Each opens in a new tab.</p></div>
            <div class="sec-body lib">${g.resources.map(libRow).join("")}</div>
          </section>

          <nav class="pager" aria-label="Gate navigation">
            ${prev ? `<a href="#${prev.key}"><small>← Gate ${prev.num}</small><span class="t">${esc(prev.title)}</span></a>` : `<a href="#home"><small>← Home</small><span class="t">The model</span></a>`}
            ${next ? `<a href="#${next.key}"><small>Gate ${next.num} →</small><span class="t">${esc(next.title)}</span></a>` : `<a href="#home"><small>Finish →</small><span class="t">Back to the model</span></a>`}
          </nav>
        </div>
      </div>`;

    // checkboxes
    app.querySelectorAll(".ledger input[type=checkbox]").forEach((cb) => cb.addEventListener("change", () => {
      const row = cb.closest(".row"); const d = store.get(g.key + ":done") || {}; d[row.dataset.i] = cb.checked; store.set(g.key + ":done", d); row.classList.toggle("is-done", cb.checked);
    }));
    app.querySelector("[data-reset]").addEventListener("click", () => {
      store.set(g.key + ":done", {});
      app.querySelectorAll(".ledger .row").forEach((r) => { r.classList.remove("is-done"); r.querySelector("input").checked = false; });
    });
    // exercise filter
    app.querySelectorAll(".filter button").forEach((b) => b.addEventListener("click", () => {
      app.querySelectorAll(".filter button").forEach((x) => x.setAttribute("aria-pressed", "false")); b.setAttribute("aria-pressed", "true");
      const f = b.dataset.fit; app.querySelectorAll(".ex").forEach((e) => { e.hidden = !(f === "*" || e.dataset.fit === f || e.dataset.fit === "Every project"); });
    }));
    // section nav: smooth scroll + scroll-spy
    const links = [...app.querySelectorAll(".secnav a")];
    links.forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); document.getElementById(a.dataset.sec).scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" }); }));
    const secs = sections.map(([id]) => document.getElementById(id));
    const io = new IntersectionObserver((entries) => {
      const vis = entries.filter((x) => x.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (vis) links.forEach((a) => a.classList.toggle("is-on", a.dataset.sec === vis.target.id));
    }, { rootMargin: "-20% 0px -60% 0px", threshold: 0 });
    secs.forEach((s) => io.observe(s));
    links[0].classList.add("is-on");
  }

  /* ---------- Guides ---------- */
  function renderSpan(s) {
    app.innerHTML = `
      <div class="guide">
        <span class="label rise"><b>Spanning activity</b> &nbsp;·&nbsp; Runs through every gate</span>
        <h1 class="rise d1">${esc(s.name)}</h1>
        <p class="lede rise d2">${esc(s.purpose)}</p>
        ${s.roles ? `<section><div class="sec-head"><i>1</i><h2>Who owns what</h2></div><div class="roles">${s.roles.map((r) => `<div><b>${esc(r.r)}</b><span>${esc(r.d)}</span></div>`).join("")}</div></section>` : ""}
        ${s.habits ? `<section><div class="sec-head"><i>${s.roles ? 2 : 1}</i><h2>What it looks like every week</h2></div><ul class="plain">${s.habits.map((h) => `<li>${esc(h)}</li>`).join("")}</ul></section>` : ""}
        <section><div class="sec-head"><i>${s.roles && s.habits ? 3 : (s.roles || s.habits) ? 2 : 1}</i><h2>What a reviewer expects at each gate</h2></div>
          <ul class="bygate">${s.byGate.map((x) => { const m = x.match(/^Gate (\d):\s*(.*)$/); return `<li><b>${m ? "Gate " + m[1] : ""}</b><span>${esc(m ? m[2] : x)}</span></li>`; }).join("")}</ul></section>
        <section><div class="sec-head"><i>${s.roles && s.habits ? 4 : 3}</i><h2>Where to learn more</h2></div><div class="lib">${s.resources.map(libRow).join("")}</div></section>
        <nav class="pager" aria-label="Navigation" style="margin-top:48px"><a href="#home"><small>← Home</small><span class="t">The model</span></a><a href="#gate1"><small>Start →</small><span class="t">Gate 1 · Define the problem</span></a></nav>
      </div>`;
  }
  function renderHow() {
    const col = (t, items) => `<div class="rv-col"><h3>${t}</h3><ul>${items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>`;
    app.innerHTML = `
      <div class="guide">
        <span class="label rise"><b>Guide</b> &nbsp;·&nbsp; Start here if you have a question</span>
        <h1 class="rise d1">${esc(ABOUT.title)}</h1>
        <p class="lede rise d2">${esc(ABOUT.lead)}</p>
        <section><div class="sec-head"><i>1</i><h2>What the 7Rs stands for</h2><p>${esc(SEVEN.lead)}</p></div>${sevenBlock(true)}</section>
        <section><div class="sec-head"><i>2</i><h2>What a gate is</h2></div><div class="points">${ABOUT.points.map((p) => `<div><h3>${esc(p.h)}</h3><p>${esc(p.p)}</p></div>`).join("")}</div></section>
        <section><div class="sec-head"><i>3</i><h2>What happens at a gate review</h2></div>
          <div class="rv">${col("Before", ABOUT.review.before)}${col("During", ABOUT.review.during)}${col("After", ABOUT.review.after)}</div></section>
        <section><div class="sec-head"><i>4</i><h2>The five gates at a glance</h2></div>
          <div class="glance">${GATES.map((g) => { const st = stageOf(g.stage); return `<a href="#${g.key}"><span class="n">${g.num}</span><div><b>${esc(g.title)}</b><span>Closes Stage ${st.num} · ${esc(st.name)} · ${g.deliverables.map((d) => d.name).join(", ")}</span></div><span class="arr">→</span></a>`; }).join("")}</div></section>
        <section><div class="sec-head"><i>5</i><h2>Questions teams ask</h2></div><div class="faq">${ABOUT.faq.map((f) => `<div><h3>${esc(f.q)}</h3><p>${esc(f.a)}</p></div>`).join("")}</div></section>
        <section><div class="sec-head"><i>6</i><h2>What changed from the July 2026 documents</h2></div><ul class="plain">${ABOUT.changed.map((c) => `<li>${esc(c)}</li>`).join("")}</ul></section>
        <section><div class="sec-head"><i>7</i><h2>The whole shelf</h2></div><div class="lib">${Object.keys(RESOURCES).map(libRow).join("")}</div></section>
        <nav class="pager" aria-label="Navigation" style="margin-top:48px"><a href="#home"><small>← Home</small><span class="t">The model</span></a><a href="#gate1"><small>Start →</small><span class="t">Gate 1 · Define the problem</span></a></nav>
      </div>`;
  }

  /* ---------- Router ---------- */
  function route() {
    const h = (location.hash || "#home").slice(1).replace(/[^a-z0-9]/gi, "");
    const g = gateByKey(h), s = SPANS.find((x) => x.key === h);
    if (g) renderGate(g); else if (s) renderSpan(s); else if (h === "how") renderHow(); else renderHome();
    const cur = g || s || h === "how" ? h : "home";
    document.querySelectorAll(".stepper a, .links a").forEach((a) => { if (a.getAttribute("href") === "#" + cur) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    sheet.hidden = true; menuBtn.setAttribute("aria-expanded", "false");
    window.scrollTo(0, 0);
    document.title = (g ? `Gate ${g.num} · ${g.title}` : s ? s.name : h === "how" ? ABOUT.title : "The 7Rs") + " · CSG";
  }
  // Keyboard: ← → between gates on gate pages
  document.addEventListener("keydown", (e) => {
    if (e.target.closest("input, textarea, [contenteditable], #journey") || e.metaKey || e.ctrlKey || e.altKey) return;
    const g = gateByKey((location.hash || "").slice(1)); if (!g) return;
    if (e.key === "ArrowRight" && GATES[g.num]) location.hash = "#" + GATES[g.num].key;
    if (e.key === "ArrowLeft" && GATES[g.num - 2]) location.hash = "#" + GATES[g.num - 2].key;
  });
  window.addEventListener("hashchange", route);
  route();
})();
