import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FeeMasterView } from '../fee-master-view';

@Component({ selector: 'app-concession-view', imports: [FormsModule], templateUrl: './concession-view.html', styleUrl: '../fee-master-view.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class ConcessionView extends FeeMasterView {
  readonly title = 'Concession View';
  readonly fields = [
    { key: 'code', label: 'Code' }, { key: 'name', label: 'Concession Name' },
    { key: 'type', label: 'Type', type: 'select' as const, options: ['Amount', 'Percentage'] },
    { key: 'value', label: 'Value', type: 'number' as const }, { key: 'maximumAmount', label: 'Maximum Amount', type: 'number' as const },
    { key: 'status', label: 'Status', type: 'select' as const, options: ['Active', 'Inactive'] }
  ];
}