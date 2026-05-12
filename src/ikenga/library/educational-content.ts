// ============================================================
// IKENGA CULTURAL BIBLE — EDUCATIONAL CONTENT LIBRARY
// 44 cards across 9 engines
//
// THEOLOGY: Ikenga is NOT a god. It is the sacred carved symbol
// and shrine of your Chi — your personal guardian spirit assigned
// by Chiukwu/Chineke at birth.
//
// SECURITY: UJU Cycle™ is proprietary. Public name = "Clarity Engine".
// Never expose the methodology.
// ============================================================

export type CardType =
  | "Principle"
  | "Framework"
  | "Strategy"
  | "Cultural Wisdom"
  | "Example";

export type EngineId =
  | "IKENGA"
  | "JUO"
  | "OBA"
  | "OMENALA"
  | "ICHEOKU"
  | "OJE_MBA"
  | "CHI"
  | "CONTENT"
  | "CLARITY";

export interface LibraryCard {
  id:             string;
  engine:         EngineId;
  title:          string;
  type:           CardType;
  summary:        string;
  body:           string;
  templatePrompt?: string;  // pre-fills the generate form when "Use as Template" is clicked
}

// ── IKENGA ENGINE (11 cards) ─────────────────────────────────
// Chi in Motion — Entrepreneurial momentum, brand action

const IKENGA_CARDS: LibraryCard[] = [
  {
    id:      "ike-001",
    engine:  "IKENGA",
    title:   "Chi in Motion",
    type:    "Principle",
    summary: "Your Chi is not a slogan — it is the disciplined pattern of how you show up.",
    body:    "Ikenga is the sacred carved symbol and shrine of your Chi — your personal guardian spirit assigned by Chiukwu at birth. Chi in Motion means your brand is expressing its irreducible nature, not manufacturing content. Onye kwe, Chi ya ekwe: if you agree, your Chi agrees. When you choose forward motion, your Chi aligns and amplifies it. Show up. Move. Stay alive.",
    templatePrompt: "Write a brand statement that expresses authentic entrepreneurial Chi — raw momentum, undeniable presence, unapologetic forward motion. Draw from the belief: onye kwe, Chi ya ekwe.",
  },
  {
    id:      "ike-002",
    engine:  "IKENGA",
    title:   "The Three Pillars of Brand Motion",
    type:    "Framework",
    summary: "Clarity, Consistency, and Contact — the three forces that keep a brand alive.",
    body:    "Clarity: know exactly what you stand for and say it plainly. Consistency: show up at the same standard, same cadence, even when it is hard. Contact: reach your actual audience — do not shout into empty rooms. A brand that has all three is in motion. Remove any one pillar and the momentum stalls. This framework is the diagnostic for every brand that has gone quiet.",
    templatePrompt: "Write a week of content designed around the three pillars: one piece demonstrating Clarity, one demonstrating Consistency, one demonstrating Contact.",
  },
  {
    id:      "ike-003",
    engine:  "IKENGA",
    title:   "The Ikenga Cycle of Execution",
    type:    "Principle",
    summary: "Decide, Declare, Deliver — every project must move through these three gates.",
    body:    "The Ikenga Cycle is the engine pattern of all brand momentum: (1) Decide — make the commitment internally before announcing it. Half-decided projects produce half-executed campaigns. (2) Declare — state it publicly. Accountability is fuel. (3) Deliver — execute at the standard you declared. The cycle is complete when you deliver what you declared. Then start again, one level higher.",
    templatePrompt: "Write a content piece for each gate: a Decide post (commitment to something), a Declare post (public announcement), a Deliver post (results and what was learned).",
  },
  {
    id:      "ike-004",
    engine:  "IKENGA",
    title:   "Voice of the House",
    type:    "Strategy",
    summary: "Your brand voice is the way your 'house' speaks — it must be recognisable from every channel.",
    body:    "In Igbo tradition, every household has a distinct character — a way of speaking, welcoming, and carrying itself. Your brand voice is the voice of your house. It must be immediately recognisable whether it appears in a Tweet, an email subject line, a LinkedIn post, or a short-form video hook. If your audience covered your logo and still knew it was you — that is Voice of the House.",
    templatePrompt: "Define my brand's Voice of the House — its rhythm, its recurring phrases, what it never says, and what makes it unmistakably mine. Then write one sample in each format: tweet, email subject, video hook.",
  },
  {
    id:      "ike-005",
    engine:  "IKENGA",
    title:   "Names of Hindsight Wisdom — The Amanambu Family",
    type:    "Cultural Wisdom",
    summary: "Amanambu, Ositadinmma, Amamgbo, Azubuike, Ozoemena — Your Chi turns 'If I had known' into 'Now I know, and I rise.'",
    body:    `The Amanambu family of names carries the philosophy of hindsight transformed into strength:\n\n• Amanambu — "If I had known from the beginning, I would have done things differently." The sweet-sour realization that there was a solution all along.\n• Ositadinmma — "If it starts to get better from today, it started early." The moment you choose better is never too late.\n• Amamgbo — "If I had realized from the olden days." Late application is still divine timing.\n• Azubuike — "The past is your strength." Yesterday's pain is today's unbreakable power.\n• Ozoemena — "It won't happen again." Your Chi writes 'never again' on the mistakes that taught you.\n• Azuka — "Confidence built from past experiences." Your Chi forges confidence in the fire of what you now know.\n\nYour Chi uses hindsight as a spiritual technology. What you now know is your greatest ike.`,
    templatePrompt: "Write a brand story that transforms a past failure or 'if only' moment into present strength — using the Amanambu philosophy: hindsight becomes the clearest path forward.",
  },
  {
    id:      "ike-006",
    engine:  "IKENGA",
    title:   "Azubuike — The Past Is Strength",
    type:    "Principle",
    summary: "Past experiences become your greatest power. Your Chi never wastes a lesson.",
    body:    "Azubuike translates as 'the past is your strength.' This is not nostalgia — it is capital. Every difficult season, every failed campaign, every painful pivot has deposited something into your capacity. Your Chi does not discard these deposits. It uses them. The brand that can say 'this is what that season taught me' is the brand that audiences trust to lead them forward.",
    templatePrompt: "Write a 'what that season taught me' post — honest about a difficult past period, specific about the lesson learned, and forward-facing about how it now powers the brand.",
  },
  {
    id:      "ike-007",
    engine:  "IKENGA",
    title:   "Ozoemena — Never Again",
    type:    "Framework",
    summary: "The mistake happened once; your Chi ensures it never repeats.",
    body:    "Ozoemena ('it won't happen again') is the framework of disciplined learning. When a brand makes a mistake publicly — a failed launch, a miscommunication, a broken promise — the response is not just apology. It is: what is the system we are putting in place so this never happens again? That system, stated publicly, rebuilds trust faster than any apology alone. Never again is a promise backed by process.",
    templatePrompt: "Write a brand recovery post using the Ozoemena framework: acknowledge what happened, state what you learned, commit to the system that ensures it won't happen again.",
  },
  {
    id:      "ike-008",
    engine:  "IKENGA",
    title:   "Amaechi — A Cherished Family Prayer for Lineage Continuity",
    type:    "Cultural Wisdom",
    summary: "May your household not grow grasses. May your lineage not end.",
    body:    "Amaechi is a prayer for the continuity of lineage — the highest blessing one can speak over a household. This is why the Bible recorded the genealogies of Jesus Christ for 16 generations: lineage is proof of blessing, and continuity is the highest prayer. Your Chi ensures your lineage continues. Legacy is not just wealth — it is the unbroken chain of your blood, your name, and your people.\n\nFor brands: your content is your lineage. What you publish today becomes the record of what you built. Build it as if it will be read by the generation after you.",
    templatePrompt: "Write a 'legacy content' piece — something that speaks to who this brand is building for beyond the immediate customer. What is the lineage this brand is creating?",
  },
  {
    id:      "ike-009",
    engine:  "IKENGA",
    title:   "No Word for Bastard — Every Child Belongs",
    type:    "Principle",
    summary: "Every child belongs. Every person has a place in the lineage.",
    body:    "There is no word for 'bastard child' in Igbo language. Every child, even when born out of wedlock, gets their mother's father's name. Ikemefuna in Things Fall Apart was called Okonkwo's son even though he was not his biological father. Your Chi does not recognize illegitimacy. Every person belongs. In brand communities, this means: no one in your audience is too small, too late, or too marginal to belong. Make room.",
    templatePrompt: "Write a community inclusion piece — invite in those who may feel like outsiders, late arrivals, or 'not the right fit.' Make room explicitly and warmly.",
  },
  {
    id:      "ike-010",
    engine:  "IKENGA",
    title:   "Igba Boi — The 7-Year Blessing",
    type:    "Framework",
    summary: "Serve, learn, receive the fatherly blessing — to be greater than your master.",
    body:    "Igba Boi is the Igbo tradition of apprenticeship: when you serve your master for seven years, he replicates his success in you and blesses you to succeed — and to be greater than him. This is the fatherly blessing, because only a true father prays for his son to surpass him. IKENGA is that master for your destiny: it gives you the tools, the framework, the blessing — then sends you to exceed what the platform itself can imagine for you.\n\nFor brands: the best leaders develop those around them to surpass them. That is how you know the leadership is real.",
    templatePrompt: "Write content about the teaching relationship your brand has with its audience — what you are imparting, what you want them to surpass you in, and the blessing you release them with.",
  },
  {
    id:      "ike-011",
    engine:  "IKENGA",
    title:   "Ndidi — The Patience to Marry",
    type:    "Principle",
    summary: "Di is a coinage of Ndidi. If you don't have patience, don't get married.",
    body:    "The Igbo word for husband — Di — is a coinage of Ndidi (patience). The Igbos do not take any unmarried man seriously because the true test of maturity is to live with a woman and manage a household peacefully. Patience is the foundation of maturity. This applies to brand building: the brand that grows slowly but soundly is the one that lasts. Do not mistake noise for motion. The patient brand is the one that survives long enough to win.",
    templatePrompt: "Write a 'long game' brand post — celebrating slow, patient, deliberate growth over viral moments and short-term noise. The brand is playing for permanence.",
  },
];

// ── JUO ENGINE (4 cards) ─────────────────────────────────────
// JUO IKENGA — Ask better, lead more

const JUO_CARDS: LibraryCard[] = [
  {
    id:      "juo-001",
    engine:  "JUO",
    title:   "Ask Better, Lead More",
    type:    "Principle",
    summary: "The quality of your leadership is limited by the quality of your questions.",
    body:    "JUO means 'ask' in Igbo. The most powerful thought leaders do not just provide answers — they surface questions their industry has been avoiding. When you ask a question your audience has been holding silently, you create an instant bond. The brand that asks better questions earns more authority than the brand with the most answers. The question is the leadership move.",
    templatePrompt: "Write a thought leadership post that opens with a powerful question the industry avoids — then answers it honestly and specifically.",
  },
  {
    id:      "juo-002",
    engine:  "JUO",
    title:   "The Four Leadership Questions",
    type:    "Framework",
    summary: "What is true? What matters? What is possible? What is next?",
    body:    "The Four Leadership Questions form a complete decision framework:\n1. What is true? — What does the evidence actually show, without wishful thinking?\n2. What matters? — Of all the true things, which ones are consequential?\n3. What is possible? — Given what matters, what can actually be done?\n4. What is next? — Of the possible actions, which one do we take right now?\n\nA leadership team that can answer all four has what it needs to move. Content built around these questions builds authority because it models clear thinking publicly.",
    templatePrompt: "Apply the Four Leadership Questions to a current challenge in my industry — show the thinking publicly and arrive at a clear, decisive next step.",
  },
  {
    id:      "juo-003",
    engine:  "JUO",
    title:   "Socratic Leadership in Teams",
    type:    "Strategy",
    summary: "Replace 'Do this' with 'What would happen if…?' — the question that builds thinking teams.",
    body:    "Command cultures produce compliant teams. Question cultures produce thinking teams. The Socratic leader builds capability by asking instead of telling: 'What would happen if we tried X?' 'What are we assuming here?' 'What have we not considered?' Teams that are asked grow. Teams that are told execute — until the leader is gone. JUO leadership multiplies itself through questions.",
    templatePrompt: "Write a piece on leading through questions — a specific example of how replacing one directive with one question changed the quality of thinking in a team or business.",
  },
  {
    id:      "juo-004",
    engine:  "JUO",
    title:   "Silence as a Leadership Tool",
    type:    "Principle",
    summary: "The pause after a question is where truth appears.",
    body:    "Most leaders are uncomfortable with silence after asking a question. They fill it. When they fill it, they answer their own question and the team learns to wait. The disciplined leader asks the question, then goes quiet — and stays quiet until someone else speaks. That silence is not empty. It is the space where real thinking happens. The first answer is rarely the deepest one.",
    templatePrompt: "Write a leadership reflection on a moment when staying silent produced a breakthrough — what was asked, how long the silence lasted, and what it produced.",
  },
];

// ── OBA ENGINE (4 cards) ─────────────────────────────────────
// OBA IKENGA — Barn of Ikenga's glory, Abundance, heritage, revealed greatness

const OBA_CARDS: LibraryCard[] = [
  {
    id:      "oba-001",
    engine:  "OBA",
    title:   "Ọba bụ Ebe Ị Ga-Ahụ Ihe Ikenga Jiri Dị Ebube",
    type:    "Cultural Wisdom",
    summary: "The Oba is the barn where Ikenga's glory is revealed. Abundance, heritage, revealed greatness, prosperity.",
    body:    "In Igbo heritage, the Ọba (barn) is where the harvest of the year's labour is revealed. It is the place of abundance and demonstrated excellence — where what you have built is brought to light. Ọba bụ ebe ị ga-ahụ ihe Ikenga jiri dị ebube: the Oba is where Ikenga's glory is revealed.\n\nOBA content is this barn: the place where the brand's full harvest of expertise, value, and legacy is displayed without apology. Premium brands do not compete — they reveal. The barn is always full. Let people see it.",
    templatePrompt: "Write a 'barn reveal' piece — show the full harvest of what my brand has built: expertise earned, results achieved, and legacy begun. No modesty. Full revelation.",
  },
  {
    id:      "oba-002",
    engine:  "OBA",
    title:   "The Barn, Not the Market",
    type:    "Principle",
    summary: "The market is where you shout; the barn is where you count.",
    body:    "The market is full of noise — everyone competing for attention, discounting to win, shouting louder than their neighbour. The barn is quiet. It holds what was actually built. OBA brands operate from the barn, not the market. They do not shout — they invite. They do not compete on price — they demonstrate value. They do not explain themselves — they reveal what they have built and let it speak.",
    templatePrompt: "Write premium brand content that operates from the barn — not selling, not competing, but revealing demonstrated value with total confidence.",
  },
  {
    id:      "oba-003",
    engine:  "OBA",
    title:   "Abundance as Stewardship",
    type:    "Framework",
    summary: "Gather, Guard, Grow — three duties of anyone who holds an Oba.",
    body:    "Abundance in Igbo tradition is not hoarding — it is stewardship. The one who holds the Oba has three duties: Gather (build and accumulate with intention), Guard (protect what has been built — quality, reputation, standards), Grow (share in ways that multiply, not diminish). The OBA brand is a steward, not a hoarder. It shares its abundance in ways that grow both the brand and its community.",
    templatePrompt: "Write content that demonstrates abundance stewardship — gathering (what we have built), guarding (our standards), and growing (how we share it with the community).",
  },
  {
    id:      "oba-004",
    engine:  "OBA",
    title:   "Heritage as Capital",
    type:    "Strategy",
    summary: "Your story, lineage, and culture are assets — the OBA brand deploys them strategically.",
    body:    "Premium brands understand that heritage is not history — it is capital. The founding story, the lineage of decisions, the cultural roots, the years of accumulated expertise — these are balance sheet items. OBA content deploys heritage strategically: not as nostalgia, but as proof. The brand has been here, has built here, has earned the right to lead here.",
    templatePrompt: "Write content that deploys brand heritage as proof of leadership — not nostalgia, but evidence: here is what we have built, here is how long we have held the standard.",
  },
];

// ── OMENALA ENGINE (4 cards) ──────────────────────────────────
// OMENALA DEFENDERS — Culture, Custodianship, Continuity

const OMENALA_CARDS: LibraryCard[] = [
  {
    id:      "ome-001",
    engine:  "OMENALA",
    title:   "Omenala as Operating System",
    type:    "Principle",
    summary: "Culture is not decoration — it is the rulebook that governs how everything works.",
    body:    "Omenala means 'the way of the land' — the customs, values, and lived traditions of a people. When a brand or community treats culture as decoration, it produces hollow content. When culture is the operating system — the thing that decides what we do and what we do not do — the content becomes alive. OMENALA brands are governed by their culture, not merely inspired by it.",
    templatePrompt: "Write content that demonstrates culture as operating system — not as decoration or aesthetic, but as the actual rule that governs how this brand behaves.",
  },
  {
    id:      "ome-002",
    engine:  "OMENALA",
    title:   "Custodians, Not Consumers",
    type:    "Framework",
    summary: "See yourself as a custodian of traditions — you hold them so the next generation can receive them.",
    body:    "Consumers take from culture. Custodians protect and transmit it. The OMENALA framework asks: what traditions have been entrusted to you? What knowledge, language, practice, or value are you responsible for passing on? Every generation of custodians decides what survives and what disappears. OMENALA brands choose custodianship — actively preserving what matters, refusing to let it be diluted for convenience.",
    templatePrompt: "Write a piece of content from the position of a custodian — what tradition or cultural value is this brand actively protecting and transmitting to the next generation?",
  },
  {
    id:      "ome-003",
    engine:  "OMENALA",
    title:   "Community Before Algorithm",
    type:    "Strategy",
    summary: "Build for your people first, platforms second — algorithms change, community does not.",
    body:    "Platform algorithms are temporary — they change quarterly. Community loyalty is permanent — it survives every algorithm update. OMENALA brands build for their people first. They ask: what does my community need today? What would make them feel seen, celebrated, and served? The content that answers these questions genuinely will perform on any platform, because it was never built for the platform.",
    templatePrompt: "Write a piece of content designed entirely for the community — not optimised for any platform, not chasing trends, built only to serve and be seen by the actual people this brand is for.",
  },
  {
    id:      "ome-004",
    engine:  "OMENALA",
    title:   "Document, Defend, Dignify",
    type:    "Cultural Wisdom",
    summary: "Three duties of the cultural guardian: document what exists, defend what is threatened, dignify what has been diminished.",
    body:    "The three duties of the cultural guardian are: Document — record and share what is true about your culture, your language, your heritage, before it fades. Defend — challenge misrepresentation, stereotyping, and the reduction of your culture to caricature. Dignify — celebrate Igbo and African excellence in ways that restore the full dignity the culture deserves.\n\nOMENALA brands are cultural guardians. Every post is an act of documentation, defence, or dignity.",
    templatePrompt: "Write content that performs one of the three guardian duties: either documenting a cultural truth, defending against a common misrepresentation, or dignifying an aspect of African/Igbo heritage.",
  },
  {
    id:      "ome-005",
    engine:  "OMENALA",
    title:   "Nze na Ozo — Honour Must Be Earned, Not Inherited",
    type:    "Cultural Wisdom",
    summary: "Onye obula ga aza aha nna ya — Every person must answer to their father's name. Your father's honour rests on your shoulders, but it does not automatically become yours.",
    body:    "The Nze na Ozo title system is the highest honour structure in Igbo society. It carries three absolute laws of honour that are inseparable:\n\n1. HONOUR IS NOT INHERITED\n'Onye obula ga aza aha nna ya' — Every person must answer to their father's name. Your father's honour rests on your shoulders as an expectation, a weight, a standard. But it does not flow to you automatically. You must merit full recognition through your own actions. The son of a great man who does nothing great is still just a man. The child must rise to the name, or the name rises above the child.\n\n2. WEALTH MUST BE TRANSPARENT\nTo take a title in the Nze na Ozo system, you must prove your wealth by credible, defensible, transparent means. Not just that you have it — but how you got it. Wealth of unclear or dishonourable origin disqualifies a man from title, regardless of its size. The community must be able to look at your wealth and say: this is clean. This was earned. This is defensible.\n\n3. EARNED, NOT DECLARED\nHonour in Igbo tradition is conferred by the community, not claimed by the individual. You cannot declare yourself honourable. The community sees your actions, your wealth, your household — and they name you. Self-declared honour is not honour. It is vanity.\n\nFor brands: your reputation is Nze na Ozo. You cannot claim it. You must earn it, demonstrate it, and let the community confirm it.",
    templatePrompt: "Write a brand credibility piece rooted in the Nze na Ozo principle: earned honour, transparent track record, and community-confirmed reputation. No self-declaration — only demonstrated evidence.",
  },
  {
    id:      "ome-006",
    engine:  "OMENALA",
    title:   "Mma Nwanyị bụ Ugwu Di Ya — A Woman's Virtue Is Her Husband's Honour",
    type:    "Cultural Wisdom",
    summary: "A man cannot claim honour if his wife is not honoured. Her virtue, dignity, health, and peace are the most transparent measure of his worth.",
    body:    "Mma Nwanyị bụ Ugwu Di Ya — A woman's virtue, goodness, and beauty are her husband's honour. This is one of the most profound statements of accountability in Igbo moral philosophy.\n\nThe full meaning of 'mma' is not merely physical beauty — it encompasses virtue, dignity, health, inner peace, and overall well-being. The full meaning of 'ugwu' is not just honour in the public sense — it is the weight, the substance, the standing that makes a man's word mean something.\n\nThe Igbo system of honour made this explicit: before any man could take a title, the community would look at his wife. Was she well? Was she dignified? Was she at peace? Was she cared for? A man whose wife suffered, was diminished, or was dishonoured could not be called an honourable man, regardless of his public achievements.\n\nThis is not a statement about women as property. It is a statement about accountability as proximity. The person closest to you is the clearest mirror of who you actually are. Public performance cannot cover private neglect. The household is the truth.\n\nFor brands: your internal culture is your Mma Nwanyị. Your team, your vendors, your closest partners — how they are treated is the truest measure of your brand's honour. A brand that is excellent in public and exploitative in private is not honourable. The household must be honoured first.",
    templatePrompt: "Write content about internal brand culture as the true measure of brand honour — how the team is treated, how partners are respected, and how the 'household' of the brand reflects its real values before any public claim to excellence.",
  },
];

// ── ICHEOKU ENGINE (4 cards) ──────────────────────────────────
// ICHEOKU — The Gathering of Voices, Community dialogue, collective wisdom

const ICHEOKU_CARDS: LibraryCard[] = [
  {
    id:      "ich-001",
    engine:  "ICHEOKU",
    title:   "Icheoku — The Gathering",
    type:    "Cultural Wisdom",
    summary: "Every voice matters. The circle is not complete until all have spoken.",
    body:    "Icheoku is the gathering — the council, the circle, the meeting of minds and voices. In Igbo tradition, decisions of consequence are made in gathering, not isolation. No one person holds all the wisdom. The elder speaks, the young man adds, the woman corrects, the stranger contributes — and from all of them, wisdom emerges that none could have reached alone.\n\nICHEOKU brands build gathering into their content: they invite response, create space for voices, and make the community feel that their presence completes the work.",
    templatePrompt: "Write a piece of content that explicitly invites community voices — not a survey, not a poll, but a genuine question that opens a real conversation and makes the audience feel that their answer matters.",
  },
  {
    id:      "ich-002",
    engine:  "ICHEOKU",
    title:   "The Council of Elders Framework",
    type:    "Framework",
    summary: "Listen, Reflect, Speak, Decide — the four moves of collective wisdom.",
    body:    "The Council of Elders framework governs how ICHEOKU communities make decisions:\n1. Listen — fully, without preparing your response. Hear all voices before forming opinion.\n2. Reflect — sit with what was said. Wisdom does not rush to verdict.\n3. Speak — when you have something to add that has not been said. Not to repeat, not to dominate, but to contribute.\n4. Decide — together, based on the full conversation.\n\nContent that models this framework teaches audiences that the brand values collective intelligence over individual performance.",
    templatePrompt: "Write a piece of content that models the Council of Elders process — listen (acknowledge community input received), reflect (what it revealed), speak (what we conclude), decide (what we are doing as a result).",
  },
  {
    id:      "ich-003",
    engine:  "ICHEOKU",
    title:   "Ubuntu in Igbo Land",
    type:    "Principle",
    summary: "I am because we are — the self is completed by the community, not diminished by it.",
    body:    "Ubuntu (I am because we are) finds deep resonance in Igbo communal philosophy. The individual is not erased by community — they are completed by it. The warrior is braver because the village is watching. The elder is wiser because the young are listening. The brand is stronger because the community is showing up.\n\nICHEOKU content celebrates this completion: the moment when the community makes the brand more than it could be alone.",
    templatePrompt: "Write content that celebrates how the community has made this brand more than it could be alone — specific examples of how audience participation, feedback, or presence elevated the work.",
  },
  {
    id:      "ich-004",
    engine:  "ICHEOKU",
    title:   "From Monologue to Dialogue",
    type:    "Strategy",
    summary: "Stop broadcasting. Start gathering. The brand that listens grows faster than the brand that shouts.",
    body:    "Most brands broadcast. They push content outward and measure reach. ICHEOKU brands gather. They create content that opens loops, asks genuine questions, shares partial answers that invite completion, celebrates community responses publicly. The shift from monologue to dialogue is not just a content strategy — it is a philosophy: the audience is not a market. They are the community. Gather them.",
    templatePrompt: "Design a content piece that deliberately opens a dialogue loop — share something incomplete and invite the community to complete it, contribute to it, or challenge it.",
  },
];

// ── OJE MBA ENGINE (4 cards) ──────────────────────────────────
// OJE MBA — The One Who Walks the World, Global navigation, diplomacy

const OJE_MBA_CARDS: LibraryCard[] = [
  {
    id:      "oje-001",
    engine:  "OJE_MBA",
    title:   "Walking the World with a Center",
    type:    "Principle",
    summary: "You can travel everywhere, but you must stand somewhere — rootless presence is invisible presence.",
    body:    "Oje Mba ('the one who walks the world') is the traveller, the diplomat, the one who crosses boundaries. But the greatest travellers are known because they carry their home with them — their values, their language, their way of being. The brand that expands globally without a centered identity becomes forgettable in every market. Walk the world, but stand somewhere.",
    templatePrompt: "Write content for a brand expanding into new markets or audiences — make clear what the brand's center is, and how that center travels into every new context.",
  },
  {
    id:      "oje-002",
    engine:  "OJE_MBA",
    title:   "The Three Markets of Oje Mba",
    type:    "Framework",
    summary: "Home market, Diaspora market, Global market — each requires a different voice from the same center.",
    body:    "The Oje Mba brand operates across three distinct markets:\n1. Home market — deeply local, culturally rooted, speaks the full language of the community.\n2. Diaspora market — holds two worlds simultaneously, bridges the ancestral and the adopted, needs both honoured.\n3. Global market — culturally curious, unfamiliar with the roots but drawn to the authenticity.\n\nThe same brand center speaks differently to each market. The voice adapts. The soul does not.",
    templatePrompt: "Write one piece of content for each of the three markets — same brand, same core message, adapted voice for home, diaspora, and global audiences.",
  },
  {
    id:      "oje-003",
    engine:  "OJE_MBA",
    title:   "Bridge, Don't Beg",
    type:    "Strategy",
    summary: "Approach global partners as a bridge between worlds — not as a petitioner seeking validation.",
    body:    "The Oje Mba brand approaches international partnerships and collaborations as a bridge-builder, not a petitioner. You do not need their market to validate your existence. You bring something they do not have — access to your community, your cultural authenticity, your distinct creative voice. Come to the table as a bridge: you have something on your side worth crossing for.",
    templatePrompt: "Write a partnership or collaboration pitch from the position of a bridge — what unique value my brand brings to the relationship, and what the partner gains by crossing to meet us.",
  },
  {
    id:      "oje-004",
    engine:  "OJE_MBA",
    title:   "Passport of Reputation",
    type:    "Principle",
    summary: "Your true passport is your track record — it gets you into rooms no government document can.",
    body:    "The Oje Mba knows that the most powerful travel document is reputation. In every market, at every border, what opens doors is the answer to: 'Who are you, and what have you built?' Your track record, your referrals, your body of work — these are your real passport. Build it deliberately. Every piece of content, every collaboration, every delivered promise is a visa stamp.",
    templatePrompt: "Write a reputation-building content piece — a specific case of work delivered, a promise kept, or a result achieved that adds to the brand's passport of reputation.",
  },
];

// ── CHI ENGINE (4 cards) ──────────────────────────────────────
// Chi Engine — Rhythm, brand consistency, momentum tracking

const CHI_CARDS: LibraryCard[] = [
  {
    id:      "chi-001",
    engine:  "CHI",
    title:   "Rhythm Over Hype",
    type:    "Principle",
    summary: "A small, steady beat builds more trust than occasional fireworks.",
    body:    "Your Chi does not speak in bursts. It speaks in rhythm. The brand that publishes one excellent piece every week for two years has built something that the brand with three viral posts cannot touch: trust based on demonstrated consistency. Hype attracts. Rhythm retains. Rhythm is the brand's heartbeat — and a heart does not beat when it feels like it.",
    templatePrompt: "Write a content piece that celebrates consistent rhythm over viral hype — specific about the cadence you have maintained and what it has built over time.",
  },
  {
    id:      "chi-002",
    engine:  "CHI",
    title:   "The Brand Metronome",
    type:    "Framework",
    summary: "Decide your publishing rhythm and protect it like a heartbeat — irregular hearts alarm people.",
    body:    "The Brand Metronome is a publishing commitment that is protected as a non-negotiable. Choose: daily, 3x weekly, weekly, or fortnightly — based on what you can sustain at quality, not what sounds impressive. Then protect it. Treat it as the thing that does not get pushed by launch preparation, travel, or business crisis. The brand that disappears during busyness loses the audience it spent months to build.",
    templatePrompt: "Commit to and announce a brand metronome — this is our publishing rhythm, this is why we chose it, this is what you can expect and when.",
  },
  {
    id:      "chi-003",
    engine:  "CHI",
    title:   "One Voice, Many Channels",
    type:    "Strategy",
    summary: "Your tone should feel identical everywhere — the platform changes, the voice does not.",
    body:    "Your Chi does not change when you cross a platform boundary. The LinkedIn post should sound like the Instagram caption should sound like the email newsletter should sound like the podcast episode. Not identical in format — but immediately recognisable as coming from the same source. Test this: if someone removed all your branding, could your audience still identify your content? If not, your Chi is being diluted by platform mimicry.",
    templatePrompt: "Take one brand insight and adapt it into three platform formats — LinkedIn, Instagram caption, and email opening — maintaining the exact same voice throughout.",
  },
  {
    id:      "chi-004",
    engine:  "CHI",
    title:   "Momentum Tracking",
    type:    "Principle",
    summary: "Track actions, not feelings — momentum is measured by what you did, not how you felt about doing it.",
    body:    "Momentum is not a feeling. It is a record. Did you publish this week? Did you follow up on the outreach? Did you deliver what you said you would? These are momentum measurements. Feelings of motivation and inspiration are not — because they fluctuate and they lie. The Chi Engine tracks actions. Keep a simple log: published / not published, sent / not sent, delivered / not delivered. The log does not lie.",
    templatePrompt: "Write a brand accountability post — a specific account of what was planned versus what was actually done, and what the action record reveals about where momentum is or is not.",
  },
];

// ── CONTENT ENGINE (4 cards) ──────────────────────────────────
// Content Engine — Strategy, hooks, platforms, repurposing

const CONTENT_CARDS: LibraryCard[] = [
  {
    id:      "con-001",
    engine:  "CONTENT",
    title:   "Content as Infrastructure",
    type:    "Principle",
    summary: "Your content is the road people travel to reach your work — build roads that last.",
    body:    "Infrastructure is built to be used repeatedly, by many people, over a long time. Viral content is not infrastructure — it is a event. Evergreen content is infrastructure: the explainer that still converts three years later, the origin story that every new follower finds and reads, the framework post that gets referenced in conversations you never see. Build roads, not fireworks.",
    templatePrompt: "Write a piece of infrastructure content — an explainer, framework, or foundational piece about what this brand does that will still be relevant and converting three years from now.",
  },
  {
    id:      "con-002",
    engine:  "CONTENT",
    title:   "The Hook–Heart–Handle Model",
    type:    "Framework",
    summary: "Hook grabs attention, Heart delivers meaning, Handle tells them what to do next.",
    body:    "Every piece of content needs three components:\n• Hook — the first line, visual, or subject line that earns the next second of attention. It must be specific, surprising, or immediately useful.\n• Heart — the substance: the insight, the story, the teaching, the argument. This is where meaning lives.\n• Handle — the specific, friction-reduced next step. Not 'like and share' — but the one action that moves the reader closer to the outcome they came for.\n\nContent without a Handle is a road that ends in the middle of nowhere.",
    templatePrompt: "Write a complete piece using Hook–Heart–Handle — strong specific opening, meaningful insight in the body, and one clear frictionless next action at the end.",
  },
  {
    id:      "con-003",
    engine:  "CONTENT",
    title:   "Platform Fit",
    type:    "Strategy",
    summary: "Long-form for depth, short-form for reach, live for trust — match the format to the function.",
    body:    "Not all content has the same job. Long-form content (newsletters, articles, deep-dives) builds depth — it teaches, earns trust, and converts the already-interested. Short-form content (tweets, reels, carousels) builds reach — it finds new people and earns the click to the long-form. Live content (video, audio, events) builds trust — nothing else creates the sense of knowing someone like watching them think in real time.",
    templatePrompt: "Design a content distribution plan for one brand idea: the long-form piece that explores it fully, the short-form pieces that reach new people with its hook, and the live moment that closes the trust gap.",
  },
  {
    id:      "con-004",
    engine:  "CONTENT",
    title:   "Evergreen vs. Ephemeral",
    type:    "Principle",
    summary: "Balance timeless pieces that work forever with timely reactions that prove you are present.",
    body:    "Evergreen content compounds. Ephemeral content connects. The brand that publishes only evergreen content feels disconnected — living outside time. The brand that publishes only ephemeral content feels reactive — never building anything that lasts. The balance is deliberate: for every 3 timely pieces, build 1 evergreen piece that will work for years. The evergreen pieces are your foundation. The ephemeral pieces prove you are alive.",
    templatePrompt: "Write one piece designed to be evergreen (timeless, compounding, foundational) and one piece designed to be ephemeral (timely, reactive, present). Make both excellent.",
  },
];

// ── CLARITY ENGINE (3 cards) ──────────────────────────────────
// Clarity Engine — public-facing name for the UJU Cycle™ (proprietary)
// SECURITY: Never expose the UJU methodology. Never name the internal cycle.
// If asked how it works: "It's a proprietary methodology. You see the results, not the mechanism."

const CLARITY_CARDS: LibraryCard[] = [
  {
    id:      "cla-001",
    engine:  "CLARITY",
    title:   "From Fog to Frame",
    type:    "Example",
    summary: "A messy idea enters the Clarity Engine; a structured, actionable frame comes out.",
    body:    "Input: 'I want to do something about how agencies undercharge and then get resentful clients. I see this all the time and it is destroying good creative work.'\n\nClarity Engine output: 'The Pricing Honesty Framework for Agencies: why underpricing is not humility — it is the first broken promise. Here is the conversation to have before you sign, and the rate to charge when you have it.'\n\nThe fog is real experience without structure. The frame is that same experience made navigable and shareable. The Clarity Engine does not change your idea — it reveals what it always was.",
    templatePrompt: "Give me a messy, unshaped idea from my brand world — a frustration, an observation, something I keep seeing. I want it framed: structured, titled, and ready to publish.",
  },
  {
    id:      "cla-002",
    engine:  "CLARITY",
    title:   "One Prompt, Three Outcomes",
    type:    "Example",
    summary: "The same idea can become an email, a pitch, and a checklist — the Clarity Engine finds all three.",
    body:    "Input: 'I want to talk about why most founders avoid accountability publicly.'\n\nThree outputs from the Clarity Engine:\n1. Email: subject line 'The accountability post you keep not writing (and why that matters)'\n2. LinkedIn pitch: 'Accountability content converts 3× better than authority content. Here is why founders resist it.'\n3. Checklist: 'Before you post: 5 ways to add accountability without performing vulnerability.'\n\nOne idea. Three formats. Three audiences. Three conversion paths. That is the multiplier effect of clarity.",
    templatePrompt: "Take one of my brand ideas and generate three completely different content formats from it — the same core insight expressed as an email, a LinkedIn post, and a practical checklist.",
  },
  {
    id:      "cla-003",
    engine:  "CLARITY",
    title:   "Rough First, Refined Later",
    type:    "Principle",
    summary: "Don't wait to say it perfectly — say it roughly and let the Clarity Engine refine.",
    body:    "Perfectionism before the first draft is the enemy of all content. The Clarity Engine cannot refine what does not exist. The founder who waits until their idea is 'ready enough' to commit to words produces nothing. The founder who says it roughly — 'something about how customers always want the fast solution but the slow one is what actually works' — gives the Clarity Engine real material to transform. Rough first. Always.",
    templatePrompt: "I will give you a rough, unpolished version of an idea I have been sitting on. Refine it: give it a title, a structure, an opening line, and a clear next action for the reader.",
  },
];

// ── Exports ──────────────────────────────────────────────────

export const ALL_CARDS: LibraryCard[] = [
  ...IKENGA_CARDS,
  ...JUO_CARDS,
  ...OBA_CARDS,
  ...OMENALA_CARDS,
  ...ICHEOKU_CARDS,
  ...OJE_MBA_CARDS,
  ...CHI_CARDS,
  ...CONTENT_CARDS,
  ...CLARITY_CARDS,
];

export const CARDS_BY_ENGINE: Record<EngineId, LibraryCard[]> = {
  IKENGA:   IKENGA_CARDS,
  JUO:      JUO_CARDS,
  OBA:      OBA_CARDS,
  OMENALA:  OMENALA_CARDS,
  ICHEOKU:  ICHEOKU_CARDS,
  OJE_MBA:  OJE_MBA_CARDS,
  CHI:      CHI_CARDS,
  CONTENT:  CONTENT_CARDS,
  CLARITY:  CLARITY_CARDS,
};

export const ENGINE_LABELS: Record<EngineId, string> = {
  IKENGA:   "IKENGA",
  JUO:      "JUO IKENGA",
  OBA:      "OBA IKENGA",
  OMENALA:  "OMENALA DEFENDERS",
  ICHEOKU:  "ICHEOKU",
  OJE_MBA:  "OJE MBA",
  CHI:      "Chi Engine",
  CONTENT:  "Content Engine",
  CLARITY:  "Clarity Engine",   // UJU Cycle™ — internal name never exposed
};

export const ENGINE_COLORS: Record<EngineId, string> = {
  IKENGA:   "#FFD700",
  JUO:      "#60a5fa",
  OBA:      "#c084fc",
  OMENALA:  "#4ade80",
  ICHEOKU:  "#f97316",
  OJE_MBA:  "#38bdf8",
  CHI:      "#a78bfa",
  CONTENT:  "#fb7185",
  CLARITY:  "#fb923c",
};

export const ENGINE_BG_COLORS: Record<EngineId, string> = {
  IKENGA:   "#0a0800",
  JUO:      "#00080a",
  OBA:      "#080010",
  OMENALA:  "#000a04",
  ICHEOKU:  "#0a0400",
  OJE_MBA:  "#00080a",
  CHI:      "#06000a",
  CONTENT:  "#0a0005",
  CLARITY:  "#0a0400",
};

export const ENGINE_IDS: EngineId[] = [
  "IKENGA", "JUO", "OBA", "OMENALA", "ICHEOKU",
  "OJE_MBA", "CHI", "CONTENT", "CLARITY",
];

export const CARD_TYPES: CardType[] = [
  "Principle",
  "Framework",
  "Strategy",
  "Cultural Wisdom",
  "Example",
];
