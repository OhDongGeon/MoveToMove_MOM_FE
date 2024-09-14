<template>
  <div class="contains">
    <div class="kanban-column">
      <font-awesome-icon :icon="['far', 'square-plus']" class="square-icon" @click="startEditing" />
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

    <div class="title-underline" :style="{ backgroundColor: dynamicUnderlineColor }"></div>
    <draggable class="kanban-card-list" :list="computedCards" group="cards" @end="onCardDrop" itemKey="id">
      <template #item="{ element: card }">
        <div :data-card-id="card.id">
        <KanbanCard :card="card" @card-click="openKanbanCard" />
        </div>
      </template>
    </draggable>
    <!-- 칸반 카드 오픈 슬라이드 -->
    <KanbanCardOpen :isVisible="isKanbanCardOpen" :card="selectedCard" @close="closeKanbanCard" />
    <div v-if="isKanbanCardOpen" class="overlay"></div>
  </div>
</template>

<script>
import { useKanbanCardStore } from '@/stores/kanbanCardStore';
import {computed, nextTick, onMounted, ref} from 'vue';
import draggable from 'vuedraggable';
import KanbanCard from './KanbanCardCompo.vue';
import KanbanCardOpen from './KanbanCardOpenCompo.vue';
// import { useWebSocketStore } from '@/stores/webSocketStore';

export default {
  components: {
    KanbanCard,
    KanbanCardOpen,
    draggable,
  },
  props: {
    isCardOpen: Boolean,
    id: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    cards: {
      type: Array,
      default: () => [],
    },
    underlineColor: {
      type: String,
      default: '#6b9e9b',
    },
    columnId: {
      type: Number,
      default: null,
    },
  },
  emits: ['open-card', 'close-card', 'card-move'],
  setup(props, { emit }) {
    const kanbanCardStore = useKanbanCardStore();

    // props.cards를 참조하는 computed 속성 사용
    const computedCards = ref([]);
    // 컴포넌트가 마운트될 때 스토어에서 카드 데이터를 가져옴
    onMounted(() => {
      computedCards.value = kanbanCardStore.getCardsByColumnId(props.columnId);
    });
    // const computedCards = kanbanCardStore.cards;
    const newCardTitle = ref('');
    const isCardAdd = ref(false);
    const cardInput = ref(null);

    const dynamicUnderlineColor = computed(() => {
      return props.underlineColor || '#6b9e9b';
    });

    // KanbanCardOpenCompo와 관련된 상태
    const isKanbanCardOpen = ref(false); // 모달의 가시성 상태
    const selectedCard = ref(null); // 선택한 카드

    const openKanbanCard = (card) => {
      console.log(card);

      selectedCard.value = card;
      isKanbanCardOpen.value = true;
      emit('open-card'); // 부모에게 슬라이드가 열렸음을 알림
    };

    const closeKanbanCard = () => {
      isKanbanCardOpen.value = false;
      selectedCard.value = null;
      emit('close-card'); // 부모에게 슬라이드가 닫혔음을 알림
    };

    const startEditing = async () => {
      isCardAdd.value = true;
      newCardTitle.value = '';

      await nextTick();
      if (cardInput.value) {
        cardInput.value.focus();
      }
    };

    const cancelEditing = () => {
      isCardAdd.value = false;
    };

    const submitAddCardTitle = () => {
      if (newCardTitle.value.trim()) {
        const newCard = {
          id: Date.now(),
          columnId: props.id,
          title: newCardTitle.value,
          priority: '중간',
          task_size: 'Medium',
          members: [],
        };
        kanbanCardStore.addCard(props.id, newCard.title); // 수정된 부분
        newCardTitle.value = '';
        isCardAdd.value = false;
      }
    };

    const onCardDrop = async (event) => {
      // async를 추가하여 비동기 함수로 선언
      const { from, to, oldIndex, newIndex, item } = event;

      console.log('onCardDrop event:', event); // 이벤트 로그 출력

      // 같은 컬럼 내에서 카드 이동
      if (from === to && oldIndex !== newIndex) {
        emit('card-move', { oldIndex, newIndex, columnId: props.id });
        computedCards.value = kanbanCardStore.getCardsByColumnId(props.columnId);
      }
      // 다른 컬럼으로 카드 이동
      else if (from !== to) {
        const fromColumnId = props.columnId; // 현재 컬럼의 ID를 사용

        // `to` 요소의 상위 `.column` 요소에서 `data-column-id` 속성을 가져옴
        const toColumnElement = to.closest('.column'); // `.column`으로 부모 요소를 찾음
        const toColumnId = toColumnElement?.dataset?.columnId; // `data-column-id` 접근

        if (!toColumnId) {
          console.error('Cannot determine toColumnId from dataset.');
          return;
        }

        const cardId = item.dataset.cardId; // 이동된 카드 ID
        // 컬럼 간 카드 이동 이벤트를 상위 컴포넌트로 전송
        emit('card-move', { cardId, fromColumnId, toColumnId, oldIndex, newIndex });
      }
    };

    return {
      isKanbanCardOpen,
      selectedCard,
      closeKanbanCard,
      newCardTitle,
      isCardAdd,
      startEditing,
      submitAddCardTitle,
      openKanbanCard,
      cancelEditing,
      cardInput,
      dynamicUnderlineColor,
      onCardDrop,
      computedCards,
    };
  },
};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0); /* 투명 오버레이 */
  z-index: 999; /* 슬라이드보다 낮고, 부모 상호작용 차단 */
  pointer-events: all; /* 상호작용 차단 */
}

.kanban-column {
  display: flex;
  margin-top: 20px;
  align-items: center;
  position: relative;
  height: 30px;
}

.square-icon {
  margin-left: 10px;
  font-size: 20px;
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

  /* 파이어폭스에서 스크롤바 숨기기 */
  scrollbar-width: none;
}

.kanban-card-list ::-webkit-scrollbar {
  display: none;
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
