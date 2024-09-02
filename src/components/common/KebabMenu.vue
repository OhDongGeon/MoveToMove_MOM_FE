<template>
  <div class="kebab-menu">
    <div class="kebab-icon" @click="toggleMenu">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="menu" v-if="showMenu">
      <div class="menu-item" @click="goToPasswordChange">
        <div class="icon-wrapper">
          <img src="@/assets/settings_icon.png" alt="Settings" class="icon" />
        </div>
        <span>비밀번호 변경</span>
      </div>
      <div class="separator"></div>
      <div class="menu-item" @click="logout">
        <div class="icon-wrapper">
          <img src="@/assets/logout_icon.png" alt="Logout" class="icon" />
        </div>
        <span>로그아웃</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/components/api/axios';

export default {
  data() {
    return {
      showMenu: false,
    };
  },
  methods: {
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    goToPasswordChange() {
      this.$router.push({ name: 'password-change' });
    },
    async logout() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('로그인 토큰이 없습니다. 다시 로그인 해주세요.');
          return;
        }
        console.log('로그아웃 요청 전송, 토큰:', token);
        await axios.post(
          '/auth/logout',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log('로그아웃 성공');
        localStorage.removeItem('user_id');
        localStorage.removeItem('token');
        this.$router.push({ name: 'login' });
      } catch (error) {
        console.error('로그아웃 오류:', error);
        alert('로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    },
  },
};
</script>

<style scoped>
.kebab-menu {
  position: relative;
  display: inline-block;
}

.kebab-icon {
  width: 20px;
  height: 20px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.kebab-icon span {
  display: block;
  width: 6px;
  height: 6px;
  background-color: #1976d2;
  border-radius: 50%;
}

.menu {
  position: absolute;
  top: 35px;
  right: 0;
  background-color: #e2f3ff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 220px;
  padding: 10px 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  cursor: pointer;
}

.icon-wrapper {
  background-color: #fff;
  border-radius: 50%;
  padding: 5px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-item .icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.menu-item span {
  flex: 1;
  text-align: left;
}

.separator {
  height: 1px;
  background-color: #ccc;
  margin: 5px 0;
}
</style>
