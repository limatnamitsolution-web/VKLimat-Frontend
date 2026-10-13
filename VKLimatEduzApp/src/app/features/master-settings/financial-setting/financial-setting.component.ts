import { ChangeDetectionStrategy, Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AppStateService } from '../../../core/services/app-state.service';
import { SearchableDropdownComponent, SearchableDropdownOption } from '../../../shared/components/searchable-dropdown/searchable-dropdown.component';
import { MasterConfigsDWN } from '../../../shared/services/master-configs-dwn';
import { MenuLabelService } from '../../../shared/services/menu-label.service';
import { MessageService } from '../../../shared/services/message.service';
import { FinancialConfigService } from './financial-config.service';
import { FinancialConfig } from './financial-config.model';

type TabKey = 'fees' | 'transport';
type ApiRecord = Record<string, unknown>;

const DEFAULT_FEE_TYPES: SearchableDropdownOption[] = [
  { id: 'Monthly', name: 'Monthly' },
  { id: 'BI-Monthly', name: 'BI-Monthly' },
  { id: 'Quarterly', name: 'Quarterly' },
  { id: 'Yearly', name: 'Yearly' }
];

const DEFAULT_TRANSPORT_MODES: SearchableDropdownOption[] = [
  { id: 'School', name: 'School' },
  { id: 'Own', name: 'Own' }
];

const DEFAULT_TRANSPORT_TYPES: SearchableDropdownOption[] = [
  { id: 'Both', name: 'Both' },
  { id: 'Pickup', name: 'Pickup' },
  { id: 'Drop', name: 'Drop' }
];

const DEFAULT_LATE_FEE_TYPES: SearchableDropdownOption[] = [
  { id: 'Fixed', name: 'Fixed' },
  { id: 'PerDay', name: 'PerDay' },
  { id: 'Days', name: 'Days' },
  { id: 'PerMonth', name: 'PerMonth' },
  { id: 'Months', name: 'Months' }
];

const MASTER_CONFIG_TYPES = [
  'Branch',
  'TransportMode',
  'TransportModes',
  'PickDrop',
  'FeeType',
  'TranFeeType',
  'LateFeeType'
];

@Component({
  selector: 'app-financial-setting',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SearchableDropdownComponent],
  templateUrl: './financial-setting.component.html',
  styleUrl: './financial-setting.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinancialSettingComponent implements OnInit {
  readonly Math = Math;
  private readonly fb = inject(FormBuilder);
  private readonly appState = inject(AppStateService);
  private readonly masterConfigsDWN = inject(MasterConfigsDWN);
  private readonly configService = inject(FinancialConfigService);
  private readonly messageService = inject(MessageService);

  readonly branches = signal<SearchableDropdownOption[]>([]);
  readonly feeTypes = signal<SearchableDropdownOption[]>(DEFAULT_FEE_TYPES);
  readonly transportModes = signal<SearchableDropdownOption[]>(DEFAULT_TRANSPORT_MODES);
  readonly transportTypes = signal<SearchableDropdownOption[]>(DEFAULT_TRANSPORT_TYPES);
  readonly transportFeeTypes = signal<SearchableDropdownOption[]>(DEFAULT_FEE_TYPES);
  readonly lateFeeTypes = signal<SearchableDropdownOption[]>(DEFAULT_LATE_FEE_TYPES);
  readonly dueDays: SearchableDropdownOption[] = Array.from({ length: 28 }, (_, index) => ({
    id: index + 1,
    name: String(index + 1)
  }));

  readonly tabs: { key: TabKey; label: string }[] = [
    { key: 'fees', label: 'Fees Configuration' },
    { key: 'transport', label: 'Transport Fees Configuration' }
  ];
  readonly activeTab = signal<TabKey>('fees');
  readonly configs = signal<ApiRecord[]>([]);
  readonly searchTerm = signal('');
  readonly currentPage = signal(1);
  readonly pageSize = signal(10);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly editing = signal(false);
  readonly showModal = signal(false);
  readonly branchId = this.appState.userState().branchid;
  readonly financialYear = this.appState.userState().fy ?? '';
  readonly filteredConfigs = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return this.configs();
    }

    return this.configs().filter(row =>
      [
        this.display(row, ['ID', 'Id', 'id']),
        this.display(row, ['FY', 'fy']),
        this.display(row, ['FeeType', 'feeType']),
        this.display(row, ['TranMode', 'tranMode', 'TransportMode', 'transportMode']),
        this.display(row, ['TranType', 'tranType']),
        this.display(row, ['TranFeeType', 'tranFeeType']),
        this.display(row, ['IsActive', 'isActive'])
      ].some(value => value.toLowerCase().includes(term))
    );
  });
  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredConfigs().length / this.pageSize()))
  );
  readonly paginatedConfigs = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredConfigs().slice(start, start + this.pageSize());
  });

  readonly form = this.fb.group({
    ID: [0 as number | string],
    BranchID: [this.branchId as number | string | null, Validators.required],
    FY: [this.financialYear, Validators.required],
    FeeType: ['', Validators.required],
    ReAdmCharges: [0, [Validators.required, Validators.min(0)]],
    RegxCharges: [0, [Validators.required, Validators.min(0)]],
    CqueBonceFine: [null as number | null, Validators.min(0)],
    IsPaymentOnline: [false, Validators.required],
    LFFeeType: ['Fixed' as string | null],
    SetFeeFst: [null as string | null],
    SetFeeMid: [null as number | null, Validators.min(0)],
    SetFeeLst: [null as string | null],
    LFFeeFrom: [null as number | null],
    LFFeeFixed: [null as number | null, Validators.min(0)],
    LFFeePerDay: [null as number | null, Validators.min(0)],
    LFFeeDays: [null as number | null, Validators.min(0)],
    LFFeePerMonth: [null as number | null, Validators.min(0)],
    LFFeeMonths: [null as number | null, Validators.min(0)],
    TranMode: ['School' as string | null],
    TranType: ['Both' as string | null],
    TranFeeType: [null as string | null],
    TranFxdFullPrc: [null as number | null, Validators.min(0)],
    TransFxdPkpPrc: [null as number | null, Validators.min(0)],
    TransFxdDrpPrc: [null as number | null, Validators.min(0)],
    IsActive: [true, Validators.required]
  });

  constructor() {
    inject(MenuLabelService).setLabel({ key: 'Financial Setting' });

    effect(() => {
      const options = this.masterConfigsDWN.masterConfigDwnList();
      if (!Array.isArray(options)) {
        return;
      }

      this.bindMasterDropdowns(options as Record<string, unknown>[]);
    });
  }

  ngOnInit(): void {
    this.masterConfigsDWN.fetchMasterConfigDWN(MASTER_CONFIG_TYPES.join(','));
    this.loadConfigs();
  }

  private bindMasterDropdowns(rawMasterItems: Record<string, unknown>[]): void {
    const nextBranches: SearchableDropdownOption[] = [];
    const nextFeeTypes: SearchableDropdownOption[] = [];
    const nextTransportModes: SearchableDropdownOption[] = [];
    const nextTransportTypes: SearchableDropdownOption[] = [];
    const nextLateFeeTypes: SearchableDropdownOption[] = [];

    for (const record of rawMasterItems) {
      const type = String(record['type'] ?? '').trim().toLowerCase();
      if (!type) {
        continue;
      }

      const id = (record['id'] ?? record['Id']) as number | string;
      const name = String(record['name'] ?? record['Name'] ?? id);
      const option: SearchableDropdownOption = { id, name };

      switch (type) {
        case 'branch':
          nextBranches.push(option);
          break;
        case 'feetype':
        case 'feefrequency':
          nextFeeTypes.push(option);
          break;
        case 'transportmode':
        case 'transportmodes':
          nextTransportModes.push(option);
          break;
        case 'pickdrop':
        case 'transporttype':
        case 'transporttypes':
          nextTransportTypes.push(option);
          break;
        case 'latefeetype':
          nextLateFeeTypes.push(option);
          break;
        default:
          break;
      }
    }

    if (nextBranches.length > 0) {
      this.branches.set(nextBranches);
    }
    if (nextFeeTypes.length > 0) {
      this.feeTypes.set(nextFeeTypes);
      this.transportFeeTypes.set(nextFeeTypes);
    }
    if (nextTransportModes.length > 0) {
      this.transportModes.set(nextTransportModes);
    }
    if (nextTransportTypes.length > 0) {
      this.transportTypes.set(nextTransportTypes);
    }
    if (nextLateFeeTypes.length > 0) {
      this.lateFeeTypes.set(nextLateFeeTypes);
    }
  }

  selectTab(tab: TabKey): void {
    this.activeTab.set(tab);
  }

  loadConfigs(): void {
    this.loading.set(true);
    this.configService.getAll().subscribe({
      next: response => {
        const rows = this.unwrapRows(response);
        this.configs.set(rows);
        this.currentPage.set(1);
        this.loading.set(false);
      },
      error: error => {
        console.error('Failed to load financial configurations:', error);
        this.messageService.show('Could not load financial configurations.', 'error');
        this.loading.set(false);
      }
    });
  }

  newConfig(): void {
    this.form.reset({
      ID: 0,
      BranchID: this.branchId,
      FY: this.financialYear,
      FeeType: '',
      ReAdmCharges: 0,
      RegxCharges: 0,
      CqueBonceFine: null,
      IsPaymentOnline: false,
      LFFeeType: 'Fixed',
      SetFeeFst: null,
      SetFeeMid: null,
      SetFeeLst: null,
      LFFeeFrom: null,
      LFFeeFixed: null,
      LFFeePerDay: null,
      LFFeeDays: null,
      LFFeePerMonth: null,
      LFFeeMonths: null,
      TranMode: 'School',
      TranType: 'Both',
      TranFeeType: null,
      TranFxdFullPrc: null,
      TransFxdPkpPrc: null,
      TransFxdDrpPrc: null,
      IsActive: true
    });
    this.editing.set(false);
    this.activeTab.set('fees');
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  previousPage(): void {
    this.currentPage.update(page => Math.max(1, page - 1));
  }

  nextPage(): void {
    this.currentPage.update(page => Math.min(this.totalPages(), page + 1));
  }

  changePageSize(value: string): void {
    const size = Number(value);
    if (Number.isInteger(size) && size > 0) {
      this.pageSize.set(size);
      this.currentPage.set(1);
    }
  }

  editConfig(row: ApiRecord): void {
    const id = this.readValue(row, ['ID', 'Id', 'id']);
    if (id === null || id === '') {
      this.messageService.show('This configuration has no ID and cannot be edited.', 'error');
      return;
    }

    this.loading.set(true);
    this.configService.getById(String(id)).subscribe({
      next: response => {
        const config = this.unwrapObject(response);
        if (!config) {
          this.messageService.show('The selected configuration was not returned by the server.', 'error');
          this.loading.set(false);
          return;
        }

        this.patchForm(config);
        this.editing.set(true);
        this.activeTab.set('fees');
        this.showModal.set(true);
        this.loading.set(false);
      },
      error: error => {
        console.error('Failed to load financial configuration:', error);
        this.messageService.show('Could not load the selected financial configuration.', 'error');
        this.loading.set(false);
      }
    });
  }

  onLateFeeTypeChange(): void {
    const type = this.form.controls.LFFeeType.value;
    const activeField: Record<string, string> = {
      Fixed: 'LFFeeFixed',
      PerDay: 'LFFeePerDay',
      Days: 'LFFeeDays',
      PerMonth: 'LFFeePerMonth',
      Months: 'LFFeeMonths'
    };

    for (const field of Object.values(activeField)) {
      if (field !== activeField[type ?? '']) {
        this.form.get(field)?.setValue(null);
      }
    }
  }

  onTransportTypeChange(): void {
    const rawType = (this.form.controls.TranType.value ?? '').toLowerCase();
    if (rawType !== 'both') {
      this.form.controls.TranFxdFullPrc.setValue(null);
    }
    if (rawType !== 'pickup') {
      this.form.controls.TransFxdPkpPrc.setValue(null);
    }
    if (rawType !== 'drop') {
      this.form.controls.TransFxdDrpPrc.setValue(null);
    }
  }

  saveConfig(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.show('Please complete the required fields with valid values.', 'error');
      return;
    }

    const config = this.buildPayload();
    if (config.BranchID === '' || config.FY.trim() === '') {
      this.messageService.show('A current branch and financial year are required.', 'error');
      return;
    }

    this.saving.set(true);
    const request = this.editing() ? this.configService.update(config) : this.configService.save(config);
    request.subscribe({
      next: () => {
        this.messageService.show(
          this.editing() ? 'Financial configuration updated.' : 'Financial configuration saved.',
          'success'
        );
        this.saving.set(false);
        this.loadConfigs();
        this.closeModal();
      },
      error: error => {
        console.error('Failed to save financial configuration:', error);
        this.messageService.show('Could not save the financial configuration.', 'error');
        this.saving.set(false);
      }
    });
  }

  display(row: ApiRecord, keys: string[]): string {
    const value = this.readValue(row, keys);
    if (value === null || value === '') {
      return '-';
    }
    if (typeof value === 'boolean' || value === 0 || value === 1) {
      const isBooleanField = keys.some(key => key.toLowerCase().includes('active'));
      if (isBooleanField) {
        return this.toBoolean(value) ? 'Active' : 'Inactive';
      }
    }
    return String(value);
  }

  private buildPayload(): FinancialConfig {
    const value = this.form.getRawValue();
    const lateFeeType = value.LFFeeType;
    const fieldForType: Record<string, keyof FinancialConfig> = {
      Fixed: 'LFFeeFixed',
      PerDay: 'LFFeePerDay',
      Days: 'LFFeeDays',
      PerMonth: 'LFFeePerMonth',
      Months: 'LFFeeMonths'
    };
    const activeLateFeeField = fieldForType[lateFeeType ?? ''];

    const tranType = value.TranType ?? '';
    const normalizedTranType = tranType.toLowerCase();

    return {
      ID: value.ID ?? 0,
      BranchID: value.BranchID ?? '',
      FY: value.FY ?? '',
      FeeType: value.FeeType ?? '',
      ReAdmCharges: this.toInteger(value.ReAdmCharges) ?? 0,
      RegxCharges: this.toInteger(value.RegxCharges) ?? 0,
      CqueBonceFine: this.toInteger(value.CqueBonceFine),
      IsPaymentOnline: Boolean(value.IsPaymentOnline),
      LFFeeType: lateFeeType,
      SetFeeFst: value.SetFeeFst,
      SetFeeMid: this.toInteger(value.SetFeeMid),
      SetFeeLst: value.SetFeeLst,
      LFFeeFrom: this.toInteger(value.LFFeeFrom),
      LFFeeFixed: activeLateFeeField === 'LFFeeFixed' ? this.toInteger(value.LFFeeFixed) : null,
      LFFeePerDay: activeLateFeeField === 'LFFeePerDay' ? this.toInteger(value.LFFeePerDay) : null,
      LFFeeDays: activeLateFeeField === 'LFFeeDays' ? this.toInteger(value.LFFeeDays) : null,
      LFFeePerMonth: activeLateFeeField === 'LFFeePerMonth' ? this.toInteger(value.LFFeePerMonth) : null,
      LFFeeMonths: activeLateFeeField === 'LFFeeMonths' ? this.toInteger(value.LFFeeMonths) : null,
      TranMode: value.TranMode ?? null,
      TranType: value.TranType ?? null,
      TranFeeType: value.TranFeeType ?? null,
      TranFxdFullPrc: normalizedTranType === 'both' ? this.toInteger(value.TranFxdFullPrc) : null,
      TransFxdPkpPrc: normalizedTranType === 'pickup' ? this.toInteger(value.TransFxdPkpPrc) : null,
      TransFxdDrpPrc: normalizedTranType === 'drop' ? this.toInteger(value.TransFxdDrpPrc) : null,
      IsActive: Boolean(value.IsActive)
    };
  }

  private patchForm(row: ApiRecord): void {
    const id = this.readValue(row, ['ID', 'Id', 'id']);
    const branchId = this.readValue(row, ['BranchID', 'branchID', 'branchId']);
    const rawTranMode = this.readValue(row, ['TranMode', 'tranMode', 'TransportMode', 'transportMode']) as string | null;
    const matchedTranMode = this.transportModes().find(m => String(m.id).toLowerCase() === (rawTranMode ?? '').toLowerCase() || m.name.toLowerCase() === (rawTranMode ?? '').toLowerCase())?.id ?? rawTranMode ?? 'School';
    const rawTranType = this.readValue(row, ['TranType', 'tranType']) as string | null;
    const matchedTranType = this.transportTypes().find(t => String(t.id).toLowerCase() === (rawTranType ?? '').toLowerCase() || t.name.toLowerCase() === (rawTranType ?? '').toLowerCase())?.id ?? rawTranType ?? 'Both';

    this.form.patchValue({
      ID: typeof id === 'number' || typeof id === 'string' ? id : 0,
      BranchID: typeof branchId === 'number' || typeof branchId === 'string' ? branchId : this.branchId,
      FY: String(this.readValue(row, ['FY', 'fy']) ?? this.financialYear),
      FeeType: String(this.readValue(row, ['FeeType', 'feeType']) ?? ''),
      ReAdmCharges: this.toInteger(this.readValue(row, ['ReAdmCharges', 'reAdmCharges'])) ?? 0,
      RegxCharges: this.toInteger(this.readValue(row, ['RegxCharges', 'regxCharges'])) ?? 0,
      CqueBonceFine: this.toInteger(this.readValue(row, ['CqueBonceFine', 'cqueBonceFine'])),
      IsPaymentOnline: this.toBoolean(this.readValue(row, ['IsPaymentOnline', 'isPaymentOnline'])),
      LFFeeType: this.readValue(row, ['LFFeeType', 'lfFeeType']) as string | null ?? 'Fixed',
      SetFeeFst: this.readValue(row, ['SetFeeFst', 'setFeeFst']) as string | null,
      SetFeeMid: this.toInteger(this.readValue(row, ['SetFeeMid', 'setFeeMid'])),
      SetFeeLst: this.readValue(row, ['SetFeeLst', 'setFeeLst']) as string | null,
      LFFeeFrom: this.toInteger(this.readValue(row, ['LFFeeFrom', 'lfFeeFrom'])),
      LFFeeFixed: this.toInteger(this.readValue(row, ['LFFeeFixed', 'lfFeeFixed'])),
      LFFeePerDay: this.toInteger(this.readValue(row, ['LFFeePerDay', 'lfFeePerDay'])),
      LFFeeDays: this.toInteger(this.readValue(row, ['LFFeeDays', 'lfFeeDays'])),
      LFFeePerMonth: this.toInteger(this.readValue(row, ['LFFeePerMonth', 'lfFeePerMonth'])),
      LFFeeMonths: this.toInteger(this.readValue(row, ['LFFeeMonths', 'lfFeeMonths'])),
      TranMode: matchedTranMode != null ? String(matchedTranMode) : 'School',
      TranType: matchedTranType != null ? String(matchedTranType) : 'Both',
      TranFeeType: this.readValue(row, ['TranFeeType', 'tranFeeType']) as string | null,
      TranFxdFullPrc: this.toInteger(this.readValue(row, ['TranFxdFullPrc', 'tranFxdFullPrc'])),
      TransFxdPkpPrc: this.toInteger(this.readValue(row, ['TransFxdPkpPrc', 'transFxdPkpPrc'])),
      TransFxdDrpPrc: this.toInteger(this.readValue(row, ['TransFxdDrpPrc', 'transFxdDrpPrc'])),
      IsActive: this.toBoolean(this.readValue(row, ['IsActive', 'isActive']))
    });
  }

  private unwrapRows(response: unknown): ApiRecord[] {
    let value = response;
    if (value && typeof value === 'object' && 'data' in value) {
      value = (value as { data?: unknown }).data;
    }
    return Array.isArray(value)
      ? value.filter((row): row is ApiRecord => Boolean(row) && typeof row === 'object' && !Array.isArray(row))
      : [];
  }

  private unwrapObject(response: unknown): ApiRecord | null {
    let value = response;
    if (value && typeof value === 'object' && 'data' in value) {
      value = (value as { data?: unknown }).data;
    }
    return value && typeof value === 'object' && !Array.isArray(value) ? value as ApiRecord : null;
  }

  private readValue(row: ApiRecord, keys: string[]): unknown {
    for (const key of keys) {
      if (row[key] !== undefined && row[key] !== null) {
        return row[key];
      }
    }
    return null;
  }

  private toInteger(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const number = typeof value === 'number' ? value : Number(value);
    return Number.isSafeInteger(number) ? number : null;
  }

  private toBoolean(value: unknown): boolean {
    return value === true || value === 1 || value === '1' || String(value).toLowerCase() === 'true';
  }
}
