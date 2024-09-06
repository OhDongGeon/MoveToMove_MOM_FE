import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: localStorage.getItem("accessToken") || "", // 'access_token'을 'accessToken'으로 통일
    user: null, // user 상태 추가
  }),

  actions: {
    login(payload) {
      this.accessToken = payload.accessToken; // 'access_token'을 'accessToken'으로 통일
      localStorage.setItem("accessToken", payload.accessToken); // 로컬 스토리지에 저장
      this.user = payload.user || null; // 로그인 시 유저 정보도 함께 저장
    },
    logout() {
      this.accessToken = ""; // 로그아웃 시 'accessToken' 초기화
      this.user = null; // 유저 정보 초기화
      localStorage.removeItem("accessToken"); // 로컬 스토리지에서 토큰 제거
      localStorage.removeItem("selectedPage"); // 선택된 페이지 정보도 제거
    },
  },

  getters: {
    getAccessToken: (state) => state.accessToken, // 'access_token'을 'accessToken'으로 통일
    getUser: (state) => state.user, // 유저 정보를 가져오는 getter
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: "auth", // 로컬 스토리지에 저장될 기본 키 이름
        storage: localStorage,
        paths: ["accessToken", "user"], // 두 가지 상태 모두 저장
      },
    ],
  },
});
