<template>
  <div class="kebab-menu" v-if="showMenu" ref="menu">
    <div class="menu-item" v-if="isProjectLeader === 'Y'" @click="manage">
      <font-awesome-icon :icon="['fas', 'gear']" class="icon" />
      <span class="menu-text">프로젝트 관리</span>
    </div>
    <div class="menu-item bracket" @click="leave">
      <font-awesome-icon :icon="['fas', 'right-from-bracket']" class="icon" />
      <span class="menu-text">프로젝트 나가기</span>
    </div>

    <alert-ok-cancel
      :isVisible="isModalVisible"
      @close="closeModal"
      message="해당 프로젝트를 나가시겠습니까?"
      locationFlag="project"
    >
    </alert-ok-cancel>
  </div>
</template>

<script>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import AlertOkCancel from './AlertOkCancel.vue';

export default {
  props: {
    showMenu: Boolean,
    isProjectLeader: {
      type: String,
      required: true,
    },
    locationFlag: {
      type: String,
      required: false,
    },
  },
  components: {
    AlertOkCancel,
  },
  emits: ['closeMenu'],
  setup(props, { emit }) {
    const router = useRouter();
    const isMenuReadyToClose = ref(false); // 외부 클릭 감지
    const menu = ref(null); // 메뉴 요소에 대한 참조
    const isModalVisible = ref(false); // 모달의 표시 여부

    // 프로젝트 관리
    const manage = () => {
      // router.push({ name: '/move-to-move/manage-project', params: { projectId: props.projectId } }); // 페이지 이동
      router.replace('/move-to-move/manage-project');
    };

    // 프로젝트 나가기
    const leave = () => {
      isModalVisible.value = true;
    };

    // 닫기
    const closeModal = () => {
      isModalVisible.value = false;
    };

    // 외부 클릭 감지 준비
    watch(
      () => props.showMenu,
      (newVal) => {
        if (newVal) {
          setTimeout(() => {
            isMenuReadyToClose.value = true;
          }, 100);
        } else {
          isMenuReadyToClose.value = false;
        }
      },
    );

    // 외부 클릭 시 닫기
    const handleClickOutside = (event) => {
      if (!isMenuReadyToClose.value) {
        return;
      }
      if (menu.value && !menu.value.contains(event.target)) {
        emit('closeMenu');
      }
    };

    // 전역 클릭 이벤트 등록
    onMounted(() => {
      window.addEventListener('click', handleClickOutside);
    });

    // 전역 클릭 이벤트 제거
    onBeforeUnmount(() => {
      window.removeEventListener('click', handleClickOutside);
    });

    return {
      menu,
      isMenuReadyToClose,
      isModalVisible,
      manage,
      leave,
      closeModal,
    };
  },
};
</script>

<style scoped>
.kebab-menu {
  position: absolute;
  border-radius: 10px;
  width: 220px;
  background-color: #ffffff;
  border: 1.5px solid #6b9e9b;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  top: 164px;
  right: 20px;
  z-index: 1000;
  padding: 10px 20px;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 0;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.menu-item:hover {
  transform: scale(1.05);
}

.menu-text {
  margin-left: 10px;
  text-align: right;
  flex-grow: 1;
}

.bracket {
  color: #d63f3f;
}
</style>
