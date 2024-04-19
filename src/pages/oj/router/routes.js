
import Home from '@oj/views/general/Home.vue'
import Logout from '@oj/views/user/Logout.vue'


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
]

