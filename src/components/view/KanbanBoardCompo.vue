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
                            <!-- treeData가 유효할 때만 Vue3Tree를 렌더링 -->
                            <div class="tree-container">
                                <Vue3Tree
                                    :key="data.length"
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
                                        <img :src="require(`../../assets/folders24.svg`)" alt="Folder Icon" width="14" height="14" style="margin-right: 10px" />
                                    </template>
                                    <template #iconInactive>
                                        <font-awesome-icon :icon="['fas', 'folder']" style="margin-right: 10px" />
                                    </template>
                                </Vue3Tree>

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
                <project-member-compo v-if="projectId" class="member"></project-member-compo>
            </aside>
            <main class="main-content">
                <div v-if="projectId" class="kanbanborad">
                    <div class="project-title">
                        <div class="project-name">
                            <label>{{ projectName }}</label>
                        </div>
                        <font-awesome-icon :icon="['fas', 'ellipsis']" ref="menuToggle" @click="toggleMenu" class="ellipsis" />
                        <!-- 케밥 메뉴 -->
                        <KebabProjectMenu :showMenu="showMenu" @closeMenu="closeMenu" isProjectLeader="Y" />
                    </div>
                    <div class="project-content">
                        <!-- 컬럼 기준으로 드래그 앤 드랍 가능하게 설정 -->
                        <draggable v-model="columns" group="columns" @end="onDragEnd" class="columns-container" ghost-class="dragging" drag-class="drag-active">
                            <template v-slot:item="{ element: col }">
                                <div class="column" :data-column-id="col.id">
                                    <kanban-column :id="col.id" :title="col.title" :cards="col.cards" />
                                </div>
                            </template>
                        </draggable>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script>
import { useNavigationStore } from '@/stores/navigationStore';
import { ref } from 'vue'; // Vue의 ref를 가져옵니다.
import { useRouter } from 'vue-router';
import Vue3Tree from 'vue3-tree';
import draggable from 'vuedraggable'; // VueDraggableNext를 import
import 'vue3-tree/dist/style.css';
import KebabProjectMenu from '../common/KebabProjectMenu.vue';
import ProjectMemberCompo from '../common/ProjectMemberCompo.vue';
import KanbanColumn from './KanbanColumnCompo.vue';

export default {
    name: 'KanbanBoard', // 컴포넌트 이름 정의
    components: {
        Vue3Tree, // Tree 컴포넌트 등록
        KanbanColumn,
        ProjectMemberCompo,
        KebabProjectMenu,
        draggable, // 드래그 앤 드랍 컴포넌트 등록
    },
    setup() {
        // ref를 사용하여 상태를 정의합니다.
        const panel = ref([0]); // 첫 번째 패널을 기본적으로 열려 있게 설정
        const navigationStore = useNavigationStore(); // Pinia store 사용

        // 프로젝트 아이디 변수
        const projectId = ref('');

        // 프로젝트 리더 유무 변수
        const isProjectLeader = ref('');

        // 프로젝트 명
        const projectName = ref('');

        const router = useRouter();
        const searchText = ref('');
        const onNodeExpanded = (node, state) => {
            console.log('state: ', state);
            console.log('node: ', node);
        };

        const onUpdate = (nodes) => {
            console.log('nodes:', nodes);
            console.log('트리 데이터가 업데이트되었습니다.', nodes);
            data.value = [...nodes]; // 변경된 데이터로 업데이트
        };

        const onNodeClick = (node) => {
            projectId.value = node.project_info.projectId;
            projectName.value = node.project_info.projectName;
            isProjectLeader.value = node.project_info.projectLeader;

            console.log('projectId: ', projectId);
            console.log('isProjectLeader: ', isProjectLeader);
            console.log('projectName: ', projectName);

            console.log(node);
        };

        // 드래그 앤 드랍
        const onDragEnd = (colId) => {
            console.log('드래그 종료', colId);
            // 드래그 종료 후 상태 업데이트 또는 API 호출 등 추가 처리
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
                const newFolder = {
                    id: Date.now(),
                    label: newFolderName.value,
                    project_info: {},
                    nodes: [],
                };
                data.value.push(newFolder);
                onUpdate(data.value); // 데이터 변경을 알림
            }
            cancelNewFolder();
        };

        // 새 폴더 생성 버튼 클릭 시 호출
        const newFolder = () => {
            creatingFolder.value = true;
            newFolderName.value = ''; // 폴더명 초기화
            console.log(creatingFolder.value);
        };

        /* 데이터 바인딩 */
        // 폴더 데이터
        const data = ref([
            {
                id: 1,
                label: '나만의 폴더',
                project_info: {},
                nodes: [
                    {
                        id: 2,
                        label: '사이드 프로젝트',
                        project_info: {},
                        nodes: [
                            {
                                id: 4,
                                label: '프로젝트 1',
                                project_info: {
                                    projectId: 4,
                                    projectName: '프로젝트 1',
                                    description: '프로젝트 1',
                                    startDate: '2022-01-01',
                                    endDate: '2022-02-28',
                                    projectLeader: 'Y',
                                },
                            },
                            {
                                id: 5,
                                label: '프로젝트 2',
                                project_info: {
                                    projectId: 5,
                                    projectName: '프로젝트 2',
                                    description: '프로젝트 2',
                                    startDate: '2022-01-01',
                                    endDate: '2022-02-28',
                                    projectLeader: 'N',
                                },
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
                        priority: '긴급',
                        task_size: 'Extra Large',
                        members: [
                            {
                                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent('니가필요해')}&background=random`,
                            },
                            {
                                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent('이제알았어')}&background=random`,
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
                                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent('다거짓말')}&background=random`,
                            },
                            {
                                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent('알러뷰')}&background=random`,
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
                                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent('사랑해')}&background=random`,
                            },
                            {
                                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent('청소기')}&background=random`,
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
                                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent('안녕')}&background=random`,
                            },
                            {
                                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent('친구들')}&background=random`,
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
                                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent('뽀')}&background=random`,
                            },
                            {
                                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent('나나')}&background=random`,
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
                        priority: '높음',
                        task_size: 'Large',
                        members: [
                            {
                                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent('뚜비')}&background=random`,
                            },
                            {
                                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent('보라돌이')}&background=random`,
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
                        priority: '낮음',
                        task_size: 'Small',
                        members: [
                            {
                                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent('나나')}&background=random`,
                            },
                            {
                                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent('하하하')}&background=random`,
                            },
                        ],
                    },
                ],
            },
        ]);

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
            projectId,
            isProjectLeader,
            projectName,
            showMenu,
            toggleMenu,
            closeMenu,
            creatingFolder,
            newFolderName,
            newFolder,
            cancelNewFolder,
            addNewFolder,
            onDragEnd, // 드래그 앤 드랍
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
    width: 270px; /* 사이드바의 고정된 너비 설정 */
    background-color: #ffffff; /* 연한 배경색 */
    border-radius: 10px;
    border: 1.5px solid #6b9e9b;
    height: 100%; /* 부모 폼 높이에 맞게 100%로 설정 */
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
    margin-top: 0; /* 트리 컨테이너에 상단 마진을 없앰 */
    padding-top: 0; /* 트리 컨테이너의 상단 패딩을 없앰 */
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
    height: 100%; /* 부모 폼 높이에 맞게 100%로 설정 */
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
    overflow-x: auto; /* 넘치는 경우 가로 스크롤 생성 */
    gap: 10px; /* 컬럼들 사이의 간격 */
    margin-top: 10px;
    height: 92%;

    /* 웹킷 기반 브라우저 (크롬, 사파리 등)에서 스크롤바 크기 조정 */
    ::-webkit-scrollbar {
        width: 0px;
    }
}

.column {
    flex: 0 0 32.7%; /* 고정된 크기로 각 컬럼을 배치 */
    height: 830px;
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
}

/* Deep Selector를 사용하여 Vue3Tree의 내부 스타일을 덮어씁니다. */
::v-deep .custom-node-class {
    margin: 0px;
    padding: 0px;
    font-weight: bold;
    font-size: 14px;
    color: #5a6d8c;
}

.member {
    min-height: 390px;
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
