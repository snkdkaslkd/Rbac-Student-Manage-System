import { createRouter, createWebHistory } from 'vue-router'

let router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/index.vue'),
      name: 'login',
    },
    {
      path: '/404',
      component: () => import('@/views/404/index.vue'),
      name: '404',
    },

    {
      path: '/',
      component: () => import('@/views/layout/index.vue'),
      name: 'layout',
      redirect: '/home',
      children: [
        {
          path: '/home',
          component: () => import('@/views/home/Home.vue'),
          meta: { title: '首页' },
        },
        {
          path: '/user',
          component: () => import('@/views/user/User.vue'),
          meta: { title: '用户管理' },
        },
        {
          path: '/role',
          component: () => import('@/views/role/Role.vue'),
          meta: { title: '角色管理' },
        },
        {
          path: '/school',
          component: () => import('@/views/student/School.vue'),
          meta: { title: '学校管理' },
        },
        {
          path: '/majors',
          component: () => import('@/views/student/Major.vue'),
          meta: { title: '专业管理' },
        },
        {
          path: '/class',
          component: () => import('@/views/student/Class.vue'),
          meta: { title: '班级管理' },
        },
        {
          path: '/student',
          component: () => import('@/views/student/Students.vue'),
          meta: { title: '学生管理' },
        },
        {
          path: '/student/update/:_id', //_id路由占位符
          component: () =>
            import('@/views/student/components/UpdateStudent.vue'),
          meta: { title: '添加/编辑学生' },
        },
      ],
    },
    {
      // 如果路由地址不匹配则显示404
      path: '/:pathMatch(.*)/',
      redirect: '/404',
      name: 'Any',
    },
  ],
})
export default router
