import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/router/views/login'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   name: 'home',
    //   path: '/',
    //   redirect:{name:'login'}
    // },
    {
      name: 'login',
      path: '/',
      component: Login
    }
  ]
})
