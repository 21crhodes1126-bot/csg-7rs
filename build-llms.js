/* Generates llms.txt from content.js, so the plain-text version of the site can
   never drift from the site itself. Run after editing content.js:

     node build-llms.js

   Why this file exists: the site renders through JavaScript, so a crawler that
   does not run JS sees an empty page. llms.txt gives any AI tool, or anyone who
   pastes the site's URL into one, the whole model as readable text. */

const fs = require("fs");
const c = {};
new Function(fs.readFileSync("content.js", "utf8") +
  ";this.RESOURCES=RESOURCES;this.TOPICS=TOPICS;this.STAGES=STAGES;this.SEVEN=SEVEN;this.GATES=GATES;this.HABITS=HABITS;this.PROCESS=PROCESS;this.AI_INTRO=AI_INTRO;"
).call(c);

const SITE = "https://21crhodes1126-bot.github.io/csg-7rs/";
const L = [];
const p = (s = "") => L.push(s);
const bullets = (arr) => arr.forEach((x) => p(`- ${x}`));

p(`# The 7Rs — the engagement model of Cougar Strategy Group (BYU Marriott School of Business)`);
p();
p(`> ${c.PROCESS.lead}`);
p();
p(`This is the complete plain-text version of ${SITE}. The site itself renders through JavaScript, so this file is the reliable source for any tool reading the model. It covers all seven R's, all five gates, what a team should have at each one, the questions a review may cover, the exercises on offer, and the reference library.`);
p();
p(`Cougar Strategy Group (CSG) is a student-led consulting group at BYU's Marriott School of Business. MBA students in MBA 684B and undergraduates in STRAT 421 work on real, paying client engagements. The 7Rs is the model every engagement follows. It was created by faculty advisor Paul Godfrey; this revision was proposed by the 7Rs Team in Fall 2026.`);
p();

p(`## What the seven R's are`);
p();
p(c.SEVEN.lead);
p();
p(`Four stages, run in order:`);
bullets(c.SEVEN.stages.map((s) => `**${s.word}** — ${s.gloss}`));
p();
p(`Three habits, running through all four stages:`);
bullets(c.SEVEN.habits.map((s) => `**${s.word}** — ${s.gloss}`));
p();

p(`## The arc at a glance`);
p();
p(`Roughly 12 to 15 weeks end to end. Stage 1 is the one that cannot slip; everything after it moves when the problem is not defined.`);
p();
c.STAGES.forEach((st) => {
  p(`**Stage ${st.num} · ${st.name}** (${st.weeks}) — ${st.tagline}`);
  st.gates.forEach((n) => { const g = c.GATES[n - 1]; p(`  - Gate ${g.num}: ${g.title} — ${g.objective}`); });
});
p();

p(`## The five gates`);
p();
p(`A gate is a checkpoint between two stages, not an exam. A team shows its faculty advisor (Paul Godfrey or Troy Nielson) what it has worked out, talks it through for twenty to thirty minutes, and together they decide whether the next stage can safely start. There is no checklist to submit. How a team shows its work is up to the team: one document that covers everything well beats three that do not.`);
p();

c.GATES.forEach((g) => {
  const st = c.STAGES.find((s) => s.id === g.stage);
  p(`### Gate ${g.num}: ${g.title}`);
  p();
  p(`- Closes Stage ${st.num} (${st.name})`);
  p(`- Time: MBA ${g.duration.mba}, EMBA ${g.duration.emba}`);
  p(`- Objective: ${g.objective}`);
  p();
  p(`**Purpose.** ${g.lead}`);
  p();
  p(`**What this gate settles:**`);
  bullets(g.settles);
  p();
  p(`**What the team should have:**`);
  p();
  g.deliverables.forEach((d, i) => {
    p(`${i + 1}. **${d.name}** (suggested form: ${d.form}). ${d.what}`);
    p(`   A good one: ${d.good.join(" ")}`);
  });
  p();
  p(`**Questions the review may cover.** These are a self-check rather than a fixed rubric; an advisor may ask these or others.`);
  bullets(g.review);
  p();
  p(`**Exercises that help.** None are required. They are a menu, tagged by the kind of project.`);
  g.exercises.forEach((e) => p(`- ${e.h} (${e.fit}). ${e.p}`));
  p();
  p(`**Most relevant reading:** ${g.learn.map((r) => `${c.RESOURCES[r].title} (${c.RESOURCES[r].source})`).join("; ")}.`);
  p();
});

p(`## The three habits`);
p();
p(`These are not stages. They run through all four stages, and a reviewer looks for evidence of each at every gate.`);
p();
c.HABITS.forEach((h) => {
  p(`### ${h.name} — ${h.full}`);
  p();
  p(h.lead);
  p();
  if (h.roles) { p(`Roles:`); h.roles.forEach(([r, d]) => p(`- **${r}**: ${d}`)); p(); }
  if (h.habits) { p(`Weekly habits:`); bullets(h.habits); p(); }
  p(`What a reviewer looks for:`);
  h.byGate.forEach((x, i) => p(`- Gate ${i + 1}: ${x}`));
  p();
});

p(`## How a gate review works`);
p();
p(`What a gate is:`);
bullets(c.PROCESS.whatIsGate);
p();
Object.entries(c.PROCESS.review).forEach(([k, items]) => { p(`${k}:`); bullets(items); p(); });

p(`## Five rules of thumb`);
p();
c.PROCESS.rules.forEach(([h, d]) => p(`- **${h}** — ${d}`));
p();

p(`## How CSG's values show up`);
p();
p(c.PROCESS.values.lead);
p();
c.PROCESS.values.rows.forEach(([v, b, d]) => p(`- **${v}** (${b}) — ${d}`));
p();

p(`## Questions teams ask`);
p();
c.PROCESS.faq.forEach(([q, a]) => { p(`**${q}**`); p(a); p(); });

p(`## What changed from the July 2026 stage gate documents`);
p();
bullets(c.PROCESS.changed);
p();

p(`## Library`);
p();
p(`Vetted sources, grouped by what a team is trying to do.`);
p();
c.TOPICS.forEach(([id, name]) => {
  const ids = Object.keys(c.RESOURCES).filter((k) => c.RESOURCES[k].topic === id);
  if (!ids.length) return;
  p(`### ${name}`);
  ids.forEach((k) => { const r = c.RESOURCES[k]; p(`- [${r.title}](${r.url}) — ${r.type}, ${r.source}, ${r.author}. ${r.why}`); });
  p();
});

p(`## Using AI on a CSG engagement`);
p();
p(c.AI_INTRO.lead);
p();
p(`**${c.AI_INTRO.rule}**`);
p();

p(`## About this file`);
p();
p(`Generated from the site's own content file, so it always matches what the site says. Source: ${SITE}. Based on Paul Godfrey's 7Rs model (v1.4, July 2026); revised structure proposed by the 7Rs Team, Fall 2026. Last generated ${new Date().toISOString().slice(0, 10)}.`);

const out = L.join("\n") + "\n";
fs.writeFileSync("llms.txt", out);
console.log(`llms.txt written: ${out.split(/\s+/).length} words, ${(out.length / 1024).toFixed(1)} KB`);
