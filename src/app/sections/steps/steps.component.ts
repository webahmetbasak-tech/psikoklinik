import { Component, computed, inject } from '@angular/core';
import { ClinicService } from '../../core/clinic.service';
import { AppointmentLinkDirective } from '../../shared/appointment-link.directive';
import { RevealDirective } from '../../shared/reveal.directive';
import { ScribbleTextComponent } from '../../shared/scribble-text.component';
import { SketchComponent } from '../../shared/sketch.component';
import { PaintedSvgComponent } from '../../shared/painted-svg.component';

/** "How to start": a huge heading and three dashed folder cards. */
@Component({
  selector: 'app-steps',
  imports: [AppointmentLinkDirective, RevealDirective, PaintedSvgComponent, ScribbleTextComponent, SketchComponent],
  template: `
    <section class="steps" id="surec" aria-labelledby="steps-title">
      <div class="wrap">
        <div class="steps__head">
          <h2 id="steps-title" class="t-xl" appReveal>
            <app-scribble-text [text]="section().title" />
          </h2>
          <app-painted-svg class="steps__teapot" [src]="art()" />
        </div>

        <ol class="folders">
          @for (step of section().steps; track step.label; let i = $index) {
            <li class="folder" appReveal [revealDelay]="i * 120">
              <svg class="folder__outline" viewBox="0 0 380 520" preserveAspectRatio="none" aria-hidden="true">
                <path d="M12 38H150L188 0H366Q379 0 379 13V506Q379 519 366 519H14Q1 519 1 506V49Q1 38 12 38Z" />
              </svg>
              <span class="folder__tab t-body-s">{{ step.label }}</span>
              @if (step.sketch) {
                <app-sketch class="folder__sketch" [name]="step.sketch" />
              } @else if (step.illustration) {
                <app-painted-svg class="folder__sketch" [src]="step.illustration" />
              }
              <h3 class="t-m folder__title">{{ step.title }}</h3>
              <p class="t-body-m">{{ step.text }}</p>
            </li>
          }
        </ol>

        <div class="steps__cta" appReveal>
          <a class="pill" appAppointmentLink>{{ section().cta }}</a>
        </div>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; position: relative; z-index: 1; background: var(--c-background); }
    .steps__head { position: relative; padding-top: 75px; }
    .steps__head h2 { max-width: 760px; }
    .steps__teapot { position: absolute; left: 820px; bottom: -120px; width: 200px; }

    .folders {
      display: grid;
      grid-template-columns: repeat(3, 380px);
      justify-content: center;
      gap: 30px;
      margin: 120px 0 80px;
      padding: 0;
      list-style: none;
    }

    /* Dashed folder with a tab on the upper right, drawn as one outline. */
    .folder {
      position: relative;
      padding: 68px 30px 40px;
      min-height: 520px;
    }
    .folder__outline {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: visible;
      pointer-events: none;
    }
    .folder__outline path {
      fill: none;
      stroke: var(--c-blue);
      stroke-width: 1;
      stroke-dasharray: 3 3;
      vector-effect: non-scaling-stroke;
    }
    .folder__tab {
      position: absolute;
      top: 10px;
      right: 22px;
    }
    .folder__sketch { height: 230px; margin: 10px 0 30px; }
    .folder__sketch ::ng-deep svg { width: 100%; height: 100%; }
    .folder__title { margin-bottom: 30px; }

    .steps__cta { display: flex; justify-content: center; padding-bottom: 75px; }

    @media (max-width: 1275px) {
      .steps__teapot { left: auto; right: 0; }
      .folders { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    }
    @media (max-width: 900px) {
      .steps__head {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: end;
        column-gap: 16px;
        padding-top: 30px;
      }
      .steps__teapot { position: relative; left: auto; right: auto; bottom: auto; width: clamp(90px, 26vw, 150px); margin: 0; }
      .folders { grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr)); margin: 40px 0 50px; gap: 50px 24px; }
      .folder { min-height: 0; padding: 64px 24px 32px; }
      .folder__sketch { height: 190px; }
    }
    /* Phones: tighter rhythm between sections. */
    @media (max-width: 768px) {
      .steps__head { padding-top: 16px; }
      .folders { margin: 32px 0 36px; gap: 36px; }
      .steps__cta { padding-bottom: 44px; }
    }
  `,
})
export class StepsComponent {
  private readonly clinic = inject(ClinicService);
  protected readonly section = computed(() => this.clinic.config().stepsSection);
  protected readonly art = computed(() => this.clinic.config().illustrations.steps);
}
