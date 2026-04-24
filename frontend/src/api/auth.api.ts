import api from './axios';
import type { AuthResponse, User } from '../types/api.types';

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (name: string, email: string, password: string, location?: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', { name, email, password, location });
    return response.data;
  },
  
  getMe: async (): Promise<{ user: User }> => {
    const response = await api.get<{ user: User }>('/auth/me');
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
    const response = await api.put<{ message: string }>('/auth/password', { currentPassword, newPassword });
    return response.data;
  },

  uploadPhoto: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append('photo', file);
    const response = await api.post<User>('/auth/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
