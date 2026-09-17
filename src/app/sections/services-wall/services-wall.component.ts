import { Component, computed, inject } from '@angular/core';
import { AppointmentIntentService } from '../../core/appointment-intent.service';
import { ClinicService } from '../../core/clinic.service';
import { SmoothScrollService } from '../../core/smooth-scroll.service';
import { Service } from '../../models/clinic.models';
import { RevealDirective } from '../../shared/reveal.directive';
import { PaintedSvgComponent } from '../../shared/painted-svg.component';

/**
 * Services as a staggered wall of cards: an octagon-cut colour panel framing
 * a photo, a large title and a short line. A sticky column on the left
 * holds the heading, a button and an illustration.
 */
@Component({
  selector: 'app-services-wall',
  imports: [PaintedSvgComponent, RevealDirective],
  template: `
    <section class="services" id="hizmetler" aria-labelledby="services-title">
      <div class="wrap services__grid">
        <div class="services__aside">
          <h2 id="services-title" class="t-l" appReveal>
            @for (line of titleLines(); track $index) {
              <span class="line">{{ line }}</span>
            }
          </h2>
          <button type="button" class="pill services__cta" appReveal [revealDelay]="120" (click)="ask()">
            {{ section().cta }}
          </button>
          <app-painted-svg class="services__sketch" [src]="art()" />
        </div>

        <ul class="cards">
          @for (s of services(); track s.id; let i = $index) {
            <li class="card" [class.is-match]="matched()?.id === s.id" [attr.data-accent]="s.accent" appReveal>
              <button type="button" class="card__button" (click)="choose(s)">
                <span class="card__panel">
                  <span class="card__photo">
                    <img [src]="s.image" alt="" width="1000" height="558" loading="lazy" decoding="async" />
                  </span>
                </span>
                <span class="card__text">
                  <span class="t-m card__title">{{ s.title }}</span>
                  <span class="t-body-s card__meta">{{ s.tagline }}</span>
                  <span class="t-body-s card__formats">{{ formats(s) }}</span>
                </span>
              </button>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
  styleUrl: './services-wall.component.scss',
})
export class ServicesWallComponent {
  private readonly clinic = inject(ClinicService);
  private readonly intents = inject(AppointmentIntentService);
  private readonly scroll = inject(SmoothScrollService);

  protected readonly section = computed(() => this.clinic.config().servicesSection);
  protected readonly titleLines = computed(() => this.section().title.split('|').map((l) => l.trim()));
  protected readonly art = computed(() => this.clinic.config().illustrations.services);
  protected readonly services = this.clinic.services;
  protected readonly matched = this.intents.matchedService;

  protected formats(s: Service): string {
    const f = s.formats.map((x) => (x === 'online' ? 'Online' : 'Yüz yüze')).join(' · ');
    return s.durationMinutes ? `${f} · ${s.durationMinutes} dk` : f;
  }

  protected choose(s: Service): void {
    this.intents.submit(s.title, this.intents.intent()?.format ?? '');
    this.scroll.scrollTo('ai-randevu');
  }

  protected ask(): void {
    this.scroll.scrollTo('ai-randevu');
  }
}
