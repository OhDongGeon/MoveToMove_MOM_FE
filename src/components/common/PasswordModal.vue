<!-- PasswordModal.vue -->
<template>
  <v-dialog v-model="isDialogOpen" class="custom-dialog">
    <v-card class="pa-5 custom-background">
      <v-card-title class="text-h4 text-center font-weight-bold">비밀번호 찾기</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="sendVerificationCode">
          <div class="form-group mb-6">
            <label class="form-label" for="email">가입한 이메일</label>
            <v-text-field
              v-model="email"
              id="email"
              placeholder="가입한 이메일을 입력해주세요."
              outlined
              type="email"
              required
              :rules="[rules.required, rules.email]"
              hide-details="auto"
            ></v-text-field>
          </div>
          <!-- 인증번호 발송 버튼 -->
          <v-btn type="submit" class="mt-8 gradient-button" block> 인증번호 발송 </v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn color="grey" text @click="closeDialog">닫기</v-btn>
      </v-card-actions>
    </v-card>

    <!-- SweetAlert 알림 컴포넌트 -->
    <AlertDialog
      :show="alertVisible"
      title="인증번호 발송!"
      text="이메일로 인증번호가 발송되었습니다."
      icon="success"
      @close="handleAlertClose"
    />
  </v-dialog>
</template>

<script>
import { ref, watch } from 'vue';
import AlertDialog from './AlertDialog.vue'; // SweetAlert 컴포넌트 임포트

export default {
  name: 'PasswordModal',
  components: { AlertDialog },
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update:modelValue', 'open-recovery-dialog'], // 새로운 이벤트를 추가
  setup(props, { emit }) {
    const email = ref('');
    const isSent = ref(false);
    const alertVisible = ref(false); // 알림창 표시 상태
    const rules = {
      required: (value) => !!value || '이메일은 필수입니다.',
      email: (value) => /.+@.+\..+/.test(value) || '유효한 이메일을 입력하세요.',
    };

    const isDialogOpen = ref(props.modelValue);

    const closeDialog = () => {
      isDialogOpen.value = false; // 모달을 닫음
      emit('update:modelValue', false);
      isSent.value = false; // 모달이 닫힐 때 상태 초기화
    };

    const sendVerificationCode = () => {
      if (email.value) {
        console.log(`인증번호가 ${email.value}로 발송되었습니다.`);
        isSent.value = true; // 성공 상태로 변경
        alertVisible.value = true; // 알림창 표시
      } else {
        alert('유효한 이메일 주소를 입력하세요.');
      }
    };

    const handleAlertClose = () => {
      alertVisible.value = false;
      closeDialog();
      emit('open-recovery-dialog'); // 두 번째 모달을 열기 위한 이벤트 발송
    };

    watch(
      () => props.modelValue,
      (newVal) => {
        isDialogOpen.value = newVal;
      },
    );

    return {
      isDialogOpen,
      email,
      isSent,
      alertVisible,
      rules,
      closeDialog,
      sendVerificationCode,
      handleAlertClose,
    };
  },
};
</script>

<style scoped>
.text-center {
  text-align: center;
}
.font-weight-bold {
  font-weight: bold;
}
.pa-5 {
  padding: 32px; /* Vuetify padding utility */
}
.custom-background {
  background-color: #f0f8ff; /* 새로운 배경색 */
}
.form-label {
  display: block;
  margin-bottom: 8px;
  color: #666;
  font-size: 16px;
}
.mb-6 {
  margin-bottom: 24px; /* 텍스트 필드와 버튼 사이의 간격 넓히기 */
}
.mt-8 {
  margin-top: 32px; /* 텍스트 필드와 버튼 사이의 간격 넓히기 */
}

/* 인증번호 발송 버튼 스타일 */
.gradient-button {
  background: linear-gradient(45deg, #34495e, #2c3e50); /* 그라데이션 색상 */
  color: white;
  font-size: 18px;
  font-weight: bold;
  border-radius: 14px; /* 둥근 모서리 */
  height: 40px; /* 버튼 높이 */
  text-transform: none; /* 텍스트 변환 없음 */
}
.custom-dialog {
  width: 630px;
  height: 560px;
  min-height: 500px;
}
</style>
