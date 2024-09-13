import axiosInstance from '@/api/axiosInstance';
import { defineStore } from 'pinia';

export const useFolderStore = defineStore('folder', {
  state: () => ({
    folderData: [], // 폴더 데이터를 저장할 배열
  }),
  actions: {
    // axiosInstance 폴더 조회
    async fetchFolders() {
      try {
        const response = await axiosInstance.get('/api/folders');
        this.folderData = response.data.totalFolderProjects;
      } catch (error) {
        console.error('폴더 데이터를 가져오는 중 오류 발생', error);
      }
    },

    // 폴더 생성
    async addNewFolder(newFolder) {
      try {
        const response = await axiosInstance.post('/api/folders', newFolder);

        if (response.data.status === 201) {
          console.log(response.data.message);

          const createdFolder = response.data.data;

          this.folderData.push({
            id: createdFolder.id,
            title: createdFolder.title,
            parentFolderId: createdFolder.parentFolderId || null,
            depth: createdFolder.depth || 1,
            seq: createdFolder.seq || 1,
            projectIds: [],
            children: [],
          });

          // 폴더 데이터를 다시 정렬하여 상태에 반영
          this.folderData = this.sortFoldersAndProjects(this.folderData);
        }
      } catch (error) {
        console.error('폴더 생성 중 오류 발생', error);
      }
    },

    // 폴더와 프로젝트를 구분하여 정렬하는 함수
    sortFoldersAndProjects(data) {
      return data
        .map((folder) => {
          if (folder.children && folder.children.length > 0) {
            // 하위 폴더와 프로젝트를 먼저 재귀적으로 정렬
            folder.children = this.sortFoldersAndProjects(folder.children);
          }
          return folder;
        })
        .sort((a, b) => {
          // 폴더는 seq 기준으로 우선 정렬
          if (a.children && b.children) {
            return a.seq - b.seq;
          }
          // 프로젝트는 title 기준으로 정렬 (children이 없는 경우 프로젝트로 간주)
          if (!a.children && !b.children) {
            return a.title.localeCompare(b.title);
          }
          // 폴더는 프로젝트보다 위에 위치하도록 설정
          return a.children ? -1 : 1;
        });
    },
  },
});
