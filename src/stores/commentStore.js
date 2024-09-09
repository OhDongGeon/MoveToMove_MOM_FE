import { defineStore } from 'pinia';

export const useCommentStore = defineStore('commentStore', {
  state: () => ({
    comments: [
      {
        id: 1,
        author: '파이어리',
        content: '칸반 보드는 작업을 시작하고, 진행 중인 작업을 계획하여 효율을 최대화하는 애자일 프로젝트 관리 도구입니다.',
        date: '2024-08-20 13:30',
        avatar: 'https://over-clock-s3.s3.ap-northeast-2.amazonaws.com//img/5e56fa91-f87d-4f4b-86f0-c46d5cbaace4.png',
      },
      {
        id: 2,
        author: '팬텀',
        content: '워크플로우 시작과 관련된 설명이 추가될 예정입니다.',
        date: '2024-08-19 10:20',
        avatar: 'https://over-clock-s3.s3.ap-northeast-2.amazonaws.com//img/60409475-953c-4658-8fb4-7807c0c379a0.jpg',
      },
    ],
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
