import { Component, computed, inject } from '@angular/core';
import { ClinicService, parseRichLines } from '../../core/clinic.service';
import { AppointmentLinkDirective } from '../../shared/appointment-link.directive';
import { PaintedSvgComponent } from '../../shared/painted-svg.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { ScribbleTextComponent } from '../../shared/scribble-text.component';

/** The clinic's name as an editorial lockup and a booking button beside the room illustration. */
@Component({
  selector: 'app-intro-room',
  imports: [AppointmentLinkDirective, PaintedSvgComponent, RevealDirective, ScribbleTextComponent],
  template: `
    <section class="intro lined" aria-labelledby="intro-title">
      <div class="intro__edge" aria-hidden="true"></div>
      <div class="wrap intro__grid">
        <div class="intro__copy">
          @if (intro(); as i) {
            <p class="intro__eyebrow" appReveal>{{ i.eyebrow }}</p>
            <h2 id="intro-title" class="intro__title" appReveal [revealDelay]="80">
              <span class="intro__name t-xl"><app-scribble-text [text]="i.title" variant="underline" /></span>
              <span class="intro__sub">
                @for (line of subtitle(); track $index) {
                  <span>{{ line }}</span>
                }
              </span>
            </h2>
          } @else {
            <h2 id="intro-title" class="t-xl intro__name" appReveal>{{ config().clinicName }}</h2>
          }
          <div appReveal [revealDelay]="160">
            <a class="pill" appAppointmentLink>{{ config().headerCta }}</a>
          </div>
        </div>
        <app-painted-svg class="room" [src]="config().illustrations.room" />
      </div>
    </section>
  `,
  styleUrl: './intro-room.component.scss',
})
export class IntroRoomComponent {
  protected readonly config = inject(ClinicService).config;
  protected readonly intro = computed(() => this.config().intro);
  protected readonly subtitle = computed(() =>
    parseRichLines(this.intro()?.subtitle ?? '').map((line) => line.map((s) => s.text).join('')),
  );
}
