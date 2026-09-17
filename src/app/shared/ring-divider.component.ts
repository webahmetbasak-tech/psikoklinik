import { Component } from '@angular/core';

/** A solid blue rule, a row of outlined circles, and two dashed rules below. */
@Component({
  selector: 'app-ring-divider',
  template: `<div class="rings" aria-hidden="true"><span class="rings__row"></span></div>`,
  styles: `
    :host { display: block; position: relative; z-index: 1; background: var(--c-background); }
    .rings {
      border-top: 1px solid var(--c-blue);
      padding: 30px 0 30px;
      overflow: hidden;
    }
    .rings__row {
      display: block;
      height: 42px;
      margin-left: -12px;
      background: radial-gradient(circle at 21px 21px, transparent 19.5px, var(--c-blue) 20px, var(--c-blue) 21px, transparent 21.5px) 0 0 / 52px 42px repeat-x;
    }
    .rings::after {
      content: '';
      display: block;
      height: 51px;
      margin-top: 30px;
      border-top: 1px dashed var(--c-blue);
      border-bottom: 1px dashed var(--c-blue);
    }
    /* Phones: tighter rhythm between sections. */
    @media (max-width: 768px) {
      .rings { padding: 20px 0; }
      .rings::after { margin-top: 20px; }
    }
  `,
})
export class RingDividerComponent {}
