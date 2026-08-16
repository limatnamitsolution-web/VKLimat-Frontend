import { Component } from '@angular/core';

import { ChangeDetectionStrategy } from '@angular/core';
import { createFeeGridTabState } from '../fee-grid-tab';
import { LateFeesDaysView } from '../views/late-fees-days-view/late-fees-days-view';

@Component({
  selector: 'app-late-fees-days-tab',
  imports: [LateFeesDaysView],
  templateUrl: './late-fees-days-tab.html',
  styleUrl: './late-fees-days-tab.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LateFeesDaysTab {
  private readonly state = createFeeGridTabState();
  readonly searchTerm = this.state.searchTerm;
  readonly showView = this.state.showView;
  readonly filteredRows = this.state.filteredRows;
  readonly updateSearch = this.state.updateSearch;
  readonly resetSearch = this.state.resetSearch;
  readonly openAddView = this.state.openAddView;
  readonly closeView = this.state.closeView;
}
