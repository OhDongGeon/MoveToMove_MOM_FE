import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';

// Pinia 인스턴스 생성
const pinia = createPinia();

// Vue 애플리케이션 생성 및 Pinia 적용
createApp(App)
  .use(pinia) // Pinia를 애플리케이션에 적용
  .mount('#app'); // 애플리케이션을 DOM에 마운트