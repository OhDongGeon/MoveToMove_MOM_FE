// src/stores/kanbanColumnStore.js
import axiosInstance from '@/api/axiosInstance'; // 인증이 설정된 axios 인스턴스 가져오기
import { useKanbanCardStore } from '@/stores/kanbanCardStore';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useKanbanColumnStore = defineStore('kanbanColumn', () => {
  const columns = ref([]);
  const kanbanCardStore = useKanbanCardStore();

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

  const removeColumn = (columnId) => {
    columns.value = columns.value.filter((col) => col.id !== columnId);
  };

  const moveColumn = (oldIndex, newIndex) => {
    // 이전 순서 로그 출력
    console.log(
      '이전 순서:',
      columns.value.map((col) => ({ id: col.kanbanColumnId, sequence: col.sequence, title: col.kanbanColumnName })),
    );

    // 컬럼이 이동될 때 컬럼의 순서 변경
    const movedColumn = columns.value.splice(oldIndex, 1)[0];
    columns.value.splice(newIndex, 0, movedColumn);

    // 시퀀스 업데이트
    columns.value.forEach((column, index) => {
      column.sequence = index + 1; // 시퀀스를 1부터 시작하도록 설정
    });

    //이동한 컬럼의 카드를 포함한 컬럼 ID 업데이트 (UI 불일치 해소를 위해 컬럼ID가 변경되지 않더라도 카드의 컬럼ID업데이트)
    const oldColumnId = movedColumn.kanbanColumnId; // 이동된 컬럼의 이전 ID
    const newColumnId = columns.value[newIndex].kanbanColumnId; // 이동된 후의 새 ID
    kanbanCardStore.updateCardsByColumnId(oldColumnId, newColumnId); // 카드 스토어에서 columnId 업데이트
    // 변경된 순서 로그 출력
    console.log(
      '변경 후 순서:',
      columns.value.map((col) => ({ id: col.kanbanColumnId, sequence: col.sequence, title: col.kanbanColumnName })),
    );

    // 컬럼을 시퀀스에 따라 정렬
    sortColumns();
    // TODO: 변경된 컬럼을 서버에 저장하거나 필요한 작업

  };
  // 컬럼 순서대로 정렬
  const sortColumns = () => {
    columns.value.sort((a, b) => a.sequence - b.sequence);
  };


  return {
    columns,
    loadColumns,
    addColumn,
    removeColumn,
    moveColumn,
    sortColumns,
  };
});
