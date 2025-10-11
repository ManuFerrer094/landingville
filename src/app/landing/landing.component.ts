import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CsvService } from '../csv.service';
import { I18nService } from '../services/i18n.service';
import { forkJoin } from 'rxjs';

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

  topLanguages: any[] = []; // Changed to store objects with percentage
  contributions: any[] = [];

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
                // Fetch full user details from GitHub
                this.csvService.getUserDetails(userData.login).subscribe(
                  (fullUserData: any) => {
                    this.userData = {
                      nombre: userData.login,
                      rol: userData.type || 'Developer',
                      bio: fullUserData.bio || 'Software Developer passionate about creating amazing experiences.',
                      email: fullUserData.email || '',
                      telefono: userData.telefono || '',
                      blog: fullUserData.blog || '',
                      github: userData.html_url,
                      foto: userData.avatar_url,
                      username: userData.login,
                      contributionsToThisRepo: userData.contributions || 0,
                      company: fullUserData.company || '',
                      location: fullUserData.location || '',
                      twitter_username: fullUserData.twitter_username || '',
                      hireable: fullUserData.hireable
                    };
                    
                    // Start animated stats with realistic GitHub data
                    this.startStatsAnimation();
                  },
                  (error: any) => {
                    // Fallback if detailed profile fetch fails
                    console.warn('Could not fetch detailed profile, using basic data:', error);
                    this.userData = {
                      nombre: userData.login,
                      rol: userData.type || 'Developer',
                      bio: 'Software Developer passionate about creating amazing experiences.',
                      email: userData.email || '',
                      telefono: userData.telefono || '',
                      blog: userData.blog || '',
                      github: userData.html_url,
                      foto: userData.avatar_url,
                      username: userData.login,
                      contributionsToThisRepo: userData.contributions || 0
                    };
                    
                    // Start animated stats with realistic GitHub data
                    this.startStatsAnimation();
                  }
                );
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
    if (!this.userData || !this.userData.username) {
      console.error('No username available for fetching stats');
      return;
    }

    const username = this.userData.username;
    const contributionsToThisRepo = this.userData.contributionsToThisRepo || 0;

    // Fetch user details and repositories in parallel
    forkJoin({
      userDetails: this.csvService.getUserDetails(username),
      repositories: this.csvService.getUserRepositories(username),
      languageStats: this.csvService.getLanguageStats(username)
    }).subscribe(
      ({ userDetails, repositories, languageStats }) => {
        // Get real GitHub stats
        const realStats = {
          repositories: userDetails.public_repos || 0,
          followers: userDetails.followers || 0,
          // Use contributions to the current repo as proxy for total contributions
          contributions: contributionsToThisRepo
        };

        // Update userData with more complete profile information
        if (this.userData) {
          this.userData.bio = userDetails.bio || this.userData.bio;
          this.userData.company = userDetails.company || '';
          this.userData.location = userDetails.location || '';
          this.userData.twitter_username = userDetails.twitter_username || '';
          this.userData.hireable = userDetails.hireable;
        }

        // Store language stats with percentages
        this.topLanguages = languageStats;

        // Animate the stats
        this.animateValue('repositories', 0, realStats.repositories, 1500);
        this.animateValue('followers', 0, realStats.followers, 1800);
        this.animateValue('contributions', 0, realStats.contributions, 2200);
      },
      (error: any) => {
        console.error('Error fetching GitHub stats:', error);
        // Fallback to showing zeros or previous behavior
        this.animateValue('repositories', 0, 0, 1500);
        this.animateValue('followers', 0, 0, 1800);
        this.animateValue('contributions', 0, 0, 2200);
      }
    );
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
