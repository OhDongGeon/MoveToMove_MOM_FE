<template>
  <div class="modal-overlay" v-if="isVisible" @click.self="closeModal">
    <div class="modal-content" @click.stop>
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button @click="closeModal">X</button>
      </header>
      <hr class="divider" />
      <div class="modal-body">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="검색"
          class="search-input"
        />

        <div class="item-list">
          <div 
            v-for="item in filteredItems" 
            :key="item.id" 
            class="item" 
            @click="toggleSelectItem(item)"
            :class="{ 'selected-item': isSelected(item) }"
          >
            <input type="checkbox" :checked="isSelected(item)" style="display: none;" />
            <img :src="item.avatar" alt="avatar" class="avatar" />
            {{ item.name }}
          </div>
        </div>
      </div>

      <!-- 확인 버튼 추가 -->
      <div class="modal-footer">
        <button @click="confirmSelection">확인</button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from "vue";

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
      default: () => [],  // items에 대한 기본값 설정
    },
    multiple: {  // 다중 선택 여부를 설정하는 props
      type: Boolean,
      default: false,
    },
  },
  emits: ["close", "confirm"],
  setup(props, { emit }) {
    const searchQuery = ref("");
    const selectedItems = ref([]);

    // 검색어가 비어있거나 포함된 항목만 필터링
    const filteredItems = computed(() => {
      return searchQuery.value
        ? props.items.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
          )
        : props.items;
    });

    const closeModal = () => {
      emit("close");
    };

    // 아이템 선택/해제 메서드
    const toggleSelectItem = (item) => {
      if (props.multiple) {  // 다중 선택인 경우
        const index = selectedItems.value.findIndex((selected) => selected.id === item.id);
        if (index > -1) {
          selectedItems.value.splice(index, 1); // 이미 선택된 경우 해제
        } else {
          selectedItems.value.push(item); // 선택되지 않은 경우 선택
        }
      } else {  // 단일 선택인 경우
        selectedItems.value = [item];
      }
    };

    // 아이템이 선택되었는지 확인하는 메서드
    const isSelected = (item) => {
      return selectedItems.value.some((selected) => selected.id === item.id);
    };

    // 선택된 항목을 부모에게 전달
    const confirmSelection = () => {
      emit("confirm", selectedItems.value);
      closeModal();
    };

    return {
      searchQuery,
      filteredItems,
      closeModal,
      toggleSelectItem,
      isSelected,
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
  z-index: 9999; /* 다른 요소보다 위에 표시 */
  padding: 10px; /* 모달 안쪽 여백 */
  max-width: 400px; /* 최대 너비 설정 */
}

.modal-content {
  width: 100%; /* 부모 요소의 너비에 맞춤 */
  max-height: 400px; /* 최대 높이 설정을 키워 더 많은 내용이 보이도록 */
  overflow-y: auto; /* 내용이 많을 경우 스크롤 가능 */
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
  border: 2px solid #f0f8ff; /* 스크롤 바 주위의 빈 공간과 배경색 */
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
  border: 2px solid #6b9e9b;
  border-radius: 10px;
  height: 45px;
  gap: 5px;
  padding: 8px;
  cursor: pointer; /* 클릭할 수 있도록 커서 추가 */
}
.item.selected-item {
  background-color: #e0f7fa; /* 선택된 항목의 배경색 변경 */
}
.item input[type="checkbox"] {
  display: none; /* 체크박스 숨기기 */
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
  background: #6b9e9b; /* 구분선 색상 */
  margin-bottom: 15px;
}
</style>
