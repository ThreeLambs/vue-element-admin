import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
  * 侧边栏和路由是绑定在一起的，所以你只有在 @/router/index.js 下面配置对应的路由，侧边栏就能动态的生成了。
 * 大大减轻了手动重复编辑侧边栏的工作量。当然这样就需要在配置路由的时候遵循一些约定的规则

路由分类： constantRoutes 和 asyncRoutes
constantRoutes： 公共路由，如登录页、404、等通用页面
asyncRoutes： 代表那些需求动态判断权限并通过 addRoutes 动态添加的页面

路由配置选项：
 hidden: true // (默认 false) 隐藏菜单项，如401，login等页面，或者如一些编辑页面/edit/1

 //当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 redirect: 'noRedirect'

 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式
 // 只有一个时，会将那个子路由当做根路由显示在侧边栏
 // 若你想不管路由下面的 children 声明的个数都显示你的根路由。你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 alwaysShow: true  根路由总是显示

 name: 'router-name' // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 meta: {
   roles: ['admin', 'editor'] // 角色授权
   pollcy: 'User.Edit' //策略授权
   title: 'title' // 设置该路由在侧边栏和面包屑中展示的名字
   icon: 'svg-name' // 设置该路由的图标，支持 svg-class，也支持 el-icon-x element-ui 的 icon
   noCache: true // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
   breadcrumb: false //  如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
   affix: true // 如果设置为true，它则会固定在tags-view中(默认 false)

   // 当路由设置了该属性，则会高亮相对应的侧边栏。
   // 这在某些场景非常有用，比如：一个文章的列表页路由为：/article/list
   // 点击文章进入文章详情页，这时候路由为/article/1，但你想在侧边栏高亮文章列表的路由，就可以进行如下设置
   activeMenu: '/article/list'
 }
 其它的配置和 vue-router 官方并没有区别，自行查看文档
 */

/**
 * constantRoutes
 * 公共路由，无访问权限要求
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    meta: {
      title: 'Error Pages',
      icon: '404'
    },
    hidden: true,
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: '401', noCache: true },
        hidden: true
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: '404', noCache: true },
        hidden: true
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
