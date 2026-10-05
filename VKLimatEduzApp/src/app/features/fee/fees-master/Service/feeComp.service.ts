import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FeeCompApiEndpoints } from './feeComp-api.endpoints';

// export interface CommonFeeComponentRequest extends Record<string, unknown> {}

// export interface FeeComponentRequest extends Record<string, unknown> {
//   id?: number;
// }

@Injectable({
  providedIn: 'root'
})
export class FeeCompService {
  private readonly http = inject(HttpClient);

  getAllFeeComponent(): Observable<unknown> {
    return this.http.get<unknown>(FeeCompApiEndpoints.getAll);
  }

  getById(id: number): Observable<unknown> {
    return this.http.get<unknown>(FeeCompApiEndpoints.byId(id));
  }

  createFeeComponent(request: any): Observable<unknown> {
    return this.http.post<unknown>(FeeCompApiEndpoints.create, request);
  }

  updateFeeComponent(request: any): Observable<unknown> {
    return this.http.put<unknown>(FeeCompApiEndpoints.update, request);
  }
}
