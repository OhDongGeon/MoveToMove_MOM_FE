<template>
  <div class="card-comments">
    <h3>코멘트</h3>
    <div class="comment" v-for="comment in comments" :key="comment.id">
      <p>
        <strong>{{ comment.author }}</strong
        >: {{ comment.content }}
      </p>
      <p>
        <small>{{ comment.date }}</small>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardComments',

  setup() {
    const comments = [
      { id: 1, author: '파이어리', content: '칸반 보드는 작업을 ...', date: '2024-08-20 13:30' },
      { id: 2, author: '팬텀', content: '워크플로우 시작과 ...', date: '2024-08-19 10:20' },
    ];

    return {
      comments,
    };
  },
};
</script>

<style>
h3 {
  text-align: left;
}
.card-comments {
  text-align: left;
}
.comment {
  background-color: white;
  margin-bottom: 14px;
  border: 1px solid #6b9e9b;
  border-radius: 8px;
  padding: 10px;
}
</style>
