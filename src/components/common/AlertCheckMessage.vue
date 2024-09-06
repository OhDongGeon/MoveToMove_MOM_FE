<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-container">
      <div class="modal-content">
        <p>{{ message }}</p>
        <round-button-item type="button" :width="200" :height="40">{{ buttonText }}</round-button-item>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const message = ref('동의하기를 확인해주세요.');
    const buttonText = ref('확인');

    const closeMessage = () => {
      emit('close'); // 부모에게 닫기 이벤트 전달
    };

    return {
      message,
      buttonText,
      closeMessage,
    };
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-container {
  background: #f0f8ff;
  border: 1.5px solid #6b9e9b;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.modal-content p {
  margin-bottom: 20px;
  font-size: 18px;
  color: #333;
}

.home-button:hover {
  background-color: #558a84;
}
</style>
