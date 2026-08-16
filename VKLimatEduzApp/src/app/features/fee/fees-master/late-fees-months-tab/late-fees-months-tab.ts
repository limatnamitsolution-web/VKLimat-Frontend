import { Component } from '@angular/core';

import { ChangeDetectionStrategy } from '@angular/core';
import { createFeeGridTabState } from '../fee-grid-tab';
import { LateFeesMonthsView } from '../views/late-fees-months-view/late-fees-months-view';

@Component({
  selector: 'app-late-fees-months-tab',
  imports: [LateFeesMonthsView],
  templateUrl: './late-fees-months-tab.html',
  styleUrl: './late-fees-months-tab.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LateFeesMonthsTab {
  private readonly state = createFeeGridTabState();
  readonly searchTerm = this.state.searchTerm;
  readonly showView = this.state.showView;
  readonly filteredRows = this.state.filteredRows;
  readonly updateSearch = this.state.updateSearch;
  readonly resetSearch = this.state.resetSearch;
  readonly openAddView = this.state.openAddView;
  readonly closeView = this.state.closeView;
}
