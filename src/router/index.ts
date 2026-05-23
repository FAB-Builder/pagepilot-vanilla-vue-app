import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TourView from '../views/TourView.vue'
import TooltipView from '../views/TooltipView.vue'
import AppBannerView from '../views/AppBannerView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/tour', component: TourView },
    { path: '/tooltip', component: TooltipView },
    { path: '/app-banner', component: AppBannerView },
  ],
})

export default router
