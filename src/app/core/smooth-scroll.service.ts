import { Injectable, inject, signal } from '@angular/core';
import { DeviceCapabilityService } from './device-capability.service';

/** Height of the fixed header, used as the scroll offset for anchors. */
const HEADER_OFFSET = 74;

/**
 * Native scrolling (no smooth-scroll library) with a small signal API:
 * current position, direction, and anchor navigation below the fixed header.
 */
@Injectable({ providedIn: 'root' })
export class SmoothScrollService {
  private readonly device = inject(DeviceCapabilityService);
  private lastY = 0;
  private locked = false;

  readonly scrollY = signal(0);
  readonly direction = signal<1 | -1>(1);

  init(): void {
    const update = () => {
      const y = window.scrollY;
      if (Math.abs(y - this.lastY) > 2) this.direction.set(y > this.lastY ? 1 : -1);
      this.lastY = y;
      this.scrollY.set(y);
    };
    addEventListener('scroll', update, { passive: true });
    update();
  }

  scrollTo(target: string | HTMLElement | number, offset = -HEADER_OFFSET): void {
    const el = typeof target === 'string' ? document.getElementById(target) : target;
    if (el === null) return;
    const top = typeof el === 'number' ? el : el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: this.device.reducedMotion() ? 'auto' : 'smooth' });
    if (el instanceof HTMLElement) {
      el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });
    }
  }

  stop(): void {
    if (this.locked) return;
    this.locked = true;
    document.documentElement.style.overflow = 'hidden';
  }

  start(): void {
    if (!this.locked) return;
    this.locked = false;
    document.documentElement.style.overflow = '';
  }
}
