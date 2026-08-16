import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FeeMasterView } from '../fee-master-view';

@Component({ selector: 'app-due-adv-view', imports: [FormsModule], templateUrl: './due-adv-view.html', styleUrl: '../fee-master-view.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class DueAdvView extends FeeMasterView {
  readonly title = 'Due/Adv View';
  readonly fields = [
    { key: 'type', label: 'Type', type: 'select' as const, options: ['Due', 'Advance'] }, { key: 'ruleName', label: 'Rule Name' },
    { key: 'days', label: 'Days', type: 'number' as const }, { key: 'value', label: 'Amount / Percentage', type: 'number' as const },
    { key: 'appliesTo', label: 'Applies To' }, { key: 'status', label: 'Status', type: 'select' as const, options: ['Active', 'Inactive'] }
  ];
}