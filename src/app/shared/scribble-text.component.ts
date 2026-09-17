import { Component, DestroyRef, ElementRef, afterNextRender, computed, inject, input, viewChildren } from '@angular/core';
import { parseRichLines } from '../core/clinic.service';
import { ScrollScrubService } from '../core/scroll-scrub.service';

/**
 * Renders config copy (`|` line breaks) and draws a marker highlight behind
 * every `*emphasised*` segment: a zig-zag scribble or a single underline.
 * The mark is drawn by the scroll and rewinds when scrolling back up.
 */
@Component({
  selector: 'app-scribble-text',
  template: `
    @for (line of lines(); track $index) {
      <span class="line">
        @for (seg of line; track $index) {
          @if (seg.em) {
            <span class="mark" #mark [class.mark--underline]="variant() === 'underline'">
              <span class="mark__text">{{ seg.text }}</span>
              <svg class="mark__svg" [attr.viewBox]="variant() === 'underline' ? '0 0 600 60' : '0 0 600 100'" preserveAspectRatio="none" aria-hidden="true">
                @if (variant() === 'underline') {
                  <path pathLength="1" d="M8 34C160 26 330 22 592 18 450 28 250 36 40 46" />
                } @else {
                  <path pathLength="1" d="M10 78c34-42 58 18 96-22 30-32 52 28 90-10 30-30 54 30 92-8 32-30 54 30 92-8 30-28 54 26 90-6 28-24 50 14 110-8" />
                }
              </svg>
            </span>
          } @else {
            <span>{{ seg.text }}</span>
          }
        }
      </span>
    }
  `,
  styles: `
    :host { display: contents; }
    .line { display: block; }
    .mark { position: relative; display: inline-block; white-space: nowrap; }
    .mark__text { position: relative; z-index: 1; }
    .mark__svg {
      position: absolute;
      left: -2%;
      width: 104%;
      bottom: -0.06em;
      height: 0.42em;
      overflow: visible;
      z-index: 0;
    }
    .mark--underline .mark__svg { bottom: -0.12em; height: 0.2em; }
    path {
      fill: none;
      stroke: var(--c-green);
      stroke-width: 20;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-dasharray: 1 1;
      stroke-dashoffset: 1;
      transition: stroke-dashoffset 0.3s linear;
    }
    .mark--underline path { stroke-width: 12; }
    @media (prefers-reduced-motion: reduce) { path { stroke-dashoffset: 0; transition: none; } }
  `,
})
export class ScribbleTextComponent {
  readonly text = input.required<string>();
  readonly variant = input<'zigzag' | 'underline'>('zigzag');
  protected readonly lines = computed(() => parseRichLines(this.text()));

  private readonly marks = viewChildren<ElementRef<HTMLElement>>('mark');

  constructor() {
    const scrub = inject(ScrollScrubService);
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      for (const ref of this.marks()) {
        const el = ref.nativeElement;
        const path = el.querySelector('path')!;
        // Follows the marked words' own centre, like the drawings do.
        const probe = () => el.getBoundingClientRect();
        destroyRef.onDestroy(scrub.register(el, (p) => (path.style.strokeDashoffset = String(1 - p)), 0.85, 0.55, probe));
      }
    });
  }
}
