# Alan — psychology practice website template

An Angular 22 site built around the idea "Create space for the mind". Each clinic is configured from **one file**.

```bash
npm install
npm start          # http://localhost:4200
npm run build      # dist/psikolog
```

## Configure a new clinic

Edit `src/app/config/clinic.config.ts`. Everything reads from it: header, hero, sections, footer, AI assistant, `<title>`, meta/OG tags, canonical URL, JSON-LD, favicon and theme colors. At runtime you can also swap the whole config with `ClinicService.load(config)`, for example to serve several clinics from one deployment.

| Field (flat name from the brief) | Location in config |
| --- | --- |
| `heroTitle`, `heroSubtitle` | `hero.title`, `hero.subtitle`. In `title`, `\|` makes a line break and `*text*` makes italic emphasis |
| `therapistBio`, `therapistImage` | `therapist.bio`, `therapist.image` (`src`, plus optional `avif`/`webp`) |
| `phone`, `whatsapp`, `email`, `address`, `city`, `district`, `googleMapsUrl`, `workingHours` | `contact.*` |
| `instagram` and other social links | `social.*` |
| `appointmentUrl` | a section anchor (`#ai-randevu`) or an external booking URL |
| SEO title/description | `seo.*` |
| theme colors/fonts | `theme.*`, written to CSS variables (`--c-accent`, `--c-accent-rgb`, …) |

## Structure

```
src/app/
  config/clinic.config.ts        single source of clinic data
  models/clinic.models.ts        ClinicConfig, Therapist, Service, ContactInfo, …
  core/
    clinic.service.ts            signals over config + derived links (tel:, wa.me)
    theme.service.ts             config → CSS custom properties + font stylesheet
    seo.service.ts               title, meta, OG, canonical, favicon, JSON-LD
    device-capability.service.ts performance tier, particle budget, reduced motion
    smooth-scroll.service.ts     Lenis on the GSAP ticker, synced with ScrollTrigger
  shared/                        appointment link directive, rich-line typography
  layout/                        header (compact on scroll, full-screen mobile menu), footer
  sections/
    hero-mind-map/               01 — particle artwork (done)
      engine/image-relief.ts     line-art image → line mask + depth → particles + texture
      engine/silhouette.ts       procedural face relief (fallback when no image is set)
      engine/silhouette.worker.ts  builds either one off the main thread
      engine/shaders.ts          formation, breathing, cursor wake, scroll landscape
      engine/mind-map-renderer.ts  Three.js renderer (framework-agnostic)
      engine/static-fallback.ts  Canvas 2D version when WebGL is unavailable
    mind-threads/                02 — phase 1 layout
    therapist-section/           03 — phase 1 layout
    services-landscape/          04 — phase 1 editorial index + hover moods
    ai-appointment/              05 — working scripted assistant (config-driven, emergency escalation)
    contact-section/             06 — phase 1 closing + contact details
```

## Hero: how it works

- **Artwork from an image.** `hero.figure.image` points to a line-art picture in `public/` (default: `hero/figure-relief-wide.webp`). A Web Worker extracts the dark contour lines using local contrast, so soft shading is ignored. Particles are placed on those lines, and the same mask is drawn as a crisp texture on a subdivided plane. `crop` trims frames, and `focus` (usually the face) is what the layout anchors on. Dark lines on a light ground work best; set `invert: true` for the opposite.
- **Fallback.** If `figure.image` is empty, a procedural face relief (`engine/silhouette.ts`) is generated instead.
- **GPU animation.** Formation (from the focus outward), breathing (the relief swells on the inhale), the cursor wake (12 trail samples: push, swirl and a travelling ripple, with a cap) and the scroll transformation all run in the vertex shaders. The particles and the line plane share them.
- **Scroll.** The relief grows ×4 and the artwork tips back into a landscape while about a third of the particles drift toward the next chapter.
- **Performance.** The artwork is built in a worker and Three.js loads lazily. Particle counts are 46k on high-tier devices, 26k mid-tier and 11k on mobile. Rendering pauses when the hero is off-screen or the tab is hidden, and quality drops once if the frame rate stays under 45 fps.
- **Accessibility.** With reduced motion the formed artwork is shown statically. Without WebGL, the line mask is drawn with Canvas 2D.
- **Backup.** The previous particle-silhouette version is in `backup/hero-mind-map-v1`. To restore it, replace `src/app/sections/hero-mind-map` with that folder.
