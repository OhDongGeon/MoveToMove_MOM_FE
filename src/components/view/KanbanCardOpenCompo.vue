<template>
  <transition name="slide" class="contains">
    <div v-if="isVisible" class="slide-container">
      <div class="header-contains">
        <font-awesome-icon :icon="['fas', 'xmark']" class="close-icon" @click="closeSlide" />

        <div class="title-section">
          <!-- 제목 수정 모드에 따른 제목과 입력 필드 전환 -->
          <template v-if="isEditingTitle">
            <input v-model="newTitle" class="card-title card-title-input" />
            <div class="edit-card-button-group">
              <round-button-item :width="50" :height="28" :borderRadius="5" :fontSize="12" @click="saveTitle">저장</round-button-item>
              <round-button-item :width="50" :height="28" :borderRadius="5" :fontSize="12" :backgroundColor="'cancel'" @click="cancelEdit"
                >취소</round-button-item
              >
            </div>
          </template>

          <template v-else>
            <!-- 수정 모드가 아닐 때 제목 텍스트 -->
            <h2 class="card-title">{{ cardTitle }}</h2>
            <button class="edit-card-title" @click="editTitle">제목 수정</button>
          </template>
        </div>

        <div class="info-section">
          <span class="status-badge">진행중</span>
          <span class="nickname">닉네임</span>
          <span class="date">2일전</span>
        </div>
      </div>

      <div class="underline"></div>

      <div class="content-contains">
        <!-- 왼쪽 이미지 및 텍스트 설명 -->
        <div class="left-content">
          <div class="card-content">
            <div class="card-header">
              <button class="edit-card-content">수정</button>
            </div>
            <p></p>
          </div>

          <!-- 코멘트 컴포넌트 -->
          <CardComments />

          <!-- 코멘트 작성 컴포넌트 -->
          <CardCommentForm />
        </div>

        <!-- 세로선 -->
        <div class="vertical-line"></div>

        <!-- 오른쪽 카드 정보 -->
        <div class="right-content">
          <div class="card-details">
            <!-- 담당자 선택 -->
            <div class="assignee-container">
              <div class="modal-trigger" @click="openModal('담당자 선택', users, 'assigneeModal', true)">
                <div class="division-member">
                  <span class="division-name-member">담당자</span>
                  <div class="assignee-list">
                    <div class="assignee-info" v-for="assignee in assignee.selectedAssignees" :key="assignee.name">
                      <img :src="assignee.avatar" alt="Avatar" class="avatar" />
                      {{ assignee.name }}
                    </div>
                  </div>
                </div>
                <CardCommonModal
                  v-show="currentModal === 'assigneeModal'"
                  :isVisible="true"
                  :title="modalTitle"
                  :items="modalItems"
                  :multiple="true"
                  @close="closeModal"
                  @confirm="handleConfirm"
                  class="modal-position"
                />
              </div>
            </div>

            <!-- 우선순위 -->
            <div class="modal-trigger" @click="openModal('우선순위 선택', priorities, 'priorityModal', false)">
              <div class="division">
                <span class="division-name">우선순위</span>
                <span class="priority">
                  {{ assignee.priority }}
                </span>
              </div>
              <CardCommonModal
                v-show="currentModal === 'priorityModal'"
                :isVisible="true"
                :title="modalTitle"
                :items="modalItems"
                :multiple="false"
                @close="closeModal"
                @confirm="handleConfirm"
                class="modal-position"
              />
            </div>

            <!-- 작업크기 -->
            <div class="modal-trigger" @click="openModal('작업크기 선택', sizes, 'sizeModal', false)">
              <div class="division">
                <span class="division-name">작업크기</span>
                <span class="size">{{ assignee.size }}</span>
              </div>
              <CardCommonModal
                :isVisible="currentModal === 'sizeModal'"
                :title="modalTitle"
                :items="modalItems"
                :multiple="false"
                @close="closeModal"
                @confirm="handleConfirm"
                class="modal-position"
              />
            </div>

            <div class="division">
              <span class="division-name">시작날짜</span>
              <input type="date" v-model="assignee.startDate" class="date-input" />
            </div>
            <div class="division">
              <span class="division-name">종료날짜</span>
              <input type="date" v-model="assignee.endDate" class="date-input" />
            </div>
          </div>

          <div class="delete-button">
            <round-button-item :width="130" :height="30" :borderRadius="5" :fontSize="12" @click="deleteCard">카드 삭제</round-button-item>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref } from 'vue';
import CardCommonModal from '@/components/common/item/CardCommonModal.vue';
import CardCommentForm from '@/components/common/CardCommentForm.vue';
import CardComments from '@/components/common/CardComments.vue';

export default {
  components: {
    CardCommonModal,
    CardCommentForm,
    CardComments,
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['closeMenu'],

  setup(_, { emit }) {
    const modalTitle = ref('');
    const modalItems = ref([]);
    const currentModal = ref('');
    const isMultiple = ref(false); // 다중 선택 여부를 위한 변수 추가

    const cardTitle = ref('칸반카드 제목'); // 제목 상태
    const newTitle = ref(cardTitle.value); // 입력 중일 때 사용되는 상태
    const isEditingTitle = ref(false); // 제목 수정 모드 상태

    // 슬라이드를 닫는 로직
    const closeSlide = () => {
      // 부모에게 'close' 이벤트를 보냄
      emit('close');
    };

    // 제목 수정 모드로 전환
    const editTitle = () => {
      newTitle.value = cardTitle.value;
      isEditingTitle.value = true;
    };

    // 제목 저장 및 수정 모드 종료
    const saveTitle = () => {
      cardTitle.value = newTitle.value;
      isEditingTitle.value = false;
    };

    // 수정 취소 및 원래 제목 복구
    const cancelEdit = () => {
      newTitle.value = cardTitle.value; // 수정 중인 제목을 초기화
      isEditingTitle.value = false;
    };

    const assignee = ref({
      selectedAssignees: [
        {
          name: '팬텀',
          avatar: 'https://over-clock-s3.s3.ap-northeast-2.amazonaws.com//img/60409475-953c-4658-8fb4-7807c0c379a0.jpg',
        },
      ], // 여러 명의 담당자를 저장
      priority: '중간',
      size: 'Large',
      startDate: '2024-08-13',
      endDate: '2024-08-23',
    });

    const users = ref([
      { id: 1, name: '팬텀', avatar: 'https://over-clock-s3.s3.ap-northeast-2.amazonaws.com//img/60409475-953c-4658-8fb4-7807c0c379a0.jpg' },
      { id: 2, name: '오동나무', avatar: 'https://over-clock-s3.s3.ap-northeast-2.amazonaws.com//img/5e56fa91-f87d-4f4b-86f0-c46d5cbaace4.png' },
      { id: 3, name: '백제신라고구려', avatar: 'https://over-clock-s3.s3.ap-northeast-2.amazonaws.com//img/5e56fa91-f87d-4f4b-86f0-c46d5cbaace4.png' },
      { id: 4, name: '은나라금나라', avatar: 'https://over-clock-s3.s3.ap-northeast-2.amazonaws.com//img/5e56fa91-f87d-4f4b-86f0-c46d5cbaace4.png' },
    ]);

    const priorities = ref([
      { id: 1, name: '낮음', avatar: 'https://via.placeholder.com/30' },
      { id: 2, name: '중간', avatar: 'https://via.placeholder.com/30' },
      { id: 3, name: '높음', avatar: 'https://via.placeholder.com/30' },
      { id: 4, name: '긴급', avatar: 'https://via.placeholder.com/30' },
    ]);

    const sizes = ref([
      { id: 1, name: 'Small', avatar: 'https://via.placeholder.com/30' },
      { id: 2, name: 'Medium', avatar: 'https://via.placeholder.com/30' },
      { id: 3, name: 'Large', avatar: 'https://via.placeholder.com/30' },
      { id: 4, name: 'Extra Large', avatar: 'https://via.placeholder.com/30' },
    ]);

    const openModal = (title, items, modalId, multiple) => {
      modalTitle.value = title;
      modalItems.value = items.map((item) => ({
        ...item,
        selected:
          modalId === 'assigneeModal'
            ? assignee.value.selectedAssignees.some((assignee) => assignee.id === item.id)
            : item.name === assignee.value.priority || item.name === assignee.value.size,
      }));
      currentModal.value = modalId;
      isMultiple.value = multiple; // multiple 값을 설정
    };

    const closeModal = () => {
      currentModal.value = '';
    };

    const handleConfirm = (selectedItems) => {
      console.log('선택된 항목:', selectedItems);
      if (modalTitle.value === '담당자 선택') {
        // 여러 명의 담당자를 선택하도록 수정
        assignee.value.selectedAssignees = selectedItems.map((item) => ({
          id: item.id,
          name: item.name,
          avatar: item.avatar,
        }));
      } else if (modalTitle.value === '우선순위 선택') {
        assignee.value.priority = selectedItems[0]?.name; // 첫 번째 선택된 항목만 저장
      } else if (modalTitle.value === '작업크기 선택') {
        assignee.value.size = selectedItems[0]?.name; // 첫 번째 선택된 항목만 저장
      }
      closeModal();
    };

    const deleteCard = () => {
      console.log('카드가 삭제되었습니다');
    };

    return {
      closeSlide,
      assignee,
      modalTitle,
      modalItems,
      users,
      priorities,
      sizes,
      openModal,
      closeModal,
      handleConfirm,
      deleteCard,
      currentModal,
      isMultiple, // isMultiple을 반환하여 사용 가능하도록 설정
      isEditingTitle,
      cardTitle,
      editTitle,
      newTitle,
      saveTitle,
      cancelEdit,
    };
  },
};
</script>

<style scoped>
/* 슬라이드 애니메이션 */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease;
}
.slide-enter,
.slide-leave-to {
  transform: translateX(100%);
}

.contains {
  background: #ffffff;
  border-radius: 10px;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.3);
  border: 1.5px solid #6b9e9b;
}

/* 슬라이드의 기본 스타일 */
.slide-container {
  position: fixed;
  top: 0;
  right: 0;
  margin-top: 109px;
  width: 60%;
  height: 910px;
  z-index: 1000;
  overflow-y: auto;
}

/* 타이틀 */
.header-contains {
  position: relative;
  padding: 10px;
}

.close-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  color: #d63f3f;
  cursor: pointer;
}

.title-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
}

.card-title {
  height: 35px;
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  color: #000;
}

.card-title-input {
  font-size: 19px;
  width: 70%;
  padding: 5px;
  border-radius: 10px;
  border: 1.5px solid #6b9e9b;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  outline: none;
}

.edit-card-title {
  border: none;
  color: #a0a0a0;
  cursor: pointer;
  font-size: 14px;
}

.edit-card-button-group {
  display: flex;
  gap: 5px;
}

.info-section {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 5px;
  font-weight: bolder;
}

.status-badge {
  background: #6b9e9b;
  color: white;
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 10px;
}

.nickname {
  font-size: 14px;
  color: #000;
}

.date {
  font-size: 10px;
  color: #a0a0a0;
}

.underline {
  width: 100%;
  margin: 10px auto auto auto;
  border-bottom: 2px solid #6b9e9b;
}

.vertical-line {
  width: 2px;
  background-color: #6b9e9b;
  margin: 0 15px;
}

/* 내용 */
.content-contains {
  display: flex;
  align-items: stretch;
}

/* 왼쪽 내용 */
.left-content {
  width: 70%;
  padding: 15px;
}

.card-content {
  overflow: hidden;
}

.edit-card-content {
  color: white;
  border: 1px solid #ffffff;
  padding: 2px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
}

.edit-card-content:hover {
  background-color: white;
  color: #6b9e9b;
}

.card-header {
  display: flex;
  height: 35px;
  padding: 0 10px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  justify-content: flex-end;
  align-items: center;
  background-color: #6b9e9b;
}

.card-content p {
  height: 300px;
  padding: 10px;
  margin-bottom: 30px;
  font-size: 15px;
  text-align: justify;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  background-color: white;
  border: 1.5px solid #6b9e9b;
}

/* 오른쪽 내용 */
.right-content {
  width: 30%;
  padding: 15px;
}

.card-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 205px;
  border-radius: 5px;
  background-color: white;
  border: 1px solid #6b9e9b;
}

.division,
.division-member {
  display: flex;
  align-items: center;
  margin-left: 20px;
  margin-bottom: 15px;
}

.division-member {
  align-items: flex-start;
}

.division-name,
.division-name-member {
  font-size: 17px;
  font-weight: bold;
  width: 100px;
  text-align: left;
}

.division-name-member {
  margin-top: 5px;
}

/* 이미지 */
.avatar {
  width: 25px;
  height: 25px;
  margin-right: 15px;
  border-radius: 50%;
  border: 1.5px solid #6b9e9b;
}

/* 담당자 */
.assignee-container {
  display: flex;
  width: 100%;
}

.assignee-list {
  display: flex;
  flex-direction: column;
}

.assignee-info {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 8px;
}

/* 우선순위 */
.priority {
  padding: 2px 10px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  background-color: #9bb8f0;
  border: 1.5px solid #6b9e9b;
}

/* 작업크기 */
.size {
  padding: 2px 10px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  background-color: #e0cef2;
  border: 1.5px solid #6b9e9b;
}

/* 날짜 */
.date {
  font-weight: bold;
  padding: 4px 8px;
}

/* 모달 */
.modal-trigger {
  position: relative;
  width: 100%;
  cursor: pointer;
}

.modal-position {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  border: 2px solid #6b9e9b;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  padding: 10px;
}

/* 삭제 */
.delete-button {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>
