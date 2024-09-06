import axios from 'axios';
import store from '@/stores';
import router from '@/router';

// 인스턴스 생성
const axiosInstance = axios.create({
  // baseURL: 'https://move-to-move.online', // 나중 API URL
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 추가
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

// 응답 인터셉터 추가
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
