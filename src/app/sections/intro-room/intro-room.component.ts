import { Component, inject } from '@angular/core';
import { ClinicService } from '../../core/clinic.service';
import { AppointmentLinkDirective } from '../../shared/appointment-link.directive';
import { PaintedSvgComponent } from '../../shared/painted-svg.component';
import { RevealDirective } from '../../shared/reveal.directive';

/** The clinic's name and a booking button beside the room illustration, coloured in on scroll. */
@Component({
  selector: 'app-intro-room',
  imports: [AppointmentLinkDirective, PaintedSvgComponent, RevealDirective],
  template: `
    <section class="intro lined" aria-labelledby="intro-title">
      <div class="intro__edge" aria-hidden="true"></div>
      <div class="wrap intro__grid">
        <div class="intro__copy">
          <h2 id="intro-title" class="t-xl intro__title" appReveal>{{ config().clinicName }}</h2>
          <div appReveal [revealDelay]="120">
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
}
