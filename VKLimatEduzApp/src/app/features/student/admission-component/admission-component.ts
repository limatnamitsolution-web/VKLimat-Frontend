import { Component, OnInit, inject, effect, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { AdmissionGridComponent } from './admission-grid-component';
import { StudentDetailComponent } from '../student-detail-component/student-detail-component';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-admission-component',
  imports: [CommonModule, AdmissionGridComponent, ReactiveFormsModule, FormsModule, StudentDetailComponent],
  templateUrl: './admission-component.html',
  styleUrl: './admission-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdmissionComponent implements OnInit {
  gridData = signal<any[]>([]);
  filteredGridData = signal<any[]>([]);
  gridTitle: string = 'Admission Management';
  form: FormGroup;
  private fb = inject(FormBuilder);
  private studentService = inject(StudentService);
  editIndex: number | null = null;
  searchTerm: string = '';
  showModal = false;
  // Hardcoded data for now
  private initialData = [
    {
      adm_id:1,
      adm_no: '1001',
      adm_date: '2023-04-01',
      adm_dob: '2010-05-12',
      name: 'Rahul Ganga',
      class: 'LKG',
      section: 'A',
      sess_father_name: 'Amit Sharma',
      sess_mother_name: 'Sunita Sharma',
      sess_father_mobile_no: '9876543210',
      sess_mother_mobile_no: '9876543211'
    },
  ]
 

  constructor() {
    this.form = this.fb.group({
      id: 0,
      configValue: ['', Validators.required], // Mapping to Name Name for now
      configKey: ['', Validators.required],   // Mapping to adm_no
      description: ['', Validators.required], // Mapping to Class
      configuration: ['']
    });

    // Initialize data
    this.gridData.set(this.initialData);
    this.applyFilters();
  }
 keyParam: string = '';
  ngOnInit(): void {
      // Any init logic
      this.studentService.getAdmissions().subscribe({
        next: (data) => {
          console.log('Admissions loaded', data);
          this.gridData.set(data); // Uncomment when API is ready
          this.applyFilters();  
        },
        error: (err) => console.error('Error loading admissions', err)
      });
  }

  // Filtering logic for search
  applyFilters(): void {
    const term = this.searchTerm.toLowerCase();
    const allData = this.gridData();
    this.filteredGridData.set(
      allData.filter((item: any) =>
        String(item.Name ?? '').toLowerCase().includes(term) ||
        String(item.adm_no ?? '').toLowerCase().includes(term) ||
        String(item.Class ?? '').toLowerCase().includes(term) ||
        String(item.sess_father_name ?? '').toLowerCase().includes(term)
      )
    );
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  openAddModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  // private mapSavedStudentToGridRow(studentData: any): any {
  //   const student = studentData?.Name ?? {};
  //   const parents = studentData?.Parents ?? {};
  //   const academic = studentData?.Academic ?? {};

  //   return {
  //     adm_id: student.adm_id ?? 0,
  //     adm_no: student.adm_no ?? '',
  //     adm_date: student.adm_date || new Date().toISOString().split('T')[0],
  //     adm_dob: student.adm_dob ?? '',
  //     Name: `${student.sess_stud_first_name ?? ''} ${student.sess_stud_last_name ?? ''}`.trim(),
  //     Class: String(academic.sess_class_id ?? academic.adm_class_id ?? ''),
  //     Section: String(academic.sess_section_id ?? academic.adm_section_id ?? ''),
  //     sess_father_name: parents.sess_father_name ?? '',
  //     sess_mother_name: parents.sess_mother_name ?? '',
  //     sess_father_mobile_no: parents.sess_father_mobile_no ?? '',
  //     sess_mother_mobile_no: parents.sess_mother_mobile_no ?? ''
  //   };
  // }

  onSaveStudent(studentData: any) {
    //const currentData = this.gridData();
    // const newStudent = this.mapSavedStudentToGridRow(studentData);
    
    // this.gridData.set([...currentData, newStudent]);
    // this.applyFilters();
    // // this.closeModal();
  }

  addGridItem() {
    this.openAddModal();
  }

  resetForm() {
    this.form.reset();
    this.editIndex = null;
  }

  onModify(item: any) {
      // Handle modify
  }

  onDelete(item: any) {
      // Handle delete
  }
}
