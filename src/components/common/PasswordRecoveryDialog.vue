<template>
  <v-dialog v-model="showDialog" persistent max-width="450">
    <v-card class="pa-5 custom-background">
      <v-card-title class="dialog-title">비밀번호 찾기</v-card-title>
      <v-card-text>
        <!-- 가입한 이메일 입력 필드 -->
        <label for="email" class="custom-label">가입한 이메일</label>
        <v-text-field id="email" placeholder="가입한 이메일을 입력해주세요." v-model="email" outlined class="custom-input" />

        <!-- 인증번호 입력 필드 및 인증 버튼 -->
        <div class="input-group">
          <div class="input-field">
            <label for="authCode" class="custom-label">인증번호</label>
            <v-text-field id="authCode" placeholder="인증번호를 입력해주세요." v-model="authCode" outlined class="custom-input" />
          </div>
          <round-button-item type="button" class="auth-btn" :width="95" :height="35">인증</round-button-item>
        </div>

        <!-- 비밀번호 입력 필드 -->
        <label for="newPassword" class="custom-label">비밀번호</label>
        <v-text-field id="newPassword" placeholder="비밀번호를 입력해주세요." type="password" v-model="newPassword" outlined class="custom-input" />

        <!-- 비밀번호 확인 입력 필드 -->
        <label for="confirmPassword" class="custom-label">비밀번호 확인</label>
        <v-text-field id="confirmPassword" placeholder="비밀번호를 다시 입력해주세요." type="password" v-model="confirmPassword" outlined class="custom-input" />
      </v-card-text>

      <!-- 비밀번호 변경 버튼 -->
      <v-card-actions class="justify-center move-up">
        <round-button-item type="submit" :width="200" :height="40">비밀번호 변경</round-button-item>
      </v-card-actions>

      <!-- 닫기 버튼 -->
      <v-card-actions class="justify-center move-up close-btn">
        <v-btn color="grey" text @click="closeDialog">닫기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'PasswordRecoveryDialog',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update:show'],
  setup(props, { emit }) {
    const showDialog = ref(props.show);
    const email = ref('');
    const authCode = ref('');
    const newPassword = ref('');
    const confirmPassword = ref('');

    const closeDialog = () => {
      emit('update:show', false);
    };

    const changePassword = () => {
      console.log('비밀번호 변경 요청:', {
        email: email.value,
        authCode: authCode.value,
        newPassword: newPassword.value,
        confirmPassword: confirmPassword.value,
      });
      closeDialog();
    };

    watch(
      () => props.show,
      (newValue) => {
        showDialog.value = newValue;
      },
    );

    return {
      showDialog,
      email,
      authCode,
      newPassword,
      confirmPassword,
      closeDialog,
      changePassword,
    };
  },
};
</script>

<style scoped>
.custom-background {
  background-color: #f7faff; /* 부드러운 파란색 배경 */
  border-radius: 12px; /* 카드 모서리 둥글게 */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
}

.dialog-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.custom-label {
  display: block;
  margin-bottom: 4px;
  font-size: 14px;
  color: #666;
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 20px; /* 인증 필드와 버튼 사이 간격 */
}

.input-field {
  flex-grow: 1;
}

.auth-btn {
  margin-left: 8px; /* 인증 버튼과 필드 사이 간격 */
}

.v-card-actions {
  padding-top: 20px; /* 버튼과 입력 필드 사이 간격 */
  justify-content: center; /* 버튼 가운데 정렬 */
}

.move-up {
  margin-top: -20px; /* 버튼을 위로 20px 이동 */
}

.close-btn {
  margin-top: 2px; /* 비밀번호 변경 버튼과 닫기 버튼 사이 간격 */
}
</style>
