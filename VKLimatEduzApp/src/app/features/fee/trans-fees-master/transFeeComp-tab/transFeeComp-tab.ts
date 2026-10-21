import { Component, effect, inject, OnInit, signal } from '@angular/core';

import { ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { createTransFeeGridTabState } from '../fee-grid-tab';
import { TransFeeCompService } from '../Service/transFeeComp.service';
import { MasterConfigsDWN } from '../../../../shared/services/master-configs-dwn';
import { SearchableDropdownComponent, SearchableDropdownOption } from '../../../../shared/components/searchable-dropdown/searchable-dropdown.component';
import { MenuLabelService } from '../../../../shared/services/menu-label.service';
import { MessageService } from '../../../../shared/services/message.service';

@Component({
  selector: 'app-transFeeComp-tab',
  imports: [ReactiveFormsModule, SearchableDropdownComponent],
  templateUrl: './transFeeComp-tab.html',
  styleUrls: ['./transFeeComp-tab.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransFeeCompTab implements OnInit {
  private readonly state = createTransFeeGridTabState();
  private readonly transFeeCompService = inject(TransFeeCompService);
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
    TransFeeCompCode: [''],
    TransFeeComp: [''],
    TransFeeCompTaken: ['No'],
    TransFeeCompOpt: ['No'],
    TransFeeCompRefundable: ['No'],
    TransDispFeeRecpt: ['No'],
    TransFeeCompEditable: ['No'],
    TransFeeConcEditable: ['No'],
    OrderId: ['0']
  });

  constructor() {
    this.menuLabelService.setLabel({ key: 'Transport Fee Components' });

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
    this.loadTransFeeComponents();
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
    const candidate = row['id'] ?? row['Id'] ?? row['transFeeCompId'] ?? row['TransFeeCompId'];
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
      TransFeeCompCode: String(row['TransFeeCompCode'] ?? row['transFeeCompCode'] ?? row['code'] ?? ''),
      TransFeeComp: String(row['TransFeeComp'] ?? row['transFeeComp'] ?? row['name'] ?? ''),
      TransFeeCompTaken: String(row['TransFeeCompTaken'] ?? row['transFeeCompTaken'] ?? 'New'),
      TransFeeCompOpt: String(row['TransFeeCompOpt'] ?? row['transFeeCompOpt'] ?? 'No'),
      TransFeeCompRefundable: String(row['TransFeeCompRefundable'] ?? row['transFeeCompRefundable'] ?? 'No'),
      TransDispFeeRecpt: String(row['TransDispFeeRecpt'] ?? row['dispFeeRecpt'] ?? 'No'),
      TransFeeCompEditable: String(row['TransFeeCompEditable'] ?? row['transFeeCompEditable'] ?? 'No'),
      TransFeeConcEditable: String(row['TransFeeConcEditable'] ?? row['feeConcEditable'] ?? 'No'),
      OrderId: String(row['OrderId'] ?? row['orderId'] ?? '0')
    });
  }

  private buildPayload(statusOverride?: string): Record<string, unknown> {
    const formValue = this.form.getRawValue() as Record<string, unknown>;
    const currentId = this.editingId ?? this.resolveId(this.activeRow ?? {});
    const currentStatus = statusOverride ?? this.resolveStatus(this.activeRow);

    return {
      ...formValue,
      id: currentId ?? undefined,
      IsActive: currentStatus === 'Active'
    };
  }

  private loadTransFeeComponents(): void {
    this.transFeeCompService.getAllTransFeeComponent().subscribe({
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
      TransFeeCompCode: '',
      TransFeeComp: '',
      TransFeeCompTaken: 'New',
      TransFeeCompOpt: 'No',
      TransFeeCompRefundable: 'No',
      TransDispFeeRecpt: 'No',
      TransFeeCompEditable: 'No',
      TransFeeConcEditable: 'No',
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

    this.transFeeCompService.getById(id).subscribe({
      next: (response) => {
        const item = this.unwrapObject(response) ?? row;
        this.editingId = id;
        this.activeRow = item;
        this.patchFormFromRow(item);
        console.log('Editing row id:', this.editingId);
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
      TransFeeCompId: id,
      IsActive: false
    };

    this.transFeeCompService.updateTransFeeComponent(payload).subscribe({
      next: () => {
        this.messageService.show('Fee component deactivated', 'success');
        this.loadTransFeeComponents();
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
    console.log('payload', payload);
    const request = isEdit
      ? this.transFeeCompService.updateTransFeeComponent(payload)
      : this.transFeeCompService.createTransFeeComponent(payload);

    request.subscribe({
      next: () => {
        this.messageService.show(isEdit ? 'Fee component updated' : 'Fee component created', 'success');
        this.editingId = null;
        this.activeRow = null;
        this.state.closeView();
        this.loadTransFeeComponents();
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
