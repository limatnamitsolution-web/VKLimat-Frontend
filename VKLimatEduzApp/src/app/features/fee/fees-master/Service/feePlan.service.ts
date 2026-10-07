import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppStateService } from '../../../../core/services/app-state.service';
import { EncryptionService } from '../../../../shared/services/encryption.service';
import { FeePlanApiEndpoints } from './feePlan-api.endpoints';
import { Console } from 'console';

@Injectable({
  providedIn: 'root'
})
export class FeePlanService {
  private readonly http = inject(HttpClient);
  private readonly appState = inject(AppStateService);
  private readonly encryptionService = inject(EncryptionService);

  readonly feePlanList = signal<any[]>([]);
  readonly feePlan = signal<any | null>(null);

  private unwrapResponse<T>(response: unknown): T | null {
    if (response && typeof response === 'object' && 'data' in response) {
      return (response as { data?: T }).data ?? null;
    }

    return (response ?? null) as T | null;
  }

  fetchFeePlanList(): void {
    const state = this.appState.userState();
    const branchId = state.branchid?.toString() ?? '';

    this.http.get(FeePlanApiEndpoints.getAll).subscribe({
      next: response => {
       
        const list = this.unwrapResponse<any[]>(response);
        this.feePlanList.set(Array.isArray(list) ? list : []);
       
      },
      error: err => {
        console.error('API error for feePlanList:', err);
        this.feePlanList.set([]);
      }
    });
  }

  fetchFeePlanGet(id: number): void {
    this.http.get(FeePlanApiEndpoints.byId(id)).subscribe({
      next: response => {
        const item = this.unwrapResponse<any>(response);
        console.log('Fetched feePlan item:', item);
        this.feePlan.set(item);
      },
      error: err => {
        console.error('API error for feePlan (byId):', err);
        this.feePlan.set(null);
      }
    });
  }

  createFeePlan(request: any): Observable<unknown> {
    return this.http.post<unknown>(FeePlanApiEndpoints.create, request);
  }

  updateFeePlan(request: any): Observable<unknown> {
    return this.http.put<unknown>(FeePlanApiEndpoints.update, request);
  }
}
