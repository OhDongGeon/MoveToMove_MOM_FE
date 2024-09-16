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

  // 메시지 핸들러 정의
  const messageHandlers = {
    async columnMove(projectId, message) {
      try {
        await kanbanColumnStore.loadColumns(projectId);
        await kanbanCardsStore.loadAllCards(projectId);
        console.log(`Columns reloaded successfully. type : ${message.type}`);
      } catch (error) {
        console.error("Failed to reload columns:", error);
      }
    },
    async cardMoveWithinColumn(projectId, message) {
      try {
        await kanbanCardsStore.loadAllCards(projectId);
        console.log(`Cards reloaded successfully after moving within column. type: ${message.type}`);
      } catch (error) {
        console.error("Failed to reload cards:", error);
      }
    },
    // 새로운 메시지 유형 핸들러 추가 가능
    async anotherMessageTypeHandler(projectId, message) {
      try {
        console.log(`Processing another message type. type: ${message.type}`);
      } catch (error) {
        console.error("Error handling another message type:", error);
      }
    },
  };

  // 수신된 메시지 처리 및 저장 - 여기서 데이터 처리합니다.
  async function handleIncomingMessage(projectId, message) {

    if (!receivedMessages[projectId]) {
      receivedMessages[projectId] = [];
    }

    receivedMessages[projectId].push(message);

    // 메시지 핸들러 호출
    const handler = messageHandlers[message.type];
    if (handler) {
      await handler(projectId, message); // 핸들러 함수 호출
    } else {
      console.warn(`No handler defined for message type: ${message.type}`);
    }
  }

  // 컬럼 이동 시 웹소켓 함수
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
  // 같은 컬럼 내 카드 이동 함수
  async function sendCardMoveWithinColumnMessage(message) {
    const client = projectConnections[message.projectId];
    const isConnected = connectionStatus[message.projectId];

    try {
      await kanbanCardsStore.moveCardWithinColumn(message.cardId, message.columnId, message.newCardSeq);
    } catch (e) {
      console.log('Error while updating database before sending WebSocket message:', e);
    }
    if (client && isConnected) {
      try {
        client.send(
            `/app/project/${message.projectId}/card-move-within-column`,
            {},
            JSON.stringify(message),
        );
        console.log('Card move message sent successfully:', message);
      } catch (error) {
        console.error('Error sending card move message to server:', error);
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
    sendCardMoveWithinColumnMessage
  };
});
