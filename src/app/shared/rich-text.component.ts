import { Component, computed, input } from '@angular/core';
import { parseRichLines } from '../core/clinic.service';

/** Renders config copy with `|` line breaks and `*emphasis*` as masked lines. */
@Component({
  selector: 'app-rich-lines',
  template: `
    @for (line of lines(); track $index) {
      <span class="line"
        ><span class="line__inner"
          >@for (seg of line; track $index) {
            @if (seg.em) {<em>{{ seg.text }}</em>} @else {{{ seg.text }}}
          }</span
        ></span
      >
    }
  `,
  styles: `
    :host { display: contents; }
    /* Room above and below for Turkish diacritics (Ö, Ş, Ç) inside the reveal mask. */
    .line { display: block; overflow: hidden; padding: 0.16em 0 0.1em; margin: -0.16em 0 -0.1em; }
    .line__inner { display: inline-block; will-change: transform; }
  `,
})
export class RichLinesComponent {
  readonly text = input.required<string>();
  protected readonly lines = computed(() => parseRichLines(this.text()));
}
