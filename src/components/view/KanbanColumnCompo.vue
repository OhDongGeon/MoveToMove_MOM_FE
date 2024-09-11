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
    <!-- 드래그 가능한 카드 리스트 -->
    <draggable class="kanban-card-list" :list="localCards" group="cards" @end="onCardDrop" itemKey="id">
      <template #item="{ element: card }">
        <KanbanCard :card="card" @card-click="openKanbanCard" />
      </template>
    </draggable>
  </div>
</template>

<script>
import { useNavigationStore } from '@/stores/navigationStore';
import { computed, nextTick, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useKanbanCardStore } from '@/stores/kanbanCardStore';
import KanbanCard from './KanbanCardCompo.vue';
import draggable from 'vuedraggable';

export default {
  components: {
    KanbanCard,
    draggable,
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
      type: Array,
      default: () => [],
    },
    underlineColor: {
      type: String,
      default: '#6b9e9b',
    },
  },
  setup(props, { emit }) {
    const kanbanCardStore = useKanbanCardStore();
    const router = useRouter();
    const navigationStore = useNavigationStore();

    const localCards = ref([]); // 로컬 상태로 카드 데이터 관리

    // 카드 상세 정보를 가져와서 localCards에 저장하는 함수
    const loadCardDetailsForAll = async () => {
      const processedCards = await Promise.all(
        props.cards.map(async (card) => {
          console.log('전처리 전 카드의 데이터 입니다.', card);
          const detailedCard = await kanbanCardStore.loadCardDetails(card.id); // 각 카드의 상세 정보를 로드
          console.log('전처리 후 카드의 데이터 입니다.', detailedCard);
          return detailedCard; // 상세 정보가 담긴 카드 객체 반환
        }),
      );

      localCards.value = processedCards; // 전처리된 카드 데이터를 localCards에 저장
    };

    // onMounted 훅에서 카드 상세 정보 로드 함수 호출
    onMounted(() => {
      loadCardDetailsForAll();
    });
    const newCardTitle = ref('');
    const isCardAdd = ref(false);
    const cardInput = ref(null);

    const dynamicUnderlineColor = computed(() => {
      return props.underlineColor || '#6b9e9b';
    });

    const openKanbanCard = (card) => {
      console.log(`칸반카드ID: ${card.id}`);
      console.log(`칸반카드: ${card}`);
      navigationStore.setActiveItem('kanban');
      router.push({
        name: 'KanbanCardCompo',
        query: { id: card.id, title: card.title },
      });
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
        localCards.value.push(newCard);
        newCardTitle.value = '';
        isCardAdd.value = false;
      }
    };

    const onCardDrop = (event) => {
      const { oldIndex, newIndex } = event;
      const movedCard = localCards.value[oldIndex];

      if (oldIndex !== newIndex) {
        localCards.value.splice(oldIndex, 1);
        localCards.value.splice(newIndex, 0, movedCard);
        emit('card-move', props.id, props.id, movedCard.id);
      }
    };

    return {
      localCards,
      newCardTitle,
      isCardAdd,
      startEditing,
      submitAddCardTitle,
      openKanbanCard,
      cancelEditing,
      cardInput,
      dynamicUnderlineColor,
      onCardDrop,
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

  /* 웹킷 기반 브라우저에서 스크롤바 숨기기 (크롬, 사파리 등) */
  ::-webkit-scrollbar {
    display: none;
  }

  /* 파이어폭스에서 스크롤바 숨기기 */
  scrollbar-width: none;
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
