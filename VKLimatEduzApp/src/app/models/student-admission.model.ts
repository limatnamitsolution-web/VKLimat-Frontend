export interface StudentDetailsDto {
  adm_branch_Id?: number | string | null;
  adm_no?: string;
  adm_date?: string | null;
  adm_doj?: string | null;
  sess_stud_first_name?: string;
  sess_stud_last_name?: string;
  adm_ssr_no?: string;
  adm_dob?: string | null;
  adm_gender_id?: number | string | null;
  adm_blood_grp_id?: number | string | null;
  sess_religion_id?: number | string | null;
  sess_caste_id?: number | string | null;
  adm_stud_mobile_no?: string;
  sess_student_aadhar_no?: string;
  adm_stud_email_ddress?: string;
  sess_country_id?: number | string | null;
  sess_state_id?: number | string | null;
  sess_city_id?: number | string | null;
  sess_address?: string;
  sess_pin_code?: string;
  sess_permanent_country_id?: number | string | null;
  sess_permanent_state_id?: number | string | null;
  sess_permanent_city_id?: number | string | null;
  sess_permanent_address?: string;
  sess_permanent_pin_code?: string;
}

export interface AcademicDto {
  adm_cat_id?: number | string | null;
  adm_grp_id?: number | string | null;
  adm_stream_id?: number | string | null;
  adm_class_id?: number | string | null;
  adm_section_id?: number | string | null;
  adm_rollno?: string;
  adm_concession_id?: number | string | null;
  adm_fee_group_id?: number | string | null;
  sess_cat_id?: number | string | null;
  sess_grp_id?: number | string | null;
  sess_stream_id?: number | string | null;
  sess_class_id?: number | string | null;
  sess_section_id?: number | string | null;
  sess_roll_no?: string;
  sess_concession_id?: number | string | null;
  sess_fee_group_id?: number | string | null;
}

export interface ParentDto {
  sess_father_name?: string;
  sess_father_mobile_no?: string;
  sess_father_qualification_id?: number | string | null;
  sess_father_occupation_id?: number | string | null;
  sess_father_designation_id?: string;
  sess_father_annual_income?: string;
  sess_father_office_address?: string;
  sess_is_fse?: boolean;
  sess_mother_name?: string;
  sess_mother_mobile_no?: string;
  sess_mother_qualification_id?: number | string | null;
  sess_mother_occupation_id?: number | string | null;
  sess_mother_designation_id?: string;
  sess_mother_annual_income?: string;
  sess_mother_office_address?: string;
  sess_is_mse?: boolean;
  sess_g1_name?: string;
  sess_g1_mobile_no?: string;
  sess_g1_address?: string;
  sess_g2_name?: string;
  sess_g2_mobile_no?: string;
  sess_g2_address?: string;
  otherDetails?: string;
}

export interface TransportDto {
  transportMode?: number | string | null;
  pickArea?: number | string | null;
  pickDrop?: number | string | null;
  pickStand?: number | string | null;
  pickRoute?: number | string | null;
  pickDriver?: number | string | null;
  dropArea?: number | string | null;
  dropStand?: number | string | null;
  dropRoute?: number | string | null;
  dropDriver?: number | string | null;
  months: number[];
}

export interface StudentDocumentRequestDto {
  doc_id: number;
  doc_Code: string;
  doc_label: string;
  doc_File: File | null;
  SavedPath?: string;
}

export interface StudentAdmissionRequestDto {
  Student: StudentDetailsDto;
  Academic: AcademicDto;
  Parents: ParentDto;
  Transport: TransportDto;
  Documents: StudentDocumentRequestDto[];
  Docs?: StudentDocumentRequestDto[];
  Other?: Record<string, unknown>;
  Record?: Record<string, unknown>;
  CategoryCertificate?: Record<string, unknown>;
}
