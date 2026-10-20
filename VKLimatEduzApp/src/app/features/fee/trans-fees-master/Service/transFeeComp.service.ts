import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TransFeeCompApiEndpoints } from './transFeeComp-api.endpoints';

// export interface CommonTransFeeComponentRequest extends Record<string, unknown> {}

// export interface TransFeeComponentRequest extends Record<string, unknown> {
//   id?: number;
// }

@Injectable({
  providedIn: 'root'
})
export class TransFeeCompService {
  private readonly http = inject(HttpClient);

 getAllTransFeeComponent(): Observable<unknown> {
    return this.http.get<unknown>(TransFeeCompApiEndpoints.getAll);
  }

  getById(id: number): Observable<unknown> {
    return this.http.get<unknown>(TransFeeCompApiEndpoints.byId(id));
  }

  createTransFeeComponent(request: any): Observable<unknown> {
    return this.http.post<unknown>(TransFeeCompApiEndpoints.create, request);
  }

  updateTransFeeComponent(request: any): Observable<unknown> {
    return this.http.put<unknown>(TransFeeCompApiEndpoints.update, request);
  }
}
