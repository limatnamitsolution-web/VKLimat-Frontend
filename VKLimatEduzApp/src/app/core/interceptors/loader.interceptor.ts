import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, catchError } from 'rxjs/operators';
import { LoaderService } from '../../shared/services/loader.service';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private loaderService: LoaderService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //console.log('LoaderInterceptor - showing loader');
    this.loaderService.show();
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Global API error:', error);
        // Optionally, show a global error message or handle error
        return throwError(() => error);
      }),
      finalize(() => {
        this.loaderService.hide();
        //console.log('LoaderInterceptor - hiding loader');
      })
    );
  }
}
