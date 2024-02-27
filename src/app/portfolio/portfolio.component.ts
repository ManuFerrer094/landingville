import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CsvService } from '../csv.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  username: string = '';
  projects: any[] = [];
  pagedProjects: any[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(private csvService: CsvService, private http: HttpClient) { }

  ngOnInit(): void {
    this.csvService.readCsvFile().subscribe(
      (data: string) => {
        const lines = data.split('\n');
        if (lines.length > 1) {
          const fields = lines[1].split(',');
          this.username = fields[8];
          this.fetchProjects();
        }
      },
      (error) => {
        console.error('Error al obtener el nombre de usuario de GitHub desde el archivo CSV:', error);
      }
    );
  }

  fetchProjects(): void {
    const apiUrl = `https://api.github.com/users/${this.username}/repos`;

    this.http.get<any[]>(apiUrl).subscribe(
      (response) => {
        this.projects = response
          .filter(repo => !repo.fork)
          .map(repo => ({
            name: repo.name,
            description: repo.description,
            stack: repo.topics,
            githubLink: repo.html_url,
            demoLink: repo.homepage,
            createdAt: repo.created_at
          }))
          .sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
          });

        this.setupPaginator();
      },
      (error) => {
        console.error('Error al obtener los proyectos de GitHub:', error);
      }
    );
  }

  setupPaginator(): void {
    this.paginator.pageSize = 4;
    this.paginator.pageIndex = 0;
    this.paginator.page.subscribe(() => {
      this.onPageChange();
    });
    this.updatePagedProjects();
  }

  onPageChange(): void {
    this.updatePagedProjects();
  }

  updatePagedProjects(): void {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    this.pagedProjects = this.projects.slice(startIndex, endIndex);
  }

  generateShieldURL(technology: string): string {
    const colorMap: { [key: string]: string } = {};
    const badgeStyle = 'for-the-badge';
    const logoColor = 'fff';
    const logo = technology.toLowerCase();
    return `https://img.shields.io/badge/${technology}-informational?style=${badgeStyle}&logo=${logo}&logoColor=${logoColor}&color=${colorMap[technology]}`;
  }
}
