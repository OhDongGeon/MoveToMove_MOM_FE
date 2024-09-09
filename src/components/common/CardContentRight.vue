<template>
  <div>
    <div class="assign-details">
      <!-- 담당자 -->
      <div class="modal-trigger" @click="openModal('담당자 선택', users, 'assigneeModal')">
        <p>
          <strong>담당자</strong>
          <span class="assignee-info">
            <img :src="assignee.avatar" alt="Avatar" class="avatar" />
            {{ assignee.name }}
          </span>
        </p>
        <!-- 담당자 선택 모달 -->
        <CardCommonModal
          v-show="currentModal === 'assigneeModal'"  
          :isVisible="true"
          :title="modalTitle"
          :items="modalItems"
          @close="closeModal"
          @confirm="handleConfirm"
          class="modal-position"
        />
      </div>

      <!-- 우선순위 -->
      <div class="modal-trigger" @click="openModal('우선순위 선택', priorities, 'priorityModal')">
        <p>
          <strong>우선순위</strong>
          <span class="priority">
            {{ assignee.priority }}
          </span>
        </p>
        <!-- 우선순위 선택 모달 -->
        <CardCommonModal
          v-show="currentModal === 'priorityModal'"  
          :isVisible="true"
          :title="modalTitle"
          :items="modalItems"
          @close="closeModal"
          @confirm="handleConfirm"
          class="modal-position"
        />
      </div>

      <!-- 작업크기 -->
      <div class="modal-trigger" @click="openModal('작업크기 선택', sizes, 'sizeModal')">
        <p>
          <strong>작업크기</strong>
          <span class="size">{{ assignee.size }}</span>
        </p>
        <!-- 작업크기 선택 모달 -->
        <CardCommonModal
          v-show="currentModal === 'sizeModal'" 
          :isVisible="true"
          :title="modalTitle"
          :items="modalItems"
          @close="closeModal"
          @confirm="handleConfirm"
          class="modal-position"
        />
      </div>

      <!-- 시작날짜 -->
      <p>
        <strong>시작날짜</strong>
        <input type="date" v-model="assignee.startDate" class="date-input" />
      </p>

      <!-- 종료날짜 -->
      <p>
        <strong>종료날짜</strong>
        <input type="date" v-model="assignee.endDate" class="date-input" />
      </p>
    </div>

    <!-- 카드 삭제 버튼 -->
    <div class="delete-button">
      <CustomButton
        :default-text="`카드 삭제`"
        :width="130"
        :height="35"
        font-size="18"
        @click="deleteCard"
      ></CustomButton>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import CustomButton from "@/components/common/item/RoundButtonItem.vue";
import CardCommonModal from "./item/CardCommonModal.vue";

export default {
  name: "AssignInfo",
  components: {
    CustomButton,
    CardCommonModal,
  },
  setup() {
    const assignee = ref({
      name: "팬텀",
      avatar: "https://over-clock-s3.s3.ap-northeast-2.amazonaws.com//img/60409475-953c-4658-8fb4-7807c0c379a0.jpg",
      priority: "중간",
      size: "Large",
      startDate: "2024-08-13",
      endDate: "2024-08-23",
    });

    const modalTitle = ref("");
    const modalItems = ref([]);
    const currentModal = ref("");

    const users = ref([
      { id: 1, name: "팬텀", avatar: "https://over-clock-s3.s3.ap-northeast-2.amazonaws.com//img/60409475-953c-4658-8fb4-7807c0c379a0.jpg" },
      { id: 2, name: "오동나무", avatar: "https://over-clock-s3.s3.ap-northeast-2.amazonaws.com//img/5e56fa91-f87d-4f4b-86f0-c46d5cbaace4.png" },
      { id: 3, name: "백제신라고구려", avatar: "https://over-clock-s3.s3.ap-northeast-2.amazonaws.com//img/5e56fa91-f87d-4f4b-86f0-c46d5cbaace4.png" },
      { id: 4, name: "은나라금나라", avatar: "https://over-clock-s3.s3.ap-northeast-2.amazonaws.com//img/5e56fa91-f87d-4f4b-86f0-c46d5cbaace4.png" },
    ]);

    const priorities = ref([
      { id: 1, name: "낮음", avatar: "https://via.placeholder.com/30" },
      { id: 2, name: "중간", avatar: "https://via.placeholder.com/30" },
      { id: 3, name: "높음", avatar: "https://via.placeholder.com/30" },
      { id: 4, name: "긴급", avatar: "https://via.placeholder.com/30" },
    ]);

    const sizes = ref([
      { id: 1, name: "Small", avatar: "https://via.placeholder.com/30" },
      { id: 2, name: "Medium", avatar: "https://via.placeholder.com/30" },
      { id: 3, name: "Large", avatar: "https://via.placeholder.com/30" },
      { id: 4, name: "Extra Large", avatar: "https://via.placeholder.com/30" },
    ]);

    const openModal = (title, items, modalId) => {
      if (currentModal.value === modalId) {
        currentModal.value = "";  // 동일한 모달을 다시 클릭하면 닫음
      } else {
        modalTitle.value = title;
        modalItems.value = items;
        currentModal.value = modalId;
      }
    };

    const closeModal = () => {
      currentModal.value = "";
    };

    const handleConfirm = (selectedItems) => {
      console.log("선택된 항목:", selectedItems);
      if (selectedItems.length > 0) {
        if (modalTitle.value === "담당자 선택") {
          assignee.value.name = selectedItems[0].name;
          assignee.value.avatar = selectedItems[0].avatar;
        } else if (modalTitle.value === "우선순위 선택") {
          assignee.value.priority = selectedItems[0].name;
        } else if (modalTitle.value === "작업크기 선택") {
          assignee.value.size = selectedItems[0].name;
        }
      }
      closeModal();
    };

    const deleteCard = () => {
      console.log("카드가 삭제되었습니다");
    };

    return {
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
    };
  },
};
</script>


<style scoped>
/* 스타일은 그대로 유지 */
.modal-overlay {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  padding: 10px;
  max-width: 400px;
}

.modal-content {
  width: 100%;
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
}

/* 나머지 스타일 유지 */
</style>



<style scoped>
.assign-details {
  background-color: white;
  padding: 20px;
  border: 1px solid #6b9e9b;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px; /* 카드 삭제 버튼과의 간격 */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 350px; /* 박스 최소 너비 */
  min-height: 250px; /* 박스 최소 높이 */
}

.modal-trigger {
  position: relative; /* 부모 컨테이너에 상대적인 위치 */
  width: 100%;
  cursor: pointer;
}

.modal-position {
  position: absolute; /* 모달을 부모 컨테이너에 대해 위치 지정 */
  top: 100%; /* 클릭된 요소 바로 아래에 모달을 표시 */
  left: 0; /* 왼쪽 정렬 */
  width: 100%; /* 부모의 너비에 맞춤 */
  border: 2px solid #6b9e9b;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000; /* 모달을 다른 요소 위에 표시 */
  padding: 10px;
}

.assign-details p {
  margin: 10px 0; /* 요소 간의 간격을 넓게 설정 */
  font-size: 16px; /* 글자 크기 키우기 */
  display: flex; /* 텍스트와 데이터를 수평으로 정렬 */
  width: 100%; /* 요소의 너비를 부모에 맞춤 */
  line-height: 1.5; /* 줄 간격 설정 */
}
.avatar {
  width: 30px;  /* 이미지 너비 */
  height: 30px; /* 이미지 높이 */
  border-radius: 50%; /* 원형으로 표시 */
  margin-right: 8px; /* 텍스트와 이미지 사이 간격 */
}
.delete-button {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 20px;
}

.assign-details p strong {
  width: 100px; /* 레이블의 고정 너비 설정 (글자 5자 정도) */
  font-weight: bold;
  font-size: 18px; /* 라벨의 글자 크기 키우기 */
  text-align: left; /* 레이블 왼쪽 정렬 */
  margin-right: 10px; /* 레이블과 값 사이의 간격 */
}

.assignee-info {
  flex-grow: 1; /* 값의 너비를 유연하게 */
  text-align: left; /* 값 왼쪽 정렬 */
  font-size: 16px; /* 값의 글자 크기 키우기 */
  padding: 4px 8px; /* 값의 안쪽 여백 설정 */
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 5px;
}
.priority {
  display: inline-block;
  padding: 4px 8px;
  background-color: #9bb8f0; /* 배경색 설정 */
  border-radius: 8px; /* 둥근 모서리 설정 */
  margin-left: 10px;
  font-weight: bold;
}
.size {
  display: inline-block;
  padding: 4px 8px;
  background-color: #e0cef2; /* 배경색 설정 */
  border-radius: 8px; /* 둥근 모서리 설정 */
  margin-left: 10px;
  font-weight: bold;
}
.date {
  font-weight: bold;
  padding: 4px 8px;
}
.delete-button {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 20px;
}
.modal {
  margin: 10px;
}
</style>
