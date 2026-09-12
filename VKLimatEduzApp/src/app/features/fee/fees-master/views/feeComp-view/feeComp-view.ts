import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FeeMasterView } from '../fee-master-view';

@Component({ selector: 'app-feeComp-view', imports: [FormsModule], templateUrl: './feeComp-view.html', styleUrl: '../fee-master-view.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class FeeCompView extends FeeMasterView {
  readonly title = 'FeeComp View';
  readonly fields = [
    { key: 'code', label: 'Code' }, { key: 'name', label: 'Fee Component Name' }, { key: 'category', label: 'Category' },
    { key: 'refundable', label: 'Refundable', type: 'select' as const, options: ['Yes', 'No'] },
    { key: 'status', label: 'Status', type: 'select' as const, options: ['Active', 'Inactive'] }
  ];
}