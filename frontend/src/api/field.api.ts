import api from './axios';
import type { Field, FieldStage, FieldUpdate } from '../types/api.types';

export interface CreateFieldInput {
  name: string;
  cropType: string;
  location: string;
  plantingDate: string;
}

export interface UpdateFieldInput {
  name?: string;
  cropType?: string;
  location?: string;
  plantingDate?: string;
  currentStage?: FieldStage;
}

export interface AddUpdateInput {
  stage: FieldStage;
  note?: string;
}

export const fieldApi = {
  getFields: async (): Promise<Field[]> => {
    const response = await api.get<Field[]>('/fields');
    return response.data;
  },

  getField: async (id: string): Promise<Field> => {
    const response = await api.get<Field>(`/fields/${id}`);
    return response.data;
  },

  createField: async (data: CreateFieldInput): Promise<Field> => {
    const response = await api.post<Field>('/fields', data);
    return response.data;
  },

  assignAgent: async (fieldId: string, agentId: string): Promise<Field> => {
    const response = await api.post<Field>(`/fields/${fieldId}/assign`, { agentId });
    return response.data;
  },

  addUpdate: async (fieldId: string, data: AddUpdateInput): Promise<Field> => {
    const response = await api.post<Field>(`/fields/${fieldId}/updates`, data);
    return response.data;
  },

  updateField: async (id: string, data: UpdateFieldInput): Promise<Field> => {
    const response = await api.put<Field>(`/fields/${id}`, data);
    return response.data;
  },

  deleteField: async (id: string): Promise<void> => {
    await api.delete(`/fields/${id}`);
  },

  getFieldUpdates: async (fieldId: string): Promise<FieldUpdate[]> => {
    const response = await api.get<FieldUpdate[]>(`/fields/${fieldId}/updates`);
    return response.data;
  }
};
