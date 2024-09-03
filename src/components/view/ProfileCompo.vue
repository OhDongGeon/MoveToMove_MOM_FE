<template>
  <div class="mypage">
    <h1>마이페이지 > 정보수정</h1>

    <div class="sub-content"><font-awesome-icon :icon="['fas', 'pen']" /></div>
  </div>
</template>

<script>
export default {
  name: 'ProfileCompo',
};
</script>

<style scoped>
h1 {
  text-align: left;
}

.sub-content {
  height: auto;
  margin-top: 20px;
  border-radius: 10px;
  border: 1.5px solid #6b9e9b;
  background: #ffffff;
}
</style>
