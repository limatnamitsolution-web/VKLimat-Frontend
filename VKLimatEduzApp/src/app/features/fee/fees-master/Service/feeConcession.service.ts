import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { FeeConcessionApiEndpoints } from './feeConcession-api.endpoints';

@Injectable({
  providedIn: 'root'
})
export class FeeConcessionService {
  private readonly http = inject(HttpClient);

  readonly feeConcessionList = signal<any[]>([]);
  readonly feeConcession = signal<any | null>(null);

  private unwrapResponse<T>(response: unknown): T | null {
    if (response && typeof response === 'object' && 'data' in response) {
      return (response as { data?: T }).data ?? null;
    }

    return (response ?? null) as T | null;
  }

  fetchFeeConcessionList(): void {
    this.http.get(FeeConcessionApiEndpoints.getAll).subscribe({
      next: response => {
        const list = this.unwrapResponse<any[]>(response);
        this.feeConcessionList.set(Array.isArray(list) ? list : []);
      },
      error: err => {
        console.error('API error for feeConcessionList:', err);
        this.feeConcessionList.set([]);
      }
    });
  }

  fetchFeeConcessionGet(id: number): void {
    this.http.get(FeeConcessionApiEndpoints.byId(id)).subscribe({
      next: response => {
        const item = this.unwrapResponse<any>(response);
        this.feeConcession.set(item);
      },
      error: err => {
        console.error('API error for feeConcession (byId):', err);
        this.feeConcession.set(null);
      }
    });
  }

  createFeeConcession(request: any): Observable<unknown> {
    return this.http.post<unknown>(FeeConcessionApiEndpoints.create, request);
  }

  updateFeeConcession(request: any): Observable<unknown> {
    return this.http.put<unknown>(FeeConcessionApiEndpoints.update, request);
  }
}
