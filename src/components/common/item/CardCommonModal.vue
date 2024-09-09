<template>
  <div class="modal-overlay" v-if="isVisible" @click.self="closeModal">
    <div class="modal-content" @click.stop>
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button @click="closeModal">X</button>
      </header>
      <hr class="divider" />
      <div class="modal-body">
        <!-- 검색 입력 필드 -->
        <input
          type="text"
          v-model="searchQuery"
          placeholder="검색"
          class="search-input"
        />

        <!-- 동적으로 변경되는 요소 목록 -->
        <div class="item-list">
          <div v-for="item in filteredItems" :key="item.id" class="item">
            <input
              type="checkbox"
              :id="item.id"
              :value="item"
              v-model="selectedItems"
            />
            <label :for="item.id">
              <img :src="item.avatar" alt="avatar" class="avatar" />
              {{ item.name }}
            </label>
          </div>
        </div>
      </div>
      <footer class="modal-footer">
        <button @click="confirmSelection">확인</button>
        <button @click="closeModal">취소</button>
      </footer>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch } from "vue";

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
    isVisible: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["close", "confirm"],
  setup(props, { emit }) {
    const searchQuery = ref("");
    const selectedItems = ref([]);

    // 모달이 열리면 selectedItems 초기화
    watch(
      () => props.isVisible,
      (newVal) => {
        if (newVal) {
          selectedItems.value = [];
        }
      }
    );

    // 필터된 아이템 목록을 검색 쿼리에 따라 반환
    const filteredItems = computed(() => {
      return searchQuery.value
        ? props.items.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
          )
        : props.items;
    });

    // 모달을 닫는 메서드
    const closeModal = () => {
      emit("close");
    };

    // 선택 항목을 확인하고 부모 컴포넌트로 전달하는 메서드
    const confirmSelection = () => {
      emit("confirm", selectedItems.value);
      closeModal();
    };

    return {
      searchQuery,
      filteredItems,
      selectedItems,
      closeModal,
      confirmSelection,
    };
  },
});
</script>

<style scoped>
.modal-overlay {
  position: absolute; /* 클릭된 요소에 대해 절대 위치 */
  top: 100%; /* 클릭된 요소 바로 아래에 표시 */
  left: 0; /* 클릭된 요소의 왼쪽에 맞춤 */
  width: 100%; /* 부모 요소의 너비에 맞춤 */
  background-color: white; /* 모달 창 배경색 */
  border: 1px solid #ddd; /* 테두리 설정 */
  border-radius: 8px; /* 둥근 모서리 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); /* 그림자 효과 */
  z-index: 1000; /* 다른 요소보다 위에 표시 */
  padding: 10px; /* 모달 안쪽 여백 */
  max-width: 400px; /* 최대 너비 설정 */
}

.modal-content {
  width: 100%; /* 부모 요소의 너비에 맞춤 */
  max-height: 400px; /* 최대 높이 설정을 키워 더 많은 내용이 보이도록 */
  overflow-y: auto; /* 내용이 많을 경우 스크롤 가능 */
  padding: 10px; /* 안쪽 여백 */
}
/* 스크롤 바 전체 */
.modal-content::-webkit-scrollbar {
  width: 8px; /* 세로 스크롤 바 너비 */
  height: 8px; /* 가로 스크롤 바 높이 */
}

/* 스크롤 바 막대 */
.modal-content::-webkit-scrollbar-thumb {
  background-color: #6b9e9b; /* 스크롤 바 색상 */
  border-radius: 10px; /* 스크롤 바의 둥근 모서리 */
  border: 2px solid #F0F8FF; /* 스크롤 바 주위의 빈 공간과 배경색 */
}

/* 스크롤 바의 트랙(배경) */
.modal-content::-webkit-scrollbar-track {
  background: #e0f7fa; /* 스크롤 바 트랙 배경색 */
  border-radius: 10px; /* 트랙의 둥근 모서리 */
}



.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.modal-body {
  margin-top: 20px;
}
.search-input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid black;
  border-radius: 8px;
  height: 50px;
}
.item {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* 요소들을 왼쪽으로 정렬 */
  margin-bottom: 8px;
  border: 2px solid #6B9E9B;
  border-radius: 10px;
  height: 45px;
  gap: 5px;
  padding: 8px;
}
.item input[type="checkbox"] {
  margin: 0 10px; /* 체크박스와 다른 요소 간의 간격 */
}
.item label {
  flex-grow: 1; /* 레이블이 남은 공간을 채우도록 */
  display: flex;
  align-items: center; /* 아이템 내 요소 수직 중앙 정렬 */
  justify-content: flex-start; /* 아이템 내 요소 왼쪽 정렬 */
}
.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
button {
  margin-left: 10px;
  padding: 5px 10px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 5px;
}
.divider {
  border: 0;
  height: 1px;
  background: #6B9E9B; /* 구분선 색상 */
  margin-bottom: 15px;
}
</style>
