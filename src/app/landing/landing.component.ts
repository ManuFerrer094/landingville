import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CsvService } from '../csv.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  nombre: string | undefined;
  rol: string | undefined;
  descripcion: string | undefined;
  email: string | undefined;
  telefono: string | undefined;
  linkedin: string | undefined;
  github: string | undefined;
  foto: string | undefined;
  username: string | undefined; // Nueva propiedad para almacenar el nombre de usuario

  constructor(private route: ActivatedRoute, private csvService: CsvService, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const userIndex = params.get('userIndex');
      if (userIndex) {
        this.csvService.getUserData(userIndex).subscribe(
          (userData: any) => {
            // Asignar otras propiedades como lo estás haciendo actualmente
            this.nombre = userData.nombre;
            this.rol = userData.rol;
            this.descripcion = userData.descripcion;
            this.email = userData.email;
            this.telefono = userData.telefono;
            this.linkedin = userData.linkedin;
            this.github = userData.github;
            this.foto = userData.foto;

            // Asignar el nombre de usuario si está disponible en los datos del usuario
            this.username = userData.username;
          },
          error => {
            console.error('Error al cargar los datos del usuario:', error);
          }
        );
      }
    });
  }

  sendEmail() {
    if (this.email) {
      window.open(`mailto:${this.email}`);
    }
  }

  callPhone(): void {
    this.router.navigateByUrl('tel:' + this.telefono);
  }
}
