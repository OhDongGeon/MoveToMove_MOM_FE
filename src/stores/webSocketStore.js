import { Stomp } from '@stomp/stompjs';
import { defineStore } from 'pinia';
import SockJS from 'sockjs-client';

export const useWebSocketStore = defineStore('webSocket', {
  state: () => ({
    stompClient: null,
    isConnected: false,
    receivedMessages: [], // 수신된 메시지 배열
  }),
  actions: {
    connect() {
      if (this.isConnected) return; // 이미 연결된 경우 무시

      const socket = new SockJS('http://localhost:8080/ws');
      this.stompClient = Stomp.over(socket);

      this.stompClient.connect({}, (frame) => {
        this.isConnected = true;
        console.log('Connected: ' + frame);

        // 메시지 구독
        this.stompClient.subscribe('/topic/public', (message) => {
          this.receivedMessages.push(JSON.parse(message.body).content);
        });
      });
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
  },
});
