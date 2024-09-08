<template>
  <v-expansion-panels v-model="members" multiple>
    <v-expansion-panel class="member-contains">
      <v-expansion-panel-title>
        <div class="header">
          <span>참여자({{ localUsers.length }})</span>
        </div>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <div class="user-list">
          <UserItem v-for="(user, index) in localUsers" :key="index" :user="user" />
        </div>
        <!-- 초대 버튼 -->
        <div class="invite-button">
          <round-button-item type="button" :width="180" :height="30" :borderRadius="5" :fontSize="13">
            프로젝트 초대 +
          </round-button-item>
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import { ref } from 'vue'; // Vue의 ref를 가져옵니다.
import UserItem from '../common/combine/UserListItem.vue';

export default {
  components: {
    UserItem,
  },
  props: {
    users: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const members = ref([0]);

    // 로컬 데이터로 users 배열을 생성, 이름을 localUsers로 변경
    const localUsers = ref([
      {
        id: 1,
        nickName: '피카츄',
        profileUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent('pikachu')}&background=random`,
        leaderYN: 'Y',
      },
      {
        id: 2,
        nickName: '파이리',
        profileUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent('charmander')}&background=random`,
        leaderYN: 'N',
      },
      {
        id: 3,
        nickName: '메타몽',
        profileUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent('ditto')}&background=random`,
        leaderYN: 'N',
      },
      {
        id: 4,
        nickName: '팬텀',
        profileUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent('phantom')}&background=random`,
        leaderYN: 'N',
      },
    ]);

    return {
      members,
      localUsers, // 로컬 users 배열을 localUsers로 반환
    };
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.member-contains {
  border: 1.5px solid #6b9e9b;
  border-radius: 10px;
  margin-top: 10px;
}

.user-list {
  padding: 8px 0;
}

.invite-button {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
</style>
