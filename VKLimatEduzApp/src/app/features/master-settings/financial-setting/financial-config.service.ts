import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { FinancialConfig } from './financial-config.model';
import { FinancialConfigApiEndpoints } from './financial-config-api.endpoints';

@Injectable({ providedIn: 'root' })
export class FinancialConfigService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<unknown> {
    return this.http.get<unknown>(FinancialConfigApiEndpoints.list);
  }

  getById(id: number | string): Observable<unknown> {
    return this.http.get<unknown>(FinancialConfigApiEndpoints.byId(id));
  }

  save(config: FinancialConfig): Observable<unknown> {
    return this.http.post<unknown>(FinancialConfigApiEndpoints.save, config);
  }

  update(config: FinancialConfig): Observable<unknown> {
    return this.http.put<unknown>(FinancialConfigApiEndpoints.update, config);
  }
}
