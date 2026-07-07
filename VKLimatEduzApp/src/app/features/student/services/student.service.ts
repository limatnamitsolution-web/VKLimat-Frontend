import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudentApiEndpoints } from './student-api.endpoints';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private http = inject(HttpClient);

  getAdmissions(): Observable<any[]> {
    return this.http.get<any[]>(StudentApiEndpoints.admissions);
  }

  saveStudent(formData: any) {
    return this.http.post(StudentApiEndpoints.saveAdmission, formData);
  }
}
