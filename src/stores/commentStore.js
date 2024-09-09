import { defineStore } from 'pinia';

export const useCommentStore = defineStore('commentStore', {
  state: () => ({
    comments: [],
  }),
  getters: {
    getComments(state) {
      return state.comments;
    },
  },
  actions: {
    // 코멘트 추가
    addComment(comment) {
      this.comments.push(comment); 
    },
    // 코멘트 리스트 설정
    setComment(comments) {
      this.commits = comments;
    },
    // 서버에서 코멘트를 가져오는 로직
    async fetchComments() {

    },
    // 서버에 코멘트를 저장하는 로직
    async saveComment(comment) {
      console.log(`${comment}를 서버에 저장합니다.`);
    }
  }
});
