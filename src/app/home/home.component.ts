import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  landings = [
    { id: 1, title: 'Landing 1', url: '/landing/1' },
    { id: 2, title: 'Landing 2', url: '/landing/2' },
    { id: 3, title: 'Landing 3', url: '/landing/3' }
  ];

  constructor() { }
}
