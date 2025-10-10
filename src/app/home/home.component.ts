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
      
      // Check if it's an organization URL
      if (this.csvService.isOrganizationUrl(this.repoUrl)) {
        this.loadOrganizationData();
      } else {
        this.loadRepositoryContributors();
      }
    }
  }

  private loadOrganizationData(): void {
    this.csvService.getOrgMembers(this.repoUrl).subscribe(
      (members: any[]) => {
        this.landings = members.map((member, index) => ({
          id: index,
          name: member.login,
          role: member.type || 'Member',
          img: member.avatar_url,
          url: `/landing/${index}`
        }));
        
        // Also fetch org repositories to show more comprehensive data
        this.csvService.getOrgRepositories(this.repoUrl).subscribe(
          (repos: any[]) => {
            const totalRepos = repos.length;
            const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
            
            // Update stats with real organization data
            this.animateValue('contributors', this.animatedStats.contributors, members.length, 1000);
            this.animateValue('repositories', this.animatedStats.repositories, totalRepos, 1200);
            this.animateValue('projects', this.animatedStats.projects, Math.floor(totalStars / 10), 1500);
            
            this.isLoading = false;
          },
          (error: HttpErrorResponse) => {
            console.error('Error fetching org repositories:', error.message);
            this.updateStats(members.length);
            this.isLoading = false;
          }
        );
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching organization members:', error.message);
        this.isLoading = false;
      }
    );
  }

  private loadRepositoryContributors(): void {
    this.csvService.getRepoContributors(this.repoUrl).subscribe(
      (contributors: any[]) => {
        this.landings = contributors.map((contributor, index) => ({
          id: index,
          name: contributor.login,
          role: contributor.type || 'Developer',
          img: contributor.avatar_url,
          url: `/landing/${index}`
        }));
        
        // Fetch repository details for accurate stats
        this.csvService.getRepoDetails(this.repoUrl).subscribe(
          (repoData: any) => {
            this.animateValue('contributors', this.animatedStats.contributors, contributors.length, 1000);
            this.animateValue('repositories', this.animatedStats.repositories, repoData.forks_count || 0, 1200);
            this.animateValue('projects', this.animatedStats.projects, repoData.stargazers_count || 0, 1500);
            
            this.isLoading = false;
          },
          (error: HttpErrorResponse) => {
            console.error('Error fetching repo details:', error.message);
            this.updateStats(contributors.length);
            this.isLoading = false;
          }
        );
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching repository contributors:', error.message);
        this.isLoading = false;
      }
    );
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
