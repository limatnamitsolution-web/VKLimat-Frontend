import { environment } from '../../../../../environments/environment';

const transFeeConcessionBase = `${environment.apiUrl}FeeMaster/TransFeeConcession`;

export const TransFeeConcessionApiEndpoints = {
  getAll: `${transFeeConcessionBase}/GetAll`,
  byId: (id: number) => `${transFeeConcessionBase}/Get/${id}`,
  create: transFeeConcessionBase,
  update: transFeeConcessionBase
} as const;
