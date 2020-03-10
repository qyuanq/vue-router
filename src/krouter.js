import Vue from 'vue';
import VueRouter from './kvue-router'
import Home from './components/home';
import About from './components/about';

Vue.use(VueRouter)
export default new VueRouter({
    routes: [
      {
        path: '/',
        name: 'Home',
        component: Home
      },
      {
          path:'/about',
          name:About,
          component:About
      }
    ]
  })
  