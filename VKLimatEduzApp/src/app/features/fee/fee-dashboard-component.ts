import { Component, signal } from '@angular/core';

import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-fee-dashboard-component',
  imports: [],
  templateUrl: './fee-dashboard-component.html',
  styleUrl: './fee-dashboard-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeeDashboardComponent {
  feeCount = signal(0);

  incrementFee() {
    this.feeCount.update(count => count + 1);
  }
}
