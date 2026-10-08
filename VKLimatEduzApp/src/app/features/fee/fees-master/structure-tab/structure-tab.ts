import { Component, effect, inject, OnInit, signal } from '@angular/core';

import { ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { createFeeGridTabState } from '../fee-grid-tab';
import { MasterConfigsDWN } from '../../../../shared/services/master-configs-dwn';
import { SearchableDropdownComponent, SearchableDropdownOption } from '../../../../shared/components/searchable-dropdown/searchable-dropdown.component';
import { MenuLabelService } from '../../../../shared/services/menu-label.service';
import { FeePlanService } from '../Service/feePlan.service';
import { MessageService } from '../../../../shared/services/message.service';

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
  private readonly feePlanService = inject(FeePlanService);
  private readonly menuLabelService = inject(MenuLabelService);
  private readonly messageService = inject(MessageService);
  private readonly fb = inject(FormBuilder);
  private readonly masterConfigDwnTypes = ['Branch', 'FeeGroup', 'FeeComponent'];
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
  readonly closeView = this.state.closeView;
  readonly branches = signal<SearchableDropdownOption[]>([]);
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
    IsActive: [true],
    months: this.fb.array(this.monthsList.map(() => false))
  });

  get monthsArray(): FormArray {
    return this.form.get('months') as FormArray;
  }

  constructor() {
    this.menuLabelService.setLabel({ key: 'Fee Plans' });

    effect(() => {
      const dwnList = this.masterConfigsDWN.masterConfigDwnList();
      if (!Array.isArray(dwnList)) {
        return;
      }

      this.bindMasterDropdowns(dwnList);
    });

    effect(() => {
      const list = this.feePlanService.feePlanList();      
      this.rows.set(Array.isArray(list) ? [...list] : []);
      this.state.resetPagination();
      console.log('Updated rows:', this.rows());
    });

    effect(() => {
      const selected = this.feePlanService.feePlan();
      if (!selected) {
        return;
      }

      this.activeRow = selected;
      this.editingId = this.resolveId(selected);
      this.form.patchValue({
        BranchId: this.resolveNumberValue(selected, ['BranchId', 'branchId', 'branch_id']),
        FeeGroupId: this.resolveNumberValue(selected, ['FeeGroupId', 'feeGroupId', 'fee_group_id']),
        FeeCompId: this.resolveNumberValue(selected, ['FeeCompId', 'feeCompId', 'fee_comp_id']),
        Fees: this.resolveNumberValue(selected, ['Fees', 'fees']),
        FeeCompTaken: this.resolveStringValue(selected, ['FeeCompTaken', 'feeCompTaken']) ?? 'No',
        FeeCompOpt: this.resolveStringValue(selected, ['FeeCompOpt', 'feeCompOpt']) ?? 'No',
        FeeCompRefundable: this.resolveStringValue(selected, ['FeeCompRefundable', 'feeCompRefundable']) ?? 'No',
        DispFeeRecpt: this.resolveStringValue(selected, ['DispFeeRecpt', 'dispFeeRecpt']) ?? 'No',
        FeeCompEditable: this.resolveStringValue(selected, ['FeeCompEditable', 'feeCompEditable']) ?? 'No',
        FeeConcEditable: this.resolveStringValue(selected, ['FeeConcEditable', 'feeConcEditable']) ?? 'No',
        OrderId: this.resolveNumberValue(selected, ['OrderId', 'orderId']),
        IsActive: this.resolveIsActive(selected)
      });
      this.patchMonthsFromValue(selected['feeMonthIds'] ?? selected['FeeMonthId'] ?? selected['feeMonthId']);
      this.state.openAddView();
      this.feePlanService.feePlan.set(null);
    });
  }

  ngOnInit(): void {
    this.masterConfigsDWN.fetchMasterConfigDWN(this.masterConfigDwnTypes.toString());
    this.feePlanService.fetchFeePlanList();
  }

  private bindMasterDropdowns(rawMasterItems: Record<string, unknown>[]): void {
    const nextBranches: SearchableDropdownOption[] = [];
    const nextFeeGroups: SearchableDropdownOption[] = [];
    const nextFeeComponents: SearchableDropdownOption[] = [];
    rawMasterItems.forEach((item) => {
      const option = {
        id: item['id'] as number | string,
        name: String(item['name'] ?? ''),
      };
      const type = String(item['type'] ?? '').toLowerCase();

      if (type === 'branch') {
        nextBranches.push(option);
      }

      if (type === 'feegroup') {
        nextFeeGroups.push(option);
      }

      if (type === 'feecomponent') {
        nextFeeComponents.push(option);
      }
    });

    this.branches.set(nextBranches);
    this.feeGroups.set(nextFeeGroups);
    this.feeComponents.set(nextFeeComponents);
  }

  private resolveId(row: Record<string, unknown>): number | null {
    const candidate = row['id'] ?? row['Id'] ?? row['feePlanId'] ?? row['FeePlanId'];
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
    const feeGroupId = this.parseNumberOrNull(rest['FeeGroupId']);
    const feeCompId = this.parseNumberOrNull(rest['FeeCompId']);
    const fees = this.parseNumberOrNull(rest['Fees']);
    const orderId = this.parseNumberOrNull(rest['OrderId']);
    const isActive = Boolean(rest['IsActive']);
    const status = isActive ? 'Active' : 'Inactive';
    const request: Record<string, unknown> = {
      id: this.editingId ?? this.resolveId(this.activeRow ?? {}) ?? undefined,
      Id: this.editingId ?? this.resolveId(this.activeRow ?? {}) ?? undefined,
      FY: '',
      branchId,
      BranchId: branchId,
      feeGroupId,
      FeeGroupId: feeGroupId,
      feeCompId,
      FeeCompId: feeCompId,
      fees,
      Fees: fees,
      FeeCompTaken: rest['FeeCompTaken'],
      FeeCompOpt: rest['FeeCompOpt'],
      FeeCompRefundable: rest['FeeCompRefundable'],
      DispFeeRecpt: rest['DispFeeRecpt'],
      FeeCompEditable: rest['FeeCompEditable'],
      FeeConcEditable: rest['FeeConcEditable'],
      OrderId: orderId,
      isActive,
      IsActive: isActive,
      status,
      Status: status,
      FeeMonthId: feeMonthIds[0] ?? null,
      FeeMonthIds: feeMonthIdsValue
    };
    const saveRequest = this.editingId
      ? this.feePlanService.updateFeePlan(request)
      : this.feePlanService.createFeePlan(request);

    saveRequest.subscribe({
      next: () => {
        this.messageService.show(this.editingId ? 'Fee plan updated' : 'Fee plan created', 'success');
        this.cancelModel();
        this.feePlanService.fetchFeePlanList();
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
    const feeGroupId = this.parseNumberOrNull(row['feeGroupId'] ?? row['FeeGroupId']);
    const feeCompId = this.parseNumberOrNull(row['feeCompId'] ?? row['FeeCompId']);
    const fees = this.parseNumberOrNull(row['fees'] ?? row['Fees']);
    const orderId = this.parseNumberOrNull(row['orderId'] ?? row['OrderId']);
    const feeMonthIdsValue = String(row['feeMonthIds'] ?? row['FeeMonthIds'] ?? '');
    const payload: Record<string, unknown> = {
    id,
    Id: id,
    FY: String(row['fy'] ?? row['FY'] ?? ''),
    branchId,
    BranchId: branchId,
    feeGroupId,
    FeeGroupId: feeGroupId,
    feeCompId,
    FeeCompId: feeCompId,
    fees,
    Fees: fees,
    FeeCompTaken: String(row['feeCompTaken'] ?? row['FeeCompTaken'] ?? 'No'),
    FeeCompOpt: String(row['feeCompOpt'] ?? row['FeeCompOpt'] ?? 'No'),
    FeeCompRefundable: String(row['feeCompRefundable'] ?? row['FeeCompRefundable'] ?? 'No'),
    DispFeeRecpt: String(row['dispFeeRecpt'] ?? row['DispFeeRecpt'] ?? 'No'),
    FeeCompEditable: String(row['feeCompEditable'] ?? row['FeeCompEditable'] ?? 'No'),
    FeeConcEditable: String(row['feeConcEditable'] ?? row['FeeConcEditable'] ?? 'No'),
    OrderId: orderId,
    orderId,
    isActive: false,
    IsActive: false,
    status: 'Inactive',
    Status: 'Inactive',
    FeeMonthId: this.parseNumberOrNull(row['feeMonthId'] ?? row['FeeMonthId']),
    FeeMonthIds: feeMonthIdsValue
    };

    this.feePlanService.updateFeePlan(payload).subscribe({
    next: () => {
      this.messageService.show('Fee plan deleted', 'success');
      this.feePlanService.fetchFeePlanList();
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
    this.feePlanService.feePlan.set(null);
    this.state.closeView();
  }

  onEdit(row: any): void {
    const id = this.resolveId(row);
    if (!id) {
      this.messageService.show('Fee plan id is missing', 'error');
      return;
    }

    this.feePlanService.fetchFeePlanGet(id);
  }
}
