import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TransFeeMasterView } from '../trans-fee-master-view';

@Component({ selector: 'app-trans-group-view', imports: [FormsModule], templateUrl: './trans-group-view.html', styleUrls: ['../trans-fee-master-view.scss'], changeDetection: ChangeDetectionStrategy.OnPush })
export class TransGroupView extends TransFeeMasterView {
  readonly title = 'Transport Fee Group View';
  readonly fields = [
    { key: 'code', label: 'Code' }, { key: 'name', label: 'Group Name' }, { key: 'description', label: 'Fee Component' },
    { key: 'displayOrder', label: 'Display Order', type: 'number' as const },
    { key: 'status', label: 'Status', type: 'select' as const, options: ['Active', 'Inactive'] }
  ];
}