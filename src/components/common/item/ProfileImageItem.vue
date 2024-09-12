<template>
  <img :src="src" :alt="computedAlt" :style="avatarStyle" class="avatar" />
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
    const { width, height, alt } = toRefs(props); // profileUrl은 따로 뽑지 않음

    // width와 height를 기반으로 아바타 스타일을 계산
    const avatarStyle = computed(() => {
      return {
        width: width.value + 'px',
        height: height.value + 'px',
      };
    });

    // alt가 빈 문자열일 경우 기본값 제공
    const computedAlt = computed(() => alt.value || 'User Avatar');

    return {
      avatarStyle,
      computedAlt,
      ...toRefs(props), // 여기에서 profileUrl을 포함한 모든 props 반환
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
