import axios from '@/api/axiosInstance';
import { defineStore } from 'pinia';

export const useFolderStore = defineStore('folder', {
  state: () => ({
    folderData: [], // 폴더 데이터를 저장할 배열
  }),
  actions: {
    // axios로 폴더 조회
    async fetchFolders() {
      try {
        const response = await axios.get('/api/folders');
        this.folderData = response.data;
      } catch (error) {
        console.error('폴더 데이터를 가져오는 중 오류 발생', error);
      }
    },

    // 폴더 생성
    async addFolder(newFolder) {
      try {
        const response = await axios.post('/api/folders', newFolder);
        this.folderData.push(response.data); // 폴더 데이터를 업데이트
      } catch (error) {
        console.error('폴더 생성 중 오류 발생', error);
      }
    },
  },
});
