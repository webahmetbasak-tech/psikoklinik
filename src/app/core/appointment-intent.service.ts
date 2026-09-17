import { Injectable, computed, inject, signal } from '@angular/core';
import { Service } from '../models/clinic.models';
import { ClinicService } from './clinic.service';

export interface AppointmentIntent {
  topic: string;
  format: string;
  /** Increments on every submission so listeners react to repeats too. */
  id: number;
}

const norm = (s: string) =>
  s.toLocaleLowerCase('tr').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ı/g, 'i').trim();

/**
 * Carries what the visitor typed in the hero ("what do you need help with",
 * "how would you like to meet") to the services wall and the AI assistant.
 */
@Injectable({ providedIn: 'root' })
export class AppointmentIntentService {
  private readonly clinic = inject(ClinicService);
  private seq = 0;

  readonly intent = signal<AppointmentIntent | null>(null);

  /** Service that best matches the typed topic, if any. */
  readonly matchedService = computed<Service | undefined>(() => {
    const topic = this.intent()?.topic;
    return topic ? this.match(topic) : undefined;
  });

  /** Suggestions for the topic field: service titles and areas of practice. */
  readonly topicSuggestions = computed(() => {
    const c = this.clinic.config();
    return [...new Set([...c.services.map((s) => s.title), ...c.therapist.areasOfPractice])];
  });

  submit(topic: string, format: string): void {
    this.intent.set({ topic: topic.trim(), format: format.trim(), id: ++this.seq });
  }

  match(topic: string): Service | undefined {
    const t = norm(topic);
    if (!t) return undefined;
    return this.clinic
      .services()
      .find((s) => [s.title, ...(s.keywords ?? [])].some((k) => norm(k).includes(t) || t.includes(norm(k))));
  }
}
