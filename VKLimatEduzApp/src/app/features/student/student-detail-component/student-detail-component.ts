import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-detail-component.html',
  styleUrls: ['./student-detail-component.scss']
})
export class StudentDetailComponent {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  studentForm: FormGroup;
  activeTab: string = 'Student';
  tabs = [
    { id: 'Student', label: 'Student', index: 0 },
    { id: 'Academic', label: 'Academic', index: 1 },
    { id: 'Parents', label: "Parent's", index: 2 },
    { id: 'Transport', label: 'Transport', index: 3 },
    { id: 'DocumentUpload', label: 'Document Upload', index: 4 },
    { id: 'Other', label: 'Other', index: 5 },
    { id: 'Record', label: 'Record', index: 6 },
    { id: 'CategoryCertificate', label: 'Category Certificate', index: 7 }
  ];

  // Dropdown Data
  branches = [
    { id: 1, name: 'Main Branch' },
    { id: 2, name: 'City Branch' },
    { id: 3, name: 'North Campus' }
  ];

  genders = [
    { id: 1, name: 'Male' },
    { id: 2, name: 'Female' },
    { id: 3, name: 'Other' }
  ];

  bloodGroups = [
    { id: 1, name: 'A+' },
    { id: 2, name: 'A-' },
    { id: 3, name: 'B+' },
    { id: 4, name: 'B-' },
    { id: 5, name: 'O+' },
    { id: 6, name: 'O-' },
    { id: 7, name: 'AB+' },
    { id: 8, name: 'AB-' }
  ];

  religions = [
    { id: 1, name: 'Hindu' },
    { id: 2, name: 'Muslim' },
    { id: 3, name: 'Christian' },
    { id: 4, name: 'Sikh' },
    { id: 5, name: 'Jain' },
    { id: 6, name: 'Buddhist' },
    { id: 7, name: 'Other' }
  ];

  castes = [
    { id: 1, name: 'General' },
    { id: 2, name: 'OBC' },
    { id: 3, name: 'SC' },
    { id: 4, name: 'ST' },
    { id: 5, name: 'Other' }
  ];

  countries = [
    { id: 1, name: 'India' },
    { id: 2, name: 'USA' },
    { id: 3, name: 'UK' }
  ];

  states = [
    { id: 1, name: 'Delhi' },
    { id: 2, name: 'Maharashtra' },
    { id: 3, name: 'Karnataka' }
  ];

  cities = [
    { id: 1, name: 'New Delhi' },
    { id: 2, name: 'Mumbai' },
    { id: 3, name: 'Bangalore' }
  ];

  // Academic Dropdown Data
  categories = [
    { id: 1, name: 'General' },
    { id: 2, name: 'OBC' },
    { id: 3, name: 'SC/ST' }
  ];

  groups = [
    { id: 1, name: 'Science' },
    { id: 2, name: 'Commerce' },
    { id: 3, name: 'Arts' }
  ];

  streams = [
    { id: 1, name: 'PCM' },
    { id: 2, name: 'PCB' },
    { id: 3, name: 'Commerce with Maths' }
  ];

  classes = [
    { id: 1, name: 'Class 1' },
    { id: 2, name: 'Class 2' },
    { id: 3, name: 'Class 3' },
    { id: 4, name: 'Class 4' },
    { id: 5, name: 'Class 5' }
  ];

  sections = [
    { id: 1, name: 'A' },
    { id: 2, name: 'B' },
    { id: 3, name: 'C' }
  ];

  concessions = [
    { id: 1, name: 'None' },
    { id: 2, name: 'Sibling' },
    { id: 3, name: 'Staff' }
  ];

  feeGroups = [
    { id: 1, name: 'Regular' },
    { id: 2, name: 'Scholarship' }
  ];

  qualifications = [
    { id: 1, name: 'Graduate' },
    { id: 2, name: 'Post Graduate' },
    { id: 3, name: 'Doctorate' },
    { id: 4, name: 'Other' }
  ];

  occupations = [
    { id: 1, name: 'Service' },
    { id: 2, name: 'Business' },
    { id: 3, name: 'Self Employed' },
    { id: 4, name: 'Other' }
  ];

  // Transport Dropdown Data
  transportModes = [
    { id: 1, name: 'Own' },
    { id: 2, name: 'School Transport' }
  ];

  pickDropOptions = [
    { id: 1, name: 'Both' },
    { id: 2, name: 'Pick Only' },
    { id: 3, name: 'Drop Only' }
  ];

  transportAreas = [
    { id: 1, name: 'Area 1' },
    { id: 2, name: 'Area 2' }
  ];

  transportStands = [
    { id: 1, name: 'Stand 1' },
    { id: 2, name: 'Stand 2' }
  ];

  transportRoutes = [
    { id: 1, name: 'Route 1' },
    { id: 2, name: 'Route 2' }
  ];

  transportDrivers = [
    { id: 1, name: 'Driver 1' },
    { id: 2, name: 'Driver 2' }
  ];

  transportMonthsList = [
    { label: 'Apr', monthId: 4 },
    { label: 'May', monthId: 5 },
    { label: 'Jun', monthId: 6 },
    { label: 'Jul', monthId: 7 },
    { label: 'Aug', monthId: 8 },
    { label: 'Sep', monthId: 9 },
    { label: 'Oct', monthId: 10 },
    { label: 'Nov', monthId: 11 },
    { label: 'Dec', monthId: 12 },
    { label: 'Jan', monthId: 1 },
    { label: 'Feb', monthId: 2 },
    { label: 'Mar', monthId: 3 }
  ];

  documentTypes = [
    { doc_id: 101, doc_Code: 'dobProof', doc_label: 'Date of Birth Proof', doc_File: '' },
    { doc_id: 102, doc_Code: 'aadharCard', doc_label: 'Aadhar Card', doc_File: '' },
    { doc_id: 103, doc_Code: 'signature', doc_label: 'Signature', doc_File: '' },
    { doc_id: 104, doc_Code: 'fatherAadhar', doc_label: 'Father Aadharcard', doc_File: '' },
    { doc_id: 105, doc_Code: 'motherAadhar', doc_label: 'Mother Aadharcard', doc_File: '' },
    { doc_id: 106, doc_Code: 'incomeCert', doc_label: 'Income Certificate', doc_File: '' },
    { doc_id: 107, doc_Code: 'casteCert', doc_label: 'Caste Certificate', doc_File: '' },
    { doc_id: 108, doc_Code: 'addressProof1', doc_label: 'Address Proof 1', doc_File: '' },
    { doc_id: 109, doc_Code: 'addressProof2', doc_label: 'Address Proof 2', doc_File: '' },
    { doc_id: 110, doc_Code: 'migrationCert', doc_label: 'Migration Certificate', doc_File: '' }
  ];

  selectedFiles: { [key: string]: File } = {};

  constructor(private fb: FormBuilder) {
    this.studentForm = this.fb.group({
      tabs: this.fb.array([
        this.createStudentGroup(),
        this.createAcademicGroup(), // Academic
        this.createParentGroup(),
        this.createTransportGroup(), // Transport
        this.createDocumentUploadGroup(), // Document Upload
        this.fb.group({}), // Other
        this.fb.group({}), // Record
        this.fb.group({})  // Category Certificate
      ])
    });
  }

  get tabsArray(): FormArray {
    return this.studentForm.get('tabs') as FormArray;
  }

  getDocsArray(): FormArray {
    return this.tabsArray.at(4) as FormArray;
  }

  createStudentGroup(): FormGroup {
    return this.fb.group({
      adm_branch_Id: [''],
      adm_no: ['', Validators.required],
      adm_date: [''],
      adm_doj: [''],
      sess_stud_first_name: ['', Validators.required],
      sess_stud_last_name: [''],
      adm_ssr_no: [''],
      adm_dob: [''],
      adm_gender_id: [''],
      adm_blood_grp_id: [''],
      sess_religion_id: [''],
      sess_caste_id: [''],
      adm_stud_mobile_no: [''],
      sess_student_aadhar_no: [''],
      adm_stud_email_ddress: [''],

      // Address Info
      sess_country_id: [''],
      sess_state_id: [''],
      sess_city_id: [''],
      sess_address: [''],
      sess_pin_code: [''],

      // Permanent Address Info
      sess_permanent_country_id: [''],
      sess_permanent_state_id: [''],
      sess_permanent_city_id: [''],
      sess_permanent_address: [''],
      sess_permanent_pin_code: ['']
    });
  }

  createParentGroup(): FormGroup {
    return this.fb.group({
      // Father Details
      sess_father_name: [''],
      sess_father_mobile_no: [''],
      sess_father_qualification_id: [''],
      sess_father_occupation_id: [''],
      sess_father_designation_id: [''],
      sess_father_annual_income: [''],
      sess_father_office_address: [''],
      sess_is_fse: [false],
      
      // Mother Details
      sess_mother_name: [''],
      sess_mother_mobile_no: [''],
      sess_mother_qualification_id: [''],
      sess_mother_occupation_id: [''],
      sess_mother_designation_id: [''],
      sess_mother_annual_income: [''],
      sess_mother_office_address: [''],
      sess_is_mse: [false],

      // Guardian Details
      sess_g1_name: [''],
      sess_g1_mobile_no: [''],
      sess_g1_address: [''],
      sess_g2_name: [''],
      sess_g2_mobile_no: [''],
      sess_g2_address: [''],
      
      otherDetails: ['']
    });
  }

  createAcademicGroup(): FormGroup {
    return this.fb.group({
      // Admission Details
      adm_cat_id: [''],
      adm_grp_id: [''],
      adm_stream_id: [''],
      adm_class_id: [''],
      adm_section_id: [''],
      adm_rollno: [''],
      adm_concession_id: [''],
      adm_fee_group_id: [''],

      // Session Details
      sess_cat_id: [''],
      sess_grp_id: [''],
      sess_stream_id: [''],
      sess_class_id: [''],
      sess_section_id: [''],
      sess_roll_no: [''],
      sess_concession_id: [''],
      sess_fee_group_id: ['']
    });
  }

  createTransportGroup(): FormGroup {
    return this.fb.group({
      transportMode: [''],
      pickArea: [''],
      pickDrop: [''],
      pickStand: [''],
      pickRoute: [''],
      pickDriver: [''],
      dropArea: [''],
      dropStand: [''],
      dropRoute: [''],
      dropDriver: [''],
      months: this.fb.array(this.transportMonthsList.map(() => false))
    });
  }

  createDocumentUploadGroup(): FormArray {
    const controls = this.documentTypes.map(doc => {
      return this.fb.group({
        doc_id: [doc.doc_id],
        doc_Code: [doc.doc_Code],
        doc_label: [doc.doc_label],
        doc_File: ['']
      });
    });
    return this.fb.array(controls);
  }

  setActiveTab(tabId: string) {
    this.activeTab = tabId;
  }

  onFileSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      // Update the form control value with the ACTUAL File object, not the string path
      const docArray = this.getDocsArray();
      const docGroup = docArray.at(index) as FormGroup;
      docGroup.patchValue({
        doc_File: file
      });
    }
  }

  private toFormData(formValue: any): FormData {
    const formData = new FormData();

    for (const key of Object.keys(formValue)) {
      const value = formValue[key];

      // Skip null/undefined
      if (value === null || value === undefined) continue;

      if (key === 'Docs' && Array.isArray(value)) {
        // Handle Document Array
        value.forEach((doc: any, index: number) => {
          formData.append(`Docs[${index}].doc_id`, doc.doc_id);
          formData.append(`Docs[${index}].doc_Code`, doc.doc_Code);
          formData.append(`Docs[${index}].doc_label`, doc.doc_label);
          // Append the file only if it exists and is a File object
          if (doc.doc_File instanceof File) {
            formData.append(`Docs[${index}].doc_File`, doc.doc_File, doc.doc_File.name);
          }
        });
      } else if (key === 'months' && Array.isArray(value)) {
        // Handle Months Array
        value.forEach((monthId: any, index: number) => {
          formData.append(`months[${index}]`, monthId.toString());
        });
      } else {
        // Handle simple fields
        if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (typeof value === 'string' && value.trim() === '') {
          // Skip empty strings to avoid binding issues with non-string types (e.g. int?, DateTime?)
          continue;
        } else {
          formData.append(key, value.toString());
        }
      }
    }
    return formData;
  }

  studentService=inject(StudentService);
  onSubmit() {
    console.log('Form Valid:', this.studentForm.valid);
    console.log('Form Value:', this.studentForm.value);
    console.log('Form Raw Value:', this.studentForm.getRawValue());

    if (this.studentForm.valid) {
      // Combine all tab values into one object if needed, or send as is
      const formValue = this.studentForm.value;

      // Transform months boolean array to monthId array
      const transportData = formValue.tabs[3];
      const selectedMonthIds = transportData.months
        .map((isSelected: boolean, index: number) => isSelected ? this.transportMonthsList[index].monthId : null)
        .filter((id: number | null) => id !== null);

      const combinedValue = {
        ...formValue.tabs[0],
        ...formValue.tabs[1],
        ...formValue.tabs[2],
        ...transportData,
        months: selectedMonthIds,
        Docs: formValue.tabs[4], // Document Upload array
        ...formValue.tabs[5], // Other
        // ... merge other tabs
        // documents: this.selectedFiles // Include the selected files
      };
      console.log('Combined Value:', combinedValue);

      const formData = this.toFormData(combinedValue);

      this.studentService.saveStudent(formData).subscribe(response => {
        console.log('Save successful', response);
        alert('Student saved successfully');
        this.save.emit(combinedValue);
        this.close.emit();
      }, error => {
        console.error('Save failed', error);
        if (error.error && error.error.errors) {
          let errorMessage = 'Validation failed:\n';
          for (const key in error.error.errors) {
            errorMessage += `${key}: ${error.error.errors[key].join(', ')}\n`;
          }
          alert(errorMessage);
        } else {
          alert('Save failed: ' + (error.message || 'Unknown error'));
        }
      });

    } else {
      console.log('Form is invalid');
    }
  }

  onCancel() {
    this.close.emit();
  }
}
