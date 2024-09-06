import axios from "axios";
// import store from "@/store";
import router from "@/router";
import { useAuthStore } from "@/stores/authStore";

const axiosInstance = axios.create();
const authStore = useAuthStore();

axiosInstance.interceptors.request.use(
  function (config) {
    // const accessToken = localStorage.getItem("accessToken");
    const accessToken = authStore.getAccessToken; // Pinia 스토어에서 토큰 가져오기;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },

  function (error) {
    const originalRequest = error.config;

    if (error.response.status === 401) {
      return axiosInstance
        .post("/api/members/checks/refresh-token", {
          withCredentials: true,
        })
        .then((result) => {
          // store.dispatch("/api/members/login", { access_token: result.data });
          authStore.login({ accessToken: result.data }); // Pinia 스토어에 새 토큰 저장

          return axiosInstance(originalRequest);
        })
        .catch(() => {
          // store.dispatch("/api/members/logout");
          authStore.logout(); // 로그아웃 처리
          if (router.currentRoute.path !== "/") {
            router.push("/");
          }
        });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
