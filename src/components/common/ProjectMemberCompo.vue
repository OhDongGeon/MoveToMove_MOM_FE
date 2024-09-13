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
            <round-button-item type="button" :width="180" :height="30" :borderRadius="5" :fontSize="13" @click.stop="addMemberInvite"> 참여자 초대 + </round-button-item>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <project-member-invite :isInviteModalOpen="isInviteModalOpen" @closeModal="closeModal" />
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue'; // Vue의 ref를 가져옵니다.
import axios from '@/api/axiosInstance';

import UserItem from '../common/combine/UserListItem.vue';
import ProjectMemberInvite from './ProjectMemberInvite.vue';

export default {
  components: {
    UserItem,
    ProjectMemberInvite,
  },
  props: {
    projectId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const members = ref([0]);
    const localUsers = ref([]);
    const isInviteModalOpen = ref(false);

    onMounted(() => {
      if (props.projectId) {
        fetchMembers(); // projectId가 존재할 때만 데이터를 조회합니다.
      }
    });

    // projectId가 변경될 때마다 멤버 조회를 다시 수행
    watch(
      () => props.projectId,
      (newProjectId) => {
        if (newProjectId) {
          fetchMembers(newProjectId);
        }
      },
    );

    const fetchMembers = async () => {
      try {
        if (props.projectId) {
          const response = await axios.get(`/api/projects/${props.projectId}/members`);
          console.log(response.data);

          localUsers.value = response.data;
        }
      } catch (e) {
        console.error('Error occurred during fetching users', e);
      }
    };

    // 프로젝트 멤버 초대 모달 열기
    const addMemberInvite = (event) => {
      event.stopPropagation(); // 이벤트 버블링 방지
      isInviteModalOpen.value = true;
    };

    // 프로젝트 멤버 초대 모달 닫기
    const closeModal = () => {
      isInviteModalOpen.value = false;
    };

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
