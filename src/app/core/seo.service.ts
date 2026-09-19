import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ClinicService } from './clinic.service';

/** Title, meta, Open Graph, canonical, favicon and JSON-LD — all from config. */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly doc = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly clinic = inject(ClinicService);

  constructor() {
    effect(() => {
      const c = this.clinic.config();
      const url = c.websiteUrl.replace(/\/$/, '');
      const ogImage = /^https?:/.test(c.seo.ogImage) ? c.seo.ogImage : `${url}/${c.seo.ogImage}`;

      this.doc.documentElement.lang = c.language;
      this.title.setTitle(c.seo.title);

      const tags: Array<{ name?: string; property?: string; content: string }> = [
        { name: 'description', content: c.seo.description },
        { name: 'keywords', content: c.seo.keywords.join(', ') },
        { name: 'author', content: c.psychologistName },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: c.clinicName },
        { property: 'og:title', content: c.seo.title },
        { property: 'og:description', content: c.seo.description },
        { property: 'og:url', content: url },
        { property: 'og:image', content: ogImage },
        { property: 'og:locale', content: c.seo.locale },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: c.seo.title },
        { name: 'twitter:description', content: c.seo.description },
        { name: 'twitter:image', content: ogImage },
      ];
      for (const tag of tags) {
        const selector = tag.name ? `name="${tag.name}"` : `property="${tag.property}"`;
        this.meta.updateTag(tag as Record<string, string>, selector);
      }

      this.upsertLink('canonical', url);
      this.upsertLink('icon', c.favicon);
      this.upsertJsonLd(c);
    });
  }

  private upsertLink(rel: string, href: string): void {
    let link = this.doc.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
    if (!link) {
      link = this.doc.createElement('link');
      link.rel = rel;
      this.doc.head.appendChild(link);
    }
    link.href = href;
  }

  private upsertJsonLd(c: ReturnType<ClinicService['config']>): void {
    const data = {
      '@context': 'https://schema.org',
      '@type': c.seo.schemaType,
      name: c.clinicName,
      description: c.seo.description,
      url: c.websiteUrl,
      telephone: c.contact.phone,
      email: c.contact.email || undefined,
      image: c.seo.ogImage,
      priceRange: c.seo.priceRange,
      address: {
        '@type': 'PostalAddress',
        streetAddress: c.contact.address,
        addressLocality: c.contact.district,
        addressRegion: c.contact.city,
        postalCode: c.contact.postalCode,
        addressCountry: c.contact.country,
      },
      geo: c.contact.geo && {
        '@type': 'GeoCoordinates',
        latitude: c.contact.geo.lat,
        longitude: c.contact.geo.lng,
      },
      employee: {
        '@type': 'Person',
        name: c.psychologistName,
        jobTitle: c.professionalTitle,
      },
      sameAs: Object.values(c.social).filter(Boolean),
      availableService: c.services.map((s) => ({
        '@type': 'MedicalTherapy',
        name: s.title,
        description: s.description,
      })),
    };

    let script = this.doc.getElementById('clinic-jsonld') as HTMLScriptElement | null;
    if (!script) {
      script = this.doc.createElement('script');
      script.id = 'clinic-jsonld';
      script.type = 'application/ld+json';
      this.doc.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }
}
