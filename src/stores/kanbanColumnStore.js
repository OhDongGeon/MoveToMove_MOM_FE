// src/stores/kanbanColumnStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import axiosInstance from '@/api/axiosInstance'; // 인증이 설정된 axios 인스턴스 가져오기
import { useKanbanCardStore } from '@/stores/kanbanCardStore';

export const useKanbanColumnStore = defineStore('kanbanColumn', () => {
  const columns = ref([]);

  // 서버에서 컬럼 데이터 로드
  const loadColumns = async (projectId) => {
    try {
      const response = await axiosInstance.get(`/api/projects/${projectId}/kanban-columns`); // axiosInstance 사용
      columns.value = response.data;
      console.log('서버 요청으로 가지고 온 컬럼데이터 입니다.', columns.value[1]);
    } catch (error) {
      console.error('Failed to load columns:', error);
    }
  };

  const addColumn = (title) => {
    const newColumn = {
      id: Date.now(),
      title,
    };
    columns.value.push(newColumn);
  };

  const removeColumn = (columnId) => {
    columns.value = columns.value.filter((col) => col.id !== columnId);
  };

  const moveColumn = (fromIndex, toIndex) => {
    const [movedColumn] = columns.value.splice(fromIndex, 1);
    columns.value.splice(toIndex, 0, movedColumn);
    updateCardsForMovedColumn();
  };

  const updateCardsForMovedColumn = () => {
    const kanbanCardStore = useKanbanCardStore();
    kanbanCardStore.updateCardsForMovedColumn(columns.value);
  };

  return {
    columns,
    loadColumns,
    addColumn,
    removeColumn,
    moveColumn,
  };
});
