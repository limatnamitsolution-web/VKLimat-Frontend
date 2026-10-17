import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { createFeeGridTabState } from '../../fee/fees-master/fee-grid-tab';
import { LateFineConfigurationService } from './late-fine-configuration.service';
import { MasterConfigsDWN } from '../../../shared/services/master-configs-dwn';
import { SearchableDropdownComponent, SearchableDropdownOption } from '../../../shared/components/searchable-dropdown/searchable-dropdown.component';
import { MenuLabelService } from '../../../shared/services/menu-label.service';
import { MessageService } from '../../../shared/services/message.service';
import { AppStateService } from '../../../core/services/app-state.service';

@Component({
  selector: 'app-late-fine-configuration',
  imports: [ReactiveFormsModule, SearchableDropdownComponent],
  templateUrl: './late-fine-configuration.component.html',
  styleUrls: ['./late-fine-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LateFineConfigurationComponent implements OnInit {
  private readonly state = createFeeGridTabState();
  private readonly service = inject(LateFineConfigurationService);
  private readonly masterConfigsDWN = inject(MasterConfigsDWN);
  private readonly menuLabelService = inject(MenuLabelService);
  private readonly messageService = inject(MessageService);
  private readonly appState = inject(AppStateService);
  private readonly fb = inject(FormBuilder);
  private readonly masterConfigDwnTypes = ['Branch', 'LateFeeTypes'];

  readonly branches = signal<SearchableDropdownOption[]>([]);
  readonly lateFeeTypes = signal<SearchableDropdownOption[]>([]);
  readonly dropdownOpen = signal(false);
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
  readonly sortBy = this.state.sortBy;
  readonly sortIndicator = this.state.sortIndicator;

  readonly form: FormGroup = this.fb.group({
    BranchID: [''],
    LFFeeGroup: [''],
    LFFeeTypeId: [''],
    LFFeeInterval: [''],
    LFFeeAmount: [''],
    IsActive: [true]
  });

  constructor() {
    this.menuLabelService.setLabel({ key: 'Late Fine Configuration' });

    effect(() => {
      const dwnList = this.masterConfigsDWN.masterConfigDwnList();
      if (!Array.isArray(dwnList)) {
        return;
      }

      this.bindMasterDropdowns(dwnList);
    });
  }

  ngOnInit(): void {
    this.masterConfigsDWN.fetchMasterConfigDWN(this.masterConfigDwnTypes.toString());
    this.load();
  }

  private bindMasterDropdowns(rawMasterItems: Record<string, unknown>[]): void {
    const nextBranches: SearchableDropdownOption[] = [];
    const nextLateFeeTypes: SearchableDropdownOption[] = [];

    rawMasterItems.forEach(item => {
      const option: SearchableDropdownOption = {
        id: item['id'] as number | string,
        name: String(item['name'] ?? '')
      };
      const type = String(item['type'] ?? '').toLowerCase();

      if (type === 'branch') {
        nextBranches.push(option);
      } else if (type === 'latefeetypes') {
        nextLateFeeTypes.push(option);
      }
    });

    this.branches.set(nextBranches);
    this.lateFeeTypes.set(nextLateFeeTypes);
  }

  resolveValue(row: Record<string, unknown>, keys: string[]): string {
    for (const key of keys) {
      const value = row[key];
      if (value !== null && value !== undefined && value !== '') {
        return typeof value === 'boolean' ? (value ? 'Active' : 'Inactive') : String(value);
      }
    }
    return '';
  }

  branchName(row: Record<string, unknown>): string {
    return this.lookup(this.branches(), this.resolveValue(row, ['BranchID', 'branchId']));
  }

  typeName(row: Record<string, unknown>): string {
    return this.lookup(this.lateFeeTypes(), this.resolveValue(row, ['LFFeeTypeId', 'lfFeeTypeId']));
  }

  private lookup(options: SearchableDropdownOption[], id: string): string {
    return String(options.find(o => String(o.id) === id)?.name ?? id);
  }

  private pick(row: Record<string, unknown>, keys: string[]): unknown {
    for (const key of keys) {
      if (row[key] !== null && row[key] !== undefined) {
        return row[key];
      }
    }
    return null;
  }

  private toNumber(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }

  private resolveId(row: Record<string, unknown>): number | null {
    const n = this.toNumber(row['id'] ?? row['Id'] ?? row['ID']);
    return n && n > 0 ? n : null;
  }

  private unwrapRows(response: unknown): Record<string, unknown>[] {
    if (Array.isArray(response)) {
      return response as Record<string, unknown>[];
    }
    const data = (response as { data?: unknown } | null)?.data;
    return Array.isArray(data) ? (data as Record<string, unknown>[]) : [];
  }

  private unwrapObject(response: unknown): Record<string, unknown> | null {
    const value = response && typeof response === 'object' && 'data' in response
      ? (response as { data?: unknown }).data
      : response;
    return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
  }

  private patchForm(row: Record<string, unknown>): void {
    const number = (keys: string[]) => this.toNumber(this.pick(row, keys));
    const text = (keys: string[]) => String(this.pick(row, keys) ?? '');
    const isActive = this.pick(row, ['IsActive', 'isActive']);
    this.form.patchValue({
      BranchID: number(['BranchID', 'branchId', 'BranchId']),
      LFFeeGroup: text(['LFFeeGroup', 'lfFeeGroup']),
      LFFeeTypeId: number(['LFFeeTypeId', 'lfFeeTypeId']),
      LFFeeInterval: text(['LFFeeInterval', 'lfFeeInterval']),
      LFFeeAmount: text(['LFFeeAmount', 'lfFeeAmount']),
      IsActive: isActive === null ? true : !!isActive
    });
  }

  private buildPayload(isActiveOverride?: boolean): Record<string, unknown> {
    const v = this.form.getRawValue();
    const id = this.editingId ?? this.resolveId(this.activeRow ?? {});
    const user = this.appState.userState();
    return {
      ...(id ? { Id: id } : {}),
      BranchId: this.toNumber(v.BranchID) ?? user.branchid,
      FY: String(this.pick(this.activeRow ?? {}, ['FY', 'fy']) ?? user.fy ?? ''),
      LFFeeGroup: v.LFFeeGroup || null,
      LFFeeTypeId: this.toNumber(v.LFFeeTypeId),
      LFFeeInterval: this.toNumber(v.LFFeeInterval),
      LFFeeAmount: this.toNumber(v.LFFeeAmount),
      IsActive: isActiveOverride ?? !!v.IsActive
    };
  }

  private load(): void {
    this.service.getAll().subscribe({
      next: response => {
        this.rows.set(this.unwrapRows(response));
        this.state.resetPagination();
      },
      error: error => {
        console.error('Failed to load late fine configurations:', error);
        this.rows.set([]);
        this.state.resetPagination();
        this.messageService.show('Failed to load late fine configurations', 'error');
      }
    });
  }

  openAdd(): void {
    this.editingId = null;
    this.activeRow = null;
    this.form.reset({
      BranchID: String(this.appState.userState().branchid ?? ''),
      LFFeeGroup: '',
      LFFeeTypeId: '',
      LFFeeInterval: '',
      LFFeeAmount: '',
      IsActive: true
    });
    this.state.openAddView();
  }

  onEdit(row: Record<string, unknown>): void {
    const id = this.resolveId(row);
    if (!id) {
      this.messageService.show('Late fine configuration id is missing', 'error');
      return;
    }
    this.service.getById(id).subscribe({
      next: response => {
        const item = this.unwrapObject(response) ?? row;
        this.editingId = id;
        this.activeRow = item;
        this.patchForm(item);
        this.state.openAddView();
      },
      error: error => {
        console.error('Failed to load late fine configuration:', error);
        this.messageService.show('Failed to load late fine configuration', 'error');
      }
    });
  }

  onDelete(row: Record<string, unknown>): void {
    const id = this.resolveId(row);
    if (!id) {
      this.messageService.show('Late fine configuration id is missing', 'error');
      return;
    }
    this.editingId = id;
    this.activeRow = row;
    this.patchForm(row);
    const payload = this.buildPayload(false);
    this.service.update(payload).subscribe({
      next: () => {
        this.messageService.show('Late fine configuration deactivated', 'success');
        this.load();
      },
      error: error => {
        console.error('Failed to deactivate late fine configuration:', error);
        this.messageService.show('Failed to deactivate late fine configuration', 'error');
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
    const request = isEdit ? this.service.update(payload) : this.service.create(payload);
    request.subscribe({
      next: () => {
        this.messageService.show(isEdit ? 'Late fine configuration updated' : 'Late fine configuration created', 'success');
        this.editingId = null;
        this.activeRow = null;
        this.state.closeView();
        this.load();
      },
      error: error => {
        console.error('Failed to save late fine configuration:', error);
        this.messageService.show('Failed to save late fine configuration', 'error');
      }
    });
  }

  cancelModel(): void {
    this.state.closeView();
  }
}
