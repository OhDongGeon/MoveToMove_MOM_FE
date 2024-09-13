import { Stomp } from '@stomp/stompjs';
import { defineStore } from 'pinia';
import SockJS from 'sockjs-client';
import axiosInstance from '@/api/axiosInstance';

export const useWebSocketStore = defineStore('webSocket', {
  state: () => ({
    stompClient: null,
    isConnected: false,
    receivedMessages: [], // 수신된 메시지 배열
    projectConnections: {}, // 각 프로젝트별 stompClient 저장
  }),
  actions: {
    // 사용자가 소유하거나 참여 중인 프로젝트 목록 가져오기
    async connectToProject(memberId) {
      try {
        const response = axiosInstance.get(`/api/projects/members/${memberId}`);

        const projectIds = response.data;

        // 각 프로젝트에 대해 WebSocket 연결 설정 및 구독 설정
        projectIds.forEach((projectId) => {
          this.connect(projectId);
        });
      } catch (err) {
        console.error(err);
      }
    },
    connect(projectId) {
      if (this.projectConnections[projectId]) return; // 이미 연결된 경우 무시

      const socket = new SockJS('http://localhost:8080/ws');
      // 배포 시 url 바꾸기
      // const socket = new SockJS('https://move-to-move-mom-fe.vercel.app/ws');
      this.stompClient = Stomp.over(socket);

      // stompClient 연결 설정
      this.stompClient.connect(
        {},
        (frame) => {
          this.isConnected = true;
          console.log(`Connected to project ${projectId}: ` + frame);

          // 프로젝트별 메시지 구독 설정
          this.stompClient.subscribe(`/topic/project/${projectId}`, (message) => {
            this.handleIncomingMessage(projectId, JSON.parse(message.body)); // 메시지 처리
          });

          // 프로젝트별 stompClient 저장
          this.projectConnections[projectId] = this.stompClient;
        },
        (error) => {
          console.error('WebSocket connection error for project ' + projectId + ':', error); // 에러 핸들링 추가
        },
      );
    },
    disconnect() {
      if (this.stompClient !== null) {
        this.stompClient.disconnect();
        this.isConnected = false;
        console.log('WebSocket Disconnected');
      }
    },
    sendMessage(message) {
      if (this.stompClient && this.isConnected) {
        this.stompClient.send('/app/chat.sendMessage', {}, JSON.stringify({ content: message }));
      } else {
        console.error('웹소켓 연결이 끊켰습니다.');
      }
    },
    handleIncomingMessage(projectId, message) {
      console.log(`Received message from project ${projectId}:`, message);

      if (!this.receivedMessages[projectId]) {
        this.receivedMessages[projectId] = []; // 프로젝트별 메시지 배열 초기화
      }

      this.receivedMessages[projectId].push(message); // 프로젝트별 수신된 메시지 저장
    },
  },
});
