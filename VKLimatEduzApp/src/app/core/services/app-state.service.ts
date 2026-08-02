import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
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
  private hasTriedRestore = false;

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
      this.restoreStateFromStorage();
    }
  }

  getContextHeaderValue(): string | null {
    if (this.isStateEmpty()) {
      this.restoreStateFromStorage();
    }

    const state = this.userState();
    if (this.isStateEmpty(state)) {
      return null;
    }

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
    this.userState.update(state => {
      const nextState = { ...state, fyId: id, fy: name };
      this.persistState(nextState);
      return nextState;
    });
  }

  setAcademicYear(id: number, name: string) {
    this.userState.update(state => {
      const nextState = { ...state, branchid: id, academicName: name };
      this.persistState(nextState);
      return nextState;
    });
  }

  setUser(id: number, name: string) {
    this.userState.update(state => {
      const nextState = { ...state, userId: id, userName: name };
      this.persistState(nextState);
      return nextState;
    });
  }

  clearState() {
    this.userState.set({ ...this.EMPTY_STATE });
    this.removeStoredState();
  }

  clearContextAndStorage() {
    this.userState.set({ ...this.EMPTY_STATE });
    this.removeStoredState();
  }

  private isStateEmpty(state: IAppContext = this.userState()): boolean {
    return Object.values(state).every(value => value === null);
  }

  private restoreStateFromStorage(): void {
    if (!isPlatformBrowser(this.platformId) || this.hasTriedRestore) {
      return;
    }

    this.hasTriedRestore = true;

    const storedState = localStorage.getItem(this.STORAGE_KEY);
    if (!storedState) {
      return;
    }

    try {
      const decryptedState = this.encryptionService.decrypt(storedState);
      if (!decryptedState) {
        this.removeStoredState();
        return;
      }

      this.userState.set(JSON.parse(decryptedState) as IAppContext);
    } catch (error) {
      console.error('Error restoring app state:', error);
      this.removeStoredState();
    }
  }

  private persistState(state: IAppContext): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.isStateEmpty(state)) {
      this.removeStoredState();
      return;
    }

    const encryptedState = this.encryptionService.encrypt(JSON.stringify(state));
    localStorage.setItem(this.STORAGE_KEY, encryptedState);
  }

  private removeStoredState(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }
}
