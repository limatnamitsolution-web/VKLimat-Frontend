import { environment } from '../../../../../environments/environment';

const feePlanBase = `${environment.apiUrl}FeeMaster/FeePlan`;

export const FeePlanApiEndpoints = {
  getAll: `${feePlanBase}/GetAll`,
  byId: (id: number) => `${feePlanBase}/Get/${id}`,
  create: feePlanBase,
  update: feePlanBase
} as const;
