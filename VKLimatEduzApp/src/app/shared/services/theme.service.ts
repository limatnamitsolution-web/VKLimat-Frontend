// app/services/theme.service.ts
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme = new BehaviorSubject<string>('light');
  currentTheme$ = this.currentTheme.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    const savedTheme = this.getStoredTheme();
    this.setTheme(savedTheme);
  }

  private getStoredTheme(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('eduz-theme') || 'light';
    }
    return 'light';
  }

  setTheme(theme: string): void {
    this.currentTheme.next(theme);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('eduz-theme', theme);
      document.body.setAttribute('data-theme', theme);
    }
  }

  getValue(): string {
    return this.currentTheme.value;
  }
}