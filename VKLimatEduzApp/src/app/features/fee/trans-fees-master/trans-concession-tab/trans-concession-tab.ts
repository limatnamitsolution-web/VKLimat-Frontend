import { Component, inject, effect, signal } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { createTransFeeGridTabState } from '../fee-grid-tab';
import { TransConcessionView } from '../views/trans-concession-view/trans-concession-view';
import { MenuLabelService } from '../../../../shared/services/menu-label.service';
import { MastersConfig } from '../../../../features/mastersConfig/Services/masters-config';
import { DataGridComponent } from '../../../../features/mastersConfig/Shared/component/data-grid-component/data-grid-component';
import { MasterConfig } from '../../../../features/mastersConfig/models/MasterConfig.model';
import { EncryptionService } from '../../../../shared/services/encryption.service';
import { MessageService } from '../../../../shared/services/message.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-trans-concession-tab',
  imports: [TransConcessionView, DataGridComponent],
  templateUrl: './trans-concession-tab.html',
  styleUrl: './trans-concession-tab.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransConcessionTab {
  private readonly configurationKey = 'TransConcCategory';
  public readonly state = createTransFeeGridTabState<MasterConfig>();
  private readonly menuLabelService = inject(MenuLabelService);
  private readonly mastersConfig = inject(MastersConfig);
  private readonly encryptionService = inject(EncryptionService);
  private readonly messageService = inject(MessageService);
  private readonly fb = inject(FormBuilder);
  editIndex: number | null = null;
  readonly editModel = signal<Record<string, any>>(this.createBlankModel());
  readonly searchTerm = this.state.searchTerm;
  readonly showView = this.state.showView;
  readonly filteredRows = this.state.filteredRows;
  readonly updateSearch = this.state.updateSearch;
  readonly resetSearch = this.state.resetSearch;
  readonly openAddView = this.state.openAddView;
  readonly closeView = this.state.closeView;

  constructor() {
    this.menuLabelService.setLabel({ key: 'Transport Concession Types' });
    effect(() => {
      const list = this.mastersConfig.masterConfigList();
      this.state.rows.set(Array.isArray(list) ? [...list] : []);
    });

    effect(() => {
      const selected = this.mastersConfig.masterConfig();
      if (selected) {    
        const mapped: Record<string, any> = {
          id: selected.id ?? 0,
          branchId: 0,
          code: selected.configKey ?? selected['code'] ?? '',
          description: selected['description'] ?? '',
          name: selected.configValue ?? selected['name'] ?? '',
          sortOrder: selected.sortOrder ?? 0,
          status: selected.isActive ? 'Active' : 'Inactive'
        };
        this.editModel.set(mapped);
        this.openAddView();
        this.mastersConfig.masterConfig.set(null);
      }
    });

    this.menuLabelService.setLabel({ key: 'Transport Concession Types' });
    this.loadConcessionList();
  }

  onModify(item: any) {
    if (!item || !item.id) return;
    this.mastersConfig.fetchMasterConfigGet(item.id);
  }

  onDelete(item: any) {
    if (!item || !item.id) return;
    this.mastersConfig.deleteMasterConfig(item.id).subscribe({ next: () => { this.messageService.show('Concession deleted', 'success'); this.loadConcessionList(); }, error: () => this.messageService.show('Delete failed', 'error') });
  }

  onView(item: any) {
    this.editModel.set({ ...item });
    this.openAddView();
  }

  onSaved(model: Record<string, any>) {
    console.log('onSaved called with model:', model);
    if (!model) return;
    const payload: any = {
      id: model['id'] ?? 0,
      branchId: 0,
      configValue: model['name'] ?? model['configValue'],
      configKey: model['code'] ?? model['configKey'],
      description: String(model['description'] ?? ''),
      configuration: this.configurationKey,
      sortOrder: model['sortOrder'] ?? 0,
      isActive: model['status'] === 'Active'
    };

    if (payload.id && Number(payload.id) > 0) {
      this.mastersConfig.updateMasterConfig(payload).subscribe({ next: () => { this.messageService.show('Concession updated', 'success'); this.loadConcessionList(); }, error: () => this.messageService.show('Update failed', 'error') });
    } else {
      this.mastersConfig.createMasterConfig(payload).subscribe({ next: () => { this.messageService.show('Concession created', 'success'); this.loadConcessionList(); }, error: () => this.messageService.show('Create failed', 'error') });
    }
    this.closeView();
    this.editModel.set(this.createBlankModel());
  }

  openAdd(): void {
    this.mastersConfig.masterConfig.set(null);
    this.editModel.set(this.createBlankModel());
    this.openAddView();
  }

  onClose(): void {
    this.editModel.set(this.createBlankModel());
    this.closeView();
  }

  private loadConcessionList(): void {
    this.mastersConfig.fetchMasterConfig(this.encryptedConfigurationKey());
  }

  private encryptedConfigurationKey(): string {
    return this.encryptionService.encrypt(this.configurationKey);
  }

  private createBlankModel(): Record<string, any> {
    return {
      id: 0,
      branchId: 0,
      code: '',
      name: '',
      description: '',
      sortOrder: 0,
      status: 'Active'
    };
  }
}
