import { createApp } from 'vue';
import App from './App.vue';

import { createPinia } from 'pinia';
import router from './router/index';

// Pinia 인스턴스 생성
const pinia = createPinia();

// Vuetify 설정
import { createVuetify } from 'vuetify';
import 'vuetify/styles'; // Vuetify 스타일 가져오기
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Vuetify 인스턴스 생성
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
});

// Vue 애플리케이션 생성 및 Pinia 적용
createApp(App)
  .use(pinia) // Pinia를 애플리케이션에 적용
  .use(vuetify) //vuetify 적용
  .use(router) // router 적용
  .mount('#app'); // 애플리케이션을 DOM에 마운트
