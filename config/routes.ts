export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
    ],
  },
  { icon: 'smile', name: '欢迎页', path: '/welcome', component: './Welcome' },
  { icon: 'barChart', name: '智能分析', path: '/chart', component: './Chart' },
  { icon: 'user', name: '个人中心', path: '/user/info', component: './User/Info' },
  { path: '/', redirect: '/welcome' },
  { name: '错误页', path: '*', layout: false, component: './404' },
];
