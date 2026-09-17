import { Component, computed, inject } from '@angular/core';
import { ClinicService } from '../../core/clinic.service';
import { RevealDirective } from '../../shared/reveal.directive';
import { ScribbleTextComponent } from '../../shared/scribble-text.component';
import { PaintedSvgComponent } from '../../shared/painted-svg.component';
import { SketchComponent } from '../../shared/sketch.component';

/** Two columns: a heading and an open door on the left, large reading text on the right. */
@Component({
  selector: 'app-about',
  imports: [PaintedSvgComponent, RevealDirective, ScribbleTextComponent, SketchComponent],
  template: `
    <section class="about" id="hakkimizda" aria-labelledby="about-title">
      <div class="wrap about__grid">
        <div class="about__left">
          <h2 id="about-title" class="t-l" appReveal>
            <app-scribble-text [text]="about().title" variant="underline" />
          </h2>
          <app-sketch class="about__arrow" name="arrow" />
          <app-sketch class="about__door" name="door" />
        </div>

        <div class="about__right">
          @for (p of about().paragraphs; track $index) {
            <p class="t-body-l" appReveal>{{ p }}</p>
          }
          <app-painted-svg class="about__plant" [src]="art().aboutAside" />
        </div>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; position: relative; z-index: 1; background: var(--c-background); }
    .about__grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 665px);
      column-gap: 50px;
      padding-top: 150px;
    }
    .about__left { position: relative; min-height: 800px; }
    .about__arrow { position: absolute; top: 330px; right: 0; width: 200px; }
    .about__door { position: absolute; left: 0; bottom: 240px; width: 400px; }
    .about__right { padding-top: 130px; display: grid; gap: 48px; align-content: start; }
    .about__plant { justify-self: end; width: 200px; margin-top: 10px; }
    @media (max-width: 1100px) {
      .about__door { width: 320px; }
    }
    @media (max-width: 960px) {
      .about__grid { grid-template-columns: 1fr; padding-top: 60px; }
      .about__left { min-height: 0; }
      .about__arrow { display: none; }
      .about__door { display: none; }
      .about__right { padding-top: 40px; gap: 24px; }
      /* One drawing per section on small screens (the door), so this plant does not stack on the services plant right below. */
      .about__plant { display: none; }
    }
    /* Phones: tighter rhythm between sections. */
    @media (max-width: 768px) {
      .about__grid { padding-top: 40px; }
      .about__right { padding-top: 28px; }
    }
  `,
})
export class AboutComponent {
  private readonly clinic = inject(ClinicService);
  protected readonly about = computed(() => this.clinic.config().about);
  protected readonly art = computed(() => this.clinic.config().illustrations);
}
