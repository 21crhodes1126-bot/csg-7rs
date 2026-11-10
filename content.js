/* 7Rs content. Everything the site says lives in this file.
   Structure: STAGES (four core R's) · GATES (five checkpoints) · HABITS (three spanning R's)
              PROCESS (the How it works page) · RESOURCES + TOPICS (the library) */

const RESOURCES = {
  hbrRightProblem: { type: "Article", source: "Harvard Business Review", title: "Are You Solving the Right Problems?", author: "Thomas Wedell-Wedellsborg", url: "https://hbr.org/2017/01/are-you-solving-the-right-problems", why: "Seven ways to reframe a problem before you commit to solving it. Read it in week one.", topic: "define" },
  strategyuTree: { type: "Article", source: "StrategyU", title: "Issue Trees: What Are They and How Do You Use Them?", author: "Paul Millerd", url: "https://strategyu.co/issue-tree", why: "How to break a question into branches, with worked examples. The clearest short guide we found.", topic: "define" },
  fiveWhys: { type: "Article", source: "MindTools", title: "5 Whys", author: "MindTools", url: "https://www.mindtools.com/a3mi00v/5-whys", why: "Ten minutes. Turns a symptom into something the client could actually change.", topic: "define" },
  porter: { type: "Article", source: "Harvard Business Review", title: "The Five Competitive Forces That Shape Strategy", author: "Michael E. Porter", url: "https://hbr.org/2008/01/the-five-competitive-forces-that-shape-strategy", why: "Porter's own update, not a summary of it. Use it when industry structure is part of the problem.", topic: "define" },
  chevallier: { type: "Site", source: "Powerful Problem Solving", title: "Powerful Problem Solving", author: "Arnaud Chevallier, IMD", url: "https://www.powerful-problem-solving.com/", why: "Short pieces on framing problems and building diagnostic trees. A second voice on the same tools.", topic: "define" },

  thinkMece: { type: "Article", source: "Think Insights", title: "Problem Structuring and Hypothesis-Driven Consulting", author: "Think Insights", url: "https://thinkinsights.net/playbooks/problem-structuring-hypothesis-driven-consulting-playbook-issue-trees-mece", why: "Issue tree versus hypothesis tree, and how to know when a branch is deep enough to stop.", topic: "plan" },
  mck7: { type: "Article", source: "McKinsey Quarterly", title: "How to master the seven-step problem-solving process", author: "McKinsey, 2019", url: "https://www.mckinsey.com/capabilities/strategy-and-corporate-finance/our-insights/how-to-master-the-seven-step-problem-solving-process", why: "The full arc from defining a problem to communicating the answer. Useful context for the whole model.", topic: "plan" },
  bulletproof: { type: "Book", source: "Conn and McLean", title: "Bulletproof Problem Solving", author: "Charles Conn and Robert McLean", url: "https://bulletproofproblemsolving.com/", why: "Thirty worked examples of logic trees. Chapter 6 is a practical guide to picking an analysis.", topic: "plan" },

  nngInterviews: { type: "Article", source: "Nielsen Norman Group", title: "User Interviews 101", author: "Maria Rosala and Kara Pernice", url: "https://www.nngroup.com/articles/user-interviews/", why: "How to plan, run and write up an interview so it produces evidence instead of opinions.", topic: "research" },
  questions: { type: "Article", source: "Harvard Business Review", title: "The Surprising Power of Questions", author: "Alison Wood Brooks and Leslie K. John", url: "https://hbr.org/2018/05/the-surprising-power-of-questions", why: "Which questions get people to tell you what is really going on, and what order to ask them in.", topic: "research" },
  momTest: { type: "Book", source: "Rob Fitzpatrick", title: "The Mom Test", author: "Rob Fitzpatrick", url: "https://www.momtestbook.com/", why: "How to ask about past behavior rather than future promises. Essential if your client is a startup.", topic: "research" },
  pew: { type: "Guide", source: "Pew Research Center", title: "Writing Survey Questions", author: "Pew Research Center", url: "https://www.pewresearch.org/our-methods/u-s-surveys/writing-survey-questions/", why: "Read this before a survey goes out. It will catch the leading and double-barreled questions.", topic: "research" },
  hbsFinancials: { type: "Article", source: "HBS Online", title: "Reading and Understanding Financial Statements", author: "Harvard Business School Online", url: "https://online.hbs.edu/blog/post/how-to-read-financial-statements", why: "Enough to size a problem in dollars and judge whether the client can afford your recommendation.", topic: "research" },

  minto: { type: "Site", source: "Barbara Minto", title: "The Minto Pyramid Principle", author: "Barbara Minto", url: "https://www.barbaraminto.com/", why: "Where SCQA comes from. State the answer, then group the support beneath it.", topic: "story" },
  pyramidVideo: { type: "Video", source: "Analyst Academy", title: "Consultant Explains the Pyramid Principle", author: "Analyst Academy", url: "https://www.youtube.com/watch?v=elMPIxLYtoc", why: "Ten minutes, with slides on screen. The fastest way to see answer-first structure in action.", topic: "story" },
  actionTitles: { type: "Article", source: "Slideworks", title: "How to Write Slide Action Titles", author: "Slideworks", url: "https://slideworks.io/resources/how-to-write-action-titles-like-mckinsey", why: "The single habit that most improves a deck. Every title states the takeaway, not the topic.", topic: "story" },
  swd: { type: "Site", source: "Storytelling with Data", title: "Storytelling with Data", author: "Cole Nussbaumer Knaflic", url: "https://www.storytellingwithdata.com/", why: "Before and after examples of real charts. Use it when a slide has data but no message.", topic: "story" },
  duarteStory: { type: "Article", source: "Harvard Business Review", title: "Structure Your Presentation Like a Story", author: "Nancy Duarte", url: "https://hbr.org/2012/10/structure-your-presentation-li", why: "What is, what could be, and the gap between. Useful when the deck is accurate but flat.", topic: "story" },

  ideo: { type: "Article", source: "IDEO U", title: "7 Brainstorming Rules", author: "IDEO U", url: "https://www.ideou.com/blogs/inspiration/7-simple-rules-of-brainstorming", why: "Rules that keep a team generating options instead of arguing about the first one.", topic: "recommend" },
  decisionMatrix: { type: "Article", source: "ASQ", title: "What Is a Decision Matrix?", author: "American Society for Quality", url: "https://asq.org/quality-resources/decision-matrix", why: "How to score options against weighted criteria without inventing precision you do not have.", topic: "recommend" },
  premortem: { type: "Article", source: "Harvard Business Review", title: "Performing a Project Premortem", author: "Gary Klein", url: "https://hbr.org/2007/09/performing-a-project-premortem", why: "A twenty-minute exercise that surfaces the risks nobody wants to raise in a normal meeting.", topic: "recommend" },
  kotter: { type: "Article", source: "Harvard Business Review", title: "Leading Change: Why Transformation Efforts Fail", author: "John P. Kotter", url: "https://hbr.org/2007/01/leading-change-why-transformation-efforts-fail", why: "Eight reasons good recommendations die after the consultants leave. A checklist for your sequencing.", topic: "recommend" },
  scorecard: { type: "Article", source: "Harvard Business Review", title: "The Balanced Scorecard", author: "Robert Kaplan and David Norton", url: "https://hbr.org/1992/01/the-balanced-scorecard-measures-that-drive-performance-2", why: "How to pick a handful of measures that cover more than finance.", topic: "recommend" },

  killerPresentation: { type: "Article", source: "Harvard Business Review", title: "How to Give a Killer Presentation", author: "Chris Anderson, TED", url: "https://hbr.org/2013/06/how-to-give-a-killer-presentation", why: "Framing, delivery and rehearsal, from the person who coaches TED speakers.", topic: "deliver" },
  advice: { type: "Article", source: "Harvard Business Review", title: "The Art of Giving and Receiving Advice", author: "David Garvin and Joshua Margolis", url: "https://hbr.org/2015/01/the-art-of-giving-and-receiving-advice", why: "Why good advice gets rejected. Read it as the client's side of the table.", topic: "deliver" },
  listeners: { type: "Article", source: "Harvard Business Review", title: "What Great Listeners Actually Do", author: "Jack Zenger and Joseph Folkman", url: "https://hbr.org/2016/07/what-great-listeners-actually-do", why: "Listening to understand rather than to reply, described as behaviors you can copy.", topic: "deliver" },

  teams: { type: "Article", source: "Harvard Business Review", title: "The Discipline of Teams", author: "Jon Katzenbach and Douglas Smith", url: "https://hbr.org/1993/03/the-discipline-of-teams-2", why: "What separates a team from a group of people assigned to the same project.", topic: "teams" },
  edmondson: { type: "Video", source: "TEDxHGSE", title: "Building a Psychologically Safe Workplace", author: "Amy Edmondson, Harvard Business School", url: "https://www.youtube.com/watch?v=LhoLuui9gX8", why: "Eleven minutes on why teams that admit mistakes early outperform teams that do not.", topic: "teams" },
};

const TOPICS = [
  ["define", "Defining the problem"],
  ["plan", "Structuring and planning"],
  ["research", "Interviews, surveys and data"],
  ["story", "Story and slides"],
  ["recommend", "Options, risk and implementation"],
  ["deliver", "Presenting and the client"],
  ["teams", "Working as a team"],
];

const STAGES = [
  { id: "recognize", num: 1, name: "Recognize", tagline: "Define the real problem", gates: [1], weeks: "3–4 weeks" },
  { id: "research", num: 2, name: "Research", tagline: "Plan, then prove", gates: [2, 3], weeks: "5 weeks" },
  { id: "recommend", num: 3, name: "Recommend", tagline: "Build the path forward", gates: [4], weeks: "2 weeks" },
  { id: "retain", num: 4, name: "Retain", tagline: "Deliver and stay", gates: [5], weeks: "2 weeks" },
];

const SEVEN = {
  lead: "Four of the R's are stages, and every project moves through them in order. The other three are habits that run through all four. The five gates are the checkpoints between the stages.",
  stages: [
    { word: "Recognize", gloss: "Define the real problem.", go: "gate1" },
    { word: "Research", gloss: "Plan, then find the answer.", go: "gate2" },
    { word: "Recommend", gloss: "Build a plan the client can run.", go: "gate4" },
    { word: "Retain", gloss: "Deliver it. Keep the client.", go: "gate5" },
  ],
  habits: [
    { word: "Roles", gloss: "Everyone owns a part.", go: "habits" },
    { word: "Relationship", gloss: "No client surprises.", go: "habits" },
    { word: "Refine", gloss: "The story sharpens every gate.", go: "habits" },
  ],
};

const GATES = [
  {
    num: 1, key: "gate1", stage: "recognize",
    title: "Define the problem",
    objective: "Leave with a problem the client agrees with, a first answer, and a map of what to prove.",
    duration: { mba: "3 weeks", emba: "4 weeks" },
    lead: "Clients hire us with a symptom in hand. Sales are flat, turnover is up, a competitor keeps winning deals. Gate 1 is where you turn that into a problem worth solving. Everything downstream inherits what you decide here, so a week spent sharpening the question saves a month of research nobody can use.",
    settles: [
      "What the real problem is, in words the client agrees with",
      "What it is costing them, in dollars, hours or customers",
      "Which pieces of it you can go and test",
      "A first answer you expect to be wrong",
    ],
    deliverables: [
      { name: "Problem statement", form: "One page", what: "The question in one sentence. What it is costing the client, what is in and out of scope, the constraints you have to respect, and who makes the decision.", good: ["Someone outside the team could read it and say what \"solved\" means.", "The client has read it and agreed, or you have noted what they changed.", "It names a cause or a decision, not a symptom."] },
      { name: "SCQA with a day-one answer", form: "One slide", what: "Situation, Complication, Question, Answer. The Question matches your problem statement word for word, and the Answer is your best guess today.", good: ["It fits on one slide in the CSG template.", "The Answer is a real claim that could turn out to be wrong.", "You can say what evidence would change it."] },
      { name: "Issue tree with hypotheses", form: "One page, three levels or more", what: "The question broken into branches that do not overlap and together cover it, ending in things a person could go and test.", good: ["Each end branch is a question one person could answer.", "Branches do not overlap and nothing obvious is missing.", "The branches you plan to test first are marked."] },
    ],
    review: [
      "Is this the problem, or a symptom of it?",
      "What did the sponsor say when you read them the problem statement?",
      "What would convince you your day-one answer is wrong?",
    ],
    exercises: [
      { h: "Interview the sponsor and two people who live with the problem", fit: "Every project", p: "Ask for the story, not the diagnosis. Map who owns the problem, who feels it, and who decides.", res: ["nngInterviews", "questions"] },
      { h: "Run 5 Whys on the headline symptom", fit: "Every project", p: "Start with the client's own words. Stop where the answer becomes something they could actually change.", res: ["fiveWhys"] },
      { h: "Write three competing problem statements, keep one", fit: "Every project", p: "A cost problem, a growth problem, a capability problem. Two sentences on why the other two lose.", res: ["hbrRightProblem"] },
      { h: "Size the problem", fit: "Every project", p: "Dollars, hours or customers per year. Order of magnitude is fine. Show your assumptions.", res: ["hbsFinancials"] },
      { h: "List the assumptions", fit: "Every project", p: "Two lists. What the client assumes about the problem, and what would have to be true for this to be the problem at all." },
      { h: "Build a one-page company snapshot", fit: "Established companies", p: "History, what they sell and to whom, recent moves, financial health, who runs the relevant unit.", res: ["hbsFinancials"] },
      { h: "Scan the industry", fit: "Analytical and market projects", p: "Five Forces, a PEST pass, the closest competitors. Keep only what changes how you see the problem.", res: ["porter"] },
      { h: "Talk to customers", fit: "Startups and open-ended projects", p: "Five to eight short conversations about what people did, not what they say they would do.", res: ["momTest"] },
      { h: "Walk the process", fit: "Operations and service projects", p: "A site visit, or half a day beside the people doing the work. Problems look different on the floor." },
      { h: "Draft the final slide headline today", fit: "Every project", p: "It will be wrong. Writing it anyway shows you what you would need to know to make it right.", res: ["minto"] },
    ],
    learn: ["hbrRightProblem", "strategyuTree", "minto", "nngInterviews"],
  },
  {
    num: 2, key: "gate2", stage: "research",
    title: "Plan the work",
    objective: "Decide what you will prove, what would disprove it, who owns each test, and what the deck will say.",
    duration: { mba: "2 weeks", emba: "2 weeks" },
    lead: "Research without a plan produces a pile of facts and a scramble at the end to make them mean something. Gate 2 is where you decide what you are trying to prove and how you would know if you were wrong, before anyone collects anything. Teams that plan well finish the research stage early.",
    settles: [
      "Which hypotheses are worth testing, and which branches you dropped",
      "What evidence would prove or kill each one",
      "Who owns each test, and when it is due",
      "What the final deck will probably argue",
    ],
    deliverables: [
      { name: "Hypothesis and test plan", form: "One page or a table", what: "For every hypothesis you kept: the data you need, the test you will run, what result supports it, what result kills it, who owns it, and the date.", good: ["Every hypothesis has a written condition that would refute it.", "There are no more tests than the team can run in the time.", "Requests for client data have already gone out."] },
      { name: "Ghost deck", form: "10–15 slides, titles and sketches", what: "The final presentation drafted now, as slide titles in order with hand-sketched charts. This is the deck the client sees at every check-in from here on.", good: ["Reading only the titles tells the whole argument.", "Every slide traces back to a hypothesis or to the SCQA.", "The client has seen it and you recorded their reaction."] },
      { name: "Workplan", form: "One page", what: "The timeline to Gate 3, who owns which workstream, the client meeting cadence, and how the team will work.", good: ["Every team member owns at least one hypothesis.", "The findings preview with the client is booked.", "Today's Answer is updated and dated."] },
    ],
    review: [
      "Which hypothesis, if it fails, changes your recommendation the most?",
      "Read me your slide titles. Does the argument still hold if one of them turns out false?",
      "What have you asked the client for, and when did you ask?",
    ],
    exercises: [
      { h: "Prune the issue tree to what moves the answer", fit: "Every project", p: "Rank the end branches by how much they would change the recommendation and how hard they are to test. Keep a handful.", res: ["thinkMece"] },
      { h: "Write the refutation for every hypothesis", fit: "Every project", p: "If you cannot name data that would make you drop it, you have a belief rather than a hypothesis." },
      { h: "Match the method to the question", fit: "Every project", p: "Interviews answer why and how. Surveys answer how many. Financials and operating data answer how much. Pick the cheapest method that can settle the question.", res: ["mck7"] },
      { h: "Sketch every exhibit with made-up numbers", fit: "Every project", p: "Label the axes. If you cannot draw the chart, you do not yet know what data you need.", res: ["swd", "actionTitles"] },
      { h: "Inventory the data", fit: "Every project", p: "What the client already has, what is public, what you have to create. Request the first group this week." },
      { h: "Read the titles aloud, in order", fit: "Every project", p: "Paste every ghost deck title into one document and read it out. If it does not sound like an argument, reorder before you collect anything.", res: ["actionTitles", "pyramidVideo"] },
      { h: "Draft and pilot the interview guide", fit: "Projects with interviews", p: "Eight to twelve open questions tied to specific hypotheses. Pilot it once, then cut what produced nothing.", res: ["nngInterviews"] },
      { h: "Check every survey question", fit: "Projects with surveys", p: "One idea per question, no leading language, answer options that cover the range. Decide your sample before you write more.", res: ["pew"] },
      { h: "Mock up the model", fit: "Quantitative projects", p: "Build the spreadsheet or regression with placeholder data, so you know exactly which fields to ask for." },
      { h: "Run a pre-mortem on the plan", fit: "Every project", p: "It is the final presentation and the project failed. Everyone writes why. Fix the top two risks in the workplan.", res: ["premortem"] },
    ],
    learn: ["thinkMece", "actionTitles", "pew", "premortem"],
  },
  {
    num: 3, key: "gate3", stage: "research",
    title: "Find the answer",
    objective: "Run the tests, decide which hypotheses survive, and say what it all means in one page.",
    duration: { mba: "3 weeks", emba: "3 weeks" },
    lead: "This is the longest stretch of real work in the engagement, and the easiest place to lose the thread. Teams collect more than they can use and grow attached to one striking chart. Gate 3 brings it back to a single question: what do you know now that you did not know three weeks ago?",
    settles: [
      "Which hypotheses survived the evidence, and which did not",
      "What the surviving findings add up to",
      "How your working answer has changed since Gate 2",
      "What the data cannot tell you",
    ],
    deliverables: [
      { name: "Findings summary", form: "One page", what: "Which hypotheses held up, what they collectively say about the problem, and how Today's Answer has moved. Include one finding that surprised you.", good: ["Every verdict points back to the test that produced it.", "The \"so what\" is one paragraph a sponsor could repeat from memory.", "The limits of the data are stated plainly."] },
      { name: "Evidence deck", form: "Draft of the final deck", what: "The ghost deck with real exhibits in place. Titles rewritten to match what the data actually showed, sources on every slide, refuted material moved to the appendix.", good: ["The titles still read as one argument when read alone.", "Every chart has a source and makes a single point.", "Someone other than the author has checked each conclusion."] },
    ],
    review: [
      "Which hypothesis did the evidence kill, and what did you do with that slide?",
      "Pick any chart and walk me through it. What else could explain that pattern?",
      "What surprised you?",
    ],
    exercises: [
      { h: "Set up master files and naming", fit: "Every project", p: "One folder, one master copy, versioned file names. Thirty minutes now saves a day in week eleven." },
      { h: "Sanity-check every key number three ways", fit: "Every project", p: "Order of magnitude, break-even, and a second source. Cheap checks catch most errors. Write them in the appendix.", res: ["bulletproof"] },
      { h: "Write the one sentence each chart should leave behind", fit: "Every project", p: "That sentence becomes the slide title. If you cannot write it, the chart does not belong in the deck.", res: ["swd", "actionTitles"] },
      { h: "Give someone the devil's advocate hour", fit: "Every project", p: "One teammate spends an hour arguing the conclusions are wrong. Answer the strongest objections in the deck or list them as limits." },
      { h: "Second-reader every conclusion", fit: "Every project", p: "Nothing goes in the deck until someone who did not produce it has checked the logic and the source." },
      { h: "Preview the findings with the client", fit: "Every project", p: "Three or four slides, framed as \"here is what we are seeing, what are we missing?\" Record what they say.", res: ["listeners"] },
      { h: "Date a new version of Today's Answer", fit: "Every project", p: "Keep the earlier versions visible so the client can watch the thinking evolve." },
      { h: "Code the interviews by hypothesis", fit: "Projects with interviews", p: "Tag and count. A pattern in six of eight conversations is a finding. One vivid quote is not.", res: ["nngInterviews"] },
    ],
    learn: ["bulletproof", "swd", "nngInterviews"],
  },
  {
    num: 4, key: "gate4", stage: "recommend",
    title: "Build the recommendation",
    objective: "Turn findings into real options, choose with the client, and make the chosen path runnable.",
    duration: { mba: "2 weeks", emba: "2 weeks" },
    lead: "A finding is not a recommendation. The client does not need to hear that onboarding takes forty days. They need to know what to do about it, in what order, and what it will take. Gate 4 turns evidence into a decision they can make and a plan they can start on Monday.",
    settles: [
      "The options worth considering, and why the others were dropped",
      "Which one the client chose, and on what evidence",
      "What happens first, who owns it, and what it costs",
      "What could go wrong, and whether this survives six months",
    ],
    deliverables: [
      { name: "Options matrix", form: "One slide plus backup", what: "Four to six genuinely different options placed on impact against the client's capacity to do them, with the evidence behind each placement.", good: ["Options differ in kind, not by degree.", "Each placement cites a finding from Gate 3.", "The two or three you took to the client are marked, with their choice."] },
      { name: "Final deck", form: "Client-ready", what: "An answer-first summary, the recommendations with sequence, resources and risks, and an appendix that lets the client read the work without you in the room.", good: ["Problem to proof to prescription reads straight through without narration.", "Each recommendation says what to do, who does it, and by when.", "Another CSG team has reviewed it and you acted on the feedback."] },
      { name: "Implementation and risk plan", form: "Two or three slides", what: "The first ninety days, who champions it, budget and headcount, two or three measures, the main risks, and whether each recommendation survives after you leave.", good: ["A named client role owns each recommendation.", "The measures are few, specific and already trackable.", "Anything unlikely to last six months is flagged, not hidden."] },
    ],
    review: [
      "Pick a recommendation. Which finding does it rest on?",
      "What should the client do first, and why that first?",
      "Who inside the client owns this after you leave?",
    ],
    exercises: [
      { h: "Brainstorm wide before judging anything", fit: "Every project", p: "Forty-five minutes with IDEO's rules. Defer judgment, go for volume, then cluster into five or six options that truly differ.", res: ["ideo"] },
      { h: "Draw the lines from findings to options", fit: "Every project", p: "Findings on the left, options on the right, lines between. Options with no line get cut or parked." },
      { h: "Place the options on impact against capacity", fit: "Every project", p: "Will it solve the problem, and can this organization actually do it? Argue the placements as a team before showing the client.", res: ["decisionMatrix"] },
      { h: "Pre-mortem the leading option", fit: "Every project", p: "A year from now it failed. Why? The strongest answers become your risk slide.", res: ["premortem"] },
      { h: "Check sponsorship and sequence", fit: "Every project", p: "Who has to say yes, who has to change what they do, and in what order you are asking for it.", res: ["kotter"] },
      { h: "Design two or three measures per recommendation", fit: "Every project", p: "A baseline, a target, and a date to check. Say so if tracking it needs a system the client does not have.", res: ["scorecard"] },
      { h: "Apply the six-month test", fit: "Every project", p: "Does the client have the leader, skills, budget and systems to still be doing this in six months? Flag the ones where the honest answer is no." },
      { h: "Present to another CSG team", fit: "Every project", p: "Ask them to say the recommendation back to you. If they cannot, the story is not finished." },
      { h: "Read the titles aloud one last time", fit: "Every project", p: "Problem, proof, prescription, in that order, with no gaps.", res: ["actionTitles", "minto"] },
    ],
    learn: ["ideo", "decisionMatrix", "kotter", "scorecard"],
  },
  {
    num: 5, key: "gate5", stage: "retain",
    title: "Deliver and stay",
    objective: "Present so the client acts, leave them equipped to continue, and open the door to the next engagement.",
    duration: { mba: "2 weeks", emba: "2 weeks" },
    lead: "Three months of work ride on one hour in a room. Gate 5 is where the client decides whether to act, so the job here is to be useful. That means a presentation the room can follow, a document that stands up without you, and a clear handoff of who does what next. It is also where the next engagement starts.",
    settles: [
      "That the decision-makers heard the recommendation and understood it",
      "What the client does in the first ninety days, and who owns it",
      "When CSG follows up, and who makes that call",
      "What the next piece of work could be",
    ],
    deliverables: [
      { name: "Final presentation and leave-behind", form: "Live deck plus standalone deck", what: "The recommendation presented to the people who decide, plus a fuller deck with appendices that the client can read and circulate on their own.", good: ["You confirmed who would be in the room, and how senior, before the day.", "Someone outside the team read the leave-behind cold and could restate the recommendation.", "Both decks follow the CSG style guide and file naming."] },
      { name: "Next-steps memo", form: "One page", what: "The implementation keys and timeline, the measures to watch, who follows up at ninety days, and a proposal for the next logical engagement.", good: ["The ninety-day follow-up has a date and an owner on both sides.", "The next project is specific enough for someone to scope it."] },
      { name: "Close-out", form: "Checklist with evidence", what: "Testimonial and satisfaction survey requested, referrals recorded, thank-you book delivered, files archived, peer evaluations and reflections submitted.", good: ["Everything is in the team's Teams folder and nothing is in a personal drive.", "Each reflection names one thing the person would do differently."] },
    ],
    review: [
      "What did the sponsor say in the pre-wire, and what did you change?",
      "If the client does only one thing from this deck, what should it be?",
      "Who follows up in ninety days, and is it on their calendar?",
    ],
    exercises: [
      { h: "Pre-wire the sponsor two or three days out", fit: "Every project", p: "Walk them through the summary and the options you rejected. Ask who else will be in the room and what they care about.", res: ["advice"] },
      { h: "Rehearse the ten hardest questions", fit: "Every project", p: "A teammate plays the skeptic. Write the answer and the slide number that backs each one.", res: ["killerPresentation"] },
      { h: "Run a cold-read test on the leave-behind", fit: "Every project", p: "Give it to someone outside the project. Two minutes to explain it back. Fix whatever they got wrong." },
      { h: "Choose the thank-you book and sign the card", fit: "Every project", p: "Pick something that fits the client or the problem. Everyone signs. Deliver it at the final presentation." },
      { h: "Script the asks", fit: "Every project", p: "\"Would you write two sentences about the work?\" and \"Who else should we be talking to?\" Record the answers and any introductions offered." },
      { h: "Write the next-project one-pager", fit: "Every project", p: "The problem, why now, rough scope, what CSG would deliver. Leave it with the sponsor." },
      { h: "Hold a one-hour retrospective", fit: "Every project", p: "What worked, what did not, and what the next team should know. It feeds your reflections and the next version of this model.", res: ["edmondson"] },
    ],
    learn: ["killerPresentation", "duarteStory", "advice"],
  },
];

const HABITS = [
  {
    key: "roles", name: "Roles", full: "Team roles and responsibilities",
    lead: "A good process does not rescue a team that has not decided who does what. CSG teams use five working roles. One person can hold two, and they can rotate, but every role needs a name beside it from the first week.",
    roles: [
      ["Project Manager", "The workplan, the gate reviews and the stand-up. Keeps Today's Answer current."],
      ["Client Relationship Manager", "The meeting cadence, the agenda, and the client's experience of the team."],
      ["Deck Master", "The ghost deck and the story. Guards the template and the action titles."],
      ["Data Guru", "Data requests, the master files, and the sanity checks."],
      ["Devil's Advocate", "The questions nobody wants asked. Runs the challenge sessions at Gates 3 and 4."],
    ],
    byGate: [
      "Roles assigned, a standing meeting set, one team activity done, a short charter on how you will work.",
      "Everyone owns at least one hypothesis and can say how it feeds the answer.",
      "Work delivered on time, a second reader on every conclusion, and a challenge session held.",
      "Each person can point to their contribution. Dissent is recorded rather than suppressed. Disagreeing and committing is a skill.",
      "Peer evaluations, reflections and the retrospective are done.",
    ],
    learn: ["teams", "edmondson"],
  },
  {
    key: "client", name: "Relationship", full: "Trust-based client relationship",
    lead: "The client should never be surprised by anything they hear at the end. Trust gets built in the weekly meeting, by showing the current deck every time, and by telling the client what you are seeing while they can still shape it.",
    habits: [
      "Open every meeting with Today's Answer, then status, then what you need from them.",
      "Put a source on every slide. The client will check.",
      "Listen to understand rather than to reply. Ask one more question than feels natural.",
      "Know the client as a person: their background, what else is on their plate.",
      "Say early that this could be the first of several engagements.",
    ],
    byGate: [
      "A weekly meeting with a standing agenda. The problem statement read aloud to the sponsor.",
      "Ghost deck and workplan shared, their reaction recorded, data requests sent and chased politely.",
      "Preliminary findings previewed before anything is final, and their view on what is missing.",
      "Two or three options reviewed with the sponsor, and the final audience confirmed.",
      "Pre-wire, presentation, follow-up date, testimonial, referral.",
    ],
    learn: ["advice", "listeners"],
  },
  {
    key: "story", name: "Refine", full: "Refine the story and deliverable",
    lead: "The deck is not something you make at the end. It is the running record of the team's thinking, started in week one as a ghost deck and sharpened at every gate. If the story cannot be told from the slide titles alone, it is not finished.",
    habits: [
      "Every title is a sentence with a point. \"Overview\" is not a title.",
      "One idea per slide, one exhibit that proves it, a source line underneath.",
      "Lead with the answer. The room can always ask for the backup.",
      "Use the CSG template from the first draft, not the last.",
      "Read the titles aloud in order before every client meeting.",
    ],
    byGate: [
      "SCQA on one slide, the day-one answer written down, the final headline drafted.",
      "Ghost deck with action titles and sketched exhibits. The headline-only read passes.",
      "Real exhibits in place, titles revised to match the evidence, refuted material in the appendix.",
      "Problem, proof and prescription in an unbroken line. Reviewed by another team.",
      "The leave-behind reads cold. Style guide and file naming followed.",
    ],
    learn: ["minto", "actionTitles", "swd"],
  },
];

const PROCESS = {
  title: "How it works",
  lead: "Every CSG engagement runs the same arc. Four stages of work, with a gate between each one. A gate is a checkpoint rather than an exam. You show your faculty advisor what the team has worked out, talk it through for twenty to thirty minutes, and together decide whether the next stage can safely start.",

  whatIsGate: [
    "Gates sit where weak work would be expensive to carry forward. After the problem is defined, after the plan is set, after the analysis, after the recommendation, after delivery.",
    "Each gate lists what your team should have worked out by then. How you show it is up to you. One document that covers it well beats three that do not.",
    "What a good version looks like is written out for each item, and the questions a review might cover are published in advance.",
    "The exercises are a menu. Pick the ones that suit your project and skip the rest.",
    "There is no separate checklist. This is a guide to running the project, not a list of things to submit.",
  ],

  review: {
    Before: [
      "Share your work with your advisor at least a day ahead.",
      "Decide who presents what. Anyone on the team should be able to answer for the whole.",
      "Work through the gate's questions together. If you can all answer them, you are ready.",
    ],
    During: [
      "Twenty to thirty minutes. You walk through what you have worked out and your advisor asks whether it holds up.",
      "It is a working session. If a question exposes a gap, say so. Naming it counts in your favor.",
      "You leave with one of three outcomes: carry on, carry on with specific fixes, or revise and come back. None of them is a grade.",
    ],
    After: [
      "Write down what changed and why. Today's Answer should be dated and visible to the client.",
      "If you are revising, book the follow-up before you leave the room.",
      "Start the next stage. Nothing waits for a formal kickoff.",
    ],
  },

  rules: [
    ["Define before you research", "A week spent sharpening the question saves a month of analysis nobody can use."],
    ["Prune before you plan", "A team of five can test six to eight hypotheses well in three weeks. Pick those and park the rest."],
    ["Keep the hypothesis in front of you", "Start every working session by saying which hypothesis it serves. If the work serves none, stop."],
    ["Let the findings change the story", "When the evidence contradicts the ghost deck, the deck is what changes."],
    ["Show the client early and often", "Anything they see for the first time at the final presentation is a failure of the process, not of the work."],
  ],

  values: {
    lead: "CSG has four values, each expressed through two behaviors. They are not decoration on this process. They are how the work gets judged, in your reviews and by the client.",
    rows: [
      ["Christ-Centered", "Be teachable · Have integrity", "Ask for help early. Never present a number you have not checked yourself."],
      ["Accountable", "Take ownership · Be transparent", "Every workstream has a name on it, and the client hears bad news from you first."],
      ["People-Focused", "Collaborate · Practice empathy", "The quietest person on the team gets asked. The client's constraints are treated as real."],
      ["Professional", "Be resourceful · Think strategically", "When the data is not there, find a proxy. When the answer is obvious, say so and move on."],
    ],
  },

  faq: [
    ["Who reviews the gates?", "Whichever faculty advisor is assigned to your engagement, Paul or Troy. They are also the first call when the team is stuck between gates."],
    ["What if a suggested form does not fit our project?", "Say so before the gate rather than at it. Propose the equivalent that does fit, a decision tree in place of an issue tree for instance, and agree it with your advisor. The form can flex. What a reviewer needs to see cannot."],
    ["Do we have to do the exercises?", "No. Use the project-type filter on each gate page, and skip anything that would not change your answer."],
    ["Can we work ahead?", "Yes, as long as you do not skip a gate. Teams often start the ghost deck during Stage 1. What you cannot do is build Stage 3 analysis on a problem statement nobody has reviewed."],
    ["What if we are asked to revise?", "You revise and come back, usually within a few days. Catching it at a gate costs far less than discovering it three weeks later."],
    ["Where do the documents live?", "In your team's channel in Teams, under the folder structure you agreed at Gate 1, following CSG file naming. Never in a personal drive."],
  ],

  changed: [
    "Five gates with one set of numbers, matching across the slides and this site.",
    "A short list of what you should have at each gate, instead of 50 to 60 checklist items.",
    "Everything else became a menu of exercises, tagged by the kind of project it suits.",
    "What you should have sits at the top of each gate rather than the bottom.",
    "A library of vetted sources, so teams can learn a tool at the moment they need it.",
  ],
};

/* The AI prompt offered on each gate page. Built from that gate's own content,
   so it never goes stale. The client-data warning is required by CSG's AI policy. */
const AI_INTRO = {
  title: "Working with AI",
  lead: "Every gate page has a Copy AI prompt button. It puts a briefing on your clipboard that tells ChatGPT or Claude exactly what that gate requires, drawn from this site. Paste it into a new chat, fill in the two bracketed lines about your project, and edit it however you like.",
  rule: "Never paste client data into an AI tool. No documents, financials, interview notes or anything else the client gave you. CSG's NDAs are real obligations. Describe the situation in general terms instead.",
};
