import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { AppStateService } from '../../../core/services/app-state.service';
import { MasterConfigsDWN } from '../../../shared/services/master-configs-dwn';
import { MenuLabelService } from '../../../shared/services/menu-label.service';
import { MessageService } from '../../../shared/services/message.service';
import { FinancialConfigService } from './financial-config.service';
import { FinancialSettingComponent, RawMasterItem } from './financial-setting.component';

describe('FinancialSettingComponent transport editing', () => {
  const masterItems: RawMasterItem[] = [
    { id: 10, parentId: 0, name: 'School', type: 'TransportModes' },
    { id: 20, parentId: 0, name: 'Both', type: 'TransportTypes' },
    { id: 21, parentId: 0, name: 'Pickup', type: 'TransportTypes' },
    { id: 22, parentId: 0, name: 'Drop', type: 'TransportTypes' },
    { id: 30, parentId: 0, name: 'Monthly', type: 'TransFeeType' }
  ];

  async function openConfig(transport: Record<string, unknown>) {
    const config = {
      id: 1, branchId: 1375, fy: '2026-2027', feeType: 'Bi-Monthly',
      reAdmCharges: 1000, regxCharges: 200, ...transport
    };
    const masterConfigDwnList = signal<RawMasterItem[] | null>(null);
    const updates: unknown[] = [];
    TestBed.configureTestingModule({
      imports: [FinancialSettingComponent],
      providers: [
        { provide: AppStateService, useValue: { userState: () => ({ branchid: 1375, fy: '2026-2027' }) } },
        { provide: MenuLabelService, useValue: { setLabel: () => {} } },
        { provide: MessageService, useValue: { show: () => {} } },
        {
          provide: MasterConfigsDWN,
          useValue: {
            masterConfigDwnList,
            fetchMasterConfigDWN: () => masterConfigDwnList.set(masterItems)
          }
        },
        {
          provide: FinancialConfigService,
          useValue: {
            getAll: () => of([]),
            getById: () => of({ data: config }),
            update: (payload: unknown) => {
              updates.push(payload);
              return of({});
            }
          }
        }
      ]
    });
    const fixture = TestBed.createComponent(FinancialSettingComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.componentInstance.editConfig({ id: 1 });
    fixture.componentInstance.selectTab('transport');
    fixture.detectChanges();
    return { fixture, component: fixture.componentInstance, updates };
  }

  for (const casing of ['camelCase', 'PascalCase']) {
    it(`loads the transport selection and full price from ${casing} API fields`, async () => {
      const transport = casing === 'camelCase'
        ? { transMode: 'School', transType: 'Both', transFeeType: 'Monthly', transFxdFullPrc: 3000 }
        : { TransMode: 'School', TransType: 'Both', TransFeeType: 'Monthly', TransFxdFullPrc: 3000 };
      const { fixture, component, updates } = await openConfig(transport);
      const root: HTMLElement = fixture.nativeElement;
      expect(root.querySelectorAll('[role="tab"]').length).toBe(2);
      expect(root.querySelector<HTMLSelectElement>('[formControlName="TransFeeType"]')?.value).toBe('Monthly');
      expect(root.querySelector<HTMLInputElement>('[formControlName="TransFxdFullPrc"]')?.value).toBe('3000');
      expect(component.form.controls.TransMode.value).toBe('School');
      expect(component.form.controls.TransType.value).toBe('Both');
      component.saveConfig();
      expect(updates[0]).toEqual(expect.objectContaining({
        TransMode: 'School', TransType: 'Both', TransFeeType: 'Monthly', TransFxdFullPrc: 3000
      }));
    });
  }

  it('resolves backend option IDs to the names used by the transport selects', async () => {
    const { component } = await openConfig({
      transMode: 10, transType: 20, transFeeType: 30, transFxdFullPrc: 3000
    });
    expect(component.form.controls.TransMode.value).toBe('School');
    expect(component.form.controls.TransType.value).toBe('Both');
    expect(component.form.controls.TransFeeType.value).toBe('Monthly');
  });

  for (const [type, field] of [['Pickup', 'TransFxdPkpPrc'], ['Drop', 'TransFxdDrpPrc']]) {
    it(`loads the conditional ${type} price`, async () => {
      const { fixture } = await openConfig({
        transType: type, transFxdPkpPrc: 1000, transFxdDrpPrc: 1000
      });
      const root: HTMLElement = fixture.nativeElement;
      expect(root.querySelector<HTMLInputElement>(`[formControlName="${field}"]`)?.value).toBe('1000');
      expect(root.querySelector('[formControlName="TransFxdFullPrc"]')).toBeNull();
    });
  }
});
