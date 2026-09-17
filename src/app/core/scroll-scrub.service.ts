import { Injectable, inject } from '@angular/core';
import { DeviceCapabilityService } from './device-capability.service';

/** Vertical extent of something on screen, in viewport pixels. */
export interface ScrubSpan {
  top: number;
  bottom: number;
}

interface ScrubItem {
  el: Element;
  /** Optional on-screen area to follow instead of the element's top edge. */
  probe: (() => ScrubSpan) | null;
  /** The section the drawing lives in; it must be fully painted by its end. */
  section: Element | null;
  /** Nearest position: sticky ancestor, whose stuck offset is taken back out. */
  sticky: HTMLElement | null;
  /** The sticky ancestor's distance from its parent while it is not stuck. */
  stickyOffset: number | null;
  start: number;
  end: number;
  cb: (progress: number) => void;
  last: number;
}

/** Shortest scroll distance (fraction of the viewport) any effect is spread over. */
const MIN_SPAN = 0.15;

/**
 * A section counts as ended once its bottom edge has risen to this fraction
 * of the viewport — most of the screen already shows the next section.
 */
const SECTION_END = 0.35;

function stickyAncestor(el: Element): HTMLElement | null {
  for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
    if (getComputedStyle(n).position === 'sticky') return n;
  }
  return null;
}

/**
 * One scroll listener for every scroll-scrubbed drawing on the page.
 *
 * Progress is 0 while the tracked position sits below `start` (fraction of
 * the viewport height from the top) and reaches 1 when it has risen to `end`.
 * It runs both ways, so scrolling back up rewinds the effect.
 *
 * The tracked position is the element's top edge, or — when a `probe` is
 * given — the vertical centre of that area. Drawings pass one probe per
 * coloured area, so each area is painted while it is actually in view rather
 * than while it is still below the fold.
 *
 * Two limits keep everything finishing on screen: progress reaches 1 no later
 * than the moment the section's end is clearly in view, and no later than the
 * page can scroll.
 *
 * Inside a sticky column the drawing stops moving while the column is stuck;
 * its position is measured as if the column scrolled normally, so its paint
 * still spans a short, noticeable stretch of scrolling.
 */
@Injectable({ providedIn: 'root' })
export class ScrollScrubService {
  private readonly device = inject(DeviceCapabilityService);
  private readonly items = new Set<ScrubItem>();
  private frame = 0;
  private bound = false;
  /**
   * Viewport height used for progress. Mobile browsers resize the viewport
   * as their address bar slides in and out during a touch scroll; following
   * that would make drawings jump, so the height only updates when the width
   * changes too (rotation, window resize).
   */
  private vh = 0;
  private vw = 0;

  register(
    el: Element,
    cb: (progress: number) => void,
    start = 0.95,
    end = 0.4,
    probe: (() => ScrubSpan) | null = null,
  ): () => void {
    if (this.device.reducedMotion()) {
      cb(1);
      return () => {};
    }
    const item: ScrubItem = {
      el,
      probe,
      section: el.closest('section'),
      sticky: stickyAncestor(el),
      stickyOffset: null,
      start,
      end,
      cb,
      last: -1,
    };
    this.items.add(item);
    this.bind();
    this.measure(item);
    return () => this.items.delete(item);
  }

  private bind(): void {
    if (this.bound) return;
    this.bound = true;
    const schedule = () => {
      if (!this.frame) this.frame = requestAnimationFrame(this.tick);
    };
    addEventListener('scroll', schedule, { passive: true });
    addEventListener(
      'resize',
      () => {
        if (innerWidth !== this.vw) this.vh = 0;
        schedule();
      },
      { passive: true },
    );
    // Touch and momentum scrolling also report through scroll events; the
    // extra hook keeps the paint in step with a finger drag on older WebKit.
    addEventListener('touchmove', schedule, { passive: true });
  }

  private readonly tick = () => {
    this.frame = 0;
    for (const item of this.items) this.measure(item);
  };

  private measure(item: ScrubItem): void {
    if (!this.vh) {
      this.vh = document.documentElement.clientHeight || innerHeight;
      this.vw = innerWidth;
    }
    const vh = this.vh;
    let pos: number;
    if (item.probe) {
      const span = item.probe();
      pos = (span.top + span.bottom) / 2;
    } else {
      pos = item.el.getBoundingClientRect().top;
    }
    // Hidden (e.g. display: none on this breakpoint): nothing to follow.
    if (!Number.isFinite(pos)) return;
    if (item.sticky) pos += this.unstick(item);

    let startY = item.start * vh;
    let endY = item.end * vh;
    // Where the tracked position will be once the section's end is on screen,
    // and once the page can't scroll any further: it must be done by then.
    const scroller = document.scrollingElement ?? document.documentElement;
    const atPageEnd = pos - (scroller.scrollHeight - vh - scroller.scrollTop);
    let limit = atPageEnd;
    if (item.section) limit = Math.max(limit, SECTION_END * vh - (item.section.getBoundingClientRect().bottom - pos));
    if (limit > endY) {
      endY = limit;
      startY = Math.max(startY, endY + MIN_SPAN * vh);
    }

    const p = Math.min(1, Math.max(0, (startY - pos) / (startY - endY)));
    if (Math.abs(p - item.last) < 0.002) return;
    item.last = p;
    item.cb(p);
  }

  /** How far the sticky ancestor has been held back from its normal place. */
  private unstick(item: ScrubItem): number {
    const sticky = item.sticky!;
    const parent = sticky.parentElement;
    if (!parent) return 0;
    const top = sticky.getBoundingClientRect().top;
    const parentTop = parent.getBoundingClientRect().top;
    if (item.stickyOffset === null) {
      // Learn the natural offset while the column isn't stuck.
      const stuckAt = parseFloat(getComputedStyle(sticky).top);
      if (Number.isFinite(stuckAt) && Math.abs(top - stuckAt) < 1 && parentTop < stuckAt) return 0;
      item.stickyOffset = top - parentTop;
    }
    return parentTop + item.stickyOffset - top;
  }
}

/**
 * A probe for an SVG shape — even one inside a <mask>, which has no box of its
 * own on screen. The shape's box is measured once; each call only maps it
 * through the drawing's current screen transform.
 */
export function svgSpan(shape: SVGGraphicsElement): () => ScrubSpan {
  const b = shape.getBBox();
  return () => {
    const m = shape.ownerSVGElement?.getScreenCTM();
    if (!m) return { top: Infinity, bottom: Infinity };
    const y1 = m.b * b.x + m.d * b.y + m.f;
    const y2 = m.b * (b.x + b.width) + m.d * (b.y + b.height) + m.f;
    return { top: Math.min(y1, y2), bottom: Math.max(y1, y2) };
  };
}
