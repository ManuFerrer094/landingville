import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  nombre: string | undefined;
  rol: string | undefined;
  descripcion: string | undefined;
  proyectos: any[] | undefined;

  constructor() { }

  ngOnInit(): void {
    this.nombre = 'Manuel Ferrer';
    this.rol = 'Software developer';
    this.descripcion = 'Software developer enfocado en el frontend con 7 años de experiencia';
    this.proyectos = [
      { nombre: 'Proyecto 1', descripcion: 'Descripción del proyecto 1' },
      { nombre: 'Proyecto 2', descripcion: 'Descripción del proyecto 2' }
    ];
  }
}
