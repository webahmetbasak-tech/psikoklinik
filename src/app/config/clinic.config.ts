import { InjectionToken } from '@angular/core';
import { ClinicConfig } from '../models/clinic.models';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  THE ONLY FILE YOU NEED TO EDIT FOR A NEW CLINIC.
 *  Header, every section, footer, AI assistant, SEO, structured data, browser
 *  title, favicon and theme colors all read from this object.
 *
 *  Rich text: `|` = line break, `*word*` = hand-drawn highlight.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const CLINIC_CONFIG_DATA: ClinicConfig = {
  clinicName: 'Alan Psikoterapi',
  logo: { lineOne: 'ALAN', lead: 'psk', lineTwo: 'TERAPİ' },
  psychologistName: 'Uzm. Psk. Deniz Aydın',
  professionalTitle: 'Klinik Psikolog & Psikoterapist',
  websiteUrl: 'https://www.example.com',
  /** A section anchor ("#ai-randevu") or an external booking url. */
  appointmentUrl: '#ai-randevu',
  favicon: 'favicon.svg',
  language: 'tr',

  hero: {
    searchTitle: 'Hangi konuda *destek* arıyorsunuz?',
    searchPlaceholder: 'örn. Kaygı',
    formatTitle: 'Nasıl görüşmek istersiniz?',
    formatPlaceholder: 'örn. Online',
    formatOptions: ['Online', 'Yüz yüze'],
    cta: 'Randevu Oluştur',
    stampCaption: 'Nişantaşı',
  },

  illustrations: {
    room: 'hero/b.svg',
    aboutAside: 'hero/f.svg',
    services: 'hero/c.svg',
    credentials: 'hero/g.svg',
    steps: 'hero/z.svg',
    booking: 'hero/a.svg',
  },

  about: {
    title: 'Dinlenmek için bir alan. | *Değişmek için bir yol.*',
    paragraphs: [
      'Zorlandığınız dönemlerde kendinize ayıracağınız zaman bir lüks değil, bir ihtiyaçtır. Terapi; yargılanmadan konuşabileceğiniz, düşüncelerinizi sıraya koyabileceğiniz güvenli bir ortam sunar.',
      'Kliniğimizde her süreç kişiye özel ilerler. İlk görüşmede beklentilerinizi birlikte konuşur, size en uygun çalışma biçimini ve temposunu beraber belirleriz.',
    ],
  },

  therapist: {
    name: 'Deniz Aydın',
    professionalTitle: 'Uzman Klinik Psikolog',
    image: { src: '', alt: 'Uzman Klinik Psikolog Deniz Aydın' },
    shortStatement: 'Her hikâye, anlatılmayı hak eden bir sessizlik taşır.',
    bio: 'On iki yıldır bireysel ve çift terapisi alanında çalışıyorum. Danışanlarımla, acele etmeden ve merakla ilerleyen bir ilişki kurmayı önemsiyorum.',
    approach: 'Bilişsel Davranışçı Terapi, Şema Terapi ve Kabul-Kararlılık Terapisi temelli bütüncül yaklaşım.',
    philosophy: 'İyileşme, kişinin kendisiyle yeniden temas kurduğu yerde başlar.',
    qualifications: [
      'Klinik Psikoloji Yüksek Lisans — Hacettepe Üniversitesi',
      'Şema Terapi Sertifika Programı',
      'EMDR I. ve II. Düzey Eğitimi',
      'Türk Psikologlar Derneği Üyesi',
    ],
    areasOfPractice: ['Kaygı', 'Depresyon', 'İlişki sorunları', 'Travma', 'Yaşam geçişleri', 'Özgüven'],
  },

  servicesSection: {
    title: 'Size uygun | çalışma alanları',
    cta: 'Asistana sorun',
  },

  services: [
    {
      id: 'bireysel-terapi',
      title: 'Bireysel Terapi',
      tagline: 'Kendi sesinizi yeniden duymak için.',
      description: 'Haftalık, 50 dakikalık birebir seanslarla size özel ilerleyen bir süreç.',
      formats: ['online', 'yuz-yuze'],
      durationMinutes: 50,
      accent: 'green',
      image: 'hizmetler/bireysel-terapi.webp',
      keywords: ['depresyon', 'özgüven', 'yalnızlık', 'bireysel'],
    },
    {
      id: 'cift-terapisi',
      title: 'Çift ve İlişki Terapisi',
      tagline: 'İki kişinin arasındaki alanı onarmak.',
      description: 'İletişim, güven ve bağlanma örüntüleri üzerine birlikte çalışma.',
      formats: ['online', 'yuz-yuze'],
      durationMinutes: 75,
      accent: 'lilac',
      image: 'hizmetler/cift-ve-iliski-terapisi.webp',
      keywords: ['ilişki', 'evlilik', 'ayrılık', 'çift'],
    },
    {
      id: 'kaygi-ve-stres',
      title: 'Kaygı ve Stres',
      tagline: 'Zihnin hızını yavaşlatmak.',
      description: 'Kaygının bedendeki ve düşüncedeki izlerini fark etmeye yönelik yapılandırılmış çalışma.',
      formats: ['online', 'yuz-yuze'],
      durationMinutes: 50,
      accent: 'orange',
      image: 'hizmetler/kaygi-ve-stres.webp',
      keywords: ['kaygı', 'anksiyete', 'panik', 'stres', 'uyku'],
    },
    {
      id: 'travma',
      title: 'Travma ve EMDR',
      tagline: 'Geçmişin yükünü hafifletmek.',
      description: 'Zorlayıcı deneyimlerin etkisini güvenli bir tempoda işlemeye yönelik çalışma.',
      formats: ['yuz-yuze'],
      durationMinutes: 60,
      accent: 'blue',
      image: 'hizmetler/emdr.webp',
      keywords: ['travma', 'emdr', 'kayıp', 'yas'],
    },
    {
      id: 'yasam-gecisleri',
      title: 'Yaşam Geçişleri',
      tagline: 'Bir dönemden diğerine, acele etmeden.',
      description: 'Taşınma, kariyer değişimi, ebeveynlik gibi eşik anlarında destek.',
      formats: ['online', 'yuz-yuze'],
      durationMinutes: 50,
      accent: 'green',
      image: 'hizmetler/yasam-gecisleri.webp',
      keywords: ['kariyer', 'taşınma', 'ebeveynlik', 'değişim'],
    },
    {
      id: 'cocuk-terapisi',
      title: 'Çocuk Terapisi',
      tagline: 'Oyunla anlatılan duygular için.',
      description: 'Çocuğun dünyasına oyun ve yaratıcı etkinliklerle eşlik eden, aileyle birlikte yürüyen çalışma.',
      formats: ['yuz-yuze'],
      durationMinutes: 50,
      accent: 'orange',
      image: 'hizmetler/cocuk-terapisi.webp',
      keywords: ['çocuk', 'ergen', 'oyun terapisi', 'okul', 'aile'],
    },
    {
      id: 'online-terapi',
      title: 'Online Terapi',
      tagline: 'Mesafe, yakınlığa engel değil.',
      description: 'Güvenli görüntülü görüşme ile bulunduğunuz yerden seans.',
      formats: ['online'],
      durationMinutes: 50,
      accent: 'lilac',
      image: 'hizmetler/online-terapi.webp',
      keywords: ['online', 'uzaktan', 'görüntülü'],
    },
  ],

  stepsSection: {
    title: 'Terapiye *nasıl* | başlanır?',
    steps: [
      {
        label: 'Adım 1',
        title: 'Konunuzu seçin',
        text: 'Destek almak istediğiniz alanı ve size uygun görüşme biçimini seçin.',
        illustration: 'hero/r.svg',
      },
      {
        label: 'Adım 2',
        title: 'Ön görüşme yapalım',
        text: 'Kısa bir telefon görüşmesiyle beklentilerinizi dinleyip sorularınızı yanıtlayalım.',
        sketch: 'door',
      },
      {
        label: 'Adım 3',
        title: 'İlk seansınız',
        text: 'Size uygun gün ve saatte, online ya da klinikte ilk seansınızı planlayalım.',
        illustration: 'hero/d.svg',
      },
    ],
    cta: 'Randevu Oluştur',
  },

  credentials: {
    title: 'Eğitim ve üyelikler',
  },

  aiSection: {
    title: 'Aklınıza takılan | bir şey mi var?',
    text: 'Hizmetler, seans süreci, ücretler ve randevu hakkında sorularınızı asistanımıza sorabilirsiniz.',
  },

  booking: {
    title: 'Kendiniz için | *bir adım* atın',
    text: 'İlk görüşme, sürecin size uygun olup olmadığını birlikte değerlendirdiğimiz sakin bir tanışmadır. Hazır olduğunuzda buradayız.',
    cta: 'Randevu Oluştur',
  },

  contact: {
    phone: '+90 212 555 01 23',
    whatsapp: '905325550123',
    email: 'merhaba@example.com',
    address: 'Teşvikiye Mah. Örnek Sok. No: 12 D: 4',
    district: 'Nişantaşı, Şişli',
    city: 'İstanbul',
    postalCode: '34365',
    country: 'TR',
    googleMapsUrl: 'https://maps.google.com/?q=Nişantaşı+İstanbul',
    geo: { lat: 41.0522, lng: 28.9937 },
    workingHours: [
      { days: 'Pazartesi — Cuma', hours: '10:00 — 20:00' },
      { days: 'Cumartesi', hours: '10:00 — 16:00' },
    ],
  },

  social: {
    instagram: 'https://instagram.com/example',
    linkedin: 'https://linkedin.com/in/example',
    youtube: 'https://youtube.com/@example',
  },

  aiAssistant: {
    enabled: true,
    name: 'Alan Asistan',
    intro:
      'Merhaba. Hizmetler, seans süreci ve randevu hakkında sorularınızı yanıtlayabilirim. Ben bir psikolog değilim; tanı koymam veya terapi yerine geçmem.',
    placeholder: 'Bir soru yazın…',
    suggestedQuestions: [
      'İlk kez terapiye başlayacağım. Nereden başlamalıyım?',
      'Online seanslar nasıl işliyor?',
      'Seans ücreti ve süresi nedir?',
      'Kliniğin adresi nerede?',
    ],
    disclaimer: 'Bu asistan bilgilendirme ve randevu amaçlıdır; klinik değerlendirme, tanı veya tedavi sunmaz.',
    emergencyMessage:
      'Kendinize ya da bir başkasına zarar verme düşünceniz varsa lütfen hemen acil yardım alın. Yalnız değilsiniz.',
    emergencyNumbers: [{ label: 'Acil Çağrı Merkezi', number: '112' }],
    endpoint: '',
  },

  navigation: [
    { label: 'Hakkımızda', target: 'hakkimizda' },
    { label: 'Hizmetler', target: 'hizmetler' },
    { label: 'Süreç', target: 'surec' },
    { label: 'Sorular', target: 'ai-randevu' },
  ],
  headerCta: 'Randevu Oluştur',

  footer: {
    slogan: 'Güvenli bir alan. | Kalıcı bir değişim.',
    contactTitle: 'İletişim',
    clinicTitle: 'Klinik',
    legalTitle: 'Yasal',
    legalLinks: [
      { label: 'KVKK Aydınlatma Metni', href: '#' },
      { label: 'Gizlilik Politikası', href: '#' },
      { label: 'Çerez Politikası', href: '#' },
    ],
  },

  seo: {
    title: 'Alan Psikoterapi — Nişantaşı, İstanbul | Bireysel ve Çift Terapisi',
    description:
      'Nişantaşı’nda ve online olarak bireysel terapi, çift terapisi, kaygı ve stres çalışmaları. Kendiniz için bir adım atın.',
    keywords: ['psikolog', 'psikoterapi', 'çift terapisi', 'online terapi', 'Nişantaşı psikolog'],
    ogImage: 'og-image.jpg',
    locale: 'tr_TR',
    schemaType: 'Psychologist',
    priceRange: '₺₺₺',
  },

  theme: {
    colors: {
      background: '#EDEAE1',
      surface: '#F6F4EE',
      dark: '#2A2A2A',
      graphite: '#2A2A2A',
      accent: '#F9622F',
      sage: '#8FA588',
      gold: '#C9A96E',
      green: '#00C476',
      blue: '#3881F1',
      lilac: '#D7BFF2',
    },
    fonts: {
      serif: "'Figtree', 'Helvetica Neue', Arial, sans-serif",
      sans: "'Figtree', 'Helvetica Neue', Arial, sans-serif",
      stylesheetUrl: 'https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600&display=swap',
    },
  },
};

export const CLINIC_CONFIG = new InjectionToken<ClinicConfig>('CLINIC_CONFIG', {
  providedIn: 'root',
  factory: () => CLINIC_CONFIG_DATA,
});
