import { Component, OnInit } from '@angular/core';
import { ThemeService, Theme } from '../services/theme.service';
import { I18nService, Language } from '../services/i18n.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();

  constructor(
    private themeService: ThemeService,
    private i18nService: I18nService
  ) { }

  ngOnInit(): void {
  }

  translate(key: string): string {
    return this.i18nService.translate(key);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  getCurrentTheme(): Theme {
    return this.themeService.getCurrentTheme();
  }

  getThemeText(): string {
    return this.getCurrentTheme() === 'light' ? 'Dark' : 'Light';
  }

  toggleLanguage(): void {
    const currentLang = this.i18nService.getCurrentLanguage();
    const newLang: Language = currentLang === 'es' ? 'en' : 'es';
    this.i18nService.setLanguage(newLang);
  }

  getCurrentLanguage(): Language {
    return this.i18nService.getCurrentLanguage();
  }
}
