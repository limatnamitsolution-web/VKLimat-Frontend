import { Component, EventEmitter, OnInit, effect, inject, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { StudentService } from '../services/student.service';
import { MASTER_CONFIG_DWN_TYPES, MasterConfigsDWN } from '../../../shared/services/master-configs-dwn';
import { LoaderService } from '../../../shared/services/loader.service';
import {
  StudentAdmissionRequestDto,
  StudentDocumentRequestDto,
  TransportDto
} from '../../../models/student-admission.model';

interface DropdownOption {
  id: number | string;
  name: string;
}

interface MasterDropdownData {
  branches: DropdownOption[];
  genders: DropdownOption[];
  bloodGroups: DropdownOption[];
  religions: DropdownOption[];
  castes: DropdownOption[];
  countries: DropdownOption[];
  states: DropdownOption[];
  cities: DropdownOption[];
  categories: DropdownOption[];
  groups: DropdownOption[];
  streams: DropdownOption[];
  classes: DropdownOption[];
  sections: DropdownOption[];
  concessions: DropdownOption[];
  feeGroups: DropdownOption[];
  qualifications: DropdownOption[];
  occupations: DropdownOption[];
  transportModes: DropdownOption[];
  pickDropOptions: DropdownOption[];
  transportAreas: DropdownOption[];
  transportStands: DropdownOption[];
  transportRoutes: DropdownOption[];
  transportDrivers: DropdownOption[];
}

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-detail-component.html',
  styleUrls: ['./student-detail-component.scss']
})
export class StudentDetailComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  studentForm: FormGroup;
  activeTab: string = 'Student';
  tabs = [
    { id: 'Student', label: 'Student', index: 0 },
    { id: 'Academic', label: 'Academic', index: 1 },
    { id: 'Parents', label: "Parent's", index: 2 },
    { id: 'Transport', label: 'Transport', index: 3 },
    { id: 'Documents', label: 'Document Upload', index: 4 },
    { id: 'Other', label: 'Other', index: 5 },
    { id: 'Record', label: 'Record', index: 6 },
    { id: 'CategoryCertificate', label: 'Category Certificate', index: 7 }
  ];

  // Dropdown Data
  masterData = signal<MasterDropdownData>({
    branches: [],
    genders: [],
    bloodGroups: [],
    religions: [],
    castes: [],
    countries: [],
    states: [],
    cities: [],
    categories: [],
    groups: [],
    streams: [],
    classes: [],
    sections: [],
    concessions: [],
    feeGroups: [],
    qualifications: [],
    occupations: [],
    transportModes: [],
    pickDropOptions: [],
    transportAreas: [],
    transportStands: [],
    transportRoutes: [],
    transportDrivers: []
  });

  get branches(): DropdownOption[] { return this.masterData().branches; }
  get genders(): DropdownOption[] { return this.masterData().genders; }
  get bloodGroups(): DropdownOption[] { return this.masterData().bloodGroups; }
  get religions(): DropdownOption[] { return this.masterData().religions; }
  get castes(): DropdownOption[] { return this.masterData().castes; }
  get countries(): DropdownOption[] { return this.masterData().countries; }
  get states(): DropdownOption[] { return this.masterData().states; }
  get cities(): DropdownOption[] { return this.masterData().cities; }
  get categories(): DropdownOption[] { return this.masterData().categories; }
  get groups(): DropdownOption[] { return this.masterData().groups; }
  get streams(): DropdownOption[] { return this.masterData().streams; }
  get classes(): DropdownOption[] { return this.masterData().classes; }
  get sections(): DropdownOption[] { return this.masterData().sections; }
  get concessions(): DropdownOption[] { return this.masterData().concessions; }
  get feeGroups(): DropdownOption[] { return this.masterData().feeGroups; }
  get qualifications(): DropdownOption[] { return this.masterData().qualifications; }
  get occupations(): DropdownOption[] { return this.masterData().occupations; }
  get transportModes(): DropdownOption[] { return this.masterData().transportModes; }
  get pickDropOptions(): DropdownOption[] { return this.masterData().pickDropOptions; }
  get transportAreas(): DropdownOption[] { return this.masterData().transportAreas; }
  get transportStands(): DropdownOption[] { return this.masterData().transportStands; }
  get transportRoutes(): DropdownOption[] { return this.masterData().transportRoutes; }
  get transportDrivers(): DropdownOption[] { return this.masterData().transportDrivers; }

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

  private readonly defaultTransportMonthIds = [4, 5, 12, 1, 2, 3];
  private readonly selectedDocumentFiles: Record<number, File> = {};

  private readonly studentService = inject(StudentService);
  private readonly masterConfigsDWN = inject(MasterConfigsDWN);
  private readonly loaderService = inject(LoaderService);
  private readonly masterConfigDwnTypes = MASTER_CONFIG_DWN_TYPES;
  private isDropdownLoadPending = false;

  constructor(
    private fb: FormBuilder
  ) {
    this.studentForm = this.fb.group({
      Student: this.createStudentGroup(),
      Academic: this.createAcademicGroup(),
      Parents: this.createParentGroup(),
      Transport: this.createTransportGroup(),
      Documents: this.createDocumentUploadGroup(),
      Other: this.fb.group({}),
      Record: this.fb.group({}),
      CategoryCertificate: this.fb.group({})
    });

    effect(() => {
      const dwnList = this.masterConfigsDWN.masterConfigDwnList();
      if (!this.isDropdownLoadPending || !Array.isArray(dwnList)) {
        return;
      }

      this.bindMasterDropdowns(dwnList);
    });
  }

  ngOnInit(): void {
    this.isDropdownLoadPending = true;
    this.loaderService.show();
    this.masterConfigsDWN.fetchMasterConfigDWN(this.masterConfigDwnTypes.toString());
  }

  private bindMasterDropdowns(rawMasterItems: unknown[]): void {
    try {
      const current = this.masterData();
      const next: MasterDropdownData = {
        branches: [...current.branches],
        genders: [...current.genders],
        bloodGroups: [...current.bloodGroups],
        religions: [...current.religions],
        castes: [...current.castes],
        countries: [...current.countries],
        states: [...current.states],
        cities: [...current.cities],
        categories: [...current.categories],
        groups: [...current.groups],
        streams: [...current.streams],
        classes: [...current.classes],
        sections: [...current.sections],
        concessions: [...current.concessions],
        feeGroups: [...current.feeGroups],
        qualifications: [...current.qualifications],
        occupations: [...current.occupations],
        transportModes: [...current.transportModes],
        pickDropOptions: [...current.pickDropOptions],
        transportAreas: [...current.transportAreas],
        transportStands: [...current.transportStands],
        transportRoutes: [...current.transportRoutes],
        transportDrivers: [...current.transportDrivers]
      };
      let generatedId = 1;

      for (const item of rawMasterItems) {
        if (!item || typeof item !== 'object') {
          continue;
        }

        const record = item as Record<string, unknown>;
        const rawType = record['type'];
        const type = typeof rawType === 'string' ? rawType.trim().toLowerCase() : '';
        if (!type) {
          continue;
        }

        const rawName = record['name'];
        const name = typeof rawName === 'string' ? rawName.trim() : '';
        if (!name) {
          continue;
        }

        const idValue =
          record['id'] ??
          record['configKey'] ??
          record['key'] ??
          record['value'] ??
          generatedId;
        const option: DropdownOption = {
          id: typeof idValue === 'number' || typeof idValue === 'string' ? idValue : generatedId,
          name
        };
        generatedId += 1;

        switch (type) {
          case 'branch':
            next.branches.push(option);
            break;
          case 'gender':
            next.genders.push(option);
            break;
          case 'bloodgroup':
            next.bloodGroups.push(option);
            break;
          case 'religion':
            next.religions.push(option);
            break;
          case 'caste':
          case 'castecategory':
            next.castes.push(option);
            break;
          case 'country':
            next.countries.push(option);
            break;
          case 'state':
            next.states.push(option);
            break;
          case 'city':
            next.cities.push(option);
            break;
          case 'admissioncategory':
            next.categories.push(option);
            break;
          case 'examclassgroup':
            next.groups.push(option);
            break;
          case 'classgroup':
            next.groups.push(option);
            next.classes.push(option);
            break;
          case 'stream':
            next.streams.push(option);
            break;
          case 'section':
            next.sections.push(option);
            break;
          case 'conccategory':
            next.concessions.push(option);
            break;
          case 'feegroup':
            next.feeGroups.push(option);
            break;
          case 'qualification':
            next.qualifications.push(option);
            break;
          case 'occupation':
          case 'occuption':
            next.occupations.push(option);
            break;
          case 'zone':
          case 'location':
            next.transportAreas.push(option);
            break;
          case 'busstop':
            next.transportStands.push(option);
            break;
          case 'route':
            next.transportRoutes.push(option);
            break;
          case 'transportmode':
            next.transportModes.push(option);
            break;
          case 'pickdrop':
            next.pickDropOptions.push(option);
            break;
          case 'driver':
          case 'transportdriver':
          case 'busdriver':
            next.transportDrivers.push(option);
            break;
          default:
            break;
        }
      }

      this.masterData.set(next);
    } finally {
      this.isDropdownLoadPending = false;
      this.loaderService.hide();
    }
  }

  get docsArray(): FormArray {
    return this.studentForm.get('Documents') as FormArray;
  }

  get transportMonthsArray(): FormArray {
    return this.studentForm.get(['Transport', 'months']) as FormArray;
  }

  createStudentGroup(): FormGroup {
    return this.fb.group({
      adm_branch_Id: [1],
      adm_no: ['1001-1', Validators.required],
      adm_date: ['2026-07-14'],
      adm_doj: ['2026-07-14'],
      sess_stud_first_name: ['Rahul', Validators.required],
      sess_stud_last_name: ['Ganga'],
      adm_ssr_no: ['ssrrno:1022'],
      adm_dob: ['2012-04-18'],
      adm_gender_id: [1],
      adm_blood_grp_id: [1],
      sess_religion_id: [1],
      sess_caste_id: [1],
      adm_stud_mobile_no: ['9978976545'],
      sess_student_aadhar_no: ['799898912345'],
      adm_stud_email_ddress: ['RahulGangadd@outlook.com'],

      // Address Info
      sess_country_id: [1],
      sess_state_id: [1],
      sess_city_id: [1],
      sess_address: ['House 12, Main Street'],
      sess_pin_code: ['10077'],

      // Permanent Address Info
      sess_permanent_country_id: [1],
      sess_permanent_state_id: [1],
      sess_permanent_city_id: [1],
      sess_permanent_address: ['House 12, Main Street'],
      sess_permanent_pin_code: ['10077']
    });
  }

  createParentGroup(): FormGroup {
    return this.fb.group({
      // Father Details
      sess_father_name: ['ff'],
      sess_father_mobile_no: ['9989899899'],
      sess_father_qualification_id: [2],
      sess_father_occupation_id: [2],
      sess_father_designation_id: ['sds'],
      sess_father_annual_income: ['100000'],
      sess_father_office_address: ['oo'],
      sess_is_fse: [false],
      
      // Mother Details
      sess_mother_name: ['mmm'],
      sess_mother_mobile_no: ['9989899899'],
      sess_mother_qualification_id: [3],
      sess_mother_occupation_id: [1],
      sess_mother_designation_id: ['sds'],
      sess_mother_annual_income: ['12121'],
      sess_mother_office_address: ['dvdv'],
      sess_is_mse: [true],

      // Guardian Details
      sess_g1_name: ['g'],
      sess_g1_mobile_no: ['9989899899'],
      sess_g1_address: ['AAA'],
      sess_g2_name: ['Test'],
      sess_g2_mobile_no: ['9978976545'],
      sess_g2_address: ['address12'],
      
      otherDetails: ['SDFFD']
    });
  }

  createAcademicGroup(): FormGroup {
    return this.fb.group({
      // Admission Details
      adm_cat_id: [1],
      adm_grp_id: [1],
      adm_stream_id: [1],
      adm_class_id: [5],
      adm_section_id: [2],
      adm_rollno: ['aa122'],
      adm_concession_id: [1],
      adm_fee_group_id: [1],

      // Session Details
      sess_cat_id: [2],
      sess_grp_id: [1],
      sess_stream_id: [1],
      sess_class_id: [1],
      sess_section_id: [1],
      sess_roll_no: ['dsew33'],
      sess_concession_id: [2],
      sess_fee_group_id: [1]
    });
  }

  createTransportGroup(): FormGroup {
    return this.fb.group({
      transportMode: [1],
      pickArea: [1],
      pickDrop: [1],
      pickStand: [1],
      pickRoute: [1],
      pickDriver: [1],
      dropArea: [2],
      dropStand: [2],
      dropRoute: [2],
      dropDriver: [2],
      months: this.fb.array(
        this.transportMonthsList.map((month) => this.defaultTransportMonthIds.includes(month.monthId))
      )
    });
  }

  createDocumentUploadGroup(): FormArray {
    const controls = this.documentTypes.map(doc => {
      return this.fb.group({
        doc_id: [doc.doc_id],
        doc_Code: [doc.doc_Code],
        doc_label: [doc.doc_label],
        doc_File: [null]
      });
    });
    return this.fb.array(controls);
  }

  setActiveTab(tabId: string) {
    this.activeTab = tabId;
  }

  onFileSelected(event: Event, index: number): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0] ?? null;
    if (file) {
      this.selectedDocumentFiles[index] = file;
      const docArray = this.docsArray;
      const docGroup = docArray.at(index) as FormGroup;
      docGroup.patchValue({
        doc_File: file
      });
    }
  }

  private toFormData(model: unknown): FormData {
    const formData = new FormData();
    this.appendToFormData(formData, model);
    return formData;
  }

  private isFileLike(value: unknown): value is File {
    return !!value && typeof value === 'object' && 'name' in (value as Record<string, unknown>);
  }

  private appendUploadedDocuments(formData: FormData, documents: StudentDocumentRequestDto[]): void {
    documents.forEach((document, index) => {
      const file = document.doc_File;
      if (!this.isFileLike(file)) {
        return;
      }

      const savedPath = document.SavedPath || file.name;

      formData.append(`Docs[${index}].doc_id`, String(document.doc_id));
      formData.append(`Docs[${index}].doc_Code`, document.doc_Code);
      formData.append(`Docs[${index}].doc_label`, document.doc_label);
      formData.append(`Docs[${index}].SavedPath`, savedPath);
      formData.append(`Docs[${index}].doc_File`, file, file.name);
    });
  }

  private appendToFormData(formData: FormData, value: unknown, parentKey?: string): void {
    if (value === null || value === undefined) {
      return;
    }

    if (value instanceof File) {
      if (parentKey) {
        formData.append(parentKey, value, value.name);
      }
      return;
    }

    if (value instanceof Date) {
      if (parentKey) {
        formData.append(parentKey, value.toISOString());
      }
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const arrayKey = parentKey ? `${parentKey}[${index}]` : `[${index}]`;
        this.appendToFormData(formData, item, arrayKey);
      });
      return;
    }

    if (typeof value === 'object') {
      Object.entries(value as Record<string, unknown>).forEach(([key, childValue]) => {
        const objectKey = parentKey ? `${parentKey}.${key}` : key;
        this.appendToFormData(formData, childValue, objectKey);
      });
      return;
    }

    if (parentKey) {
      formData.append(parentKey, String(value));
    }
  }

  private applyStringDefaults<T extends Record<string, unknown>>(
    source: T,
    defaults: Record<string, string>
  ): T {
    const normalized: Record<string, unknown> = { ...source };

    Object.entries(defaults).forEach(([key, fallback]) => {
      const currentValue = normalized[key];
      if (currentValue === null || currentValue === undefined) {
        normalized[key] = fallback;
        return;
      }

      const text = String(currentValue).trim();
      if (text.length === 0) {
        normalized[key] = fallback;
      }
    });

    return normalized as T;
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      const formValue = this.studentForm.getRawValue();
      const studentRaw = formValue.Student ?? {};
      const academicRaw = formValue.Academic ?? {};
      const parentsRaw = formValue.Parents ?? {};

      const studentPayload = this.applyStringDefaults(studentRaw, {
        adm_no: '1022',
        sess_stud_first_name: 'Rahul',
        sess_stud_last_name: 'Ganga',
        adm_ssr_no: 'ssrrno:1022',
        adm_stud_mobile_no: '9978976545',
        sess_student_aadhar_no: '799898912345',
        adm_stud_email_ddress: 'RahulGangadd@outlook.com',
        sess_address: 'House 12, Main Street',
        sess_pin_code: '10077',
        sess_permanent_address: 'House 12, Main Street',
        sess_permanent_pin_code: '10077'
      });

      const academicPayload = this.applyStringDefaults(academicRaw, {
        adm_rollno: 'aa122',
        sess_roll_no: 'dsew33'
      });

      const parentsPayload = this.applyStringDefaults(parentsRaw, {
        sess_father_name: 'ff',
        sess_father_mobile_no: '9989899899',
        sess_father_designation_id: 'sds',
        sess_father_annual_income: '100000',
        sess_father_office_address: 'oo',
        sess_mother_name: 'mmm',
        sess_mother_mobile_no: '9989899899',
        sess_mother_designation_id: 'sds',
        sess_mother_annual_income: '12121',
        sess_mother_office_address: 'dvdv',
        sess_g1_name: 'g',
        sess_g1_mobile_no: '9989899899',
        sess_g1_address: 'AAA',
        sess_g2_name: 'Test',
        sess_g2_mobile_no: '9978976545',
        sess_g2_address: 'address12',
        otherDetails: 'SDFFD'
      });

      const selectedMonthIds = (formValue.Transport.months as boolean[])
        .map((isSelected: boolean, index: number) =>
          isSelected ? this.transportMonthsList[index].monthId : null
        )
        .filter((id: number | null): id is number => id !== null);
      const uploadDocuments = Object.keys(this.selectedDocumentFiles)
        .map((indexText) => Number(indexText))
        .filter((index) => Number.isInteger(index) && index >= 0)
        .map((index) => {
          const file = this.selectedDocumentFiles[index];
          const docGroup = this.docsArray.at(index) as FormGroup;
          const docValue = docGroup.getRawValue() as StudentDocumentRequestDto;

          return {
            ...docValue,
            doc_File: file,
            SavedPath: file.name
          };
        });

      const model: StudentAdmissionRequestDto = {
        Student: studentPayload,
        Academic: academicPayload,
        Parents: parentsPayload,
        Transport: {
          ...formValue.Transport,
          months: selectedMonthIds
        } as TransportDto,
        Documents: [],
        Docs: [],
        Other: formValue.Other,
        Record: formValue.Record,
        CategoryCertificate: formValue.CategoryCertificate
      };

      const formData = this.toFormData(model);
      this.appendUploadedDocuments(formData, uploadDocuments);

      this.studentService.saveStudent(formData).subscribe(response => {
        alert('Student saved successfully');
        this.save.emit(model);
        Object.keys(this.selectedDocumentFiles).forEach((key) => delete this.selectedDocumentFiles[Number(key)]);
        this.close.emit();
      }, error => {
        if (error?.error?.errors && typeof error.error.errors === 'object') {
          let errorMessage = 'Validation failed:\n';
          for (const key in error.error.errors) {
            errorMessage += `${key}: ${error.error.errors[key].join(', ')}\n`;
          }
          alert(errorMessage);
          console.error('Validation errors:', error.error.errors);
          console.log('Validation log-errors:', error.error.errors);
        } else {
          const details = typeof error?.error === 'string'
            ? error.error
            : JSON.stringify(error?.error ?? error, null, 2);
          alert('Save failed:\n' + details);
          console.error('Save failed response:', error);
        }
      });
    } else {
      this.studentForm.markAllAsTouched();
    }
  }

  onCancel() {
    Object.keys(this.selectedDocumentFiles).forEach((key) => delete this.selectedDocumentFiles[Number(key)]);
    this.close.emit();
  }
}
