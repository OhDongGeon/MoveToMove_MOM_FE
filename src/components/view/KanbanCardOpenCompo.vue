<template>
    <transition name="slide" class="contains">
        <div v-if="isVisible" class="slide-container">
            <div class="header-contains">
                <font-awesome-icon :icon="['fas', 'xmark']" class="close-icon" @click="closeSlide" />

                <div class="title-section">
                    <template v-if="isEditingTitle">
                        <input v-model="modifyTitle" class="card-title card-title-input" />
                        <div class="edit-card-button-group">
                            <round-button-item :width="50" :height="28" :borderRadius="5" :fontSize="12" @click="saveTitle(card.id, 'title', modifyTitle)">저장</round-button-item>
                            <round-button-item :width="50" :height="28" :borderRadius="5" :fontSize="12" :backgroundColor="'cancel'" @click="cancelEdit">취소</round-button-item>
                        </div>
                    </template>
                    <template v-else>
                        <h2 class="card-title">{{ card.title }}</h2>
                        <button class="edit-card-title" @click="editTitle">제목 수정</button>
                    </template>
                </div>

                <div class="info-section">
                    <span class="status-badge">{{ card.columnName }}</span>
                    <!-- <span class="nickname">닉네임</span> -->
                    <span class="title-date">{{ daysDifference }}일 전</span>
                </div>
            </div>

            <div class="underline"></div>

            <div class="content-contains">
                <!-- 왼쪽 이미지 및 텍스트 설명 -->
                <div class="left-content">
                    <div class="card-content">
                        <div class="card-header">
                            <button class="edit-card-content">수정</button>
                        </div>
                        <p>{{ card.content }}</p>
                    </div>

                    <!-- 코멘트 컴포넌트 -->
                    <CardComments :commentList="card.comments" />

                    <!-- 코멘트 작성 컴포넌트 -->
                    <CardCommentForm />
                </div>

                <!-- 세로선 -->
                <div class="vertical-line"></div>

                <!-- 오른쪽 카드 정보 -->
                <div class="right-content">
                    <div class="card-details">
                        <!-- 담당자 선택 -->
                        <div class="assignee-container">
                            <div class="modal-trigger" @click="openModal('담당자 선택', users, 'assigneeModal', true)">
                                <div class="division-member">
                                    <span class="division-name-member">담당자</span>
                                    <div class="assignee-list">
                                        <div class="assignee-info" v-for="member in card.members" :key="member.memberId">
                                            <ProfileImage :src="member.profileUrl" :alt="member.nickName + ' Avatar'" :width="25" :height="25" />
                                            {{ member.nickName }}
                                        </div>
                                    </div>
                                </div>
                                <CardCommonModal
                                    v-show="currentModal === 'assigneeModal'"
                                    :isVisible="true"
                                    :title="modalTitle"
                                    :items="modalItems"
                                    :multiple="true"
                                    @close="closeModal"
                                    @confirm="handleConfirm"
                                    class="modal-position"
                                />
                            </div>
                        </div>

                        <!-- 우선순위 -->
                        <div class="modal-trigger" @click="openModal('우선순위 선택', priorities, 'priorityModal', false)">
                            <div class="division">
                                <span class="division-name">우선순위</span>
                                <span class="priority" :style="priorityStyle">{{ priorityText }}</span>
                            </div>
                            <CardCommonModal
                                v-show="currentModal === 'priorityModal'"
                                :isVisible="true"
                                :title="modalTitle"
                                :items="modalItems"
                                :multiple="false"
                                @close="closeModal"
                                @confirm="handleConfirm"
                                class="modal-position"
                            />
                        </div>

                        <!-- 작업크기 -->
                        <div class="modal-trigger" @click="openModal('작업크기 선택', sizes, 'sizeModal', false)">
                            <div class="division">
                                <span class="division-name">작업크기</span>
                                <span class="size" :style="taskSizeStyle">{{ taskSizeText }}</span>
                            </div>
                            <CardCommonModal
                                :isVisible="currentModal === 'sizeModal'"
                                :title="modalTitle"
                                :items="modalItems"
                                :multiple="false"
                                @close="closeModal"
                                @confirm="handleConfirm"
                                class="modal-position"
                            />
                        </div>

                        <div class="division">
                            <span class="division-name">시작날짜</span>
                            <input type="date" v-model="startAtFormat" class="date-input" />
                        </div>
                        <div class="division">
                            <span class="division-name">종료날짜</span>
                            <input type="date" v-model="endAtFormat" class="date-input" />
                        </div>
                    </div>

                    <div class="delete-button">
                        <round-button-item :width="130" :height="30" :borderRadius="5" :fontSize="12" @click="deleteCard">카드 삭제</round-button-item>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import { ref, computed } from 'vue';
import CardCommonModal from '@/components/common/item/CardCommonModal.vue';
import CardCommentForm from '@/components/common/CardCommentForm.vue';
import CardComments from '@/components/common/CardComments.vue';
import ProfileImage from '@/components/common/item/ProfileImageItem.vue';
import { useKanbanCardStore } from '@/stores/kanbanCardStore';

export default {
    components: {
        CardCommonModal,
        CardCommentForm,
        CardComments,
        ProfileImage,
    },
    props: {
        isVisible: {
            type: Boolean,
            default: false,
        },
        card: {
            type: Object,
            required: true, // 선택된 카드 정보를 받는 prop
        },
    },

    emits: ['closeMenu'],

    setup(props, { emit }) {
        // 닫기
        const closeSlide = () => {
            emit('close');
        };

        // 조회

        // 카드 생성 일자
        const daysDifference = computed(() => {
            const createdAtDate = new Date(props.card.createdAt);
            const currentDate = new Date();

            const timeDifference = currentDate.getTime() - createdAtDate.getTime();
            const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

            return dayDifference;
        });

        // priority
        const priorityText = computed(() => {
            switch (props.card.priority) {
                case '3':
                    return '낮음';
                case '2':
                    return '중간';
                case '1':
                    return '높음';
                case '0':
                    return '긴급';
                default:
                    return '알 수 없음';
            }
        });

        const priorityStyle = computed(() => {
            let backgroundColor;
            let color = '#000000'; // 기본 텍스트 색상
            switch (props.card.priority) {
                case '3': // 낮음
                    backgroundColor = '#9BF09B';
                    break;
                case '2': // 중간
                    backgroundColor = '#9BB8F0';
                    break;
                case '1': // 높음
                    backgroundColor = '#E99BF0';
                    break;
                case '0': // 긴급
                    backgroundColor = '#E45959';
                    color = '#ffffff'; // 긴급일 때 흰색 텍스트
                    break;
                default:
                    backgroundColor = '#e0e0e0'; // 기본 색상
            }
            return { backgroundColor, color };
        });

        // task_size
        const taskSizeText = computed(() => {
            switch (props.card.task_size) {
                case '0':
                    return 'Small';
                case '1':
                    return 'Medium';
                case '2':
                    return 'Large';
                case '3':
                    return 'Extra Large';
                default:
                    return 'Unknown';
            }
        });

        const taskSizeStyle = computed(() => {
            let backgroundColor;
            switch (props.card.task_size) {
                case '0': // Small
                    backgroundColor = '#CEF2CE';
                    break;
                case '1': // Medium
                    backgroundColor = '#CEE0F2';
                    break;
                case '2': // Large
                    backgroundColor = '#E0CEF2';
                    break;
                case '3': // Extra Large
                    backgroundColor = '#F2CECE';
                    break;
                default:
                    backgroundColor = '#e0e0e0'; // 기본 색상
            }
            return { backgroundColor };
        });

        // 시작 날짜
        const startAtFormat = computed({
            get() {
                return props.card.startAt.split('T')[0]; // "T"를 기준으로 문자열을 나눠서 날짜 부분만 가져옴
            },
            // set(newValue) {
            //   // 사용자가 날짜를 변경하면 기존의 "T00:00:00"을 추가하여 처리
            //   emit('update:startAt', `${newValue}T00:00:00`);
            // },
        });

        // 종료 날짜
        const endAtFormat = computed({
            get() {
                return props.card.startAt.split('T')[0]; // "T"를 기준으로 문자열을 나눠서 날짜 부분만 가져옴
            },
        });

        // 저장 및 수정
        const modifyTitle = ref('');
        const isEditingTitle = ref(false);
        const kanbanCardStore = useKanbanCardStore();

        // 제목 수정
        const editTitle = () => {
            modifyTitle.value = props.card.title;
            isEditingTitle.value = true;
        };

        // 제목 저장
        const saveTitle = (cardId, updateColumn, updateData) => {
            kanbanCardStore.updateKanbanCardTitle(cardId, updateColumn, updateData);
            isEditingTitle.value = false;
        };

        // 제목 취소
        const cancelEdit = () => {
            modifyTitle.value = props.card.title;
            isEditingTitle.value = false;
        };

        const defaultAvatar = 'https://over-clock-s3.s3.ap-northeast-2.amazonaws.com//img/40066ef4-ccce-424b-9ac1-d89ab31a1650.ea42ce6a.png';
        const modalTitle = ref('');
        const modalItems = ref([]);
        const currentModal = ref('');
        const isMultiple = ref(false); // 다중 선택 여부를 위한 변수 추가

        const assignee = ref({
            selectedAssignees: [
                {
                    name: '팬텀',
                    avatar: 'https://over-clock-s3.s3.ap-northeast-2.amazonaws.com//img/60409475-953c-4658-8fb4-7807c0c379a0.jpg',
                },
                {
                    name: '팬텀',
                    avatar: 'https://over-clock-s3.s3.ap-northeast-2.amazonaws.com//img/60409475-953c-4658-8fb4-7807c0c379a0.jpg',
                },
            ], // 여러 명의 담당자를 저장
            priority: '중간',
            size: 'Large',
            startDate: '2024-08-13',
            endDate: '2024-08-23',
        });

        const users = ref([
            { id: 1, name: '팬텀', avatar: 'https://over-clock-s3.s3.ap-northeast-2.amazonaws.com//img/60409475-953c-4658-8fb4-7807c0c379a0.jpg' },
            { id: 2, name: '오동나무', avatar: 'https://over-clock-s3.s3.ap-northeast-2.amazonaws.com//img/5e56fa91-f87d-4f4b-86f0-c46d5cbaace4.png' },
            { id: 3, name: '백제신라고구려', avatar: 'https://over-clock-s3.s3.ap-northeast-2.amazonaws.com//img/5e56fa91-f87d-4f4b-86f0-c46d5cbaace4.png' },
            { id: 4, name: '은나라금나라', avatar: 'https://over-clock-s3.s3.ap-northeast-2.amazonaws.com//img/5e56fa91-f87d-4f4b-86f0-c46d5cbaace4.png' },
        ]);

        const priorities = ref([
            { id: 1, name: '낮음', avatar: 'https://via.placeholder.com/30' },
            { id: 2, name: '중간', avatar: 'https://via.placeholder.com/30' },
            { id: 3, name: '높음', avatar: 'https://via.placeholder.com/30' },
            { id: 4, name: '긴급', avatar: 'https://via.placeholder.com/30' },
        ]);

        const sizes = ref([
            { id: 1, name: 'Small', avatar: 'https://via.placeholder.com/30' },
            { id: 2, name: 'Medium', avatar: 'https://via.placeholder.com/30' },
            { id: 3, name: 'Large', avatar: 'https://via.placeholder.com/30' },
            { id: 4, name: 'Extra Large', avatar: 'https://via.placeholder.com/30' },
        ]);

        const openModal = (title, items, modalId, multiple) => {
            modalTitle.value = title;
            modalItems.value = items.map((item) => ({
                ...item,
                selected:
                    modalId === 'assigneeModal'
                        ? assignee.value.selectedAssignees.some((assignee) => assignee.id === item.id)
                        : item.name === assignee.value.priority || item.name === assignee.value.size,
            }));
            currentModal.value = modalId;
            isMultiple.value = multiple; // multiple 값을 설정
        };

        const closeModal = () => {
            currentModal.value = '';
        };

        const handleConfirm = (selectedItems) => {
            console.log('선택된 항목:', selectedItems);
            if (modalTitle.value === '담당자 선택') {
                // 여러 명의 담당자를 선택하도록 수정
                assignee.value.selectedAssignees = selectedItems.map((item) => ({
                    id: item.id,
                    name: item.name,
                    avatar: item.avatar,
                }));
            } else if (modalTitle.value === '우선순위 선택') {
                assignee.value.priority = selectedItems[0]?.name; // 첫 번째 선택된 항목만 저장
            } else if (modalTitle.value === '작업크기 선택') {
                assignee.value.size = selectedItems[0]?.name; // 첫 번째 선택된 항목만 저장
            }
            closeModal();
        };

        const deleteCard = () => {
            console.log('카드가 삭제되었습니다');
        };

        return {
            daysDifference,
            priorityText,
            priorityStyle,
            taskSizeText,
            taskSizeStyle,
            startAtFormat,
            endAtFormat,

            modifyTitle,
            editTitle,
            isEditingTitle,

            defaultAvatar,
            closeSlide,
            assignee,
            modalTitle,
            modalItems,
            users,
            priorities,
            sizes,
            openModal,
            closeModal,
            handleConfirm,
            deleteCard,
            currentModal,
            isMultiple, // isMultiple을 반환하여 사용 가능하도록 설정
            saveTitle,
            cancelEdit,
        };
    },
};
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.5s ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(100%);
}

.slide-enter-to,
.slide-leave-from {
    transform: translateX(0);
}

.contains {
    background: #ffffff;
    border-radius: 10px;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.3);
    border: 1.5px solid #6b9e9b;
}

/* 슬라이드의 기본 스타일 */
.slide-container {
    position: fixed;
    bottom: 0;
    right: 0;
    margin-top: 109px;
    width: 60%;
    height: 88.1%;
    z-index: 1000;
    overflow-y: auto;
}

/* 타이틀 */
.header-contains {
    position: relative;
    padding: 10px;
}

.close-icon {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 20px;
    color: #d63f3f;
    cursor: pointer;
}

.title-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
}

.card-title {
    height: 35px;
    font-size: 24px;
    font-weight: bold;
    margin: 0;
    color: #000;
}

.card-title-input {
    font-size: 19px;
    width: 70%;
    padding: 5px;
    border-radius: 10px;
    border: 1.5px solid #6b9e9b;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    outline: none;
}

.edit-card-title {
    border: none;
    color: #a0a0a0;
    cursor: pointer;
    font-size: 14px;
}

.edit-card-button-group {
    display: flex;
    gap: 5px;
}

.info-section {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 5px;
    font-weight: bolder;
}

.status-badge {
    background: #6b9e9b;
    color: white;
    padding: 2px 10px;
    border-radius: 10px;
    font-size: 10px;
}

.nickname {
    font-size: 14px;
    color: #000;
}

.title-date {
    font-size: 10px;
    color: #a0a0a0;
}

.underline {
    width: 100%;
    margin: 10px auto auto auto;
    border-bottom: 2px solid #6b9e9b;
}

.vertical-line {
    width: 2px;
    background-color: #6b9e9b;
    margin: 0 15px;
}

/* 내용 */
.content-contains {
    display: flex;
    align-items: stretch;
}

/* 왼쪽 내용 */
.left-content {
    width: 70%;
    padding: 15px;
}

.card-content {
    overflow: hidden;
}

.edit-card-content {
    color: white;
    border: 1px solid #ffffff;
    padding: 2px 10px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 12px;
}

.edit-card-content:hover {
    background-color: white;
    color: #6b9e9b;
}

.card-header {
    display: flex;
    height: 35px;
    padding: 0 10px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    justify-content: flex-end;
    align-items: center;
    background-color: #6b9e9b;
}

.card-content p {
    height: 300px;
    padding: 10px;
    margin-bottom: 30px;
    font-size: 15px;
    text-align: justify;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    background-color: white;
    border: 1.5px solid #6b9e9b;
}

/* 오른쪽 내용 */
.right-content {
    width: 30%;
    padding: 15px;
}

.card-details {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-height: 205px;
    border-radius: 5px;
    background-color: white;
    border: 1px solid #6b9e9b;
}

.division,
.division-member {
    display: flex;
    align-items: center;
    margin-left: 20px;
    margin-bottom: 15px;
}

.division-member {
    align-items: flex-start;
}

.division-name,
.division-name-member {
    font-size: 17px;
    font-weight: bold;
    width: 100px;
    text-align: left;
}

.division-name-member {
    margin-top: 5px;
}

/* 이미지 */
.avatar {
    width: 25px;
    height: 25px;
    margin-right: 15px;
    border-radius: 50%;
    border: 1.5px solid #6b9e9b;
}

/* 담당자 */
.assignee-container {
    display: flex;
    width: 100%;
}

.assignee-list {
    display: flex;
    flex-direction: column;
}

.assignee-info {
    display: flex;
    align-items: center;
    padding: 4px 8px;
    border-radius: 8px;
}

/* 우선순위 */
.priority {
    padding: 2px 10px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: bold;
    background-color: #9bb8f0;
    border: 1.5px solid #6b9e9b;
}

/* 작업크기 */
.size {
    padding: 2px 10px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: bold;
    background-color: #e0cef2;
    border: 1.5px solid #6b9e9b;
}

/* 날짜 */
.date {
    font-weight: bold;
    padding: 4px 8px;
}

/* 모달 */
.modal-trigger {
    position: relative;
    width: 100%;
    cursor: pointer;
}

.modal-position {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    border: 2px solid #6b9e9b;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    padding: 10px;
}

/* 삭제 */
.delete-button {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
}
</style>
