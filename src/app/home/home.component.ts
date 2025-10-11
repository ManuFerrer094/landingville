import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CsvService } from '../csv.service';
import { HttpErrorResponse } from '@angular/common/http';
import { I18nService } from '../services/i18n.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  landings: any[] = [];
  repoUrl: string = '';
  isLoading: boolean = false;

  constructor(
    private csvService: CsvService,
    private i18nService: I18nService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const storedRepoUrl = sessionStorage.getItem('repoUrl');
    if (storedRepoUrl) {
      this.repoUrl = storedRepoUrl;
      this.getRepoContributors();
    }
  }

  ngOnDestroy(): void {
  }

  translate(key: string): string {
    return this.i18nService.translate(key);
  }

  getRepoContributors() {
    if (this.repoUrl) {
      this.isLoading = true;
      sessionStorage.setItem('repoUrl', this.repoUrl);

      // Check if it's an organization URL
      if (this.csvService.isOrganizationUrl(this.repoUrl)) {
        const orgName = this.csvService.extractOrgName(this.repoUrl);
        this.isLoading = false;
        // Navigate to organization page
        this.router.navigate(['/organization', orgName]);
        return;
      }

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
          
          this.isLoading = false;
        },
        (error: HttpErrorResponse) => {
          console.error('Error al obtener los contribuyentes del repositorio:', error.message);
          this.isLoading = false;
        }
      );
    }
  }
}
