import { environment } from '../../../../../environments/environment';

const feeConcessionBase = `${environment.apiUrl}FeeMaster/FeeConcession`;

export const FeeConcessionApiEndpoints = {
  getAll: `${feeConcessionBase}/GetAll`,
  byId: (id: number) => `${feeConcessionBase}/Get/${id}`,
  create: feeConcessionBase,
  update: feeConcessionBase
} as const;
