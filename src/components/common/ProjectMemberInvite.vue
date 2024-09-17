<template>
  <div v-if="isInviteModalOpen" class="modal">
    <div class="modal-content">
      <!-- 이메일 입력 -->
      <div class="input-group">
        <div class="email-input">
          <v-autocomplete v-model="email" :items="items" label="이메일" @input="handleInput"></v-autocomplete>
          <round-button-item type="button" class="add-button" :width="60" :height="40" :backgroundColor="'cancel'" @click="addEmail"> 추가 </round-button-item>
        </div>
      </div>

      <!-- 이메일 검색 결과를 보여주는 부분 -->
      <div v-if="isDropdownVisible" class="dropdown-container">
        <p v-if="emailError" class="error-message">{{ emailError }}</p>
        <p v-else>{{ searchResult }}</p>
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
        <round-button-item type="submit" :width="90" :height="40" :fontSize="14" @click="submitEmails"> 초대 </round-button-item>
        <round-button-item type="button" :width="90" :height="40" :fontSize="14" :backgroundColor="'cancel'" @click="closeModal"> 취소 </round-button-item>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash'; // lodash 사용
import { ref } from 'vue';

import axiosInstance from '@/api/axiosInstance';

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
    const searchResult = ref('');
    const isDropdownVisible = ref(false); // dropdown 가시성 관리
    const items = ref([]);
    // let typingTimeout = null;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 이메일 검증 및 API 조회 함수 (디바운스 적용)
    const checkEmailAvailability = debounce(async () => {
      if (email.value) {
        try {
          console.log('이거 ㅇ타니?: ', email.value);

          const response = await axiosInstance.get(`/api/members/${email.value}`);
          const data = await response.data;
          console.log(data);

          if (data.length > 0) {
            items.value = data.value;
          } else {
            emailError.value = '이메일이 존재하지 않습니다.'; // 오류 메시지
          }
        } catch (error) {
          console.error('API 요청 중 오류 발생:', error);
        }
      }
    }, 500); // 500ms 후에 API 호출

    // 입력이 멈춘 후 1초 후에 이메일 형식 체크
    // 입력 처리 함수
    const handleInput = (value) => {
      email.value = value; // v-autocomplete의 input 값을 email에 업데이트
      checkEmailAvailability(); // 디바운스된 이메일 확인
    };

    const addEmail = () => {
      if (email.value && emailPattern.test(email.value)) {
        if (!emailList.value.includes(email.value)) {
          emailList.value.push(email.value);
          email.value = '';
          emailError.value = ''; // 이메일 추가 후 오류 메시지 초기화
          searchResult.value = ''; // 이메일 추가 후 검색 결과 초기화
        }
      } else {
        emailError.value = '유효한 이메일 형식이 아닙니다.';
      }
    };

    // 이메일 값이 변경될 때 checkEmailAvailability 호출
    // watch(email, handleInput);

    const removeEmail = (index) => {
      emailList.value.splice(index, 1);
    };

    // 모달 닫기 함수, 부모에게 알림
    const closeModal = () => {
      emit('closeModal'); // 부모에게 모달을 닫으라고 이벤트 전달
      isDropdownVisible.value = false;
    };

    const submitEmails = () => {
      console.log('이메일 목록 전송:', emailList.value);
      closeModal();
    };

    return {
      items, // items를 반환하여 템플릿에서 접근 가능하게 함
      email,
      emailList,
      emailError,
      addEmail,
      isDropdownVisible,
      searchResult,
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
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  width: 100% !important;
}

.email-label {
  font-weight: bold;
  font-size: 16px;
  margin-right: 10px;
  white-space: nowrap; /* 라벨이 한 줄에 있도록 설정 */
}

/* .email-input {
  display: flex;
  align-items: center;
  flex-grow: 1;
}

.email-input input {
  flex: 1;
  margin-right: 10px;
  padding: 8px;
  background-color: #ffffff;
  border: 1px solid #6b9e9b;
  border-radius: 5px;
} */
.email-input {
  display: flex !important;
  align-items: center !important;
  flex-grow: 0.8 !important;
}

/* Vuetify의 기본 입력 스타일 덮어쓰기 */
/* 화살표 제거 */
:deep(.v-field__append-inner) {
  display: none !important;
}
/* 내부 컨트롤 높이 조정 */
:deep(.v-input__control) {
  height: 50px;
  width: 380px;
  background-color: #ffffff !important;
  border: 1px solid #6b9e9b;
  border-radius: 5px;
}
:deep(
    v-input
      v-input--horizontal
      v-input--center-affix
      v-input--density-default
      v-theme--light
      v-locale--is-ltr
      v-text-field
      v-autocomplete
      v-autocomplete--single
  ) {
  margin-left: 10px;
  height: 50px;
  width: 340px;
  background-color: #ffffff !important;
}
/* 입력 필드 높이 맞추기 */
:deep(.v-input__slot) {
  background-color: #ffffff !important;
  height: 100%;
  line-height: 40px; /* 세로 정렬 맞추기 */
}
/* 입력 필드 텍스트 크기 조절 */
.email-input .v-input__control input {
  font-size: 14px;
}
:deep(.v-input__details) {
  display: none;
}
/* 추가 버튼과 위치를 수평으로 맞추기 */
.add-button {
  margin-left: 10px; /* 입력 필드와 버튼 사이에 간격 추가 */
}

.dropdown-container {
  position: absolute;
  background-color: white;
  border-radius: 5px;
  width: 320px;
  max-height: 300px;
  overflow-y: auto;
  padding: 10px;
  left: 770px;
  bottom: 555px;
  z-index: 2500;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

/* 고정된 높이의 오류 메시지 영역 */
.error-message-container {
  padding: 0 3px;
  height: 10px; /* 고정된 높이 */
}

.error-message {
  color: red;
  font-size: 10px; /* 폰트 크기 조정 */
  line-height: 10px; /* 높이에 맞춰 라인 높이 설정 */
  text-align: left;
  margin-left: 50px;
}

.email-list-container {
  min-height: 200px;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #6b9e9b;
  padding: 10px;
  border-radius: 5px;
  background-color: #ffffff;
  margin-top: 20px;
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
