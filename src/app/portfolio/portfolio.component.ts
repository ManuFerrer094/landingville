import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CsvService } from '../csv.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  username: string = ''; // Nombre de usuario de GitHub
  projects: any[] = []; // Array para almacenar los proyectos

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
        this.projects = response.map(repo => ({
          name: repo.name,
          description: repo.description,
          stack: repo.topics,
          githubLink: repo.html_url,
          demoLink: repo.homepage
        }));
      },
      (error) => {
        console.error('Error al obtener los proyectos de GitHub:', error);
      }
    );
  }

  generateShieldURL(technology: string): string {
    const colorMap: { [key: string]: string } = {};
    const badgeStyle = 'for-the-badge';
    const logoColor = 'fff';
    const logo = technology.toLowerCase();
    return `https://img.shields.io/badge/${technology}-informational?style=${badgeStyle}&logo=${logo}&logoColor=${logoColor}&color=${colorMap[technology] || this.generateColorFromHash(technology)}`;
  }

  private generateColorFromHash(technology: string): string {
    // Lógica para generar el color basado en el hash de la tecnología
    return 'hexcolor'; // Reemplazar con la lógica real
  }
}
