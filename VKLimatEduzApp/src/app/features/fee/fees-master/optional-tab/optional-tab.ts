import { Component, inject } from '@angular/core';

import { ChangeDetectionStrategy } from '@angular/core';
import { createFeeGridTabState } from '../fee-grid-tab';
import { OptionalView } from '../views/optional-view/optional-view';
import { MenuLabelService } from '../../../../shared/services/menu-label.service';

@Component({
  selector: 'app-optional-tab',
  imports: [OptionalView],
  templateUrl: './optional-tab.html',
  styleUrl: './optional-tab.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionalTab {
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
    this.menuLabelService.setLabel({ key: 'Optional Fees' });
  }
}
