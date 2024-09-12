<template>
  <div>
    <v-expansion-panels v-model="members" multiple>
      <v-expansion-panel class="member-contains">
        <v-expansion-panel-title>
          <div class="header">
            <span>참여자 ({{ localUsers.length }})</span>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <div class="user-list">
            <UserItem v-for="(user, index) in localUsers" :key="index" :user="user" />
          </div>
          <!-- 초대 버튼 -->
          <div class="invite-button">
            <round-button-item type="button" :width="180" :height="30" :borderRadius="5" :fontSize="13" @click.stop="addMemberInvite">
              참여자 초대 +
            </round-button-item>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <project-member-invite :isInviteModalOpen="isInviteModalOpen" @closeModal="closeModal" />
  </div>
</template>

<script>
import { ref } from 'vue'; // Vue의 ref를 가져옵니다.
import UserItem from '../common/combine/UserListItem.vue';
import ProjectMemberInvite from './ProjectMemberInvite.vue';

export default {
  components: {
    UserItem,
    ProjectMemberInvite,
  },
  setup() {
    const members = ref([0]);
    const isInviteModalOpen = ref(false);

    // 프로젝트 멤버 초대 모달 열기
    const addMemberInvite = (event) => {
      event.stopPropagation(); // 이벤트 버블링 방지
      isInviteModalOpen.value = true;
    };

    // 프로젝트 멤버 초대 모달 닫기
    const closeModal = () => {
      isInviteModalOpen.value = false;
    };

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
      isInviteModalOpen, // 프로젝트 초대 모달 여부
      addMemberInvite, // 프로젝트 초대 함수
      closeModal, // 프로젝트 초대 모달 닫기
    };
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.member-contains {
  border-radius: 10px;
  margin-top: 10px;
}

.user-list {
  padding: 8px 0;
  max-height: 250px; /* 원하는 높이 설정 */
}

.invite-button {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
</style>
