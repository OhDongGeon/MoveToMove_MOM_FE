<template>
  <div class="card-comments">
    <h3>코멘트</h3>
    <div class="comment" v-for="comment in commentList" :key="comment.commentId">
      <div class="comment-header">
        <ProfileImage :src="comment.profileUrl" :alt="comment.nickName + ' Avatar'" :width="25" :height="25" class="avatar" />
        <div class="comment-info">
          <span class="author">{{ comment.nickName }}</span>
          <span class="date">{{ comment.date }}</span>
          <button v-if="comment.nickName === user.nickName" class="edit-button">수정</button>
          <button v-if="comment.nickName === user.nickName" class="delete-button">삭제</button>
        </div>
        <div class="comment-actions">팀원</div>
      </div>
      <p class="comment-content">{{ comment.content }}</p>
    </div>
  </div>
</template>

<script>
import { useCommentStore } from '@/stores/commentStore';
import { useAuthStore } from '@/stores/memberStore';
import { computed } from 'vue';
import ProfileImage from '@/components/common/item/ProfileImageItem.vue';

export default {
  name: 'CardComments',
  components: {
    ProfileImage,
  },
  props: {
    commentList: {
      type: Array,
      required: true,
    },
  },
  setup() {
    const commentStore = useCommentStore();
    const authStore = useAuthStore();

    // 스토어에서 코멘트 목록을 가져오기
    const comments = computed(() => commentStore.getComments || null);
    // 현재 로그인된 사용자 가져오기
    const user = computed(() => authStore.getUser);
    return {
      comments,
      user,
    };
  },
};
</script>

<style scoped>
h3 {
  text-align: left;
  font-size: 18px;
  margin: 5px;
}

.comment {
  text-align: left;
  border-radius: 5px;
  margin-bottom: 20px;
  background-color: white;
  border: 1px solid #6b9e9b;
  overflow: hidden; /* 모서리 넘침 방지 */
}

.comment-header {
  display: flex;
  height: 35px;
  padding: 0 10px;
  justify-content: flex-end;
  align-items: center;
  background-color: #6b9e9b;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
  border: 2px solid #ffffff;
}

.comment-info {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.author {
  color: white;
  margin-right: 10px;
}

.date {
  font-size: 12px;
  color: white; /* 날짜 색상 */
  margin: 2px 10px 0px 0px;
}

.edit-button,
.delete-button {
  color: white;
  padding: 2px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 10px;
  margin-right: 5px;
  border: 1px solid white;
}

.edit-button:hover,
.delete-button:hover {
  background-color: white;
  color: #6b9e9b;
}

.comment-actions {
  margin-left: auto; /* 버튼을 오른쪽으로 정렬 */
  color: white;
  padding: 2px 10px;
  border-radius: 5px;
  font-size: 12px;
  border: 1px solid #ffffff;
}

.comment-content {
  padding: 10px;
  margin-top: 5px;
  font-size: 14px;
}
</style>
