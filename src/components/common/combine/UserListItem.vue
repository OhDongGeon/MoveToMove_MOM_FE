<template>
  <div class="user-item">
    <!-- 사용자 이미지 -->
    <ProfileImageItem :src="userData.profileUrl" :alt="userData.nickName" :width="40" :height="40" />

    <!-- 닉네임 -->
    <span class="nickname">{{ userData.nickName }}</span>
    <font-awesome-icon :icon="['fas', 'crown']" class="leader-icon" v-if="userData.leaderYN === 'Y'" />
    <!-- <v-icon v-if="userData.leaderYN === 'Y'" class="leader-icon">mdi-crown</v-icon> -->
    <!-- 매뉴 -->
    <font-awesome-icon :icon="['fas', 'ellipsis-vertical']" class="dots-menu" ref="dotsMenuIcon" v-if="userData.leaderYN === 'N'" @click="kebabMenu" />

    <KebabMemberMenu :showMenu="showMenu" @closeMenu="closeMenu" :isProjectLeader="userData.leaderYN" />
  </div>
</template>

<script>
import { ref, toRefs } from 'vue';
import ProfileImageItem from '../item/ProfileImageItem.vue';
import KebabMemberMenu from '../KebabMemberMenu.vue';

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
</style>
