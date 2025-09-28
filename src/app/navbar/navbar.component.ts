import { Component, OnInit } from '@angular/core';
import { ThemeService, Theme } from '../services/theme.service';
import { I18nService, Language } from '../services/i18n.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private themeService: ThemeService,
    private i18nService: I18nService
  ) { }

  ngOnInit(): void {
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  getCurrentTheme(): Theme {
    return this.themeService.getCurrentTheme();
  }

  getThemeTooltip(): string {
    return this.i18nService.translate(
      this.getCurrentTheme() === 'light' ? 'theme.dark' : 'theme.light'
    );
  }

  toggleLanguage(): void {
    const currentLang = this.i18nService.getCurrentLanguage();
    const newLang: Language = currentLang === 'es' ? 'en' : 'es';
    this.i18nService.setLanguage(newLang);
  }

  getCurrentLanguage(): Language {
    return this.i18nService.getCurrentLanguage();
  }

  getLanguageTooltip(): string {
    const currentLang = this.getCurrentLanguage();
    return currentLang === 'es' ? 'Switch to English' : 'Cambiar a Español';
  }
}
