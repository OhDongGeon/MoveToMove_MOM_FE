<template>
  <div>
    <h3>코멘트 작성</h3>
    <div class="card-comment-form">
      <textarea v-model="newComment" placeholder="댓글을 작성하세요." class="comment-input" cols="30" rows="10"></textarea>
      <button class="submit-buttom">등록</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
export default {
  name: 'CardCommentForm',
  setup() {
    const newComment = ref('');
    return {
      newComment,
    };
  },
};
</script>

<style scoped>
.card-comment-form {
  background-color: white;
  padding: 15px;
  border: 1px solid #6b9e9b;
  border-radius: 8px;
}
.comment-input {
  width: 100%;
  height: 80px;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
}
</style>
