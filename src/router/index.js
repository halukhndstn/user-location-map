import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import MapView from '../views/MapView.vue'

import locationsView from '../views/locations/ViewLocation.vue'
import locationsAddView from "../views/locations/AddLocation.vue"
import locationsEditView from "../views/locations/EditLocation.vue"


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    
    {
      path: '/map',
      name: 'map',
      component: MapView
    },
  
    {
      path: '/locations',
      name: 'locations',
      component: locationsView
    },
    {
      path: '/locations/add',
      name: 'locationsAdd',
      component: locationsAddView
    },
    
    {
      path: '/locations/:id/edit',
      name: 'locationsEdit',
      component: locationsEditView
    }
  ]

})

export default router;
