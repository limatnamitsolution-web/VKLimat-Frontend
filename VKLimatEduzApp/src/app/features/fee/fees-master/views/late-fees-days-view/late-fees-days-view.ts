import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FeeMasterView } from '../fee-master-view';

@Component({ selector: 'app-late-fees-days-view', imports: [FormsModule], templateUrl: './late-fees-days-view.html', styleUrl: '../fee-master-view.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class LateFeesDaysView extends FeeMasterView {
  readonly title = 'LateFees-Days View';
  readonly fields = [
    { key: 'fromDay', label: 'From Day', type: 'number' as const }, { key: 'toDay', label: 'To Day', type: 'number' as const },
    { key: 'fineType', label: 'Fine Type', type: 'select' as const, options: ['Amount', 'Percentage'] },
    { key: 'fineValue', label: 'Fine Value', type: 'number' as const }, { key: 'maximumFine', label: 'Maximum Fine', type: 'number' as const },
    { key: 'status', label: 'Status', type: 'select' as const, options: ['Active', 'Inactive'] }
  ];
}