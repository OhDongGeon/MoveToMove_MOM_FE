<template>
  <div >
    <h2>칸반 카드 내용</h2>
    <div class="card-content">
      <p>칸반 보드는 작업을 시작하고, 진행 중인 작업을 계획하여 효율을 최대화하는 애자일 프로젝트 관리 도구입니다.</p>
    </div>
    
  </div>
</template>

<script>
export default {
  name: 'CardContent',
};
</script>

<style scoped>
div{
  text-align: left;
}
.card-content {
  background-color: white;
  /* 테두리 색  */
  border: 1px solid #6b9e9b;

}
</style>
