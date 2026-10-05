import { environment } from '../../../../../environments/environment';

const feeCompBase = `${environment.apiUrl}FeeMaster/FeeComponent`;

export const FeeCompApiEndpoints = {
  getAll: `${feeCompBase}/GetAll`,
  byId: (id: number) => `${feeCompBase}/Get/${id}`,
  create: feeCompBase,
  update: feeCompBase
} as const;
