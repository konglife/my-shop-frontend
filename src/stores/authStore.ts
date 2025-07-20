import { defineStore } from 'pinia';
import apiClient from '@/services/apiClient';
import router from '@/router';

interface User {
  id: number;
  username: string;
  email: string;
  // Add other user properties as needed
}

interface AuthState {
  user: User | null;
  jwt: string | null;
  returnUrl: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    jwt: null,
    returnUrl: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.jwt,
  },
  actions: {
    async login(identifier: string, password: string) {
      try {
        const response = await apiClient.post('/api/auth/local', {
          identifier,
          password,
        });
        const { jwt, user } = response.data;
        this.jwt = jwt;
        this.user = user;

        // Redirect to the originally requested page or to the dashboard
        router.push(this.returnUrl || '/');
        this.returnUrl = null;
      } catch (error) {
        console.error('Login failed:', error);
        // You might want to throw the error to handle it in the component
        throw error;
      }
    },
    logout() {
      this.user = null;
      this.jwt = null;
      this.returnUrl = null;
      router.push('/login');
    },
  },
  persist: true, // Enable persistence for this store
});
