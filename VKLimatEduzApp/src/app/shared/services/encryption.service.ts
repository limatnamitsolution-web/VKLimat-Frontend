import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private secretKey = environment.secretKey; // 32 characters for AES-256

  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.secretKey).toString();
  }

  decrypt(encrypted: string): string {
    const bytes = CryptoJS.AES.decrypt(encrypted, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
