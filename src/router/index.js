import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/

export const constantRouterMap = [{
  path: '/redirect',
  component: Layout,
  hidden: true,
  children: [{
    path: '/redirect/:path*',
    component: () => import('@/views/redirect/index')
  }]
},
{
  path: '/login',
  component: () => import('@/views/login/index'),
  hidden: true
},
{
  path: '/404',
  component: Layout,
  hidden: true,
  children: [{
    path: '',
    component: () => import('@/views/404')
  }]
},
{
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  children: [{
    path: '/dashboard',
    name: 'Dashboard',
    hidden: false,
    component: () => import('@/views/dashboard/index'),
    meta: {
      title: '首页',
      icon: 'dashboard',
      affix: true
    }
  }]
},
{
  path: '/profile',
  component: Layout,
  redirect: '/profile/index',
  hidden: true,
  children: [
    {
      path: 'index',
      component: () => import('@/views/profile/index'),
      name: '个人中心',
      meta: { title: '个人中心', icon: 'user' }
    }
  ]
},
{
  path: '/article',
  component: Layout,
  hidden: true,
  children: [
    {
      path: 'create',
      component: () => import('@/views/cms/article/create'),
      name: '创建文章',
      meta: { title: '创建文章' }
    },
    {
      path: 'edit/:id(\\d+)',
      component: () => import('@/views/cms/article/edit'),
      name: '编辑文章',
      meta: { title: '编辑文章' }
    },
    {
      path: 'task',
      component: () => import('@/views/cms/article/task'),
      name: '处理文章',
      meta: { title: '处理文章' }
    },
    {
      path: 'info/:id(\\d+)',
      component: () => import('@/views/cms/article/info'),
      name: '查看文章',
      meta: { title: '查看文章' }
    }
  ]
},
{
  path: '/quartz-log',
  component: Layout,
  redirect: '/sys/quartz/loglist',
  hidden: true,
  children: [
    {
      path: '',
      component: () => import('@/views/sys/quartz/loglist'),
      name: '调度日志',
      meta: { title: '调度日志' }
    }
  ]
}
]
export const notFoundRouter = [{
  path: '*',
  redirect: '/404',
  hidden: true
}]
export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})
