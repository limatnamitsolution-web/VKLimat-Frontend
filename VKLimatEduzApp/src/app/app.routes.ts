// app/app.routes.ts
import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout-component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'student', pathMatch: 'full' },
      { 
        path: 'student', 
        loadChildren: () => import('./features/student/student.routes').then(m => m.StudentRoutes)
      },
      // Add other module routes here
     
      { 
        path: 'mastersConfig', 
        loadChildren: () => import('./features/mastersConfig/masters.routes').then(m => m.mastersConfigRoutes)
      }
    ]
  }
];