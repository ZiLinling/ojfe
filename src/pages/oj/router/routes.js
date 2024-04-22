import Home from '@oj/views/general/Home.vue'
import Logout from '@oj/views/user/Logout.vue'
import ApplyResetPassword from '@oj/views/user/ApplyResetPassword.vue'
import ResetPassword from '@oj/views/user/ResetPassword.vue'
import UserHome from '@oj/views/user/UserHome.vue'
import About from '@oj/views/help/About.vue'
import FAQ from '@oj/views/help/FAQ.vue'
import NotFound from '@oj/views/general/404.vue'
import ProblemList from '@oj/views/problem/ProblemList.vue'
import Problem from '@oj/views/problem/Problem.vue'


export default [
  {
    name: 'home',
    path: '/',
    meta: {title: 'Home'},
    component: Home
  },
  {
    name: 'logout',
    path: '/logout',
    meta: {title: 'Logout'},
    component: Logout
  },
  {
    name: 'apply-reset-password',
    path: '/apply-reset-password',
    meta: {title: 'Apply Reset Password'},
    component: ApplyResetPassword
  },
  {
    name: 'reset-password',
    path: '/reset-password/:token',
    meta: {title: 'Reset Password'},
    component: ResetPassword
  },
  {
    name: 'user-home',
    path: '/user-home',
    component: UserHome,
    meta: {requiresAuth: true, title: 'User Home'}
  },
  {
    path: '/about',
    name: 'about',
    meta: {title: 'About'},
    component: About
  },
  {
    path: '/faq',
    name: 'faq',
    meta: {title: 'FAQ'},
    component: FAQ
  },
  {
    path: '*',
    meta: {title: '404'},
    component: NotFound
  },
  {
    name: 'problem-list',
    path: '/problem',
    meta: {title: 'Problem List'},
    component: ProblemList
  },
  {
    name: 'problem-details',
    path: '/problem/:problemID',
    meta: {title: 'Problem Details'},
    component: Problem
  },
]

