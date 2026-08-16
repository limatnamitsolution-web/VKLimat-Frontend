import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FeeMasterView } from '../fee-master-view';

@Component({ selector: 'app-concession-details-view', imports: [FormsModule], templateUrl: './concession-details-view.html', styleUrl: '../fee-master-view.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class ConcessionDetailsView extends FeeMasterView {
  readonly title = 'Concession Details View';
  readonly fields = [
    { key: 'concession', label: 'Concession' }, { key: 'academicYear', label: 'Academic Year' }, { key: 'class', label: 'Class' },
    { key: 'feeHead', label: 'Fee Head' }, { key: 'applicableValue', label: 'Applicable Value', type: 'number' as const },
    { key: 'status', label: 'Status', type: 'select' as const, options: ['Active', 'Inactive'] }
  ];
}