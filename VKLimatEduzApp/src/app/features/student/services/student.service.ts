import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudentApiEndpoints } from './student-api.endpoints';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private http = inject(HttpClient);
  Admission = signal<any>(null);
  getAdmissions(): Observable<any[]> {
    return this.http.get<any[]>(StudentApiEndpoints.admissions);
  }

  saveStudent(formData: any) {
    return this.http.post(StudentApiEndpoints.saveAdmission, formData);
  }



  studentformview(id: number): void {
    this.http.get<any>(StudentApiEndpoints.admissionById(id)).subscribe({
      next: (response) => {
        this.Admission.set(response);
      },
      error: () => {
        this.Admission.set(null);
      },
    });
  }
  
}
