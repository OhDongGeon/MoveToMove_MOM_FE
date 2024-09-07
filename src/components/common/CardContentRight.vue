<template>
  <div>
    <div class="assign-details">
      <p><strong>담당자:</strong> <span>{{ assignee.name }}</span></p>
      <p><strong>우선순위:</strong> <span>{{ assignee.priority }}</span></p>
      <p><strong>작업크기:</strong> <span>{{ assignee.size }}</span></p>
      <p><strong>시작날짜:</strong> <span>{{ assignee.startDate }}</span></p>
      <p><strong>종료날짜:</strong> <span>{{ assignee.endDate }}</span></p>
    </div>
    <!-- 카드 삭제 버튼 -->
    <button class="delete-button" @click="deleteCard">카드 삭제</button>
  </div>  
</template>

<script>
export default {
  name: 'AssignInfo',

  setup() {
    const assignee = {
      name: '닉네임',
      priority: '중간',
      size: 'Large',
      startDate: '2024-08-13',
      endDate: '2024-08-23',
    };

    // 카드 삭제 함수
    const deleteCard = () => {
      console.log('카드가 삭제되었습니다');
    }
    return {
      assignee,
      deleteCard
    };
  }
}
</script>

<style scoped>
.assign-details {
  background-color:white;
  padding: 20px;
  border: 1px solid #6b9e9b;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px; /* 카드 삭제 버튼과의 간격 */
}
.assign-details p {
  margin: 10px 0;
  font-size: 14px;
}

</style>