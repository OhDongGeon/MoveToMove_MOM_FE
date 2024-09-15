import { defineStore } from 'pinia';

export const useProjectStore = defineStore('project', {
  state: () => ({
    // 프로젝트를 데이터를 저장할 객체
    projectData: {
      projectId: null,
      projectName: '',
      projectDescription: '',
      startAt: null,
      endAt: null,
      projectLeaderYN: 'N',
      type: '',
      createdAt: null,
      deletedAt: null,
    },
  }),
  actions: {
    // 프로젝트 데이터 설정
    setProjectData(project) {
      this.projectData = { ...project }; // 프로젝트 데이터를 객체로 저장
    },
    clearProjectData() {
      this.projectData = {
        projectId: null,
        projectName: '',
        projectDescription: '',
        startAt: null,
        endAt: null,
        projectLeaderYN: 'N',
        type: '',
        createdAt: null,
        deletedAt: null,
      }; // 프로젝트 데이터를 초기화
    },
    // 프로젝트 팀장 변경
    changeProjectLeader(projectId) {
      this.projectData.projectLeaderYN = projectId === this.projectData.projectId ? false : true; // 팀장 ID와 현재 프로젝트 ID가 일치하면 'N'으로, 아니면 'Y'로 변경
    },
  },
});
