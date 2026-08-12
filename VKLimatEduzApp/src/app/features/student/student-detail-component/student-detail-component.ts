import {
  Component,
  EventEmitter,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  effect,
  inject,
  Output,
  signal,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { StudentService } from '../services/student.service';
import {
  MASTER_CONFIG_DWN_TYPES,
  MasterConfigsDWN,
} from '../../../shared/services/master-configs-dwn';
import { LoaderService } from '../../../shared/services/loader.service';
import {
  StudentAdmissionRequestDto,
  StudentDocumentRequestDto,
  TransportDto,
} from '../../../models/student-admission.model';

interface DropdownOption {
  id: number | string;
  parentId?: number | string;
  name: string;
  description?: string;
}

interface RawMasterItem {
  id: number | string;
  parentId: number | string;
  name: string;
  type: string;
  description?: string;
}

interface AdmissionApiDocument {
  doc_id: number | string;
  doc_Code: string;
  doc_label: string;
  savedPath?: string;
  SavedPath?: string;
}

interface DocumentUploadItem {
  doc_id: number | string;
  doc_Code: string;
  doc_label: string;
  doc_File: string;
  savedPath?: string;
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
  admissionCategories: DropdownOption[];
  groups: DropdownOption[];
  streams: DropdownOption[];
  admClasses: DropdownOption[];
  sessClasses: DropdownOption[];
  allClasses: DropdownOption[];
  sections: DropdownOption[];
  allSections: DropdownOption[];
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
  AdmissionDocument: DropdownOption[];

}

type ProfileImageKey = 'student' | 'father' | 'mother' | 'guardian1' | 'guardian2';

interface ProfileImageState {
  file: File | null;
  previewUrl: string | null;
}

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-detail-component.html',
  styleUrls: ['./student-detail-component.scss'],
})
export class StudentDetailComponent implements OnInit, OnChanges, OnDestroy {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  @Input() studentData: any;
  studentForm: FormGroup;
  activeTab: string = 'Student';
  tabs = [
    { id: 'Student', label: 'Student', index: 0 },
    // { id: 'Academic', label: 'Academic', index: 1 },
    { id: 'Parents', label: "Parent's", index: 2 },
    { id: 'Transport', label: 'Transport', index: 3 },
    { id: 'Documents', label: 'Document Upload', index: 4 },
    { id: 'Other', label: 'Other', index: 5 },
    { id: 'Record', label: 'Record', index: 6 },
    { id: 'CategoryCertificate', label: 'Category Certificate', index: 7 },
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
    admissionCategories: [],
    groups: [],
    streams: [],  
    admClasses: [],
    sessClasses:[],
    allClasses: [],
    sections: [],
    allSections: [],
    concessions: [],
    feeGroups: [],
    qualifications: [],
    occupations: [],
    transportModes: [],
    pickDropOptions: [],
    transportAreas: [],
    transportStands: [],
    transportRoutes: [],
    transportDrivers: [],
    AdmissionDocument: [],
  });

  get branches(): DropdownOption[] {
    return this.masterData().branches;
  }
  get genders(): DropdownOption[] {
    return this.masterData().genders;
  }
  get bloodGroups(): DropdownOption[] {
    return this.masterData().bloodGroups;
  }
  get religions(): DropdownOption[] {
    return this.masterData().religions;
  }
  get castes(): DropdownOption[] {
    return this.masterData().castes;
  }
  get countries(): DropdownOption[] {
    return this.masterData().countries;
  }
  get states(): DropdownOption[] {
    return this.masterData().states;
  }
  get cities(): DropdownOption[] {
    return this.masterData().cities;
  }
  get categories(): DropdownOption[] {
    return this.masterData().categories;
  }
  get admissionCategories(): DropdownOption[] {
    return this.masterData().admissionCategories;
  }
  get groups(): DropdownOption[] {
    return this.masterData().groups;
  }
  get streams(): DropdownOption[] {
    return this.masterData().streams;
  }
  get allClasses(): DropdownOption[] {
    return this.masterData().allClasses;
  }
  get allSections(): DropdownOption[] {
    return this.masterData().allSections;
  }
  get concessions(): DropdownOption[] {
    return this.masterData().concessions;
  }
  get feeGroups(): DropdownOption[] {
    return this.masterData().feeGroups;
  }
  get qualifications(): DropdownOption[] {
    return this.masterData().qualifications;
  }
  get occupations(): DropdownOption[] {
    return this.masterData().occupations;
  }
  get transportModes(): DropdownOption[] {
    return this.masterData().transportModes;
  }
  get pickDropOptions(): DropdownOption[] {
    return this.masterData().pickDropOptions;
  }
  get transportAreas(): DropdownOption[] {
    return this.masterData().transportAreas;
  }
  get transportStands(): DropdownOption[] {
    return this.masterData().transportStands;
  }
  get transportRoutes(): DropdownOption[] {
    return this.masterData().transportRoutes;
  }
  get transportDrivers(): DropdownOption[] {
   
    return this.masterData().transportDrivers;
  }
  get admClasses(): DropdownOption[] {
    return this.masterData().admClasses;
  }
  get sessClasses(): DropdownOption[] {
    return this.masterData().sessClasses;
  }

  // getClassByAdmGroup() {
  //    const parentId = this.studentForm
  //   .get('adm_grp_id')
  //   ?.value;
  //   console.log('Parent ID:', parentId);
  //   this.masterData.set({
  //     ...this.masterData(),
  //     admClasses: this.masterData().allClasses.filter((option) => option.parentId ==parentId),
  //   });
  //   console.log('admClasses from Filtered  Classes:', this.masterData().allClasses.filter((option) => option.parentId == 2));
  // }

  
  transportmonthIdsList = [
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
    { label: 'Mar', monthId: 3 },
  ];

  documentTypes = signal<DocumentUploadItem[]>([]);

  private readonly selectedDocumentFiles: Record<number, File> = {};
  private readonly documentPreviewUrls: Record<number, string> = {};
  private readonly profileImageKeyToApiField: Record<ProfileImageKey, string> = {
    student: 'StudentImage',
    father: 'FatherImage',
    mother: 'MotherImage',
    guardian1: 'Guardian1Image',
    guardian2: 'Guardian2Image',
  };
  private readonly profileImageKeyToStudentPathField: Record<ProfileImageKey, string> = {
    student: 'sess_student_image_path',
    father: 'sess_father_image_path',
    mother: 'sess_mother_image_path',
    guardian1: 'sess_g1_image_path',
    guardian2: 'sess_g2_image_path',
  };
  private readonly uploadedImagesBaseUrl = 'http://localhost:50684/UploadedDocs/Images/';

  profileImages: Record<ProfileImageKey, ProfileImageState> = {
    student: { file: null, previewUrl: null },
    father: { file: null, previewUrl: null },
    mother: { file: null, previewUrl: null },
    guardian1: { file: null, previewUrl: null },
    guardian2: { file: null, previewUrl: null },
  };

  private readonly studentService = inject(StudentService);
  private readonly masterConfigsDWN = inject(MasterConfigsDWN);
  private readonly loaderService = inject(LoaderService);
  private readonly masterConfigDwnTypes = MASTER_CONFIG_DWN_TYPES;
  private isDropdownLoadPending = false;
  private Admission: Record<string, unknown> | null = null;
  private lastRequestedAdmId: number | null = null;
  constructor(private fb: FormBuilder) {
    this.studentForm = this.fb.group({
      Student: this.createStudentGroup(),
      // Academic: this.createAcademicGroup(),
      Parents: this.createParentGroup(),
      Transport: this.createTransportGroup(),
      Documents: this.createDocumentUploadGroup(),
      Other: this.fb.group({}),
      Record: this.fb.group({}),
      CategoryCertificate: this.fb.group({}),
    });

    effect(() => {
      const docs = this.documentTypes();
      this.studentForm.setControl('Documents', this.createDocumentUploadGroup(docs));
    });

    effect(() => {
      const dwnList = this.masterConfigsDWN.masterConfigDwnList();
      if (!this.isDropdownLoadPending || !Array.isArray(dwnList)) {
        return;
      }      
      this.bindMasterDropdowns(dwnList);      
    });
    effect(() => {
      this.Admission = this.studentService.Admission();
      if (this.Admission) {
        this.patchFormFromAdmissionResponse(this.Admission);
      }
    });
  }

  ngOnInit(): void {
    this.isDropdownLoadPending = true;
    this.loaderService.show();
    this.masterConfigsDWN.fetchMasterConfigDWN(this.masterConfigDwnTypes.toString());
    this.studentForm.controls['Student'].get('adm_grp_id')?.valueChanges.subscribe(parentId => {
      this.masterData.update(data => ({
        ...data,
        admClasses: this.filterClassesByGroupId(parentId, data.allClasses),
      }));
    });

    this.studentForm.controls['Student'].get('sess_grp_id')?.valueChanges.subscribe(parentId => {
      this.masterData.update(data => ({
        ...data,
        sessClasses: this.filterClassesByGroupId(parentId, data.allClasses),
      }));
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    const studentChange = changes['studentData'];
    if (!studentChange?.currentValue) {
      return;
    }

    if (this.isFullAdmissionPayload(studentChange.currentValue)) {
      this.studentService.Admission.set(studentChange.currentValue as Record<string, unknown>);
      return;
    }

    const admId = this.resolveAdmissionId(studentChange.currentValue);
    if (admId !== null && admId !== undefined && this.lastRequestedAdmId !== admId) {
      this.lastRequestedAdmId = admId;
      this.studentService.studentformview(admId);
    }
  }

  ngOnDestroy(): void {
    this.clearDocumentPreviews();
    this.clearProfileImages();
  }

  private bindMasterDropdowns(rawMasterItems: RawMasterItem[]): void {
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
        admissionCategories: [...current.admissionCategories],
        groups: [...current.groups],
        streams: [...current.streams],
        admClasses: [...current.admClasses],
        sessClasses: [...current.sessClasses],
        allClasses: [...current.allClasses],
        sections: [...current.sections],
        allSections: [...current.allSections],
        concessions: [...current.concessions],
        feeGroups: [...current.feeGroups],
        qualifications: [...current.qualifications],
        occupations: [...current.occupations],
        transportModes: [...current.transportModes],
        pickDropOptions: [...current.pickDropOptions],
        transportAreas: [...current.transportAreas],
        transportStands: [...current.transportStands],
        transportRoutes: [...current.transportRoutes],
        transportDrivers: [...current.transportDrivers],
        AdmissionDocument: [...current.AdmissionDocument],
      };
      for (const record of rawMasterItems) {

        const type =record.type.trim().toLowerCase();       
        
        if (!type) {
          continue;
        }

        const option: DropdownOption = {
          id: record.id,
          name: record.name,
          parentId: record.parentId,
          description: record.description ?? '',
        };

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
          case 'category':
            next.categories.push(option);
            break;
          case 'admissioncategory':
            next.admissionCategories.push(option);
            break;
          case 'examclassgroup':
            next.groups.push(option);
            break;
          case 'classgroup':
            next.groups.push(option);
            break;
          case 'class':
            next.allClasses.push(option);
            break;
          case 'stream':
            next.streams.push(option);
            break;
          case 'section':
            next.allSections.push(option);
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
          case 'admissiondocument':            
            next.AdmissionDocument.push(option);
            break;
          case 'transportmodes':
            next.transportModes.push(option);
            break;
          case 'transportdrivers':
            next.transportDrivers.push(option);
            break;
          default:
            break;
        }
   
      }

      this.masterData.set(next);
      this.updateClassDropdownsFromSelection();
   
    } finally {
      this.isDropdownLoadPending = false;
      this.loaderService.hide();
      const docs = this.masterData().AdmissionDocument.map(doc => ({
        doc_id: doc.id,
        doc_Code: doc.name,
        doc_label: doc.description ?? '',
        doc_File: '',
        savedPath: '',
      }));
      this.documentTypes.set([...this.documentTypes(), ...docs]);     

      
    }
  }
  
  get docsArray(): FormArray {
    return this.studentForm.get('Documents') as FormArray;
  }

  get transportmonthIdsArray(): FormArray {
    return this.studentForm.get(['Transport', 'months']) as FormArray;
  }

  private normalizeId(value: unknown): string {
    return value === null || value === undefined ? '' : String(value);
  }

  private filterClassesByGroupId(groupId: unknown, allClasses: DropdownOption[]): DropdownOption[] {
    const normalizedGroupId = this.normalizeId(groupId);
    if (!normalizedGroupId) {
      return [];
    }

    return allClasses.filter((classItem) => this.normalizeId(classItem.parentId) === normalizedGroupId);
  }

  private updateClassDropdownsFromSelection(): void {
    const studentGroup = this.studentForm.controls['Student'];
    const admGroupId = studentGroup.get('adm_grp_id')?.value;
    const sessGroupId = studentGroup.get('sess_grp_id')?.value;

    this.masterData.update((data) => ({
      ...data,
      admClasses: this.filterClassesByGroupId(admGroupId, data.allClasses),
      sessClasses: this.filterClassesByGroupId(sessGroupId, data.allClasses),
    }));
  }

  private buildTransportMonthSelections(monthIds: string | null | undefined): boolean[] {
    const selectedIds = new Set(
      String(monthIds ?? '')
        .split(',')
        .map((value) => Number(value.trim()))
        .filter((value) => Number.isInteger(value)),
    );

    return this.transportmonthIdsList.map((month) => selectedIds.has(month.monthId));
  }

  private patchTransportData(transportData: Record<string, unknown> | null): void {
    if (!transportData) {
      return;
    }

    const months = this.buildTransportMonthSelections(
      typeof transportData['monthIds'] === 'string' ? transportData['monthIds'] as string : '',
    );

    this.studentForm.controls['Transport'].patchValue({
      ...transportData,
      months,
    });
  }

  private resolveAdmissionId(payload: Record<string, unknown> | null | undefined): number | null {
    if (!payload) {
      return null;
    }

    const topLevelId = payload['adm_id'];
    if (typeof topLevelId === 'number') {
      return topLevelId;
    }

    const student = payload['student'] as Record<string, unknown> | undefined;
    const nestedId = student?.['adm_id'];
    return typeof nestedId === 'number' ? nestedId : null;
  }

  private normalizeDateValue(value: unknown): unknown {
    if (typeof value !== 'string') {
      return value;
    }

    if (!value.includes('T')) {
      return value;
    }

    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) {
      return value;
    }

    return parsedDate.toISOString().slice(0, 10);
  }

  private buildUploadedImageUrl(pathValue: unknown): string | null {
    if (typeof pathValue !== 'string') {
      return null;
    }

    const trimmedPath = pathValue.trim();
    if (!trimmedPath) {
      return null;
    }

    if (/^https?:\/\//i.test(trimmedPath)) {
      return trimmedPath;
    }

    const normalizedPath = trimmedPath.replace(/\\/g, '/');
    const marker = '/UploadedDocs/Images/';
    const markerIndex = normalizedPath.lastIndexOf(marker);

    if (markerIndex >= 0) {
      const fileName = normalizedPath.slice(markerIndex + marker.length);
      return `${this.uploadedImagesBaseUrl}${fileName}`;
    }

    const lastSlashIndex = normalizedPath.lastIndexOf('/');
    const fileName = lastSlashIndex >= 0 ? normalizedPath.slice(lastSlashIndex + 1) : normalizedPath;
    return fileName ? `${this.uploadedImagesBaseUrl}${fileName}` : null;
  }

  private isImageFileName(filePathOrName: string): boolean {
    const normalized = filePathOrName.toLowerCase();
    return normalized.endsWith('.png') || normalized.endsWith('.jpg') || normalized.endsWith('.jpeg') || normalized.endsWith('.webp') || normalized.endsWith('.gif');
  }

  private setDocumentPreviewFromSavedPath(index: number, savedPath: string): void {
    if (!savedPath || !this.isImageFileName(savedPath)) {
      delete this.documentPreviewUrls[index];
      return;
    }

    const previewUrl = this.buildUploadedImageUrl(savedPath);
    if (previewUrl) {
      this.documentPreviewUrls[index] = previewUrl;
    }
  }

  private setDocumentPreviewFromFile(index: number, file: File): void {
    const currentPreview = this.documentPreviewUrls[index];
    if (currentPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(currentPreview);
    }

    if (!file.type.startsWith('image/')) {
      delete this.documentPreviewUrls[index];
      return;
    }

    this.documentPreviewUrls[index] = URL.createObjectURL(file);
  }

  private clearDocumentPreviews(): void {
    Object.values(this.documentPreviewUrls).forEach((preview) => {
      if (preview?.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    });

    Object.keys(this.documentPreviewUrls).forEach((key) => {
      delete this.documentPreviewUrls[Number(key)];
    });
  }

  private setProfileImagePreviews(studentPayload: Record<string, unknown>): void {
    (Object.keys(this.profileImageKeyToStudentPathField) as ProfileImageKey[]).forEach((key) => {
      const pathField = this.profileImageKeyToStudentPathField[key];
      const previewUrl = this.buildUploadedImageUrl(studentPayload[pathField]);

      if (!previewUrl) {
        return;
      }

      const currentPreview = this.profileImages[key].previewUrl;
      if (currentPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(currentPreview);
      }

      this.profileImages[key] = {
        file: null,
        previewUrl,
      };
    });
  }

  private normalizeStudentPayloadDates(studentPayload: Record<string, unknown>): Record<string, unknown> {
    return {
      ...studentPayload,
      adm_date: this.normalizeDateValue(studentPayload['adm_date']),
      adm_doj: this.normalizeDateValue(studentPayload['adm_doj']),
      adm_dob: this.normalizeDateValue(studentPayload['adm_dob']),
    };
  }

  private patchDocumentsFromApi(documents: AdmissionApiDocument[]): void {
    const docs = documents.map((doc) => ({
      doc_id: doc.doc_id,
      doc_Code: doc.doc_Code,
      doc_label: doc.doc_label,
      doc_File: '',
      savedPath: doc.savedPath ?? doc.SavedPath ?? '',
    }));

    this.studentForm.setControl('Documents', this.createDocumentUploadGroup(docs));
    this.clearDocumentPreviews();
    docs.forEach((doc, index) => {
      if (doc.savedPath) {
        this.setDocumentPreviewFromSavedPath(index, doc.savedPath);
      }
    });
  }

  private patchFormFromAdmissionResponse(payload: unknown): void {
    if (!payload || typeof payload !== 'object') {
      return;
    }
  
    console.log('Patching form with payload:', payload);
    const data = payload as Record<string, unknown>;
    const studentPayloadRaw = (data['student'] ?? data['Student'] ?? data) as Record<string, unknown>;
    const parentsPayload = (data['parents'] ?? data['Parents'] ?? {}) as Record<string, unknown>;
    const transportPayload = (data['transport'] ?? data['Transport'] ?? null) as Record<string, unknown> | null;
    const documentsPayload = (data['documents'] ?? data['docs'] ?? data['Documents'] ?? data['Docs'] ?? []) as AdmissionApiDocument[];

    const studentPayload = this.normalizeStudentPayloadDates(studentPayloadRaw);

    this.studentForm.controls['Student'].patchValue(studentPayload);
    this.studentForm.controls['Parents'].patchValue(parentsPayload);
    this.setProfileImagePreviews(studentPayloadRaw);
    this.patchTransportData(transportPayload);

    if (Array.isArray(documentsPayload) && documentsPayload.length > 0) {
      this.patchDocumentsFromApi(documentsPayload);
    }

    this.updateClassDropdownsFromSelection();
  }

  private isFullAdmissionPayload(payload: unknown): boolean {
    if (!payload || typeof payload !== 'object') {
      return false;
    }

    const data = payload as Record<string, unknown>;
    return 'student' in data || 'Student' in data || 'documents' in data || 'Documents' in data;
  }

    private getCurrentDateString(): string {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

  createStudentGroup(): FormGroup {
      const currentDate = this.getCurrentDateString();

    return this.fb.group({
        adm_branch_Id: [null],
        adm_no: ['', Validators.required],
        adm_date: [currentDate],
        adm_doj: [currentDate],
        sess_stud_first_name: ['', Validators.required],
        sess_stud_last_name: [''],
        adm_ssr_no: [''],
        adm_dob: [''],
        adm_gender_id: [null],
        adm_blood_grp_id: [null],
        sess_religion_id: [null],
        sess_caste_id: [null],
        sess_stud_mobile_no: [''],
        sess_student_aadhar_no: [''],
        sess_stud_email_ddress: [''],

      // Address Info
        sess_country_id: [null],
        sess_state_id: [null],
        sess_city_id: [null],
        sess_address: [''],
        sess_pin_code: [''],

      // Permanent Address Info
        sess_permanent_country_id: [null],
        sess_permanent_state_id: [null],
        sess_permanent_city_id: [null],
        sess_permanent_address: [''],
        sess_permanent_pin_code: [''],

      // Admission Details
        adm_category_id: [null],
        adm_grp_id: [null],
        adm_stream_id: [null],
        adm_class_id: [null],
        adm_section_id: [null],
        adm_rollno: [''],
        adm_concession_id: [null],
        adm_fee_group_id: [null],

      // Session Details
        sess_std_category_id: [null],
        sess_category_id: [null],
        sess_grp_id: [null],
        sess_stream_id: [null],
        sess_class_id: [null],
        sess_section_id: [null],
        sess_roll_no: [''],
        sess_concession_id: [null],
        sess_fee_group_id: [null],
    });
  }

  createParentGroup(): FormGroup {
    return this.fb.group({
      // Father Details
      sess_father_name: [''],
      sess_father_mobile_no: [''],
      sess_father_qualification_id: [null],
      sess_father_occupation_id: [null],
      sess_father_designation_id: [''],
      sess_father_annual_income: [''],
      sess_father_office_address: [''],
      sess_is_fse: [false],

      // Mother Details
      sess_mother_name: [''],
      sess_mother_mobile_no: [''],
      sess_mother_qualification_id: [null],
      sess_mother_occupation_id: [null],
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

      sess_otherDetails: [''],
    });
  }

  createAcademicGroup(): FormGroup {
    return this.fb.group({});
  }

  createTransportGroup(): FormGroup {
    return this.fb.group({
      transportModeId: [null],
      pickAreaId: [null],
      pickDropId: [null],
      pickStandId: [null],
      pickRouteId: [null],
      pickDriverId: [null],
      dropAreaId: [null],
      dropStandId: [null],
      dropRouteId: [null],
      dropDriverId: [null],
      monthIds: [''],
      months: this.fb.array(
        this.transportmonthIdsList.map(() => false),
      ),
    });
  }

  createDocumentUploadGroup(docs: DocumentUploadItem[] = this.documentTypes()): FormArray {
    const controls = docs.map((doc) => {
      return this.fb.group({
        doc_id: [doc.doc_id],
        doc_Code: [doc.doc_Code],
        doc_label: [doc.doc_label],
        doc_File: [null],
        savedPath: [doc.savedPath ?? ''],
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
      this.setDocumentPreviewFromFile(index, file);
      this.selectedDocumentFiles[index] = file;
      const docArray = this.docsArray;
      const docGroup = docArray.at(index) as FormGroup;
      docGroup.patchValue({
        doc_File: file,
        savedPath: '',
      });
    }
  }

  onProfileImageSelected(event: Event, key: ProfileImageKey): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0] ?? null;
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      target.value = '';
      return;
    }

    const currentPreview = this.profileImages[key].previewUrl;
    if (currentPreview) {
      URL.revokeObjectURL(currentPreview);
    }

    this.profileImages[key] = {
      file,
      previewUrl: URL.createObjectURL(file),
    };
  }

  getProfileImagePreview(key: ProfileImageKey): string | null {
    return this.profileImages[key].previewUrl;
  }

  getProfileImageFileName(key: ProfileImageKey): string {
    return this.profileImages[key].file?.name ?? '';
  }

  getDocumentPreview(index: number): string | null {
    return this.documentPreviewUrls[index] ?? null;
  }

  getDocumentDisplayName(index: number): string {
    const docGroup = this.docsArray.at(index) as FormGroup | null;
    if (!docGroup) {
      return '';
    }

    const fileValue = docGroup.get('doc_File')?.value;
    if (this.isFileLike(fileValue)) {
      return fileValue.name;
    }

    const savedPath = docGroup.get('savedPath')?.value;
    if (typeof savedPath !== 'string' || !savedPath.trim()) {
      return '';
    }

    const normalizedPath = savedPath.replace(/\\/g, '/');
    const lastSlashIndex = normalizedPath.lastIndexOf('/');
    return lastSlashIndex >= 0 ? normalizedPath.slice(lastSlashIndex + 1) : normalizedPath;
  }

  private appendProfileImages(formData: FormData): void {
    (Object.keys(this.profileImageKeyToApiField) as ProfileImageKey[]).forEach((key) => {
      const imageFile = this.profileImages[key].file;
      if (!imageFile) {
        return;
      }

      formData.append(this.profileImageKeyToApiField[key], imageFile, imageFile.name);
    });
  }

  private applyProfileImagePaths(studentPayload: Record<string, unknown>): void {
    (Object.keys(this.profileImageKeyToStudentPathField) as ProfileImageKey[]).forEach((key) => {
      const pathField = this.profileImageKeyToStudentPathField[key];
      const imageFile = this.profileImages[key].file;
      const existing = studentPayload[pathField];

      if (imageFile) {
        studentPayload[pathField] = imageFile.name;
        return;
      }

      if (existing === null || existing === undefined || existing === '') {
        studentPayload[pathField] = 'N/A';
      }
    });
  }

  private clearProfileImages(): void {
    (Object.keys(this.profileImages) as ProfileImageKey[]).forEach((key) => {
      const preview = this.profileImages[key].previewUrl;
      if (preview?.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }

      this.profileImages[key] = { file: null, previewUrl: null };
    });
  }

  private toFormData(model: unknown): FormData {
    const formData = new FormData();
    this.appendToFormData(formData, model);
    return formData;
  }

  private isFileLike(value: unknown): value is File {
    return !!value && typeof value === 'object' && 'name' in (value as Record<string, unknown>);
  }

  private appendUploadedDocuments(
    formData: FormData,
    documents: StudentDocumentRequestDto[],
  ): void {
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

  onSubmit(): void {
    if (this.studentForm.valid) {
      const formValue = this.studentForm.getRawValue();
      const studentRaw = formValue.Student ?? {};
      //const academicRaw = formValue.Academic ?? {};
      const parentsRaw = formValue.Parents ?? {};

      const studentPayload = { ...studentRaw };
      this.applyProfileImagePaths(studentPayload as Record<string, unknown>);

      // const academicPayload = {
      //   adm_rollno: 'aa122',
      //   sess_roll_no: 'dsew33'
      // };

      const parentsPayload = { ...parentsRaw };

      const transportRaw = formValue.Transport ?? {};
      const selectedMonthIds = (transportRaw.months as boolean[])
        .map((isSelected: boolean, index: number) =>
          isSelected ? this.transportmonthIdsList[index].monthId : null,
        )
        .filter((id: number | null): id is number => id !== null);
      const { months, ...transportPayload } = transportRaw;
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
            SavedPath: file.name,
          };
        });

      const model: StudentAdmissionRequestDto = {
        Student: studentPayload,
        // Academic: academicPayload,
        Parents: parentsPayload,
        Transport: {
          ...transportPayload,
          monthIds: selectedMonthIds.join(','),
        } as TransportDto,
        Documents: [],
        Docs: [],
        Other: formValue.Other,
        Record: formValue.Record,
        CategoryCertificate: formValue.CategoryCertificate,
      };

      const formData = this.toFormData(model);
      this.appendUploadedDocuments(formData, uploadDocuments);
      this.appendProfileImages(formData);

      this.studentService.saveStudent(formData).subscribe(
        (response) => {
          alert('Student saved successfully');
          // this.save.emit(model);
          // Object.keys(this.selectedDocumentFiles).forEach(
          //   (key) => delete this.selectedDocumentFiles[Number(key)],
          // );
          // this.clearProfileImages();
          // this.close.emit();
        },
        (error) => {
          if (error?.error?.errors && typeof error.error.errors === 'object') {
            let errorMessage = 'Validation failed:\n';
            for (const key in error.error.errors) {
              errorMessage += `${key}: ${error.error.errors[key].join(', ')}\n`;
            }
            alert(errorMessage);
            console.log('Validation errors:', errorMessage);
            console.error('Validation errors:', error.error.errors);
            console.log('Validation log-errors:', error.error.errors);
          } else {
            const details =
              typeof error?.error === 'string'
                ? error.error
                : JSON.stringify(error?.error ?? error, null, 2);
            alert('Save failed:\n' + details);
            console.error('Save failed response:', error);
          }
        },
      );
    } else {
  const invalidControls: Record<string, any> = {};

  const findInvalidControls = (group: any, path = ''): void => {
    Object.keys(group.controls || {}).forEach((key) => {
      const control = group.get(key);
      const currentPath = path ? `${path}.${key}` : key;

      if (control instanceof FormGroup || control instanceof FormArray) {
        findInvalidControls(control, currentPath);
        return;
      }

      if (control && control.invalid) {
        invalidControls[currentPath] = control.errors;
      }
    });
  };

  findInvalidControls(this.studentForm);

  console.log('Form valid status:', this.studentForm.valid);
  console.log('Form errors:', this.studentForm.errors);
  console.log('Invalid controls:', invalidControls);

  // Useful direct checks for the student tab:
  console.log('Student form errors:', this.studentForm.get('Student')?.errors);
  console.log('adm_no errors:', this.studentForm.get('Student.adm_no')?.errors);
  console.log('first name errors:', this.studentForm.get('Student.sess_stud_first_name')?.errors);

  this.studentForm.markAllAsTouched();
}
  }

  onCancel() {
    Object.keys(this.selectedDocumentFiles).forEach(
      (key) => delete this.selectedDocumentFiles[Number(key)],
    );
    this.clearDocumentPreviews();
    this.clearProfileImages();
    this.close.emit();
  }
}
