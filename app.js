/* Hash router + renderers. Routes: #home, #gate1..#gate5, #habits, #library, #how */
(function () {
  const app = document.getElementById("app");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const stageOf = (id) => STAGES.find((s) => s.id === id);
  const gateByKey = (k) => GATES.find((g) => g.key === k);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  function libRow(id) {
    const r = RESOURCES[id]; if (!r) return "";
    return `<a href="${esc(r.url)}" target="_blank" rel="noopener">
      <div class="ty">${esc(r.type)}<small>${esc(r.source)}</small></div>
      <div><h3>${esc(r.title)}</h3><div class="au">${esc(r.author)}</div></div>
      <p class="why">${esc(r.why)}</p>
      <span class="arr" aria-hidden="true">↗</span></a>`;
  }
  const resChip = (id) => { const r = RESOURCES[id]; return r ? `<a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.type)} · ${esc(r.title)}</a>` : ""; };
  const learnChips = (ids) => ids && ids.length ? `<div class="learn-chips">${ids.map((id) => { const r = RESOURCES[id]; return r ? `<a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.title)} ↗</a>` : ""; }).join("")}</div>` : "";

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
      `Start by asking me whatever you need to know. Then work through the items with me one at a time, in order. Push back when our thinking is vague, and tell us when an answer would not survive the review questions above.`,
    ].join("\n");
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
          <div class="rise">
            <span class="label"><b>Cougar Strategy Group</b> &nbsp;·&nbsp; Engagement operating model</span>
            <h1>Four stages.<br>Five gates.<br><em>One answer the client acts on.</em></h1>
          </div>
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
        <div class="journey rise d3" id="journey" tabindex="0" role="group" aria-label="Stages and gates. Arrow keys move between gates, Enter opens one.">${segs}<div class="rail" aria-hidden="true"><i id="railFill"></i></div>${pins}</div>
        <div class="preview rise d4" id="preview" aria-live="polite"></div>
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
    const sections = [
      ["purpose", "Purpose", ""], ["have", "What you should have", g.deliverables.length],
      ["exercises", "Exercises", g.exercises.length], ["tools", "Tools", g.learn.length],
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
          </div>
          <nav class="secnav rise d4" aria-label="On this page">
            ${sections.map(([id, name, cnt], i) => `<a href="#${g.key}" data-sec="${id}"><i>${i + 1}</i><span>${name}</span><span class="cnt">${cnt}</span></a>`).join("")}
          </nav>
          <div class="side-pager">
            ${prev ? `<a href="#${prev.key}"><span>← Gate ${prev.num}</span><b>${esc(prev.title)}</b></a>` : `<a href="#home"><span>← Home</span><b>The model</b></a>`}
            ${next ? `<a class="next" href="#${next.key}"><span>Gate ${next.num} →</span><b>${esc(next.title)}</b></a>` : `<a class="next" href="#how"><span>Finish →</span><b>How it works</b></a>`}
          </div>
        </aside>

        <div class="gate-main">
          <section id="purpose">
            <div class="sec-head"><i>1</i><h2>Purpose of this gate</h2></div>
            <div class="sec-body">
              <div class="prose"><p>${esc(g.lead)}</p></div>
              <div class="settles">
                <div class="t">What this gate settles</div>
                <ul>${g.settles.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
              </div>
            </div>
          </section>

          <section id="have">
            <div class="sec-head"><i>2</i><h2>What you should have</h2><p>Things to have worked out by the review. The forms below are suggestions, not rules: one document that covers them well beats three that do not. Tick them off as you go; progress stays in this browser.</p></div>
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
              <div class="ledger-foot">
                <span>Talked through with your faculty advisor in a 20–30 minute review.</span>
                <button class="ghost" data-prompt title="Copies a briefing for ChatGPT or Claude. Never paste client data.">Copy AI prompt</button>
                <button class="reset" data-reset>Reset progress</button>
              </div>
              <textarea id="promptFallback" hidden rows="8" aria-label="AI prompt text, select and copy"></textarea>
              <div class="asks">
                <div class="t">Can you answer these?</div>
                <p class="note">Your advisor may ask these, or others. If the team can answer them without digging, you are ready.</p>
                <ul>${g.review.map((q) => `<li>${esc(q)}</li>`).join("")}</ul>
              </div>
            </div>
          </section>

          <section id="exercises">
            <div class="sec-head"><i>3</i><h2>Exercises that help</h2><p>None are required. Pick what gets your kind of project to strong work.</p></div>
            <div class="sec-body">
              <div class="filter" role="group" aria-label="Filter exercises by project type">
                <button aria-pressed="true" data-fit="*">All</button>
                ${fits.filter((f) => f !== "Every project").map((f) => `<button aria-pressed="false" data-fit="${esc(f)}">${esc(f)}</button>`).join("")}
              </div>
              ${g.exercises.map((e, i) => `
              <details class="ex" data-fit="${esc(e.fit)}">
                <summary><span class="i">${i + 1}</span><h3>${esc(e.h)}</h3><span class="fit ${e.fit === "Every project" ? "every" : ""}">${esc(e.fit)}</span><span class="pm" aria-hidden="true"></span></summary>
                <div class="body"><p>${esc(e.p)}</p>${e.res && e.res.length ? `<div class="res">${e.res.map(resChip).join("")}</div>` : ""}</div>
              </details>`).join("")}
            </div>
          </section>

          <section id="tools">
            <div class="sec-head"><i>4</i><h2>Learn the tools</h2><p>The few that matter most here. The full set lives in the <a href="#library">library</a>.</p></div>
            <div class="sec-body lib">${g.learn.map(libRow).join("")}</div>
          </section>

          <nav class="pager" aria-label="Gate navigation">
            ${prev ? `<a href="#${prev.key}"><small>← Gate ${prev.num}</small><span class="t">${esc(prev.title)}</span></a>` : `<a href="#home"><small>← Home</small><span class="t">The model</span></a>`}
            ${next ? `<a href="#${next.key}"><small>Gate ${next.num} →</small><span class="t">${esc(next.title)}</span></a>` : `<a href="#how"><small>Finish →</small><span class="t">How it works</span></a>`}
          </nav>
        </div>
      </div>`;

    /* checkboxes */
    app.querySelectorAll(".ledger input[type=checkbox]").forEach((cb) => cb.addEventListener("change", () => {
      const row = cb.closest(".row"); const d = store.get(g.key + ":done") || {}; d[row.dataset.i] = cb.checked; store.set(g.key + ":done", d); row.classList.toggle("is-done", cb.checked);
    }));
    app.querySelector("[data-reset]").addEventListener("click", () => {
      store.set(g.key + ":done", {});
      app.querySelectorAll(".ledger .row").forEach((r) => { r.classList.remove("is-done"); r.querySelector("input").checked = false; });
    });
    /* exercise filter */
    app.querySelectorAll(".filter button").forEach((b) => b.addEventListener("click", () => {
      app.querySelectorAll(".filter button").forEach((x) => x.setAttribute("aria-pressed", "false")); b.setAttribute("aria-pressed", "true");
      const f = b.dataset.fit;
      app.querySelectorAll(".ex").forEach((e) => { e.hidden = !(f === "*" || e.dataset.fit === f || e.dataset.fit === "Every project"); });
    }));
    /* AI prompt */
    const pbtn = app.querySelector("[data-prompt]"), pta = app.querySelector("#promptFallback");
    pbtn.addEventListener("click", async () => {
      const text = promptFor(g);
      try {
        await navigator.clipboard.writeText(text);
        pbtn.textContent = "Prompt copied";
        setTimeout(() => { pbtn.textContent = "Copy AI prompt"; }, 2200);
      } catch (err) {
        pta.hidden = false; pta.value = text; pta.focus(); pta.select();
        pbtn.textContent = "Copy it from the box";
      }
    });
    /* section nav: smooth scroll + scroll-spy */
    const links = [...app.querySelectorAll(".secnav a")];
    links.forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); document.getElementById(a.dataset.sec).scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" }); }));
    const io = new IntersectionObserver((entries) => {
      const vis = entries.filter((x) => x.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (vis) links.forEach((a) => a.classList.toggle("is-on", a.dataset.sec === vis.target.id));
    }, { rootMargin: "-20% 0px -60% 0px", threshold: 0 });
    sections.forEach(([id]) => io.observe(document.getElementById(id)));
    links[0].classList.add("is-on");
  }

  /* ---------- Habits ---------- */
  function renderHabits() {
    app.innerHTML = `<div class="guide">
      <span class="label rise"><b>The three habits</b> &nbsp;·&nbsp; Looked for at every gate</span>
      <h1 class="rise d1">Roles, Relationship, Refine</h1>
      <p class="lede rise d2">Three of the seven R's are not stages. They run through all four, and a reviewer looks for evidence of each one at every gate.</p>
      ${HABITS.map((h) => `<section class="habit" id="${h.key}">
        <h2><em>R</em>${esc(h.name.slice(1))}<small>${esc(h.full)}</small></h2>
        <p class="lede">${esc(h.lead)}</p>
        ${h.roles ? `<div class="sub">Who owns what</div><div class="roles">${h.roles.map(([r, d]) => `<div><b>${esc(r)}</b><span>${esc(d)}</span></div>`).join("")}</div>` : ""}
        ${h.habits ? `<div class="sub">What it looks like every week</div><ul class="plain">${h.habits.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
        <div class="sub">What a reviewer looks for</div>
        <ul class="bygate">${h.byGate.map((x, i) => `<li><b><a href="#gate${i + 1}">Gate ${i + 1}</a></b><span>${esc(x)}</span></li>`).join("")}</ul>
        ${learnChips(h.learn)}
      </section>`).join("")}
      <nav class="pager" aria-label="Navigation" style="margin-top:48px"><a href="#home"><small>← Home</small><span class="t">The model</span></a><a href="#how"><small>Guide →</small><span class="t">How it works</span></a></nav>
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
    app.innerHTML = `<div class="guide">
      <span class="label rise"><b>Guide</b> &nbsp;·&nbsp; Start here with a question</span>
      <h1 class="rise d1">${esc(PROCESS.title)}</h1>
      <p class="lede rise d2">${esc(PROCESS.lead)}</p>

      <section><div class="sec-head"><i>1</i><h2>The whole process, start to finish</h2></div>
        <div class="overview">${overview}</div>
        <p class="ov-foot">Roughly 12 to 15 weeks end to end. Stage 1 is the one that cannot slip; everything after it moves when the problem is not defined.</p>
      </section>

      <section><div class="sec-head"><i>2</i><h2>What a gate is</h2></div>
        <ul class="plain">${PROCESS.whatIsGate.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></section>

      <section><div class="sec-head"><i>3</i><h2>What happens at a review</h2></div>
        <div class="rv">${Object.entries(PROCESS.review).map(([t, items]) => col(t, items)).join("")}</div></section>

      <section><div class="sec-head"><i>4</i><h2>Five rules of thumb</h2></div>
        <div class="roles rules">${PROCESS.rules.map(([h, p]) => `<div><b>${esc(h)}</b><span>${esc(p)}</span></div>`).join("")}</div></section>

      <section><div class="sec-head"><i>5</i><h2>How the values show up</h2><p>${esc(PROCESS.values.lead)}</p></div>
        <div class="roles values">${PROCESS.values.rows.map(([v, b, p]) => `<div><b>${esc(v)}<small>${esc(b)}</small></b><span>${esc(p)}</span></div>`).join("")}</div></section>

      <section><div class="sec-head"><i>6</i><h2>Questions teams ask</h2></div>
        <div class="faq">${PROCESS.faq.map(([q, a]) => `<div><h3>${esc(q)}</h3><p>${esc(a)}</p></div>`).join("")}</div></section>

      <section><div class="sec-head"><i>7</i><h2>What changed from the July 2026 documents</h2></div>
        <ul class="plain">${PROCESS.changed.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></section>

      <nav class="pager" aria-label="Navigation" style="margin-top:48px"><a href="#home"><small>← Home</small><span class="t">The model</span></a><a href="#gate1"><small>Start →</small><span class="t">Gate 1 · Define the problem</span></a></nav>
    </div>`;
  }

  /* ---------- Library ---------- */
  function renderLibrary() {
    app.innerHTML = `<div class="guide">
      <span class="label rise"><b>Library</b> &nbsp;·&nbsp; ${Object.keys(RESOURCES).length} vetted sources</span>
      <h1 class="rise d1">Where to learn the tools</h1>
      <p class="lede rise d2">Grouped by what you are trying to do rather than by gate, because the same source often helps at three of them. Each opens in a new tab.</p>
      ${TOPICS.map(([id, name], i) => { const ids = Object.keys(RESOURCES).filter((k) => RESOURCES[k].topic === id); return ids.length ? `<section><div class="sec-head"><i>${i + 1}</i><h2>${esc(name)}</h2></div><div class="lib">${ids.map(libRow).join("")}</div></section>` : ""; }).join("")}
      <section class="ai"><div class="sec-head"><i>${TOPICS.length + 1}</i><h2>${esc(AI_INTRO.title)}</h2><p>${esc(AI_INTRO.lead)}</p></div>
        <p class="warn"><b>One hard rule.</b> ${esc(AI_INTRO.rule)}</p>
      </section>
      <nav class="pager" aria-label="Navigation" style="margin-top:48px"><a href="#home"><small>← Home</small><span class="t">The model</span></a><a href="#how"><small>Guide →</small><span class="t">How it works</span></a></nav>
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
