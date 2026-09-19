import { ClinicConfig } from '../../models/clinic.models';

export interface AssistantMessage {
  role: 'assistant' | 'user';
  text: string;
  options?: string[];
  links?: Array<{ label: string; href: string; primary?: boolean }>;
  emergency?: boolean;
}

const norm = (s: string) =>
  s.toLocaleLowerCase('tr').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ı/g, 'i');

const has = (text: string, words: string[]) => words.some((w) => text.includes(norm(w)));

const EMERGENCY = [
  'intihar', 'kendimi oldur', 'olmek istiyorum', 'canima kiy', 'yasamak istemiyorum',
  'kendime zarar', 'zarar vermek', 'hayatima son',
];
const DIAGNOSIS = ['tani koy', 'teshis', 'hastaligim', 'depresyonda miyim', 'bende ne var', 'ilac'];

export const CONTINUE_OPTION = 'Randevuya Devam Et';

/**
 * Scripted, config-driven assistant. It only informs and routes to booking —
 * never diagnoses, never offers treatment, always escalates emergencies.
 * A backend (`aiAssistant.endpoint`) can replace `reply` later without
 * changing the UI contract.
 */
export class AssistantEngine {
  private chosen: string[] = [];

  constructor(private readonly config: ClinicConfig) {}

  greeting(): AssistantMessage {
    return { role: 'assistant', text: this.config.aiAssistant.intro, options: this.config.aiAssistant.suggestedQuestions };
  }

  reply(input: string): AssistantMessage {
    const c = this.config;
    const t = norm(input);
    const contact = c.contact;

    if (has(t, EMERGENCY)) {
      return {
        role: 'assistant',
        emergency: true,
        text: c.aiAssistant.emergencyMessage,
        links: c.aiAssistant.emergencyNumbers.map((n) => ({
          label: `${n.label} — ${n.number}`,
          href: `tel:${n.number}`,
          primary: true,
        })),
      };
    }

    if (has(t, DIAGNOSIS)) {
      return {
        role: 'assistant',
        text: 'Tanı koymam ya da klinik değerlendirme yapmam mümkün değil; bunu ancak bir uzman, görüşme sırasında yapabilir. İsterseniz sizin için uygun bir ilk görüşme planlayalım.',
        options: [CONTINUE_OPTION],
      };
    }

    if (input === CONTINUE_OPTION || has(t, ['randevu'])) {
      const detail = this.chosen.length ? ` (${this.chosen.join(', ')})` : '';
      const message = encodeURIComponent(`Merhaba, ${c.clinicName} için randevu almak istiyorum${detail}.`);
      return {
        role: 'assistant',
        text: contact.whatsapp
          ? `Harika. Randevu talebinizi WhatsApp veya telefon ile iletebilirsiniz; ekibimiz size uygun saatleri paylaşacaktır.`
          : `Harika. Randevu talebinizi telefon ile iletebilirsiniz; size uygun saatler paylaşılacaktır.`,
        links: [
          ...(contact.whatsapp
            ? [{ label: 'WhatsApp ile randevu', href: `https://wa.me/${contact.whatsapp}?text=${message}`, primary: true }]
            : []),
          { label: contact.phone, href: `tel:${contact.phone.replace(/[^\d+]/g, '')}`, primary: !contact.whatsapp },
        ],
      };
    }

    const service = c.services.find((s) => t.includes(norm(s.title)) || input === s.title);
    if (service) {
      this.remember(service.title);
      const formats = service.formats.map((f) => (f === 'online' ? 'online' : 'yüz yüze')).join(' ve ');
      return {
        role: 'assistant',
        text: `${service.title}: ${service.description} Seanslar ${formats} olarak yapılabilir${service.durationMinutes ? ` ve yaklaşık ${service.durationMinutes} dakika sürer` : ''}.`,
        options: ['Online Görüşme', 'Yüz Yüze Görüşme', CONTINUE_OPTION],
      };
    }

    if (has(t, ['ilk kez', 'ilk defa', 'nereden basla', 'baslamak', 'baslayacagim'])) {
      return {
        role: 'assistant',
        text: 'Elbette. Öncelikle size uygun görüşme türünü seçebilirsiniz. İlk görüşme, beklentilerinizi konuşup sürecin nasıl ilerleyeceğini birlikte planladığımız bir tanışma seansıdır.',
        options: [c.services[0]?.title, 'Online Görüşme', 'Yüz Yüze Görüşme'].filter(Boolean) as string[],
      };
    }

    if (input === 'Online Görüşme' || has(t, ['online', 'goruntulu', 'uzaktan'])) {
      this.remember('Online');
      return {
        role: 'assistant',
        text: 'Online seanslar güvenli bir görüntülü görüşme bağlantısı üzerinden yapılır. Sessiz ve rahat konuşabileceğiniz bir ortam yeterlidir. Randevu oluşturmak ister misiniz?',
        options: [CONTINUE_OPTION],
      };
    }

    if (input === 'Yüz Yüze Görüşme' || has(t, ['yuz yuze', 'adres', 'nerede', 'konum', 'klinik', 'ulasim'])) {
      if (input === 'Yüz Yüze Görüşme') this.remember('Yüz yüze');
      return {
        role: 'assistant',
        text: `Kliniğimiz ${contact.address}, ${contact.district} / ${contact.city} adresindedir. Randevu oluşturmak ister misiniz?`,
        links: [{ label: 'Haritada aç', href: contact.googleMapsUrl }],
        options: [CONTINUE_OPTION],
      };
    }

    if (has(t, ['saat', 'calisma', 'acik', 'hangi gun'])) {
      return {
        role: 'assistant',
        text: `Çalışma saatlerimiz: ${contact.workingHours.map((h) => `${h.days} ${h.hours}`).join(' · ')}.`,
        options: [CONTINUE_OPTION],
      };
    }

    if (has(t, ['ucret', 'fiyat', 'ne kadar', 'sure', 'dakika'])) {
      return {
        role: 'assistant',
        text: `Bireysel seanslar genellikle ${c.services[0]?.durationMinutes ?? 50} dakika sürer. Güncel ücret bilgisini paylaşabilmemiz için bize doğrudan ulaşabilirsiniz.`,
        links: [{ label: contact.phone, href: `tel:${contact.phone.replace(/[^\d+]/g, '')}` }],
        options: [CONTINUE_OPTION],
      };
    }

    if (has(t, ['hizmet', 'terapi', 'neler', 'alan'])) {
      return {
        role: 'assistant',
        text: 'Sunduğumuz çalışmalar şunlar. Hakkında bilgi almak istediğinizi seçebilirsiniz.',
        options: c.services.map((s) => s.title),
      };
    }

    return {
      role: 'assistant',
      text: 'Bu konuda en doğru bilgiyi doğrudan kliniğimizden alabilirsiniz. Hizmetler, seans süreci, adres veya randevu hakkında da yardımcı olabilirim.',
      options: ['Hizmetler neler?', CONTINUE_OPTION],
    };
  }

  private remember(choice: string): void {
    if (!this.chosen.includes(choice)) this.chosen.push(choice);
  }
}
