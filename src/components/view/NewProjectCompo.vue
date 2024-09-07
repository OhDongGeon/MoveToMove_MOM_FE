<template>
  <div>
    <h1>프로젝트 생성</h1>

    <div class="new-project-contains">
      <div class="project-content">
        <div class="content-group">
          <label>프로젝트명</label>
          <div class="vertical-line"></div>
          <div class="input-container">
            <input type="text" id="nickName" placeholder="프로젝트명" />
            <div class="error-message"></div>
          </div>
        </div>
        <div class="content-group-area">
          <label>프로젝트 설명</label>
          <div class="vertical-line-area"></div>
          <div class="input-container">
            <textarea id="projectDescription" placeholder="프로젝트 설명"></textarea>
            <div class="error-message"></div>
          </div>
        </div>
        <div class="content-group">
          <label><font-awesome-icon :icon="['far', 'calendar-check']" class="calendar-icon" /> 시작일시</label>
          <div class="vertical-line"></div>
          <div class="input-container">
            <input type="date" id="nickName" placeholder="시작일시" />
            <div class="error-message"></div>
          </div>
        </div>
        <div class="content-group">
          <label><font-awesome-icon :icon="['far', 'calendar-check']" class="calendar-icon" /> 종료일시</label>
          <div class="vertical-line"></div>
          <div class="input-container">
            <input type="date" id="nickName" placeholder="종료일시" />
            <div class="error-message"></div>
          </div>
        </div>
      </div>
      <div class="button-group">
        <round-button-item type="button" class="save-btn" :width="200" :height="40">프로젝트 생성</round-button-item>
        <round-button-item type="button" class="cancel-btn" :width="200" :height="40" :backgroundColor="'cancel'" @click="onCancelButton">취소</round-button-item>
      </div>
    </div>

    <CheckMessage :isVisible="isModalVisible" @close="closeModal" />
    <ConfirmAlert :isVisible="isWithdrawVisible" @close="closeWithdraw" message="탈퇴 되었습니다." />
  </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();

    const onCancelButton = () => {
      router.replace('/move-to-move/kanban');
    };

    return {
      onCancelButton,
    };
  },
};
</script>

<style scoped>
h1 {
  text-align: left;
}

.new-project-contains {
  margin-top: 20px;
  height: 470px;
  border: 1.5px solid #6b9e9b;
  border-radius: 10px;
  background: #ffffff;
}

.project-content {
  display: flex;
  margin-top: 20px;
  height: 100%;
  flex-direction: column;
  align-items: center;
}

.vertical-line,
.vertical-line-area {
  margin-right: 20px;
  border-radius: 20px;
  border-left: 2px solid #6b9e9b;
}

.vertical-line {
  height: 20px;
}

.vertical-line-area {
  margin-top: 2%;
  height: 90%;
}

.content-group,
.content-group-area {
  text-align: left;
  width: 500px;
  display: flex;
  margin-bottom: 20px;
}

.content-group {
  align-items: center;
}

.content-group label,
.content-group-area label {
  font-size: 16px;
  font-weight: bold;
  text-align: left;
  width: 30%;
}

.content-group-area label {
  margin-top: 2%;
}

.content-group input,
.content-group-area textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.content-group-area textarea {
  height: 200px;
}

.input-container {
  width: 70%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.calendar-icon {
  margin-right: 10px;
}

.error-message {
  position: absolute;
  color: #d63f3f;
  font-size: 10px;
  top: 100%;
  left: 10px;
}

/* 버튼 */
.button-group {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>
