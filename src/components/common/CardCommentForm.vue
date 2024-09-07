<template>
  <div>
    <h3>코멘트 작성</h3>
    <div class="card-comment-form">
      <div class="header-container">
        <h3 class="header-title">작성</h3>
        <!-- 커스텀 버튼 컴포넌트를 사용하여 "등록" 버튼 -->
        <CustomButton :default-text="'등록'" :width="50" :height="20" :font-size="12" style="border: 1px solid white" @click="submitComment"></CustomButton>
      </div>
      <textarea v-model="newComment" placeholder="댓글을 작성하세요." class="comment-input" cols="30" rows="10"></textarea>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import CustomButton from '@/components/common/item/RoundButtonItem.vue';

export default {
  name: 'CardCommentForm',
  components: {
    CustomButton,
  },
  setup() {
    const newComment = ref('');

    // 댓글 제출 함수
    const submitComment = () => {
      console.log('댓글 내용: ', newComment.value);
      newComment.value = '';
    };
    return {
      newComment,
      submitComment,
    };
  },
};
</script>

<style scoped>
.card-comment-form {
  background-color: white;
  padding: 0;
  border: 1px solid #6b9e9b;
  border-radius: 8px;
  overflow: hidden;
}
.comment-input {
  width: 100%;
  height: 80px;
  margin: 0; /* 마진 제거하여 딱 붙도록 설정 */
  padding: 10px;
  border-radius: 4px;
  border: none; /* 테두리 제거 */
  border-top: 1px solid #6b9e9b; /* 상단 테두리 설정 */
  border-bottom-left-radius: 8px; /* 왼쪽 하단 모서리 둥글게 */
  border-bottom-right-radius: 8px; /* 오른쪽 하단 모서리 둥글게 */
  resize: none; /* 크기 조절 비활성화 */
  box-sizing: border-box; /* 패딩과 너비를 포함하여 계산 */
  outline: none;
}
/* 헤더 */
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #6b9e9b;
  padding: 5px 10px;
}
.header-title {
  color: white;
  font-size: 18px; /* 제목 글자 크기 */
  font-weight: bold;
  margin: 0;
}
</style>
