import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    access_token: localStorage.getItem('accessToken') || '',
  }),

  actions: {
    login(payload) {
      this.access_token = payload.access_token;
      localStorage.setItem('accessToken', payload.access_token);
    },
    logout() {
      this.access_token = '';
      localStorage.removeItem('accessToken');
      localStorage.removeItem('selectedPage');
    },
  },

  getters: {
    getAccessToken: (state) => state.access_token,
  },
});
