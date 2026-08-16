import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FeeMasterView } from '../fee-master-view';

@Component({ selector: 'app-late-fees-stud-view', imports: [FormsModule], templateUrl: './late-fees-stud-view.html', styleUrl: '../fee-master-view.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class LateFeesStudView extends FeeMasterView {
  readonly title = 'LateFees-Stud View';
  readonly fields = [
    { key: 'admissionNo', label: 'Admission No.' }, { key: 'studentName', label: 'Student Name' }, { key: 'class', label: 'Class' },
    { key: 'feeHead', label: 'Fee Head' }, { key: 'dueAmount', label: 'Due Amount', type: 'number' as const },
    { key: 'lateFee', label: 'Late Fee', type: 'number' as const },
    { key: 'status', label: 'Status', type: 'select' as const, options: ['Pending', 'Paid', 'Waived'] }
  ];
}