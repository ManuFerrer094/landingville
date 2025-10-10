import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { I18nService } from '../services/i18n.service';
import { CsvService } from '../csv.service';
import { PageEvent } from '@angular/material/paginator';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  @Input() username: string = '';
  projects: any[] = [];
  pagedProjects: any[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 6;
  expandedProjectIndex: number = -1;
  projectDetails: { [key: number]: any } = {};
  loadingDetails: { [key: number]: boolean } = {};

  constructor(
    private http: HttpClient,
    private i18nService: I18nService,
    private csvService: CsvService
  ) {}

  ngOnInit(): void {
    if (this.username) {
      this.fetchProjects();
    }
  }

  translate(key: string): string {
    return this.i18nService.translate(key);
  }

  fetchProjects(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    const url = `https://api.github.com/users/${this.username}/repos`;
    this.http.get<any[]>(url).subscribe(
      (projects) => {
        const ownProjects = projects.filter(project => !project.fork);
        ownProjects.sort((a, b) => {
          // Sort by stars first, then by updated date
          if (b.stargazers_count !== a.stargazers_count) {
            return b.stargazers_count - a.stargazers_count;
          }
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        });

        this.projects = ownProjects;
        this.paginateProjects();
        this.isLoading = false;
        this.errorMessage = '';
      },
      (error) => {
        this.errorMessage = `Error loading projects for ${this.username}: ${error.message}`;
        this.projects = [];
        this.isLoading = false;
      }
    );
  }

  paginateProjects(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.pagedProjects = this.projects.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.itemsPerPage = event.pageSize;
    this.paginateProjects();
  }

  get totalPages(): number {
    return Math.ceil(this.projects.length / this.itemsPerPage);
  }

  getProjectIcon(project: any): string {
    const language = project.language?.toLowerCase();
    const name = project.name?.toLowerCase();
    
    if (language) {
      switch (language) {
        case 'javascript': return 'javascript';
        case 'typescript': return 'code';
        case 'python': return 'smart_toy';
        case 'java': return 'coffee';
        case 'react': return 'react';
        case 'vue': return 'view_in_ar';
        case 'angular': return 'angular';
        case 'html': return 'web';
        case 'css': return 'style';
        case 'php': return 'php';
        case 'ruby': return 'diamond';
        case 'go': return 'fast_forward';
        case 'rust': return 'build';
        case 'c++': case 'c': return 'memory';
        case 'shell':  return 'terminal';
        default: return 'code';
      }
    }
    
    if (name?.includes('web') || name?.includes('site')) return 'web';
    if (name?.includes('api') || name?.includes('server')) return 'api';
    if (name?.includes('mobile') || name?.includes('app')) return 'phone_android';
    if (name?.includes('bot')) return 'smart_toy';
    if (name?.includes('tool') || name?.includes('cli')) return 'build';
    
    return 'folder_open';
  }

  getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
    return `${Math.floor(diffInSeconds / 31536000)}y ago`;
  }

  openLink(url: string): void {
    window.open(url, '_blank', 'noopener');
  }

  toggleProjectDetails(index: number, project: any): void {
    const projectIndex = (this.currentPage - 1) * this.itemsPerPage + index;
    
    if (this.expandedProjectIndex === projectIndex) {
      this.expandedProjectIndex = -1;
      return;
    }

    this.expandedProjectIndex = projectIndex;
    
    if (!this.projectDetails[projectIndex]) {
      this.loadProjectDetails(projectIndex, project);
    }
  }

  isProjectExpanded(index: number): boolean {
    const projectIndex = (this.currentPage - 1) * this.itemsPerPage + index;
    return this.expandedProjectIndex === projectIndex;
  }

  isLoadingProjectDetails(index: number): boolean {
    const projectIndex = (this.currentPage - 1) * this.itemsPerPage + index;
    return this.loadingDetails[projectIndex] || false;
  }

  getProjectDetails(index: number): any {
    const projectIndex = (this.currentPage - 1) * this.itemsPerPage + index;
    return this.projectDetails[projectIndex];
  }

  private loadProjectDetails(projectIndex: number, project: any): void {
    this.loadingDetails[projectIndex] = true;
    const repoUrl = `https://github.com/${this.username}/${project.name}`;

    forkJoin({
      releases: this.csvService.getRepoReleases(repoUrl),
      languages: this.csvService.getRepoLanguages(repoUrl),
      topics: this.csvService.getRepoTopics(repoUrl),
      contributors: this.csvService.getRepoContributors(repoUrl)
    }).subscribe({
      next: (result) => {
        // Process languages for display
        const totalBytes = Object.values(result.languages).reduce((sum: number, bytes) => sum + (bytes as number), 0);
        const languagesArray = Object.entries(result.languages)
          .map(([name, bytes]) => ({
            name,
            bytes: bytes as number,
            percentage: totalBytes > 0 ? ((bytes as number) / totalBytes) * 100 : 0
          }))
          .sort((a, b) => b.bytes - a.bytes)
          .slice(0, 5); // Top 5 languages

        this.projectDetails[projectIndex] = {
          releases: result.releases.slice(0, 5), // Top 5 releases
          languages: languagesArray,
          topics: result.topics,
          contributors: result.contributors.slice(0, 10) // Top 10 contributors
        };
        
        this.loadingDetails[projectIndex] = false;
      },
      error: (error) => {
        console.error('Error loading project details:', error);
        this.projectDetails[projectIndex] = {
          releases: [],
          languages: [],
          topics: [],
          contributors: [],
          error: true
        };
        this.loadingDetails[projectIndex] = false;
      }
    });
  }

  getLanguageColor(language: string): string {
    const colors: { [key: string]: string } = {
      'JavaScript': '#f1e05a',
      'TypeScript': '#2b7489',
      'Python': '#3572A5',
      'Java': '#b07219',
      'C++': '#f34b7d',
      'C#': '#178600',
      'PHP': '#4F5D95',
      'Ruby': '#701516',
      'Go': '#00ADD8',
      'Rust': '#dea584',
      'Swift': '#ffac45',
      'Kotlin': '#F18E33',
      'HTML': '#e34c26',
      'CSS': '#563d7c',
      'Shell': '#89e051',
      'Dart': '#00B4AB'
    };
    return colors[language] || '#858585';
  }
}
