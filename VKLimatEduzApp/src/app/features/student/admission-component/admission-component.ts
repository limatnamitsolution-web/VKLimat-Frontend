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
      AdmNo: '1001',
      AdmDate: '2023-04-01',
      DOB: '2010-05-12',
      Student: 'Rahul Sharma',
      Class: '5',
      Sec: 'A',
      Father: 'Amit Sharma',
      Mother: 'Sunita Sharma',
      F_MobileNo: '9876543210',
      M_MobileNo: '9876543211'
    },
    {
      AdmNo: '1002',
      AdmDate: '2023-04-02',
      DOB: '2011-08-23',
      Student: 'Priya Singh',
      Class: '6',
      Sec: 'B',
      Father: 'Rakesh Singh',
      Mother: 'Meena Singh',
      F_MobileNo: '9876543222',
      M_MobileNo: '9876543223'
    },
    {
      AdmNo: '1003',
      AdmDate: '2023-04-03',
      DOB: '2010-06-15',
      Student: 'Arjun Verma',
      Class: '5',
      Sec: 'A',
      Father: 'Suresh Verma',
      Mother: 'Anita Verma',
      F_MobileNo: '9876543233',
      M_MobileNo: '9876543234'
    },
    {
      AdmNo: '1004',
      AdmDate: '2023-04-04',
      DOB: '2011-09-10',
      Student: 'Sneha Gupta',
      Class: '6',
      Sec: 'B',
      Father: 'Manoj Gupta',
      Mother: 'Ritu Gupta',
      F_MobileNo: '9876543244',
      M_MobileNo: '9876543245'
    },
    {
      AdmNo: '1005',
      AdmDate: '2023-04-05',
      DOB: '2010-07-20',
      Student: 'Rohan Das',
      Class: '5',
      Sec: 'C',
      Father: 'Vikram Das',
      Mother: 'Pooja Das',
      F_MobileNo: '9876543255',
      M_MobileNo: '9876543256'
    },
    {
      AdmNo: '1006',
      AdmDate: '2023-04-06',
      DOB: '2011-10-05',
      Student: 'Anjali Mehta',
      Class: '6',
      Sec: 'A',
      Father: 'Sanjay Mehta',
      Mother: 'Neha Mehta',
      F_MobileNo: '9876543266',
      M_MobileNo: '9876543267'
    },
    {
      AdmNo: '1007',
      AdmDate: '2023-04-07',
      DOB: '2010-08-12',
      Student: 'Kabir Khan',
      Class: '5',
      Sec: 'B',
      Father: 'Sameer Khan',
      Mother: 'Zara Khan',
      F_MobileNo: '9876543277',
      M_MobileNo: '9876543278'
    },
    {
      AdmNo: '1008',
      AdmDate: '2023-04-08',
      DOB: '2011-11-15',
      Student: 'Ishita Roy',
      Class: '6',
      Sec: 'C',
      Father: 'Alok Roy',
      Mother: 'Sima Roy',
      F_MobileNo: '9876543288',
      M_MobileNo: '9876543289'
    },
    {
      AdmNo: '1009',
      AdmDate: '2023-04-09',
      DOB: '2010-09-25',
      Student: 'Aryan Singh',
      Class: '5',
      Sec: 'A',
      Father: 'Rajeev Singh',
      Mother: 'Kavita Singh',
      F_MobileNo: '9876543299',
      M_MobileNo: '9876543290'
    },
    {
      AdmNo: '1010',
      AdmDate: '2023-04-10',
      DOB: '2011-12-01',
      Student: 'Riya Kapoor',
      Class: '6',
      Sec: 'B',
      Father: 'Anil Kapoor',
      Mother: 'Sunita Kapoor',
      F_MobileNo: '9876543300',
      M_MobileNo: '9876543301'
    },
    {
      AdmNo: '1011',
      AdmDate: '2023-04-11',
      DOB: '2010-10-10',
      Student: 'Vivaan Joshi',
      Class: '5',
      Sec: 'C',
      Father: 'Deepak Joshi',
      Mother: 'Meera Joshi',
      F_MobileNo: '9876543311',
      M_MobileNo: '9876543312'
    },
    {
      AdmNo: '1012',
      AdmDate: '2023-04-12',
      DOB: '2011-01-20',
      Student: 'Diya Malhotra',
      Class: '6',
      Sec: 'A',
      Father: 'Rajesh Malhotra',
      Mother: 'Anju Malhotra',
      F_MobileNo: '9876543322',
      M_MobileNo: '9876543323'
    },
    {
      AdmNo: '1013',
      AdmDate: '2023-04-13',
      DOB: '2010-11-05',
      Student: 'Aarav Patel',
      Class: '5',
      Sec: 'B',
      Father: 'Sunil Patel',
      Mother: 'Geeta Patel',
      F_MobileNo: '9876543333',
      M_MobileNo: '9876543334'
    },
    {
      AdmNo: '1014',
      AdmDate: '2023-04-14',
      DOB: '2011-02-15',
      Student: 'Myra Saxena',
      Class: '6',
      Sec: 'C',
      Father: 'Vinay Saxena',
      Mother: 'Rekha Saxena',
      F_MobileNo: '9876543344',
      M_MobileNo: '9876543345'
    },
    {
      AdmNo: '1015',
      AdmDate: '2023-04-15',
      DOB: '2010-12-20',
      Student: 'Reyansh Jain',
      Class: '5',
      Sec: 'A',
      Father: 'Amit Jain',
      Mother: 'Priya Jain',
      F_MobileNo: '9876543355',
      M_MobileNo: '9876543356'
    },
    {
      AdmNo: '1016',
      AdmDate: '2023-04-16',
      DOB: '2011-03-10',
      Student: 'Saanvi Agarwal',
      Class: '6',
      Sec: 'B',
      Father: 'Rahul Agarwal',
      Mother: 'Nidhi Agarwal',
      F_MobileNo: '9876543366',
      M_MobileNo: '9876543367'
    },
    {
      AdmNo: '1017',
      AdmDate: '2023-04-17',
      DOB: '2011-01-05',
      Student: 'Advait Nair',
      Class: '5',
      Sec: 'C',
      Father: 'Kamal Nair',
      Mother: 'Lakshmi Nair',
      F_MobileNo: '9876543377',
      M_MobileNo: '9876543378'
    },
    {
      AdmNo: '1018',
      AdmDate: '2023-04-18',
      DOB: '2011-04-25',
      Student: 'Ananya Kulkarni',
      Class: '6',
      Sec: 'A',
      Father: 'Sandeep Kulkarni',
      Mother: 'Vidya Kulkarni',
      F_MobileNo: '9876543388',
      M_MobileNo: '9876543389'
    },
    {
      AdmNo: '1019',
      AdmDate: '2023-04-19',
      DOB: '2011-02-12',
      Student: 'Atharv Reddy',
      Class: '5',
      Sec: 'B',
      Father: 'Prakash Reddy',
      Mother: 'Swati Reddy',
      F_MobileNo: '9876543399',
      M_MobileNo: '9876543390'
    },
    {
      AdmNo: '1020',
      AdmDate: '2023-04-20',
      DOB: '2011-05-15',
      Student: 'Pari Choudhary',
      Class: '6',
      Sec: 'C',
      Father: 'Vikas Choudhary',
      Mother: 'Rina Choudhary',
      F_MobileNo: '9876543400',
      M_MobileNo: '9876543401'
    },
    {
      AdmNo: '1021',
      AdmDate: '2023-04-21',
      DOB: '2011-03-20',
      Student: 'Shaurya Mishra',
      Class: '5',
      Sec: 'A',
      Father: 'Ashok Mishra',
      Mother: 'Suman Mishra',
      F_MobileNo: '9876543411',
      M_MobileNo: '9876543412'
    },
    {
      AdmNo: '1022',
      AdmDate: '2023-04-22',
      DOB: '2011-06-10',
      Student: 'Avni Thakur',
      Class: '6',
      Sec: 'B',
      Father: 'Nitin Thakur',
      Mother: 'Seema Thakur',
      F_MobileNo: '9876543422',
      M_MobileNo: '9876543423'
    }
  ];

  constructor() {
    this.form = this.fb.group({
      id: 0,
      configValue: ['', Validators.required], // Mapping to Student Name for now
      configKey: ['', Validators.required],   // Mapping to AdmNo
      description: ['', Validators.required], // Mapping to Class
      configuration: ['']
    });

    // Initialize data
    this.gridData.set(this.initialData);
    this.applyFilters();
  }

  ngOnInit(): void {
      // Any init logic
      this.studentService.getAdmissions().subscribe({
        next: (data) => {
          console.log('Admissions loaded', data);
          // this.gridData.set(data); // Uncomment when API is ready
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
        (item.Student || '').toLowerCase().includes(term) ||
        (item.AdmNo || '').toLowerCase().includes(term) ||
        (item.Class || '').toLowerCase().includes(term) ||
        (item.Father || '').toLowerCase().includes(term)
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

  onSaveStudent(studentData: any) {
    const currentData = this.gridData();
    const newStudent = {
      ...studentData,
      AdmDate: new Date().toISOString().split('T')[0]
    };
    
    this.gridData.set([...currentData, newStudent]);
    this.applyFilters();
    // this.closeModal();
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
