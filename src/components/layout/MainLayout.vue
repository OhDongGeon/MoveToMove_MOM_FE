<template>
  <div class="main-layout">
    <!-- 사이드바 -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <!-- 로고 및 사용자 정보 -->
        <img src="../../assets/move-to-move-logo2.png" @click="navigateToHome" alt="Logo" class="logo" />

        <!-- 알림 아이콘 -->
        <div class="notification-container">
          <span class="material-symbols-outlined notification-icon">notifications</span>
          <!-- 알림 상태에 따른 동그라미 -->
          <span :class="['notification-dot', { active: navigationStore.hasNotification }]"></span>
        </div>

        <!-- 상단 hr 선 -->
        <hr class="divider" />

        <div class="user-info">
          <!-- 프로필 이미지와 사용자 정보 -->
          <div class="user-info-content">
            <img :src="avatarUrl" alt="User Avatar" class="avatar" />

            <div class="user-details">
              <!-- 현재 회원으로 변경해야함 -->
              <span class="user-email">eunjungkim1004@naver.com</span>
              <span class="user-nickname">이너프</span>
              <!-- 버튼 -->
              <div class="user-info-buttons">
                <button class="info-button" @click="toInfoModify">정보수정</button>
                <button class="delete-button">회원탈퇴</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 하단 hr 선 -->
        <hr class="divider" />
      </div>

      <!-- 네비게이션 메뉴 -->
      <nav class="nav-menu">
        <router-link to="/move-to-move/mypage" class="nav-item" :class="{ active: navigationStore.activeItem === 'mypage' }" @click="navigationStore.setActiveItem('mypage')">
          <!-- 아이콘과 텍스트를 별도의 flexbox로 구성 -->
          <div class="nav-icon-container">
            <span class="material-symbols-outlined nav-icon">dashboard</span>
          </div>
          <span class="nav-text">마이페이지</span>
        </router-link>
        <router-link to="/move-to-move/kanban" class="nav-item" :class="{ active: navigationStore.activeItem === 'kanban' }" @click="navigationStore.setActiveItem('kanban')">
          <div class="nav-icon-container">
            <font-awesome-icon icon="fa-solid fa-clone" class="nav-icon" />
          </div>
          <span class="nav-text">칸반보드</span>
        </router-link>
        <router-link to="/move-to-move/chat" class="nav-item" :class="{ active: navigationStore.activeItem === 'chat' }" @click="navigationStore.setActiveItem('chat')">
          <div class="nav-icon-container">
            <font-awesome-icon icon="fa-regular fa-comments" class="nav-icon" />
          </div>
          <span class="nav-text">채팅</span>
        </router-link>
      </nav>
    </aside>

    <!-- 메인 콘텐츠 -->
    <main class="content">
      <div class="content-header">
        <!-- 수평선을 위한 div -->
        <div class="line"></div>
      </div>
      <router-view />
    </main>
  </div>
</template>

<script>
import { useNavigationStore } from '@/stores/navigationStore';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'MainLayout',
  setup() {
    const navigationStore = useNavigationStore(); // Pinia store 사용
    const router = useRouter(); // Vue Router 사용

    const avatarUrl = computed(() => {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent('enough')}&background=random`;
    });

    const navigateToHome = () => {
      navigationStore.setActiveItem('mypage');
      router.push('/move-to-move/mypage');
    };

    const toInfoModify = () => {
      navigationStore.setActiveItem('mypage');
      router.push('/move-to-move/profile');
    };

    // 알림을 읽음으로 표시하는 메서드
    const markNotificationAsRead = () => {
      navigationStore.setNotificationStatus(false); // 알림을 읽음 상태로 설정
    };

    return {
      navigationStore,
      avatarUrl,
      navigateToHome,
      toInfoModify,
      markNotificationAsRead,
    };
  },
};
</script>

<style scoped>
.main-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f0f8ff;
}

.sidebar {
  width: 300px;
  height: 1000px;
  background-color: #6b9e9b;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  border-top-right-radius: 20px;
  position: relative; /* 상대적 위치 지정 */
}

.sidebar-header {
  padding: 20px;
  text-align: center;
  position: relative; /* 알림 아이콘의 절대 위치를 설정하기 위한 상대적 위치 지정 */
}

.logo {
  width: 200px;
  height: 100px;
  margin-top: 20px;
  margin-bottom: 20px;
  cursor: pointer; /* 클릭 가능한 커서 모양 */
}

.notification-container {
  position: absolute;
  top: 10px;
  right: 10px; /* 사이드바 오른쪽 상단에 위치 */
}

.notification-icon {
  font-size: 24px;
  cursor: pointer; /* 클릭 가능한 커서 모양 */
  color: white; /* 기본 아이콘 색상 */
}

.notification-dot {
  position: absolute;
  top: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: gray; /* 알림이 없을 때 회색 */
}

.notification-dot.active {
  background-color: #d63f3f; /* 알림이 있을 때 빨간색 */
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.user-info-content {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  margin-right: 10px;
  border: 2px solid white; /* 프로필 이미지 테두리 */
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: left;
}

.user-email {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 5px;
}

.user-nickname {
  font-size: 12px;
  color: white;
}

.user-info-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

.info-button,
.delete-button {
  background-color: white;
  color: #112f4e;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 10px;
  font-weight: bold;
}
.nav-menu {
  width: 100%;
}

.nav-item {
  display: flex; /* Flexbox 컨테이너로 설정 */
  align-items: center; /* 세로 방향 가운데 정렬 */
  justify-content: flex-start; /* 가로 방향에서 왼쪽 정렬 */
  padding: 0 20px; /* 수평 방향 패딩만 설정 */
  height: 80px; /* 높이 설정 */
  color: white;
  font-size: 18px;
  font-weight: bold;
  text-decoration: none;
  text-align: center; /* 텍스트 가운데 정렬 */
  position: relative; /* 텍스트 가운데 정렬을 위해 추가 */
  background-color: #6b9e9b; /* 기본 배경색 설정 */
  transition: background 0.3s ease; /* 배경 변경 애니메이션 */
}

.nav-icon-container {
  display: flex; /* 아이콘을 위한 flexbox */
  align-items: center; /* 아이콘을 세로 방향 가운데 정렬 */
  justify-content: flex-start; /* 아이콘을 왼쪽 정렬 */
  width: 30px; /* 아이콘 컨테이너의 너비 */
}

.nav-icon {
  margin-right: 10px; /* 아이콘과 텍스트 간격 */
  font-size: 30px; /* 아이콘 크기 */
}

.nav-text {
  flex: 1; /* 남은 공간을 차지하여 텍스트를 가운데 정렬 */
  text-align: center; /* 텍스트를 가운데 정렬 */
}

.nav-item:hover {
  background-color: #4a7875; /* 마우스를 올렸을 때 배경색 */
  color: white;
}

.nav-item.active {
  background: linear-gradient(135deg, #5a6d8c, #112f4e); /* 클릭한 상태 유지 시 그라데이션 배경 */
  color: white;
}

.content {
  flex: 1;
  padding: 20px;
  background-color: #f0f8ff;
}

.content-header {
  margin-bottom: 20px;
}

.line {
  border-top: 1px solid black; /* 검은색 수평선 */
  margin-bottom: 20px; /* 아래쪽 여백 */
}

/* 새로 추가된 hr 스타일 */
.divider {
  width: 100%;
  border: none;
  border-top: 1px solid white; /* 흰색 수평선 */
  margin: 10px 0; /* 위아래 여백 */
}
</style>
