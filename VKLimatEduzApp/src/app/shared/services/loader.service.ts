import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private _isLoading = new BehaviorSubject<boolean>(false);
  public readonly isLoading = this._isLoading.asObservable();
  private activeRequests = 0;

  show() {
    this.activeRequests += 1;
    if (!this._isLoading.value) {
      this._isLoading.next(true);
    }
  }

  hide() {
    if (this.activeRequests > 0) {
      this.activeRequests -= 1;
    }

    if (this.activeRequests === 0 && this._isLoading.value) {
      this._isLoading.next(false);
    }
  }
}
