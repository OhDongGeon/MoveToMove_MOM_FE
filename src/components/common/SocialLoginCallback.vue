<template>
  <div>
    <p>로그인 처리 중입니다...</p>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// 쿼리 파라미터에서 액세스 토큰 가져오기
const accessToken = route.query.accessToken;

if (accessToken) {
  // 액세스 토큰을 로컬 스토리지에 저장 - access 토큰 이름 변경할 수 있음
  localStorage.setItem('accessToken', accessToken);

  // TODO: 추가로 유저 정보 요청 및 저장 로직이 필요하다면 여기에서 추가

  // 예: axios.get('API_ENDPOINT_FOR_USER_INFO', { headers: { Authorization: `Bearer ${accessToken}` } })

  alert('소셜 로그인에 성공했습니다!');
  router.push('/move-to-move/mypage'); // 성공 후 페이지 이동
} else {
  alert('로그인 실패: 액세스 토큰이 없습니다.');
  router.push('/login'); // 실패 시 로그인 페이지로 리다이렉트
}
</script>
