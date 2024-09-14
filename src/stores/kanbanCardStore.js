import axiosInstance from '@/api/axiosInstance';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useKanbanCardStore = defineStore('kanbanCard', () => {
  const cards = ref([]);

  const loadAllCards = async (projectId) => {
    try {
      const response = await axiosInstance.get(`/api/projects/${projectId}/kanban-cards`);

      // response.data null일 경우 바로 리턴
      if (!Array.isArray(response.data)) {
        console.error('서버로 받는 응답 데이터가 없습니다.');
        cards.value = [];
        return;
      }

      // 응답 데이터를 올바르게 매핑하여 상태로 저장
      cards.value = response.data.map((item) => {
        const projectCard = item.projectInCardDto; // 카드의 세부 정보를 포함한 객체
        const members = item.cardMemberList; // 멤버 리스트

        return {
          projectId: projectCard.projectId,
          projectName: projectCard.projectName,
          columnId: projectCard.kanbanColumnId,
          columnName: projectCard.kanbanColumnName,
          columnSeq: projectCard.columnSeq,
          id: projectCard.kanbanCardId,
          title: projectCard.title,
          content: projectCard.content,
          cardSeq: projectCard.cardSeq,
          priority: projectCard.priority,
          taskSize: projectCard.taskSize,
          startAt: projectCard.startAt,
          endAt: projectCard.endAt,
          createdAt: projectCard.createdAt,
          members: Array.isArray(members)
            ? members.map((member) => ({
                memberId: member.memberId,
                email: member.email,
                nickName: member.nickName,
                profileUrl: member.profileUrl,
              }))
            : [], // cardMemberList가 null이거나 배열이 아닐 경우 빈 배열로 설정
        };
      });
    } catch (error) {
      console.error('Failed to load cards:', error);
    }
  };

  const loadCardDetails = async (cardId) => {
    try {
      const response = await axiosInstance.get(`/api/kanban-cards/${cardId}/details`);
      const cardData = response.data;
      return {
        id: cardData.kanbanColumnInCard.kanbanCardId,
        columnId: cardData.kanbanColumnInCard.kanbanColumnId,
        columnName: cardData.kanbanColumnInCard.kanbanColumnName,
        title: cardData.kanbanColumnInCard.title,
        content: cardData.kanbanColumnInCard.content,
        priority: cardData.kanbanColumnInCard.priority,
        task_size: cardData.kanbanColumnInCard.taskSize,
        startAt: cardData.kanbanColumnInCard.startAt,
        endAt: cardData.kanbanColumnInCard.endAt,
        createdAt: cardData.kanbanColumnInCard.createdAt,

        members: cardData.cardMemberList.map((member) => ({
          memberId: member.memberId,
          nickName: member.nickName,
          profileUrl: member.profileUrl,
        })),

        comments: cardData.cardCommentList || [],
      };
    } catch (error) {
      console.error('Failed to load card details:', error);
    }
  };

  const getCardsByColumnId = (columnId) => {
    return cards.value.filter((card) => card.columnId === columnId);
  };

  // 칸반 컬럼 움직임에 따른 카드 움직임
  const updateCardsForMovedColumn = (updatedColumns) => {
    // 각 컬럼의 새로운 인덱스와 함께 카드 업데이트
    updatedColumns.forEach((column) => {
      cards.value.forEach((card) => {
        if (card.columnId === column.id) {
          // 카드의 columnId를 업데이트된 컬럼의 인덱스로 설정
          card.columnId = column.id;
          console.log(`Updated Card ID: ${card.id} to Column ID: ${card.columnId}`);
        }
      });
    });
  };

  // 컬럼 이동 시 호출하는 함수 columnId 업데이트
  const updateCardsByColumnId = (oldColumnId, newColumnId) => {
    cards.value.forEach((card) => {
      if (card.columnId === oldColumnId) {
        card.columnId = newColumnId;
      }
    });
  };

  // 칸반 카드 수정
  const updateKanbanCard = async (cardId, updateColumn, updateData) => {
    try {
      const form = {
        updateColumn: updateColumn,
        updateData: updateData,
      };

      await axiosInstance.patch(`/api/kanban-cards/${cardId}`, form);

      if (updateColumn === 'task_size') {
        updateColumn = 'taskSize';
      } else if (updateColumn === 'start_at') {
        updateColumn = 'startAt';
      } else if (updateColumn === 'end_at') {
        updateColumn = 'endAt';
      }

      const index = cards.value.findIndex((card) => card.id === cardId);
      if (index !== -1) {
        cards.value[index] = {
          ...cards.value[index],
          [updateColumn]: updateData,
        };
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 같은 컬럼 내에서의 카드 이동
  const moveCardWithinColumn = (columnId, oldIndex, newIndex) => {
    const columnCards = cards.value.filter((card) => card.columnId === columnId);
    const movedCard = columnCards.splice(oldIndex, 1)[0];
    columnCards.splice(newIndex, 0, movedCard);

    // 시퀀스 업데이트
    columnCards.forEach((card, index) => {
      card.sequence = index + 1; // 카드 시퀀스 업데이트
    });
    // 전체 cards 배열에서 해당 컬럼의 카드 시퀀스 업데이트
    cards.value = cards.value.map((card) => {
      if (card.columnId === columnId) {
        const updatedCard = columnCards.find((c) => c.id === card.id);
        return updatedCard ? { ...card, sequence: updatedCard.sequence } : card;
      }
      return card;
    });

    // cards 배열을 시퀀스에 따라 정렬
    cards.value.sort((a, b) => a.sequence - b.sequence);

    console.log(`Moved card within column ${columnId} from ${oldIndex} to ${newIndex}`);
  };

  // 다른 컬럼으로의 카드 이동
  const moveCardToAnotherColumn = (cardId, fromColumnId, toColumnId, newIndex) => {
    const cardIndex = cards.value.findIndex((card) => card.id === cardId && card.columnId === fromColumnId);
    if (cardIndex !== -1) {
      const [movedCard] = cards.value.splice(cardIndex, 1);
      movedCard.columnId = toColumnId; // 컬럼 ID 업데이트

      // 새로운 컬럼의 위치에 카드 삽입
      const toColumnCards = cards.value.filter((card) => card.columnId === toColumnId);
      toColumnCards.splice(newIndex, 0, movedCard);

      // 시퀀스 업데이트
      toColumnCards.forEach((card, index) => {
        card.sequence = index + 1; // 카드 시퀀스 업데이트
      });

      console.log(`Moved card ${cardId} from column ${fromColumnId} to column ${toColumnId} at position ${newIndex}`);
    }
  };

  // 칸반 카드 담당자 수정
  const updateKanbanCardMember = async (cardId, members) => {
    try {
      const memberIdList = members.map((member) => member.id);

      const form = {
        memberIds: memberIdList,
      };

      await axiosInstance.patch(`/api/kanban-cards/${cardId}/members`, form);

      const updatedColumn = members.map((member) => ({
        memberId: member.id,
        email: member.email,
        nickName: member.name,
        profileUrl: member.avatar,
      }));

      const index = cards.value.findIndex((card) => card.id === cardId);
      if (index !== -1) {
        cards.value[index].members = updatedColumn;
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 칸반 카드 삭제
  const deleteKanbanCard = async (cardId) => {
    try {
      await axiosInstance.delete(`/api/kanban-cards/${cardId}`);

      cards.value = cards.value.filter((card) => card.id !== cardId);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    cards,
    loadAllCards,
    loadCardDetails,
    getCardsByColumnId,
    moveCardWithinColumn,
    moveCardToAnotherColumn,
    updateCardsForMovedColumn,
    updateCardsByColumnId,
    updateKanbanCard,
    updateKanbanCardMember,
    deleteKanbanCard,
  };
});
