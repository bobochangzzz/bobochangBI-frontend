export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
    ],
  },
  { name: '欢迎页', path: '/welcome', icon: 'smile', component: './Welcome' },
  {
    name: '管理页',
    path: '/admin',
    icon: 'crown',
    access: 'canAdmin',
    routes: [{ name: '管理页1', path: '/admin/sub-page', component: './Admin' }],
  },
  { icon: 'table', name: '表格页', path: '/list', component: './TableList' },
  { icon: 'user', name: '个人中心', path: '/user/info', component: './User/Info' },
  { path: '/', redirect: '/welcome' },
  { name: '错误页', path: '*', layout: false, component: './404' },
];
