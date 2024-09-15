<template>
  <div>
    <div class="comment-label">
      <img :src="user.profileUrl" alt="" class="avatar" />
      <h3 class="comment-header">코멘트 작성</h3>
    </div>

    <div class="card-comment-form">
      <div class="header-container">
        <h3 class="header-title">작성</h3>
        <!-- 커스텀 버튼 컴포넌트를 사용하여 "등록" 버튼 -->
        <round-button-item :width="50" :height="25" :borderRadius="5" :fontSize="12" @click="submitComment">등록</round-button-item>
      </div>
      <textarea v-model="newComment" placeholder="댓글을 작성하세요." class="comment-input" @input="autoResize" ref="textarea"></textarea>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/memberStore'; // Pinia 스토어 가져오기
import { useCommentStore } from '@/stores/commentStore';

export default {
  name: 'CardCommentForm',

  setup() {
    const newComment = ref('');
    const textarea = ref(null); // textarea 요소 참조
    const avatar = 'https://over-clock-s3.s3.ap-northeast-2.amazonaws.com//img/60409475-953c-4658-8fb4-7807c0c379a0.jpg';

    // Pinia 스토어 사용
    const authStore = useAuthStore();
    // Pinia 스토어 사용
    const commentStore = useCommentStore();

    // 유저 정보 가져오기 (Pinia 스토어의 getter 사용)
    const user = computed(() => authStore.getUser);

    // 날짜 포맷 함수
    function formatDate(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    // 댓글 제출 함수
    const submitComment = () => {
      if (newComment.value.trim()) {
        const comment = {
          author: user.value.nickName || '피니아 유저 오류',
          avatar: user.value.profileUrl,
          content: newComment.value,
          date: formatDate(new Date()), // 포맷된 날짜 사용
        };
        commentStore.addComment(comment);
        newComment.value = '';
      }
    };

    const autoResize = () => {
      textarea.value.style.height = 'auto'; // 높이 초기화
      textarea.value.style.height = `${textarea.value.scrollHeight}px`; // 내용에 맞게 높이 조정
    };

    // onMounted 훅에서 autoResize를 초기화
    onMounted(() => {
      if (textarea.value) {
        autoResize();
      }
    });

    return {
      newComment,
      submitComment,
      avatar,
      user,
      autoResize,
      textarea,
    };
  },
};
</script>

<style scoped>
.comment-label {
  display: flex;
  align-items: center;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin: 0px 20px 5px 0px;
  border: 1px solid #6b9e9b;
}

.comment-header {
  font-size: 20px;
  font-weight: bold;
}

.card-comment-form {
  text-align: left;
  border-radius: 5px;
  background-color: white;
  border: 1px solid #6b9e9b;
  overflow: hidden;
}

.header-container {
  display: flex;
  height: 35px;
  padding: 0 10px;
  justify-content: space-between;
  align-items: center;
  background-color: #6b9e9b;
}

.header-title {
  color: white;
  font-size: 17px;
  font-weight: bold;
}

.comment-input {
  width: 100%;
  padding: 10px;
  font-size: 13px;
  background-color: white;
  outline: none;
  resize: none;
  overflow: hidden;
}
</style>
