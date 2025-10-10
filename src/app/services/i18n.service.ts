import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Language = 'es' | 'en';

interface Translations {
  [key: string]: {
    es: string;
    en: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private currentLanguage = new BehaviorSubject<Language>('es');
  public language$ = this.currentLanguage.asObservable();

  private translations: Translations = {
    // Navigation
    'nav.home': { es: 'Inicio', en: 'Home' },
    'nav.portfolio': { es: 'Portafolio', en: 'Portfolio' },
    
    // Home page
    'home.title': { es: 'LandingVille', en: 'LandingVille' },
    'home.subtitle': { es: '¡Bienvenido a LandingVille! Descubre a los colaboradores de GitHub y explora sus proyectos personales.', en: 'Welcome to LandingVille! Discover GitHub contributors and explore their personal projects.' },
    'home.placeholder': { es: 'Introduce la URL del repositorio de GitHub', en: 'Enter the GitHub repository URL' },
    'home.button': { es: 'Ver colaboradores', en: 'View contributors' },
    'home.viewMore': { es: 'Ver más', en: 'View more' },
    
    // Landing page
    'landing.hello': { es: 'Hola, soy', en: 'Hello, I am' },
    'landing.stats': { es: 'Estadísticas', en: 'Statistics' },
    'landing.projects': { es: 'Proyectos', en: 'Projects' },
    'landing.repositories': { es: 'Repositorios', en: 'Repositories' },
    'landing.followers': { es: 'Seguidores', en: 'Followers' },
    'landing.contributions': { es: 'Contribuciones', en: 'Contributions' },
    'landing.topTechnologies': { es: 'Tecnologías principales', en: 'Top Technologies' },
    
    // Portfolio
    'portfolio.technologies': { es: 'Tecnologías', en: 'Technologies' },
    'portfolio.viewProject': { es: 'Ver proyecto', en: 'View project' },
    'portfolio.sourceCode': { es: 'Código fuente', en: 'Source code' },
    'portfolio.loading': { es: 'Cargando proyectos...', en: 'Loading projects...' },
    'portfolio.error': { es: 'Error al cargar los proyectos', en: 'Error loading projects' },
    
    // Common
    'common.loading': { es: 'Cargando...', en: 'Loading...' },
    'common.error': { es: 'Error', en: 'Error' },
    'common.email': { es: 'Correo electrónico', en: 'Email' },
    'common.phone': { es: 'Teléfono', en: 'Phone' },
    
    // Theme toggle
    'theme.light': { es: 'Tema claro', en: 'Light theme' },
    'theme.dark': { es: 'Tema oscuro', en: 'Dark theme' },
    
    // Footer
    'footer.rights': { es: 'Todos los derechos reservados', en: 'All rights reserved' }
  };

  constructor() {
    // Check for saved language preference or use browser default
    const savedLanguage = localStorage.getItem('language') as Language;
    const browserLanguage = navigator.language.split('-')[0] as Language;
    
    if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
      this.setLanguage(savedLanguage);
    } else if (browserLanguage === 'es' || browserLanguage === 'en') {
      this.setLanguage(browserLanguage);
    }
  }

  setLanguage(language: Language): void {
    this.currentLanguage.next(language);
    localStorage.setItem('language', language);
  }

  getCurrentLanguage(): Language {
    return this.currentLanguage.value;
  }

  translate(key: string): string {
    const translation = this.translations[key];
    if (translation) {
      return translation[this.getCurrentLanguage()];
    }
    return key; // Return key if translation not found
  }
}
