// stores/webSocketStore.js
import { reactive } from 'vue';
import { defineStore } from 'pinia';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {useKanbanColumnStore} from "@/stores/kanbanColumnStore";
import { useKanbanCardStore} from "@/stores/kanbanCardStore";

export const useWebSocketStore = defineStore('webSocket', () => {
  const projectConnections = reactive({}); // 프로젝트별 stompClient 저장
  const connectionStatus = reactive({}); // 프로젝트별 연결 상태 저장
  const receivedMessages = reactive({}); // 수신된 메시지 저장
  const kanbanColumnStore  = useKanbanColumnStore();
  const kanbanCardsStore = useKanbanCardStore();

  // 특정 프로젝트에 대해 WebSocket 연결 설정 및 구독 설정
  function connect(projectId) {
    if (projectConnections[projectId]) {
      console.log(`Already connected to project ${projectId}`);
      return; // 이미 연결된 경우 무시
    }

    const socket = new SockJS('http://localhost:8080/ws'); // 배포 시 URL 변경
    const client = Stomp.over(socket);


    client.connect(
      {},
      (frame) => {
        connectionStatus[projectId] = true;
        console.log(`Connected to project ${projectId}: ` + frame);

        client.subscribe(`/topic/project/${projectId}`, (message) => {
          handleIncomingMessage(projectId, JSON.parse(message.body));
        });

        projectConnections[projectId] = client;
      },
      (error) => {
        connectionStatus[projectId] = false;
        console.error('WebSocket connection error for project ' + projectId + ':', error);
      },
    );
  }

  // 프로젝트별 모든 WebSocket 연결 해제
  function disconnectAll() {
    Object.keys(projectConnections).forEach((projectId) => {
      disconnect(projectId);
    });
  }

  // 특정 프로젝트에 대해 WebSocket 연결 해제
  function disconnect(projectId) {
    const client = projectConnections[projectId];
    if (client) {
      client.disconnect(() => {
        delete projectConnections[projectId];
        connectionStatus[projectId] = false;
        console.log(`WebSocket disconnected for project ${projectId}`);
      });
    }
  }

  // 수신된 메시지 처리 및 저장 - 여기서 데이터 처리합니다.
  async function handleIncomingMessage(projectId, message) {
    console.log(`Received message from project ${projectId}:`, message);

    if (!receivedMessages[projectId]) {
      receivedMessages[projectId] = [];
    }

    receivedMessages[projectId].push(message);

    // 메시지 타입이 'columnMove'인 경우 컬럼 데이터를 다시 로드
    try {
      await kanbanColumnStore.loadColumns(projectId);
      await kanbanCardsStore.loadAllCards(projectId);
      console.log("Columns reloaded successfully.");
    } catch (error) {
      console.error("Failed to reload columns:", error);
    }
  }

  async function sendMessageToProject(message)  {
    const client = projectConnections[message.projectId]; // 해당 프로젝트의 stompClient 가져오기
    const isConnected = connectionStatus[message.projectId]; // 해당 프로젝트의 연결 상태 확인

    // db에 업데이트 하기  컬럼 변경사항
    try {
      await kanbanColumnStore.moveColumn( message.columnId , message.projectId, message.newIndex);
    } catch (e) {
      console.log('Error while updating database before sending WebSocket message:', e);
    }
    if (client && isConnected) {
      try {
        client.send(
          `/app/project/${message.projectId}/column-move`, // 서버의 MessageMapping 경로와 일치해야 함
          {},
          JSON.stringify(message),
        );
        console.log('Message sent successfully:', message);
      } catch (error) {
        console.error('Error sending message to server:', error); // 전송 중 에러를 포착
      }
    } else {
      console.error('WebSocket 연결이 끊켰습니다. 연결 상태:', isConnected, 'stompClient:', client);
    }
  }
  return {
    projectConnections,
    connectionStatus,
    receivedMessages,
    connect,
    disconnect,
    disconnectAll,
    handleIncomingMessage,
    sendMessageToProject,
  };
});
