import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppStateService } from '../../../../core/services/app-state.service';
import { EncryptionService } from '../../../../shared/services/encryption.service';
import { TransFeePlanApiEndpoints } from './transFeePlan-api.endpoints';
import { Console } from 'console';

@Injectable({
  providedIn: 'root'
})
export class TransFeePlanService {
  private readonly http = inject(HttpClient);
  private readonly appState = inject(AppStateService);
  private readonly encryptionService = inject(EncryptionService);

  readonly transFeePlanList = signal<any[]>([]);
  readonly transFeePlan = signal<any | null>(null);

  private unwrapResponse<T>(response: unknown): T | null {
    if (response && typeof response === 'object' && 'data' in response) {
      return (response as { data?: T }).data ?? null;
    }

    return (response ?? null) as T | null;
  }

  fetchTransFeePlanList(): void {
    const state = this.appState.userState();
    const branchId = state.branchid?.toString() ?? '';

    this.http.get(TransFeePlanApiEndpoints.getAll).subscribe({
      next: response => {
       
        const list = this.unwrapResponse<any[]>(response);
        this.transFeePlanList.set(Array.isArray(list) ? list : []);
       
      },
      error: err => {
        console.error('API error for transFeePlanList:', err);
        this.transFeePlanList.set([]);
      }
    });
  }

  fetchTransFeePlanGet(id: number): void {
    this.http.get(TransFeePlanApiEndpoints.byId(id)).subscribe({
      next: response => {
        const item = this.unwrapResponse<any>(response);
        console.log('Fetched transFeePlan item:', item);
        this.transFeePlan.set(item);
      },
      error: err => {
        console.error('API error for transFeePlan (byId):', err);
        this.transFeePlan.set(null);
      }
    });
  }

  createTransFeePlan(request: any): Observable<unknown> {
    return this.http.post<unknown>(TransFeePlanApiEndpoints.create, request);
  }

  updateTransFeePlan(request: any): Observable<unknown> {
    return this.http.put<unknown>(TransFeePlanApiEndpoints.update, request);
  }
}
