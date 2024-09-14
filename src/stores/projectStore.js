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
  },
});
