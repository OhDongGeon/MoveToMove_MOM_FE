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

      cards.value = response.data.map((card) => ({
        projectId: card.projectId,
        projectName: card.projectName,
        columnId: card.kanbanColumnId,
        columnName: card.kanbanColumnName,
        columnSeq: card.columnSeq,
        id: card.kanbanCardId,
        title: card.title,
        content: card.content,
        cardSeq: card.cardSeq,
        priority: card.priority,
        task_size: card.taskSize,
        startAt: card.startAt,
        endAt: card.endAt,
        createdAt: card.createdAt,
        members: Array.isArray(card.cardMemberList)
          ? card.cardMemberList.map((member) => ({
              memberId: member.memberId,
              email: member.email,
              nickName: member.nickName,
              profileUrl: member.profileUrl,
            }))
          : [], // cardMemberList가 null이거나 배열이 아닐 경우 빈 배열로 설정
      }));
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

  // 칸반 카드 제목 수정
  const updateKanbanCardTitle = async (cardId, updateColumn, updateData) => {
    try {
      const form = {
        updateColumn: updateColumn,
        updateData: updateData,
      };

      await axiosInstance.patch(`/api/kanban-cards/${cardId}`, form);

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

  return { cards, loadAllCards, loadCardDetails, getCardsByColumnId, updateCardsForMovedColumn, updateKanbanCardTitle };
});
