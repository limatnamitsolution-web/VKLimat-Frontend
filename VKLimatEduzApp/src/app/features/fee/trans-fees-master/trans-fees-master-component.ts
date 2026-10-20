import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TransConcessionDetailsTab } from './trans-concession-details-tab/trans-concession-details-tab';
import { TransConcessionTab } from './trans-concession-tab/trans-concession-tab';
import { TransGroupTab } from './trans-group-tab/trans-group-tab';
import { TransFeeCompTab } from './transFeeComp-tab/transFeeComp-tab';
import { TransFeeplanTab } from './trans-structure-tab/trans-structure-tab';
import { MastersConfig } from '../../mastersConfig/Services/masters-config';
import { TransFeePlanService } from './Service/transFeePlan.service';

interface TabItem {
  label: string;
  key: string;
}

@Component({
  selector: 'app-trans-fees-master-component',
  imports: [
    TransFeeCompTab,
    TransGroupTab,
    TransFeeplanTab,
    TransConcessionTab,
    TransConcessionDetailsTab
  ],
  templateUrl: './trans-fees-master-component.html',
  styleUrl: './trans-fees-master-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransFeesMasterComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly mastersConfig = inject(MastersConfig);
  private readonly transFeePlanService = inject(TransFeePlanService);
  readonly tabs: TabItem[] = [
    { label: 'Transport Fee Group', key: 'group' },
    { label: 'Transport Fee Component', key: 'fee-comp' },
    { label: 'Transport Fee Plan', key: 'feeplan' },
    { label: 'Concession Type', key: 'concessionType' },
    { label: 'Concession', key: 'concession' }
  ];

  readonly activeTab = signal(this.readInitialTab());

  selectTab(key: string): void {
    this.resetTabModels();
    this.activeTab.set(key);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: key },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  private resetTabModels(): void {
    this.mastersConfig.masterConfig.set(null);
    this.transFeePlanService.transFeePlan.set(null);
  }

  private readInitialTab(): string {
    const tab = this.route.snapshot.queryParamMap.get('tab');
    return this.tabs.some(item => item.key === tab) ? tab as string : 'group';
  }
}