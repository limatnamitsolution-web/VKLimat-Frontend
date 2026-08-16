import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FeeMasterView } from '../fee-master-view';

@Component({ selector: 'app-late-fees-months-view', imports: [FormsModule], templateUrl: './late-fees-months-view.html', styleUrl: '../fee-master-view.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class LateFeesMonthsView extends FeeMasterView {
  readonly title = 'LateFees-Months View';
  readonly fields = [
    { key: 'month', label: 'Month' }, { key: 'dueDate', label: 'Due Date', type: 'date' as const },
    { key: 'graceDate', label: 'Grace Date', type: 'date' as const },
    { key: 'fineType', label: 'Fine Type', type: 'select' as const, options: ['Amount', 'Percentage'] },
    { key: 'fineValue', label: 'Fine Value', type: 'number' as const },
    { key: 'status', label: 'Status', type: 'select' as const, options: ['Active', 'Inactive'] }
  ];
}