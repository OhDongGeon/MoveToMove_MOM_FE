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
