import { Component, EventEmitter, OnInit, effect, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { StudentService } from '../services/student.service';
import { MASTER_CONFIG_DWN_TYPES, MasterConfigsDWN } from '../../../shared/services/master-configs-dwn';
import {
  StudentAdmissionRequestDto,
  StudentDocumentRequestDto,
  TransportDto
} from '../../../models/student-admission.model';

interface DropdownOption {
  id: number | string;
  name: string;
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
  branches: DropdownOption[] = [];

  genders: DropdownOption[] = [];

  bloodGroups: DropdownOption[] = [];

  religions: DropdownOption[] = [];

  castes: DropdownOption[] = [];

  countries: DropdownOption[] = [];

  states: DropdownOption[] = [];

  cities: DropdownOption[] = [];

  // Academic Dropdown Data
  categories: DropdownOption[] = [];

  groups: DropdownOption[] = [];

  streams: DropdownOption[] = [];

  classes: DropdownOption[] = [];

  sections: DropdownOption[] = [];

  concessions: DropdownOption[] = [];

  feeGroups: DropdownOption[] = [];

  qualifications: DropdownOption[] = [];

  occupations: DropdownOption[] = [];

  // Transport Dropdown Data
  transportModes: DropdownOption[] = [];

  pickDropOptions: DropdownOption[] = [];

  transportAreas: DropdownOption[] = [];

  transportStands: DropdownOption[] = [];

  transportRoutes: DropdownOption[] = [];

  transportDrivers: DropdownOption[] = [];

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
  private readonly masterConfigDwnTypes = MASTER_CONFIG_DWN_TYPES;

  constructor(private fb: FormBuilder) {
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
      if (!Array.isArray(dwnList) || dwnList.length === 0) {
        return;
      }

      this.bindMasterDropdowns(dwnList);
    });
  }

  ngOnInit(): void {
    this.masterConfigsDWN.fetchMasterConfigDWN(this.masterConfigDwnTypes.toString());
  }

  private bindMasterDropdowns(rawMasterItems: unknown[]): void {
    console.log('Binding master dropdowns with raw items:', rawMasterItems);
    this.branches = this.getMasterOptions(rawMasterItems, ['Branch'], this.branches);
    this.genders = this.getMasterOptions(rawMasterItems, ['Gender'], this.genders);
    this.bloodGroups = this.getMasterOptions(rawMasterItems, ['BloodGroup'], this.bloodGroups);
    this.religions = this.getMasterOptions(rawMasterItems, ['Religion'], this.religions);
    this.castes = this.getMasterOptions(rawMasterItems, ['Caste', 'CasteCategory'], this.castes);
    this.countries = this.getMasterOptions(rawMasterItems, ['Country'], this.countries);
    this.states = this.getMasterOptions(rawMasterItems, ['State'], this.states);
    this.cities = this.getMasterOptions(rawMasterItems, ['City'], this.cities);
    this.categories = this.getMasterOptions(rawMasterItems, ['AdmissionCategory'], this.categories);
    this.groups = this.getMasterOptions(rawMasterItems, ['ExamClassGroup', 'ClassGroup'], this.groups);
    this.streams = this.getMasterOptions(rawMasterItems, ['STREAM'], this.streams);
    this.classes = this.getMasterOptions(rawMasterItems, ['ClassGroup'], this.classes);
    this.sections = this.getMasterOptions(rawMasterItems, ['Section'], this.sections);
    this.concessions = this.getMasterOptions(rawMasterItems, ['ConcCategory'], this.concessions);
    this.feeGroups = this.getMasterOptions(rawMasterItems, ['feeGroup'], this.feeGroups);
    this.qualifications = this.getMasterOptions(rawMasterItems, ['Qualification'], this.qualifications);
    this.occupations = this.getMasterOptions(rawMasterItems, ['Occupation', 'Occuption'], this.occupations);
    this.transportAreas = this.getMasterOptions(rawMasterItems, ['Zone', 'Location'], this.transportAreas);
    this.transportStands = this.getMasterOptions(rawMasterItems, ['BusStop'], this.transportStands);
    this.transportRoutes = this.getMasterOptions(rawMasterItems, ['ROUTE'], this.transportRoutes);
    this.transportModes= this.getMasterOptions(rawMasterItems, ['TransportMode'], this.transportModes);
    this.pickDropOptions = this.getMasterOptions(rawMasterItems, ['PickDrop'], this.pickDropOptions);
  }

  private getMasterOptions(
    rawItems: unknown[],
    configurations: string[],
    fallback: DropdownOption[]
  ): DropdownOption[] {
    const matches = rawItems
      .filter((item) => this.matchesConfiguration(item, configurations))
      .map((item, index) => this.toDropdownOption(item, index))
      .filter((option): option is DropdownOption => !!option);

    return matches.length > 0 ? matches : fallback;
  }

  private matchesConfiguration(item: unknown, configurations: string[]): boolean {
    if (!item || typeof item !== 'object') {
      return false;
    }

    const record = item as Record<string, unknown>;
    const rawConfiguration =
      record['configuration'] ??
      record['Configuration'] ??
      record['configurationName'] ??
      record['config_name'] ??
      record['configType'] ??
      record['type'];

    if (typeof rawConfiguration !== 'string') {
      return false;
    }

    const normalized = this.normalizeKey(rawConfiguration);
    return configurations.some((config) => {
      const normalizedConfig = this.normalizeKey(config);
      return (
        normalizedConfig === normalized ||
        normalized.includes(normalizedConfig) ||
        normalizedConfig.includes(normalized)
      );
    });
  }

  private normalizeKey(value: string): string {
    return value.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  private toDropdownOption(item: unknown, index: number): DropdownOption | null {
    if (!item || typeof item !== 'object') {
      return null;
    }

    const record = item as Record<string, unknown>;
    const displayName =
      this.asNonEmptyString(record['configValue']) ??
      this.asNonEmptyString(record['description']) ??
      this.asNonEmptyString(record['name']) ??
      this.asNonEmptyString(record['label']);

    if (!displayName) {
      return null;
    }

    const idValue =
      record['id'] ??
      record['configKey'] ??
      record['key'] ??
      record['value'] ??
      index + 1;

    return {
      id: typeof idValue === 'number' || typeof idValue === 'string' ? idValue : index + 1,
      name: displayName
    };
  }

  private asNonEmptyString(value: unknown): string | null {
    if (value === null || value === undefined) {
      return null;
    }

    const text = String(value).trim();
    return text.length > 0 ? text : null;
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
      adm_no: ['1022', Validators.required],
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

  private withDefault(value: unknown, fallback: string): string {
    if (value === null || value === undefined) {
      return fallback;
    }

    const text = String(value).trim();
    return text.length > 0 ? text : fallback;
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      const formValue = this.studentForm.getRawValue();
      const studentRaw = formValue.Student ?? {};
      const academicRaw = formValue.Academic ?? {};
      const parentsRaw = formValue.Parents ?? {};

      const studentPayload = {
        ...studentRaw,
        adm_no: this.withDefault(studentRaw.adm_no, '1022'),
        sess_stud_first_name: this.withDefault(studentRaw.sess_stud_first_name, 'Rahul'),
        sess_stud_last_name: this.withDefault(studentRaw.sess_stud_last_name, 'Ganga'),
        adm_ssr_no: this.withDefault(studentRaw.adm_ssr_no, 'ssrrno:1022'),
        adm_stud_mobile_no: this.withDefault(studentRaw.adm_stud_mobile_no, '9978976545'),
        sess_student_aadhar_no: this.withDefault(studentRaw.sess_student_aadhar_no, '799898912345'),
        adm_stud_email_ddress: this.withDefault(studentRaw.adm_stud_email_ddress, 'RahulGangadd@outlook.com'),
        sess_address: this.withDefault(studentRaw.sess_address, 'House 12, Main Street'),
        sess_pin_code: this.withDefault(studentRaw.sess_pin_code, '10077'),
        sess_permanent_address: this.withDefault(studentRaw.sess_permanent_address, 'House 12, Main Street'),
        sess_permanent_pin_code: this.withDefault(studentRaw.sess_permanent_pin_code, '10077')
      };

      const academicPayload = {
        ...academicRaw,
        adm_rollno: this.withDefault(academicRaw.adm_rollno, 'aa122'),
        sess_roll_no: this.withDefault(academicRaw.sess_roll_no, 'dsew33')
      };

      const parentsPayload = {
        ...parentsRaw,
        sess_father_name: this.withDefault(parentsRaw.sess_father_name, 'ff'),
        sess_father_mobile_no: this.withDefault(parentsRaw.sess_father_mobile_no, '9989899899'),
        sess_father_designation_id: this.withDefault(parentsRaw.sess_father_designation_id, 'sds'),
        sess_father_annual_income: this.withDefault(parentsRaw.sess_father_annual_income, '100000'),
        sess_father_office_address: this.withDefault(parentsRaw.sess_father_office_address, 'oo'),
        sess_mother_name: this.withDefault(parentsRaw.sess_mother_name, 'mmm'),
        sess_mother_mobile_no: this.withDefault(parentsRaw.sess_mother_mobile_no, '9989899899'),
        sess_mother_designation_id: this.withDefault(parentsRaw.sess_mother_designation_id, 'sds'),
        sess_mother_annual_income: this.withDefault(parentsRaw.sess_mother_annual_income, '12121'),
        sess_mother_office_address: this.withDefault(parentsRaw.sess_mother_office_address, 'dvdv'),
        sess_g1_name: this.withDefault(parentsRaw.sess_g1_name, 'g'),
        sess_g1_mobile_no: this.withDefault(parentsRaw.sess_g1_mobile_no, '9989899899'),
        sess_g1_address: this.withDefault(parentsRaw.sess_g1_address, 'AAA'),
        sess_g2_name: this.withDefault(parentsRaw.sess_g2_name, 'Test'),
        sess_g2_mobile_no: this.withDefault(parentsRaw.sess_g2_mobile_no, '9978976545'),
        sess_g2_address: this.withDefault(parentsRaw.sess_g2_address, 'address12'),
        otherDetails: this.withDefault(parentsRaw.otherDetails, 'SDFFD')
      };

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
