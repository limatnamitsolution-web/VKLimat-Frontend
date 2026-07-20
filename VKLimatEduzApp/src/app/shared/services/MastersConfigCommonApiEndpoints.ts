import { environment } from '../../../environments/environment';
const mastersConfigDwnBase = `${environment.apiUrl}Master/MasterConfig`;

export const MastersConfigCommonApiEndpoints = {
  DwnAll: `${mastersConfigDwnBase}/GetAllDWN`,
//   byId: (id: number | string) => `${mastersConfigBase}/Get/${id}`,
//   create: mastersConfigBase,
//   update: mastersConfigBase
} as const;