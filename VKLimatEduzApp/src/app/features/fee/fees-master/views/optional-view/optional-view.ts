import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FeeMasterView } from '../fee-master-view';

@Component({ selector: 'app-optional-view', imports: [FormsModule], templateUrl: './optional-view.html', styleUrl: '../fee-master-view.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class OptionalView extends FeeMasterView {
  readonly title = 'Optional View';
  readonly fields = [
    { key: 'name', label: 'Optional Fee' }, { key: 'applicableClass', label: 'Applicable Class' },
    { key: 'amount', label: 'Amount', type: 'number' as const },
    { key: 'selectionType', label: 'Selection Type', type: 'select' as const, options: ['Optional', 'Mandatory'] },
    { key: 'status', label: 'Status', type: 'select' as const, options: ['Active', 'Inactive'] }
  ];
}