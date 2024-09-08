<template>
  <div class="modal-overlay" v-if="isVisible" @click.self="closeModal">
    <div class="modal-content">
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
      default: () => [],
    },
  },
  emits: ["close", "confirm"],
  setup(props, { emit }) {
    const searchQuery = ref("");
    const selectedItems = ref([]);

    const filteredItems = computed(() => {
      if (searchQuery.value === "") {
        return props.items;
      }
      return props.items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    const closeModal = () => {
      emit("close");
    };

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
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: #F0F8FF;
  border: 1px solid;
  padding: 20px;
  border-radius: 10px;
  width: 350px;
  max-width: 90%;
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
