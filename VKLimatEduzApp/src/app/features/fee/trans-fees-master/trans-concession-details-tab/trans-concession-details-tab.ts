import { Component, effect, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

import { createTransFeeGridTabState } from '../fee-grid-tab';
import { MenuLabelService } from '../../../../shared/services/menu-label.service';
import { MessageService } from '../../../../shared/services/message.service';
import { MasterConfigsDWN } from '../../../../shared/services/master-configs-dwn';
import { TransFeeConcessionService } from '../Service/transFeeConcession.service';

type Row = Record<string, unknown>;
type DropdownOption = { id: number | string; name: string };

@Component({
  selector: 'app-trans-concession-details-tab',
  imports: [ReactiveFormsModule],
  templateUrl: './trans-concession-details-tab.html',
  styleUrl: './trans-concession-details-tab.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransConcessionDetailsTab implements OnInit {
  private readonly state = createTransFeeGridTabState<Row>();
  private readonly menuLabelService = inject(MenuLabelService);
  private readonly messageService = inject(MessageService);
  private readonly masterConfigsDWN = inject(MasterConfigsDWN);
  private readonly transFeeConcessionService = inject(TransFeeConcessionService);
  private readonly fb = inject(FormBuilder);
  private readonly masterConfigDwnTypes = ['Branch', 'TransFeeGroup', 'TransFeeComponent'];
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
  readonly transFeeGroups = signal<DropdownOption[]>([]);
  readonly transFeeComponents = signal<DropdownOption[]>([]);

  readonly form: FormGroup = this.fb.group({
    BranchId: [''],
    TransFY: [''],
    TransFeeConcGroupId: [''],
    TransFeeCompId: [''],
    TransFeeConcFxdAmt: [0],
    TransFeeConcPer: [0],
    TransFeeConcEditable: ['No'],
    OrderId: [0],
    IsActive: [true]
  });

  constructor() {
    this.menuLabelService.setLabel({ key: 'Transport Concession Details' });

    effect(() => {
      const dwnList = this.masterConfigsDWN.masterConfigDwnList();
      if (!Array.isArray(dwnList)) {
        return;
      }

      this.bindMasterDropdowns(dwnList);
    });

    effect(() => {
      const list = this.transFeeConcessionService.transFeeConcessionList();
      this.rows.set(Array.isArray(list) ? [...list] : []);
      this.state.resetPagination();
      console.log('Filtered Rows:', this.rows());
    });

    effect(() => {
      const selected = this.transFeeConcessionService.transFeeConcession();
      console.log('Selected Row:', selected);
      if (!selected) {
        return;
      }

      this.activeRow = selected;
      this.editingId = this.resolveId(selected);
      this.patchFormFromRow(selected);
      this.state.openAddView();
      this.transFeeConcessionService.transFeeConcession.set(null);
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
    const candidate = row['id'] ?? row['Id'];
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
    const nextTransFeeGroups: DropdownOption[] = [];
    const nextTransFeeComponents: DropdownOption[] = [];

    rawMasterItems.forEach((item) => {
      const option = {
        id: item['id'] as number | string,
        name: String(item['name'] ?? '')
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

  private patchFormFromRow(row: Row): void {
    this.form.patchValue({
      BranchId: this.resolveDropdownId(row['BranchId'] ?? row['branchId'] ?? row['branch_id']) ?? '',
      TransFY: this.resolveStringValue(row, ['TransFY', 'fy']) ?? '',
      TransFeeConcGroupId: this.resolveDropdownId(row['TransFeeConcGroupId'] ?? row['transFeeConcGroupId'] ?? row['feeConcGroupId'] ?? row['feeGroupId']) ?? '',
      TransFeeCompId: this.resolveDropdownId(row['transFeeCompId'] ?? row['TransFeeCompId']) ?? '',
      TransFeeConcFxdAmt: this.resolveNumberValue(row, ['TransFeeConcFxdAmt', 'transFeeConcFxdAmt', 'feeConcFxdAmt', 'feeConcFixedAmt']),
      TransFeeConcPer: this.resolveNumberValue(row, ['TransFeeConcPer', 'transFeeConcPer', 'feeConcPer']),
      TransFeeConcEditable: this.resolveStringValue(row, ['TransFeeConcEditable', 'transFeeConcEditable', 'feeConcEditable']) ?? 'No',
      OrderId: this.resolveNumberValue(row, ['OrderId', 'orderId']),
      IsActive: this.resolveIsActive(row)
    });
  }

  private buildPayload(): Row {
    const formValue = this.form.getRawValue() as Record<string, unknown>;
    const currentId = this.editingId ?? this.resolveId(this.activeRow ?? {});

    return {
      ...formValue,
      id: currentId ?? undefined,
      BranchId: this.parseNumberOrNull(formValue['BranchId']),
      TransFY: String(formValue['TransFY'] ?? ''),
      TransFeeConcGroupId: this.parseNumberOrNull(formValue['TransFeeConcGroupId']),
      TransFeeCompId: this.parseNumberOrNull(formValue['TransFeeCompId']),
      TransFeeConcFxdAmt: this.parseNumberOrNull(formValue['TransFeeConcFxdAmt']),
      TransFeeConcPer: this.parseNumberOrNull(formValue['TransFeeConcPer']),
      TransFeeConcEditable: String(formValue['TransFeeConcEditable'] ?? 'No'),
      OrderId: this.parseNumberOrNull(formValue['OrderId']),
      IsActive: !!formValue['IsActive']
    };
  }

  private loadConcessionDetails(): void {
    this.transFeeConcessionService.fetchTransFeeConcessionList();
  }

  openAdd(): void {
    this.editingId = null;
    this.activeRow = null;
    this.form.reset({
      BranchId: '',
      TransFY: '',
      TransFeeConcGroupId: '',
      TransFeeCompId: '',
      TransFeeConcFxdAmt: 0,
      TransFeeConcPer: 0,
      TransFeeConcEditable: 'No',
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

    this.transFeeConcessionService.fetchTransFeeConcessionGet(id);
  }

  onDelete(row: Row): void {
    const id = this.resolveId(row);
    if (!id) {
      this.messageService.show('Concession details id is missing', 'error');
      return;
    }

    const payload = {
      ...row,
      id: id,
      IsActive: false
    };

    this.transFeeConcessionService.updateTransFeeConcession(payload).subscribe({
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
    console.log('Payload:', payload);
    const request = isEdit
      ? this.transFeeConcessionService.updateTransFeeConcession(payload)
      : this.transFeeConcessionService.createTransFeeConcession(payload);

    request.subscribe({
      next: () => {
        this.messageService.show(isEdit ? 'Concession details updated' : 'Concession details created', 'success');
        this.editingId = null;
        this.activeRow = null;
        this.form.reset({
          BranchId: '',
          TransFY: '',
          TransFeeConcGroupId: '',
          TransFeeCompId: '',
          TransFeeConcFxdAmt: 0,
          TransFeeConcPer: 0,
          TransFeeConcEditable: 'No',
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
      TransFY: '',
      TransFeeConcGroupId: '',
      TransFeeCompId: '',
      TransFeeConcFxdAmt: 0,
      TransFeeConcPer: 0,
      TransFeeConcEditable: 'No',
      OrderId: 0,
      IsActive: true
    });
    this.state.closeView();
  }
}
