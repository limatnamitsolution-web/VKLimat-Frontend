import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ConcessionDetailsTab } from './concession-details-tab/concession-details-tab';
import { ConcessionTab } from './concession-tab/concession-tab';
import { DueAdvTab } from './due-adv-tab/due-adv-tab';
import { GroupTab } from './group-tab/group-tab';
import { FeeCompTab } from './feeComp-tab/feeComp-tab';
import { OptionalTab } from './optional-tab/optional-tab';
import { FeeplanTab } from './structure-tab/structure-tab';
import { MastersConfig } from '../../mastersConfig/Services/masters-config';
import { FeePlanService } from './Service/feePlan.service';

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
    DueAdvTab
  ],
  templateUrl: './fees-master-component.html',
  styleUrl: './fees-master-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeesMasterComponent {
  private readonly mastersConfig = inject(MastersConfig);
  private readonly feePlanService = inject(FeePlanService);
  readonly tabs: TabItem[] = [
    { label: 'Group', key: 'group' },
    { label: 'FeeComp', key: 'fee-comp' },
    { label: 'Feeplan', key: 'feeplan' },
    { label: 'Optional', key: 'optional' },
    { label: 'Concession', key: 'concession' },
    { label: 'Concession Details', key: 'concession-details' },
    { label: 'Due/Adv', key: 'due-adv' }
  ];

  readonly activeTab = signal('fee-comp');

  selectTab(key: string): void {
    this.resetTabModels();
    this.activeTab.set(key);
  }

  private resetTabModels(): void {
    this.mastersConfig.masterConfig.set(null);
    this.feePlanService.feePlan.set(null);
  }
}