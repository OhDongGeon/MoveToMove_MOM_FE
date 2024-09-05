<template>
  <div class="auth-layout">
    <div class="left-side">
      <!-- 배경 이미지 또는 기타 콘텐츠 -->
      <img src="path/to/background-image.png" alt="Background" class="background-image" />
    </div>
    <div class="right-side">
      <div class="form-container">
        <h2>{{ isLoginMode ? '로그인' : '회원가입' }}</h2>

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
          <a href="#" @click.prevent="isPasswordModalOpen = true">비밀번호 찾기</a>
          <a href="#" @click.prevent="toggleMode"> {{ isLoginMode ? '회원가입' : '로그인' }}으로 전환 </a>
        </div>
        <!-- 비밀번호 찾기 모달 컴포넌트-->
        <PasswordModal v-model="isPasswordModalOpen" @open-recovery-dialog="openRecoveryDialog" />
        <PasswordRecoveryDialog :show="isRecoveryDialogOpen" @update:show="isRecoveryDialogOpen = $event" />
        <!-- 로그인 소셜 버튼들 -->
        <div v-if="isLoginMode" class="social-login">
          <button>
            <img src="../../assets/kakao_login_large_wide.png" alt="kakao-login" class="kakao-logo" />
          </button>

          <button class="google-login-button">
            <img src="../../assets/web_light_rd_na@4x.png" alt="Google Icon" />
            <!-- 구글 아이콘 이미지 경로 -->
            Google 계정으로 로그인
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import PasswordModal from '@/components/common/PasswordModal.vue';
import PasswordRecoveryDialog from '@/components/common/PasswordRecoveryDialog.vue';
import defaultProfileImageSrc from '@/assets/basic-profile.png'; // 기본 이미지 경로

const isPasswordModalOpen = ref(false);
const isRecoveryDialogOpen = ref(false);
const openRecoveryDialog = () => {
  isRecoveryDialogOpen.value = true;
};

const isLoginMode = ref(true);
const email = ref('');
const nickname = ref('');
const password = ref('');
const confirmPassword = ref('');
const profileImage = ref(defaultProfileImageSrc); // 기본 프로필 이미지 경로
const fileInput = ref(null);
const router = useRouter();

// 기본 프로필 이미지를 Blob 형식으로 변환하여 저장할 변수
let defaultProfileImageBlob = null;

onMounted(async () => {
  // 기본 이미지 Blob으로 변환
  const response = await fetch(defaultProfileImageSrc);
  const blob = await response.blob();
  defaultProfileImageBlob = new File([blob], 'default-profile.png', { type: blob.type });
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

const handleSubmit = async () => {
  if (isLoginMode.value) {
    console.log('로그인 시도:', email.value, password.value);
    router.push('/move-to-move/mypage');
  } else {
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

      const response = await axios.post('http://localhost:8080/api/members/sign-up', formData);
      console.log('회원가입 성공:', response.data);
      alert('회원가입이 완료되었습니다. 로그인 해주세요.');
      isLoginMode.value = true;
    } catch (error) {
      console.error('회원가입 실패:', error.response?.data || error.message);
      alert('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  }
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
.form-profile {
  display: flex; /* Flexbox 사용 */
  align-items: center; /* 세로 가운데 정렬 */
  justify-content: flex-start; /* 전체 아이템을 수평 중앙 정렬 */
  margin-bottom: 1rem; /* 아래쪽 간격 추가 */
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
  background-color: #4caf50;
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
  margin-top: 20px;
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
