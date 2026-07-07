// app/modules/student/student-layout.component.ts

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
   changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="student-module">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .student-module {
      height: 100%;
    }
  `]
})
 
export class StudentLayoutComponent { }