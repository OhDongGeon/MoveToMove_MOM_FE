<template>
  <div v-if="isInviteModalOpen" class="modal">
    <div class="modal-content">
      <!-- 이메일 입력 -->
      <div class="input-group">
        <label for="email" class="email-label">이메일</label>
        <div class="email-input">
          <input type="text" v-model="email" @input="handleInput" placeholder="이메일 입력" />
          <round-button-item type="button" :width="60" :height="40" :backgroundColor="'cancel'" @click="addEmail">
            추가
          </round-button-item>
        </div>
      </div>
      <!-- 고정된 높이의 오류 메시지 영역을 여기로 이동 -->
      <div class="error-message-container">
        <p v-if="emailError" class="error-message">{{ emailError }}</p>
      </div>

      <!-- 이메일 리스트 -->
      <div class="email-list-container">
        <ul class="email-list">
          <li v-for="(email, index) in emailList" :key="index" class="email-item">
            {{ email }}
            <button @click="removeEmail(index)" class="remove-btn">
              <v-icon>mdi-close</v-icon>
            </button>
          </li>
        </ul>
      </div>

      <!-- 버튼 그룹 -->
      <div class="button-group">
        <round-button-item type="submit" :width="90" :height="40" :fontSize="14" @click="submitEmails">
          초대
        </round-button-item>
        <round-button-item
          type="button"
          :width="90"
          :height="40"
          :fontSize="14"
          :backgroundColor="'cancel'"
          @click="closeModal"
        >
          취소
        </round-button-item>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  props: {
    isInviteModalOpen: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    const email = ref('');
    const emailList = ref([]);
    const emailError = ref('');
    let typingTimeout = null;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 이메일 형식 검증 함수
    const checkEmailFormat = () => {
      if (!emailPattern.test(email.value)) {
        emailError.value = '유효한 이메일 형식이 아닙니다.';
      } else {
        emailError.value = '';
      }
    };

    // 입력이 멈춘 후 1초 후에 이메일 형식 체크
    const handleInput = () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      typingTimeout = setTimeout(() => {
        checkEmailFormat();
      }, 1000);
    };

    const addEmail = () => {
      if (email.value && emailPattern.test(email.value)) {
        if (!emailList.value.includes(email.value)) {
          emailList.value.push(email.value);
          email.value = '';
          emailError.value = ''; // 이메일 추가 후 오류 메시지 초기화
        }
      } else {
        emailError.value = '유효한 이메일 형식이 아닙니다.';
      }
    };

    const removeEmail = (index) => {
      emailList.value.splice(index, 1);
    };

    // 모달 닫기 함수, 부모에게 알림
    const closeModal = () => {
      emit('closeModal'); // 부모에게 모달을 닫으라고 이벤트 전달
    };

    const submitEmails = () => {
      console.log('이메일 목록 전송:', emailList.value);
      closeModal();
    };

    return {
      email,
      emailList,
      emailError,
      addEmail,
      removeEmail,
      closeModal,
      submitEmails,
      handleInput,
    };
  },
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #f0f8ff;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 90%;
  border: 1px solid #6b9e9b;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.input-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;
}

.email-label {
  font-weight: bold;
  font-size: 16px;
  margin-right: 10px;
  white-space: nowrap; /* 라벨이 한 줄에 있도록 설정 */
}

.email-input {
  display: flex;
  align-items: center;
  flex-grow: 1;
}

.email-input input {
  flex: 1;
  margin-right: 10px;
  padding: 8px;
  border: 1px solid #6b9e9b;
  border-radius: 5px;
}

/* 고정된 높이의 오류 메시지 영역 */
.error-message-container {
  padding: 0 3px;
  height: 10px; /* 고정된 높이 */
  align-items: left;
}

.error-message {
  color: red;
  font-size: 10px; /* 폰트 크기 조정 */
  line-height: 10px; /* 높이에 맞춰 라인 높이 설정 */
}

.email-list-container {
  min-height: 200px;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 10px;
  border: 1px solid #6b9e9b;
  padding: 10px;
  border-radius: 5px;
}

.email-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.email-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eaeaea;
}

.remove-btn {
  background: none;
  border: none;
  color: red;
  cursor: pointer;
}

.button-group {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 10px;
}
</style>
