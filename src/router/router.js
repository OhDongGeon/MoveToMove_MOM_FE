import AuthLayout from '../components/layout/AuthLayout.vue';
import MainLayout from '../components/layout/MainLayout.vue';
import MyPage from '../components/view/MyPageCompo.vue';
import KanbanBoard from '../components/view/KanbanBoardCompo.vue';
import Chat from '../components/view/ChatCompo.vue';

const routes = [
  {
    path: '/auth',
    name: 'Auth',
    component: AuthLayout,
  },
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: 'mypage',
        name: 'MyPageCompo',
        component: MyPage,
      },
      {
        path: 'kanban',
        name: 'KanbanBoardCompo',
        component: KanbanBoard,
      },
      {
        path: 'chat',
        name: 'ChatCompo',
        component: Chat,
      },
    ],
  },
  // 기본 경로가 '/'인 경우에도 /auth로 리디렉션
  {
    path: '/',
    redirect: '/auth',
  },
];

export default routes;
