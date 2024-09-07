<template>
  <img
    :src="src"
    :alt="alt"
    :style="avatarStyle"
    class="avatar"
  />
</template>

<script>
import { computed, toRefs } from 'vue';

export default {
  props: {
    src: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default: '',
    },
    width: {
      type: Number,
      default: 24,
    },
    height: {
      type: Number,
      default: 24,
    },
  },
  setup(props) {
    // props를 쉽게 사용하기 위해 구조 분해(destructuring)
    const { width, height } = toRefs(props);

    // width와 height를 기반으로 아바타 스타일을 계산
    const avatarStyle = computed(() => {
      return {
        width: width.value + 'px',
        height: height.value + 'px',
      };
    });

    return {
      avatarStyle,
      ...toRefs(props),  // props를 반환하여 템플릿에서 직접 사용 가능하게 함
    };
  },
};
</script>

<style scoped>
.avatar {
  border-radius: 50%;
  object-fit: cover;
}
</style>