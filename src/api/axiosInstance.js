import axios from 'axios';

// 인스턴스 생성
const axiosInstance = axios.create({
  // baseURL: 'https://move-to-move.online', // 나중 API URL

  baseURL: 'http:localhost:8080', // 현 API URL
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

// 요청 인터셉터 추가
axiosInstance.interceptors.request.use(
  (config) => {
    // 요청 전 처리
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // 요청 실패 시 에러 처리
    return Promise.reject(error);
  },
);

// 응답 인터셉터 추가
axiosInstance.interceptors.response.use(
  (response) => {
    // 응답 데이터 가공
    return response;
  },
  (error) => {
    // 응답 에러 처리 오류 메시지 출력 또는 로그아웃 처리?
    if (error.response && error.response.status === 401) {
      // 인증 에러 시 로그아웃 처리?
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
