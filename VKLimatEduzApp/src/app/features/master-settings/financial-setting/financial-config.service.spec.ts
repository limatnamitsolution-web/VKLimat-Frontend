import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { FinancialConfigService } from './financial-config.service';
import { FinancialSettingComponent } from './financial-setting.component';
import { AppStateService } from '../../../core/services/app-state.service';
import { MasterConfigsDWN } from '../../../shared/services/master-configs-dwn';
import { MenuLabelService } from '../../../shared/services/menu-label.service';
import { MessageService } from '../../../shared/services/message.service';
import { signal } from '@angular/core';

describe('FinancialConfigService late fee days', () => {
  for (const method of ['save', 'update'] as const) {
    it(`sends LFFeeDay on ${method}`, () => {
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          { provide: AppStateService, useValue: { userState: () => ({ branchid: 1375, fy: '2026-2027' }) } },
          { provide: MasterConfigsDWN, useValue: { masterConfigDwnList: signal(null) } },
          { provide: MenuLabelService, useValue: { setLabel: () => {} } },
          { provide: MessageService, useValue: { show: () => {} } }
        ]
      });
      const http = TestBed.inject(HttpTestingController);
      const component = TestBed.runInInjectionContext(() => new FinancialSettingComponent());
      component.newConfig();
      component.form.patchValue({ FeeType: 'Monthly', LFFeeType: 'Days', LFFeeDays: 25 });
      if (method === 'update') {
        component.editConfig({ id: 1 });
        http.expectOne(req => req.method === 'GET').flush({
          id: 1, branchId: 1375, fy: '2026-2027', feeType: 'Monthly',
          lfFeeType: 'Days', lfFeeDay: 25
        });
        expect(component.form.controls.LFFeeDays.value).toBe(25);
      }
      component.saveConfig();
      const request = http.expectOne(req => req.method === (method === 'save' ? 'POST' : 'PUT'));
      expect(request.request.body.LFFeeDay).toBe(25);
      expect(request.request.body.LFFeeDays).toBeUndefined();
      request.flush({});
      http.expectOne(req => req.method === 'GET').flush([]);
      http.verify();
    });
  }
});
