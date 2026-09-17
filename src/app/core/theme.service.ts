import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject } from '@angular/core';
import { ClinicService } from './clinic.service';

const kebab = (key: string) => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

/** Writes theme tokens from config into CSS custom properties on <html>. */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  private readonly clinic = inject(ClinicService);

  constructor() {
    effect(() => {
      const { colors, fonts } = this.clinic.config().theme;
      const root = this.doc.documentElement;

      for (const [key, value] of Object.entries(colors)) {
        root.style.setProperty(`--c-${kebab(key)}`, value);
        root.style.setProperty(`--c-${kebab(key)}-rgb`, hexToRgb(value));
      }
      root.style.setProperty('--font-serif', fonts.serif);
      root.style.setProperty('--font-sans', fonts.sans);

      this.ensureStylesheet(fonts.stylesheetUrl);
      this.doc.querySelector('meta[name="theme-color"]')?.setAttribute('content', colors.background);
    });
  }

  private ensureStylesheet(href: string): void {
    if (!href) return;
    let link = this.doc.getElementById('theme-fonts') as HTMLLinkElement | null;
    if (!link) {
      link = this.doc.createElement('link');
      link.id = 'theme-fonts';
      link.rel = 'stylesheet';
      this.doc.head.appendChild(link);
    }
    if (link.href !== href) link.href = href;
  }
}

export function hexToRgb(hex: string): string {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}
