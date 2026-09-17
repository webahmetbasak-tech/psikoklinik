import { Component, DestroyRef, ElementRef, afterNextRender, inject, input } from '@angular/core';
import { ScrollScrubService, svgSpan } from '../core/scroll-scrub.service';

const SVG_NS = 'http://www.w3.org/2000/svg';

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

type Role = 'ink' | 'base' | 'paint';

/** Each file is downloaded once, however many times it appears on the page. */
const cache = new Map<string, Promise<string>>();
function load(src: string): Promise<string> {
  const url = new URL(src, document.baseURI).href;
  let text = cache.get(url);
  if (!text) {
    text = fetch(url).then((r) => (r.ok ? r.text() : ''));
    cache.set(url, text);
  }
  return text;
}

/** Classifies a fill: dark lines, near-neutral paper tones, or colour to paint in. */
function roleOf(fill: string | null): Role {
  if (!fill || fill === 'none') return 'base';
  if (fill.startsWith('url(')) return 'paint';
  const hex = fill.replace('#', '');
  if (!/^[0-9a-f]{3,6}$/i.test(hex)) return 'paint';
  const full = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex;
  const n = parseInt(full, 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const sat = Math.max(r, g, b) - Math.min(r, g, b);
  if (lum < 0.35) return 'ink';
  if (sat < 0.05 && lum > 0.85) return 'base';
  return 'paint';
}

/**
 * Zig-zag marker strokes sweeping a box row by row. Consecutive passes are up
 * to 1.8 steps apart where the zig-zag turns, so a step of half the brush
 * width keeps the coverage free of gaps.
 */
function brush(box: Box, size: number): string {
  const step = size * 0.5;
  const rows = Math.max(1, Math.ceil(box.h / step));
  const pad = size * 0.45;
  const left = box.x - pad;
  const right = box.x + box.w + pad;
  let d = `M${left.toFixed(1)} ${(box.y + step * 0.2).toFixed(1)}`;
  for (let i = 0; i < rows; i++) {
    const side = i % 2 === 0 ? right : left;
    const yEnd = box.y + (i + 0.8) * step;
    d += ` L${side.toFixed(1)} ${yEnd.toFixed(1)}`;
    if (i < rows - 1) d += ` L${side.toFixed(1)} ${(yEnd + step * 0.2).toFixed(1)}`;
  }
  return d;
}

const overlaps = (a: Box, b: Box, gap: number) =>
  a.x - gap < b.x + b.w && b.x - gap < a.x + a.w && a.y - gap < b.y + b.h && b.y - gap < a.y + a.h;

const union = (a: Box, b: Box): Box => {
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);
  return { x, y, w: Math.max(a.x + a.w, b.x + b.w) - x, h: Math.max(a.y + a.h, b.y + b.h) - y };
};

/**
 * Inlines a hand-drawn SVG from /public. Line work and paper tones are always
 * visible; coloured shapes are grouped into the objects they belong to and
 * each object is coloured in by a marker brush as the drawing scrolls into
 * view — and wiped again when scrolling back up.
 */
@Component({
  selector: 'app-painted-svg',
  template: '',
  styles: `
    :host { display: block; }
    :host ::ng-deep .painted__svg { display: block; width: 100%; height: auto; overflow: visible; }
    :host ::ng-deep .painted__brush { transition: stroke-dashoffset 0.25s linear; }
    @media (prefers-reduced-motion: reduce) {
      :host ::ng-deep .painted__brush { transition: none; }
    }
  `,
  host: { 'aria-hidden': 'true' },
})
export class PaintedSvgComponent {
  /** Path under /public, e.g. `hero/a.svg`. */
  readonly src = input.required<string>();
  /** Colour shown where paint hasn't arrived yet (the surface behind the drawing). */
  readonly paper = input('var(--c-background)');
  /**
   * Viewport fractions (from the top) where an object's centre starts and
   * finishes being painted. Like the reference, the paint is spread over most
   * of the trip up the screen — it keeps going while the drawing is in full
   * view, slowly enough to read as a brush at work.
   */
  readonly start = input(0.92);
  readonly end = input(0.2);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly scrub = inject(ScrollScrubService);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      let started = false;
      const show = async () => {
        if (started) return;
        started = true;
        const text = await load(this.src());
        if (destroyRef.destroyed || !text) return;
        destroyRef.onDestroy(this.mount(text));
      };
      // Build drawings near the viewport first, and the rest once the browser
      // is idle, so first paint stays light on phones while every drawing
      // still has its final size long before it is reached (no layout jumps).
      if (!('IntersectionObserver' in window)) return void show();
      const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1200));
      idle(() => show(), { timeout: 2500 });
      const io = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          io.disconnect();
          void show();
        },
        { rootMargin: '100% 0px' },
      );
      io.observe(this.host);
      destroyRef.onDestroy(() => io.disconnect());
    });
  }

  private mount(markup: string): () => void {
    const source = new DOMParser().parseFromString(markup, 'image/svg+xml').documentElement;
    if (source.nodeName !== 'svg') return () => {};

    // Keep only drawing elements.
    source.querySelectorAll('script, foreignObject, metadata').forEach((el) => el.remove());
    source.querySelectorAll('*').forEach((el) => {
      [...el.attributes].forEach((a) => a.name.startsWith('on') && el.removeAttribute(a.name));
    });

    // Namespace internal ids so the same file can appear more than once.
    const uid = Math.random().toString(36).slice(2, 7);
    source.querySelectorAll('[id]').forEach((el) => el.setAttribute('id', `${uid}-${el.id}`));
    source.querySelectorAll('*').forEach((el) => {
      for (const a of [...el.attributes]) {
        if (a.value.includes('url(#')) el.setAttribute(a.name, a.value.replace(/url\(#/g, `url(#${uid}-`));
        if ((a.name === 'href' || a.name === 'xlink:href') && a.value.startsWith('#')) {
          el.setAttribute(a.name, `#${uid}-${a.value.slice(1)}`);
        }
      }
    });

    const svg = document.importNode(source, true) as unknown as SVGSVGElement;
    svg.removeAttribute('width');
    svg.removeAttribute('height');
    svg.classList.add('painted__svg');
    this.host.replaceChildren(svg);

    const [vx, vy, vw, vh] = (svg.getAttribute('viewBox') ?? '0 0 1024 1024').split(/[\s,]+/).map(Number);
    const shapes = [...svg.querySelectorAll<SVGGraphicsElement>('path, rect, circle, ellipse, polygon')].filter(
      (el) => !el.closest('defs, clipPath, mask'),
    );

    // Drop a full-canvas background so the page shows through.
    const paint: Array<{ el: SVGGraphicsElement; box: Box }> = [];
    let content: Box | null = null;
    for (const el of shapes) {
      const b = el.getBBox();
      const box = { x: b.x, y: b.y, w: b.width, h: b.height };
      if (box.w >= vw * 0.95 && box.h >= vh * 0.95) {
        el.remove();
        continue;
      }
      if (box.w === 0 && box.h === 0) continue;
      content = content ? union(content, box) : box;
      if (roleOf(el.getAttribute('fill')) === 'paint') paint.push({ el, box });
    }

    // Crop the view to the drawing itself.
    if (content) {
      const m = Math.max(vw, vh) * 0.02;
      svg.setAttribute(
        'viewBox',
        `${Math.max(vx, content.x - m)} ${Math.max(vy, content.y - m)} ${content.w + m * 2} ${content.h + m * 2}`,
      );
    }

    // Group coloured shapes into objects (touching bounding boxes).
    const clusters: Array<{ box: Box; els: SVGGraphicsElement[] }> = [];
    for (const item of paint) {
      let target = clusters.find((c) => overlaps(c.box, item.box, 4));
      if (!target) {
        target = { box: item.box, els: [] };
        clusters.push(target);
      }
      target.box = union(target.box, item.box);
      target.els.push(item.el);
      for (let i = clusters.length - 1; i >= 0; i--) {
        const other = clusters[i];
        if (other !== target && overlaps(other.box, target.box, 4)) {
          target.box = union(target.box, other.box);
          target.els.push(...other.els);
          clusters.splice(i, 1);
        }
      }
    }

    // Large objects first, then left to right.
    clusters.sort((a, b) => b.box.w * b.box.h - a.box.w * a.box.h || a.box.x - b.box.x);

    const defs = svg.querySelector('defs') ?? svg.insertBefore(document.createElementNS(SVG_NS, 'defs'), svg.firstChild);
    const strokes = clusters.map((c, i) => {
      const id = `${uid}-paint-${i}`;
      const size = Math.max(18, Math.min(64, Math.min(c.box.w, c.box.h) / 3));
      const mask = document.createElementNS(SVG_NS, 'mask');
      mask.setAttribute('id', id);
      mask.setAttribute('maskUnits', 'userSpaceOnUse');
      mask.setAttribute('x', String(vx - 100));
      mask.setAttribute('y', String(vy - 100));
      mask.setAttribute('width', String(vw + 200));
      mask.setAttribute('height', String(vh + 200));
      const stroke = document.createElementNS(SVG_NS, 'path');
      stroke.setAttribute('d', brush(c.box, size));
      stroke.setAttribute('fill', 'none');
      stroke.setAttribute('stroke', '#fff');
      stroke.setAttribute('stroke-width', String(size));
      stroke.setAttribute('stroke-linecap', 'round');
      stroke.setAttribute('stroke-linejoin', 'round');
      stroke.setAttribute('pathLength', '1');
      stroke.classList.add('painted__brush');
      stroke.style.strokeDasharray = '1 1';
      stroke.style.strokeDashoffset = '1';
      mask.appendChild(stroke);
      defs.appendChild(mask);
      // Mask each shape in place so the drawing's layer order is untouched.
      // A paper-coloured copy underneath keeps unpainted areas blank instead
      // of exposing the dark line shapes the colour normally covers.
      c.els.forEach((el) => {
        const paper = el.cloneNode(false) as SVGGraphicsElement;
        paper.removeAttribute('fill');
        paper.style.fill = this.paper();
        paper.removeAttribute('mask');
        el.parentNode?.insertBefore(paper, el);
        el.setAttribute('mask', `url(#${id})`);
      });
      return stroke;
    });

    // Each object follows its own place on screen, so it is coloured in while
    // the visitor can see it — top of the drawing first, bottom last.
    const unregister = strokes.map((s) =>
      this.scrub.register(this.host, (p) => (s.style.strokeDashoffset = String(1 - p)), this.start(), this.end(), svgSpan(s)),
    );
    return () => unregister.forEach((u) => u());
  }
}
