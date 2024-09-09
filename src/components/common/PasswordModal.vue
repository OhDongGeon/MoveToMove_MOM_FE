<template>
  <v-dialog v-model="isDialogOpen" persistent class="custom-dialog">
    <v-card class="pa-5 custom-background">
      <v-card-title class="dialog-title">비밀번호 찾기</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="sendVerificationCode" class="form">
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
              class="custom-text-field"
            ></v-text-field>
          </div>
          <!-- 인증번호 발송 버튼 -->
          <round-button-item type="submit" :width="200" :height="40">인증번호 발송</round-button-item>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn class="close-btn" text @click="closeDialog">닫기</v-btn>
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

    <!-- 확인 모달창 -->
    <CheckMessage :isVisible="isModalVisible" @close="closeModal" />
  </v-dialog>
</template>

<script>
import { ref, watch } from 'vue';
import CheckMessage from './AlertCheckMessage.vue';
import AlertDialog from './AlertDialog.vue'; // SweetAlert 컴포넌트 임포트

export default {
  name: 'PasswordModal',
  components: {
    AlertDialog,
    CheckMessage,
  },
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
    const isModalVisible = ref(false); // 확인 모달창 설정

    const rules = {
      required: (value) => !!value || '이메일은 필수입니다.',
      email: (value) => /.+@.+\..+/.test(value) || '유효한 이메일을 입력하세요.',
    };

    const isDialogOpen = ref(props.modelValue);

    // 모달창 닫기
    const closeDialog = () => {
      isDialogOpen.value = false; // 모달을 닫음
      emit('update:modelValue', false);
      isSent.value = false; // 모달이 닫힐 때 상태 초기화
      email.value = '';
    };

    // 인증번호 발송
    const sendVerificationCode = () => {
      if (email.value) {
        console.log(`인증번호가 ${email.value}로 발송되었습니다.`);
        isSent.value = true; // 성공 상태로 변경
        alertVisible.value = true; // 알림창 표시
      } else {
        isModalVisible.value = true;
      }
    };

    // 확인 모달 닫기
    const closeModal = () => {
      isModalVisible.value = false;
    };

    const handleAlertClose = () => {
      email.value = '';
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
      closeModal,
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
  background-color: #f0f8ff; /* 배경색 */
  border-radius: 10px;
  border: 1.5px solid #6b9e9b;
}
.dialog-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
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

.custom-dialog {
  width: 500px;
  height: 500px;
  border-radius: 10px; /* 모달의 둥근 모서리 */
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center; /* 수직 가운데 정렬 */
}

.custom-text-field {
  width: 350px !important;
  height: 35px !important;
  margin-bottom: 30px !important;
}

.close-btn {
  font-size: 16px;
  color: grey;
}
</style>
