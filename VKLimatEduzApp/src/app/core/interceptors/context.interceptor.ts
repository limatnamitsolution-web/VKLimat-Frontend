import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppStateService } from '../services/app-state.service';
import { EncryptionService } from '../../shared/services/encryption.service';

@Injectable()
export class ContextInterceptor implements HttpInterceptor {
  private appState = inject(AppStateService);
  private encryptionService = inject(EncryptionService);
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip adding headers for JSON files (assets)
    if (request.url.endsWith('.json')) {
      return next.handle(request);
    }

    // Attach the full app context as a single structured header
    const contextHeaderValue = (this.appState.getContextHeaderValue());

    // Clone the request and add headers
    // We use a clone because HttpRequests are immutable
    let headers = request.headers;
    headers = headers.set('X-App-Context', contextHeaderValue);

    const modifiedReq = request.clone({  headers });
    return next.handle(modifiedReq);
  }
}
