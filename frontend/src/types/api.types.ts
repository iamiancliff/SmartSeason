export interface User {
  id: string;
  name: string;
  email: string;
  location?: string;
  role: 'ADMIN' | 'AGENT';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export type FieldStage = 'PLANTED' | 'GROWING' | 'READY' | 'HARVESTED';

export type FieldStatus = 'ACTIVE' | 'AT_RISK' | 'COMPLETED';

export interface FieldUpdate {
  id: string;
  fieldId: string;
  agentId: string;
  stage: FieldStage;
  note?: string;
  createdAt: string;
  agent?: User;
}

export interface Field {
  id: string;
  name: string;
  cropType: string;
  plantingDate: string;
  currentStage: FieldStage;
  status: FieldStatus; // Synced with backend FieldService.computeStatus
  assignedToId?: string;
  assignedTo?: User;
  updates: FieldUpdate[];
  createdAt: string;
  updatedAt: string;
}
