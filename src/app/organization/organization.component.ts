import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CsvService } from '../csv.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})
export class OrganizationComponent implements OnInit {
  organizationName: string = '';
  organizationData: any = null;
  repositories: any[] = [];
  members: any[] = [];
  teams: any[] = [];
  projects: any[] = [];
  packages: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  repositoriesWithActivity: any[] = [];
  Math = Math;  // Expose Math to template

  constructor(
    private route: ActivatedRoute,
    private csvService: CsvService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.organizationName = params.get('orgName') || '';
      
      if (this.organizationName) {
        this.loadOrganizationData();
      }
    });
  }

  private loadOrganizationData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Fetch organization details, repositories, members, teams, projects, and packages in parallel
    forkJoin({
      organization: this.csvService.getOrganizationDetails(this.organizationName),
      repositories: this.csvService.getOrganizationRepositories(this.organizationName),
      members: this.csvService.getOrganizationPublicMembers(this.organizationName),
      teams: this.csvService.getOrganizationTeams(this.organizationName),
      projects: this.csvService.getOrganizationProjects(this.organizationName),
      packages: this.csvService.getOrganizationPackages(this.organizationName)
    }).subscribe({
      next: (data) => {
        this.organizationData = data.organization;
        this.repositories = data.repositories;
        this.members = data.members;
        this.teams = data.teams || [];
        this.projects = data.projects || [];
        this.packages = data.packages || [];

        // Load commit activity for each repository (limit to top 10)
        this.loadRepositoriesCommitActivity(this.repositories.slice(0, 10));
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading organization data:', error);
        this.errorMessage = 'Failed to load organization data. Please check the organization name and try again.';
        this.isLoading = false;
      }
    });
  }

  private loadRepositoriesCommitActivity(repos: any[]): void {
    const activityRequests = repos.map(repo => 
      this.csvService.getRepositoryCommitActivity(this.organizationName, repo.name)
    );

    forkJoin(activityRequests).subscribe({
      next: (activities: any[][]) => {
        this.repositoriesWithActivity = repos.map((repo, index) => ({
          ...repo,
          commitActivity: activities[index] || []
        }));
      },
      error: (error) => {
        console.error('Error loading commit activities:', error);
        // If commit activity fails, still show repositories without it
        this.repositoriesWithActivity = repos.map(repo => ({
          ...repo,
          commitActivity: []
        }));
      }
    });
  }

  getPopularRepositories(count: number = 5): any[] {
    return this.repositories
      .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
      .slice(0, count);
  }

  getTotalCommits(commitActivity: any[]): number {
    if (!commitActivity || commitActivity.length === 0) return 0;
    return commitActivity.reduce((total, week) => total + week.total, 0);
  }

  getLastWeekCommits(commitActivity: any[]): number {
    if (!commitActivity || commitActivity.length === 0) return 0;
    return commitActivity[commitActivity.length - 1]?.total || 0;
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  }

  getLanguageColor(language: string): string {
    const colors: { [key: string]: string } = {
      'JavaScript': '#f1e05a',
      'TypeScript': '#2b7489',
      'Python': '#3572A5',
      'Java': '#b07219',
      'C++': '#f34b7d',
      'C': '#555555',
      'C#': '#178600',
      'PHP': '#4F5D95',
      'Ruby': '#701516',
      'Go': '#00ADD8',
      'Rust': '#dea584',
      'Swift': '#ffac45',
      'Kotlin': '#F18E33',
      'Dart': '#00B4AB',
      'Scala': '#c22d40',
      'HTML': '#e34c26',
      'CSS': '#563d7c',
      'Shell': '#89e051',
      'Vue': '#41b883',
      'React': '#61dafb'
    };
    return colors[language] || '#666666';
  }
}

