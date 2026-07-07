import { environment } from '../../../environments/environment';

const feeBase = `${environment.apiUrl}Fee`;

export const FeeApiEndpoints = {
  base: feeBase
} as const;