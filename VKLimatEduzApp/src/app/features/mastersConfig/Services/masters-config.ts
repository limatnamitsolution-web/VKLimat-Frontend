import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AppStateService } from '../../../core/services/app-state.service';
import { EncryptionService } from '../../../shared/services/encryption.service';

@Injectable({
  providedIn: 'root'
})
export class MastersConfig {

  private apiUrl = `${environment.apiUrl}Master/MasterConfig/`;
   appState= inject(AppStateService);
   masterConfigList = signal<any>(null);
  masterConfig = signal<any>(null);
 private encryptionService = inject(EncryptionService);
  constructor(private http: HttpClient) {}

  private unwrapResponse<T>(response: any): T | null {
    if (response && typeof response === 'object' && 'data' in response) {
      return response.data as T;
    }
    return (response ?? null) as T | null;
  }

  fetchMasterConfig(configuration: string) {
    const url = `${this.apiUrl}GetAll`;
    const state = this.appState.userState();
    const { academicId } = state;
    const safeAcademicId = academicId?.toString() ?? '';

    this.http.post(url, {
      configuration_en: configuration,
      academicId_en: this.encryptionService.encrypt(safeAcademicId)
    }).subscribe({
      next: response => {
        const list = this.unwrapResponse<any[]>(response);
        this.masterConfigList.set(Array.isArray(list) ? list : []);
      },
      error: err => {
        console.error('API error for masterConfigList:', err);
        this.masterConfigList.set([]); // fallback to empty array or sensible default
      }
    });
  }

  fetchMasterConfigGet(id: number) {
    const url = `${this.apiUrl}Get/${id}`;
    this.http.get(url).subscribe({
      next: response => {
        const item = this.unwrapResponse<any>(response);
        this.masterConfig.set(item);
      },
      error: err => {
        this.masterConfig.set([]); // fallback to empty array or sensible default
      }
    });
  }

      createMasterConfig(config: any) {
      const url = `${this.apiUrl}`;
      return this.http.post(url, config);
    }

    updateMasterConfig(config: any) {
      const url = `${this.apiUrl}`;
      return this.http.put(url, config);
    }
}
