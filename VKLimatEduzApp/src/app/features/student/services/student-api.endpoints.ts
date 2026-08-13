import { environment } from '../../../../environments/environment';

const studentAdmissionBase = `${environment.apiUrl}Student/Admission`;

export const StudentApiEndpoints = {
  admissions: `${studentAdmissionBase}/admissions`,
  saveAdmission: `${studentAdmissionBase}/save-student-admission`,
  updateAdmission: `${studentAdmissionBase}/update-student-admission`,
  admissionById: (id: number | string) => `${studentAdmissionBase}/studentformview/${id}`,
} as const;