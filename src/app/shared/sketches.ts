/**
 * Hand-drawn marker illustrations as data.
 *
 * - `ink`   heavy outlines, always visible
 * - `thin`  fine detail lines, always visible
 * - `paint` flat colour areas revealed by a scroll-scrubbed marker brush,
 *           in array order
 * - `draw`  strokes that are themselves drawn by the scroll (arrows)
 * - `streaks` paper-coloured dry-marker scratches over the paint
 */

export type PaintColor = 'orange' | 'blue' | 'lilac' | 'green' | 'sand';

export interface PaintArea {
  d: string;
  color: PaintColor;
  /** Region the brush sweeps: x, y, w, h. */
  box: [number, number, number, number];
  evenodd?: boolean;
}

export interface SketchDef {
  viewBox: [number, number];
  ink: string[];
  thin?: string[];
  paint?: PaintArea[];
  draw?: Array<{ d: string; color: PaintColor; width: number }>;
  streaks?: string[];
}

export type SketchKind =
  | 'armchair'
  | 'loveseat'
  | 'sofa'
  | 'teapot'
  | 'plant'
  | 'succulent'
  | 'door'
  | 'window'
  | 'books'
  | 'arrow'
  | 'lounge'
  | 'stamp';

/** Front view seating with `n` seats; `paint` adds body and pillow colours. */
function seating(n: number, body: PaintColor, pillows: PaintColor): SketchDef {
  const cw = 86;
  const w = cw * n;
  const L = 70;
  const R = L + w;
  const ink: string[] = [
    // backrest with a rolled top edge
    `M${L + 2} 118V56c-2-22 12-32 32-32h${w - 66}c22 0 34 10 32 32l-2 62`,
    // arms
    `M${L + 2} 98c-34-8-54 8-52 32l4 54c14 4 34 4 48 0`,
    `M${R - 2} 98c34-8 54 8 52 32l-4 54c-14 4-34 4-48 0`,
    `M${L - 44} 116c4-10 14-14 22-10M${R + 44} 116c-4-10-14-14-22-10`,
    // seat block
    `M${L} 124c${w * 0.3}-8 ${w * 0.7}-8 ${w} 0l2 60c-${w * 0.35} 6-${w * 0.7} 6-${w + 4} 0z`,
    // legs
    `M${L - 32} 186l-8 24M${R + 32} 186l8 24M${L + 10} 190l-4 16M${R - 10} 190l4 16`,
  ];
  const thin: string[] = [`M${L + 6} 150c${w * 0.4}-4 ${w * 0.6}-4 ${w - 12} 0`];
  const pillowPaths: string[] = [];
  for (let i = 0; i < n; i++) {
    const cx = L + cw * i + cw / 2;
    if (i > 0) {
      const x = L + cw * i;
      ink.push(`M${x} 30v88M${x + 2} 126v58`);
    }
    const tilt = i % 2 ? 4 : -4;
    const p = `M${cx - 30} ${56 + tilt}c12-14 50-16 60-4 4 16 2 34-4 44-18 6-44 6-54-2-6-12-6-26-2-38z`;
    pillowPaths.push(p);
    ink.push(p);
    thin.push(`M${cx - 18} ${74 + tilt}c10 4 24 4 34-2`);
  }
  return {
    viewBox: [w + 140, 220],
    ink,
    thin,
    paint: [
      {
        // Backrest, both arms and the seat block, following the ink.
        d:
          `M${L + 2} 124V56c-2-22 12-32 32-32h${w - 66}c22 0 34 10 32 32l-2 68z` +
          `M${L + 2} 98c-34-8-54 8-52 32l4 54c14 4 34 4 48 0z` +
          `M${R - 2} 98c34-8 54 8 52 32l-4 54c-14 4-34 4-48 0z` +
          `M${L} 124c${w * 0.3}-8 ${w * 0.7}-8 ${w} 0l2 60c-${w * 0.35} 6-${w * 0.7} 6-${w + 4} 0z`,
        color: body,
        box: [L - 52, 22, w + 104, 170],
      },
      { d: pillowPaths.join(''), color: pillows, box: [L, 40, w, 70] },
    ],
    streaks: [`M${L + 14} 176l40-40M${L + w * 0.6} 180l46-46`],
  };
}

export const SKETCHES: Record<SketchKind, SketchDef> = {
  armchair: seating(1, 'orange', 'lilac'),
  loveseat: seating(2, 'blue', 'lilac'),
  sofa: seating(3, 'blue', 'lilac'),

  door: {
    viewBox: [420, 540],
    ink: [
      'M40 522l6-464 212-6 4 470',
      'M258 54l142-34-6 482-132-32z',
      'M282 96l92-24-2 170-90 18zM286 302l84-18-2 158-80 16z',
      'M290 276c12-10 24-2 16 10M300 284v10',
      'M14 524c90 2 200-2 290 0',
      'M72 524c24-16 144-16 172 0-26 14-146 14-172 0z',
    ],
    thin: ['M62 78l-4 432M240 74l2 438', 'M296 120l62-16M300 330l56-12'],
    paint: [
      { d: 'M260 56l138-32-6 476-130-30z', color: 'blue', box: [254, 20, 150, 484] },
      { d: 'M72 524c24-16 144-16 172 0-26 14-146 14-172 0z', color: 'lilac', box: [66, 506, 186, 34] },
    ],
    streaks: ['M292 420l86-26M292 380l84-24M296 200l74-20'],
  },

  books: {
    viewBox: [240, 340],
    ink: [
      'M40 202c20-16 140-16 160 0-20 16-140 16-160 0zM40 202v22c20 16 140 16 160 0v-22',
      'M62 236l-18 96M178 236l18 96M122 242l-2 82',
      'M58 170l126-6 2 32-126 4z',
      'M76 138l94-4 2 30-94 4z',
      'M100 92h46l-4 44h-38z',
      'M146 102c22 0 22 26-2 26',
    ],
    thin: ['M52 292h136', 'M66 184l110-4M84 152l80-2', 'M114 80c-8-14 10-22 2-38M132 80c-7-14 11-22 3-38'],
    paint: [
      { d: 'M40 202c20-16 140-16 160 0v22c-20 16-140 16-160 0z', color: 'blue', box: [38, 184, 164, 58] },
      { d: 'M58 170l126-6 2 32-126 4z', color: 'orange', box: [54, 160, 136, 44] },
      { d: 'M76 138l94-4 2 30-94 4z', color: 'lilac', box: [72, 130, 104, 42] },
      { d: 'M100 92h46l-4 44h-38z', color: 'green', box: [96, 88, 54, 52] },
    ],
    streaks: ['M60 216l40-8M150 214l34-6', 'M84 186l30-20'],
  },

  teapot: {
    viewBox: [280, 240],
    ink: [
      'M60 186c-34-12-34-86 22-96h92c56 10 56 84 22 96z',
      'M98 90c4-30 58-30 62 0M124 62c-4-14 14-14 10 0',
      'M60 128c-30-6-42-28-52-44l16-4c10 18 22 28 38 32',
      'M198 108c46 0 52 58 4 62',
      'M206 196h54l-7 30h-40zM196 228c24 4 52 4 74 0',
    ],
    thin: ['M92 150h4M122 140h4M152 150h4M108 164h4M138 166h4', 'M226 184c-6-12 8-18 2-30M242 184c-6-12 8-18 2-30'],
    paint: [
      { d: 'M60 186c-34-12-34-86 22-96h92c56 10 56 84 22 96z', color: 'lilac', box: [24, 86, 208, 104] },
      { d: 'M206 196h54l-7 30h-40z', color: 'green', box: [202, 192, 62, 38] },
    ],
    streaks: ['M76 166l58-50M108 178l58-50'],
  },

  window: {
    viewBox: [264, 310],
    ink: [
      'M38 284V120c0-110 188-110 188 0v164',
      'M56 272V122c0-88 152-88 152 0v150z',
      'M132 36v236M56 178h152',
      'M20 284h224l-8 18H28z',
    ],
    thin: ['M70 150c8-24 24-40 50-48', 'M180 266h32l-4 16h-24z'],
    paint: [
      { d: 'M56 272V122c0-88 152-88 152 0v150z', color: 'blue', box: [52, 32, 160, 244] },
      { d: 'M20 284h224l-8 18H28z', color: 'lilac', box: [18, 280, 228, 26] },
    ],
    streaks: ['M74 246l44-38M150 150l46-40M150 244l40-34'],
  },

  plant: {
    viewBox: [220, 310],
    ink: [
      'M110 66c18 42 8 114-8 164-6-52-2-114 8-164z',
      'M28 138c32 10 58 62 64 102-22-30-48-62-64-102z',
      'M198 116c-32 14-54 66-64 114 24-34 50-68 64-114z',
      'M50 232h120v24H50zM58 256l12 48h80l12-48',
    ],
    thin: ['M110 90c-2 50-4 100-6 138M40 150c20 20 38 50 50 82M188 130c-18 26-34 60-50 96'],
    paint: [
      {
        d: 'M110 66c18 42 8 114-8 164-6-52-2-114 8-164zM28 138c32 10 58 62 64 102-22-30-48-62-64-102zM198 116c-32 14-54 66-64 114 24-34 50-68 64-114z',
        color: 'green',
        box: [24, 60, 180, 176],
      },
      { d: 'M50 232h120v24H50zM58 256l12 48h80l12-48z', color: 'orange', box: [46, 228, 128, 80] },
    ],
  },

  succulent: {
    viewBox: [164, 176],
    ink: ['M30 92l22-48 18 42 12-60 14 60 16-50 20 56', 'M18 92c40-4 90-4 128 0v22H18zM26 114l14 54h84l14-54'],
    thin: ['M52 50l6 38M82 30v56M112 42l-4 46'],
    paint: [
      { d: 'M30 92l22-48 18 42 12-60 14 60 16-50 20 56z', color: 'green', box: [26, 24, 116, 72] },
      { d: 'M18 92c40-4 90-4 128 0v22H18zM26 114l14 54h84l14-54z', color: 'lilac', box: [14, 88, 136, 84] },
    ],
  },

  lounge: {
    viewBox: [640, 480],
    ink: [
      'M40 330h110l-10 130H55zM35 320h120v25H35z',
      'M95 320c-5-70-25-120-65-160M98 320c12-80 42-130 82-170M96 320c0-80 4-140 14-230',
      'M110 90c15 40 5 110-10 160-5-50 0-110 10-160zM30 160c30 10 55 60 60 100-20-30-45-60-60-100zM176 150c-26 16-46 58-56 96 18-30 40-56 56-96z',
      'M256 400c-16-80-18-250 4-280 30-35 110-35 140-10',
      'M400 110c30 30 70 90 120 120 60 15 85 60 78 100-8 50-48 75-98 80H300',
      'M300 300c60-40 140-50 220-30M256 400c16 14 30 16 44 10',
      'M300 410l-20 60M500 410l30 58M400 412l2 48',
    ],
    thin: ['M290 150c20-10 60-12 90 0M470 330c-10 14-8 30 4 40', 'M60 360h80'],
    paint: [
      {
        d: 'M110 90c15 40 5 110-10 160-5-50 0-110 10-160zM30 160c30 10 55 60 60 100-20-30-45-60-60-100zM176 150c-26 16-46 58-56 96 18-30 40-56 56-96z',
        color: 'green',
        box: [26, 86, 154, 176],
      },
      {
        d: 'M262 380c-18-80-16-230 8-256 30-30 110-30 140-4 30 30 70 90 120 118 60 16 76 60 68 100-8 44-50 60-98 62H300c-18 0-34-6-38-20z',
        color: 'lilac',
        box: [240, 96, 364, 318],
      },
      { d: 'M40 330h110l-10 130H55zM35 320h120v25H35z', color: 'orange', box: [32, 316, 126, 146] },
    ],
    streaks: ['M300 360l120-90M340 390l140-100M480 360l70-50'],
  },

  arrow: {
    viewBox: [310, 220],
    ink: [],
    draw: [{ d: 'M292 18c-60 50-140 102-250 152 30 6 60 10 92 12M42 170c14-20 30-36 44-52', color: 'lilac', width: 14 }],
  },

  stamp: {
    viewBox: [120, 120],
    ink: [],
    thin: ['M34 96V56c0-30 52-30 52 0v40zM60 30v66M34 66h52M24 100h72', 'M92 30a8 8 0 1 0-16 0 8 8 0 1 0 16 0'],
  },
};
