import { Component, computed, input, model, signal } from '@angular/core';

const norm = (s: string) => s.toLocaleLowerCase('tr').trim();

/**
 * A text field with a hand-cut suggestion list: paper-coloured, framed by a
 * green rule, with the active option on a green strip. Replaces the native
 * datalist, which can't be styled. Follows the ARIA combobox pattern: arrow
 * keys move through options, Enter picks, Escape closes.
 */
@Component({
  selector: 'app-combobox',
  template: `
    <label class="visually-hidden" [for]="inputId()">{{ label() || placeholder() }}</label>
    <input
      class="combo__input"
      type="text"
      role="combobox"
      autocomplete="off"
      aria-autocomplete="list"
      [id]="inputId()"
      [attr.aria-expanded]="showList()"
      [attr.aria-controls]="listId()"
      [attr.aria-activedescendant]="showList() && active() >= 0 ? optionId(active()) : null"
      [placeholder]="placeholder()"
      [value]="value()"
      (input)="onInput($any($event.target).value)"
      (focus)="open.set(true)"
      (click)="open.set(true)"
      (blur)="open.set(false)"
      (keydown)="onKey($event)"
    />
    @if (value()) {
      <button type="button" class="combo__clear" aria-label="Temizle" (mousedown)="$event.preventDefault()" (click)="clear()">
        ×
      </button>
    }
    @if (showList()) {
      <ul class="combo__list" role="listbox" [id]="listId()">
        @for (o of filtered(); track o; let i = $index) {
          <li
            class="combo__option"
            role="option"
            [id]="optionId(i)"
            [class.is-active]="i === active()"
            [attr.aria-selected]="i === active()"
            (mousedown)="$event.preventDefault()"
            (mouseenter)="active.set(i)"
            (click)="pick(o)"
          >
            {{ o }}
          </li>
        }
      </ul>
    }
  `,
  styles: `
    :host { position: relative; display: block; }

    .combo__input {
      display: block;
      width: 100%;
      padding: 8px 40px 14px 0;
      border: 0;
      border-bottom: 1px dashed var(--c-blue);
      background: transparent;
      color: var(--c-dark);
      font: inherit;
      font-size: 30px;
      font-weight: 300;
      outline: none;
    }
    .combo__input::placeholder { color: rgb(var(--c-dark-rgb) / 0.75); }
    .combo__input:focus { border-bottom-style: solid; }

    :host(.is-light) .combo__input { border-bottom-color: var(--c-background); color: var(--c-background); }
    :host(.is-light) .combo__input::placeholder { color: rgb(var(--c-background-rgb) / 0.9); }

    .combo__clear {
      position: absolute;
      right: 0;
      top: 14px;
      width: 32px;
      height: 32px;
      border: 0;
      background: none;
      color: var(--c-dark);
      font-size: 26px;
      line-height: 1;
      cursor: pointer;
    }
    :host(.is-light) .combo__clear { color: var(--c-background); }

    .combo__list {
      position: absolute;
      z-index: 5;
      top: calc(100% - 2px);
      left: 0;
      width: min(500px, 100%);
      max-height: 300px;
      margin: 0;
      padding: 0 0 8px;
      overflow-y: auto;
      overscroll-behavior: contain;
      list-style: none;
      background: var(--c-background);
      border: 2px solid var(--c-green);
      scrollbar-width: thin;
      scrollbar-color: var(--c-green) transparent;
      animation: combo-in 0.22s var(--ease) both;
      transform-origin: top left;
    }

    .combo__option {
      position: relative;
      padding: 16px 28px;
      color: var(--c-dark);
      font-size: 24px;
      font-weight: 400;
      letter-spacing: -0.3px;
      cursor: pointer;
    }
    /* Active option sits on a slightly skewed green strip, like a torn label. */
    .combo__option.is-active::before {
      content: '';
      position: absolute;
      inset: -2px -2px 0;
      z-index: -1;
      background: var(--c-green);
      clip-path: polygon(0 12%, 100% 0, 100% 100%, 0 100%);
    }
    .combo__option { isolation: isolate; }

    @keyframes combo-in {
      from { opacity: 0; transform: translateY(-6px) scaleY(0.96); }
    }

    @media (max-width: 768px) {
      .combo__input { font-size: 24px; }
      .combo__option { padding: 13px 20px; font-size: 20px; }
    }
    @media (prefers-reduced-motion: reduce) {
      .combo__list { animation: none; }
    }
  `,
})
export class ComboboxComponent {
  readonly inputId = input.required<string>();
  readonly options = input<readonly string[]>([]);
  readonly placeholder = input('');
  readonly label = input('');
  readonly value = model('');

  protected readonly open = signal(false);
  protected readonly active = signal(-1);

  protected readonly listId = computed(() => `${this.inputId()}-list`);
  protected readonly filtered = computed(() => {
    const q = norm(this.value());
    const all = this.options();
    if (!q || all.some((o) => norm(o) === q)) return all;
    return all.filter((o) => norm(o).includes(q));
  });
  protected readonly showList = computed(() => this.open() && this.filtered().length > 0);

  protected optionId(i: number): string {
    return `${this.inputId()}-opt-${i}`;
  }

  protected onInput(v: string): void {
    this.value.set(v);
    this.open.set(true);
    this.active.set(v ? 0 : -1);
  }

  protected pick(o: string): void {
    this.value.set(o);
    this.open.set(false);
    this.active.set(-1);
  }

  protected clear(): void {
    this.value.set('');
    this.active.set(-1);
    this.open.set(true);
  }

  protected onKey(e: KeyboardEvent): void {
    const n = this.filtered().length;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.open.set(true);
        if (n) this.active.update((i) => (i + 1) % n);
        this.scrollActive();
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.open.set(true);
        if (n) this.active.update((i) => (i <= 0 ? n - 1 : i - 1));
        this.scrollActive();
        break;
      case 'Enter':
        // Pick the highlighted option; otherwise let the form submit.
        if (this.showList() && this.active() >= 0) {
          e.preventDefault();
          this.pick(this.filtered()[this.active()]);
        }
        break;
      case 'Escape':
        if (this.open()) {
          e.preventDefault();
          this.open.set(false);
        }
        break;
    }
  }

  private scrollActive(): void {
    requestAnimationFrame(() => document.getElementById(this.optionId(this.active()))?.scrollIntoView({ block: 'nearest' }));
  }
}
