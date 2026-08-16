import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FeeMasterView } from '../fee-master-view';

@Component({ selector: 'app-structure-view', imports: [FormsModule], templateUrl: './structure-view.html', styleUrl: '../fee-master-view.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class StructureView extends FeeMasterView {
  readonly title = 'Structure View';
  readonly fields = [
    { key: 'name', label: 'Structure Name' }, { key: 'academicYear', label: 'Academic Year' }, { key: 'class', label: 'Class' },
    { key: 'feeGroup', label: 'Fee Group' }, { key: 'totalAmount', label: 'Total Amount', type: 'number' as const },
    { key: 'status', label: 'Status', type: 'select' as const, options: ['Active', 'Inactive'] }
  ];
}