// src/stores/kanbanColumnStore.js
import axiosInstance from '@/api/axiosInstance'; // 인증이 설정된 axios 인스턴스 가져오기
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useKanbanColumnStore = defineStore('kanbanColumn', () => {
  const columns = ref([]);

  // 서버에서 컬럼 데이터 로드
  const loadColumns = async (projectId) => {
    try {
      // console.log('store', projectId);

      const response = await axiosInstance.get(`/api/projects/${projectId}/kanban-columns`); // axiosInstance 사용
      columns.value = response.data;
      // console.log('서버 요청으로 가지고 온 컬럼데이터 입니다.', columns.value[1]);
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
  // 컬럼 삭제 요청
  const removeColumn = async (columnId) => {
    columns.value = columns.value.filter((col) => col.id !== columnId);

    try {

      await axiosInstance.delete(`/api/kanban-columns/${columnId}`);
    } catch (error) {

      console.error(`Failed to load columns: `, error);
    }

  };
  const moveColumn = async (kanbanColumnId, projectId, newIndex) => {
    try {
      const kanbanColumnMoveRequestForm = {
        projectId : projectId,
        newPosition : newIndex,
      };

       await axiosInstance.patch(`/api/kanban-columns/${kanbanColumnId}`, kanbanColumnMoveRequestForm);
    } catch (e) {
      console.error(e);
    }
  };

  // 컬럼 조회

  return {
    columns,
    loadColumns,
    addColumn,
    removeColumn,
    moveColumn,
  };
});
