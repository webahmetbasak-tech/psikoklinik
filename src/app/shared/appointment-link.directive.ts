import { Directive, HostListener, computed, inject } from '@angular/core';
import { ClinicService } from '../core/clinic.service';
import { SmoothScrollService } from '../core/smooth-scroll.service';

/**
 * Turns any <a> into the clinic's appointment CTA. Anchors ("#ai-randevu")
 * scroll smoothly; external booking urls open normally.
 */
@Directive({
  selector: 'a[appAppointmentLink]',
  host: {
    '[attr.href]': 'href()',
    '[attr.target]': 'external() ? "_blank" : null',
    '[attr.rel]': 'external() ? "noopener" : null',
  },
})
export class AppointmentLinkDirective {
  private readonly clinic = inject(ClinicService);
  private readonly scroll = inject(SmoothScrollService);

  protected readonly href = computed(() => this.clinic.config().appointmentUrl);
  protected readonly external = computed(() => /^https?:/.test(this.href()));

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    const url = this.href();
    if (!url.startsWith('#')) return;
    event.preventDefault();
    this.scroll.scrollTo(url.slice(1));
  }
}
