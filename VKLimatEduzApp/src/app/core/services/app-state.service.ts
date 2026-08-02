import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { IAppContext } from '../models/app-context.model';
import { EncryptionService } from '../../shared/services/encryption.service';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private encryptionService = inject(EncryptionService);
  private platformId = inject(PLATFORM_ID);
  private readonly STORAGE_KEY = 'app_context';
  private skipNextPersist = false;

  private readonly EMPTY_STATE: IAppContext = {
    userId: null,
    userName: null,
    branchid: null,
    academicName: null,
    fyId: null,
    fy: null
  };

  readonly userState = signal<IAppContext>({ ...this.EMPTY_STATE });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const storedState = localStorage.getItem(this.STORAGE_KEY);
      if (storedState) {
        try {
          const decryptedState = this.encryptionService.decrypt(storedState);
          if (decryptedState) {
            this.userState.set(JSON.parse(decryptedState));
          }
        } catch (error) {
          console.error('Error restoring app state:', error);
          localStorage.removeItem(this.STORAGE_KEY);
        }
      }

      effect(() => {
        if (this.skipNextPersist) {
          this.skipNextPersist = false;
          return;
        }

        const state = this.userState();
        const encryptedState = this.encryptionService.encrypt(JSON.stringify(state));
        localStorage.setItem(this.STORAGE_KEY, encryptedState);
      });
    }
  }

  getContextHeaderValue(): string {
    const state = this.userState();
    return JSON.stringify({
      userId: state.userId,
      userName: state.userName,
      branchid: state.branchid,
      academicName: state.academicName,
      fyId: state.fyId,
      fy: state.fy
    });
  }

  setFinancialYear(id: number, name: string) {
    this.userState.update(state => ({ ...state, fyId: id, fy: name }));
  }

  setAcademicYear(id: number, name: string) {
    this.userState.update(state => ({ ...state, branchid: id, academicName: name }));
  }

  setUser(id: number, name: string) {
    this.userState.update(state => ({ ...state, userId: id, userName: name }));
  }

  clearState() {
    this.userState.set({ ...this.EMPTY_STATE });
  }

  clearContextAndStorage() {
    this.skipNextPersist = true;
    this.userState.set({ ...this.EMPTY_STATE });

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }
}
