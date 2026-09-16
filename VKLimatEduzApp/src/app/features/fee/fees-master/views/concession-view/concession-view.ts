import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FeeMasterView } from '../fee-master-view';

@Component({ selector: 'app-concession-view', imports: [FormsModule], templateUrl: './concession-view.html', styleUrls: ['../fee-master-view.scss'], changeDetection: ChangeDetectionStrategy.OnPush })
export class ConcessionView extends FeeMasterView {
  readonly title = 'Concession View';
  readonly fields = [
    { key: 'code', label: 'Code' }, { key: 'name', label: 'Concession Name' }, { key: 'description', label: 'Fee Component' },
    { key: 'displayOrder', label: 'Display Order', type: 'number' as const },
    { key: 'status', label: 'Status', type: 'select' as const, options: ['Active', 'Inactive'] }
  ];
}