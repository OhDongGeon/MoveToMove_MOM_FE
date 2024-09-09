<template>
  <div class="user-item">
    <!-- Profile Image -->
    <ProfileImageItem :src="userData.profileUrl" :alt="userData.nickName" :width="40" :height="40" />

    <!-- User Nickname -->
    <span class="nickname">{{ userData.nickName }}</span>

    <!-- Leader Icon -->
    <v-icon v-if="userData.leaderYN === 'Y'" class="leader-icon">mdi-crown</v-icon>

    <!-- Dots Menu (for example purposes) -->
    <span class="dots-menu">⋮</span>
    <!-- <kebab-menu></kebab-menu> -->
  </div>
</template>

<script>
import { toRefs } from 'vue';
// import KebabMenu from '../KebabMenu.vue';
import ProfileImageItem from '../item/ProfileImageItem.vue';

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
    // KebabMenu,
  },
  setup(props) {
    const { user } = toRefs(props);

    // user를 userData라는 새로운 이름으로 반환
    return {
      userData: user,
    };
  },
};
</script>

<style scoped>
.user-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.nickname {
  margin-left: 10px;
  font-size: 16px;
  font-weight: bold;
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
