import { create } from 'zustand';
import type { User } from '../types/api.types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Initialize from LocalStorage
  const storedToken = localStorage.getItem('smartseason_token');
  const storedUser = localStorage.getItem('smartseason_user');
  let initialUser = null;

  if (storedUser) {
    try {
      initialUser = JSON.parse(storedUser);
    } catch (e) {
      console.error('Failed to parse stored user', e);
    }
  }

  return {
    user: initialUser,
    token: storedToken,
    isAuthenticated: !!storedToken && !!initialUser,
    
    setAuth: (user: User, token: string) => {
      localStorage.setItem('smartseason_token', token);
      localStorage.setItem('smartseason_user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true });
    },
    
    logout: () => {
      localStorage.removeItem('smartseason_token');
      localStorage.removeItem('smartseason_user');
      set({ user: null, token: null, isAuthenticated: false });
    },
  };
});

// Sync logout across tabs and Axios interceptors
window.addEventListener('auth-unauthorized', () => {
  useAuthStore.getState().logout();
});
