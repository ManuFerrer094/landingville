import { Component, OnInit } from '@angular/core';
import { CsvService } from '../csv.service';
import { EmailValidator } from '@angular/forms';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  nombre: string | undefined;
  rol: string | undefined;
  descripcion: string | undefined;
  email: EmailValidator | undefined;
  telefono: string | undefined;
  linkedin: string | undefined;
  github: string | undefined;
  foto: string | undefined;

  constructor(private csvService: CsvService) { }

  ngOnInit(): void {
    this.csvService.readCsvFile().subscribe(
      (data: any) => {
        const lines = data.split('\n');
        if (lines.length > 1) {
          const fields = lines[1].split(',');
          this.nombre = fields[0];
          this.rol = fields[1];
          this.descripcion = fields[2];
          this.email = fields[3];
          this.telefono = fields[4];
          this.linkedin = fields[5];
          this.github = fields[6];
          this.foto = fields[7];
        }
      },
      error => {
        console.error('Error al leer el archivo CSV:', error);
      }
    );
  }
}
