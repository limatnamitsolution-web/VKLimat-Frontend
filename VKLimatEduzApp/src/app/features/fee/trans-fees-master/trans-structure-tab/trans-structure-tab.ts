import { Component, effect, inject, OnInit, signal } from '@angular/core';

import { ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { createTransFeeGridTabState } from '../fee-grid-tab';
import { MasterConfigsDWN } from '../../../../shared/services/master-configs-dwn';
import { SearchableDropdownComponent, SearchableDropdownOption } from '../../../../shared/components/searchable-dropdown/searchable-dropdown.component';
import { MenuLabelService } from '../../../../shared/services/menu-label.service';
import { TransFeePlanService } from '../Service/transFeePlan.service';
import { MessageService } from '../../../../shared/services/message.service';

@Component({
  selector: 'app-trans-feeplan-tab',
  imports: [ReactiveFormsModule, SearchableDropdownComponent],
  templateUrl: './trans-structure-tab.html',
  styleUrl: './trans-structure-tab.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransFeeplanTab implements OnInit {
  private readonly state = createTransFeeGridTabState();
  private readonly masterConfigsDWN = inject(MasterConfigsDWN);
  private readonly transFeePlanService = inject(TransFeePlanService);
  private readonly menuLabelService = inject(MenuLabelService);
  private readonly messageService = inject(MessageService);
  private readonly fb = inject(FormBuilder);
  private readonly masterConfigDwnTypes = ['Branch', 'TransFeeGroup', 'TransFeeComponent'];
  private editingId: number | null = null;
  private activeRow: Record<string, unknown> | null = null;
  readonly searchTerm = this.state.searchTerm;
  readonly showView = this.state.showView;
  readonly filteredRows = this.state.filteredRows;
  readonly paginatedRows = this.state.paginatedRows;
  readonly currentPage = this.state.currentPage;
  readonly totalPages = this.state.totalPages;
  readonly startEntry = this.state.startEntry;
  readonly endEntry = this.state.endEntry;
  readonly pageSize = this.state.pageSize;
  readonly pageSizeOptions = this.state.pageSizeOptions;
  readonly rows = this.state.rows;
  readonly updateSearch = this.state.updateSearch;
  readonly resetSearch = this.state.resetSearch;
  readonly previousPage = this.state.previousPage;
  readonly nextPage = this.state.nextPage;
  readonly changePageSize = this.state.changePageSize;
  readonly sortColumn = this.state.sortColumn;
  readonly sortDirection = this.state.sortDirection;
  readonly sortBy = this.state.sortBy;
  readonly sortIndicator = this.state.sortIndicator;
  readonly closeView = this.state.closeView;
  readonly branches = signal<SearchableDropdownOption[]>([]);
  readonly transFeeGroups = signal<SearchableDropdownOption[]>([]);
  readonly transFeeComponents = signal<SearchableDropdownOption[]>([]);

  readonly monthsList = [
    { label: 'Apr', monthId: 4 }, { label: 'May', monthId: 5 }, { label: 'Jun', monthId: 6 },
    { label: 'Jul', monthId: 7 }, { label: 'Aug', monthId: 8 }, { label: 'Sep', monthId: 9 },
    { label: 'Oct', monthId: 10 }, { label: 'Nov', monthId: 11 }, { label: 'Dec', monthId: 12 },
    { label: 'Jan', monthId: 1 }, { label: 'Feb', monthId: 2 }, { label: 'Mar', monthId: 3 }
  ];

  readonly form: FormGroup = this.fb.group({
    BranchId: [''],
    TransFeeGroupId: [''],
    TransFeeCompId: [''],
    TransFees: [0],
    TransFeeCompTaken: ['No'],
    TransFeeCompOpt: ['No'],
    TransFeeCompRefundable: ['No'],
    TransDispFeeRecpt: ['No'],
    TransFeeCompEditable: ['No'],
    TransFeeConcEditable: ['No'],
    OrderId: [0],
    IsActive: [true],
    months: this.fb.array(this.monthsList.map(() => false))
  });

  get monthsArray(): FormArray {
    return this.form.get('months') as FormArray;
  }

  constructor() {
    this.menuLabelService.setLabel({ key: 'Transport Fee Plans' });

    effect(() => {
      const dwnList = this.masterConfigsDWN.masterConfigDwnList();
      console.log("masterConfigDwnList",dwnList)
      if (!Array.isArray(dwnList)) {
        return;
      }

      this.bindMasterDropdowns(dwnList);
    });

    effect(() => {
      const list = this.transFeePlanService.transFeePlanList();   
      this.rows.set(Array.isArray(list) ? [...list] : []);
      this.state.resetPagination();
      console.log('Updated rows:', this.rows());
    });

    effect(() => {
      const selected = this.transFeePlanService.transFeePlan();
      if (!selected) {
        return;
      }

      this.activeRow = selected;
      this.editingId = this.resolveId(selected);
      this.form.patchValue({
        BranchId: this.resolveNumberValue(selected, ['BranchId', 'branchId', 'branch_id']),
        TransFeeGroupId: this.resolveNumberValue(selected, ['transFeeGroupId', 'feeGroupId', 'fee_group_id']),
        TransFeeCompId: this.resolveNumberValue(selected, ['TransFeeCompId', 'transFeeCompId', 'fee_comp_id']),
        TransFees: this.resolveNumberValue(selected, ['transFees', 'fees']),
        TransFeeCompTaken: this.resolveStringValue(selected, ['TransFeeCompTaken', 'transFeeCompTaken']) ?? 'No',
        TransFeeCompOpt: this.resolveStringValue(selected, ['TransFeeCompOpt', 'transFeeCompOpt']) ?? 'No',
        TransFeeCompRefundable: this.resolveStringValue(selected, ['TransFeeCompRefundable', 'transFeeCompRefundable']) ?? 'No',
        TransDispFeeRecpt: this.resolveStringValue(selected, ['TransDispFeeRecpt', 'dispFeeRecpt']) ?? 'No',
        TransFeeCompEditable: this.resolveStringValue(selected, ['TransFeeCompEditable', 'transFeeCompEditable']) ?? 'No',
        TransFeeConcEditable: this.resolveStringValue(selected, ['TransFeeConcEditable', 'feeConcEditable']) ?? 'No',
        OrderId: this.resolveNumberValue(selected, ['OrderId', 'orderId']),
        IsActive: this.resolveIsActive(selected)
      });
      this.patchMonthsFromValue(selected['transFeeMonthIds'] ?? selected['TransFeeMonthId'] ?? selected['feeMonthId']);
      this.state.openAddView();
      this.transFeePlanService.transFeePlan.set(null);
    });
  }

  ngOnInit(): void {
    this.masterConfigsDWN.fetchMasterConfigDWN(this.masterConfigDwnTypes.toString());
    this.transFeePlanService.fetchTransFeePlanList();
  }

  private bindMasterDropdowns(rawMasterItems: Record<string, unknown>[]): void {
    console.log('Raw master items:', rawMasterItems);
    const nextBranches: SearchableDropdownOption[] = [];
    const nextTransFeeGroups: SearchableDropdownOption[] = [];
    const nextTransFeeComponents: SearchableDropdownOption[] = [];
    rawMasterItems.forEach((item) => {
      const option = {
        id: item['id'] as number | string,
        name: String(item['name'] ?? ''),
      };
      const type = String(item['type'] ?? '').toLowerCase();

      if (type === 'branch') {
        nextBranches.push(option);
      }

      if (type === 'transfeegroup') {
        nextTransFeeGroups.push(option);
      }

      if (type === 'transfeecomponent') {
        nextTransFeeComponents.push(option);
      }
    });

    this.branches.set(nextBranches);
    this.transFeeGroups.set(nextTransFeeGroups);
    this.transFeeComponents.set(nextTransFeeComponents);
  }

  private resolveId(row: Record<string, unknown>): number | null {
    const candidate = row['id'] ?? row['Id'];
    const numeric = typeof candidate === 'string' ? Number(candidate) : candidate;
    return typeof numeric === 'number' && Number.isFinite(numeric) && numeric > 0 ? numeric : null;
  }

  resolveStringValue(row: Record<string, unknown>, keys: string[]): string | null {
    for (const key of keys) {
      const value = row[key];
      if (value !== undefined && value !== null && value !== '') {
        return String(value);
      }
    }

    return null;
  }

  private resolveNumberValue(row: Record<string, unknown>, keys: string[]): number {
    const value = this.resolveStringValue(row, keys);
    if (value === null) {
      return 0;
    }

    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : 0;
  }

  private parseNumberOrNull(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const numeric = typeof value === 'string' ? Number(value) : value;
    return typeof numeric === 'number' && Number.isFinite(numeric) ? numeric : null;
  }

  private resolveIsActive(row: Record<string, unknown>): boolean {
    const value = this.resolveStringValue(row, ['isActive', 'IsActive']);
    if (value === null) {
      return true;
    }

    return value.toLowerCase() === 'true' || value.toLowerCase() === 'active' || value === '1';
  }

  resolveStatusText(row: Record<string, unknown>): string {
    const status = this.resolveStringValue(row, ['Status', 'status']);
    if (status) {
      return status;
    }

    return this.resolveIsActive(row) ? 'Active' : 'Inactive';
  }

  private patchMonthsFromValue(value: unknown): void {
    const ids = Array.isArray(value)
      ? value
      : typeof value === 'string'
        ? value.split(',').map(item => item.trim()).filter(Boolean).map(item => Number(item))
        : [];

    const selectedIds = new Set(ids.filter((item): item is number => Number.isFinite(item)));
    this.monthsArray.controls.forEach((control, index) => {
      control.setValue(selectedIds.has(this.monthsList[index].monthId), { emitEvent: false });
    });
  }

  openAdd(): void {
    this.editingId = null;
    this.activeRow = null;
    this.form.reset({
      BranchId: '',
      TransFeeGroupId: '',
      TransFeeCompId: '',
      TransFees: 0,
      TransFeeCompTaken: 'No',
      TransFeeCompOpt: 'No',
      TransFeeCompRefundable: 'No',
      TransDispFeeRecpt: 'No',
      TransFeeCompEditable: 'No',
      TransFeeConcEditable: 'No',
      OrderId: 0,
      IsActive: true,
      months: this.monthsList.map(() => false)
    });
    this.state.openAddView();
  }

  saveModel(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.show('Please fill the required fee plan fields', 'error');
      return;
    }

    const { months, ...rest } = this.form.getRawValue();
    const feeMonthIds = (months as boolean[])
      .map((selected, index) => (selected ? this.monthsList[index].monthId : null))
      .filter((id): id is number => id !== null);
    const feeMonthIdsValue = feeMonthIds.join(',');
    const branchId = this.parseNumberOrNull(rest['BranchId']);
    const feeGroupId = this.parseNumberOrNull(rest['TransFeeGroupId']);
    const transFeeCompId = this.parseNumberOrNull(rest['TransFeeCompId']);
    const fees = this.parseNumberOrNull(rest['TransFees']);
    const orderId = this.parseNumberOrNull(rest['OrderId']);
    const isActive = Boolean(rest['IsActive']);
    const request: Record<string, unknown> = {
      Id: this.editingId ?? this.resolveId(this.activeRow ?? {}) ?? undefined,
      TransFY: '',
      BranchId: branchId,
      TransFeeGroupId: feeGroupId,
      TransFeeCompId: transFeeCompId,
      TransFees: fees,
      TransFeeCompTaken: rest['TransFeeCompTaken'],
      TransFeeCompOpt: rest['TransFeeCompOpt'],
      TransFeeCompRefundable: rest['TransFeeCompRefundable'],
      TransDispFeeRecpt: rest['TransDispFeeRecpt'],
      TransFeeCompEditable: rest['TransFeeCompEditable'],
      TransFeeConcEditable: rest['TransFeeConcEditable'],
      OrderId: orderId,
      IsActive: isActive,
      TransFeeMonthId: feeMonthIds[0] ?? null,
      TransFeeMonthIds: feeMonthIdsValue
    };
    const saveRequest = this.editingId
      ? this.transFeePlanService.updateTransFeePlan(request)
      : this.transFeePlanService.createTransFeePlan(request);

    saveRequest.subscribe({
      next: () => {
        this.messageService.show(this.editingId ? 'Fee plan updated' : 'Fee plan created', 'success');
        this.cancelModel();
        this.transFeePlanService.fetchTransFeePlanList();
      },
      error: (error) => {
        console.error('Failed to save fee plan:', error);
        this.messageService.show('Failed to save fee plan', 'error');
      }
    });
  }

  onDelete(row: Record<string, unknown>): void {
    const id = this.resolveId(row);
    if (!id) {
    this.messageService.show('Fee plan id is missing', 'error');
    return;
    }

    const branchId = this.parseNumberOrNull(row['branchId'] ?? row['BranchId']);
    const feeGroupId = this.parseNumberOrNull(row['transFeeGroupId'] ?? row['TransFeeGroupId']);
    const transFeeCompId = this.parseNumberOrNull(row['transFeeCompId'] ?? row['TransFeeCompId']);
    const fees = this.parseNumberOrNull(row['transFees'] ?? row['TransFees']);
    const orderId = this.parseNumberOrNull(row['orderId'] ?? row['OrderId']);
    const feeMonthIdsValue = String(row['transFeeMonthIds'] ?? row['TransFeeMonthIds'] ?? '');
    const payload: Record<string, unknown> = {
    Id: id,
    TransFY: String(row['fy'] ?? row['TransFY'] ?? ''),
    BranchId: branchId,
    TransFeeGroupId: feeGroupId,
    TransFeeCompId: transFeeCompId,
    TransFees: fees,
    TransFeeCompTaken: String(row['transFeeCompTaken'] ?? row['TransFeeCompTaken'] ?? 'No'),
    TransFeeCompOpt: String(row['transFeeCompOpt'] ?? row['TransFeeCompOpt'] ?? 'No'),
    TransFeeCompRefundable: String(row['transFeeCompRefundable'] ?? row['TransFeeCompRefundable'] ?? 'No'),
    TransDispFeeRecpt: String(row['transDispFeeRecpt'] ?? row['TransDispFeeRecpt'] ?? 'No'),
    TransFeeCompEditable: String(row['transFeeCompEditable'] ?? row['TransFeeCompEditable'] ?? 'No'),
    TransFeeConcEditable: String(row['transFeeConcEditable'] ?? row['TransFeeConcEditable'] ?? 'No'),
    OrderId: orderId,
    IsActive: false,
    TransFeeMonthId: this.parseNumberOrNull(row['feeMonthId'] ?? row['TransFeeMonthId']),
    TransFeeMonthIds: feeMonthIdsValue
    };

    this.transFeePlanService.updateTransFeePlan(payload).subscribe({
    next: () => {
      this.messageService.show('Fee plan deleted', 'success');
      this.transFeePlanService.fetchTransFeePlanList();
    },
    error: (error) => {
      console.error('Failed to delete fee plan:', error);
      this.messageService.show('Failed to delete fee plan', 'error');
    }
    });
  }

  cancelModel(): void {
    this.editingId = null;
    this.activeRow = null;
    this.transFeePlanService.transFeePlan.set(null);
    this.state.closeView();
  }

  onEdit(row: any): void {
    const id = this.resolveId(row);
    if (!id) {
      this.messageService.show('Fee plan id is missing', 'error');
      return;
    }

    this.transFeePlanService.fetchTransFeePlanGet(id);
  }
}
