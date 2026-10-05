import { inject, Service, signal } from '@angular/core';
import { AppStateService } from '../../core/services/app-state.service';
import { MastersConfigCommonApiEndpoints } from './MastersConfigCommonApiEndpoints';
import { HttpClient } from '@angular/common/http';
import { EncryptionService } from './encryption.service';

@Service()
export class MasterConfigsDWN {
   appState = inject(AppStateService);
  masterConfigDwnList = signal<any>(null);
  private encryptionService = inject(EncryptionService);
  private http = inject(HttpClient);
   private unwrapResponse<T>(response: any): T | null {
    if (response && typeof response === 'object' && 'data' in response) {
      return response.data as T;
    }
    return (response ?? null) as T | null;
  }
      fetchMasterConfigDWN(configuration: string) {

        const state = this.appState.userState();
        const { branchid } = state;
        const safebranchid = branchid?.toString() ?? '';    
        this.http.post(MastersConfigCommonApiEndpoints.DwnAll, {
          configuration_en: this.encryptionService.encrypt(configuration),
          branchid_en: this.encryptionService.encrypt(safebranchid)
        }).subscribe({
          next: response => {
            const list = this.unwrapResponse<any[]>(response);
            this.masterConfigDwnList.set(Array.isArray(list) ? list : []);
          },
          error: err => {
            console.error('API error for masterConfigList:', err);
            this.masterConfigDwnList.set([]); // fallback to empty array or sensible default
          }
        });
      }

}
