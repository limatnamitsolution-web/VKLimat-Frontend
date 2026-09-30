import { Component, inject } from '@angular/core';

import { ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { createFeeGridTabState } from '../fee-grid-tab';
import { MenuLabelService } from '../../../../shared/services/menu-label.service';

@Component({
  selector: 'app-feeComp-tab',
  imports: [ReactiveFormsModule],
  templateUrl: './feeComp-tab.html',
  styleUrls: ['./feeComp-tab.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeeCompTab {
  private readonly state = createFeeGridTabState();
  private readonly menuLabelService = inject(MenuLabelService);
  private readonly fb = inject(FormBuilder);
  readonly searchTerm = this.state.searchTerm;
  readonly showView = this.state.showView;
  readonly filteredRows = this.state.filteredRows;
  readonly rows = this.state.rows;
  readonly updateSearch = this.state.updateSearch;
  readonly resetSearch = this.state.resetSearch;
  readonly closeView = this.state.closeView;

  readonly form: FormGroup = this.fb.group({
    BranchId: [''],
    FeeCompCode: [''],
    FeeComp: [''],
    FeeCompTaken: ['No'],
    FeeCompOpt: ['No'],
    FeeCompRefundable: ['No'],
    DispFeeRecpt: ['No'],
    FeeCompEditable: ['No'],
    FeeConcEditable: ['No'],
    OrderId: ['']
  });

  constructor() {
    this.menuLabelService.setLabel({ key: 'Fee Components' });
  }

  openAdd(): void {
    this.form.reset({
      BranchId: '',
      FeeCompCode: '',
      FeeComp: '',
      FeeCompTaken: 'No',
      FeeCompOpt: 'No',
      FeeCompRefundable: 'No',
      DispFeeRecpt: 'No',
      FeeCompEditable: 'No',
      FeeConcEditable: 'No',
      OrderId: ''
    });
    this.state.openAddView();
  }

  saveModel(): void {
    this.rows.set([...this.rows(), this.form.value]);
    this.state.closeView();
  }

  cancelModel(): void {
    this.state.closeView();
  }
}
