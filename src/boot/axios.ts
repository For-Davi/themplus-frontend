import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from 'src/stores/auth-store';
import { storeToRefs } from 'pinia';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

const api = axios.create({ baseURL: process.env.VITE_API_BASE_URL });
console.log('process.env.VITE_API_BASE_URL ', process.env.VITE_API_BASE_URL);

export default boot(({ app }) => {
  const authStore = useAuthStore();
  const { token: tokenValue } = storeToRefs(authStore);

  api.interceptors.request.use(
    (config) => {
      const token = tokenValue.value;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
