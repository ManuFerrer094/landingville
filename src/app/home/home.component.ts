import { Component, OnInit, OnDestroy } from '@angular/core';
import { CsvService } from '../csv.service';
import { HttpErrorResponse } from '@angular/common/http';
import { I18nService } from '../services/i18n.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  landings: any[] = [];
  repoUrl: string = '';
  isLoading: boolean = false;
  showStats: boolean = true;
  
  // Animated stats
  animatedStats = {
    repositories: 0,
    contributors: 0,
    projects: 0
  };
  
  private statsSubscription?: Subscription;

  constructor(
    private csvService: CsvService,
    private i18nService: I18nService
  ) { }

  ngOnInit(): void {
    const storedRepoUrl = sessionStorage.getItem('repoUrl');
    if (storedRepoUrl) {
      this.repoUrl = storedRepoUrl;
      this.getRepoContributors();
    }
    
    // Initialize animated stats
    this.startStatsAnimation();
  }

  ngOnDestroy(): void {
    if (this.statsSubscription) {
      this.statsSubscription.unsubscribe();
    }
  }

  translate(key: string): string {
    return this.i18nService.translate(key);
  }

  getRepoContributors() {
    if (this.repoUrl) {
      this.isLoading = true;
      sessionStorage.setItem('repoUrl', this.repoUrl);

      this.csvService.setRepoUrl(this.repoUrl);
      this.csvService.getRepoContributors(this.repoUrl).subscribe(
        (contributors: any[]) => {
          this.landings = contributors.map((contributor, index) => ({
            id: index,
            name: contributor.login,
            role: contributor.type || 'Developer',
            img: contributor.avatar_url,
            url: `/landing/${index}`
          }));
          
          // Update stats based on actual data
          this.updateStats(contributors.length);
          this.isLoading = false;
        },
        (error: HttpErrorResponse) => {
          console.error('Error al obtener los contribuyentes del repositorio:', error.message);
          this.isLoading = false;
        }
      );
    }
  }

  private startStatsAnimation(): void {
    // Sample animated stats - these would come from real data in production
    const targetStats = {
      repositories: 1247,
      contributors: 89,
      projects: 156
    };

    this.animateValue('repositories', 0, targetStats.repositories, 2000);
    this.animateValue('contributors', 0, targetStats.contributors, 1800);
    this.animateValue('projects', 0, targetStats.projects, 2200);
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

  private updateStats(contributorCount: number): void {
    // Update stats based on real data
    this.animateValue('contributors', this.animatedStats.contributors, contributorCount, 1000);
    this.animateValue('repositories', this.animatedStats.repositories, Math.floor(contributorCount * 2.5), 1200);
    this.animateValue('projects', this.animatedStats.projects, Math.floor(contributorCount * 1.8), 1500);
  }
}
