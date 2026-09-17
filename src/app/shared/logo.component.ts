import { Component, computed, inject, input } from '@angular/core';
import { ClinicService } from '../core/clinic.service';

/** Hand-lettered two-line wordmark in a loosely drawn green bracket. */
@Component({
  selector: 'app-logo',
  template: `
    @if (logo().image) {
      <img [src]="logo().image" [alt]="name()" />
    } @else {
      <span class="logo" [class.logo--light]="light()">
        <svg class="logo__frame" viewBox="0 0 120 52" preserveAspectRatio="none" aria-hidden="true">
          <path d="M5 3c-1 14 1 30 0 45M3 49c38 2 76-1 112 0M103 3c6 0 12-1 14 0" />
        </svg>
        <span class="logo__one">{{ logo().lineOne }}</span>
        <span class="logo__two"><small>{{ logo().lead }}</small>{{ logo().lineTwo }}</span>
      </span>
    }
  `,
  styles: `
    :host { display: inline-block; }
    img { display: block; height: 48px; width: auto; }
    .logo {
      position: relative;
      display: inline-grid;
      padding: 4px 10px 8px 12px;
      color: var(--c-dark);
      font-weight: 500;
      line-height: 0.9;
      letter-spacing: 0.01em;
    }
    .logo--light { color: var(--c-background); }
    .logo__frame { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
    .logo__frame path { fill: none; stroke: var(--c-green); stroke-width: 3; stroke-linecap: round; vector-effect: non-scaling-stroke; }
    .logo__one { font-size: 19px; }
    .logo__two { font-size: 19px; display: flex; align-items: baseline; gap: 3px; }
    small { font-size: 10px; font-weight: 600; }
  `,
})
export class LogoComponent {
  readonly light = input(false);
  private readonly clinic = inject(ClinicService);
  protected readonly logo = computed(() => this.clinic.config().logo);
  protected readonly name = computed(() => this.clinic.config().clinicName);
}
