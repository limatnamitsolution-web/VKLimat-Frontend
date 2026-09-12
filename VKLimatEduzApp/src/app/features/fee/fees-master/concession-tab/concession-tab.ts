import { Component, inject, effect } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { createFeeGridTabState } from '../fee-grid-tab';
import { ConcessionView } from '../views/concession-view/concession-view';
import { MenuLabelService } from '../../../../shared/services/menu-label.service';
import { MastersConfig } from '../../../../features/mastersConfig/Services/masters-config';
import { DataGridComponent } from '../../../../features/mastersConfig/Shared/component/data-grid-component/data-grid-component';
import { MasterConfig } from '../../../../features/mastersConfig/models/MasterConfig.model';
import { EncryptionService } from '../../../../shared/services/encryption.service';
import { MessageService } from '../../../../shared/services/message.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-concession-tab',
  imports: [ConcessionView, DataGridComponent],
  templateUrl: './concession-tab.html',
  styleUrl: './concession-tab.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConcessionTab {
  public readonly state = createFeeGridTabState<MasterConfig>();
  private readonly menuLabelService = inject(MenuLabelService);
  private readonly mastersConfig = inject(MastersConfig);
  private readonly encryptionService = inject(EncryptionService);
  private readonly messageService = inject(MessageService);
  private readonly fb = inject(FormBuilder);
  editIndex: number | null = null;
  editModel: Record<string, any> = {};
  readonly searchTerm = this.state.searchTerm;
  readonly showView = this.state.showView;
  readonly filteredRows = this.state.filteredRows;
  readonly updateSearch = this.state.updateSearch;
  readonly resetSearch = this.state.resetSearch;
  readonly openAddView = this.state.openAddView;
  readonly closeView = this.state.closeView;

  constructor() {
    this.menuLabelService.setLabel({ key: 'Concession Group' });
    effect(() => {
      const list = this.mastersConfig.masterConfigList();
      this.state.rows.set(Array.isArray(list) ? [...list] : []);
    });

    effect(() => {
      const selected = this.mastersConfig.masterConfig();
      if (selected) {
        this.editModel = { ...selected };
        this.openAddView();
      }
    });

    // initial load for concession master config
    this.menuLabelService.setLabel({ key: 'concCategory' });
    try {
      const enc = this.encryptionService.encrypt('concCategory');
      this.mastersConfig.fetchMasterConfig(enc);
    } catch {
      this.mastersConfig.fetchMasterConfig('concCategory');
    }
  }
  refreshList() {
    try { this.mastersConfig.fetchMasterConfig(this.encryptionService.encrypt('concCategory')); } catch { this.mastersConfig.fetchMasterConfig('concCategory'); }
  }

  onModify(item: any) {
    if (!item || !item.id) return;
    this.mastersConfig.fetchMasterConfigGet(item.id);
  }

  onDelete(item: any) {
    if (!item || !item.id) return;
    this.mastersConfig.deleteMasterConfig(item.id).subscribe({ next: () => { this.messageService.show('Concession deleted', 'success'); this.refreshList(); }, error: () => this.messageService.show('Delete failed', 'error') });
  }

  onView(item: any) {
    this.editModel = { ...item };
    this.openAddView();
  }

  onSaved(model: Record<string, any>) {
    if (!model) return;
    const payload: any = {
      id: model['id'] ?? 0,
      branchId: model['branchId'] ?? 0,
      configValue: model['name'] ?? model['configValue'],
      configKey: model['code'] ?? model['configKey'],
      description: JSON.stringify({ type: model['type'], value: model['value'], maximumAmount: model['maximumAmount'] }),
      configuration: (() => { try { return this.encryptionService.encrypt('concCategory'); } catch { return 'concCategory'; } })(),
      sortOrder: model['sortOrder'] ?? 0,
      isActive: model['status'] === 'Active'
    };

    if (payload.id && Number(payload.id) > 0) {
      this.mastersConfig.updateMasterConfig(payload).subscribe({ next: () => { this.messageService.show('Concession updated', 'success'); this.refreshList(); }, error: () => this.messageService.show('Update failed', 'error') });
    } else {
      this.mastersConfig.createMasterConfig(payload).subscribe({ next: () => { this.messageService.show('Concession created', 'success'); this.refreshList(); }, error: () => this.messageService.show('Create failed', 'error') });
    }
    this.closeView();
    this.editModel = {};
  }
}
