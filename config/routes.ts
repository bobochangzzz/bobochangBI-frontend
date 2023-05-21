export default [
  {
    path: '/user',
    layout: false,
    routes: [{ path: '/user/login', name: '登录', component: './User/Login' }],
  },
  { path: '/welcome', name: '欢迎页', icon: 'smile', component: './Welcome' },
  {
    path: '/admin',
    icon: 'crown',
    access: 'canAdmin',
    name: '管理页',
    routes: [
      { path: '/admin', name: '管理界面', redirect: '/admin/sub-page' },
      { path: '/admin/sub-page', name: '管理界面2', component: './Admin' },
    ],
  },
  { icon: 'table', path: '/list', component: './TableList' },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
