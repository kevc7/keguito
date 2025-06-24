// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, style, animate, query, group } from '@angular/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        // Configuramos el contenedor para permitir posicionamiento absoluto
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          })
        ], { optional: true }),
        
        // Animación de desvanecimiento con deslizamiento suave
        query(':enter', [
          style({ 
            opacity: 0, 
            transform: 'translateY(50px) scale(0.95)',
            filter: 'blur(5px)'
          })
        ], { optional: true }),
        
        query(':leave', [
          animate('400ms ease-in', style({ 
            opacity: 0, 
            transform: 'translateY(-50px) scale(1.05)',
            filter: 'blur(5px)'
          }))
        ], { optional: true }),
        
        query(':enter', [
          animate('600ms 200ms ease-out', style({ 
            opacity: 1, 
            transform: 'translateY(0px) scale(1)',
            filter: 'blur(0px)'
          }))
        ], { optional: true })
      ])
    ])
  ]
})
export class AppComponent {
  title = 'love-letter-page';

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}