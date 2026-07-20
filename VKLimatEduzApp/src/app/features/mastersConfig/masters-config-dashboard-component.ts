import { Component, OnInit, inject, effect, signal, Inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterConfig } from './models/MasterConfig.model';
import { MastersConfig } from './Services/masters-config';
import { ActivatedRoute } from '@angular/router';
import { DataGridComponent } from './Shared/component/data-grid-component/data-grid-component';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { MenuLabelService } from '../../shared/services/menu-label.service';
import { EncryptionService } from '../../shared/services/encryption.service';
import { MasterConfigsDWN } from '../../shared/services/master-configs-dwn';


@Component({
  selector: 'app-masters-config-dashboard-component',
  imports: [CommonModule, DataGridComponent, ReactiveFormsModule,FormsModule],
  templateUrl: './masters-config-dashboard-component.html',
  styleUrl: './masters-config-dashboard-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MastersConfigDashboardComponent implements OnInit {
  private mastersConfig = inject(MastersConfig);
  private route = inject(ActivatedRoute);
  gridData = signal<MasterConfig[]>([]);
  filteredGridData = signal<MasterConfig[]>([]);
  gridTitle: string = 'Master Configuration';
  form: FormGroup;
  private fb = inject(FormBuilder);
  editIndex: number | null = null;
  keyParam: string = '';
  private encryptionService = inject(EncryptionService);
  // Single search property for all fields
  searchTerm: string = '';
  constructor() {
    this.form = this.fb.group({
      id:0,
      configValue: ['', Validators.required],
      configKey: ['', Validators.required],
      description: ['', Validators.required],
      configuration: ['', Validators.required]
    });
    effect(() => {
      const data = this.mastersConfig.masterConfigList();
      if (data && Array.isArray(data)) {
        this.gridData.set([...data]); // force new reference for change detection
        this.applyFilters();
      }
    });
    effect(() => {
      const result = this.mastersConfig.masterConfig();
      if (result) {
        this.form.setValue({
          id: result.id,
          configValue: result.configValue,
          configKey: result.configKey,
          description: result.description,
          configuration: result.configuration
        });
      }
    });
  }

  // Filtering logic for search
  applyFilters(): void {
    const term = this.searchTerm.toLowerCase();
    const allData = this.gridData();
    this.filteredGridData.set(
      allData.filter((item: MasterConfig) =>
        (item.configValue || '').toLowerCase().includes(term) ||
        (item.configKey || '').toLowerCase().includes(term) ||
        (item.description || '').toLowerCase().includes(term) ||
        (item.configuration || '').toLowerCase().includes(term)
      )
    );
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  addGridItem() {
    console.log('Adding/Updating grid item');
    console.log('Form Values:', this.form.value);
    console.log('Form Validity:', this.form.valid);
  //   Object.keys(this.form.controls).forEach(key => {
  //   const control = this.form.get(key);
  //   if (control && control.invalid) {
  //     console.log(`Control "${key}" is invalid. Errors:`, control.errors);
  //   }
  // });
    if (this.form.invalid) return;
    const config = this.form.value;
    if(this.editIndex === null) {
    this.mastersConfig.createMasterConfig(config).subscribe({
      next: (res) => {
        // Optionally refresh grid data or show success
        this.mastersConfig.fetchMasterConfig( this.keyParam);
        
      },
      error: (err) => {
        // Optionally show error
        console.error('Create failed', err);
      }
    });
  } else {
    this.mastersConfig.updateMasterConfig(config).subscribe({
      next: (res) => {
        // Optionally refresh grid data or show success
        this.mastersConfig.fetchMasterConfig( this.keyParam);
        
      },
      error: (err) => {
        // Optionally show error
        console.error('Create failed', err);
      }
    });
  }
    this.resetForm();
}

    resetForm() {
      this.form.reset();
          let key =   this.encryptionService.decrypt( this.keyParam);
      this.form.patchValue({ id: 0 , configValue: '', configKey: '', description: '', configuration: key });
      this.editIndex = null;
      
    }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.keyParam = params.get('key') || 'ClassGroup';
      let key = this.encryptionService.decrypt(this.keyParam);      
      this.form.patchValue({ configuration: key });
      this.mastersConfig.fetchMasterConfig( this.keyParam);
      this.applyFilters();
    });
  }

  onModify(item: MasterConfig) {
    if (item.id) {      
        this.editIndex = item.id;
        this.mastersConfig.fetchMasterConfigGet(item.id);      
    }
  }

  onDelete(item: MasterConfig) {
    this.gridData.set(this.gridData().filter(i => i.id !== item.id));
    this.applyFilters();
  }


}
