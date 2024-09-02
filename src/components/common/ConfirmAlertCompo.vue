<template>
  <div>
    <div v-if="showAlert" class="alert-overlay">
      <v-alert class="rounded-xl text-center" color="#3ac6c5" elevation="14" prominent type="success" dense @input="hideAlert">
        <slot>
          <h4>인증번호가 발송되었습니다.</h4>
        </slot>
      </v-alert>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showAlert: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    hideAlert() {
      this.$emit('hide-alert');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/variables';
</style>

<style scoped>
.alert-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.rounded-xl {
  width: 350px;
  height: 65px;
}
</style>
