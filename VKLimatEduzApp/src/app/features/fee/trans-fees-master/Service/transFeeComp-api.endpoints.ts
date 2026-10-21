import { environment } from '../../../../../environments/environment';

const transFeeCompBase = `${environment.apiUrl}FeeMaster/TransFeeComponent`;

export const TransFeeCompApiEndpoints = {
  getAll: `${transFeeCompBase}/GetAll`,
  byId: (id: number) => `${transFeeCompBase}/Get/${id}`,
  create: transFeeCompBase,
  update: transFeeCompBase
} as const;
