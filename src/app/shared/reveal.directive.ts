import { Directive, ElementRef, OnDestroy, afterNextRender, inject, input } from '@angular/core';

/**
 * Fades and lifts an element into place the first time it enters the
 * viewport. Children of the element can opt into the same trigger with
 * `data-reveal-child` and are staggered.
 */
@Directive({
  selector: '[appReveal]',
  host: { class: 'reveal' },
})
export class RevealDirective implements OnDestroy {
  /** Delay in ms before the reveal starts. */
  readonly revealDelay = input(0);

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private io?: IntersectionObserver;

  constructor() {
    afterNextRender(() => {
      const node = this.el.nativeElement;
      node.style.setProperty('--reveal-delay', `${this.revealDelay()}ms`);
      node.querySelectorAll<HTMLElement>('[data-reveal-child]').forEach((c, i) => {
        c.style.setProperty('--reveal-delay', `${this.revealDelay() + 90 * (i + 1)}ms`);
      });
      this.io = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          node.classList.add('is-revealed');
          this.io?.disconnect();
        },
        { rootMargin: '0px 0px -12% 0px' },
      );
      this.io.observe(node);
    });
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
  }
}
