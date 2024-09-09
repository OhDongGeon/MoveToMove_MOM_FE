<template>
  <div class="mypage">
    <h1>칸반보드</h1>
    <div class="sub-content">
      <aside class="sidebar">
        <v-expansion-panels v-model="panel" multiple>
          <v-expansion-panel class="folder-contains">
            <v-expansion-panel-title class="folder-title">프로젝트</v-expansion-panel-title>
            <v-expansion-panel-text>
              <!-- treeData가 유효할 때만 Vue3Tree를 렌더링 -->
              <Vue3Tree
                :nodes="data"
                :search-text="searchText"
                :use-checkbox="false"
                :use-icon="true"
                :indentSize="10"
                :gap="5"
                use-row-delete
                @nodeExpanded="onNodeExpanded"
                @update:nodes="onUpdate"
                @nodeClick="onNodeClick"
                class="custom-node-class"
              >
                <template #iconActive>
                  <img src="../../assets/folders24.svg" alt="Folder Icon" width="12" height="12" />
                </template>
                <template #iconInactive>
                  <font-awesome-icon :icon="['fas', 'folder']" />
                </template>
              </Vue3Tree>
              <!-- 노드 추가를 위한 버튼 -->
              <round-button-item class="add-buttons" :width="180" :height="25" :borderRadius="5" :fontSize="13" @click="newProjectPage">프로젝트 생성 +</round-button-item>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <!-- 참여자 컴포넌트 -->
        <project-member-compo></project-member-compo>
      </aside>
      <main class="main-content">
        <div class="project-title">
          <label>프로젝트 1</label>
          <font-awesome-icon :icon="['fas', 'ellipsis']" ref="menuToggle" @click="toggleMenu" />
          <!-- 케밥 메뉴 -->
          <KebabProjectMenu :showMenu="showMenu" @closeMenu="closeMenu" isProjectLeader="Y" />
        </div>
        <div class="project-content">
          <div v-for="col in columns" :key="col.id" class="column">
            <!-- KanbanColumnCompo에 데이터 전달 -->
            <kanban-column :id="col.id" :title="col.title" :cards="col.cards" />
          </div>
        </div>
      </main>
    </div>
    <!-- <button @click="openKanbanCard">칸반카드 오픈</button> -->
  </div>
</template>

<script>
import { useNavigationStore } from '@/stores/navigationStore';
import { ref } from 'vue'; // Vue의 ref를 가져옵니다.
import { useRouter } from 'vue-router';
import Vue3Tree from 'vue3-tree';
import 'vue3-tree/dist/style.css';
import ProjectMemberCompo from '../common/ProjectMemberCompo.vue';
import KanbanColumn from './KanbanColumnCompo.vue';
import KebabProjectMenu from '../common/KebabProjectMenu.vue';

export default {
  name: 'KanbanBoard', // 컴포넌트 이름 정의
  components: {
    Vue3Tree, // Tree 컴포넌트 등록
    KanbanColumn,
    ProjectMemberCompo,
    KebabProjectMenu,
  },
  setup() {
    // ref를 사용하여 상태를 정의합니다.
    const panel = ref([0]); // 첫 번째 패널을 기본적으로 열려 있게 설정
    const navigationStore = useNavigationStore(); // Pinia store 사용
    const menuPosition = ref({ top: '0px', left: '0px' });

    const data = ref([
      {
        id: 1,
        label: '나만의 폴더',
        nodes: [
          {
            id: 2,
            label: '사이드 프로젝트',
            nodes: [
              {
                id: 4,
                label: '프로젝트 1',
              },
              {
                id: 5,
                label: '프로젝트 2',
              },
            ],
          },
        ],
      },
    ]);

    // 칸반 컬럼 데이터
    const columns = ref([
      {
        id: 1,
        title: 'Task',
        cards: [
          {
            id: 3,
            title: '화면 설계',
            priority: '중간',
            task_size: 'Medium',
            members: [
              {
                avatar: 'https://over-clock-s3.s3.ap-northeast-2.amazonaws.com//img/344b7017-c557-4624-9306-964c0bdcac2c.ea42ce6a.png',
              },
              {
                avatar: 'https://over-clock-s3.s3.ap-northeast-2.amazonaws.com//img/4b30c8ce-7d5e-4d29-8e6e-557173ad70f5.png',
              },
            ],
          },
          {
            id: 4,
            title: 'API 명세',
            priority: '중간',
            task_size: 'Medium',
            members: [
              {
                avatar: 'https://over-clock-s3.s3.ap-northeast-2.amazonaws.com//img/344b7017-c557-4624-9306-964c0bdcac2c.ea42ce6a.png',
              },
              {
                avatar: 'https://over-clock-s3.s3.ap-northeast-2.amazonaws.com//img/4b30c8ce-7d5e-4d29-8e6e-557173ad70f5.png',
              },
            ],
          },
          {
            id: 5,
            title: '기능 설계',
            priority: '중간',
            task_size: 'Medium',
            members: [
              {
                avatar: 'https://over-clock-s3.s3.ap-northeast-2.amazonaws.com//img/344b7017-c557-4624-9306-964c0bdcac2c.ea42ce6a.png',
              },
              {
                avatar: 'https://over-clock-s3.s3.ap-northeast-2.amazonaws.com//img/4b30c8ce-7d5e-4d29-8e6e-557173ad70f5.png',
              },
            ],
          },
          {
            id: 6,
            title: '구현 분담',
            priority: '중간',
            task_size: 'Medium',
            members: [
              {
                avatar: 'https://over-clock-s3.s3.ap-northeast-2.amazonaws.com//img/344b7017-c557-4624-9306-964c0bdcac2c.ea42ce6a.png',
              },
              {
                avatar: 'https://over-clock-s3.s3.ap-northeast-2.amazonaws.com//img/4b30c8ce-7d5e-4d29-8e6e-557173ad70f5.png',
              },
            ],
          },
          {
            id: 5,
            title: '게시글 CRUD',
            priority: '중간',
            task_size: 'Medium',
            members: [
              {
                avatar: 'https://over-clock-s3.s3.ap-northeast-2.amazonaws.com//img/344b7017-c557-4624-9306-964c0bdcac2c.ea42ce6a.png',
              },
              {
                avatar: 'https://over-clock-s3.s3.ap-northeast-2.amazonaws.com//img/4b30c8ce-7d5e-4d29-8e6e-557173ad70f5.png',
              },
            ],
          },
        ],
      },
      {
        id: 2,
        title: '진행중',
        cards: [
          {
            id: 2,
            title: '데이터베이스 설계',
            priority: '중간',
            task_size: 'Medium',
            members: [
              {
                avatar: 'https://over-clock-s3.s3.ap-northeast-2.amazonaws.com//img/344b7017-c557-4624-9306-964c0bdcac2c.ea42ce6a.png',
              },
              {
                avatar: 'https://over-clock-s3.s3.ap-northeast-2.amazonaws.com//img/4b30c8ce-7d5e-4d29-8e6e-557173ad70f5.png',
              },
            ],
          },
        ],
      },
      {
        id: 3,
        title: '완료',
        cards: [
          {
            id: 1,
            title: '주제 선정',
            priority: '중간',
            task_size: 'Medium',
            members: [
              {
                avatar: 'https://over-clock-s3.s3.ap-northeast-2.amazonaws.com//img/344b7017-c557-4624-9306-964c0bdcac2c.ea42ce6a.png',
              },
              {
                avatar: 'https://over-clock-s3.s3.ap-northeast-2.amazonaws.com//img/4b30c8ce-7d5e-4d29-8e6e-557173ad70f5.png',
              },
            ],
          },
        ],
      },
    ]);

    const router = useRouter();
    const searchText = ref('');
    const onNodeExpanded = (node, state) => {
      console.log('state: ', state);
      console.log('node: ', node);
    };

    const onUpdate = (nodes) => {
      console.log('nodes:', nodes);
    };

    const onNodeClick = (node) => {
      console.log(node);
    };

    const openKanbanCard = (idx) => {
      console.log(`칸반카드ID: ${idx}`);
      navigationStore.setActiveItem('mypage');
      router.push('kanbanCard');
    };
    const newProjectPage = () => {
      router.replace('/move-to-move/new-project');
    };

    // ref를 사용하여 상태를 정의합니다.
    const showMenu = ref(false);

    // 케밥 메뉴 토글 메소드
    const toggleMenu = (event) => {
      const target = event.target;
      const rect = target.getBoundingClientRect();

      // 메뉴 위치를 클릭된 아이콘의 아래에 설정
      menuPosition.value = {
        top: `${rect.bottom + window.scrollY}px`, // 아이콘의 bottom + scroll 위치
        left: `${rect.left + window.scrollX}px`, // 아이콘의 left + scroll 위치
      };
      showMenu.value = !showMenu.value;
    };

    const closeMenu = () => {
      showMenu.value = false;
    };

    return {
      panel,
      data,
      columns, // 칸반 컬럼 데이터
      searchText,
      onNodeExpanded,
      onUpdate,
      onNodeClick,
      openKanbanCard,
      newProjectPage,
      showMenu,
      toggleMenu,
      closeMenu,
      menuPosition,
    };
  },
};
</script>

<style scoped>
/* MyPageCompo 스타일 */
.mypage {
  background-color: #f0f8ff;
  border-radius: 8px;
  height: 970px; /* 부모 컨테이너의 고정된 높이를 픽셀 값으로 설정 */
  display: flex;
  flex-direction: column; /* 칸반보드 제목과 컨텐츠를 세로로 배치 */
}

h1 {
  font-size: 32px;
  text-align: left;
  margin: 0;
}

/* sub-content를 플렉스 컨테이너로 사용하여 좌우 레이아웃을 설정합니다. */
.sub-content {
  display: flex; /* 플렉스 박스를 사용하여 좌우 레이아웃을 설정 */
  gap: 10px; /* 사이드바와 메인 컨텐츠 사이의 간격 설정 */
  margin-top: 20px;
  width: 100%;
  flex-grow: 1; /* sub-content가 남은 공간을 차지하도록 설정 */
  height: calc(100% - 20px); /* 패딩과 상단 여백을 고려한 높이 설정 */
}

/* 사이드바 스타일 */
.sidebar {
  width: 250px; /* 사이드바의 고정된 너비 설정 */
  background-color: #ffffff; /* 연한 배경색 */
  border-radius: 10px;
  border: 1.5px solid #6b9e9b;
  height: 100%; /* 부모 폼 높이에 맞게 100%로 설정 */
  padding: 5px;
}

.folder-contains {
  border: 1.5px solid #6b9e9b;
  border-radius: 10px;
}

.folder-title {
  font-weight: bold;
  font-size: 15px;
}

/* 메인 컨텐츠 스타일 */
.main-content {
  flex-grow: 1; /* 메인 컨텐츠가 나머지 공간을 채우도록 설정 */
  background-color: #ffffff; /* 흰색 배경색 */
  border-radius: 10px;
  border: 1.5px solid #6b9e9b;
  height: 100%; /* 부모 폼 높이에 맞게 100%로 설정 */
  padding: 5px;
}

.project-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 22px;
  font-weight: bold;
  height: 45px;
  border-bottom: 1.5px solid #6b9e9b;
  border-radius: 10px;
  padding: 0 20px;
  margin-top: 5px;
}

.project-content {
  display: flex;
  overflow-x: auto; /* 넘치는 경우 가로 스크롤 생성 */
  gap: 10px; /* 컬럼들 사이의 간격 */
  margin-top: 10px;
  height: 92%;
}

.column {
  flex: 0 0 32.7%;
  height: 100%;
  background: #ffffff;
  border: 1px solid #6b9e9b;
  border-radius: 10px;
}

/* Deep Selector를 사용하여 Vue3Tree의 내부 스타일을 덮어씁니다. */
::v-deep .custom-node-class {
  margin: 0px;
  padding: 0px;
  font-weight: bold;
  font-size: 12px;
  color: #5a6d8c;
}

.add-buttons {
  margin-top: 30px;
}
</style>
