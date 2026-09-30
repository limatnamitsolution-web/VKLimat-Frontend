// modules/latefine/latefine.routes.ts
import { Routes } from '@angular/router';

export const LatefineRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./latefine-component').then(c => c.LatefineComponent)
  }
];
