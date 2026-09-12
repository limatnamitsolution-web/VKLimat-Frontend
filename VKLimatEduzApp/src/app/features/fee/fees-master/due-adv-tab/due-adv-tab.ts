import { Component, inject } from '@angular/core';

import { ChangeDetectionStrategy } from '@angular/core';
import { createFeeGridTabState } from '../fee-grid-tab';
import { DueAdvView } from '../views/due-adv-view/due-adv-view';
import { MenuLabelService } from '../../../../shared/services/menu-label.service';

@Component({
  selector: 'app-due-adv-tab',
  imports: [DueAdvView],
  templateUrl: './due-adv-tab.html',
  styleUrl: './due-adv-tab.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DueAdvTab {
  private readonly state = createFeeGridTabState();
  private readonly menuLabelService = inject(MenuLabelService);
  readonly searchTerm = this.state.searchTerm;
  readonly showView = this.state.showView;
  readonly filteredRows = this.state.filteredRows;
  readonly updateSearch = this.state.updateSearch;
  readonly resetSearch = this.state.resetSearch;
  readonly openAddView = this.state.openAddView;
  readonly closeView = this.state.closeView;
  constructor() { this.menuLabelService.setLabel({ key: 'Due Advances' }); }
}
