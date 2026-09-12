import { Component, inject } from '@angular/core';

import { ChangeDetectionStrategy } from '@angular/core';
import { createFeeGridTabState } from '../fee-grid-tab';
import { FeeCompView } from '../views/feeComp-view/feeComp-view';
import { MenuLabelService } from '../../../../shared/services/menu-label.service';

@Component({
  selector: 'app-feeComp-tab',
  imports: [FeeCompView],
  templateUrl: './feeComp-tab.html',
  styleUrls: ['./feeComp-tab.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeeCompTab {
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
    this.menuLabelService.setLabel({ key: 'Fee Components' });
  }
}
