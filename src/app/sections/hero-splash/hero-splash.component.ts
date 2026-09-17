import { Component, computed, inject, signal } from '@angular/core';
import { AppointmentIntentService } from '../../core/appointment-intent.service';
import { ClinicService } from '../../core/clinic.service';
import { SmoothScrollService } from '../../core/smooth-scroll.service';
import { ComboboxComponent } from '../../shared/combobox.component';
import { ScribbleTextComponent } from '../../shared/scribble-text.component';
import { SketchComponent } from '../../shared/sketch.component';

/**
 * Hero: a sheet of lined notebook paper with an envelope asking what the
 * visitor needs help with, and a torn blue ticket asking how they would like
 * to meet. Submitting hands both answers to the appointment assistant.
 */
@Component({
  selector: 'app-hero-splash',
  imports: [ComboboxComponent, ScribbleTextComponent, SketchComponent],
  templateUrl: './hero-splash.component.html',
  styleUrl: './hero-splash.component.scss',
})
export class HeroSplashComponent {
  private readonly clinic = inject(ClinicService);
  private readonly intents = inject(AppointmentIntentService);
  private readonly scroll = inject(SmoothScrollService);

  protected readonly hero = computed(() => this.clinic.config().hero);
  protected readonly suggestions = this.intents.topicSuggestions;
  protected readonly topic = signal('');
  protected readonly format = signal('');

  protected submit(event: Event): void {
    event.preventDefault();
    this.intents.submit(this.topic(), this.format());
    this.scroll.scrollTo('ai-randevu');
  }

  protected searchTopic(event: Event): void {
    event.preventDefault();
    if (!this.topic().trim()) return;
    this.intents.submit(this.topic(), this.format());
    this.scroll.scrollTo(this.intents.match(this.topic()) ? 'hizmetler' : 'ai-randevu');
  }
}
