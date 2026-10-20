import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TransFeeMasterView } from '../trans-fee-master-view';

@Component({ selector: 'app-trans-feeplan-view', imports: [FormsModule], templateUrl: './trans-structure-view.html', styleUrl: '../trans-fee-master-view.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class TransFeeplanView extends TransFeeMasterView {
  readonly title = 'Transport Fee Plan View';
  readonly fields = [
    { key: 'name', label: 'Feeplan Name' }, { key: 'academicYear', label: 'Academic Year' }, { key: 'class', label: 'Class' },
    { key: 'feeGroup', label: 'Fee Group' }, { key: 'totalAmount', label: 'Total Amount', type: 'number' as const },
    { key: 'status', label: 'Status', type: 'select' as const, options: ['Active', 'Inactive'] }
  ];
}