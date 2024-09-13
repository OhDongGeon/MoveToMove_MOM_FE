<template>
  <div class="user-item">
    <!-- 사용자 이미지 -->
    <ProfileImageItem :src="userData.profileUrl" :alt="userData.nickName" :width="40" :height="40" />

    <!-- 닉네임 -->
    <span class="nickname">{{ userData.nickName }}</span>
    <!-- 팀장 여부 -->
    <font-awesome-icon :icon="['fas', 'crown']" class="leader-icon" v-if="userData.projectLeaderYN === 'Y'" />

    <!-- 매뉴 -->
    <font-awesome-icon
      :icon="['fas', 'ellipsis-vertical']"
      class="dots-menu"
      ref="dotsMenuIcon"
      v-if="userData.projectLeaderYN === 'N' && userData.memberId !== authStore.user.memberId"
      @click="kebabMenu"
    />

    <KebabMemberMenu :showMenu="showMenu" @closeMenu="closeMenu" :isProjectLeader="userData.projectLeaderYN" class="kebab-menu" />
  </div>
</template>

<script>
import { ref, toRefs } from 'vue';
import ProfileImageItem from '../item/ProfileImageItem.vue';
import KebabMemberMenu from '../KebabMemberMenu.vue';

import { useAuthStore } from '@/stores/memberStore'; // Pinia 스토어에서 유저 정보 가져오기

export default {
  name: 'UserItem',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  components: {
    ProfileImageItem,
    KebabMemberMenu,
  },
  setup(props) {
    const { user } = toRefs(props);
    const showMenu = ref(false);

    // Pinia 스토어 사용
    const authStore = useAuthStore(); // authStore를 가져옵니다.

    // 케밥 메뉴
    const kebabMenu = () => {
      showMenu.value = !showMenu.value;
    };

    // 케밥 메뉴 닫기
    const closeMenu = () => {
      showMenu.value = false;
    };

    // user를 userData라는 새로운 이름으로 반환
    return {
      userData: user,
      authStore,
      showMenu,
      kebabMenu,
      closeMenu,
    };
  },
};
</script>

<style scoped>
.user-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  font-weight: bold;
  position: relative;
  z-index: 9999; /* 스크롤바보다 높은 z-index */
}

.nickname {
  margin-left: 10px;
  font-size: 16px;
}

.leader-icon {
  color: gold;
  margin-left: 8px;
}

.dots-menu {
  margin-left: auto;
  cursor: pointer;
}

.kebab-menu {
  z-index: 9999; /* z-index 값을 높게 설정하여 메뉴가 상단에 표시되도록 */
}
</style>
