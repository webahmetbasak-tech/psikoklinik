import { Component, DestroyRef, afterNextRender, computed, effect, inject, signal } from '@angular/core';
import { ClinicService } from '../../core/clinic.service';
import { SmoothScrollService } from '../../core/smooth-scroll.service';
import { AppointmentLinkDirective } from '../../shared/appointment-link.directive';
import { LogoComponent } from '../../shared/logo.component';

@Component({
  selector: 'app-header',
  imports: [AppointmentLinkDirective, LogoComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: {
    '[class.is-in]': 'entered()',
    '[class.is-hidden]': 'hidden()',
    '[class.is-open]': 'menuOpen()',
    '(document:keydown.escape)': 'closeMenu()',
  },
})
export class HeaderComponent {
  private readonly clinic = inject(ClinicService);
  private readonly scroll = inject(SmoothScrollService);

  protected readonly config = this.clinic.config;
  protected readonly nav = computed(() => this.config().navigation);
  protected readonly menuOpen = signal(false);
  protected readonly entered = signal(false);
  protected readonly active = signal<string | null>(null);

  /** Slides away while reading down, returns as soon as the reader scrolls up. */
  protected readonly hidden = computed(
    () => !this.menuOpen() && this.scroll.direction() === 1 && this.scroll.scrollY() > 300,
  );

  constructor() {
    afterNextRender(() => setTimeout(() => this.entered.set(true), 120));

    effect(() => {
      document.documentElement.classList.toggle('menu-open', this.menuOpen());
    });

    // Highlight the nav item of the section in view.
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) if (e.isIntersecting) this.active.set(e.target.id);
        },
        { rootMargin: '-45% 0px -50% 0px' },
      );
      for (const item of this.nav()) {
        const el = document.getElementById(item.target);
        if (el) io.observe(el);
      }
      destroyRef.onDestroy(() => {
        io.disconnect();
        document.documentElement.classList.remove('menu-open');
      });
    });
  }

  protected go(target: string, event: Event): void {
    event.preventDefault();
    this.menuOpen.set(false);
    this.scroll.scrollTo(target);
  }

  protected toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
