import { Component, inject, OnInit } from '@angular/core';

import { ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { createFeeGridTabState } from '../fee-grid-tab';
import { FeeCompService } from '../Service/feeComp.service';
import { MenuLabelService } from '../../../../shared/services/menu-label.service';
import { MessageService } from '../../../../shared/services/message.service';

@Component({
  selector: 'app-feeComp-tab',
  imports: [ReactiveFormsModule],
  templateUrl: './feeComp-tab.html',
  styleUrls: ['./feeComp-tab.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeeCompTab implements OnInit {
  private readonly state = createFeeGridTabState();
  private readonly feeCompService = inject(FeeCompService);
  private readonly menuLabelService = inject(MenuLabelService);
  private readonly messageService = inject(MessageService);
  private readonly fb = inject(FormBuilder);
  readonly searchTerm = this.state.searchTerm;
  readonly showView = this.state.showView;
  readonly filteredRows = this.state.filteredRows;
  readonly rows = this.state.rows;
  readonly updateSearch = this.state.updateSearch;
  readonly resetSearch = this.state.resetSearch;
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
  }

  ngOnInit(): void {
    this.loadFeeComponents();
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
        return String(value);
      }
    }

    return '';
  }

  private loadFeeComponents(): void {
    this.feeCompService.getAllFeeComponent().subscribe({
      next: (response) => {
        this.rows.set(this.unwrapRows(response));
      },
      error: (error) => {
        console.error('Failed to load fee components:', error);
        this.rows.set([]);
        this.messageService.show('Failed to load fee components', 'error');
      }
    });
  }

  openAdd(): void {
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

  saveModel(): void {
    if (this.form.invalid) {
      return;
    }

    const payload = this.form.getRawValue();

    this.feeCompService.createFeeComponent(payload).subscribe({
      next: (response) => {
        this.messageService.show('Fee component created', 'success');
        this.state.closeView();
        this.loadFeeComponents();
      },
      error: (error) => {
        console.error('Failed to create fee component:', error);
        this.messageService.show('Failed to create fee component', 'error');
      }
    });
  }

  cancelModel(): void {
    this.state.closeView();
  }
}
