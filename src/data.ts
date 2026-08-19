import {
  MemberInfo,
  NavLinkItem,
  SponsorGold,
  SponsorSilver,
  MentorLord,
  FaqItem,
  PillarItem,
  TimelineNode,
  PrizeTier,
  CategoryBounty,
  PirateRule,
} from './types';

export const TARGET_DATE_TIME = new Date('2026-10-24T09:00:00+05:30').getTime();

export const NAV_LINKS: readonly NavLinkItem[] = [
  { name: 'The Legend', href: '#about' },
  { name: 'Treasure Map', href: '#timeline' },
  { name: 'The Bounty', href: '#prizes' },
  { name: 'Pirate Code', href: '#rules' },
  { name: 'Allies & Lords', href: '#allies' },
  { name: 'Messages', href: '#faqs' },
] as const;

export const THEMATIC_PILLARS: readonly PillarItem[] = [
  {
    iconType: 'terminal',
    title: '24h Non-Stop Sprint',
    desc: 'Build raw ideas into deployed, battle-tested software prototypes under the pressure of the tide.',
  },
  {
    iconType: 'trophy',
    title: '₹1,00,000+ Bounty',
    desc: 'Cash bounties, sponsor API grants, hardware credits, and developer swags for the swiftest crews.',
  },
  {
    iconType: 'users',
    title: 'Pirate Lord Mentors',
    desc: 'Direct 1-on-1 technical steering from veteran engineers, startup founders, and DJSCE alumni.',
  },
  {
    iconType: 'coffee',
    title: 'Plentiful Rations',
    desc: 'Full catering, midnight snacks, caffeine brews, and energized resting lounges at DJSCE.',
  },
] as const;

export const TIMELINE_NODES: readonly TimelineNode[] = [
  {
    timeTag: '09:00 AM • DAY 1',
    title: 'Gates Open (Boarding the Ship)',
    desc: 'Crew check-in at DJSCE campus main port, identity credential verification, high-speed sea-net allocation, and welcoming rations.',
    iconType: 'ship',
    subIconType: 'check',
    subTitle: 'Harbor Check-in & Team Kit Distribution',
    subDesc: 'Receive your sailor badging, official swag pack, and station assignment.',
  },
  {
    timeTag: '11:00 AM • DAY 1',
    title: 'Hack Begins (Setting Sail)',
    desc: 'All ships cast off into open waters! 24-hour development chronometer officially starts. Ideate, architect, and start committing code.',
    iconType: 'compass',
    subIconType: 'flame',
    subTitle: 'Grand Keynote & Track Problem Release',
    subDesc: 'The battle horn sounds across Mumbai. Repositories initialize.',
  },
  {
    timeTag: '06:00 PM • DAY 1',
    title: 'Mentoring Round 1 (Navigating the Storm)',
    desc: 'Industry captains and mentor lords visit each deck. Pitch your architecture, resolve roadblocks, and pivot strategy before night falls.',
    iconType: 'skull',
    subIconType: 'users',
    subTitle: 'Code Review & Feasibility Calibrations',
    subDesc: 'Refine API integrations, UI mockups, and backend schemas with expert guidance.',
  },
  {
    timeTag: '12:00 AM • MIDNIGHT',
    title: "Midnight Mini-Events (The Kraken's Den)",
    desc: 'Take a breather from the keyboard storm. Engage in high-energy sea games, midnight feasts, and instant loot drops to recharge.',
    iconType: 'zap',
    subIconType: 'sparkles',
    subTitle: 'Midnight Pizza, Red Bull, & Pirate Duels',
    subDesc: 'Type-racer faceoffs, cryptic scavenger challenges, and spot bounties.',
  },
  {
    timeTag: '11:00 AM • DAY 2 (NEXT DAY)',
    title: 'Submission Deadline (Dropping Anchor)',
    desc: 'Hands off keyboards! Final Git commit freeze and project submission via portal. Captains assemble to demonstrate their triumphs to the judges.',
    iconType: 'anchor',
    subIconType: 'award',
    subTitle: 'Judges Evaluation & Award Ceremony',
    subDesc: 'Live 3-minute pitch sessions followed by the Grand Bounty proclamation.',
  },
] as const;

export const PRIZE_TIERS: readonly PrizeTier[] = [
  {
    place: '2nd Place',
    title: 'First Mates',
    bounty: '₹30,000',
    subtitle: '+ Swag Kits & Goodies',
    badge: 'Silver Crest',
    perks: [
      "Silver Captain's Plaque & Medals",
      'Official DJSCE Swag Box for all 4 crew',
      'Fast-Track Sponsor Interview Pool',
    ],
  },
  {
    place: '1st Place',
    title: 'Grand Fleet',
    bounty: '₹50,000',
    subtitle: '+ Sponsored APIs & Cloud Grants',
    badge: 'Supreme Champion',
    isPrimary: true,
    perks: [
      'The Golden Sovereign Trophy',
      '$5,000 in Sponsored AI & Cloud APIs',
      'Direct Fast-Track Interviews with TechCorsair',
      'Elite Sailor Badges & Certificates of Valor',
    ],
  },
  {
    place: '3rd Place',
    title: 'Quartermasters',
    bounty: '₹20,000',
    subtitle: 'Direct Cash Prize',
    badge: 'Bronze Anchor',
    perks: [
      'Bronze Quartermaster Trophy',
      'Premium Software Subscriptions',
      'Certificates of Distinction',
    ],
  },
] as const;

export const CATEGORY_BOUNTIES: readonly CategoryBounty[] = [
  {
    title: 'Best Fresher Crew',
    reward: '₹5,000 + Starter Hardware Toolkits for 1st-year navigators.',
  },
  {
    title: 'Best UI/UX Seacraft',
    reward: '₹5,000 + Design Guild Mentorship for the cleanest aesthetic.',
  },
  {
    title: 'Most Disruptive AI Innovation',
    reward: '₹5,000 + Cloud AI API Grant Package.',
  },
] as const;

export const PIRATE_RULES: readonly PirateRule[] = [
  {
    numeral: 'I',
    title: 'Maximum 4 crew members per ship.',
    desc: 'Teams may comprise between 1 and 4 sailors. You may form cross-department or cross-college crews so long as all members are registered under the same ship manifest.',
  },
  {
    numeral: 'II',
    title: 'All code must be written during the 24 hours (no buried treasure from past projects).',
    desc: 'Every line of code, design asset, and architecture must be forged fresh after the 11:00 AM bell. Open-source libraries, standard boilerplate, and public APIs are permitted, but preexisting finished repositories are strictly forbidden.',
  },
  {
    numeral: 'III',
    title: 'Open to all engineering undergraduates.',
    desc: 'All students currently enrolled in recognized B.E. / B.Tech engineering programs across colleges are welcome. Bring your valid college sailor ID for onboard harbor entry.',
  },
] as const;

export const VOYAGE_TRACKS: readonly string[] = [
  'AI & Autonomous Navigation (Machine Learning / LLMs)',
  'Web3 & Pirate Ledgers (Blockchain & Smart Contracts)',
  'Full-Stack Island Systems (Cloud & Microservices)',
  'Cyber Fortresses (Defensive & Offensive Security)',
  'Open Ocean Discovery (Innovation Track)',
] as const;

export const DEFAULT_MEMBERS: readonly MemberInfo[] = [
  {
    roleTitle: 'Captain (Fleet Commander)',
    badge: 'Captain',
    name: '',
    email: '',
    phone: '',
    rollNo: '',
    specialty: 'Lead Architect & Full-Stack',
  },
  {
    roleTitle: 'First Mate & Navigator',
    badge: 'Navigator',
    name: '',
    email: '',
    phone: '',
    rollNo: '',
    specialty: 'Frontend & UI/UX Seacraft',
  },
  {
    roleTitle: 'Quartermaster & Helmsman',
    badge: 'Quartermaster',
    name: '',
    email: '',
    phone: '',
    rollNo: '',
    specialty: 'Backend & Distributed Systems',
  },
  {
    roleTitle: 'Master Gunner & Deckhand',
    badge: 'Master Gunner',
    name: '',
    email: '',
    phone: '',
    rollNo: '',
    specialty: 'AI, Data & Security Protocols',
  },
] as const;

export const GOLD_SPONSORS: readonly SponsorGold[] = [
  { name: 'TechCorsair', tagline: 'Next-Gen Cloud Infrastructure', perk: '₹25,000 API Credits' },
  { name: 'DevOcean', tagline: 'Distributed Database Systems', perk: 'Fast-Track Hiring' },
  { name: 'KrakenCloud', tagline: 'Scalable Container Fleets', perk: 'Compute Clusters' },
  { name: 'AnchorByte', tagline: 'Autonomous AI Protocols', perk: 'API Sovereign Pass' },
] as const;

export const SILVER_SPONSORS: readonly SponsorSilver[] = [
  { name: 'Nautilus AI', spec: 'Model Inference' },
  { name: 'BlackPearl API', spec: 'Payment Gateway' },
  { name: 'CompassWorks', spec: 'Design Systems' },
  { name: 'SirenSec', spec: 'Code Fortification' },
] as const;

export const MENTOR_LORDS: readonly MentorLord[] = [
  {
    name: 'Capt. Vikram Shenoy',
    role: 'Staff Systems Architect',
    fleet: 'TechCorsair Guild',
    track: 'Distributed Core & High Load',
  },
  {
    name: 'Lord Ananya Deshmukh',
    role: 'Principal AI Engineer',
    fleet: 'DevOcean Labs',
    track: 'LLMs & Cognitive Navigation',
  },
  {
    name: 'First Mate Rohan Mehta',
    role: 'VP of Engineering',
    fleet: 'KrakenCloud Services',
    track: 'Cloud Native & Edge Ops',
  },
  {
    name: 'Navigator Priya Iyer',
    role: 'Head of Product Design',
    fleet: 'AnchorByte Guild',
    track: 'Interactive UX & Visual Design',
  },
] as const;

export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    q: 'Do I need to know how to code?',
    a: 'Yes, but beginners are welcome! We have dedicated mentoring tracks and starter kits to help deckhands build their first full-stack projects alongside seasoned sailors.',
  },
  {
    q: 'Is food provided?',
    a: 'Plentiful rations and caffeine will be supplied to all sailors! Complete breakfast, lunch, dinner, midnight pizza, energy drinks, and unlimited tea/coffee are on the house throughout the 24 hours.',
  },
  {
    q: 'Is there a registration fee?',
    a: 'No, the voyage is completely free. Code of the Caribbean charges zero registration or entry fees for shortlisted teams.',
  },
  {
    q: 'What should my crew bring onboard to DJSCE?',
    a: 'Each sailor should bring their laptop, chargers, extension cords, valid college identification card, personal hygiene essentials, and an insatiable desire to build!',
  },
  {
    q: 'Are overnight accommodations available at DJSCE campus?',
    a: 'Yes, secure snooze lounges, resting rooms, and round-the-clock campus security are active so sailors can take rest during the 24-hour sprint.',
  },
  {
    q: 'How are teams formed if I do not have a full crew yet?',
    a: 'You can register as a solo sailor or duo; our official Discord guild features a "Crew Matchmaking" channel to help you recruit remaining mates before sail date.',
  },
] as const;
