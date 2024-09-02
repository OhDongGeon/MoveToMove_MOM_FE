import AuthLayout from '../components/layout/AuthLayout.vue';
import MainLayout from '../components/layout/MainLayout.vue';
import MyPage from '../components/view/MyPageCompo.vue';
import KanbanBoard from '../components/view/KanbanBoardCompo.vue';
import Chat from '../components/view/ChatCompo.vue';

const routes = [
  {
    path: '/',
    name: 'Auth',
    component: AuthLayout,
  },
  {
    path: '/move-to-move',
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
];

export default routes;
