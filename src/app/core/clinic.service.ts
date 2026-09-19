import { Injectable, computed, inject, signal } from '@angular/core';
import { CLINIC_CONFIG } from '../config/clinic.config';
import { ClinicConfig } from '../models/clinic.models';

export interface RichSegment {
  text: string;
  em: boolean;
}

/** "Zihninize | *biraz alan* | açın." → lines of segments. */
export function parseRichLines(source: string): RichSegment[][] {
  return source
    .split('|')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) =>
      line
        .split(/(\*[^*]+\*)/g)
        .filter(Boolean)
        .map((part) =>
          part.startsWith('*') && part.endsWith('*')
            ? { text: part.slice(1, -1), em: true }
            : { text: part, em: false },
        ),
    );
}

export function plainText(source: string): string {
  return source.replace(/\|/g, ' ').replace(/\*/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * Single access point to clinic data. Components never import the raw config;
 * they read these signals so a runtime config swap (e.g. fetched per tenant)
 * propagates everywhere.
 */
@Injectable({ providedIn: 'root' })
export class ClinicService {
  private readonly state = signal<ClinicConfig>(inject(CLINIC_CONFIG));

  readonly config = this.state.asReadonly();
  readonly contact = computed(() => this.state().contact);
  readonly services = computed(() => this.state().services);
  readonly therapist = computed(() => this.state().therapist);

  readonly phoneHref = computed(() => `tel:${this.state().contact.phone.replace(/[^\d+]/g, '')}`);
  readonly emailHref = computed(() => `mailto:${this.state().contact.email}`);
  readonly whatsappHref = computed(() => {
    const text = encodeURIComponent(`Merhaba, ${this.state().clinicName} için randevu almak istiyorum.`);
    return `https://wa.me/${(this.state().contact.whatsapp ?? '').replace(/\D/g, '')}?text=${text}`;
  });

  /** Replace the whole config at runtime (multi-tenant hosting). */
  load(config: ClinicConfig): void {
    this.state.set(config);
  }
}
