import { inject, Service, signal } from '@angular/core';
import { AppStateService } from '../../core/services/app-state.service';
import { MastersConfigCommonApiEndpoints } from './MastersConfigCommonApiEndpoints';
import { HttpClient } from '@angular/common/http';
import { EncryptionService } from './encryption.service';

export const MASTER_CONFIG_DWN_TYPES: string[] = [
  'Branch',
  'Gender',
  'TransportMode',
  'City',
  'Disability',
  'Games',
  'UserType',
  'BloodGroup',
  'ROUTE',
  'PickDrop',
  'AdmissionCategory',
  'CasteCategory',
  'Caste',
  'Religion',
  'Grade',
  'Community',
  'ExamPerformance',
  'STREAM',
  'Ledger',
  'EmployeeDocs',
  'Semester',
  'Nationality',
  'Loan',
  'Payhead',
  'HOUSE',
  'Relation',
  'Bank',
  'LEAVETYPE',
  'ServiceType',
  'ChqBounceReason',
  'Assignment',
  'Club',
  'Leave',
  'feeGroup',
  'LetterType',
  'MemoType',
  'Location',
  'Qualification',
  'Shift',
  'Identity',
  'Zone',
  'TCReason',
  'Section',
  'AdmissionDocument',
  'ExamClassGroup',
  'BusStop',
  'CurrActivity',
  'UserRole',
  'Country',
  'ClassGroup',
  'Language',
  'Subject',
  'ConcCategory',
  'LivingWith',
  'State',
  'ROLE',
  'Department',
  'Salute',
  'DESIGNATION',
  'Occupation',
  'DisabilityTypes'
] ;

@Service()
export class MasterConfigsDWN {
   appState = inject(AppStateService);
  masterConfigDwnList = signal<any>(null);
  private encryptionService = inject(EncryptionService);
  private http = inject(HttpClient);
   private unwrapResponse<T>(response: any): T | null {
    if (response && typeof response === 'object' && 'data' in response) {
      return response.data as T;
    }
    return (response ?? null) as T | null;
  }
      fetchMasterConfigDWN(configuration: string) {

        const state = this.appState.userState();
        const { academicId } = state;
        const safeAcademicId = academicId?.toString() ?? '';    
        this.http.post(MastersConfigCommonApiEndpoints.DwnAll, {
          configuration_en: this.encryptionService.encrypt(configuration),
          academicId_en: this.encryptionService.encrypt(safeAcademicId)
        }).subscribe({
          next: response => {
            const list = this.unwrapResponse<any[]>(response);
            this.masterConfigDwnList.set(Array.isArray(list) ? list : []);
          },
          error: err => {
            console.error('API error for masterConfigList:', err);
            this.masterConfigDwnList.set([]); // fallback to empty array or sensible default
          }
        });
      }

}
