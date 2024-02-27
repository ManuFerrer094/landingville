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
  errorMessage: string = '';

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
        this.projects = projects;
        this.errorMessage = '';
      },
      (error) => {
        this.errorMessage = `Error al obtener los proyectos de GitHub para el usuario ${this.username}: ${error.message}`;
        this.projects = [];
      }
    );
  }
}
