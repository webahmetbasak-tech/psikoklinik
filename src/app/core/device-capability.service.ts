import { Injectable, signal } from '@angular/core';

export type PerformanceTier = 'high' | 'mid' | 'low' | 'none';

export interface DeviceProfile {
  tier: PerformanceTier;
  webgl: boolean;
  touch: boolean;
  mobile: boolean;
  reducedMotion: boolean;
  pixelRatio: number;
  /** Suggested particle budget for the hero. */
  particles: number;
}

/**
 * Coarse capability detection used to scale visual effects. Deliberately
 * conservative: a premium site that stutters feels cheaper than a simpler one.
 */
@Injectable({ providedIn: 'root' })
export class DeviceCapabilityService {
  readonly profile = signal<DeviceProfile>(this.detect());
  readonly reducedMotion = signal(this.profile().reducedMotion);

  constructor() {
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    mq.addEventListener('change', () => {
      this.reducedMotion.set(mq.matches);
      this.profile.set(this.detect());
    });
  }

  private detect(): DeviceProfile {
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const touch = matchMedia('(pointer: coarse)').matches;
    const mobile = touch && Math.min(screen.width, screen.height) < 820;
    const cores = nav.hardwareConcurrency ?? 4;
    const memory = nav.deviceMemory ?? 4;
    const saveData = nav.connection?.saveData ?? false;
    const webgl = hasWebGL();

    let tier: PerformanceTier;
    if (!webgl) tier = 'none';
    else if (saveData || cores <= 2 || memory <= 2) tier = 'low';
    else if (mobile || cores <= 4 || memory <= 4) tier = mobile ? 'low' : 'mid';
    else tier = 'high';

    const particles = { high: 46000, mid: 26000, low: 11000, none: 0 }[tier];
    const pixelRatio = Math.min(devicePixelRatio || 1, tier === 'high' ? 2 : 1.5);

    return { tier, webgl, touch, mobile, reducedMotion, pixelRatio, particles };
  }
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}
