// src/stores/kanbanCardStore.js
import axiosInstance from '@/api/axiosInstance'; // 인증이 설정된 axios 인스턴스 가져오기
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useKanbanCardStore = defineStore('kanbanCard', () => {
  const cards = ref([]);

  // 서버에서 카드 데이터 로드
  const loadAllCards = async (projectId) => {
    try {
      const response = await axiosInstance.get(`/api/projects/${projectId}/kanban-cards`); // axiosInstance 사용
      cards.value = response.data.map((card) => ({
        id: card.kanbanCardId,
        columnId: card.kanbanColumnId,
        title: card.title,
        priority: card.priority,
        task_size: card.taskSize,
        members: [], // 필요 시 멤버 데이터를 추가하세요
      }));
    } catch (error) {
      console.error('Failed to load cards:', error);
    }
  };

  const loadCardDetails = async (cardId) => {
    try {
      const response = await axiosInstance.get(`/api/kanban-cards/${cardId}/details`);
      const cardData = response.data;

      // console.log('Loaded card details:', cardData); // 디버깅용 로그 추가

      return {
        id: cardData.kanbanColumnInCard.kanbanCardId,
        columnId: cardData.kanbanColumnInCard.kanbanColumnId,
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
  // 서버에서 모든 카드 데이터 로드

  const addCard = (columnId, cardTitle) => {
    const newCard = {
      id: Date.now(),
      columnId,
      title: cardTitle,
      priority: '중간',
      task_size: 'Medium',
      members: [],
    };
    cards.value.push(newCard);
  };

  const removeCard = (cardId) => {
    cards.value = cards.value.filter((card) => card.id !== cardId);
  };

  const moveCard = (fromColumnId, toColumnId, cardId) => {
    const card = cards.value.find((card) => card.id === cardId);
    if (card) {
      card.columnId = toColumnId;
    }
  };

  const getCardsByColumnId = (columnId) => {
    return cards.value.filter((card) => card.columnId === columnId);
  };

  const updateCardsForMovedColumn = (columns) => {
    const columnIdMap = new Map();

    columns.forEach((column, newIndex) => {
      columnIdMap.set(column.id, newIndex);
    });

    cards.value.forEach((card) => {
      if (columnIdMap.has(card.columnId)) {
        const newColumnIndex = columnIdMap.get(card.columnId);
        card.columnId = columns[newColumnIndex].id;
      }
    });
  };

  return { cards, loadAllCards, loadCardDetails, addCard, removeCard, moveCard, getCardsByColumnId, updateCardsForMovedColumn };
});
