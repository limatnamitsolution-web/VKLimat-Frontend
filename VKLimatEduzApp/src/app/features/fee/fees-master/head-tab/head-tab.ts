import { Component } from '@angular/core';

import { ChangeDetectionStrategy } from '@angular/core';
import { createFeeGridTabState } from '../fee-grid-tab';
import { HeadView } from '../views/head-view/head-view';

@Component({
  selector: 'app-head-tab',
  imports: [HeadView],
  templateUrl: './head-tab.html',
  styleUrl: './head-tab.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeadTab {
  private readonly state = createFeeGridTabState();
  readonly searchTerm = this.state.searchTerm;
  readonly showView = this.state.showView;
  readonly filteredRows = this.state.filteredRows;
  readonly updateSearch = this.state.updateSearch;
  readonly resetSearch = this.state.resetSearch;
  readonly openAddView = this.state.openAddView;
  readonly closeView = this.state.closeView;
}
