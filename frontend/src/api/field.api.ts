import api from './axios';
import type { Field, FieldStage } from '../types/api.types';

export interface CreateFieldInput {
  name: string;
  cropType: string;
  plantingDate: string;
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
  }
};
