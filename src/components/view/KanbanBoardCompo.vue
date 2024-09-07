<template>
  <div class="mypage">
    <h1>칸반보드</h1>
    <div class="sub-content">
      <aside class="sidebar">
        <v-expansion-panels v-model="panel" multiple>
          <v-expansion-panel>
            <v-expansion-panel-title>프로젝트</v-expansion-panel-title>
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
              <round-button-item class="add-buttons" :width="180" :height="30" @click="newProjectPage">프로젝트 생성 +</round-button-item>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </aside>
      <main class="main-content">
        <v-card>
          <v-card-content> 여기에 이제 content를 개발하세요 </v-card-content>
        </v-card>
        <button @click="openKanbanCard">칸반카드 오픈</button>
      </main>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'; // Vue의 ref를 가져옵니다.
import { useRouter } from 'vue-router';
import Vue3Tree from 'vue3-tree';
import 'vue3-tree/dist/style.css';
import { useNavigationStore } from '@/stores/navigationStore';
export default {
  name: 'KanbanBoard', // 컴포넌트 이름 정의
  components: {
    Vue3Tree, // Tree 컴포넌트 등록
  },
  setup() {
    // ref를 사용하여 상태를 정의합니다.
    const panel = ref([0]); // 첫 번째 패널을 기본적으로 열려 있게 설정
    const navigationStore = useNavigationStore(); // Pinia store 사용

    const data = ref([
      {
        id: 1,
        label: 'Electronics',
        nodes: [
          {
            id: 2,
            label: 'Computers',
            nodes: [
              {
                id: 4,
                label: 'Laptops',
              },
              {
                id: 5,
                label: 'Desktops',
              },
            ],
          },
          {
            id: 3,
            label: 'Mobile Phones',
            nodes: [
              {
                id: 6,
                label: 'Smartphones',
                nodes: [
                  {
                    id: 8,
                    label: 'Android',
                  },
                  {
                    id: 9,
                    label: 'iOS',
                  },
                ],
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

    return {
      panel,
      data,
      searchText,
      onNodeExpanded,
      onUpdate,
      onNodeClick,
      openKanbanCard,
      newProjectPage,
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
  border: 1px solid #000;
  display: flex;
  flex-direction: column; /* 칸반보드 제목과 컨텐츠를 세로로 배치 */
}

h1 {
  font-size: 32px;
  text-align: left;
  border: 1px solid #000;
  margin: 0;
}

/* sub-content를 플렉스 컨테이너로 사용하여 좌우 레이아웃을 설정합니다. */
.sub-content {
  display: flex; /* 플렉스 박스를 사용하여 좌우 레이아웃을 설정 */
  gap: 10px; /* 사이드바와 메인 컨텐츠 사이의 간격 설정 */
  margin-top: 20px;
  width: 100%;
  flex-grow: 1; /* sub-content가 남은 공간을 차지하도록 설정 */
  border-radius: 8px;
  border: 1px solid #ffffff;
  height: calc(100% - 20px); /* 패딩과 상단 여백을 고려한 높이 설정 */
}

/* 사이드바 스타일 */
.sidebar {
  width: 250px; /* 사이드바의 고정된 너비 설정 */
  background-color: #ffffff; /* 연한 배경색 */
  border-radius: 10px;
  border: 1px solid #6b9e9b;
  height: 100%; /* 부모 폼 높이에 맞게 100%로 설정 */
  padding: 5px;
}

/* 메인 컨텐츠 스타일 */
.main-content {
  flex-grow: 1; /* 메인 컨텐츠가 나머지 공간을 채우도록 설정 */
  background-color: #ffffff; /* 흰색 배경색 */
  border-radius: 10px;
  border: 1px solid #6b9e9b;
  height: 100%; /* 부모 폼 높이에 맞게 100%로 설정 */
}

/* Deep Selector를 사용하여 Vue3Tree의 내부 스타일을 덮어씁니다. */
::v-deep .custom-node-class {
  margin: 0px;
  padding: 0px;
  font-weight: bold;
  font-size: 12px;
  color: purple;
}

.add-buttons {
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  background: linear-gradient(135deg, #5a6d8c, #112f4e);
  border-radius: 10px;
  margin-top: 10px;
}
</style>
