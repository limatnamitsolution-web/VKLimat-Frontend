import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { LateFeesDaysTab } from './late-fees-days-tab/late-fees-days-tab';
import { LateFeesMonthsTab } from './late-fees-months-tab/late-fees-months-tab';
import { LateFeesStudTab } from './late-fees-stud-tab/late-fees-stud-tab';
import { LateFineAttendanceTab } from './late-fine-attendance-tab/late-fine-attendance-tab';

interface TabItem {
  label: string;
  key: string;
}

@Component({
  selector: 'app-latefine-component',
  imports: [
    LateFeesDaysTab,
    LateFeesMonthsTab,
    LateFeesStudTab,
    LateFineAttendanceTab
  ],
  templateUrl: './latefine-component.html',
  styleUrl: './latefine-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LatefineComponent {
  readonly tabs: TabItem[] = [
    { label: 'LateFees-Days', key: 'late-fees-days' },
    { label: 'LateFees-Months', key: 'late-fees-months' },
    { label: 'LateFees-Stud', key: 'late-fees-stud' },
    { label: 'LateFine-Attendance', key: 'late-fine-attendance' }
  ];

  readonly activeTab = signal('late-fees-days');

  selectTab(key: string): void {
    this.activeTab.set(key);
  }
}
