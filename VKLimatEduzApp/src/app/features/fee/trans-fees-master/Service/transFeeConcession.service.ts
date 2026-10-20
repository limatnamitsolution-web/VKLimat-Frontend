import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TransFeeConcessionApiEndpoints } from './transFeeConcession-api.endpoints';

@Injectable({
  providedIn: 'root'
})
export class TransFeeConcessionService {
  private readonly http = inject(HttpClient);

  readonly transFeeConcessionList = signal<any[]>([]);
  readonly transFeeConcession = signal<any | null>(null);

  private unwrapResponse<T>(response: unknown): T | null {
    if (response && typeof response === 'object' && 'data' in response) {
      return (response as { data?: T }).data ?? null;
    }

    return (response ?? null) as T | null;
  }

  fetchTransFeeConcessionList(): void {
    this.http.get(TransFeeConcessionApiEndpoints.getAll).subscribe({
      next: response => {
        const list = this.unwrapResponse<any[]>(response);
        this.transFeeConcessionList.set(Array.isArray(list) ? list : []);
      },
      error: err => {
        console.error('API error for transFeeConcessionList:', err);
        this.transFeeConcessionList.set([]);
      }
    });
  }

  fetchTransFeeConcessionGet(id: number): void {
    this.http.get(TransFeeConcessionApiEndpoints.byId(id)).subscribe({
      next: response => {
        const item = this.unwrapResponse<any>(response);
        this.transFeeConcession.set(item);
      },
      error: err => {
        console.error('API error for transFeeConcession (byId):', err);
        this.transFeeConcession.set(null);
      }
    });
  }

  createTransFeeConcession(request: any): Observable<unknown> {
    return this.http.post<unknown>(TransFeeConcessionApiEndpoints.create, request);
  }

  updateTransFeeConcession(request: any): Observable<unknown> {
    return this.http.put<unknown>(TransFeeConcessionApiEndpoints.update, request);
  }
}
