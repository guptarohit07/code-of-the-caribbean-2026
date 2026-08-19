export interface MemberInfo {
  roleTitle: string;
  badge: string;
  name: string;
  email: string;
  phone: string;
  rollNo: string;
  specialty: string;
}

export interface RegistrationFormState {
  shipName: string;
  college: string;
  crewSize: number;
  voyageTrack: string;
  members: MemberInfo[];
}

export interface NavLinkItem {
  name: string;
  href: string;
}

export interface PillarItem {
  iconType: 'terminal' | 'trophy' | 'users' | 'coffee';
  title: string;
  desc: string;
}

export interface TimelineNode {
  timeTag: string;
  title: string;
  desc: string;
  iconType: 'ship' | 'compass' | 'skull' | 'zap' | 'anchor';
  subIconType: 'check' | 'flame' | 'users' | 'sparkles' | 'award';
  subTitle: string;
  subDesc: string;
}

export interface PrizeTier {
  place: string;
  title: string;
  bounty: string;
  subtitle: string;
  badge: string;
  perks: string[];
  isPrimary?: boolean;
}

export interface CategoryBounty {
  title: string;
  reward: string;
}

export interface PirateRule {
  numeral: string;
  title: string;
  desc: string;
}

export interface SponsorGold {
  name: string;
  tagline: string;
  perk: string;
}

export interface SponsorSilver {
  name: string;
  spec: string;
}

export interface MentorLord {
  name: string;
  role: string;
  fleet: string;
  track: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export type ThemeMode = 'dark' | 'light';
