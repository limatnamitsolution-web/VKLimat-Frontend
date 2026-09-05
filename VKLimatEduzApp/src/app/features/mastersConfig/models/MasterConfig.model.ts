export interface MasterConfig {
  id: number;
  configValue: string;
  configKey: string;
  description: string;
  configuration: string;
  sortOrder?: number;
  isActive?: boolean;
}