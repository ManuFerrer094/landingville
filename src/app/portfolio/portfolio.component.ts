import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  currentPage: number = 1;
  itemsPerPage: number = 4;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    if (this.username) {
      this.fetchProjects();
    }
  }

  fetchProjects(): void {
    const url = `https://api.github.com/users/${this.username}/repos`;
    this.http.get<any[]>(url).subscribe(
      (projects) => {
        const ownProjects = projects.filter(project => !project.fork);
        ownProjects.sort((a, b) => {
          if (b.created_at.localeCompare(a.created_at) === 0) {
            return b.homepage ? 1 : -1;
          }
          return b.created_at.localeCompare(a.created_at);
        });

        this.projects = ownProjects;
        this.paginateProjects();
        this.errorMessage = '';
      },
      (error) => {
        this.errorMessage = `Error al obtener los proyectos de GitHub para el usuario ${this.username}: ${error.message}`;
        this.projects = [];
      }
    );
  }

  paginateProjects(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.pagedProjects = this.projects.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateProjects();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateProjects();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.projects.length / this.itemsPerPage);
  }
}
