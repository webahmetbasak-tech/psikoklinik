import { Component, computed, inject } from '@angular/core';
import { ClinicService } from '../../core/clinic.service';
import { AppointmentLinkDirective } from '../../shared/appointment-link.directive';
import { RevealDirective } from '../../shared/reveal.directive';
import { ScribbleTextComponent } from '../../shared/scribble-text.component';
import { PaintedSvgComponent } from '../../shared/painted-svg.component';

/** Closing call to action on lined paper, with a plant and a lounge chair. */
@Component({
  selector: 'app-booking',
  imports: [AppointmentLinkDirective, RevealDirective, PaintedSvgComponent, ScribbleTextComponent],
  template: `
    <section class="booking lined" aria-labelledby="booking-title">
      <div class="wrap booking__grid">
        <div class="booking__copy">
          <h2 id="booking-title" class="t-xl" appReveal>
            <app-scribble-text [text]="booking().title" />
          </h2>
          <p class="t-body-l booking__text" appReveal [revealDelay]="120">{{ booking().text }}</p>
          <div appReveal [revealDelay]="200">
            <a class="pill" appAppointmentLink>{{ booking().cta }}</a>
          </div>
        </div>
        <app-painted-svg class="booking__sketch" [src]="art()" />
      </div>
    </section>
  `,
  styles: `
    :host { display: block; position: relative; z-index: 1; background: var(--c-background); }
    .booking { padding-bottom: 150px; }
    .booking__grid {
      display: grid;
      grid-template-columns: minmax(0, 720px) minmax(0, 1fr);
      align-items: end;
      gap: 40px;
      padding-top: 0;
    }
    .booking__copy { display: grid; gap: 40px; justify-items: start; }
    .booking__text { max-width: 690px; }
    .booking__sketch { width: 100%; max-width: 640px; justify-self: end; }
    @media (max-width: 960px) {
      .booking { padding-bottom: 80px; }
      .booking__grid { grid-template-columns: 1fr; }
      .booking__copy { gap: 24px; }
      .booking__sketch { max-width: 360px; }
    }
    /* Phones: tighter rhythm between sections. */
    @media (max-width: 768px) {
      .booking { padding-bottom: 56px; }
    }
  `,
})
export class BookingComponent {
  private readonly clinic = inject(ClinicService);
  protected readonly booking = computed(() => this.clinic.config().booking);
  protected readonly art = computed(() => this.clinic.config().illustrations.booking);
}
