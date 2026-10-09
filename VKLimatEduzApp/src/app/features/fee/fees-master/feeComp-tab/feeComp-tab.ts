import { Component, effect, inject, OnInit, signal } from '@angular/core';

import { ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { createFeeGridTabState } from '../fee-grid-tab';
import { FeeCompService } from '../Service/feeComp.service';
import { MasterConfigsDWN } from '../../../../shared/services/master-configs-dwn';
import { SearchableDropdownComponent, SearchableDropdownOption } from '../../../../shared/components/searchable-dropdown/searchable-dropdown.component';
import { MenuLabelService } from '../../../../shared/services/menu-label.service';
import { MessageService } from '../../../../shared/services/message.service';

@Component({
  selector: 'app-feeComp-tab',
  imports: [ReactiveFormsModule, SearchableDropdownComponent],
  templateUrl: './feeComp-tab.html',
  styleUrls: ['./feeComp-tab.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeeCompTab implements OnInit {
  private readonly state = createFeeGridTabState();
  private readonly feeCompService = inject(FeeCompService);
  private readonly masterConfigsDWN = inject(MasterConfigsDWN);
  private readonly menuLabelService = inject(MenuLabelService);
  private readonly messageService = inject(MessageService);
  private readonly fb = inject(FormBuilder);
  readonly branches = signal<SearchableDropdownOption[]>([]);
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
    OrderId: ['0']
  });

  constructor() {
    this.menuLabelService.setLabel({ key: 'Fee Components' });

    effect(() => {
      const options = this.masterConfigsDWN.masterConfigDwnList();
      if (!Array.isArray(options)) {
        return;
      }

      this.branches.set(
        options
          .filter(option => String(option.type ?? '').toLowerCase() === 'branch')
          .map(option => ({ id: option.id, name: option.name }))
      );
    });
  }

  ngOnInit(): void {
    this.masterConfigsDWN.fetchMasterConfigDWN('Branch');
    this.loadFeeComponents();
  }

  private unwrapObject(response: unknown): Record<string, unknown> | null {
    if (response && typeof response === 'object' && !Array.isArray(response)) {
      if ('data' in response) {
        const data = (response as { data?: unknown }).data;
        return data && typeof data === 'object' && !Array.isArray(data) ? (data as Record<string, unknown>) : null;
      }

      return response as Record<string, unknown>;
    }

    return null;
  }

  private unwrapRows(response: unknown): Record<string, unknown>[] {
    if (Array.isArray(response)) {
      return response as Record<string, unknown>[];
    }

    if (response && typeof response === 'object' && 'data' in response) {
      const data = (response as { data?: unknown }).data;
      return Array.isArray(data) ? (data as Record<string, unknown>[]) : [];
    }

    return [];
  }

  resolveValue(row: Record<string, unknown>, keys: string[]): string {
    for (const key of keys) {
      const value = row[key];
      if (value !== null && value !== undefined && value !== '') {
        if (typeof value === 'boolean') {
          return value ? 'Active' : 'Inactive';
        }

        return String(value);
      }
    }

    return '';
  }

  private resolveId(row: Record<string, unknown>): number | null {
    const candidate = row['id'] ?? row['Id'] ?? row['feeCompId'] ?? row['FeeCompId'];
    const value = typeof candidate === 'string' ? Number(candidate) : candidate;
    return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : null;
  }

  private resolveStatus(row: Record<string, unknown> | null): string {
    if (!row) {
      return 'Active';
    }

    const status = row['status'] ?? row['Status'];
    if (typeof status === 'string' && status.trim()) {
      return status;
    }

    const isActive = row['isActive'] ?? row['IsActive'];
    if (typeof isActive === 'boolean') {
      return isActive ? 'Active' : 'Inactive';
    }

    return 'Active';
  }

  private resolveDropdownId(value: unknown): number | string | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    if (typeof value === 'number' || typeof value === 'string') {
      const numericValue = typeof value === 'string' ? Number(value) : value;
      return typeof numericValue === 'number' && Number.isFinite(numericValue)
        ? numericValue
        : String(value);
    }

    return null;
  }

  private patchFormFromRow(row: Record<string, unknown>): void {
    this.form.patchValue({
      BranchId: this.resolveDropdownId(
        row['BranchId'] ?? row['branchId'] ?? row['branch_id'] ?? row['branchId_en']
      ) ?? '',
      FeeCompCode: String(row['FeeCompCode'] ?? row['feeCompCode'] ?? row['code'] ?? ''),
      FeeComp: String(row['FeeComp'] ?? row['feeComp'] ?? row['name'] ?? ''),
      FeeCompTaken: String(row['FeeCompTaken'] ?? row['feeCompTaken'] ?? 'New'),
      FeeCompOpt: String(row['FeeCompOpt'] ?? row['feeCompOpt'] ?? 'No'),
      FeeCompRefundable: String(row['FeeCompRefundable'] ?? row['feeCompRefundable'] ?? 'No'),
      DispFeeRecpt: String(row['DispFeeRecpt'] ?? row['dispFeeRecpt'] ?? 'No'),
      FeeCompEditable: String(row['FeeCompEditable'] ?? row['feeCompEditable'] ?? 'No'),
      FeeConcEditable: String(row['FeeConcEditable'] ?? row['feeConcEditable'] ?? 'No'),
      OrderId: String(row['OrderId'] ?? row['orderId'] ?? '0')
    });
  }

  private buildPayload(statusOverride?: string): Record<string, unknown> {
    const formValue = this.form.getRawValue() as Record<string, unknown>;
    const currentId = this.editingId ?? this.resolveId(this.activeRow ?? {});
    const currentStatus = statusOverride ?? this.resolveStatus(this.activeRow);

    return {
      ...(this.activeRow ?? {}),
      ...formValue,
      id: currentId ?? undefined,
      Id: currentId ?? undefined,
      status: currentStatus,
      Status: currentStatus,
      isActive: currentStatus === 'Active'
    };
  }

  private loadFeeComponents(): void {
    this.feeCompService.getAllFeeComponent().subscribe({
      next: (response) => {
        this.rows.set(this.unwrapRows(response));
        this.state.resetPagination();
      },
      error: (error) => {
        console.error('Failed to load fee components:', error);
        this.rows.set([]);
        this.state.resetPagination();
        this.messageService.show('Failed to load fee components', 'error');
      }
    });
  }

  openAdd(): void {
    this.editingId = null;
    this.activeRow = null;
    this.form.reset({
      BranchId: '',
      FeeCompCode: '',
      FeeComp: '',
      FeeCompTaken: 'New',
      FeeCompOpt: 'No',
      FeeCompRefundable: 'No',
      DispFeeRecpt: 'No',
      FeeCompEditable: 'No',
      FeeConcEditable: 'No',
      OrderId: '0'
    });
    this.state.openAddView();
  }

  onEdit(row: Record<string, unknown>): void {
    const id = this.resolveId(row);
    if (!id) {
      this.messageService.show('Fee component id is missing', 'error');
      return;
    }

    this.feeCompService.getById(id).subscribe({
      next: (response) => {
        const item = this.unwrapObject(response) ?? row;
        this.editingId = id;
        this.activeRow = item;
        this.patchFormFromRow(item);
        this.state.openAddView();
      },
      error: (error) => {
        console.error('Failed to load fee component for edit:', error);
        this.messageService.show('Failed to load fee component', 'error');
      }
    });
  }

  onDelete(row: Record<string, unknown>): void {
    const id = this.resolveId(row);
    if (!id) {
      this.messageService.show('Fee component id is missing', 'error');
      return;
    }

    const payload = {
      ...row,
      id,
      Id: id,
      status: 'Inactive',
      Status: 'Inactive',
      isActive: false
    };

    this.feeCompService.updateFeeComponent(payload).subscribe({
      next: () => {
        this.messageService.show('Fee component deactivated', 'success');
        this.loadFeeComponents();
      },
      error: (error) => {
        console.error('Failed to deactivate fee component:', error);
        this.messageService.show('Failed to deactivate fee component', 'error');
      }
    });
  }

  saveModel(): void {
    if (this.form.invalid) {
      return;
    }

    const isEdit = this.editingId !== null;
    const payload = this.buildPayload();
    const request = isEdit
      ? this.feeCompService.updateFeeComponent(payload)
      : this.feeCompService.createFeeComponent(payload);

    request.subscribe({
      next: () => {
        this.messageService.show(isEdit ? 'Fee component updated' : 'Fee component created', 'success');
        this.editingId = null;
        this.activeRow = null;
        this.state.closeView();
        this.loadFeeComponents();
      },
      error: (error) => {
        console.error(isEdit ? 'Failed to update fee component:' : 'Failed to create fee component:', error);
        this.messageService.show(isEdit ? 'Failed to update fee component' : 'Failed to create fee component', 'error');
      }
    });
  }

  cancelModel(): void {
    this.state.closeView();
  }
}
