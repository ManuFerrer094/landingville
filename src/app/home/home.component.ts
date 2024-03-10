import { Component, OnInit } from '@angular/core';
import { CsvService } from '../csv.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  landings: any[] = [];
  repoUrl: string = '';

  constructor(private csvService: CsvService) { }

  ngOnInit(): void {
    const storedRepoUrl = sessionStorage.getItem('repoUrl');
    if (storedRepoUrl) {
      this.repoUrl = storedRepoUrl;
      this.getRepoContributors();
    }
  }

  getRepoContributors() {
    if (this.repoUrl) {
      sessionStorage.setItem('repoUrl', this.repoUrl);

      this.csvService.setRepoUrl(this.repoUrl);
      this.csvService.getRepoContributors(this.repoUrl).subscribe(
        (contributors: any[]) => {
          this.landings = contributors.map((contributor, index) => ({
            id: index,
            name: contributor.login,
            role: '',
            img: contributor.avatar_url,
            url: `/landing/${index}`
          }));
        },
        (error: HttpErrorResponse) => {
          console.error('Error al obtener los contribuyentes del repositorio:', error.message);
        }
      );
    }
  }
}
