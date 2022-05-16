

import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { 
    path: '/', 
    redirect: '/home'
  },
  { 
    path: '/home', 
    component: () => import('@/views/home/index.vue') 
  },
  { 
    path: '/edges-geo', 
    component: () => import('@/views/edges-geo/index.vue')  
  },
  { 
    path: '/random-city', 
    component: () => import('@/views/random-city/index.vue')  
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

