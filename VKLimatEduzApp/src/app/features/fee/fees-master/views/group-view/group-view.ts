import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FeeMasterView } from '../fee-master-view';

@Component({ selector: 'app-group-view', imports: [FormsModule], templateUrl: './group-view.html', styleUrl: '../fee-master-view.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class GroupView extends FeeMasterView {
  readonly title = 'Group View';
  readonly fields = [
    { key: 'code', label: 'Code' }, { key: 'name', label: 'Group Name' }, { key: 'feeHeads', label: 'Fee Heads' },
    { key: 'displayOrder', label: 'Display Order', type: 'number' as const },
    { key: 'status', label: 'Status', type: 'select' as const, options: ['Active', 'Inactive'] }
  ];
}