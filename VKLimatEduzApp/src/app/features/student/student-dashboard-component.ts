// app/modules/student/student-dashboard.component.ts
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-dashboard-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentDashboardComponent { }