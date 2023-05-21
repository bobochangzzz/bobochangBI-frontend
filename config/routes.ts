export default [
  { path: '/user', layout: false, routes: [{ path: '/user/login', component: './User/Login' }] },
  { name: '欢迎页', path: '/welcome', icon: 'smile', component: './Welcome' },
  {
    name: '管理页',
    path: '/admin',
    icon: 'crown',
    access: 'canAdmin',
    routes: [{ name: '管理页1', path: '/admin/sub-page', component: './Admin' }],
  },
  { icon: 'table', name: '表格页', path: '/list', component: './TableList' },
  { path: '/', redirect: '/welcome' },
  { name: '错误页', path: '*', layout: false, component: './404' },
];
