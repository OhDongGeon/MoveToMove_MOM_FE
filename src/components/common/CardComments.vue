<template>
  <div class="card-comments">
    <h3>코멘트</h3>
    <div class="comment" v-for="comment in comments" :key="comment.id">
      <div class="comment-header">
        <img :src="comment.avatar" alt="avatar" class="avatar" />
        <div class="comment-info">
          <span class="author">{{ comment.author }}</span>
          <span class="date">{{ comment.date }}</span>
          <button v-if="isAdmin" class="edit-button">수정</button>
          <button v-if="isAdmin" class="delete-button">삭제</button>
        </div>
        <div class="comment-actions">
          <p class="team-button">팀원</p> <!-- 정보 받아온 걸로  -->
        </div>
      </div>
      <p class="comment-content">{{ comment.content }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardComments',

  setup() {
    const isAdmin = true;

    const comments = [
      {
        id: 1,
        author: '파이어리',
        content:
          '칸반 보드는 작업을 시작하고, 진행 중인 작업을 계획하여 효율을 최대화하는 애자일 프로젝트 관리 도구입니다.',
        date: '2024-08-20 13:30',
        avatar: 'https://via.placeholder.com/40',
      },
      {
        id: 2,
        author: '팬텀',
        content: '워크플로우 시작과 관련된 설명이 추가될 예정입니다.',
        date: '2024-08-19 10:20',
        avatar: 'https://via.placeholder.com/40',
      },
    ];

    return {
      comments,
      isAdmin,
    };
  },
};
</script>

<style scoped>
.card-comments {
  text-align: left;
  padding: 10px;
  border-radius: 8px;
}

h3 {
  text-align: left;
  font-size: 18px;
  margin-bottom: 20px;
}

.comment {
  background-color: white;
  margin-bottom: 20px;
  border: 1px solid #6b9e9b;
  border-radius: 8px;
  padding: 0; /* 전체 패딩 제거 */
  overflow: hidden; /* 모서리 넘침 방지 */
}

.comment-header {
  display: flex;
  align-items: center;
  background-color: #6b9e9b; /* 상단 바 배경색 */
  padding: 5px 10px; /* 패딩 추가 */
  margin: 0; /* 여백 제거 */
  justify-content: space-between; /* 요소 간격 설정 */
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.comment-info {
  display: flex;
  flex-direction: row;

  align-items: center;
  gap: 8px;
}

.author {
  font-weight: bold;
  color: white; /* 작성자 이름 색상 */
  margin-bottom: 0;
}

.date {
  font-size: 12px;
  color: white; /* 날짜 색상 */
  margin-top: 0;
}

.comment-actions {
  display: flex;
  gap: 5px; /* 버튼 사이 간격 */
  margin-left: auto; /* 버튼을 오른쪽으로 정렬 */
}

.edit-button,
.delete-button {
  background-color: transparent;
  border: 2px solid white;
  color: white;
  padding: 3px 8px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
}
.team-button{
  border: 2px solid white;
  color: white;
  padding: 3px 8px;
  border-radius: 5px;
  font-size: 12px;
}
.edit-button:hover,
.delete-button:hover {
  background-color: white;
  color: #6b9e9b;
}

.comment-content {
  padding: 10px;
  margin-top: 10px;
  font-size: 14px;
}
</style>
