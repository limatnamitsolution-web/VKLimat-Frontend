import { Component, effect, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

import { createFeeGridTabState } from '../fee-grid-tab';
import { MenuLabelService } from '../../../../shared/services/menu-label.service';
import { MessageService } from '../../../../shared/services/message.service';
import { MasterConfigsDWN } from '../../../../shared/services/master-configs-dwn';
import { FeeConcessionService } from '../Service/feeConcession.service';

type Row = Record<string, unknown>;
type DropdownOption = { id: number | string; name: string };

@Component({
  selector: 'app-concession-details-tab',
  imports: [ReactiveFormsModule],
  templateUrl: './concession-details-tab.html',
  styleUrl: './concession-details-tab.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConcessionDetailsTab implements OnInit {
  private readonly state = createFeeGridTabState<Row>();
  private readonly menuLabelService = inject(MenuLabelService);
  private readonly messageService = inject(MessageService);
  private readonly masterConfigsDWN = inject(MasterConfigsDWN);
  private readonly feeConcessionService = inject(FeeConcessionService);
  private readonly fb = inject(FormBuilder);
  private readonly masterConfigDwnTypes = ['Branch', 'FeeGroup', 'FeeComponent'];
  private editingId: number | null = null;
  private activeRow: Row | null = null;

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

  readonly branches = signal<DropdownOption[]>([]);
  readonly feeGroups = signal<DropdownOption[]>([]);
  readonly feeComponents = signal<DropdownOption[]>([]);

  readonly form: FormGroup = this.fb.group({
    BranchId: [''],
    FY: [''],
    FeeConcGroupId: [''],
    FeeCompId: [''],
    FeeConcFxdAmt: [0],
    FeeConcPer: [0],
    FeeConcEditable: ['No'],
    OrderId: [0],
    IsActive: [true]
  });

  constructor() {
    this.menuLabelService.setLabel({ key: 'Concession Details' });

    effect(() => {
      const dwnList = this.masterConfigsDWN.masterConfigDwnList();
      if (!Array.isArray(dwnList)) {
        return;
      }

      this.bindMasterDropdowns(dwnList);
    });

    effect(() => {
      const list = this.feeConcessionService.feeConcessionList();
      this.rows.set(Array.isArray(list) ? [...list] : []);
      this.state.resetPagination();
      console.log('Filtered Rows:', this.rows());
    });

    effect(() => {
      const selected = this.feeConcessionService.feeConcession();
      if (!selected) {
        return;
      }

      this.activeRow = selected;
      this.editingId = this.resolveId(selected);
      this.patchFormFromRow(selected);
      this.state.openAddView();
      this.feeConcessionService.feeConcession.set(null);
    });
  }

  ngOnInit(): void {
    this.masterConfigsDWN.fetchMasterConfigDWN(this.masterConfigDwnTypes.toString());
    this.loadConcessionDetails();
  }

  private unwrapObject(response: unknown): Row | null {
    if (response && typeof response === 'object' && !Array.isArray(response)) {
      if ('data' in response) {
        const data = (response as { data?: unknown }).data;
        return data && typeof data === 'object' && !Array.isArray(data) ? data as Row : null;
      }

      return response as Row;
    }

    return null;
  }

  private unwrapRows(response: unknown): Row[] {
    if (Array.isArray(response)) {
      return response as Row[];
    }

    if (response && typeof response === 'object' && 'data' in response) {
      const data = (response as { data?: unknown }).data;
      return Array.isArray(data) ? data as Row[] : [];
    }

    return [];
  }

  private resolveId(row: Row): number | null {
    const candidate = row['id'] ?? row['Id'] ?? row['feeConcessionId'] ?? row['FeeConcessionId'];
    const numeric = typeof candidate === 'string' ? Number(candidate) : candidate;
    return typeof numeric === 'number' && Number.isFinite(numeric) && numeric > 0 ? numeric : null;
  }

  private resolveStringValue(row: Row, keys: string[]): string | null {
    for (const key of keys) {
      const value = row[key];
      if (value !== undefined && value !== null && value !== '') {
        return String(value);
      }
    }

    return null;
  }

  private resolveNumberValue(row: Row, keys: string[]): number {
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

  private resolveDropdownId(value: unknown): number | string | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    if (typeof value === 'number' || typeof value === 'string') {
      const numericValue = typeof value === 'string' ? Number(value) : value;
      return typeof numericValue === 'number' && Number.isFinite(numericValue) ? numericValue : String(value);
    }

    return null;
  }

  private resolveIsActive(row: Row): boolean {
    const value = row['IsActive'] ?? row['isActive'];
    if (typeof value === 'boolean') {
      return value;
    }

    const status = this.resolveStringValue(row, ['status', 'Status']);
    if (status) {
      return status.toLowerCase() === 'active';
    }

    return true;
  }

  resolveStatusText(row: Row): string {
    return this.resolveIsActive(row) ? 'Active' : 'Inactive';
  }

  resolveValue(row: Row, keys: string[]): string {
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

  private bindMasterDropdowns(rawMasterItems: Row[]): void {
    const nextBranches: DropdownOption[] = [];
    const nextFeeGroups: DropdownOption[] = [];
    const nextFeeComponents: DropdownOption[] = [];

    rawMasterItems.forEach((item) => {
      const option = {
        id: item['id'] as number | string,
        name: String(item['name'] ?? '')
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

  private patchFormFromRow(row: Row): void {
    this.form.patchValue({
      BranchId: this.resolveDropdownId(row['BranchId'] ?? row['branchId'] ?? row['branch_id']) ?? '',
      FY: this.resolveStringValue(row, ['FY', 'fy']) ?? '',
      FeeConcGroupId: this.resolveDropdownId(row['FeeConcGroupId'] ?? row['feeConcGroupId'] ?? row['feeGroupId']) ?? '',
      FeeCompId: this.resolveDropdownId(row['FeeCompId'] ?? row['feeCompId']) ?? '',
      FeeConcFxdAmt: this.resolveNumberValue(row, ['FeeConcFxdAmt', 'feeConcFxdAmt', 'feeConcFixedAmt']),
      FeeConcPer: this.resolveNumberValue(row, ['FeeConcPer', 'feeConcPer']),
      FeeConcEditable: this.resolveStringValue(row, ['FeeConcEditable', 'feeConcEditable']) ?? 'No',
      OrderId: this.resolveNumberValue(row, ['OrderId', 'orderId']),
      IsActive: this.resolveIsActive(row)
    });
  }

  private buildPayload(): Row {
    const formValue = this.form.getRawValue() as Record<string, unknown>;
    const currentId = this.editingId ?? this.resolveId(this.activeRow ?? {});

    return {
      ...(this.activeRow ?? {}),
      ...formValue,
      id: currentId ?? undefined,
      Id: currentId ?? undefined,
      BranchId: this.parseNumberOrNull(formValue['BranchId']),
      FY: String(formValue['FY'] ?? ''),
      FeeConcGroupId: this.parseNumberOrNull(formValue['FeeConcGroupId']),
      FeeCompId: this.parseNumberOrNull(formValue['FeeCompId']),
      FeeConcFxdAmt: this.parseNumberOrNull(formValue['FeeConcFxdAmt']),
      FeeConcPer: this.parseNumberOrNull(formValue['FeeConcPer']),
      FeeConcEditable: String(formValue['FeeConcEditable'] ?? 'No'),
      OrderId: this.parseNumberOrNull(formValue['OrderId']),
      IsActive: !!formValue['IsActive']
    };
  }

  private loadConcessionDetails(): void {
    this.feeConcessionService.fetchFeeConcessionList();
  }

  openAdd(): void {
    this.editingId = null;
    this.activeRow = null;
    this.form.reset({
      BranchId: '',
      FY: '',
      FeeConcGroupId: '',
      FeeCompId: '',
      FeeConcFxdAmt: 0,
      FeeConcPer: 0,
      FeeConcEditable: 'No',
      OrderId: 0,
      IsActive: true
    });
    this.state.openAddView();
  }

  onEdit(row: Row): void {
    const id = this.resolveId(row);
    if (!id) {
      this.messageService.show('Concession details id is missing', 'error');
      return;
    }

    this.feeConcessionService.fetchFeeConcessionGet(id);
  }

  onDelete(row: Row): void {
    const id = this.resolveId(row);
    if (!id) {
      this.messageService.show('Concession details id is missing', 'error');
      return;
    }

    const payload = {
      ...this.buildPayload(),
      ...row,
      id,
      Id: id,
      IsActive: false
    };

    this.feeConcessionService.updateFeeConcession(payload).subscribe({
      next: () => {
        this.messageService.show('Concession details deactivated', 'success');
        this.loadConcessionDetails();
      },
      error: (error) => {
        console.error('Failed to deactivate concession details:', error);
        this.messageService.show('Failed to deactivate concession details', 'error');
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
      ? this.feeConcessionService.updateFeeConcession(payload)
      : this.feeConcessionService.createFeeConcession(payload);

    request.subscribe({
      next: () => {
        this.messageService.show(isEdit ? 'Concession details updated' : 'Concession details created', 'success');
        this.editingId = null;
        this.activeRow = null;
        this.form.reset({
          BranchId: '',
          FY: '',
          FeeConcGroupId: '',
          FeeCompId: '',
          FeeConcFxdAmt: 0,
          FeeConcPer: 0,
          FeeConcEditable: 'No',
          OrderId: 0,
          IsActive: true
        });
        this.state.closeView();
        this.loadConcessionDetails();
      },
      error: (error) => {
        console.error(isEdit ? 'Failed to update concession details:' : 'Failed to create concession details:', error);
        this.messageService.show(isEdit ? 'Failed to update concession details' : 'Failed to create concession details', 'error');
      }
    });
  }

  cancelModel(): void {
    this.editingId = null;
    this.activeRow = null;
    this.form.reset({
      BranchId: '',
      FY: '',
      FeeConcGroupId: '',
      FeeCompId: '',
      FeeConcFxdAmt: 0,
      FeeConcPer: 0,
      FeeConcEditable: 'No',
      OrderId: 0,
      IsActive: true
    });
    this.state.closeView();
  }
}
