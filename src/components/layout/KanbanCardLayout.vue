<template>
  <div>
    <!-- 카드 헤더 컴포넌트 -->
    <CardHeader></CardHeader>

    <!-- 구분선 -->
    <hr class="custom-divider" />

    <!-- 카드 내용 컴포넌트 -->
    <div class="card-content">
      <ContentCompo></ContentCompo>
    </div>
  </div>
</template>

<script>
import CardHeader from '@/components/common/CardHeader.vue';
import ContentCompo from '@/components/view/CardOpenCompo.vue';
export default {
  name: 'KanbanCardCompo',
  components: {
    CardHeader,
    ContentCompo,
  },

  setup() {
    return {};
  },
};
</script>

<style>
.custom-divider {
  border: none;
  border-top: 3px solid #6b9e9b;
  margin-top: 10px;
}
</style>
