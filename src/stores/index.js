import { createPinia } from 'pinia';
import { NavigationStore } from './navigationStore.js';
import { WebSocketStore } from './webSocketStore.js';
import { MemberStore } from './memberStore.js';

// Pinia 인스턴스 생성
const pinia = createPinia();

export { pinia, NavigationStore, WebSocketStore, MemberStore };
