import { Component, inject, effect } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { createFeeGridTabState } from '../fee-grid-tab';
import { GroupView } from '../views/group-view/group-view';
import { DataGridComponent } from '../../../../features/mastersConfig/Shared/component/data-grid-component/data-grid-component';
import { MastersConfig } from '../../../../features/mastersConfig/Services/masters-config';
import { MasterConfig } from '../../../../features/mastersConfig/models/MasterConfig.model';
import { EncryptionService } from '../../../../shared/services/encryption.service';
import { MessageService } from '../../../../shared/services/message.service';
import { MenuLabelService } from '../../../../shared/services/menu-label.service';

@Component({
  selector: 'app-group-tab',
  imports: [GroupView, DataGridComponent],
  templateUrl: './group-tab.html',
  styleUrl: './group-tab.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupTab {
  public readonly state = createFeeGridTabState<MasterConfig>();
  private readonly mastersConfig = inject(MastersConfig);
  private readonly encryptionService = inject(EncryptionService);
  private readonly messageService = inject(MessageService);
  private readonly menuLabelService = inject(MenuLabelService);
  editModel: Record<string, any> = {};
  readonly searchTerm = this.state.searchTerm;
  readonly showView = this.state.showView;
  readonly filteredRows = this.state.filteredRows;
  readonly updateSearch = this.state.updateSearch;
  readonly resetSearch = this.state.resetSearch;
  readonly openAddView = this.state.openAddView;
  readonly closeView = this.state.closeView;

  constructor() {
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

    // initial load for fee group master config
    // set page context title to Fee Groups so it appears in the page-context-bar
    this.menuLabelService.setLabel({ key: 'Fee Groups' });
    try {
      const enc = this.encryptionService.encrypt('feeGroup');
      this.mastersConfig.fetchMasterConfig(enc);
    } catch (e) {
      // fallback: try raw key if encryption not available
      this.mastersConfig.fetchMasterConfig('feeGroup');
    }
  }

  onSaved(model: Record<string, any>) {
    if (!model) return;
    const payload = { ...model };
    if (payload['id'] && Number(payload['id']) > 0) {
      this.mastersConfig.updateMasterConfig(payload).subscribe({
        next: () => {
          this.messageService.show('Fee group updated', 'success');
          try {
            this.mastersConfig.fetchMasterConfig(this.encryptionService.encrypt('feeGroup'));
          } catch { this.mastersConfig.fetchMasterConfig('feeGroup'); }
        },
        error: () => this.messageService.show('Update failed', 'error')
      });
    } else {
      this.mastersConfig.createMasterConfig(payload).subscribe({
        next: () => {
          this.messageService.show('Fee group created', 'success');
          try {
            this.mastersConfig.fetchMasterConfig(this.encryptionService.encrypt('feeGroup'));
          } catch { this.mastersConfig.fetchMasterConfig('feeGroup'); }
        },
        error: () => this.messageService.show('Create failed', 'error')
      });
    }
    this.closeView();
    this.editModel = {};
  }

  onEdit(row: any) {
    this.editModel = { ...row };
    this.openAddView();
  }
  onModify(item: any) {
    if (!item || !item.id) return;
    this.mastersConfig.fetchMasterConfigGet(item.id);
  }

  onView(item: any) {
    this.editModel = { ...item };
    this.openAddView();
  }

  onDelete(item: any) {
    if (!item || !item.id) return;
    this.mastersConfig.deleteMasterConfig(item.id).subscribe({
      next: () => {
        this.messageService.show('Fee group deleted', 'success');
        try {
          this.mastersConfig.fetchMasterConfig(this.encryptionService.encrypt('feeGroup'));
        } catch { this.mastersConfig.fetchMasterConfig('feeGroup'); }
      },
      error: () => this.messageService.show('Delete failed', 'error')
    });
  }
}

