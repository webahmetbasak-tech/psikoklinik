import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  viewChildren,
} from '@angular/core';
import { ScrollScrubService, svgSpan } from '../core/scroll-scrub.service';
import { PaintArea, SKETCHES, SketchKind } from './sketches';

export type { SketchKind } from './sketches';

let uid = 0;

/** Zig-zag marker strokes sweeping a box row by row, with a slight slant. */
function brushPath([x, y, w, h]: PaintArea['box'], size: number): string {
  // Half the brush width between passes leaves no gaps where the zig-zag turns.
  const step = size * 0.5;
  const rows = Math.max(1, Math.ceil(h / step));
  const pad = size * 0.4;
  let d = `M${(x - pad).toFixed(1)} ${(y + step * 0.2).toFixed(1)}`;
  for (let i = 0; i < rows; i++) {
    const yEnd = y + (i + 0.8) * step;
    d += i % 2 === 0 ? ` L${(x + w + pad).toFixed(1)} ${yEnd.toFixed(1)}` : ` L${(x - pad).toFixed(1)} ${yEnd.toFixed(1)}`;
    if (i < rows - 1) d += ` L${(i % 2 === 0 ? x + w + pad : x - pad).toFixed(1)} ${(yEnd + step * 0.2).toFixed(1)}`;
  }
  return d;
}

/**
 * Hand-drawn marker illustration. Ink is always there; colour is coloured in
 * by a marker brush as the drawing scrolls into view, area by area, and
 * wiped again when scrolling back up. Arrow-type strokes are drawn the same way.
 */
@Component({
  selector: 'app-sketch',
  template: `
    <svg [attr.viewBox]="'0 0 ' + def().viewBox[0] + ' ' + def().viewBox[1]">
      <defs>
        <filter [attr.id]="id + '-wobble'" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" [attr.baseFrequency]="wobbleFreq()" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" [attr.scale]="wobbleScale()" />
        </filter>
        @if (paint()) {
          @for (a of paints(); track $index) {
            <mask [attr.id]="id + '-m' + $index" maskUnits="userSpaceOnUse" x="-50" y="-50"
              [attr.width]="def().viewBox[0] + 100" [attr.height]="def().viewBox[1] + 100">
              <path #brush class="brush" [attr.d]="a.brush" [attr.stroke-width]="a.size" />
            </mask>
          }
        }
      </defs>

      @if (paint()) {
        @for (a of paints(); track $index) {
          <g [attr.mask]="'url(#' + id + '-m' + $index + ')'">
            <path [class]="'fill fill--' + a.color" [attr.d]="a.d" [attr.fill-rule]="a.evenodd ? 'evenodd' : null" />
          </g>
        }
        @if (def().streaks?.length) {
          <g [attr.mask]="'url(#' + id + '-m0)'">
            @for (s of def().streaks; track $index) {
              <path class="streak" [attr.d]="s" />
            }
          </g>
        }
      }

      <g [attr.filter]="'url(#' + id + '-wobble)'">
        @for (d of def().draw ?? []; track $index) {
          <path #drawn [class]="'drawn drawn--' + d.color" [attr.d]="d.d" [attr.stroke-width]="d.width" />
        }
        @for (d of def().thin ?? []; track $index) {
          <path class="thin" [attr.d]="d" [attr.stroke-width]="lineWidth() * 0.5" />
        }
        @for (d of def().ink; track $index) {
          <path class="ink" [attr.d]="d" [attr.stroke-width]="lineWidth()" />
        }
      </g>
    </svg>
  `,
  styleUrl: './sketch.component.scss',
  host: { '[class]': '"sketch sketch--" + name()', 'aria-hidden': 'true' },
})
export class SketchComponent {
  readonly name = input.required<SketchKind>();
  /** Show colour (off for ink-only line drawings). */
  readonly paint = input(true);
  /** Draw fully on load instead of with the scroll (above the fold). */
  readonly eager = input(false);

  protected readonly id = `sk${++uid}`;
  protected readonly def = computed(() => SKETCHES[this.name()]);

  /** Stroke widths are set in viewBox units so every drawing reads alike on screen. */
  private readonly unit = computed(() => Math.max(this.def().viewBox[0], this.def().viewBox[1]) / 300);
  protected readonly lineWidth = computed(() => 6.5 * this.unit());
  protected readonly wobbleScale = computed(() => 3.2 * this.unit());
  protected readonly wobbleFreq = computed(() => (0.02 / this.unit()).toFixed(4));

  protected readonly paints = computed(() =>
    (this.def().paint ?? []).map((a) => {
      const size = Math.max(14 * this.unit(), Math.min(a.box[2], a.box[3]) / 3.2);
      return { ...a, size, brush: brushPath(a.box, size) };
    }),
  );

  private readonly brushes = viewChildren<ElementRef<SVGPathElement>>('brush');
  private readonly drawn = viewChildren<ElementRef<SVGPathElement>>('drawn');
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly scrub = inject(ScrollScrubService);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const strokes = [...this.brushes(), ...this.drawn()].map((r) => r.nativeElement);
      strokes.forEach((p) => {
        p.setAttribute('pathLength', '1');
        p.style.strokeDasharray = '1 1';
        p.style.strokeDashoffset = '1';
      });
      const n = strokes.length;
      if (!n) return;

      // Areas are coloured one after another with a little overlap.
      const apply = (progress: number) => {
        strokes.forEach((p, i) => {
          const from = (i / n) * 0.85;
          const to = from + (1 / n) * 0.85 + 0.15;
          const t = Math.min(1, Math.max(0, (progress - from) / (to - from)));
          p.style.strokeDashoffset = String(1 - t);
        });
      };

      if (this.eager()) {
        requestAnimationFrame(() => {
          this.host.nativeElement.classList.add('is-eager');
          apply(1);
        });
        return;
      }
      // Each area and stroke follows its own place on screen, so it is painted
      // while it is in view rather than while it is still below the fold.
      strokes.forEach((p) => {
        destroyRef.onDestroy(
          this.scrub.register(this.host.nativeElement, (t) => (p.style.strokeDashoffset = String(1 - t)), 0.92, 0.2, svgSpan(p)),
        );
      });
    });
  }
}
