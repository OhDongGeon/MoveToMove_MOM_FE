import { createApp } from 'vue';
import App from './App.vue';

import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persistedstate';
import router from './router/index';

import RoundButtonItem from './components/common/item/RoundButtonItem.vue';

// Pinia 인스턴스 생성
const pinia = createPinia();
pinia.use(piniaPersist);

// Vuetify 설정
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import 'vuetify/styles'; // Vuetify 스타일 가져오기

// FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(fas, far);

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
  .component('font-awesome-icon', FontAwesomeIcon)
  .component('round-button-item', RoundButtonItem) // RoundButtonItem 컴포넌트 등록
  .mount('#app'); // 애플리케이션을 DOM에 마운트
