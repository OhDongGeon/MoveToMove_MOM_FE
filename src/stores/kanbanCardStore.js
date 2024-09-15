import axiosInstance from '@/api/axiosInstance';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import {useKanbanColumnStore} from '@/stores/kanbanColumnStore';

export const useKanbanCardStore = defineStore('kanbanCard', () => {
  const cards = ref([]);
  const kanbanColumnStore = useKanbanColumnStore();

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
  const moveCardWithinColumn = async (cardId, columnId, newCardSeq) => {
    try {
      const cardLocationForm = {
        kanbanColumnId: columnId,
        cardSeq: newCardSeq,
      }

      await axiosInstance.put(`/api/kanban-cards/${cardId}/locations`, cardLocationForm);
      console.log(`카드 ID ${cardId} 이동 -> new ${newCardSeq} within column ${columnId}`);
    } catch (e) {
      console.log(e);
    }
  };
  // 컬럼 내 카드 순서를 재정렬하는 함수
  const updateCardSequences = (columnId) => {
    const columnCards = cards.value
        .filter((card) => card.columnId === Number(columnId))
        .sort((a, b) => a.cardSeq - b.cardSeq); // 기존 시퀀스로 정렬

    columnCards.forEach((card, index) => {
      card.cardSeq = index+1; // 시퀀스 재정렬
    });
  };
  // 다른 컬럼으로의 카드 이동
  const moveCardToAnotherColumn = (cardId, fromColumnId, toColumnId, newIndex) => {
    // 1. 이동할 카드 찾기
    const card = cards.value.find((card) => String(card.id) === String(cardId));  // 피니아 내에 이동할 카드가 있는지 검사
    if (!card) {
      console.log(`${cardId}의 카드가 피니아 데이터 내에 없습니다.`);
      return;
    }
    // 2. 카드의 컬럼 ID를 변경하는 toColumnId값으로 변경 ( 변경하려는 컬럼 아이디 검사 )
    const targetColumnExists = kanbanColumnStore.columns.some(
        (column) => Number(column.kanbanColumnId) === Number(toColumnId)
    );
    if(!targetColumnExists) {
      console.log(`이동하고자하는 컬럼 ${toColumnId}을 찾을 수 없습니다.`);
      return;
    }
    card.columnId = Number(toColumnId); // 변경되는 카드의 컬럼 ID를 이동하고자하는 컬럼의 ID로 바꿔준다.
    // 3. 새로운 컬럼으로 카드 추가
    const toColumnCards = cards.value.filter(
        (card) => card.columnId === Number(toColumnId)
    );
    toColumnCards.splice(newIndex, 0, card); // 지정된 위치에 추가
    console.log(`${newIndex}`);
    // 4. 시퀀스 재정렬 (새로운 컬럼)
    updateCardSequences(toColumnId);

    // 5. 시퀀스 재정렬 (이전 컬럼)
    updateCardSequences(fromColumnId);
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
    updateCardSequences,
  };
});
