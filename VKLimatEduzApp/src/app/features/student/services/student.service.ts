import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private http = inject(HttpClient);
  // Assuming you have an apiUrl in your environment, otherwise using a placeholder
  private apiUrl = `${environment.apiUrl}Student/Admission/`;

  getAdmissions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/student/admissions`);
  }

  saveStudent(formData: any) {
  const url = `${this.apiUrl}save-student-admission`;
  return this.http.post(url, formData);
}
}
