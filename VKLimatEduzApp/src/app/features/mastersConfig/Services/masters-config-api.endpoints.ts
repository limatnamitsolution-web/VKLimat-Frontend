import { environment } from '../../../../environments/environment';

const mastersConfigBase = `${environment.apiUrl}Master/MasterConfig`;

export const MastersConfigApiEndpoints = {
  list: `${mastersConfigBase}/GetAll`,
  byId: (id: number | string) => `${mastersConfigBase}/Get/${id}`,
  create: mastersConfigBase,
  update: mastersConfigBase
} as const;