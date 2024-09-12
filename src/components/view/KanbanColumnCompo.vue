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

    <draggable class="kanban-card-list" :list="localCards" group="cards" @end="onCardDrop" itemKey="id">
      <template #item="{ element: card }">
        <KanbanCard :card="card" @card-click="openKanbanCard" />
      </template>
    </draggable>

    <!-- 칸반 카드 오픈 슬라이드 -->
    <KanbanCardOpen :isVisible="isCardOpen" :card="selectedCard" @close="closeKanbanCard" />
  </div>
</template>

<script>
// import { useNavigationStore } from '@/stores/navigationStore';
// import { useRouter } from 'vue-router';
import { computed, nextTick, ref, onMounted } from 'vue';
import { useKanbanCardStore } from '@/stores/kanbanCardStore';
import KanbanCard from './KanbanCardCompo.vue';
import KanbanCardOpen from './KanbanCardOpenCompo.vue';
import draggable from 'vuedraggable';

export default {
  components: {
    KanbanCard,
    KanbanCardOpen,
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
    // const router = useRouter();
    // const navigationStore = useNavigationStore();

    const localCards = ref([]); // 로컬 상태로 카드 데이터 관리
    // const localCards = ref([...props.cards]);

    // 카드 상세 정보를 가져와서 localCards에 저장하는 함수
    const loadCardDetailsForAll = async () => {
      const processedCards = await Promise.all(
        props.cards.map(async (card) => {
          const detailedCard = await kanbanCardStore.loadCardDetails(card.id); // 각 카드의 상세 정보를 로드

          console.log(detailedCard);
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

    // KanbanCardOpenCompo와 관련된 상태
    const isCardOpen = ref(false); // 모달의 가시성 상태
    const selectedCard = ref(null); // 선택한 카드

    const openKanbanCard = (card) => {
      console.log(`칸반카드ID: ${card.id}`);
      console.log(`칸반카드: ${card}`);
      // navigationStore.setActiveItem('kanban');
      // router.push({
      //   name: 'KanbanCardCompo',
      //   query: { id: card.id, title: card.title },
      // });

      selectedCard.value = card;
      isCardOpen.value = true;
    };

    const closeKanbanCard = () => {
      isCardOpen.value = false;
      selectedCard.value = null;
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

    const onCardDrop = async (event) => {
      // async를 추가하여 비동기 함수로 선언
      const { oldIndex, newIndex } = event;
      const movedCard = localCards.value[oldIndex];

      if (oldIndex !== newIndex) {
        // 로컬에서 카드 순서 변경
        localCards.value.splice(oldIndex, 1);
        localCards.value.splice(newIndex, 0, movedCard);

        // try {
        //   // 서버에 순서 변경 요청 보내기 (비동기 작업)
        //   await axiosInstance.put('/api/kanban-cards/order', {  // await로 비동기 작업 완료 대기
        //     cardId: movedCard.id,
        //     oldIndex: oldIndex,
        //     newIndex: newIndex,
        //   });
        //   console.log('서버에 카드 순서가 성공적으로 업데이트되었습니다.');
        // } catch (error) {
        //   console.error('카드 순서 업데이트 실패:', error);
        //   // 오류 발생 시, 원래 상태로 복구
        //   localCards.value.splice(newIndex, 1);
        //   localCards.value.splice(oldIndex, 0, movedCard);
        // }
        emit('card-move', props.id, props.id, movedCard.id);

        // const id = props.id;
        // console.log(id);

        // const toColumnId = event.to.closest('.column').dataset.columnId; // 이동 후 컬럼 ID
        // console.log('to Column ID:', toColumnId);

        // const fromIndex = event.oldIndex; // 드래그 시작 위치
        // const toIndex = event.newIndex; // 드롭 위치
        // console.log(fromIndex);
        // console.log(toIndex);
        // console.log('카드 드래그 앤 드롭', event);
        // const form = { kanbanColumnId: toColumnId, cardSeq: toIndex };

        // cardDragAndDrop(form);
      }
    };

    return {
      isCardOpen,
      selectedCard,
      closeKanbanCard,
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
