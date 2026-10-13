import { environment } from '../../../../environments/environment';

const financialConfigBase = `${environment.apiUrl}Master/FinancialConfig`;

export const FinancialConfigApiEndpoints = {
  save: `${financialConfigBase}/save-financial-config`,
  update: `${financialConfigBase}/update-financial-config`,
  list: `${financialConfigBase}/financial-configs`,
  byId: (id: number | string) => `${financialConfigBase}/financial-config/${id}`
} as const;
