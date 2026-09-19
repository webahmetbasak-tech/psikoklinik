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
  clinicName: 'Fatma Akbulut Psikolojik Danışmanlık ve Psikoterapi Merkezi',
  logo: { lineOne: 'FATMA', lead: 'psk.', lineTwo: 'AKBULUT' },
  psychologistName: 'Uzm. Klinik Psk. Fatma Akbulut',
  professionalTitle: 'Uzman Klinik Psikolog',
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
    stampCaption: 'Kütahya',
  },

  intro: {
    eyebrow: 'Uzman Klinik Psikolog — Kütahya',
    title: 'Fatma | *Akbulut*',
    subtitle: 'Psikolojik Danışmanlık | ve Psikoterapi Merkezi',
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
      'Merkezimizde çocuk, ergen, yetişkin ve çiftlerle çalışıyor; her süreci kişiye özel ilerletiyoruz. İlk görüşmede beklentilerinizi birlikte konuşur, size en uygun çalışma biçimini ve temposunu beraber belirleriz.',
    ],
  },

  therapist: {
    name: 'Fatma Akbulut',
    professionalTitle: 'Uzman Klinik Psikolog',
    image: { src: '', alt: 'Uzman Klinik Psikolog Fatma Akbulut' },
    shortStatement: 'Her hikâye, anlatılmayı hak eden bir sessizlik taşır.',
    bio: '2014 yılından bu yana çocuk, ergen, yetişkin ve çiftlerle çalışıyorum. Danışanlarıma bilimsel ve etik temellere dayalı bir yaklaşımla eşlik etmeyi esas alıyorum.',
    approach: 'Bilişsel Davranışçı Terapi, EMDR Terapisi, Evlilik ve Çift Terapisi ve Çözüm Odaklı Terapi.',
    philosophy: 'İyileşme, kişinin kendisiyle yeniden temas kurduğu yerde başlar.',
    qualifications: [
      'Psikoloji Lisans — Haliç Üniversitesi',
      'Klinik Psikoloji Yüksek Lisans — Beykoz Üniversitesi (3.95 / 4.00, Yüksek Onur)',
      'Psikolog — Kütahya Özel Park Hayat Hastanesi (2020–2023)',
      'Psikolog — Kütahya Su Özel Eğitim ve Rehabilitasyon Merkezi (2019–2020)',
    ],
    areasOfPractice: ['Kaygı', 'Depresyon', 'Travma', 'Evlilik ve ilişki', 'Öfke kontrolü', 'Çocuk ve ergen'],
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
      description: 'Bilişsel Davranışçı Terapi temelli, birebir seanslarla size özel ilerleyen bir süreç.',
      formats: ['online', 'yuz-yuze'],
      durationMinutes: 50,
      accent: 'green',
      image: 'hizmetler/bireysel-terapi.webp',
      keywords: ['depresyon', 'duygu durum', 'öfke', 'dürtü kontrol', 'özgüven', 'bireysel'],
    },
    {
      id: 'cift-terapisi',
      title: 'Evlilik ve Çift Terapisi',
      tagline: 'İki kişinin arasındaki alanı onarmak.',
      description: 'Evlilik problemleri, iletişim ve güven üzerine; hem bireysel hem çift olarak yürütülen çalışma.',
      formats: ['online', 'yuz-yuze'],
      durationMinutes: 75,
      accent: 'lilac',
      image: 'hizmetler/cift-ve-iliski-terapisi.webp',
      keywords: ['ilişki', 'evlilik', 'iletişim', 'aile', 'çift'],
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
      title: 'EMDR ve Travma Terapisi',
      tagline: 'Geçmişin yükünü hafifletmek.',
      description: 'Travma sonrası stres, kriz ve zorlayıcı deneyimlerin etkisini güvenli bir tempoda işlemeye yönelik çalışma.',
      formats: ['yuz-yuze'],
      durationMinutes: 60,
      accent: 'blue',
      image: 'hizmetler/emdr.webp',
      keywords: ['travma', 'emdr', 'tssb', 'kriz', 'kayıp', 'yas'],
    },
    {
      id: 'cozum-odakli-terapi',
      title: 'Çözüm Odaklı Terapi',
      tagline: 'Soruna değil, çıkış yoluna bakmak.',
      description: 'Kısa süreli, hedef odaklı danışmanlıkla güçlü yanlarınızdan yola çıkan çalışma.',
      formats: ['online', 'yuz-yuze'],
      durationMinutes: 50,
      accent: 'green',
      image: 'hizmetler/yasam-gecisleri.webp',
      keywords: ['çözüm odaklı', 'kısa süreli', 'hedef', 'değişim'],
    },
    {
      id: 'cocuk-terapisi',
      title: 'Çocuk ve Ergen Psikolojisi',
      tagline: 'Oyunla anlatılan duygular için.',
      description: 'Çocuğun dünyasına oyun ve yaratıcı etkinliklerle eşlik eden, aileyle birlikte yürüyen çalışma.',
      formats: ['yuz-yuze'],
      durationMinutes: 50,
      accent: 'orange',
      image: 'hizmetler/cocuk-terapisi.webp',
      keywords: ['çocuk', 'ergen', 'ayrılma kaygısı', 'okul', 'aile'],
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
    title: 'Eğitim ve deneyim',
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
    phone: '+90 850 474 03 65',
    // whatsapp / email: profilde yok — eklenince footer ve asistanda otomatik görünür.
    address: 'Alipaşa Mah. Lise Cad. Uysal İş Merkezi Kat: 5 D: 10',
    district: 'Merkez',
    city: 'Kütahya',
    country: 'TR',
    googleMapsUrl: 'https://maps.google.com/?q=39.4181124,29.9842042',
    geo: { lat: 39.4181124, lng: 29.9842042 },
    workingHours: [{ days: 'Görüşmeler', hours: 'Randevu ile' }],
  },

  social: {
    instagram: 'https://www.instagram.com/kutahyapsikolog.fatma',
  },

  aiAssistant: {
    enabled: true,
    name: 'Randevu Asistanı',
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
    title: 'Uzm. Klinik Psikolog Fatma Akbulut — Kütahya | EMDR, Bireysel ve Çift Terapisi',
    description:
      'Kütahya’da ve online olarak bireysel terapi, EMDR ve travma terapisi, evlilik ve çift terapisi, çocuk ve ergen psikolojisi. Kendiniz için bir adım atın.',
    keywords: ['Kütahya psikolog', 'klinik psikolog', 'EMDR', 'çift terapisi', 'online terapi', 'Fatma Akbulut'],
    ogImage: 'og-image.jpg',
    locale: 'tr_TR',
    schemaType: 'Psychologist',
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
