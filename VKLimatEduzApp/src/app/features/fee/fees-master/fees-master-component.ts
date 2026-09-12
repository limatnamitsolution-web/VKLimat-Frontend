import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ConcessionDetailsTab } from './concession-details-tab/concession-details-tab';
import { ConcessionTab } from './concession-tab/concession-tab';
import { DueAdvTab } from './due-adv-tab/due-adv-tab';
import { GroupTab } from './group-tab/group-tab';
import { FeeCompTab } from './feeComp-tab/feeComp-tab';
import { LateFeesDaysTab } from './late-fees-days-tab/late-fees-days-tab';
import { LateFeesMonthsTab } from './late-fees-months-tab/late-fees-months-tab';
import { LateFeesStudTab } from './late-fees-stud-tab/late-fees-stud-tab';
import { LateFineAttendanceTab } from './late-fine-attendance-tab/late-fine-attendance-tab';
import { OptionalTab } from './optional-tab/optional-tab';
import { FeeplanTab } from './structure-tab/structure-tab';

interface TabItem {
  label: string;
  key: string;
}

@Component({
  selector: 'app-fees-master-component',
  imports: [
    FeeCompTab,
    GroupTab,
    FeeplanTab,
    OptionalTab,
    ConcessionTab,
    ConcessionDetailsTab,
    DueAdvTab,
    LateFeesDaysTab,
    LateFeesMonthsTab,
    LateFeesStudTab,
    LateFineAttendanceTab
  ],
  templateUrl: './fees-master-component.html',
  styleUrl: './fees-master-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeesMasterComponent {
  readonly tabs: TabItem[] = [
    { label: 'Group', key: 'group' },
    { label: 'FeeComp', key: 'fee-comp' },
    { label: 'Feeplan', key: 'feeplan' },
    { label: 'Optional', key: 'optional' },
    { label: 'Concession', key: 'concession' },
    { label: 'Concession Details', key: 'concession-details' },
    { label: 'Due/Adv', key: 'due-adv' },
    { label: 'LateFees-Days', key: 'late-fees-days' },
    { label: 'LateFees-Months', key: 'late-fees-months' },
    { label: 'LateFees-Stud', key: 'late-fees-stud' },
    { label: 'LateFine-Attendance', key: 'late-fine-attendance' }
  ];

  readonly activeTab = signal('fee-comp');

  selectTab(key: string): void {
    this.activeTab.set(key);
  }
}