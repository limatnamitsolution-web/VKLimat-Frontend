export interface FinancialConfig {
  ID: number | string;
  BranchID: number | string;
  FY: string;
  FeeType: string;
  ReAdmCharges: number;
  RegxCharges: number;
  CqueBonceFine: number | null;
  IsPaymentOnline: boolean;
  LFFeeType: string | null;
  SetFeeFst: string | null;
  SetFeeMid: number | null;
  SetFeeLst: string | null;
  LFFeeFrom: number | null;
  LFFeeFixed: number | null;
  LFFeePerDay: number | null;
  LFFeeDays: number | null;
  LFFeePerMonth: number | null;
  LFFeeMonths: number | null;
  TranMode?: string | null;
  TranType: string | null;
  TranFeeType: string | null;
  TranFxdFullPrc?: number | null;
  TransFxdPkpPrc?: number | null;
  TransFxdDrpPrc?: number | null;
  IsActive: boolean;
}
