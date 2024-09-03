<template>
  <v-dialog v-model="showDialog" max-width="450">
    <v-card class="pa-5 custom-background">
      <v-card-title class="headline text-center font-weight-bold">비밀번호 찾기</v-card-title>
      <v-card-text>
        <v-text-field label="가입한 이메일" placeholder="가입한 이메일을 입력해주세요." v-model="email" outlined class="mb-4 custom-input" />
        <v-text-field label="인증번호" placeholder="발송된 인증번호를 입력해주세요." v-model="authCode" outlined class="mb-4 custom-input" />
        <v-text-field label="비밀번호" placeholder="비밀번호를 입력해주세요." type="password" v-model="newPassword" outlined class="mb-4 custom-input" />
        <v-text-field label="비밀번호 확인" placeholder="비밀번호를 다시 입력해주세요." type="password" v-model="confirmPassword" outlined class="mb-4 custom-input" />
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn color="white" class="gradient-button" @click="changePassword">비밀번호 변경</v-btn>
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

.text-center {
  text-align: center;
}

.font-weight-bold {
  font-weight: bold;
}

.custom-input {
  border-radius: 8px; /* 입력 필드 모서리 둥글게 */
  margin-bottom: 20px; /* 입력 필드 사이 간격 */
}

.gradient-button {
  background: linear-gradient(45deg, #34495e, #2c3e50); /* 그라데이션 색상 */
  font-size: 16px;
  font-weight: bold;
  border-radius: 8px; /* 둥근 모서리 */
  padding: 10px 20px; /* 버튼 여백 */
  text-transform: none; /* 텍스트 변환 없음 */
}

.v-card-title {
  padding-bottom: 16px; /* 제목과 입력 필드 사이 간격 */
}

.v-card-actions {
  padding-top: 20px; /* 버튼과 입력 필드 사이 간격 */
  justify-content: space-between; /* 버튼 정렬 */
}
</style>
