import { Component } from '@angular/core';

import { ChangeDetectionStrategy } from '@angular/core';
import { createFeeGridTabState } from '../fee-grid-tab';
import { StructureView } from '../views/structure-view/structure-view';

@Component({
  selector: 'app-structure-tab',
  imports: [StructureView],
  templateUrl: './structure-tab.html',
  styleUrl: './structure-tab.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StructureTab {
  private readonly state = createFeeGridTabState();
  readonly searchTerm = this.state.searchTerm;
  readonly showView = this.state.showView;
  readonly filteredRows = this.state.filteredRows;
  readonly updateSearch = this.state.updateSearch;
  readonly resetSearch = this.state.resetSearch;
  readonly openAddView = this.state.openAddView;
  readonly closeView = this.state.closeView;
}
