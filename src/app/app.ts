import { Component, afterNextRender, inject } from '@angular/core';
import { SeoService } from './core/seo.service';
import { SmoothScrollService } from './core/smooth-scroll.service';
import { ThemeService } from './core/theme.service';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { AboutComponent } from './sections/about/about.component';
import { AiAppointmentComponent } from './sections/ai-appointment/ai-appointment.component';
import { BookingComponent } from './sections/booking/booking.component';
import { CredentialsComponent } from './sections/credentials/credentials.component';
import { HeroSplashComponent } from './sections/hero-splash/hero-splash.component';
import { IntroRoomComponent } from './sections/intro-room/intro-room.component';
import { ServicesWallComponent } from './sections/services-wall/services-wall.component';
import { StepsComponent } from './sections/steps/steps.component';
import { RingDividerComponent } from './shared/ring-divider.component';

@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    HeroSplashComponent,
    IntroRoomComponent,
    AboutComponent,
    ServicesWallComponent,
    StepsComponent,
    CredentialsComponent,
    AiAppointmentComponent,
    RingDividerComponent,
    BookingComponent,
    FooterComponent,
  ],
  template: `
    <a class="skip-link" href="#main">İçeriğe geç</a>
    <app-header />
    <main id="main">
      <app-hero-splash />
      <app-intro-room />
      <app-about />
      <app-services-wall />
      <app-steps />
      <app-credentials />
      <app-ai-appointment />
      <app-ring-divider />
      <app-booking />
    </main>
    <app-footer />
  `,
})
export class App {
  constructor() {
    inject(ThemeService);
    inject(SeoService);
    const scroll = inject(SmoothScrollService);
    afterNextRender(() => scroll.init());
  }
}
