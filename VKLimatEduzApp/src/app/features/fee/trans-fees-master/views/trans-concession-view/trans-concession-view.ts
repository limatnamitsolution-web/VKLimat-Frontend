import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TransFeeMasterView } from '../trans-fee-master-view';

@Component({ selector: 'app-trans-concession-view', imports: [FormsModule], templateUrl: './trans-concession-view.html', styleUrls: ['../trans-fee-master-view.scss'], changeDetection: ChangeDetectionStrategy.OnPush })
export class TransConcessionView extends TransFeeMasterView {
  readonly title = 'Transport Concession Type View';
  readonly fields = [
    { key: 'code', label: 'Code' }, { key: 'name', label: 'Concession Name' }, { key: 'description', label: 'Concession description' },
    { key: 'displayOrder', label: 'Display Order', type: 'number' as const },
    { key: 'status', label: 'Status', type: 'select' as const, options: ['Active', 'Inactive'] }
  ];
}