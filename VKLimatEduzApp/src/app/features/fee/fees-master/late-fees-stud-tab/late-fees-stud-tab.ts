import { Component } from '@angular/core';

import { ChangeDetectionStrategy } from '@angular/core';
import { createFeeGridTabState } from '../fee-grid-tab';
import { LateFeesStudView } from '../views/late-fees-stud-view/late-fees-stud-view';

@Component({
  selector: 'app-late-fees-stud-tab',
  imports: [LateFeesStudView],
  templateUrl: './late-fees-stud-tab.html',
  styleUrl: './late-fees-stud-tab.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LateFeesStudTab {
  private readonly state = createFeeGridTabState();
  readonly searchTerm = this.state.searchTerm;
  readonly showView = this.state.showView;
  readonly filteredRows = this.state.filteredRows;
  readonly updateSearch = this.state.updateSearch;
  readonly resetSearch = this.state.resetSearch;
  readonly openAddView = this.state.openAddView;
  readonly closeView = this.state.closeView;
}
