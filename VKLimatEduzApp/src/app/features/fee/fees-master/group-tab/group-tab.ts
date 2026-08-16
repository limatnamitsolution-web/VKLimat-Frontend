import { Component } from '@angular/core';

import { ChangeDetectionStrategy } from '@angular/core';
import { createFeeGridTabState } from '../fee-grid-tab';
import { GroupView } from '../views/group-view/group-view';

@Component({
  selector: 'app-group-tab',
  imports: [GroupView],
  templateUrl: './group-tab.html',
  styleUrl: './group-tab.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupTab {
  private readonly state = createFeeGridTabState();
  readonly searchTerm = this.state.searchTerm;
  readonly showView = this.state.showView;
  readonly filteredRows = this.state.filteredRows;
  readonly updateSearch = this.state.updateSearch;
  readonly resetSearch = this.state.resetSearch;
  readonly openAddView = this.state.openAddView;
  readonly closeView = this.state.closeView;
}
