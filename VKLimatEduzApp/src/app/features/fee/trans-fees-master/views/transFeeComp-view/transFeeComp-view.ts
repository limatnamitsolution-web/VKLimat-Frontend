import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TransFeeMasterView } from '../trans-fee-master-view';

@Component({ selector: 'app-transFeeComp-view', imports: [FormsModule], templateUrl: './transFeeComp-view.html', styleUrls: ['../trans-fee-master-view.scss'], changeDetection: ChangeDetectionStrategy.OnPush })
export class TransFeeCompView extends TransFeeMasterView {
  readonly title = 'Transport Fee Component View';
  readonly fields = [
    { key: 'code', label: 'Code' }, { key: 'name', label: 'Fee Component Name' }, { key: 'description', label: 'Category' },
    { key: 'refundable', label: 'Refundable', type: 'select' as const, options: ['Yes', 'No'] },
    { key: 'status', label: 'Status', type: 'select' as const, options: ['Active', 'Inactive'] }
  ];
}