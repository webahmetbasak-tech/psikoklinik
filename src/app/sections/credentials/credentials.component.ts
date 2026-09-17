import { Component, computed, inject } from '@angular/core';
import { ClinicService } from '../../core/clinic.service';
import { PaintedSvgComponent } from '../../shared/painted-svg.component';
import { RevealDirective } from '../../shared/reveal.directive';

/**
 * Trust strip: the therapist's education and memberships as a quiet,
 * numbered index on dashed rules — ink only, so the illustrations above and
 * below keep all the colour.
 */
@Component({
  selector: 'app-credentials',
  imports: [PaintedSvgComponent, RevealDirective],
  template: `
    <section class="credentials" aria-labelledby="credentials-title">
      <div class="wrap credentials__grid">
        <div class="credentials__head">
          <h2 id="credentials-title" class="t-l" appReveal>{{ title() }}</h2>
          <app-painted-svg class="credentials__art" [src]="art()" />
        </div>
        <ol class="index" appReveal>
          @for (q of items(); track q; let i = $index) {
            <li class="index__row" data-reveal-child>
              <span class="index__no" aria-hidden="true">{{ (i + 1).toString().padStart(2, '0') }}</span>
              <span class="index__text">{{ q }}</span>
            </li>
          }
        </ol>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; position: relative; z-index: 1; background: var(--c-background); }
    .credentials__grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 760px);
      column-gap: 60px;
      padding-top: 120px;
      padding-bottom: 60px;
    }
    .credentials__head { display: grid; align-content: start; gap: 50px; }
    .credentials__art { width: clamp(180px, 22vw, 300px); margin-left: clamp(0px, 4vw, 60px); }
    .index { margin: 0; padding: 0; list-style: none; border-top: 1px dashed var(--c-blue); }
    .index__row {
      display: grid;
      grid-template-columns: 70px 1fr;
      align-items: baseline;
      padding: 26px 0;
      border-bottom: 1px dashed var(--c-blue);
    }
    .index__no { font-size: 16px; font-variant-numeric: tabular-nums; color: rgb(var(--c-dark-rgb) / 0.55); }
    .index__text { font-size: 28px; line-height: 1.25; letter-spacing: -0.8px; }
    @media (max-width: 960px) {
      .credentials__grid { grid-template-columns: 1fr; row-gap: 36px; padding-top: 60px; padding-bottom: 20px; }
      .credentials__head { grid-template-columns: minmax(0, 1fr) auto; align-items: end; gap: 20px; }
      .credentials__art { width: clamp(110px, 28vw, 200px); margin: 0; }
      .index__row { grid-template-columns: 48px 1fr; padding: 18px 0; }
      .index__text { font-size: 20px; letter-spacing: -0.4px; }
    }
    /* Phones: tighter rhythm between sections. */
    @media (max-width: 768px) {
      .credentials__grid { padding-top: 40px; padding-bottom: 8px; row-gap: 28px; }
    }
  `,
})
export class CredentialsComponent {
  private readonly clinic = inject(ClinicService);
  protected readonly title = computed(() => this.clinic.config().credentials.title);
  protected readonly items = computed(() => this.clinic.config().therapist.qualifications);
  protected readonly art = computed(() => this.clinic.config().illustrations.credentials);
}
