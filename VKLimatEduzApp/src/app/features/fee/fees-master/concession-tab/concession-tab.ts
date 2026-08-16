import { Component } from '@angular/core';

import { ChangeDetectionStrategy } from '@angular/core';
import { createFeeGridTabState } from '../fee-grid-tab';
import { ConcessionView } from '../views/concession-view/concession-view';

@Component({
  selector: 'app-concession-tab',
  imports: [ConcessionView],
  templateUrl: './concession-tab.html',
  styleUrl: './concession-tab.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConcessionTab {
  private readonly state = createFeeGridTabState();
  readonly searchTerm = this.state.searchTerm;
  readonly showView = this.state.showView;
  readonly filteredRows = this.state.filteredRows;
  readonly updateSearch = this.state.updateSearch;
  readonly resetSearch = this.state.resetSearch;
  readonly openAddView = this.state.openAddView;
  readonly closeView = this.state.closeView;
}
