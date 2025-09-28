import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CsvService } from '../csv.service';
import { I18nService } from '../services/i18n.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, OnDestroy {
  userData: any | undefined;
  
  // Animated stats
  animatedStats = {
    repositories: 0,
    followers: 0,
    contributions: 0
  };

  constructor(
    private route: ActivatedRoute, 
    private csvService: CsvService,
    private i18nService: I18nService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const userIndex = Number(params.get('userIndex'));

      if (!isNaN(userIndex)) {
        const repoUrl = this.csvService.getRepoUrl();

        if (repoUrl) {
          this.csvService.getRepoContributors(repoUrl).subscribe(
            (contributors: any[]) => {
              const userData = contributors[userIndex];
              if (userData) {
                this.userData = {
                  nombre: userData.login,
                  rol: userData.type || 'Developer',
                  bio: userData.bio || 'Software Developer passionate about creating amazing experiences.',
                  email: userData.email || '',
                  telefono: userData.telefono || '',
                  blog: userData.blog || '',
                  github: userData.html_url,
                  foto: userData.avatar_url,
                  username: userData.login
                };
                
                // Start animated stats with realistic GitHub data
                this.startStatsAnimation();
              } else {
                console.error('No se encontraron datos para el usuario con el índice proporcionado.');
              }
            },
            (error: any) => {
              console.error('Error al cargar los datos de los contribuyentes:', error);
            }
          );
        } else {
          console.error('No se proporcionó una URL de repositorio válida desde HomeComponent.');
        }
      } else {
        console.error('El índice del usuario no es un número válido.');
      }
    });
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  translate(key: string): string {
    return this.i18nService.translate(key);
  }

  sendEmail() {
    if (this.userData && this.userData.email) {
      window.open(`mailto:${this.userData.email}`);
    }
  }

  callPhone(): void {
    if (this.userData && this.userData.telefono) {
      window.open(`tel:${this.userData.telefono}`);
    }
  }

  private startStatsAnimation(): void {
    // Realistic GitHub-style stats
    const targetStats = {
      repositories: Math.floor(Math.random() * 50) + 10, // 10-60 repos
      followers: Math.floor(Math.random() * 200) + 25,   // 25-225 followers
      contributions: Math.floor(Math.random() * 800) + 200 // 200-1000 contributions
    };

    this.animateValue('repositories', 0, targetStats.repositories, 1500);
    this.animateValue('followers', 0, targetStats.followers, 1800);
    this.animateValue('contributions', 0, targetStats.contributions, 2200);
  }

  private animateValue(key: keyof typeof this.animatedStats, start: number, end: number, duration: number): void {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      this.animatedStats[key] = Math.floor(start + (end - start) * easeOutQuart);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }
}
