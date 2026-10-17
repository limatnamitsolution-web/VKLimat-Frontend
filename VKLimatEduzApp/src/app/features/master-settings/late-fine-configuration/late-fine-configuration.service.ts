import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

const base = `${environment.apiUrl}FeeMaster/LateFeeConfig`;

export const LateFineApiEndpoints = {
  getAll: `${base}/GetAll`,
  byId: (id: number) => `${base}/Get/${id}`,
  create: `${base}`,
  update: `${base}`
} as const;

@Injectable({ providedIn: 'root' })
export class LateFineConfigurationService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<unknown> {
    return this.http.get<unknown>(LateFineApiEndpoints.getAll);
  }

  getById(id: number): Observable<unknown> {
    return this.http.get<unknown>(LateFineApiEndpoints.byId(id));
  }

  create(request: Record<string, unknown>): Observable<unknown> {
    return this.http.post<unknown>(LateFineApiEndpoints.create, request);
  }

  update(request: Record<string, unknown>): Observable<unknown> {
    return this.http.put<unknown>(LateFineApiEndpoints.update, request);
  }
}

