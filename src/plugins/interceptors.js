import axios from 'axios';
import store from '@/store';
import router from '@/router';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  function (config) {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },

  function (error) {
    const originalRequest = error.config;

    if (error.response.status === 401) {
      return axiosInstance
        .post('/api/members/checks/refresh-token', {
          withCredentials: true,
        })
        .then((result) => {
          store.dispatch('/api/members/login', { access_token: result.data });

          return axiosInstance(originalRequest);
        })
        .catch(() => {
          store.dispatch('/api/members/logout');
          if (router.currentRoute.path !== '/') {
            router.push('/');
          }
        });
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
