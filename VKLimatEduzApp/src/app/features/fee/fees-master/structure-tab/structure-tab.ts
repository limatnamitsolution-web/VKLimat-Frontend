import { Component, inject } from '@angular/core';

import { ChangeDetectionStrategy } from '@angular/core';
import { createFeeGridTabState } from '../fee-grid-tab';
import { FeeplanView } from '../views/structure-view/structure-view';
import { MenuLabelService } from '../../../../shared/services/menu-label.service';

@Component({
  selector: 'app-feeplan-tab',
  imports: [FeeplanView],
  templateUrl: './structure-tab.html',
  styleUrl: './structure-tab.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeeplanTab {
  private readonly state = createFeeGridTabState();
  private readonly menuLabelService = inject(MenuLabelService);
  readonly searchTerm = this.state.searchTerm;
  readonly showView = this.state.showView;
  readonly filteredRows = this.state.filteredRows;
  readonly updateSearch = this.state.updateSearch;
  readonly resetSearch = this.state.resetSearch;
  readonly openAddView = this.state.openAddView;
  readonly closeView = this.state.closeView;
  constructor() {
    this.menuLabelService.setLabel({ key: 'Fee Plans' });
  }
}
