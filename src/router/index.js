import Vue from 'vue'
import VueRouter from 'vue-router'
import ProdiIndex from '../views/prodi/Index.vue';

Vue.use(VueRouter)

  const routes = [
  {
    path:'/prodi',
    name:'prodi.index',
    component:ProdiIndex
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
