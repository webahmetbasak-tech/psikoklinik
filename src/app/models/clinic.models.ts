/**
 * Domain models for a clinic site. Every piece of clinic-specific data the UI
 * renders is described here and supplied by `config/clinic.config.ts`, so the
 * same codebase can be re-skinned for another practice by editing one file.
 *
 * Rich text fields accept `|` for a line break and `*text*` for a word that
 * receives a hand-drawn highlight (zig-zag or underline, depending on context).
 */

export interface ImageAsset {
  src: string;
  avif?: string;
  webp?: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface WorkingHour {
  days: string;
  hours: string;
}

export interface ContactInfo {
  phone: string;
  /** International format digits only, e.g. 905551112233 — used for wa.me links. Omit to hide WhatsApp. */
  whatsapp?: string;
  /** Omit to hide e-mail. */
  email?: string;
  address: string;
  district: string;
  city: string;
  postalCode?: string;
  country: string;
  googleMapsUrl: string;
  geo?: { lat: number; lng: number };
  workingHours: WorkingHour[];
}

export interface SocialLinks {
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  x?: string;
  facebook?: string;
}

export interface Therapist {
  name: string;
  professionalTitle: string;
  image: ImageAsset;
  shortStatement: string;
  bio: string;
  approach: string;
  philosophy: string;
  qualifications: string[];
  areasOfPractice: string[];
}

export interface SectionIllustrations {
  room: string;
  aboutAside: string;
  services: string;
  credentials: string;
  steps: string;
  /** Optional: leave out to keep the assistant column text-only. */
  ai?: string;
  booking: string;
}

export type AccentColor = 'green' | 'blue' | 'orange' | 'lilac';

export interface Service {
  id: string;
  title: string;
  tagline: string;
  description: string;
  formats: Array<'online' | 'yuz-yuze'>;
  durationMinutes?: number;
  /** Panel colour framing the card photo on the services wall. */
  accent: AccentColor;
  /** Photo under /public shown in the card's octagon panel (decorative). */
  image: string;
  /** Extra words that should match this service in the hero search. */
  keywords?: string[];
}

export interface AiAssistantConfig {
  enabled: boolean;
  name: string;
  intro: string;
  placeholder: string;
  suggestedQuestions: string[];
  disclaimer: string;
  emergencyMessage: string;
  emergencyNumbers: Array<{ label: string; number: string }>;
  endpoint?: string;
}

export interface ThemeConfig {
  colors: {
    background: string;
    surface: string;
    dark: string;
    graphite: string;
    accent: string;
    sage: string;
    gold: string;
    green: string;
    blue: string;
    lilac: string;
  };
  fonts: {
    serif: string;
    sans: string;
    stylesheetUrl: string;
  };
}

export interface HeroConfig {
  /** Question on the envelope card. `*word*` gets the green zig-zag. */
  searchTitle: string;
  searchPlaceholder: string;
  /** Question on the blue ticket card. */
  formatTitle: string;
  formatPlaceholder: string;
  formatOptions: string[];
  cta: string;
  /** Tiny caption printed on the postage stamp. */
  stampCaption: string;
}

export interface AboutSection {
  /** `*word*` gets a hand-drawn underline. */
  title: string;
  paragraphs: string[];
}

export interface ServicesSection {
  title: string;
  cta: string;
}

export interface StepsSection {
  /** `*word*` gets the green zig-zag. */
  title: string;
  steps: Array<{
    label: string;
    title: string;
    text: string;
    /** Line-art SVG under /public, coloured in on scroll. */
    illustration?: string;
    /** Or one of the built-in hand-drawn sketches (e.g. 'door'). */
    sketch?: 'door';
  }>;
  cta: string;
}

export interface CredentialsSection {
  title: string;
}

export interface AiSection {
  title: string;
  text: string;
}

export interface BookingSection {
  title: string;
  text: string;
  cta: string;
}

/** Editorial name lockup beside the room illustration. Falls back to clinicName. */
export interface IntroSection {
  /** Small uppercase line above the name. */
  eyebrow: string;
  /** Display name; rich text (`|` break, `*word*` underline). */
  title: string;
  /** Rest of the clinic name, set small under the title; `|` = line break. */
  subtitle: string;
}

export interface FooterConfig {
  slogan: string;
  contactTitle: string;
  clinicTitle: string;
  legalTitle: string;
  legalLinks: Array<{ label: string; href: string }>;
  credit?: string;
}

export interface SeoConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  locale: string;
  schemaType: 'Psychologist' | 'MedicalBusiness' | 'LocalBusiness';
  priceRange?: string;
}

export interface NavItem {
  label: string;
  /** Section anchor id. */
  target: string;
}

export interface ClinicConfig {
  clinicName: string;
  /** Two-line hand-lettered logo: first line large, second line with a small lead word. */
  logo: { lineOne: string; lead: string; lineTwo: string; image?: string };
  psychologistName: string;
  professionalTitle: string;
  websiteUrl: string;
  appointmentUrl: string;
  favicon: string;
  language: string;

  hero: HeroConfig;
  intro?: IntroSection;
  /** Line-art SVGs under /public, coloured in by a marker brush on scroll. */
  illustrations: SectionIllustrations;
  about: AboutSection;
  therapist: Therapist;
  servicesSection: ServicesSection;
  services: Service[];
  stepsSection: StepsSection;
  credentials: CredentialsSection;
  aiSection: AiSection;
  booking: BookingSection;
  contact: ContactInfo;
  social: SocialLinks;
  aiAssistant: AiAssistantConfig;
  navigation: NavItem[];
  headerCta: string;
  footer: FooterConfig;
  seo: SeoConfig;
  theme: ThemeConfig;
}
