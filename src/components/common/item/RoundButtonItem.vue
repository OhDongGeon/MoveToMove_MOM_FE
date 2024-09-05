<template>
  <v-btn :style="buttonStyle">
    <slot class="defaultText">
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
    fontSize: {
      type: Number,
      default: 16, // 기본 글자 크기 (px)
    },
  },
  setup(props) {
    // props를 쉽게 사용하기 위해 구조 분해(destructuring)
    const { width, height, fontSize } = toRefs(props);

    // props에 따라 buttonStyle을 계산
    const buttonStyle = computed(() => {
      return {
        width: width.value + 'px',
        height: height.value + 'px',
        fontSize: fontSize.value + 'px', // 글자 크기 설정
        color: '#ffffff', // 글자 색상을 하얀색으로 설정
        backgroundImage: 'linear-gradient(to right, #5A6D8C, #112F4E)', // 그라데이션 적용
        borderRadius: '10px', // 둥근 모서리
        display: 'flex',
        alignItems: 'center', // 수직 중앙 정렬
        justifyContent: 'center', // 수평 중앙 정렬
        border: 'none', // 테두리 제거
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
