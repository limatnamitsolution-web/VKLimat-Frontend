import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FeeMasterView } from '../fee-master-view';

@Component({ selector: 'app-late-fine-attendance-view', imports: [FormsModule], templateUrl: './late-fine-attendance-view.html', styleUrl: '../fee-master-view.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class LateFineAttendanceView extends FeeMasterView {
  readonly title = 'LateFine-Attendance View';
  readonly fields = [
    { key: 'attendanceFrom', label: 'Attendance From %', type: 'number' as const },
    { key: 'attendanceTo', label: 'Attendance To %', type: 'number' as const },
    { key: 'fineType', label: 'Fine Type', type: 'select' as const, options: ['Amount', 'Percentage'] },
    { key: 'fineValue', label: 'Fine Value', type: 'number' as const }, { key: 'applicableMonth', label: 'Applicable Month' },
    { key: 'status', label: 'Status', type: 'select' as const, options: ['Active', 'Inactive'] }
  ];
}