import { Component, ElementRef, computed, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { AppointmentIntentService } from '../../core/appointment-intent.service';
import { ClinicService } from '../../core/clinic.service';
import { RevealDirective } from '../../shared/reveal.directive';
import { PaintedSvgComponent } from '../../shared/painted-svg.component';
import { AssistantEngine, AssistantMessage } from './assistant-engine';

/**
 * Questions & appointment assistant, presented as a dashed paper folder.
 * It answers from the clinic's own data, never diagnoses, and routes
 * emergencies to real help. Choices made in the hero or on a service card
 * arrive here as the visitor's first question.
 */
@Component({
  selector: 'app-ai-appointment',
  imports: [PaintedSvgComponent, RevealDirective],
  templateUrl: './ai-appointment.component.html',
  styleUrl: './ai-appointment.component.scss',
})
export class AiAppointmentComponent {
  private readonly clinic = inject(ClinicService);
  private readonly intents = inject(AppointmentIntentService);
  private readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');
  private readonly log = viewChild.required<ElementRef<HTMLElement>>('log');

  protected readonly config = this.clinic.config;
  protected readonly section = computed(() => this.config().aiSection);
  protected readonly cfg = computed(() => this.config().aiAssistant);
  private readonly engine = computed(() => new AssistantEngine(this.config()));

  protected readonly messages = signal<AssistantMessage[]>([]);
  protected readonly thinking = signal(false);

  constructor() {
    this.messages.set([this.engine().greeting()]);

    // A choice made elsewhere on the page becomes the first question here.
    effect(() => {
      const intent = this.intents.intent();
      if (!intent) return;
      untracked(() => {
        const service = this.intents.match(intent.topic);
        const parts = [service?.title ?? intent.topic, intent.format].filter(Boolean);
        if (parts.length) this.send(parts.join(' — '));
      });
    });
  }

  protected submit(event: Event): void {
    event.preventDefault();
    const el = this.input().nativeElement;
    const value = el.value.trim();
    if (!value) return;
    el.value = '';
    this.send(value);
  }

  protected send(text: string): void {
    if (this.thinking()) return;
    this.messages.update((m) => [...m, { role: 'user', text }]);
    this.thinking.set(true);
    const reply = this.replyFor(text);
    setTimeout(
      () => {
        this.messages.update((m) => [...m, reply]);
        this.thinking.set(false);
        requestAnimationFrame(() => {
          const log = this.log().nativeElement;
          log.scrollTo({ top: log.scrollHeight, behavior: 'smooth' });
        });
      },
      reply.emergency ? 200 : 750,
    );
  }

  /** "Service — Format" from the hero is answered by the service, then the format. */
  private replyFor(text: string): AssistantMessage {
    const [first, format] = text.split(' — ');
    if (!format) return this.engine().reply(text);
    const engine = this.engine();
    engine.reply(first);
    const formatReply = engine.reply(format.toLocaleLowerCase('tr').includes('online') ? 'Online Görüşme' : 'Yüz Yüze Görüşme');
    const serviceReply = this.engine().reply(first);
    return {
      ...formatReply,
      text: `${serviceReply.text} ${formatReply.text}`,
    };
  }
}
