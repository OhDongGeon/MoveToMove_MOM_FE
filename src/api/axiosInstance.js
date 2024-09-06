import axios from "axios";
import store from "@/stores";
import router from "@/router";
import { useAuthStore } from "@/stores/memberStore"; // Pinia 스토어 가져오기

// 인스턴스 생성
const axiosInstance = axios.create({
  // baseURL: 'https://move-to-move.online', // 나중 API URL
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 추가
axiosInstance.interceptors.request.use(
  function (config) {
    const authStore = useAuthStore(); // 인터셉터 내부에서 호출
    // const accessToken = localStorage.getItem('accessToken');
    // 로컬에서 가지고 오는것에서 피니아에서 가지고 오는 것으로 변경
    const accessToken = authStore.getAccessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },

  async function (error) {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // 무한 루프 방지
      const authStore = useAuthStore(); // 응답 인터셉터 내부에서 호출

      try {
        const result = await axiosInstance.post(
          "/api/members/checks/refresh-token",
          {
            withCredentials: true,
          }
        );
        // store.dispatch('/api/members/login', { access_token: result.data });
        // 피니아 스토어에 새 토큰 저장으로 변경
        authStore.login({ accessToken: result.data });
        return await axiosInstance(originalRequest);
      } catch {
        store.dispatch("/api/members/logout");
        if (router.currentRoute.path !== "/") {
          router.push("/");
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
