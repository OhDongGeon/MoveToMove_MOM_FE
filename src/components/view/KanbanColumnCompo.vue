<template>
  <div class="contains">
    <div class="kanban-column">
      <font-awesome-icon
        :icon="['far', 'square-plus']"
        class="square-icon"
        @click="startEditing"
      />
      <div class="title">
        <input
          v-if="isCardAdd"
          type="text"
          v-model="newCardTitle"
          @keyup.enter="submitAddCardTitle"
          @keydown.esc="cancelEditing"
          @blur="cancelEditing"
          ref="cardInput"
          placeholder="칸반 카드 제목 입력"
          class="title-input"
        />
        <span v-else class="column-title">{{ title }}</span>
      </div>
    </div>
    <!-- 동적으로 backgroundColor 적용 -->
    <div
      class="title-underline"
      :style="{ backgroundColor: dynamicUnderlineColor }"
    ></div>

    <div class="kanban-card-list">
      <!-- localCards를 사용하여 KanbanCardCompo에 데이터 전달 -->
      <KanbanCard
        v-for="card in localCards"
        :key="card.id"
        :card="card"
        @card-click="openKanbanCard"
      />
    </div>
  </div>
</template>

<script>
// import axios from '@/api/axiosInstance'; // Axios 인스턴스 가져오기
import { useNavigationStore } from "@/stores/navigationStore"; // Navigation Store 가져오기
import { computed, nextTick, ref } from "vue";
import { useRouter } from "vue-router";
import KanbanCard from "./KanbanCardCompo.vue";

export default {
  components: {
    KanbanCard,
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    cards: {
      type: Array, // Object 대신 Array로 변경 (cards는 배열입니다)
      default: () => [], // 기본값을 빈 배열로 설정
    },
    underlineColor: {
      type: String,
      default: "#6b9e9b",
    },
  },
  setup(props) {
    const router = useRouter();
    const navigationStore = useNavigationStore();

    // props.cards를 복사하여 로컬 상태로 사용
    const localCards = ref([...props.cards]);

    const newCardTitle = ref("");
    const isCardAdd = ref(false);

    const cardInput = ref(null); // input 요소를 참조하기 위한 ref

    // 동적으로 backgroundColor를 적용
    const dynamicUnderlineColor = computed(() => {
      return props.underlineColor || "#6b9e9b"; // 기본값 설정
    });

    const openKanbanCard = (card) => {
      console.log(`칸반카드ID: ${card.id}`);
      console.log(`칸반카드: ${card}`);
      navigationStore.setActiveItem("mypage");
      // 라우터를 사용해 'kanbanCard'로 카드 ID와 제목을 전달
      router.push({
        name: "KanbanCardCompo",
        query: { id: card, title: card.title },
      });
    };

    // 칸반 카드 추가 (제목만 입력)
    const startEditing = async () => {
      isCardAdd.value = true;
      newCardTitle.value = "";

      // 다음 DOM 업데이트 후 input에 포커스 설정
      await nextTick();
      if (cardInput.value) {
        cardInput.value.focus();
      }
    };

    const cancelEditing = () => {
      isCardAdd.value = false; // ESC 키나 다른 곳 클릭 시 호출
    };

    const submitAddCardTitle = async () => {
      if (newCardTitle.value.trim()) {
        try {
          // 서버에 카드 저장 요청
          // const response = await axios.post('/cards', {
          //   title: newCardTitle.value, // 서버로 보낼 데이터
          // });

          // 서버로부터 받은 카드 데이터를 cards 배열에 추가
          // cards.push(response.data);

          // 로컬 상태(localCards)에 카드 추가
          localCards.value.push({
            id: 8,
            title: newCardTitle.value,
            priority: "낮음",
            task_size: "Small",
          });

          // 상태 초기화
          newCardTitle.value = "";
          isCardAdd.value = false;
        } catch (error) {
          console.error("Error adding card:", error);
        }
      }
    };

    return {
      localCards, // 로컬 상태로 복사한 cards
      newCardTitle,
      isCardAdd,
      startEditing,
      submitAddCardTitle,
      openKanbanCard,
      cancelEditing,
      cardInput,
      dynamicUnderlineColor,
    };
  },
};
</script>

<style scoped>
.kanban-column {
  display: flex;
  margin-top: 20px;
  align-items: center;
  position: relative;
  height: 30px;
}

.square-icon {
  margin-left: 10px;
  font-size: 30px;
  cursor: pointer;
}

.title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 20px;
  font-weight: bold;
}

.title-input {
  font-size: 20px;
  padding: 5px;
  width: 300px;
  text-align: center;
  border: 1px solid black;
  border-radius: 10px;
}

.column-title {
  font-size: 20px;
  font-weight: bold;
}

.title-underline {
  width: 80%;
  height: 1px;
  margin: 10px auto 0;
}

.kanban-card-list {
  margin-top: 10px;
  height: 700px;
  overflow-y: auto;
  padding: 10px;
}

.kanban-card {
  background-color: white;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 16px;
}

.card-description {
  margin-bottom: 10px;
  font-size: 14px;
}

.card-labels {
  display: flex;
  gap: 5px;
}

.label {
  padding: 5px 10px;
  border-radius: 10px;
  background-color: #e0e0e0;
  font-size: 12px;
}
</style>
