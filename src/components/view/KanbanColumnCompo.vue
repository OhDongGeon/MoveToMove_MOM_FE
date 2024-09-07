<template>
  <div class="contains">
    <div class="kanban-column-title">
      <font-awesome-icon :icon="['far', 'square-plus']" class="square-icon" />
      <div class="title">타이틀</div>
    </div>
    <div class="title-underline"></div>
    <div class="kanban-card-list">
      <KanbanCard v-for="card in cards" :key="card.id" :card="card" />
    </div>
  </div>
</template>

<script>
import KanbanCard from './KanbanCardCompo.vue';
export default {
  components: {
    KanbanCard,
  },
  data() {
    return {
      cards: [
        {
          id: 0,
          title: '데이터베이스 설계',
          priority: '긴급',
          task_size: 'Extra Large',
          members: [
            { avatar: 'https://over-clock-s3.s3.ap-northeast-2.amazonaws.com//img/344b7017-c557-4624-9306-964c0bdcac2c.ea42ce6a.png' },
            { avatar: 'https://over-clock-s3.s3.ap-northeast-2.amazonaws.com//img/4b30c8ce-7d5e-4d29-8e6e-557173ad70f5.png' },
          ],
        },
        { id: 1, title: 'Task 1', priority: '긴급', task_size: 'Medium' },
        { id: 2, title: 'Task 2', priority: '높음', task_size: 'Large' },
        { id: 3, title: 'Task 3', priority: '중간', task_size: 'Medium' },
        { id: 4, title: 'Task 4', priority: '중간', task_size: 'Medium' },
        { id: 5, title: 'Task 5', priority: '낮음', task_size: 'Extra Large' },
        { id: 6, title: 'Task 6', priority: '중간', task_size: 'Extra Large' },
        { id: 7, title: 'Task 7', priority: '낮음', task_size: 'Large' },
      ],
    };
  },
};
</script>

<style scoped>
.kanban-column-title {
  display: flex;
  margin-top: 20px;
  align-items: center;
  position: relative;
  height: 30px;
}

.square-icon {
  margin-left: 10px;
  font-size: 20px;
}

.title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 20px;
  font-weight: bold;
}

.title-underline {
  width: 80%;
  height: 1px;
  background-color: #6b9e9b;
  margin: 10px auto 0;
}

.kanban-card-list {
  margin-top: 10px;
  height: 700px;
  overflow-y: auto;
  padding: 10px;
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
