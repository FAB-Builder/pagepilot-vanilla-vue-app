import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '../components/Layout.vue'
import ComingSoon from '../components/ComingSoon.vue'
import HomeView from '../views/HomeView.vue'
import { PAGES_DEFAULT } from '../views/pages/subModules'

// Every route below that isn't yet ported points at ComingSoon so nav never
// 404s mid-rollout; each is swapped for its real view as that phase lands.
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        { path: '', component: HomeView },
        {
          path: 'tours',
          component: ComingSoon,
          props: { title: 'Tours', description: 'Step-by-step guided walkthroughs that highlight parts of your UI.' },
        },
        {
          path: 'demos',
          component: ComingSoon,
          props: { title: 'Demos', description: 'Interactive product demos embedded into your pages.' },
        },
        {
          path: 'tooltips',
          component: ComingSoon,
          props: { title: 'Tooltips', description: 'Contextual hints attached to individual elements.' },
        },
        // Pages module — redirects to its first sub-module
        { path: 'pages', redirect: PAGES_DEFAULT },
        {
          path: 'pages/fetch-pages',
          component: ComingSoon,
          props: { title: 'Fetch Pages', description: 'Fetch published pages from the Page Pilot content API.' },
        },
        {
          path: 'pages/template-variables',
          component: ComingSoon,
          props: { title: 'Create a Template', description: 'Author reusable page templates with template variables.' },
        },
        {
          path: 'pages/link-page-to-menu',
          component: ComingSoon,
          props: { title: 'Link a Page to a Menu', description: 'Attach a fetched page to a Context Help Menu item.' },
        },
        {
          path: 'pages/editor-css',
          component: ComingSoon,
          props: { title: 'Editor Block CSS', description: 'Reference CSS classes used by the Page Pilot editor blocks.' },
        },
        {
          path: 'pages/external-sections',
          component: ComingSoon,
          props: { title: 'External Sections', description: 'Embed externally-hosted sections inside a Page Pilot page.' },
        },
        {
          path: 'context-help-menu',
          component: ComingSoon,
          props: { title: 'Context Help Menu', description: 'A right-anchored help drawer driven by a Page Pilot menu.' },
        },
        {
          path: 'webinar',
          component: ComingSoon,
          props: { title: 'Webinar', description: 'Embed live sessions, calendars, and countdowns in your product.' },
        },
        {
          path: 'forms',
          component: ComingSoon,
          props: { title: 'Forms', description: 'Build and embed custom forms using the Form Builder.' },
        },
        {
          path: 'app-banner',
          component: ComingSoon,
          props: { title: 'App Banner', description: 'Render announcement banners into your app by identifier.' },
        },
        // Unknown slug → send the user back home
        { path: ':pathMatch(.*)*', redirect: '/' },
      ],
    },
  ],
})

// Port of React's <ScrollToTop />: reset scroll position on every navigation.
router.afterEach(() => {
  document.querySelector('main')?.scrollTo({ top: 0, behavior: 'instant' })
})

export default router
