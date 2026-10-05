import { Component, effect, inject, OnInit, signal } from '@angular/core';

import { ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { createFeeGridTabState } from '../fee-grid-tab';
import { MasterConfigsDWN } from '../../../../shared/services/master-configs-dwn';
import { SearchableDropdownComponent, SearchableDropdownOption } from '../../../../shared/components/searchable-dropdown/searchable-dropdown.component';
import { MenuLabelService } from '../../../../shared/services/menu-label.service';

@Component({
  selector: 'app-feeplan-tab',
  imports: [ReactiveFormsModule, SearchableDropdownComponent],
  templateUrl: './structure-tab.html',
  styleUrl: './structure-tab.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeeplanTab implements OnInit {
  private readonly state = createFeeGridTabState();
  private readonly masterConfigsDWN = inject(MasterConfigsDWN);
  private readonly menuLabelService = inject(MenuLabelService);
  private readonly fb = inject(FormBuilder);
  private readonly masterConfigDwnTypes = ['Branch', 'FeeGroup', 'FeeComponent'];
  private isDropdownLoadPending = false;
  readonly searchTerm = this.state.searchTerm;
  readonly showView = this.state.showView;
  readonly filteredRows = this.state.filteredRows;
  readonly rows = this.state.rows;
  readonly updateSearch = this.state.updateSearch;
  readonly resetSearch = this.state.resetSearch;
  readonly closeView = this.state.closeView;
  readonly feeGroups = signal<SearchableDropdownOption[]>([]);
  readonly feeComponents = signal<SearchableDropdownOption[]>([]);

  readonly monthsList = [
    { label: 'Apr', monthId: 4 }, { label: 'May', monthId: 5 }, { label: 'Jun', monthId: 6 },
    { label: 'Jul', monthId: 7 }, { label: 'Aug', monthId: 8 }, { label: 'Sep', monthId: 9 },
    { label: 'Oct', monthId: 10 }, { label: 'Nov', monthId: 11 }, { label: 'Dec', monthId: 12 },
    { label: 'Jan', monthId: 1 }, { label: 'Feb', monthId: 2 }, { label: 'Mar', monthId: 3 }
  ];

  readonly form: FormGroup = this.fb.group({
    BranchId: [''],
    FY: [''],
    FeeGroupId: [''],
    FeeCompId: [''],
    Fees: [0],
    FeeCompTaken: ['No'],
    FeeCompOpt: ['No'],
    FeeCompRefundable: ['No'],
    DispFeeRecpt: ['No'],
    FeeCompEditable: ['No'],
    FeeConcEditable: ['No'],
    OrderId: [0],
    months: this.fb.array(this.monthsList.map(() => false))
  });

  get monthsArray(): FormArray {
    return this.form.get('months') as FormArray;
  }

  constructor() {
    this.menuLabelService.setLabel({ key: 'Fee Plans' });

    effect(() => {
      const dwnList = this.masterConfigsDWN.masterConfigDwnList();
      if (!this.isDropdownLoadPending || !Array.isArray(dwnList)) {
        return;
      }

      this.bindMasterDropdowns(dwnList);
    });
  }

  ngOnInit(): void {
    this.isDropdownLoadPending = true;
    this.masterConfigsDWN.fetchMasterConfigDWN(this.masterConfigDwnTypes.toString());
  }

  private bindMasterDropdowns(rawMasterItems: Record<string, unknown>[]): void {
    const nextFeeGroups: SearchableDropdownOption[] = [];
    const nextFeeComponents: SearchableDropdownOption[] = [];

    rawMasterItems.forEach((item) => {
      const option = {
        id: item['id'] as number | string,
        name: String(item['name'] ?? ''),
      };
      const type = String(item['type'] ?? '').toLowerCase();

      if (type === 'feegroup') {
        nextFeeGroups.push(option);
      }

      if (type === 'feecomponent') {
        nextFeeComponents.push(option);
      }
    });

    this.feeGroups.set(nextFeeGroups);
    this.feeComponents.set(nextFeeComponents);
    this.isDropdownLoadPending = false;
  }

  openAdd(): void {
    this.form.reset({
      BranchId: '',
      FY: '',
      FeeGroupId: '',
      FeeCompId: '',
      Fees: 0,
      FeeCompTaken: 'No',
      FeeCompOpt: 'No',
      FeeCompRefundable: 'No',
      DispFeeRecpt: 'No',
      FeeCompEditable: 'No',
      FeeConcEditable: 'No',
      OrderId: 0,
      months: this.monthsList.map(() => false)
    });
    this.state.openAddView();
  }

  saveModel(): void {
    const { months, ...rest } = this.form.getRawValue();

    console.log('Rest of the form data:', rest);
    console.log('Selected months:', months);

    const feeMonthIds = (months as boolean[])
      .map((selected, index) => (selected ? this.monthsList[index].monthId : null))
      .filter((id): id is number => id !== null);
    this.rows.set([...this.rows(), { ...rest, FeeMonthId: feeMonthIds }]);

    //this.state.closeView();
  }

  cancelModel(): void {
    this.state.closeView();
  }
}
