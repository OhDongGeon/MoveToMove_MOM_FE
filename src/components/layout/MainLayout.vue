<template>
  <div class="main-layout">
    <!-- 사이드바 -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <!-- 로고 및 사용자 정보 -->
        <img src="path/to/logo.png" alt="Logo" class="logo" />
        <div class="user-info">
          <img src="path/to/user-avatar.png" alt="User Avatar" class="avatar" />
          <div class="user-details">
            <span>tot0119@naver.com</span>
            <span>닉네임</span>
          </div>
          <v-btn variant="outlined" to="/move-to-move/profile"> 정보수정 </v-btn>
          <v-btn variant="outlined"> 회원탈퇴 </v-btn>
        </div>
      </div>

      <!-- 네비게이션 메뉴 -->
      <nav class="nav-menu">
        <router-link to="/move-to-move/mypage" class="nav-item">마이페이지</router-link>
        <router-link to="/move-to-move/kanban" class="nav-item">칸반보드</router-link>
        <router-link to="/move-to-move/chat" class="nav-item">채팅</router-link>
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
export default {
  name: 'MainLayout',
};
</script>

<style scoped>
.main-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f0f8ff;
}

.sidebar {
  width: 250px;
  height: 1000px;
  background-color: #6b9e9b;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  border-top-right-radius: 20px;
}

.sidebar-header {
  padding: 20px;
  text-align: center;
}

.logo {
  width: 150px;
  margin-bottom: 20px;
}

.avatar {
  width: 80px;
  border-radius: 50%;
  margin-bottom: 10px;
}

.user-info {
  margin-bottom: 20px;
}

.nav-menu {
  width: 100%;
}

.nav-item {
  display: block;
  padding: 10px 20px;
  color: white;
  text-decoration: none;
  text-align: center;
}

.nav-item:hover {
  background-color: #4a7875;
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
</style>
