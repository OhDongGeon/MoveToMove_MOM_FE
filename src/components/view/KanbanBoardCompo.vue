<template>
  <div class="mypage">
    <h1>칸반보드</h1>
    <div class="sub-content">
      <aside class="sidebar">
        <v-expansion-panels v-model="panel" multiple>
          <v-expansion-panel class="folder-contains panel-flex">
            <!-- 여기서 panel-flex 클래스로 flex 설정 -->
            <v-expansion-panel-title class="folder-title">프로젝트</v-expansion-panel-title>
            <v-expansion-panel-text class="panel-text">
              <div class="tree-container">
                <!-- 트리뷰에 draggable을 적용 -->
                <draggable v-model="folderStore.folderData" :move="checkMove" group="folders" item-key="id" @end="onDragEnd">
                  <template #item="{ element }">
                    <v-treeview
                      :items="[element]"
                      activatable
                      open-on-click
                      item-key="id"
                      item-text="title"
                      item-children="children"
                      v-model="open"
                      transition
                      @click:open="folderClick"
                    >
                      <!-- 폴더 아이콘 표시 -->
                      <template v-slot:prepend="{ item }">
                        <v-icon @click="onNodeClick(item)" :color="item.children ? '#ff5722' : '#2196f3'">{{
                          item.children ? 'mdi-folder' : 'mdi-clipboard-text'
                        }}</v-icon>
                      </template>
                    </v-treeview>
                  </template>
                </draggable>

                <!-- 폴더 생성 시 보여줄 input 박스 -->
                <template v-if="creatingFolder">
                  <div class="new-folder">
                    <img src="../../assets/folders24.svg" alt="New Folder Icon" width="14" height="14" style="margin-right: 10px" />
                    <input
                      type="text"
                      v-model="newFolderName"
                      @keydown.enter="addNewFolder"
                      @keydown.esc="cancelNewFolder"
                      @blur="cancelNewFolder"
                      placeholder="폴더 이름을 입력하세요"
                    />
                  </div>
                </template>
              </div>

              <!-- 노드 추가를 위한 버튼 -->
              <div class="add-buttons">
                <round-button-item :width="100" :height="30" :borderRadius="5" :fontSize="11" :fontColor="'#112f4e'" backgroundColor="etc" @click="newFolder"
                  >폴더 생성 +</round-button-item
                >
                <round-button-item :width="100" :height="30" :borderRadius="5" :fontSize="11" @click="newProjectPage">프로젝트 생성 +</round-button-item>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <!-- 참여자 컴포넌트 -->
        <project-member-compo v-if="projectId" :projectId="projectId" class="member"></project-member-compo>
      </aside>
      <main class="main-content">
        <!-- 데이터 로드가 완료된 후 렌더링 -->
        <div v-if="isDataLoaded && columns.length > 0">
          <div class="project-title">
            <div class="project-name">
              <label>{{ projectName }}</label>
            </div>
            <font-awesome-icon :icon="['fas', 'ellipsis']" ref="menuToggle" @click="toggleMenu" class="ellipsis" />
            <KebabProjectMenu v-if="showMenu !== null" :showMenu="showMenu" @closeMenu="closeMenu" isProjectLeader="Y" />
          </div>
          <div class="project-content">
            <draggable
              v-model="columns"
              group="columns"
              @end="onColumnDragEnd"
              class="columns-container"
              ghost-class="dragging"
              drag-class="drag-active"
              itemKey="id"
              :disabled="isCardOpen"
            >
              <template #item="{ element: col }">
                <div class="column" :key="col.kanbanColumnId">
                  <kanban-column
                    :id="col.kanbanColumnId"
                    :title="col.kanbanColumnName"
                    :cards="filteredCardsByColumn(col.kanbanColumnId)"
                    :isCardOpen="isCardOpen"
                    @card-move="onCardMove"
                    @open-card="openCard"
                    @close-card="closeCard"
                  />
                </div>
              </template>
            </draggable>
          </div>
        </div>
        <div v-else></div>
      </main>
    </div>
  </div>
</template>

<script>
import { useFolderStore } from '@/stores/folderStrore';
import { useNavigationStore } from '@/stores/navigationStore';
import { onMounted, ref } from 'vue'; // Vue의 ref를 가져옵니다.
import { useRouter } from 'vue-router';
import { VTreeview } from 'vuetify/labs/VTreeview';

import draggable from 'vuedraggable'; // VueDraggableNext를 import

import { useKanbanCardStore } from '@/stores/kanbanCardStore';
import { useKanbanColumnStore } from '@/stores/kanbanColumnStore';
import KebabProjectMenu from '../common/KebabProjectMenu.vue';
import ProjectMemberCompo from '../common/ProjectMemberCompo.vue';
import KanbanColumn from './KanbanColumnCompo.vue';
// import { useWebSocketStore } from '@/stores/webSocketStore';

export default {
  name: 'KanbanBoard', // 컴포넌트 이름 정의
  components: {
    KanbanColumn,
    ProjectMemberCompo,
    KebabProjectMenu,
    draggable, // 드래그 앤 드랍 컴포넌트 등록
    VTreeview,
  },
  setup() {
    const router = useRouter();

    // ref를 사용하여 상태를 정의합니다.
    const panel = ref([0]); // 첫 번째 패널을 기본적으로 열려 있게 설정
    const navigationStore = useNavigationStore(); // Pinia store 사용
    const kanbanColumnStore = useKanbanColumnStore(); // Pinia store 사용
    const kanbanCardStore = useKanbanCardStore();
    const folderStore = useFolderStore(); // 폴더 Pinia store 가져오기

    const columns = ref([]);
    const cards = ref([]);

    const open = ref([]);
    const active = ref([]);

    // folderData 가져오기
    const folderData = ref([]);

    // 프로젝트 아이디 변수
    const projectId = ref(0);

    // 프로젝트 리더 유무 변수
    const isProjectLeader = ref(false);

    // 프로젝트 명
    const projectName = ref('');

    // 컬럼 칸반 데이터 조회 v-if(66줄)
    const isDataLoaded = ref(false);

    // 화면 열렸을 때 onMounted
    onMounted(async () => {
      try {
        // 폴더 데이터 로드
        await folderStore.fetchFolders(); // 데이터를 Pinia에 저장
        folderData.value = folderStore.folderData; // Pinia store의 folderData를 ref에 저장
        // 프로젝트 구독을 위한 WebSocket 연결
        // if (projectId.value) {
        //   useWebSocketStore.connect(projectId.value);
        //   useWebSocketStore.stompClient.subscribe(`/topic/project/${projectId.value}`, (message) => {
        //     handleIncomingMessage(projectId.value, JSON.parse(message.body)); // WebSocket 메시지 수신 후 처리
        //   });
        // }
      } catch (error) {
        console.error('데이터 로드 중 오류 발생', error);
      }
    });

    // const handleIncomingMessage = (projectId, message) => {
    //   if (message.type === 'CARD_MOVE') {
    //     const { cardId, toIndex, toColumnId } = message;
    //     const movedCardIndex = cards.value.findIndex((card) => card.id === cardId);
    //     if (movedCardIndex === -1) return; // 카드가 존재하지 않는 경우 리턴
    //     const [movedCard] = cards.value.splice(movedCardIndex, 1); // 카드 제거
    //     movedCard.columnId = toColumnId;
    //     const newColumnCards = cards.value.filter((card) => card.columnId === toColumnId);
    //     newColumnCards.splice(toIndex, 0, movedCard);
    //   }
    // };
    // checkMove 함수 정의
    const checkMove = (evt) => {
      console.log(evt.dragged); // 드래그 중인 요소
      console.log(evt.draggedContext); // 드래그 중인 요소의 컨텍스트 정보
      console.log(evt.related); // 드래그된 요소가 드롭될 수 있는 관련 요소
      console.log(evt.relatedContext); // 드래그된 요소가 드롭될 컨텍스트 정보
      // 드래그 가능 여부를 확인하는 로직
      // 예: 드래그하려는 노드가 특정 조건을 만족하는지 확인
      return true; // 모든 드래그를 허용하는 기본 설정
    };

    const folderClick = () => {
      projectId.value = null;
    };

    // 폴더구조에서 프로젝트 아이콘 클릭 시
    const onNodeClick = async (node) => {
      // 파일인지 확인 (children이 없으면 파일)
      if (!node.children || node.children.length === 0) {
        // console.log('파일(프로젝트) 정보:', node);

        // console.log('node.id: ', node.id);

        projectId.value = node.id;
        projectName.value = node.title;
        isProjectLeader.value = node.projectLeaderYN;

        try {
          // 프로젝트 클릭 시 해당 데이터 서버 요청 후 화면 렌더링
          if (isProjectLeader.value) {
            // 컬럼과 카드 데이터 로드
            await kanbanColumnStore.loadColumns(projectId.value);
            await kanbanCardStore.loadAllCards(projectId.value);
            columns.value = kanbanColumnStore.columns;
            cards.value = kanbanCardStore.cards;

            isDataLoaded.value = columns.value.length > 0 && cards.value.length > 0;
          }
        } catch (e) {
          console.error('파일(프로젝트) 정보 로드 실패:', e);
          isDataLoaded.value = false;
        }
      }
    };

    //칸반 카드 오픈
    const openKanbanCard = (idx) => {
      console.log(`칸반카드ID: ${idx}`);
      navigationStore.setActiveItem('mypage');
      router.push('kanbanCard');
    };

    // 프로젝트 생성
    const newProjectPage = () => {
      router.replace('/move-to-move/new-project');
    };

    /* 프로젝트 케밥 메뉴 */
    // ref를 사용하여 상태를 정의합니다.
    const showMenu = ref(false);

    // 케밥 메뉴 토글 메소드
    const toggleMenu = () => {
      showMenu.value = !showMenu.value;
    };

    const closeMenu = () => {
      showMenu.value = false;
    };

    /* 폴더 생성 */
    // 새 폴더 생성 상태 및 이름을 저장할 ref
    const creatingFolder = ref(false);
    const newFolderName = ref('');

    // 폴더 생성 취소
    const cancelNewFolder = () => {
      creatingFolder.value = false;
      newFolderName.value = '';
    };

    // 폴더 생성 완료 시 데이터에 추가
    const addNewFolder = () => {
      if (newFolderName.value.trim()) {
        // const newFolder = {
        //   id: Date.now(),
        //   label: newFolderName.value,
        //   project_info: {},
        //   nodes: [],
        // };
        // folderData.value.push(newFolder);
        // onUpdate(folderData.value); // 데이터 변경을 알림
      }
      cancelNewFolder();
    };

    // 새 폴더 생성 버튼 클릭 시 호출
    const newFolder = () => {
      creatingFolder.value = true;
      newFolderName.value = ''; // 폴더명 초기화
      console.log(creatingFolder.value);
    };

    const onCardMove = (event) => {
      const { oldIndex, newIndex, element } = event;

      if (!element) {
        console.error('Error: moved card data is undefined.');
        return;
      }

      const movedCard = element;

      // 카드가 정상적으로 이동된 경우에만 처리
      if (movedCard && movedCard.columnId !== undefined) {
        // 카드의 이동을 반영
        kanbanCardStore.moveCard(movedCard.columnId, movedCard.columnId, movedCard.id);

        // 필요 시 서버에 카드 이동 사항을 업데이트할 수 있습니다.
        console.log(`Card moved from position ${oldIndex} to ${newIndex}`, movedCard);
      } else {
        console.error('Error: Moved card is invalid or missing columnId.');
      }
    };

    // 컬럼 드래그 앤 드롭 핸들러
    const onColumnDragEnd = ({ oldIndex, newIndex }) => {
      if (oldIndex !== newIndex) {
        kanbanColumnStore.moveColumn(oldIndex, newIndex); // 컬럼 이동 후 상태 저장
        cards.value = kanbanCardStore.cards;

        // 카드 데이터 로그로 출력
        console.log('Updated cards after column move:');
        cards.value.forEach((card) => {
          console.log(`Card ID: ${card.id}, Column ID: ${card.columnId}`);
        });
      }
    };

    // 컬럼별로 필터링된 카드 반환 함수
    const filteredCardsByColumn = (columnId) => {
      if (!cards.value || cards.value.length === 0) return [];
      const filteredCards = cards.value.filter((card) => card.columnId === columnId);

      // 필터링된 카드 확인
      console.log(`Filtered cards for column ${columnId}:`, filteredCards);
      return filteredCards;
    };

    // 카드 열림 확인
    const isCardOpen = ref(false);

    // 카드가 열릴 때 호출
    const openCard = () => {
      isCardOpen.value = true;
    };

    // 카드가 닫힐 때 호출
    const closeCard = () => {
      isCardOpen.value = false;
    };

    return {
      panel,
      folderStore, // Pinia 상태를 바로 사용
      columns, // 칸반 컬럼 데이터
      folderClick,
      checkMove,
      onNodeClick,
      open,
      active,
      openKanbanCard,
      newProjectPage,
      projectId,
      isProjectLeader,
      projectName,
      showMenu,
      toggleMenu,
      closeMenu,
      newFolderName,
      creatingFolder,
      newFolder,
      cancelNewFolder,
      addNewFolder,
      onColumnDragEnd, // 드래그 앤 드랍
      cards,
      filteredCardsByColumn,
      onCardMove,
      isCardOpen,
      openCard,
      closeCard,
      isDataLoaded,
    };
  },
};
</script>

<style scoped>
/* MyPageCompo 스타일 */
.mypage {
  background-color: #f0f8ff;
  border-radius: 8px;
  height: 100%; /* 부모 컨테이너의 고정된 높이를 픽셀 값으로 설정 */
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
  /* height: calc(100% - 20px); 패딩과 상단 여백을 고려한 높이 설정 */
  height: 870px;
}

/* 사이드바 스타일 */
.sidebar {
  width: 300px; /* 사이드바의 고정된 너비 설정 */
  background-color: #ffffff; /* 연한 배경색 */
  border-radius: 10px;
  border: 1.5px solid #6b9e9b;
  height: 98%; /* 부모 폼 높이에 맞게 100%로 설정 */
  padding: 5px;
}

.folder-contains {
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* 패널 전체를 flex로 처리하여 상단과 하단을 분리 */
.panel-flex {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.panel-text {
  flex-grow: 1;
  padding-top: 0; /* 상단 패딩을 없앰 */
  margin-top: 0; /* 상단 마진을 없앰 */
}

.tree-container {
  max-height: 320px; /* 원하는 높이 설정 */
  overflow-y: auto; /* 세로 스크롤 활성화 */
  margin-top: 0; /* 트리 컨테이너에 상단 마진을 없앰 */
  padding-top: 0; /* 트리 컨테이너의 상단 패딩을 없앰 */
}

/* 트리뷰의 인덴트를 줄이기 위한 스타일 */
::v-deep .v-treeview-node__content {
  padding-left: 3px !important; /* 기본 인덴트를 줄임 */
}

.add-buttons {
  display: flex;
  justify-content: center; /* 버튼들을 수평으로 가운데 정렬 */
  gap: 10px; /* 버튼들 사이 간격 */
  margin-top: 20px; /* 트리와 버튼 사이에 여백 추가 */
  margin-bottom: 20px; /* 하단 여백 추가 */
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
  height: 98%; /* 부모 폼 높이에 맞게 100%로 설정 */
  padding: 5px;
}

.project-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 20px;
  font-weight: bold;
  height: 50px;
  /* border-bottom: 1.5px solid #6b9e9b; */
  border-radius: 10px;
  padding: 0 20px;
  margin-top: 5px;
}

.project-name {
  display: inline-block; /* div의 너비가 label의 콘텐츠 길이에 맞게 변경됨 */
  border-bottom: 5px solid;
  border-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="5" viewBox="0 0 100 5"><path fill="none" stroke="%23FFA07A" stroke-width="2" d="M0 5 Q 25 0, 50 5 T 100 5"></path></svg>')
    30 round;
  height: 48px;
}

.project-name label {
  font-size: 35px;
}

.ellipsis {
  cursor: pointer;
}

.project-content {
  display: flex;
  overflow-y: auto; /* 넘치는 경우 가로 스크롤 생성 */
  margin-top: 10px;
  height: 100%;
}

.column {
  flex: 0 0 32.7%; /* 고정된 크기로 각 컬럼을 배치 */
  height: 815px;
  margin-bottom: 3px;
  background: #ffffff;
  border-radius: 10px;
  padding: 10px;
  border: 1px solid #6b9e9b;
}

/* 드래그 중일 때 컬럼의 투명도를 조절하는 스타일 */
.dragging {
  opacity: 0.5; /* 원래 위치에 남아 있는 요소의 투명도 */
}

/* 실제로 드래그 중인 컬럼의 스타일 */
.drag-active {
  opacity: 100%; /* 드래그 중인 컬럼의 투명도를 80%로 설정 */
  transform: scale(1.05); /* 드래그 중인 컬럼을 살짝 확대 */
  border: 2px solid #ff3b3b; /* 드래그 중인 컬럼에 강조된 테두리 적용 */
}

.columns-container {
  display: flex;
  gap: 10px; /* 컬럼 간 간격 유지 */
  overflow-x: auto; /* 넘치는 경우 가로 스크롤 활성화 */
  width: 100%;
  height: 835px;
  padding: 0;
}

/* Deep Selector를 사용하여 Vue3Tree의 내부 스타일을 덮어씁니다. */
::v-deep .custom-node-class {
  margin: 0px;
  padding: 0px;
  font-weight: bold;
  font-size: 14px;
  color: #000;
}

.member {
  height: 390px;
  margin-bottom: 3px;
}

.new-folder {
  display: flex;
  align-items: center;
  gap: 5px;
}

.new-folder input {
  border: 1px solid #ccc;
  padding: 4px;
  border-radius: 4px;
  width: 150px;
  height: 25px;
  font-size: 14px;
}
</style>
