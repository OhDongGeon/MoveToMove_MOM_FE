<template>
  <v-btn :class="['rounded-pill', 'sizeTest']" :color="color" :style="buttonStyle">
    <slot>
      {{ defaultText }}
    </slot>
  </v-btn>
</template>

<script>
import { computed, toRefs } from 'vue';

export default {
  props: {
    defaultText: {
      type: String,
      default: '기본값',
    },
    width: {
      type: Number,
      default: 380,
    },
    height: {
      type: Number,
      default: 72,
    },
  },
  setup(props) {
    // props를 쉽게 사용하기 위해 구조 분해(destructuring)
    const { width, height } = toRefs(props);

    // props에 따라 buttonStyle을 계산
    const buttonStyle = computed(() => {
      return {
        width: width.value + 'px',
        height: height.value + 'px',
      };
    });

    return {
      buttonStyle,
    };
  },
};
</script>

<style scoped>
.sizeTest {
  padding: 0 !important;
  position: relative;
}
</style>
