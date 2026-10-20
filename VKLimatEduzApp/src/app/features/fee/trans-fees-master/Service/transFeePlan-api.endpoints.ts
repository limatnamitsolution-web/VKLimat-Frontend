import { environment } from '../../../../../environments/environment';

const transFeePlanBase = `${environment.apiUrl}FeeMaster/TransFeePlan`;

export const TransFeePlanApiEndpoints = {
  getAll: `${transFeePlanBase}/GetAll`,
  byId: (id: number) => `${transFeePlanBase}/Get/${id}`,
  create: transFeePlanBase,
  update: transFeePlanBase
} as const;
