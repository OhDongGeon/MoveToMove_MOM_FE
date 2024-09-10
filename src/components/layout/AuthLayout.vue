<template>
  <div class="auth-layout">
    <div class="left-side">
      <!-- 배경 이미지 또는 기타 콘텐츠 -->
      <img src="../../assets/login-background-image.png" alt="Background" class="background-image" />
    </div>
    <div class="right-side">
      <div class="form-container">
        <h1>{{ isLoginMode ? '로그인' : '회원가입' }}</h1>

        <!-- 입력 필드 -->
        <form @submit.prevent="handleSubmit">
          <!-- 프로필 사진 업로드 -->
          <div v-if="!isLoginMode" class="form-profile">
            <label for="profile-profile"></label>
            <input type="file" id="profile-profile" @change="onFileChange" style="display: none" ref="fileInput" />
            <img :src="profileImage" alt="프로필 미리보기" class="profile-preview" @click="triggerFileInput" />
          </div>

          <div class="form-group">
            <label for="email">이메일</label>
            <input type="email" id="email" placeholder="이메일을 입력하세요" v-model="email" @blur="validateEmail" />
            <span v-if="emailError" class="error">{{ emailError }}</span>
          </div>

          <!-- 회원가입일 경우 닉네임 입력 필드 추가 -->
          <div v-if="!isLoginMode" class="form-group">
            <label for="nickname">닉네임</label>
            <input type="text" id="nickname" placeholder="닉네임을 입력하세요" v-model="nickname" @blur="validateNickname" />
            <span v-if="nicknameError" class="error">{{ nicknameError }}</span>
          </div>

          <div class="form-group">
            <label for="password">비밀번호</label>
            <input type="password" id="password" placeholder="비밀번호를 입력하세요" v-model="password" @blur="validatePassword" />
            <span v-if="passwordError" class="error">{{ passwordError }}</span>
          </div>

          <!-- 회원가입일 경우 비밀번호 확인 입력 필드 추가 -->
          <div v-if="!isLoginMode" class="form-group">
            <label for="confirm-password">비밀번호 확인</label>
            <input type="password" id="confirm-password" placeholder="다시 비밀번호를 입력하세요" v-model="confirmPassword" @blur="validateConfirmPassword" />
            <span v-if="confirmPasswordError" class="error">{{ confirmPasswordError }}</span>
          </div>

          <!-- 버튼 텍스트도 상태에 따라 변경 -->
          <button type="submit" class="submit-button">
            {{ isLoginMode ? '로그인' : '회원가입' }}
          </button>
        </form>

        <!-- 로그인/회원가입 모드 전환 링크 -->
        <div class="toggle-mode">
          <a href="#" @click.prevent="isPasswordModalOpen = true">비밀번호 찾기</a>
          <a href="#" @click.prevent="toggleMode">
            {{ isLoginMode ? '회원가입' : '로그인' }}
          </a>
        </div>

        <!-- 비밀번호 찾기 모달 컴포넌트-->
        <!-- 인증번호 보내기 -->
        <PasswordModal v-model="isPasswordModalOpen" @open-recovery-dialog="openRecoveryDialog" />
        <!-- 비밀번호 변경 모달 -->
        <PasswordRecoveryDialog :show="isRecoveryDialogOpen" @update:show="isRecoveryDialogOpen = $event" />

        <!-- 로그인 소셜 버튼들 -->
        <div v-if="isLoginMode" class="social-login">
          <button class="kakao-login-button" @click="handleKakaoLogin">
            <img src="../../assets/kakao_login_large_wide.png" alt="kakao-login" class="kakao-logo" />
          </button>

          <button class="google-login-button" @click="handleGoogleLogin">
            <img src="../../assets/web_light_rd_na@4x.png" alt="Google Icon" />
            Google 계정으로 로그인
          </button>
        </div>
      </div>
    </div>
    <!-- Alert 컴포넌트 추가 -->
    <CommonAlert ref="alertComponent" />
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/memberStore'; //pinia 스토어 임포트
import { useNavigationStore } from '@/stores/navigationStore';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import defaultProfileImageSrc from '@/assets/basic-profile.png'; // 기본 이미지 경로
import CommonAlert from '@/components/common/item/ErrorAlertItem.vue';
import PasswordModal from '@/components/common/PasswordModal.vue';
import PasswordRecoveryDialog from '@/components/common/PasswordRecoveryDialog.vue';

// Pinia store 사용 설정
const authStore = useAuthStore();
const navigationStore = useNavigationStore();

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL;
const isPasswordModalOpen = ref(false);
const isRecoveryDialogOpen = ref(false);
const openRecoveryDialog = () => {
  isRecoveryDialogOpen.value = true;
};
const alertComponent = ref(null); // Alert 컴포넌트를 위한 ref 추가
const isLoginMode = ref(true);
const email = ref('');
const nickname = ref('');
const password = ref('');
const confirmPassword = ref('');
const profileImage = ref(defaultProfileImageSrc); // 기본 프로필 이미지 경로
const fileInput = ref(null);
const router = useRouter();

// 유효성 검사 에러 메시지
const emailError = ref('');
const nicknameError = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');

// 기본 프로필 이미지를 Blob 형식으로 변환하여 저장할 변수
let defaultProfileImageBlob = null;

onMounted(async () => {
  const response = await fetch(defaultProfileImageSrc);
  const blob = await response.blob();
  defaultProfileImageBlob = new File([blob], 'default-profile.png', {
    type: blob.type,
  });
});

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value; // Toggle mode
};

const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      profileImage.value = e.target.result; // 이미지 미리보기 생성
    };
    reader.readAsDataURL(file); // 파일을 읽어서 Data 변환
  } else {
    profileImage.value = defaultProfileImageSrc; // 파일이 없으면 기본 이미지를 사용
  }
};

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  } else {
    console.error('fileInput이 초기화되지 않았습니다.');
  }
};

// 이메일 유효성 검사
const validateEmail = () => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  emailError.value = emailPattern.test(email.value) ? '' : '유효한 이메일 주소를 입력하세요.';
};

// 닉네임 유효성 검사
const validateNickname = () => {
  nicknameError.value = nickname.value.length >= 2 ? '' : '닉네임은 최소 2자 이상이어야 합니다.';
};

// 비밀번호 유효성 검사
const validatePassword = () => {
  passwordError.value = password.value.length >= 6 ? '' : '비밀번호는 최소 6자 이상이어야 합니다.';
};

// 비밀번호 확인 유효성 검사
const validateConfirmPassword = () => {
  confirmPasswordError.value = password.value === confirmPassword.value ? '' : '비밀번호가 일치하지 않습니다.';
};

// 입력값이 유효한지 확인하는 함수
const isFormValid = () => {
  validateEmail();
  if (!isLoginMode.value) {
    validateNickname();
    validatePassword();
    validateConfirmPassword();
  }
  return !emailError.value && !nicknameError.value && !passwordError.value && !confirmPasswordError.value;
};

//alert 함수
const openErrorAlert = (message) => {
  // Alert 컴포넌트의 openAlert 메서드를 호출
  if (alertComponent.value) {
    alertComponent.value.openAlert(message);
  }
};

// api 서버 요청 메서드
const handleSubmit = async () => {
  if (!isFormValid()) {
    alert('입력한 정보를 다시 확인하세요.');
    return;
  }

  if (isLoginMode.value) {
    // 로그인 서버 API 요청
    try {
      // 전송할 데이터 객체 생성
      const loginData = {
        email: email.value,
        password: password.value,
      };

      const response = await axios.post(`${API_BASE_URL}/api/members/login`, loginData, {
        withCredentials: true,
      });

      const accessToken = response.data.data; // 서버에서 전달된 Access Token
      authStore.login({ accessToken: accessToken }); //피니아에 access토큰 저장

      try {
        await authStore.fetchUser();
        console.log('유저 정보', authStore.getUser);
      } catch (err) {
        console.log('API 요청 실패:', err);
        alert('로그인 실패: 서버와의 통신에 문제가 있습니다.');
        router.push('/login'); // 실패 시 로그인 페이지로 리다이렉트
      }

      // TODO : 알림을 위해서 웹 소켓 연결 구현해야함

      // 응답 처리
      console.log('로그인 성공:', response.data);
      router.push('/move-to-move/mypage'); // 로그인 성공 후 페이지 이동
      navigationStore.setActiveItem('mypage');
    } catch (error) {
      console.error('로그인 실패:', error.response?.data || error.message);

      // 여기서 Alert 컴포넌트의 openAlert 메서드를 호출하여 에러 메시지를 표시
      const errorMessage = error.response?.data?.message || '로그인에 실패했습니다. 다시 시도해주세요.';
      openErrorAlert(errorMessage);
    }
  } else {
    // 회원가입 서버 api 요청
    try {
      const signUpFormJson = JSON.stringify({
        email: email.value,
        nickName: nickname.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
      });

      const formData = new FormData();
      formData.append('form', signUpFormJson);

      const selectedFile = fileInput.value?.files[0];
      if (selectedFile) {
        console.log('선택된 파일:', selectedFile);
        formData.append('file', selectedFile); // 사용자 선택 파일 추가
      } else {
        console.log('파일이 선택되지 않았으므로 기본 이미지 업로드');
        formData.append('file', defaultProfileImageBlob); // 기본 이미지 Blob 추가
      }

      //TODO 공통 alert 창 만들어서 변경해야함
      const response = await axios.post(`${API_BASE_URL}/api/members/sign-up`, formData);
      console.log('회원가입 성공:', response.data);
      alert('회원가입이 완료되었습니다. 로그인 해주세요.');
      isLoginMode.value = true;
    } catch (error) {
      console.error('회원가입 실패:', error.response?.data || error.message);
      alert('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  }
};

// 소셜 로그인 함수
const handleGoogleLogin = () => {
  window.location.href = `${API_BASE_URL}/oauth2/authorization/google`; // 백엔드 OAuth2 인증 엔드포인트로 리다이렉트
  navigationStore.setActiveItem('mypage');
};
const handleKakaoLogin = () => {
  window.location.href = `${API_BASE_URL}/oauth2/authorization/kakao`;
  navigationStore.setActiveItem('mypage');
};
</script>

<style scoped>
.auth-layout {
  display: flex;
  min-height: 100vh;
}

.left-side {
  flex: 0.9;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.right-side {
  flex: 1.1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.background-image {
  width: 100%;
  height: 1075px;
}

.form-container {
  max-width: 400px;
  width: 100%;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  text-align: center;
}

.form-group {
  margin-top: 30px;
  margin-bottom: 15px;
  text-align: left;
}
.form-profile {
  display: flex; /* Flexbox 사용 */
  align-items: center; /* 세로 가운데 정렬 */
  justify-content: flex-start; /* 전체 아이템을 수평 중앙 정렬 */
  margin-bottom: 16px; /* 아래쪽 간격 추가 */
}

.form-profile label {
  margin-right: 1rem; /* 라벨과 입력 필드 사이 간격 추가 */
  min-width: 110px; /* 라벨의 최소 너비 지정 */
  text-align: left; /* 라벨을 왼쪽으로 정렬 */
}
.form-profile input[type='file'] {
  flex-grow: 1; /* 입력 필드를 중앙에 배치 */
  max-width: 300px; /* 입력 필드의 최대 너비 지정 */
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
  background-color: #6b9e9b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.toggle-mode {
  display: flex;
  margin-top: 15px;
  justify-content: space-between;
}

.social-login {
  margin-top: 30px;
  text-align: center;
}

.kakao-logo {
  width: 360px;
  height: 50px;
  border-radius: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
}
.google-login-button img {
  width: 30px; /* 구글 아이콘 너비 */
  height: 30px; /* 구글 아이콘 높이 */
  margin-right: 60px; /* 아이콘과 텍스트 사이의 간격 */
}
.google-login-button {
  width: 100%;
  padding: 12px;
  background-color: white;
  border: 1px solid #dadce0;
  border-radius: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start; /* 왼쪽 정렬로 수정 */
  margin-top: 10px;
  font-weight: bold;
  font-size: 16px;
  color: #3c4043;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 프로필 사진 CSS */
.form-profile-preview {
  margin-bottom: 1rem;
  text-align: center;
}
.profile-preview {
  max-width: 100px;
  max-height: 100px;
  border-radius: 10%;
  object-fit: cover;
  border: 1px solid #ddd;
  margin-top: 10px;
  aspect-ratio: 1 / 1; /* 가로세로 비율을 1:1로 고정 */
}
</style>
