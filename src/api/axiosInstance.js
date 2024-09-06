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
    // const accessToken = localStorage.getItem('accessToken');
    // 로컬에서 가지고 오는것에서 피니아에서 가지고 오는 것으로 변경
    const authStore = useAuthStore();
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

  function (error) {
    const originalRequest = error.config;

    if (error.response.status === 401) {
      // Pinia 스토어 인스턴스 생성
      const authStore = useAuthStore();

      return axiosInstance
        .post("/api/members/checks/refresh-token", {
          withCredentials: true,
        })
        .then((result) => {
          // store.dispatch('/api/members/login', { access_token: result.data });
          // 피니아 스토어에 새 토큰 저장으로 변경
          authStore.login({ accessToken: result.data });

          return axiosInstance(originalRequest);
        })
        .catch(() => {
          store.dispatch("/api/members/logout");
          if (router.currentRoute.path !== "/") {
            router.push("/");
          }
        });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
