<template>
  <div>
    <p>로그인 처리 중입니다...</p>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/memberStore"; // Pinia 스토어 임포트

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore(); // Pinia 스토어 사용

const handleLogin = async () => {
  // 쿼리 파라미터에서 액세스 토큰 가져오기
  const accessToken = route.query.accessToken;

  if (accessToken) {
    // 액세스 토큰을 로컬 스토리지에 저장 - access 토큰 이름 변경할 수 있음
    localStorage.setItem("accessToken", accessToken);
    authStore.login({ accessToken }); // Pinia 스토어에 액세스 토큰 저장

    try {
      // 스토어에서 유저 정보 요청
      await authStore.fetchUser();
      console.log("유저 정보", authStore.getUser);

      alert("소셜 로그인에 성공했습니다!");
      router.push("/move-to-move/mypage"); // 성공 후 페이지 이동
    } catch (err) {
      console.log("API 요청 실패:", err);
      alert("로그인 실패: 서버와의 통신에 문제가 있습니다.");
      router.push("/login"); // 실패 시 로그인 페이지로 리다이렉트
    }
  } else {
    alert("로그인 실패: 액세스 토큰이 없습니다.");
    router.push("/login"); // 실패 시 로그인 페이지로 리다이렉트
  }
};

// 컴포넌트가 로드될 때 handleLogin 함수 호출
onMounted(() => {
  handleLogin();
});
</script>
