import { Component, computed, inject } from '@angular/core';
import { ClinicService } from '../../core/clinic.service';
import { SmoothScrollService } from '../../core/smooth-scroll.service';
import { LogoComponent } from '../../shared/logo.component';

/**
 * Blue footer with a scalloped top edge. Two paper cards overlap the edge —
 * contact details, and the clinic/legal links with a folded green corner —
 * next to a large slogan and social links.
 */
@Component({
  selector: 'app-footer',
  imports: [LogoComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  protected readonly clinic = inject(ClinicService);
  private readonly scroll = inject(SmoothScrollService);

  protected readonly config = this.clinic.config;
  protected readonly c = this.clinic.contact;
  protected readonly year = new Date().getFullYear();
  protected readonly sloganLines = computed(() => this.config().footer.slogan.split('|').map((l) => l.trim()));
  protected readonly social = computed(() =>
    (Object.entries(this.config().social) as Array<[string, string | undefined]>)
      .filter(([, href]) => !!href)
      .map(([key, href]) => ({ key, href: href as string })),
  );

  protected go(target: string, event: Event): void {
    event.preventDefault();
    this.scroll.scrollTo(target);
  }
}
