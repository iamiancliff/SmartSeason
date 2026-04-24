import api from './axios';
import type { User } from '../types/api.types';

export const userApi = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },
  getAgents: async (): Promise<User[]> => {
    const users = await userApi.getUsers();
    return users.filter(user => user.role === 'AGENT');
  },
  deleteAgent: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  }
};
