import { Component, OnInit, ViewChild } from '@angular/core';
import { CsvService } from '../csv.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  landings: any[] = [];
  displayedLandings: any[] = [];
  repoUrl: string = '';
  pageSize: number = 10;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

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

          // Setea la pagina actual al primer elemento
          if (this.paginator) {
            this.paginator.firstPage();
          }

          // Pagina los elementos al principio
          this.paginateContributors();
        },
        (error: HttpErrorResponse) => {
          console.error('Error al obtener los contribuyentes del repositorio:', error.message);
        }
      );
    }
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.paginateContributors();
  }

  paginateContributors() {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      const endIndex = startIndex + this.paginator.pageSize;
      this.displayedLandings = this.landings.slice(startIndex, endIndex);
    }
  }
}
