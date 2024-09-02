<template>
  <div class="auth-layout">
    <div class="left-side">
      <!-- 배경 이미지 또는 기타 콘텐츠 -->
      <img src="path/to/background-image.png" alt="Background" class="background-image" />
    </div>
    <div class="right-side">
      <div class="form-container">
        <h2>{{ isLoginMode ? '로그인' : '회원가입' }}</h2>

        <!-- 공통 입력 필드 -->
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="email">이메일</label>
            <input type="email" id="email" placeholder="이메일을 입력하세요" v-model="email" />
          </div>

          <!-- 회원가입일 경우 닉네임 입력 필드 추가 -->
          <div v-if="!isLoginMode" class="form-group">
            <label for="nickname">닉네임</label>
            <input type="text" id="nickname" placeholder="닉네임을 입력하세요" v-model="nickname" />
          </div>

          <div class="form-group">
            <label for="password">비밀번호</label>
            <input type="password" id="password" placeholder="비밀번호를 입력하세요" v-model="password" />
          </div>

          <!-- 회원가입일 경우 비밀번호 확인 입력 필드 추가 -->
          <div v-if="!isLoginMode" class="form-group">
            <label for="confirm-password">비밀번호 확인</label>
            <input type="password" id="confirm-password" placeholder="다시 비밀번호를 입력하세요" v-model="confirmPassword" />
          </div>

          <!-- 버튼 텍스트도 상태에 따라 변경 -->
          <button type="submit" class="submit-button">{{ isLoginMode ? '로그인' : '회원가입' }}</button>
        </form>

        <!-- 로그인/회원가입 모드 전환 링크 -->
        <div class="toggle-mode">
          <a href="#" @click.prevent="toggleMode"> {{ isLoginMode ? '회원가입' : '로그인' }}으로 전환 </a>
        </div>

        <!-- 로그인 소셜 버튼들 -->
        <div v-if="isLoginMode" class="social-login">
          <button class="kakao-login">카카오 로그인</button>
          <button class="google-login">Google 계정으로 로그인</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthLayout',
  data() {
    return {
      isLoginMode: true, // 현재 모드를 관리하는 상태 변수
      email: '',
      nickname: '',
      password: '',
      confirmPassword: '',
    };
  },
  methods: {
    toggleMode() {
      this.isLoginMode = !this.isLoginMode; // 모드 전환
    },
    handleSubmit() {
      if (this.isLoginMode) {
        // 로그인 로직
        console.log('로그인 시도:', this.email, this.password);
        this.$router.push('/move-to-move/mypage');
      } else {
        // 회원가입 로직
        console.log('회원가입 시도:', this.email, this.nickname, this.password, this.confirmPassword);
      }
    },
  },
};
</script>

<style scoped>
.auth-layout {
  display: flex;
  min-height: 100vh;
}

.left-side {
  flex: 1;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.right-side {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.background-image {
  width: 100%;
  height: auto;
  max-width: 90%;
}

.form-container {
  max-width: 400px;
  width: 100%;
  padding: 20px;
  background-color: #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.submit-button {
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.toggle-mode {
  margin-top: 15px;
}

.social-login {
  margin-top: 20px;
  text-align: center;
}

.kakao-login,
.google-login {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.kakao-login {
  background-color: #fee500;
}

.google-login {
  background-color: #ffffff;
  border: 1px solid #ddd;
}
</style>
