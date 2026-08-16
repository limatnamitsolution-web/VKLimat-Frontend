// modules/fee/fee.routes.ts
import { Routes } from '@angular/router';
import { FeeLayoutComponent } from './fee-layout.component';
import {FeeDashboardComponent} from './fee-dashboard-component';

export const FeeRoutes: Routes = [
  {
    path: '',
    component: FeeLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'dashboard', 
        loadComponent: () => import('./fee-dashboard-component').then(c => c.FeeDashboardComponent)
      },
      {
        path: 'fees-master',
        loadComponent: () => import('./fees-master/fees-master-component').then(c => c.FeesMasterComponent)
      }
      // Add other fee routes
    ]
  }
];