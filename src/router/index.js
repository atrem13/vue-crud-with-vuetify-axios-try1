import Vue from 'vue'
import VueRouter from 'vue-router'
import ProdiIndex from '../views/prodi/Index.vue';
import MahasiswaIndex from '../views/mahasiswa/Index.vue';
import RuangIndex from '../views/ruang/Index.vue';

Vue.use(VueRouter)

  const routes = [
  {
    path:'/prodi',
    name:'prodi.index',
    component:ProdiIndex
  },
  {
    path:'/mahasiswa',
    name:'mahasiswa.index',
    component:MahasiswaIndex
  },
  {
    path:'/prodi',
    name:'ruang.index',
    component:RuangIndex
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
