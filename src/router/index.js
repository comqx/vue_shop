import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Welcome from '../components/welcome.vue'
import User from '../components/user/users.vue'
import Role from '../components/role/roles.vue'
import Rights from '../components/role/rights.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login' // 重定向
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome', // 重定向到这个目录
    children: [
      { path: '/welcome', component: Welcome },
      // 用户管理
      { path: '/users', component: User },
      // 权限管理
      { path: '/roles', component: Role },
      { path: '/orders', component: Rights }
      // 商品管理
      // { path: '/orders', component: Rights },
      // { path: '/orders', component: Rights }
    ] // 子路由规则
  }
]

const router = new VueRouter({
  routes
})

// 挂着路由导航首位
router.beforeEach((to, form, next) => {
  // to 将要访问的路径
  // form 代表从哪个路径跳转过来
  // next 是一个函数，表示放行
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
